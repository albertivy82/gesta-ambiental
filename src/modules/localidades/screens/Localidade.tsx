import { View, TextInput, Button } from "react-native";
import { EditUserContainer } from "../styles/Localidade.style";
import { useEditUser } from "../hooks/uselnputLocalidade";
import { municipiosEnum } from "../../../enums/municipios.enum";
import { useDeferredValue } from "react";
import { Picker } from "@react-native-picker/picker";
import Input from "../../../shared/components/input/input";
import { theme } from "../../../shared/themes/theme";
import { EsferaEnum } from "../../../enums/esfera.enum";

const Localidade = () =>{

    const {novaLocalidade, handleOnChangeInput, handleMunicipioChange, editLocalidade, handleEsferaChange, disabled} = useEditUser();

    const handleEnviar = async () => {
      await editLocalidade();
      
  };


  const municipioOptions = Object.values(municipiosEnum);
  const esferaOptions = Object.values(EsferaEnum);

    return(
        <EditUserContainer>
              <Input 
              value={novaLocalidade.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              placeholder="Informe o nome da localidade"
              margin="0px 0px 16px 0px"
              title="Localidade:"/>
        
        <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.blueTheme.blue }}>
            <Picker
              selectedValue={novaLocalidade.municipio}
              onValueChange={(value) => handleMunicipioChange(value)}>
                  <Picker.Item label="Selecione um município" color="blue" value="" />
                        {municipioOptions.map(municipio => (
                          <Picker.Item key={municipio} label={municipio} value={municipio} />
                        ))}
              </Picker>
          </View> 

          <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.blueTheme.blue}}>
            <Picker
              selectedValue={novaLocalidade.esfera}
              onValueChange={(value) => handleEsferaChange(value)}
            >
                <Picker.Item label="Selecione a esfera de criação" color="blue" value=""/>
                        {esferaOptions.map(esfera => (
                          <Picker.Item key={esfera} label={esfera} value={esfera} />
                        ))}
            </Picker>
          </View>
          <View style={{ marginTop:40 }}>
          <Button title="enviar" disabled={disabled} onPress={handleEnviar} />
          </View>
        </EditUserContainer>
  );

};

export default Localidade;