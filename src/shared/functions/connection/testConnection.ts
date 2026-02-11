import { connectionAPIGet } from "./connectionAPI";

export const testConnection = async (timeout = 4000): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
  
      const response = await fetch("http://192.168.100.28:8080/health", {
        method: "GET",
        signal: controller.signal,
      });
  
      clearTimeout(timeoutId);
  
      return response.ok;
    } catch (error) {
      return false;
    }
  };
  
