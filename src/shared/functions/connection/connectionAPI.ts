import axios, { AxiosRequestConfig } from "axios";
import { MethodEnum } from "../../../enums/methods.enum";
import { getToken } from "../../../context/tokenStore";
import { errorCase } from "./errorCase";

export type MethodType = 'get'|'post'|'put'|'delete';


export default class ConnectionAPI {

        static async call<T>(url:string, method:MethodType, body?: unknown): Promise<T>{
          const token = await getToken();
          
          const config: AxiosRequestConfig = {
              headers:{
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/jason',
              }
          }

          const config2: AxiosRequestConfig = {
            headers:{
              Authorization: `Bearer ${token}`
            }
        }


            switch (method){
                case MethodEnum.GET:
                case MethodEnum.DELETE:
                    return (await axios[method]<T>(url, config2)).data;
                case MethodEnum.POST:
                case MethodEnum.PUT:
                default:
                    return (await axios[method]<T>(url, body, config2)).data;
            }

        }

        static async connect<T>(url:string, method:MethodType, body?: unknown): Promise<T>{
            return this.call<T>(url, method, body).catch((error)=>{
                if (error.response) {
                  return errorCase(error);
                  }
                  throw new Error("ERROR_NETWORK");
                });
        }
}

export const connectionAPIGet = async <T>(url: string): Promise<T> => {
    return ConnectionAPI.connect(url, MethodEnum.GET);
  };
  
  export const connectionAPIDelete = async <T>(url: string): Promise<T> => {
    return ConnectionAPI.connect(url, MethodEnum.DELETE);
  };
  
  export const connectionAPIPost = async <T, B = unknown>(url: string, body: B): Promise<T> => {
    return ConnectionAPI.connect(url, MethodEnum.POST, body);
  };
  
  export const connectionAPIPut = async <T, B = unknown>(url: string, body?: B): Promise<T> => {
    return ConnectionAPI.connect(url, MethodEnum.PUT, body);
  };
  
  