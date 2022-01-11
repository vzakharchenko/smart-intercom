import fetch, { Method } from 'axios';

fetch.interceptors.response.use((response:any) => response, (error:any) => error);

export async function fetchData(url:string, method:Method = 'GET', headers?:any) {
  const ret = await fetch({
    url,
    method,
    headers,
    transformResponse: (req:any) => req,
    withCredentials: true,
    timeout: 29000,
  });
  return ret;
}

export async function sendData(url:string, method:Method = 'POST', data:string, headers?:any) {
  const ret = await fetch({
    url,
    method,
    data,
    transformResponse: (req:any) => req,
    headers,
    withCredentials: true,
    timeout: 29000,
  });
  return ret;
}
