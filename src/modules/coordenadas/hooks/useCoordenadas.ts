import { useEffect, useState } from "react"
import { senhasType } from "../../../shared/types/senhasType";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { getUser } from "../../../context/userStore";
import { coordenadasInput } from "../../../shared/types/coordenadaInput";

export const DEFAULT_COORDENADAS = {
    latitude:'',
    longitude:'',
    localidade:{
        id: 0,
    },
};



export const useCoordenadas = () =>{


    const [disabled, setDisabled] = useState<boolean>(true);
     const [coordenadaNova, setCoordenadaNova] = useState<coordenadasInput>(DEFAULT_COORDENADAS);

     useEffect(()=>{

        if(

            coordenadaNova.latitude !== '' &&
            coordenadaNova.longitude !== ''
        ) {
            setDisabled(false)
        }else{
            setDisabled(true)
        }

    }, [coordenadaNova]);
    
        const registrarCoordenada = async (localidadeId: number) => {

            coordenadaNova.localidade.id = localidadeId;

            console.log(coordenadaNova)
           
            const resultBack = await connectionAPIPost(`http://192.168.100.28:8080/coordenada`, coordenadaNova);
            
        };


        const atualizarCoordenada = async (coordenadaId: number) => {

           const resultBack = await connectionAPIPut(`http://192.168.100.28:8080/coordenada/${coordenadaId}`, coordenadaNova);
            
        };
    
    
    
    const handleOnChangeInput = (
        event: NativeSyntheticEvent<TextInputChangeEventData>, 
        name: string,
    )=>{
        setCoordenadaNova((currentCoordenada)=>({
            ...currentCoordenada,
            [name]: event.nativeEvent.text,
        }));
    };

    return{
        coordenadaNova,
        handleOnChangeInput,
        setCoordenadaNova,
        registrarCoordenada,
        atualizarCoordenada,
        disabled,
    }
};