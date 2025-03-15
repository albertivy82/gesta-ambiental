import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
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
  const [outrosUsos, setOutrosUsos] = useState<string>('');     
  const [qual, SetQual] = useState<string>('');

  const {  
    novoCredito,
    handleOnChangeInput,
    handleEnumChange,
    handleArrayFieldChange,
    disabled
  } = useNovoCredito(params.benfeitoria);

  useEffect(() => {
    const consolidaDados = outrosUsos === 'SIM' 
      ? (qual ? [`ocorrencia: ${qual}`] : [])  
      : ['NÃO']; 

    handleArrayFieldChange('usoOutros', consolidaDados);
  }, [outrosUsos, qual]);

  const simNaoOptions = Object.values(SimNao);
    
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
    <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
      <CreditoDetailContainer>
        
        <Input 
          value={novoCredito.tipoCredito} 
          onChange={(event) => handleOnChangeInput(event, 'tipoCredito')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Informe o tipo de crédito:"
        />

        <Input 
          value={novoCredito.valorCredito} 
          onChange={(event) => handleOnChangeInput(event, 'valorCredito')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Informe o valor do crédito:"
        />

        <RenderPicker
          label="O crédito foi utilizado para investimentos?"
          selectedValue={novoCredito.usoInvestimento}
          onValueChange={(value) => handleEnumChange('usoInvestimento', value)}
          options={simNaoOptions}
        />

        <RenderPicker
          label="Possui empréstimos em aberto?"
          selectedValue={novoCredito.emprestimosAbertos}
          onValueChange={(value) => handleEnumChange('emprestimosAbertos', value)}
          options={simNaoOptions}
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
