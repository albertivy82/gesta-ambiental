import { View, TextInput, Button } from "react-native";
import { EditUserContainer } from "../styles/Localidade.style";
import { useEditUser } from "../hooks/uselnputLocalidade";
import { municipiosEnum } from "../../../enums/municipios.enum";
import { useDeferredValue } from "react";
import { Picker } from "@react-native-picker/picker";

const Localidade = () =>{

    const {novaLocalidade, handleOnChangeInput, handleMunicipioChange, editUser} = useEditUser();

    const handleEnviar = async () => {
      await editUser();
      
  };


  const minicipioOptions = Object.values(municipiosEnum);

    return(
        <EditUserContainer>
              <TextInput 
              value={novaLocalidade.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              underlineColorAndroid={'black'} 
              placeholderTextColor={'black'} 
              placeholder="senha Atual"/>

        <Picker
          selectedValue={novaLocalidade.municipio}
          onValueChange={(value) => handleMunicipioChange(value)}
        >
          <Picker.Item label="Selecione um município" value="" />
          {minicipioOptions.map(municipio => (
            <Picker.Item key={municipio} label={municipio} value={municipio} />
          ))}
        </Picker>
              
              <Button title="enviar" onPress={handleEnviar} />
        </EditUserContainer>
  );

};

export default Localidade;