import { connectionAPIDelete } from "../../../shared/functions/connection/connectionAPI";

export const hookImovel=()=>{

    const DeleteImovel = async (id:string)=>{
        await connectionAPIDelete(`http://177.74.56.24/imovel/${id}`);
    }

}