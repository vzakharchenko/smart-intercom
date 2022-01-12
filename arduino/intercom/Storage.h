#include <EEPROM.h>

class Storage
{
  private:

    typedef struct
    {
      byte package;
      int storageVersion;
    } ConfigurationVersion;

    typedef struct
    {
      byte package;
      int storageVersion;
      int  gpio;
      int gpioStateOn;
      int gpioStateOff;
      int gpioTimeout;
      char signature[3];
    } Configuration104;


    Configuration104 configuration {
      13,
      104,
      16,
      1,
      0,
      30,
      "OK"
    };

  protected:
    void storeStruct(void *data_source, size_t size)
    {
      EEPROM.begin(size * 2);
      for (size_t i = 0; i < size; i++)
      {
        char data = ((char *)data_source)[i];
        EEPROM.write(i, data);
      }
      EEPROM.commit();
      EEPROM.end();
    }

    void loadStruct(void *data_dest, size_t size)
    {
      EEPROM.begin(size * 2);
      for (size_t i = 0; i < size; i++)
      {
        char data = EEPROM.read(i);
        ((char *)data_dest)[i] = data;
      }
      EEPROM.end();
    }
  public:

    Storage() {

    }

    void save() {
      storeStruct(&configuration, sizeof(configuration));
    }

    void load() {
      Serial.println ( "start loading storage..." );


      boolean packageVersion = 0;
      loadStruct(&packageVersion,  1);
      Serial.println ( "package version " + String(packageVersion) );
      if (packageVersion = 13) {
        ConfigurationVersion configurationVersion;
        loadStruct(&configurationVersion, sizeof(configurationVersion));
        int storageVersion = configurationVersion.storageVersion;
        Serial.println ( "storage version " + String(storageVersion) );


        Configuration104 readConfiguration {
          13,
          104,
          16,
          1,
          0,
          30,
          "BD"
        };
        loadStruct(&readConfiguration, sizeof(readConfiguration));
        Serial.println ( "Storage loaded" );
        if (String(readConfiguration.signature) == String("OK")) {
          Serial.println ( "Configuration is Valid: " + String(readConfiguration.signature) + " gpio: " + String(readConfiguration.gpio));
          this->configuration = readConfiguration;
        } else {
          Serial.println ( "Configuration inValid: " + String(readConfiguration.signature));
        }
      } else {
        Serial.println ( "Configuration inValid: Package " + String(packageVersion) + " is not supported!" );
      }

    }

    byte getPackageVersion() {
      return configuration.package;
    }

    int getGpio() {
      return configuration.gpio;
    }

    void setGpio(int gpio) {
      configuration.gpio = gpio;
    }


    int getGpioStateOn() {
      return configuration.gpioStateOn;
    }

    void setGpioStateOn(int state) {
      configuration.gpioStateOn = state;
    }


    int getGpioStateOff() {
      return configuration.gpioStateOff;
    }

    void setGpioStateOff(int state) {
      configuration.gpioStateOff = state;
    }



    int getGpioTimeout() {
      return configuration.gpioTimeout;
    }



    void setGpioTimeout(int gpioTimeout) {
      configuration.gpioTimeout = gpioTimeout;
    }

    String getGpioState() {
      if (configuration.gpioStateOn == 1) {
        return "HIGH";
      } else {
        return "LOW";
      }
    }

    bool isValid() {
      return String(configuration.signature) == String("OK");
    }

};
