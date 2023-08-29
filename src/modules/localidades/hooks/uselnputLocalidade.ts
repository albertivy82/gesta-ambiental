import { useState } from "react"
import { senhasType } from "../../../shared/types/senhasType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { connectionAPIPost} from "../../../shared/functions/connection/connectionAPI";
import { getUserId } from "../../../context/userStore";
import { getToken } from "../../../context/tokenStore";
import { localidadeType } from "../../../shared/types/localidadeType ";
import { municipiosEnum } from "../../../enums/municipios.enum";

export const useEditUser = () =>{

       
    const [novaLocalidade, setNovaLocalidade] = useState<localidadeType>(
        {
            nome:'',
            municipio: null,
        }
    );

    
    
        const editLocalidade = async () => {
           
            const localidade = await connectionAPIPost('http://192.168.100.28:8080/localidade', novaLocalidade);
            
        };
    
    
    
        const handleOnChangeInput = (
            event: NativeSyntheticEvent<TextInputChangeEventData>,
            name: string
          ) => {
            //event.persist(); // Manter o evento sintético
            setNovaLocalidade((currentLocalidade) => ({
              ...currentLocalidade,
              [name]: event.nativeEvent.text,
            }));
          };
        
          const handleMunicipioChange = (municipio: municipiosEnum | "" | null) => {
            setNovaLocalidade((currentLocalidade) => ({
              ...currentLocalidade,
              municipio: municipio,
            }));
          };

    return{
    novaLocalidade,
    handleOnChangeInput,
    handleMunicipioChange,
    editLocalidade,
    }
};