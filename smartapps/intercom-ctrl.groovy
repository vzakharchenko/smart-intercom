/**
 *  remote-ctrl-gsm
 *
 *  Copyright 2021 Vasyl Zakharchenko
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */
definition(
        name: "intercom-app",
        namespace: "vzakharchenko",
        author: "Vasyl Zakharchenko",
        description: "Smart app Intercom ",
        category: "My Apps",
        iconUrl: "http://watchdog.com.ua/uploads/shop/products/main/4d3c1306ede9799d3eaf2ce3afb006d3.jpg",
        iconX2Url: "http://watchdog.com.ua/uploads/shop/products/main/4d3c1306ede9799d3eaf2ce3afb006d3.jpg",
        iconX3Url: "http://watchdog.com.ua/uploads/shop/products/main/4d3c1306ede9799d3eaf2ce3afb006d3.jpg")


preferences {
    section("Setup my server with this IP") {
        input "IP", "text", multiple: false, required: true
    }
    section("Setup my server with this IP") {
        input "deviceIp", "text", multiple: false, required: true
    }
    section("Setup my device with this server Port") {
        input "serverPort", "number", multiple: false, required: true
    }
    section("Setup my device with this Smartthings Port") {
        input "port", "number", multiple: false, required: true
    }
    section("Setup my devices with smartthings hub (optional)") {
        input "hub", "capability.hub", multiple: false, required: false
    }
    section("Setup my devices without cloud") {
        input(name: "withoutCloud", type: 'bool', required: false, defaultValue:false)
    }
}

def installed() {
    createAccessToken()
    getToken()
    initialize()
}

def updated() {
    log.debug "Updated with settings: ${settings}"

    unsubscribe()
    initialize()
}

def getToken() {
    if (!state.accessToken) {
        try {
            getAccessToken()
            debug("Creating new Access Token: $state.accessToken")
        } catch (ex) {
            debug(ex)
        }
    }
}

def initialize() {
    debug("initialization");
    def intercomDevice = getAllDevicesById("intercom");

    if (intercomDevice == null) {
        debug("adding device");
        intercomDevice = addChildDevice("vzakharchenko", "Intercom Action", "intercom", null, [label: "intercom", name: "intercom"])
        debug(" device added");
    }
    debug("subscribe");
    subscribe(intercomDevice, "switch.on", deviceHandler);
    intercomDevice.markDeviceOnline()
    intercomDevice.forceOff();
    if (hub){
        apiServerHubGet("/registerDevice?appId=${app.id}&secret=${state.accessToken}&label=${intercomDevice.label}&deviceIp=${deviceIp}",null)
    } else {
        apiServerGet("/registerDevice?appId=${app.id}&secret=${state.accessToken}&label=${intercomDevice.label}&deviceIp=${deviceIp}");
    }
}

mappings {
    path("/smartapp/check") {
        action:
        [
                GET: "init"
        ]
    }
}

def init() {
    updateState();
    return [status: "ok", useCloud: withoutCloud == null || !withoutCloud]
}

//def handlerOnline() {
//    def timeout = 1000 * 60 * 20;
//    def curTime = new Date().getTime();
//    getAllDevices().each {
//        def activeDate = state.lastcheck;
//        if ((curTime - timeout) > activeDate) {
//            it.markDeviceOffline();
//            debug("offline ${curTime - timeout} > ${activeDate} ")
//        } else {
//            it.markDeviceOnline();
//            debug("online  ${curTime - timeout} < ${activeDate} ")
//        }
//    }
//}

def updateState(){
    state.lastcheck = new Date().getTime();
// state.lastcheck = 0;
}

def phevDevices() {
    updateState();
    def deviceList = [];
    def devices = getAllDevices().each {
        deviceList.push([id: it.getDeviceNetworkId(), label: it.label ])
    }
    return [devices: deviceList]
}


def phevGetStatusDevices() {
    updateState();
    handlerOnline();
    def deviceList = [];
    def devices = getAllDevices().each {
        def st = it.currentState("switch");
        debug("switch "+st)
        deviceList.push([id: it.getDeviceNetworkId(), label: it.label, status: st  ])
    }
    return [devices: deviceList]
}

def updateDevice() {
    updateState();
    handlerOnline();
    def json = request.JSON;
    debug("update device "+json)
    def presentDevice = getAllDevicesById(json.id)
    presentDevice.update(json.value)
    if (json.value2){
        presentDevice.update2(json.value2)
        presentDevice.updateall(json.value,json.value2)
    }

    return [status: "ok"]
}




def getAllDevicesById(id) {
    updateState();
    def device;
    def devices = getAllDevices().each {
        if (it.getDeviceNetworkId() == id) {
            device = it;
        }
    }
    return device;
}

def getAllDevices() {
    return childDevices;
}


def deviceHandler(evt) {
    if (withoutCloud != null && withoutCloud){
        return;
    }
    if (hub){
        apiHubGet("/${app.id}/${state.accessToken}/execute",null)
    } else {
        apiGet("/${app.id}/${state.accessToken}/execute");
    }
}

def apiGet(path) {
    def url = "http://${IP}:${port}";
    debug("request:  ${url}${path}");
    httpGet(uri: "${url}${path}");
}

def apiHubGet(path, query) {
    def url = "${IP}:${port}";
    debug("request:  ${url}${path} query= ${query}")
    def result = new physicalgraph.device.HubAction(
            method: 'GET',
            path: path,
            headers: [
                    HOST  : url,
                    Accept: "*/*"
            ],
            query: query
    )

    return sendHubCommand(result)
}


def apiServerGet(path) {
    def url = "http://${IP}:${serverPort}";
    debug("request:  ${url}${path}");
    httpGet(uri: "${url}${path}");
}

def apiServerHubGet(path, query) {
    def url = "${IP}:${serverPort}";
    debug("request:  ${url}${path} query= ${query}")
    def result = new physicalgraph.device.HubAction(
            method: 'GET',
            path: path,
            headers: [
                    HOST  : url,
                    Accept: "*/*"
            ],
            query: query
    )

    return sendHubCommand(result)
}


def debug(message) {
    def debug = true;
    if (debug) {
        log.debug message
    }
}
