import { useRef } from 'react';
import { Button, TextInput } from "react-native";
import { GetaUserContainer } from "../styles/Users.style";
import { useInputUsers } from "../hooks/useInputUsers";
import Input from "../../../shared/components/input/input";

const User= () =>{

      const {sendUser, novoUsuario, handleOnChangeInput, disabled} = useInputUsers();

      const nomeInput = useRef<TextInput>(null);
      const matriculaInput = useRef<TextInput>(null);
      const emailInput = useRef<TextInput>(null);
      const cpfInput = useRef<TextInput>(null);
      const senhaInput = useRef<TextInput>(null);

      const enviar = async ()=>{
            await sendUser();
      }
      

      return(
            <GetaUserContainer>
                  <Input 
                   value={novoUsuario.nome} 
                   onChange={(event)=> handleOnChangeInput(event, 'nome')}
                   margin="0px 0px 16px 0px"
                   placeholder="Digite nome completo do técnico"
                   title="Nome:"
                   onSubmitEditing={()=>matriculaInput.current?.focus()}
                   ref={nomeInput}/>

                  <Input
                  value={novoUsuario.matricula} 
                  onChange={(event)=> handleOnChangeInput(event, 'matricula')}
                  margin="0px 0px 16px 0px"
                  type="matricula"
                  placeholder="matricula"
                  title="Matrícula:"
                  keyboardType='number-pad'
                  onSubmitEditing={()=>emailInput.current?.focus()}
                  ref={matriculaInput}/>
                  
                  <Input 
                  value={novoUsuario.email} 
                  onChange={(event)=> handleOnChangeInput(event, 'email')}
                  margin="0px 0px 16px 0px" 
                  placeholder="informe o e-mail do técnico"
                  title="E-mail:"
                  keyboardType='email-address'
                  onSubmitEditing={()=>cpfInput.current?.focus()}
                  ref={emailInput}/>

                  <Input 
                  value={novoUsuario.cpf} 
                  onChange={(event)=> handleOnChangeInput(event, 'cpf')}
                  margin="0px 0px 16px 0px"
                  type="cpf"
                  placeholder="Digite apenas números"
                  title="CPF:"
                  keyboardType='number-pad'
                  onSubmitEditing={()=>senhaInput.current?.focus()}
                  ref={cpfInput}/>
                  
                  <Input 
                  value={novoUsuario.senha} 
                  onChange={(event)=> handleOnChangeInput(event, 'senha')}
                  margin="0px 0px 16px 0px"
                  placeholder="senhainforme uma senha"
                  title="Senha:"
                  ref={senhaInput}/>

                  <Button title="enviar" disabled={disabled} onPress={enviar}/>
            </GetaUserContainer>
      );

};

export default User;

//interessnate criar um arqui para url como ela faz: ver aula57
//userBody é o meu retorno
//const resultBack = await connectionAPIGet<UserBody>('http://192.168.100.28:8080/usuario')