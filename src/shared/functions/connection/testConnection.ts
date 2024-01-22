import { connectionAPIGet } from "./connectionAPI";

export const testConnection = async () => {
    try {
        await connectionAPIGet(`http://192.168.100.28:8080/health`);
        return true; 
    } catch (error) {
        return false;
    }
};
