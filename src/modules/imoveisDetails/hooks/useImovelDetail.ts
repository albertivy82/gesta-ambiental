import { connectionAPIDelete } from "../../../shared/functions/connection/connectionAPI";

export const hookImovel=()=>{

    const DeleteImovel = async (id:string)=>{
        await connectionAPIDelete(`http://192.168.100.28:8080/imovel/${id}`);
    }

}