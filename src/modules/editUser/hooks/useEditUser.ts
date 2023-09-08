import { useEffect, useState } from "react"
import { senhasType } from "../../../shared/types/senhasType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { getUser } from "../../../context/userStore";

export const DEFAULT_EDIT_PASSWORD = {
    senhaAtual:'',
    novaSenha:'',
};



export const useEditUser = () =>{


    const [disabled, setDisabled] = useState<boolean>(true);
     const [senhaNova, setSenhaNova] = useState<senhasType>(DEFAULT_EDIT_PASSWORD);

     useEffect(()=>{

        if(

            senhaNova.senhaAtual !== '' &&
            senhaNova.novaSenha !== ''
        ) {
            setDisabled(false)
        }else{
            setDisabled(true)
        }

    }, [senhaNova]);
    
        const editUser = async () => {
           
            const userString = await getUser();
            
            if (userString) {
                const user = JSON.parse(userString);
                const id = user.id;

           const resultBack = await connectionAPIPut(`http://192.168.100.28:8080/usuario/alterar-senha/${id}`, senhaNova);
            }
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
        disabled,
    }
};