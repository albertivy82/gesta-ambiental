import { useRef } from "react";
import { Button, TextInput } from "react-native";
import Input from "../../../shared/components/input/input";
import { useEditUser } from "../hooks/useEditUser";
import { EditUserContainer } from "../styles/EditUser.style";

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
                   title="Nova Senha:"
                   ref={senhaNovaInput}
              />

              <Button title="enviar" disabled={disabled} onPress={handleEnviar} color={"#ff4500"} />
        </EditUserContainer>
  );

};

export default EditUser;