import { View, TextInput, Button } from "react-native";
import { EditUserContainer } from "../styles/Localidade.style";
import { useEditUser } from "../hooks/uselnputLocalidade";
import { municipiosEnum } from "../../../enums/municipios.enum";
import { useDeferredValue } from "react";
import { Picker } from "@react-native-picker/picker";
import Input from "../../../shared/components/input/input";
import { theme } from "../../../shared/themes/theme";

const Localidade = () =>{

    const {novaLocalidade, handleOnChangeInput, handleMunicipioChange, editLocalidade} = useEditUser();

    const handleEnviar = async () => {
      await editLocalidade();
      
  };


  const minicipioOptions = Object.values(municipiosEnum);

    return(
        <EditUserContainer>
              <Input 
              value={novaLocalidade.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              placeholder="senha Atual"/>

        <Picker
          selectedValue={novaLocalidade.municipio}
          onValueChange={(value) => handleMunicipioChange(value)}
        >
          <Picker.Item label="Selecione um município" color="blue" value="" />
          {minicipioOptions.map(municipio => (
            <Picker.Item key={municipio} label={municipio} value={municipio} />
          ))}
        </Picker>
              
              <Button title="enviar" onPress={handleEnviar} />
        </EditUserContainer>
  );

};

export default Localidade;