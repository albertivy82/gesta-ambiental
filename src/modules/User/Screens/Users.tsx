import { useEffect, useRef, useState } from 'react';
import { Button, TextInput } from "react-native";
import { GetaUserContainer } from "../styles/Users.style";
import { useInputUsers } from "../hooks/useInputUsers";
import Input from "../../../shared/components/input/input";
import { UserBody } from '../../../shared/types/userBody';
import { RouteProp, useRoute } from '@react-navigation/native';


export interface userParam{
      user: UserBody;
}



const User= () =>{
const {params} = useRoute<RouteProp<Record<string, userParam>>>();
const user = params ? params.user : null;

console.log(user);

const [dadosUsuarioEditado, setDadosUsuarioEditado] = useState<UserBody>();
const {sendUser, novoUsuario, handleOnChangeInput, disabled, UpdateUser} = useInputUsers();

      const nomeInput = useRef<TextInput>(null);
      const matriculaInput = useRef<TextInput>(null);
      const emailInput = useRef<TextInput>(null);
      const cpfInput = useRef<TextInput>(null);
      const senhaInput = useRef<TextInput>(null);


      useEffect(() => {
            if (user) {
              setDadosUsuarioEditado(user);
            }
          }, [user]);
          
          useEffect(() => {
            if (dadosUsuarioEditado) {
              nomeInput.current?.setNativeProps({ text: dadosUsuarioEditado.nome });
              matriculaInput.current?.setNativeProps({ text: dadosUsuarioEditado.matricula });
              emailInput.current?.setNativeProps({ text: dadosUsuarioEditado.email });
              cpfInput.current?.setNativeProps({ text: dadosUsuarioEditado.cpf });
            }
          }, [dadosUsuarioEditado]);
      
       
      const enviar = async ()=>{
            if(user){
                  await UpdateUser(user.id);
            }else{ 
                  await sendUser();
            }
           
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
                  ref={cpfInput}/>
                  
                  
                  <Button title="enviar" disabled={disabled} onPress={enviar}/>
            </GetaUserContainer>
      );

};

export default User;

