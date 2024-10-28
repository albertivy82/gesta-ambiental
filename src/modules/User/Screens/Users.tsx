import { useEffect, useRef, useState } from 'react';
import { Button, TextInput, View } from "react-native";
import { GetaUserContainer } from "../styles/Users.style";
import { useInputUsers } from "../hooks/useInputUsers";
import Input from "../../../shared/components/input/input";
import { UserBody } from '../../../shared/types/userBody';
import { RouteProp, useRoute } from '@react-navigation/native';
import { theme } from '../../../shared/themes/theme';
import { grupoEnum } from '../../../enums/grupo.enum';
import { Picker } from '@react-native-picker/picker';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';



export interface userParam{
      user: UserBody;
}



const User= () =>{
const {params} = useRoute<RouteProp<Record<string, userParam>>>();
const user = params ? params.user : null;
const [dadosUsuarioEditado, setDadosUsuarioEditado] = useState<UserBody>();
const {sendUser, 
      novoUsuario, 
      handleOnChangeInput, 
      disabled, 
      UpdateUser, 
      handleGrupoChange,
     } = useInputUsers();

      const nomeInput = useRef<TextInput>(null);
      const matriculaInput = useRef<TextInput>(null);
      const emailInput = useRef<TextInput>(null);
      const cpfInput = useRef<TextInput>(null);
      


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
      
      const grupoOptions = Object.values(grupoEnum);
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

                 <Text
                        type={textTypes.SUB_TITLE_BOLD}
                        color={theme.colors.mainTheme.black}
                        margin="0px 0px 8px 0px">
                        Perfil:
                 </Text>

                 <View style={{ marginBottom: 20, backgroundColor: "#FFFFFF", borderRadius: 8 }}>
                        <Picker
                              selectedValue={novoUsuario.grupo}
                              onValueChange={(value) => handleGrupoChange(value)}
                              style={{ color: theme.colors.mainTheme.black }}
                              dropdownIconColor={"#000000"}
                        >
                              <Picker.Item label="Selecione um Perfil" color={"#000000"} value="" />
                              {grupoOptions.map(grupo => (
                                    <Picker.Item key={grupo} label={grupo} value={grupo} />
                              ))}
                        </Picker>
                </View>

                  
                  
                  <Button title="enviar" disabled={disabled} onPress={enviar} color={"#ff4500"}/>
            </GetaUserContainer>
      );

};

export default User;

