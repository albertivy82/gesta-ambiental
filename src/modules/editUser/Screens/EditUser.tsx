import { View, TextInput, Button } from "react-native";
import { EditUserContainer } from "../styles/EditUser.style";
import { useEditUser } from "../hooks/useEditUser";

const EditUser = () =>{

    const {senhaNova, handleOnChangeInput, editUser} = useEditUser();

    const handleEnviar = async () => {
      await editUser();
      
  };

    return(
        <EditUserContainer>
              <TextInput 
              value={senhaNova.senhaAtual} 
              onChange={(event)=> handleOnChangeInput(event, 'senhaAtual')}
              underlineColorAndroid={'black'} 
              placeholderTextColor={'black'} 
              placeholder="senha Atual"/>

              <TextInput 
              value={senhaNova.novaSenha} 
              onChange={(event)=> handleOnChangeInput(event, 'novaSenha')} 
              underlineColorAndroid={'black'} 
              placeholderTextColor={'black'} 
              placeholder="Nova Senha"/>
              
              
              <Button title="enviar" onPress={handleEnviar} />
        </EditUserContainer>
  );

};

export default EditUser;