import { NavigationProp, ParamListBase, RouteProp, useRoute } from "@react-navigation/native";
import { Alert, Button, ScrollView, View } from "react-native";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { useNovoPosto } from "../hooks/useNovoPosto";
import { PostoContainer } from "../styles/Postos.style";
import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from "react-native-paper";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { SimNao } from "../../../enums/simNao.enum";
import { PostoType } from "../../../shared/types/postoTypes";


export interface NovoPostoParams {
localidadeId?: number
posto?: PostoType;
}



export const detalharPosto = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
    navigate('Postos', {localidadeId})
}

export const NovoPosto = ()=>{
  const { params } = useRoute<RouteProp<Record<string, NovoPostoParams>, string>>();
  const localidadeId = params.localidadeId ?? params.posto?.localidade.id;
  const posto = params.posto;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 
  
  const {  novoPosto,
           enviarRegistro,
           handleOnChangeInput,
           handleAmbulatorialChange,
           handleUrgenciaEmergenciaChange,
           handleMedicosPorTurnoChange,
          disabled,} = useNovoPosto(localidadeId!, posto);
    
          useEffect(() => {
            if (posto) {
              handleOnChangeInput(posto.nome, 'nome');
              handleAmbulatorialChange(posto.ambulatorial as SimNao);
              handleUrgenciaEmergenciaChange(posto.urgenciaEmergencia as SimNao);
              setTimeout(() => {
                handleMedicosPorTurnoChange({ nativeEvent: { text: String(posto.medicosPorTurno ?? '') } } as any);
              }, 0);
            }
          }, [posto]);
          
          
    
  
    const simNaoOptions =  Object.values(SimNao);
      
  

    const handleEnviar = async () => {
                 setLoading(true);
                try {
                   const postoSalvo = await enviarRegistro(); 
                       if (postoSalvo){
                         detalharPosto(navigation.navigate, localidadeId!);
                       } else {
                         Alert.alert("Erro", "Não foi possível salvar a posto de saúde. Tente novamente.");
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
      <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
        <PostoContainer>
           <Input 
              value={novoPosto.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              placeholder="Informe o nome do posto"
              margin="0px 0px 16px 0px"
              title="Posto:"
              />

      <RenderPicker
              label="Possui ambulatorial?"
              selectedValue={novoPosto.ambulatorial}
               onValueChange={handleAmbulatorialChange}
               options={simNaoOptions}
            />

      <RenderPicker
              label="Possui urgência e emergência?"
              selectedValue={novoPosto.urgenciaEmergencia}
               onValueChange={handleUrgenciaEmergenciaChange}
               options={simNaoOptions}
            />

      <Input
              value={novoPosto.medicosPorTurno?.toFixed() || ''}
              onChange={handleMedicosPorTurnoChange}
              keyboardType='numeric'
              placeholder=" "
              margin="15px 10px 30px 5px"
              title="Médicos por turno"
       />

      <View style={{ marginTop: 40 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff4500" /> // Exibe o spinner enquanto está carregando
      ) : (
        <Button title="Enviar" onPress={handleEnviar} color='#ff4500' disabled={disabled || loading} />
      )}
      </View>
 
        </PostoContainer>
        </ScrollView>
    )
}