import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { grupoEnum } from "../../../enums/grupo.enum";
import { removeSpecialCharacters } from "../../../shared/functions/characters";
import { connectionAPIPost, connectionAPIPut } from "../../../shared/functions/connection/connectionAPI";
import { validateCpf } from "../../../shared/functions/cpf";
import { UserInput } from "../../../shared/types/userInput";


export const DEFAULT_CREATE_USER = {
    nome: '',
    matricula: '',
    email: '',
    cpf: '',
    grupo: null,
};


const formatUserData = (user: UserInput) => {
    user.cpf = removeSpecialCharacters(user.cpf);
  
    const grupoIdMapping = {
      'ADMINISTRADOR': 1,
      'USUARIO': 2,
    };
  
    const grupoId = user.grupo ? grupoIdMapping[user.grupo] : 0;
  
    const grupoSelecionado = {
      id: grupoId
    };
  
    return {
      nome: user.nome,
      matricula: user.matricula,
      email: user.email,
      cpf: user.cpf,
      grupo: grupoSelecionado
    };
  };
  

  
  

export const useInputUsers = ()=>{
     const navigation = useNavigation<NavigationProp<ParamListBase>>();
     const [disabled, setDisabled] = useState<boolean>(true);
     const [novoUsuario, setUsuario] = useState<UserInput>(DEFAULT_CREATE_USER);
          


    useEffect(()=>{

        if(

            novoUsuario.nome !== '' &&
            novoUsuario.matricula !== '' &&
            novoUsuario.email !== '' &&
            validateCpf(novoUsuario.cpf) &&
            novoUsuario.grupo !== null

        ) {
            setDisabled(false)
        }else{
            setDisabled(true)
        }

    }, [novoUsuario]);





    const sendUser = async ()=>{
                
        const formattedUser = formatUserData(novoUsuario);

        try{
            const response: Response = await connectionAPIPost('http://177.74.56.24/usuario', formattedUser);
            navigation.navigate('Users');
        } catch (error) {
          throw error;
        }
    };

    const UpdateUser = async (id:number)=>{
        
        const formattedUser = formatUserData(novoUsuario);
        try{
            const response: Response = await connectionAPIPut(`http://177.74.56.24/usuario/${id}`, formattedUser);
            navigation.navigate('Users');
         } catch (error) {
           throw error;
         }
    }


    const handleOnChangeInput = (
        value: NativeSyntheticEvent<TextInputChangeEventData> | string,
        name: string
      ) => {
        const newValue = typeof value === 'string' ? value : value.nativeEvent?.text || '';
      
        setUsuario((currentUser) => ({
          ...currentUser,
          [name]: newValue,
        }));
      };
      

    const handleGrupoChange = (grupo: grupoEnum | "" | null) => {

                   
        setUsuario((currentGrupo) => ({
              ...currentGrupo,
                grupo: grupo,
            }));
    };


    return{
        handleOnChangeInput,
        novoUsuario,
        sendUser,
        disabled,
        UpdateUser,
        handleGrupoChange,
        
    }


};

