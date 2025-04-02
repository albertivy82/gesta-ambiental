import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Operadora } from "../../../enums/Operadora.enum";
import { servicoComunicacaoEnum } from "../../../enums/servicoComunicacao.enum";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovoServicoComunicacao } from "../hooks/useInputServCom";
import { ServicoComunicacaoDetailContainer } from "../styles/servicoComunicacao.style";

export interface idParam {
  benfeitoria: BenfeitoriaType;
}

export const NovoServicoComunicacao = () => {
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [loading, setLoading] = useState(false); 
  const {  
    novoServicoComunicacao,
    handleEnumChange,
    disabled
  } = useNovoServicoComunicacao(params.benfeitoria);
 const servicosOptions = Object.values(servicoComunicacaoEnum);
 const operadoraOptions = Object.values(Operadora);

  const handleEnviar = async () => {
    setLoading(true);
    try {
      const servicoComunicacaoSalvo = true; //await enviarRegistro(); 
      if (servicoComunicacaoSalvo) {
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
      <ServicoComunicacaoDetailContainer>
        
  
        <RenderPicker
          label="O serviço de comunicação é utilizado para fins comerciais?"
          selectedValue={novoServicoComunicacao.tipoServicoComunicacao}
          onValueChange={(value) => handleEnumChange('tipoServicoComunicacao', value)}
          options={servicosOptions}
        />

        <RenderPicker
          label="Qual a"
          selectedValue={novoServicoComunicacao.operadoraServicoComunicacao}
          onValueChange={(value) => handleEnumChange('operadoraServicoComunicacao', value)}
          options={operadoraOptions}
        />

       

        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
          )}
        </View>

      </ServicoComunicacaoDetailContainer>
    </ScrollView>
  );
};
