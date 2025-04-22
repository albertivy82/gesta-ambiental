import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { AtividadesProdutivas } from "../../../enums/AtividadesProdutivas.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { AtividadeProdutivaType } from "../../../shared/types/AtividadeProdutiva";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovaAtvProd } from "../hooks/useInputAtvProd";
import { AtividadeDetailContainer } from "../styles/ativdade.style";


export interface idParam {
  benfeitoria: BenfeitoriaType;
}

export const detalharAtividadeProdutiva = (navigate: NavigationProp<ParamListBase>['navigate'], atividadeProdutiva: AtividadeProdutivaType)=>{
  navigate('AtividadeProdutivaDetails', {atividadeProdutiva})
}

export const NovaAtividade = ()=>{
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [loading, setLoading] = useState(false); 
  const { novaAtividade,
    enviarRegistro,
          handleEnumChange,
          handleNumberChange,
          handleOnChangeRendimentoMensal,
          disabled
          } = useNovaAtvProd(params.benfeitoria);

const atividadeOptions =  Object.values(AtividadesProdutivas);
    
    const handleEnviar = async () => {
         setLoading(true);
       
         try {
           const atividadeSalva = await enviarRegistro(); 
               if (atividadeSalva){
                 detalharAtividadeProdutiva(navigation.navigate, atividadeSalva);
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

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <AtividadeDetailContainer>
          
     

            <RenderPicker
               label="Consome a ave em casa?"
               selectedValue={novaAtividade.atividade}
               onValueChange={(value) => handleEnumChange('atividade', value)}
               options={atividadeOptions}
            />



            <Input
              value={novaAtividade.pessoasEnvolvidas?.toString() || ''}
              onChange={(event)=> handleNumberChange(event, 'pessoasEnvolvidas')}
              keyboardType='numeric'
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Quantas pessoas de sua residência estão envolvidas na atividade?"
             />

             
            <Input
              value={novaAtividade.faturamentoAtividadeMesTotal?.toFixed(2) || ''}
              onChange={handleOnChangeRendimentoMensal}
              keyboardType='numeric'
              placeholder="R$"
              margin="15px 10px 30px 5px"
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