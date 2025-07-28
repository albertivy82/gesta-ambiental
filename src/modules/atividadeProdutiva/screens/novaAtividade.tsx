import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { AtividadeProdutivaType } from "../../../shared/types/AtividadeProdutiva";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovaAtvProd } from "../hooks/useInputAtvProd";
import { AtividadeDetailContainer } from "../styles/ativdade.style";


export interface NovaAtividadeParams {
  benfeitoria: BenfeitoriaType;
  atividadeProdutiva?: AtividadeProdutivaType;
}

export const detalharAtividadeProdutiva = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType) => {
  navigate('Atividades', { benfeitoria });
};

export const NovaAtividade = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, NovaAtividadeParams>, string>>();
  const benfeitoria = params.benfeitoria ?? params.atividadeProdutiva?.benfeitoria;
  const atividadeProdutiva = params.atividadeProdutiva;
  const [loading, setLoading] = useState(false); 
  const { novaAtividade,
    enviarRegistro,
          handleEnumChange,
          handleNumberChange,
          handleOnChangeRendimentoMensal,
          disabled
          } = useNovaAtvProd(benfeitoria, atividadeProdutiva);

         
const atividadeOptions =  Object.values(
  ["PESCA ARTESANAL", "COMÉRCIO",	"SERVIÇO","INDÚSTRIA E COMÉRCIO", "SERVIÇOE COMÉRCIO", 	"NENHUMA"]
);
    
    const handleEnviar = async () => {
         setLoading(true);
       
         try {
           const atividadeSalva = await enviarRegistro(); 
           console.log("ppp", atividadeSalva);
               if (atividadeSalva){
                 detalharAtividadeProdutiva(navigation.navigate, benfeitoria);
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

       useEffect(() => {
        if (!atividadeProdutiva) return;
           handleEnumChange('atividade', atividadeProdutiva.atividade);
       
        }, [atividadeProdutiva]);

        const valorSalvoPessoas = atividadeProdutiva?.pessoasEnvolvidas ? atividadeProdutiva.pessoasEnvolvidas.toFixed(2) : '';
        const valorSalvoRendimento = atividadeProdutiva?.faturamentoAtividadeMesTotal ? atividadeProdutiva.faturamentoAtividadeMesTotal : '';
    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
        <AtividadeDetailContainer>
            <RenderPicker
               label="A qual ramo pertence a atividade?"
               selectedValue={novaAtividade.atividade}
               onValueChange={(value) => handleEnumChange('atividade', value)}
               options={atividadeOptions}
            />


              {valorSalvoPessoas && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação cadastrada anteriormente: {valorSalvoPessoas}
                </Text>
              )}

            <Input
              value={novaAtividade.pessoasEnvolvidas?.toString() || ''}
              onChange={(event)=> handleNumberChange(event, 'pessoasEnvolvidas')}
              keyboardType='numeric'
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Quantas pessoas de sua residência estão envolvidas na atividade?"
             />

             {valorSalvoRendimento && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação cadastrada anteriormente: {valorSalvoRendimento}
                </Text>
              )}
              <Input
                value={novaAtividade.faturamentoAtividadeMesTotal || ''}
                onChange={handleOnChangeRendimentoMensal}
                keyboardType="numeric"
                placeholder="R$"
                title="Informe o rendimento mensal aproximado da atividade"
              />

                       
             <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
              )}
            </View>
      

        </AtividadeDetailContainer>
        </ScrollView>
    )
} 