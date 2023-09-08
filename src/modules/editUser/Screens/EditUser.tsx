import { View, TextInput, Button } from "react-native";
import { EditUserContainer } from "../styles/EditUser.style";
import { useEditUser } from "../hooks/useEditUser";
import { useRef } from "react";
import Input from "../../../shared/components/input/input";

const EditUser = () =>{

    const {senhaNova, handleOnChangeInput, editUser, disabled} = useEditUser();

    const SenhaAtualInput = useRef<TextInput>(null);
    const senhaNovaInput = useRef<TextInput>(null);

    const handleEnviar = async () => {
      await editUser();
      
  };

    return(
        <EditUserContainer>


              <Input 
                   value={senhaNova.senhaAtual} 
                   onChange={(event)=> handleOnChangeInput(event, 'senhaAtual')}
                   margin="0px 0px 16px 0px"
                   placeholder="Digite sua senha atual"
                   title="Senha Atual:"
                   onSubmitEditing={()=>senhaNovaInput.current?.focus()}
                   ref={SenhaAtualInput}
              />

               <Input 
                   value={senhaNova.novaSenha} 
                   onChange={(event)=> handleOnChangeInput(event, 'novaSenha')}
                   margin="0px 0px 16px 0px"
                   placeholder="Digite a nova senha"
                   title="Senha Atual:"
                  ref={senhaNovaInput}
              />

              <Button title="enviar" onPress={handleEnviar} />
        </EditUserContainer>
  );

};

export default EditUser;