import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Input from "../../../shared/components/input/input";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovoCredito } from "../hooks/useInputCredito";
import { CreditoDetailContainer } from "../styles/credito.style";
import { CreditoType } from "../../../shared/types/CreditoType";
import Text from "../../../shared/components/text/Text";
import { FormErrors } from "../../../shared/components/FormErrors";


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
   const benfeitoria = params.benfeitoria;
   const [showErrors, setShowErrors] = useState(false);
   const credito = params.credito;
   const [loading, setLoading] = useState(false); 
   const {  
    novoCredito,
    handleOnChangeRendimentoMensal,
    handleOnChangeInput,
    enviarRegistro,
    validateCredito,
    disabled
  } = useNovoCredito(params.benfeitoria, credito );

 

  const handleEnviar = async () => {
    if (loading) return;
  
    const result = validateCredito(novoCredito);
    if (!result.isValid) {
      setShowErrors(true);
  
      Alert.alert(
        'Campos Obrigatórios',
        [
          'Por favor, corrija os campos abaixo:',
          '',
          ...result.errors.map((e, idx) => `${idx + 1}. ${e.message}`),
        ].join('\n')
      );
      return;
    }
  
    setLoading(true);
    try {
      const creditoSalva = await enviarRegistro(); 
      if (creditoSalva){
        detalharCredito(navigation.navigate, benfeitoria);
      } else {
        Alert.alert("Erro", "Não foi possível salvar o crédito. Tente novamente.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      Alert.alert("Erro ao enviar", "Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };
  
      useEffect(() => {
        if (!credito) return;
         handleOnChangeInput(credito.nome, 'nome');
      }, [credito]); 
                      
    const valorSalvo = credito?.valor? credito.valor  : '';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
      <CreditoDetailContainer>
        
        <Input 
          value={novoCredito.nome} 
          maxLength={250}
          onChange={(event) => handleOnChangeInput(event, 'nome')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Informe qual é a linha crédito acessada pelos moradores da casa:"
        />
        {valorSalvo && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação cadastrada anteriormente: R$ {valorSalvo}
                </Text>
        )}
         <Input
              value={novoCredito.valor.toFixed(2)}
              maxLength={10}
              onChange={handleOnChangeRendimentoMensal}
              keyboardType='numeric'
              placeholder="R$"
              margin="15px 10px 30px 5px"
              title="Valor"
            />

        <FormErrors
          visible={showErrors && disabled}
          errors={validateCredito(novoCredito).errors}
        />

         <Button
              title={loading ? "Enviando..." : "Enviar"}
              onPress={handleEnviar}
              color={"#ff4500"}
              disabled={loading}   // 👈 trava só enquanto envia
              />


      </CreditoDetailContainer>
    </ScrollView>
  );
};
