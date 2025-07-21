import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Input from "../../../shared/components/input/input";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovoCredito } from "../hooks/useInputCredito";
import { CreditoDetailContainer } from "../styles/credito.style";
import { CreditoType } from "../../../shared/types/CreditoType";


export interface NovoCreditoParams {
  benfeitoria: BenfeitoriaType;
  credito?: CreditoType;
}

export const detalharCredito = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType) => {
  navigate('CreditoLista', { benfeitoria });
};

export const NovoCredito = () => {
 const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const { params } = useRoute<RouteProp<Record<string, NovoCreditoParams>, string>>();
   const benfeitoria = params.benfeitoria ?? params.credito?.benfeitoria;
   const credito = params.credito;
   const [loading, setLoading] = useState(false); 
   const {  
    novoCredito,
    handleOnChangeRendimentoMensal,
    handleOnChangeInput,
    enviarRegistro,
    disabled
  } = useNovoCredito(params.benfeitoria);

 

  const handleEnviar = async () => {
           setLoading(true);
         
           try {
             const creditoSalva = await enviarRegistro(); 
             console.log(creditoSalva);
                 if (creditoSalva){
                  detalharCredito(navigation.navigate, benfeitoria);
                 } else {
                   Alert.alert("Erro", "Não foi possível salvar a atividadeProdutiva. Tente novamente.");
                   navigation.goBack();
                 }
           } catch (error) {
             console.error("Erro no envio:", error);
             Alert.alert("Erro ao enviar", "Tente novamente mais tarde.");
           } finally {
             setLoading(false);
           }
         };

  //const valorSalvo = credito?. credito.faturamentoAtividadeMesTotal.toFixed(2) : '';

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
