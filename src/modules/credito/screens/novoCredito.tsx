import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Input from "../../../shared/components/input/input";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovoCredito } from "../hooks/useInputCredito";
import { CreditoDetailContainer } from "../styles/credito.style";


export interface idParam {
  benfeitoria: BenfeitoriaType;
}

export const NovoCredito = () => {
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [loading, setLoading] = useState(false);
  

  const {  
    novoCredito,
    handleOnChangeRendimentoMensal,
    handleOnChangeInput,
    disabled
  } = useNovoCredito(params.benfeitoria);

 

  
    
  const handleEnviar = async () => {
    setLoading(true);
    try {
      const creditoSalvo = true; // await enviarRegistro(); 
      if (creditoSalvo) {
        // detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
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
    <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
      <CreditoDetailContainer>
        
        <Input 
          value={novoCredito.nome} 
          onChange={(event) => handleOnChangeInput(event, 'tipoCredito')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Informe qual é a linha crédito acessada pelos moradores da casa:"
        />
        
         <Input
              value={novoCredito.valor?.toFixed(2) || ''}
              onChange={handleOnChangeRendimentoMensal}
              keyboardType='numeric'
              placeholder="R$"
              margin="15px 10px 30px 5px"
              title="Valor"
            />

        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
          )}
        </View>

      </CreditoDetailContainer>
    </ScrollView>
  );
};
