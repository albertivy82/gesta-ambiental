import { useEffect, useState } from "react";
import { UserBody } from "../../../shared/types/userBody";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { current } from "@reduxjs/toolkit";
import { UserInput } from "../../../shared/types/userInput";
import { connectionAPIPost } from "../../../shared/functions/connection/connectionAPI";
import { isertMaskInCpf, validateCpf } from "../../../shared/functions/cpf";
import { insertMaskInMatricula } from "../../../shared/functions/matricula";
import { removeSpecialCharacters } from "../../../shared/functions/characters";
/*
export const DEFAULT_CREATE_USER = {
    nome: '',
    matricula: '',
    email: '',
    cpf: '',
    senha: '',
};

export const useInputUsers = ()=>{
        //inserir navegação nesses hooks
     const [disabled, setDisabled] = useState<boolean>(true);
     const [novoUsuario, setUsuario] = useState<UserInput>(DEFAULT_CREATE_USER);

    useEffect(()=>{

        if(

            novoUsuario.nome !== '' &&
            novoUsuario.matricula !== '' &&
            novoUsuario.email !== '' &&
            validateCpf(novoUsuario.cpf) &&
            novoUsuario.senha !== ''

        ) {
            setDisabled(false)
        }else{
            setDisabled(true)
        }

    }, [novoUsuario]);

    const sendUser = async ()=>{
        novoUsuario.cpf = removeSpecialCharacters(novoUsuario.cpf);
        
        const usuario = await connectionAPIPost('http://192.168.100.28:8080/usuario', novoUsuario);
        console.log(usuario);
    }


    const handleOnChangeInput = (
        event: NativeSyntheticEvent<TextInputChangeEventData>,
        name: string
        ) =>{
           // event.persist();
            setUsuario((currentUser)=>({
            ...currentUser,
            [name]: event.nativeEvent.text,
            }));
        };


    return{
        handleOnChangeInput,
        novoUsuario,
        sendUser,
        disabled,
    }


};
*/
