import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { MoradorType } from "../../../shared/types/MoradorType";
import { ParticipacaoInstituicaoType } from "../../../shared/types/ParticipacaoInstituicaoType";
import { useNovaParticipacaoInstituicao } from "../hooks/useInputParticipacaoInstituicao";
import { ParticipacaoInstituicaoDetailContainer } from "../styles/ParticipacaoInstituicao.style";




export interface NovaParticipacaoInstituicaoParams {
  morador: MoradorType;
  participacaoInstituicao?: ParticipacaoInstituicaoType;
}

export const detalharParticipacaoInstituicao = (navigate: NavigationProp<ParamListBase>['navigate'], morador: MoradorType)=>{
    navigate('ParticipacaoInstituicaoLista', {morador})
}

export const NovaParticipacaoInstituicao = ()=>{
   const { params } = useRoute<RouteProp<Record<string, NovaParticipacaoInstituicaoParams>, string>>();
   const morador = params.morador ?? params.participacaoInstituicao?.morador;
   const participacaoInstituicao = params.participacaoInstituicao;
   const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const [loading, setLoading] = useState(false); 
   const {  novaParticipacaoInstituicao,
            enviarRegistro,
            handleOnChangeInput,
            handleEnumChange,
            disabled
          } = useNovaParticipacaoInstituicao(morador, participacaoInstituicao);



  
    const handleEnviar = async () => {
         setLoading(true);
       
         try {
           const participacaoInstituicaoSalva = await enviarRegistro(); 
             if (participacaoInstituicaoSalva){
                  detalharParticipacaoInstituicao(navigation.navigate, morador);
                } else {
                 Alert.alert("Erro", "Não foi possível salvar a participacaoInstituicao. Tente novamente.");
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
        <ParticipacaoInstituicaoDetailContainer>

                  <RenderPicker
               label="Qual instituição?"
               selectedValue={novaParticipacaoInstituicao.instituicao}
               onValueChange={(value) => handleEnumChange('instituicao', value)}
               options={['SINDICATO', 'COLONIA_DE_PESCA', 'ASSOCIACAO', 'CONSELHO', 'PARTIDO_POLITICO', 'IGREJA','NAO_DECLARADO', 'OUTRO']}
            />

          <Input 
              value={novaParticipacaoInstituicao.tipoDeRgistro} 
              onChange={(event)=> handleOnChangeInput(event, 'tipoDeRgistro')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Qual tipo de registro é feito nesta intituição?"
           />

          <Input 
              value={novaParticipacaoInstituicao.Registro} 
              onChange={(event)=> handleOnChangeInput(event, 'Registro')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe o número de registro"
           />


           <View style={{ marginTop: 40 }}>
                         {loading ? (
                           <ActivityIndicator size="large" color="#ff4500" /> 
                         ) : (
                           <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={disabled || loading} />
                         )}
            </View>
    
      

        </ParticipacaoInstituicaoDetailContainer>
        </ScrollView>
    )
}