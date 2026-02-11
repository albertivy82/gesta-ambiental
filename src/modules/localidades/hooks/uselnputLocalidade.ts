import { useState, useEffect } from "react"
import { senhasType } from "../../../shared/types/senhasType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { connectionAPIGet, connectionAPIPost} from "../../../shared/functions/connection/connectionAPI";
import { getToken } from "../../../context/tokenStore";
import { localidadeInputType } from "../../../shared/types/localidadeInputType ";
import { municipiosEnum } from "../../../enums/municipios.enum";
import { EsferaEnum } from "../../../enums/esfera.enum";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { salvarLocalidade } from "../../../realm/services/localidadeServices";


export const DEFAUL_LOCALIDADE_INPUT = {
      nome:'',
      municipio: null,
      esfera: null,
};

export const useEditUser = () =>{

       
  const [novaLocalidade, setNovaLocalidade] = useState<localidadeInputType>(DEFAUL_LOCALIDADE_INPUT);
  const [disabled, setDisabled] = useState<boolean>(true)
  
  useEffect(()=>{
      if(
        novaLocalidade.nome !== ''&&
        novaLocalidade.municipio !==null &&
        novaLocalidade.esfera !==null

      ){
        setDisabled(false)
      }else(true);
    },[novaLocalidade]);  


        const editLocalidade = async () => {
           
            const localidade = await connectionAPIPost('http://192.168.100.28:8080/localidade', novaLocalidade) as LocalidadeType;
                if (localidade && localidade.id) {
                   fetchLocalidadeAPI(localidade.id);
                }
            
        };


        const fetchLocalidadeAPI = async(id:number) =>{
            
          try{
            const response = await connectionAPIGet<LocalidadeType>(`http://192.168.100.28:8080/localidade/${id}`);
              await salvarLocalidade(response);
          } catch (error) {
              //console.error("CONTAGEM DE BENFEITORIAS-ERRO!!!:", error);
              throw error;
          }
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

          const handleEsferaChange = (esfera: EsferaEnum | "" | null) => {
            setNovaLocalidade((currentesfera) => ({
              ...currentesfera,
              esfera: esfera,
            }));
          };

    return{
    novaLocalidade,
    handleOnChangeInput,
    handleMunicipioChange,
    handleEsferaChange,
    editLocalidade,
    disabled,
    }
};