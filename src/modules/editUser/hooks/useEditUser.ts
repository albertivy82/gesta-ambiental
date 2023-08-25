import { useState } from "react"
import { senhasType } from "../../../shared/types/senhasType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { getUserId } from "../../../context/userStore";
import { getToken } from "../../../context/tokenStore";

export const useEditUser = () =>{

       
    const [senhaNova, setSenhaNova] = useState<senhasType>(
        {
            senhaAtual:'',
            novaSenha:'',
        }
    );

    
    
        const editUser = async () => {
           
            const id = await getUserId();
            console.log(id, senhaNova);
            const resultBack = await connectionAPIPut(`http://192.168.100.28:8080/usuario/alterar-senha/${id}`, senhaNova);
            
        };
    
    
    
    const handleOnChangeInput = (
        event: NativeSyntheticEvent<TextInputChangeEventData>, 
        name: string,
    )=>{
        setSenhaNova((currentSenha)=>({
            ...currentSenha,
            [name]: event.nativeEvent.text,
        }));
    };

    return{
        senhaNova,
        handleOnChangeInput,
        editUser,
    }
};