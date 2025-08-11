import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
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
    navigate('ParticipacaoInstituicao', {morador})
}

export const NovaParticipacaoInstituicao = ()=>{
   const { params } = useRoute<RouteProp<Record<string, NovaParticipacaoInstituicaoParams>, string>>();
   const morador = params.morador;
   const participacaoInstituicao = params.participacaoInstituicao;
   const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const [loading, setLoading] = useState(false); 
   const {  novaParticipacaoInstituicao,
            enviarRegistro,
            handleOnChangeInput,
            handleEnumChange,
            disabled
          } = useNovaParticipacaoInstituicao(morador, participacaoInstituicao);

useEffect(() => {
      if (!participacaoInstituicao) return;

      handleEnumChange('instituicao', participacaoInstituicao.instituicao);
      handleOnChangeInput(participacaoInstituicao.tipoDeRegistro ?? '', 'tipoDeRegistro');
      handleOnChangeInput(participacaoInstituicao.registro ?? '', 'registro');
    }, [participacaoInstituicao]);

  
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
      <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA'  }}>
        <ParticipacaoInstituicaoDetailContainer>

            <RenderPicker
               label="Qual instituição?"
               selectedValue={novaParticipacaoInstituicao.instituicao}
               onValueChange={(value) => handleEnumChange('instituicao', value)}
               options={['SINDICATO', 'COLONIA_DE_PESCA', 'ASSOCIACAO', 'CONSELHO', 'PARTIDO_POLITICO', 'IGREJA','NAO_DECLARADO', 'OUTRO']}
            />

          <Input 
              value={novaParticipacaoInstituicao.tipoDeRegistro} 
              onChange={(event)=> handleOnChangeInput(event, 'tipoDeRegistro')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Qual tipo de registro é feito nesta intituição?"
           />

          <Input 
              value={novaParticipacaoInstituicao.registro} 
              onChange={(event)=> handleOnChangeInput(event, 'registro')}
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