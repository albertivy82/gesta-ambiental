import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovaAgua } from "../hooks/useInputAgua";
import { AguaDetailContainer } from "../styles/agua.style";


export interface idParam {
  entrevistado: EntrevistadoType;
}

export const NovaAgua = () => {
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [loading, setLoading] = useState(false);
  
  const {  
    novaAgua,
    handleOnChangeInput,
    handleEnumChange,
    disabled
  } = useNovaAgua(params.entrevistado);

  const simNaoOptions = Object.values(SimNao);

  const handleEnviar = async () => {
    setLoading(true);
    try {
      const aguaSalva = true; //await enviarRegistro();
      if (aguaSalva) {
        //detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
      } else {
        Alert.alert("Erro", "Não foi possível salvar a benfeitoria. Tente novamente.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      Alert.alert("Erro ao enviar", "Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
      <AguaDetailContainer>

        <Input 
          value={novoAgua.tipoFonteAgua} 
          onChange={(event) => handleOnChangeInput(event, 'tipoFonteAgua')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Informe o tipo de fonte de água:"
        />

        <RenderPicker
          label="Qualidade da água?"
          selectedValue={novoAgua.qualidadeAgua}
          onValueChange={(value) => handleEnumChange('qualidadeAgua', value)}
          options={simNaoOptions}
        />

        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
          )}
        </View>

      </AguaDetailContainer>
    </ScrollView>
  );
};
