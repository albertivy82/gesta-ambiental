import { Picker } from "@react-native-picker/picker";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Alert, Button, View } from "react-native";
import { EsferaEnum } from "../../../enums/esfera.enum";
import { municipiosEnum } from "../../../enums/municipios.enum";
import Input from "../../../shared/components/input/input";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { useEditUser } from "../hooks/uselnputLocalidade";
import { EditUserContainer } from "../styles/Localidade.style";

const Localidade = () => {
  const { novaLocalidade, handleOnChangeInput, handleMunicipioChange, editLocalidade, handleEsferaChange, disabled } = useEditUser();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  
  
  const handleEnviar = async () => {
    try {
      await editLocalidade();          // deve lançar erro se falhar
      Alert.alert('Sucesso', 'Localidade Salva.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível atualizar a localidade.');
    } finally {
      navigation.navigate('HOME'); // navega de qualquer jeito
    }
  };
  

  const municipioOptions = Object.values(municipiosEnum);
  const esferaOptions = Object.values(EsferaEnum);

  return (
    <EditUserContainer>
      <Input 
        value={novaLocalidade.nome} 
        onChange={(event) => handleOnChangeInput(event, 'nome')}
        placeholder="Informe o nome da localidade"
        margin="0px 0px 16px 0px"
        title="Localidade:"
      />

      <Text type={textTypes.SUB_TITLE_SEMI_BOLD} color={theme.colors.mainTheme.black} style={{ marginBottom: 5 }}>
        Município:
      </Text>
      <View style={{ marginBottom: 20, backgroundColor: "#FFFFFF", borderRadius: 8 }}>
        <Picker
          selectedValue={novaLocalidade.municipio}
          onValueChange={(value) => handleMunicipioChange(value)}
          style={{ color: theme.colors.mainTheme.black }}
          dropdownIconColor={theme.colors.blueTheme.blue1}
        >
          <Picker.Item label="Selecione um município" color={theme.colors.blueTheme.blue1} value="" />
          {municipioOptions.map(municipio => (
            <Picker.Item key={municipio} label={municipio} value={municipio} />
          ))}
        </Picker>
      </View>

      <Text type={textTypes.SUB_TITLE_SEMI_BOLD} color={theme.colors.mainTheme.black} style={{ marginBottom: 5 }}>
        Esfera:
      </Text>
      <View style={{ marginBottom: 20, backgroundColor: "#FFFFFF", borderRadius: 8 }}>
        <Picker
          selectedValue={novaLocalidade.esfera}
          onValueChange={(value) => handleEsferaChange(value)}
          style={{ color: theme.colors.mainTheme.black }}
          dropdownIconColor={theme.colors.blueTheme.blue1}
        >
          <Picker.Item label="Selecione a esfera de criação" color={theme.colors.blueTheme.blue1} value="" />
          {esferaOptions.map(esfera => (
            <Picker.Item key={esfera} label={esfera} value={esfera} />
          ))}
        </Picker>
      </View>

      <View style={{ marginTop: 40 }}>
        <Button title="Enviar" disabled={disabled} onPress={handleEnviar} color={"#ff4500"} />
      </View>
    </EditUserContainer>
  );
};

export default Localidade;
