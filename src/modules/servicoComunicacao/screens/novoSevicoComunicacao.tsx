import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { ServicosComunicacaoType } from "../../../shared/types/ComunicacaoType";
import { useNovoServicoComunicacao } from "../hooks/useInputServCom";
import { ServicoComunicacaoDetailContainer } from "../styles/servicoComunicacao.style";

export interface NovoServicoParams {
  benfeitoria: BenfeitoriaType;
  servicosComunicacao?: ServicosComunicacaoType;
}

export const detalharServicoComunicacao = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType)=>{
  navigate('ServicosComunicacaoLista', {benfeitoria})
}

export const NovoServicoComunicacao = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { params } = useRoute<RouteProp<Record<string, NovoServicoParams>, string>>();
    const benfeitoria = params.benfeitoria ?? params.servicosComunicacao?.benfeitoria;
    const servicosComunicacao = params.servicosComunicacao;
    const [loading, setLoading] = useState(false); 
  const [serviCom, setServCom] = useState<string>('');     
  const [outroServCom, SetOutroServCom] = useState<string>('');
  const {  
    novoServicoComunicacao,
    enviarRegistro,
    handleEnumChange,
    handleOnChangeInput,
    handleArrayFieldChange,
    disabled
  } = useNovoServicoComunicacao(benfeitoria, servicosComunicacao);
 const servicosOptions = Object.values([
  "Telefonia rural",
  "Telefonia móvel",
  "Internet",
  "Rádio comunicador",
  "Sinal de TV",
  "Não possui",
  "Não declarado",
  "Outros"
]);
 const operadoraOptions = Object.values([
  "Oi",
  "Vivo",
  "Claro",
  "Não declarado",
  "Outro"
]);


 useEffect(() => {
     const servicoInformado = serviCom === 'OUTROS' 
     ? (outroServCom ? [`QUAIS: ${serviCom}`] : [])  // Se for "SIM", adiciona sobreUso se houver
     : [serviCom];
 
     handleArrayFieldChange('tipoServicoComunicacao', servicoInformado);
   }, [serviCom, outroServCom]);

   useEffect(() => {
    if (!servicosComunicacao) return;
     handleEnumChange('operadoraServicoComunicacao', servicosComunicacao.operadoraServicoComunicacao)
  }, [servicosComunicacao]);

   const val1 = servicosComunicacao?.tipoServicoComunicacao? servicosComunicacao.tipoServicoComunicacao: '';

  const handleEnviar = async () => {
    setLoading(true);
    try {
      const servicoComunicacaoSalvo = await enviarRegistro(); 
      if (servicoComunicacaoSalvo) {
        detalharServicoComunicacao(navigation.navigate, benfeitoria);
      } else {
        Alert.alert("Erro", "Não foi possível salvar serviço de comunicação. Tente novamente.");
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
      <ServicoComunicacaoDetailContainer>
        
        { val1 && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                   Informação cadastrada anteriormente:  {val1}
                </Text>
        )}
      <RenderPicker
       label="Selecione o tipo de serviço de comunicação informado"
       selectedValue={serviCom}
       onValueChange={(value) => {
       setServCom(value ?? 'OUTROS'); 
          if (value !== '') {
           SetOutroServCom('');
           }
        }}
        options={servicosOptions}
              />
               {serviCom.includes('OUTROS') && (
                <View style={{ marginTop: 10 }}>
                   <Input
                        value={outroServCom}
                        onChangeText={SetOutroServCom}
                        placeholder="Separe por vírgulas"
                        margin="15px 10px 30px 5px"
                        title="Informe qual ou quais?"
                    />
                </View>
       )}

        <RenderPicker
          label="Selecione a operadora"
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
