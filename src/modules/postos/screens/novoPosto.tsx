import { RouteProp, useRoute } from "@react-navigation/native";
import { Alert, Button, ScrollView, View } from "react-native";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { useNovoPosto } from "../hooks/useNovoPosto";
import { PostoContainer } from "../styles/Postos.style";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from "react-native-paper";


export interface idParam {
localidadeId: number;
}

export const NovoPosto = ()=>{
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 
  
  const {  novoPosto,
           inputPostoApi,
           handleOnChangeInput,
           handleAmbulatorialChange,
           handleUrgenciaEmergenciaChange,
           handleMedicosPorTurnoChange,
          disabled,} = useNovoPosto(params.localidadeId);
    
    
  
    const simNaoOptions =  Object.values(SimNaoTalvez);
      
  

    const handleEnviar = async () => {
      setLoading(true)
      try {
        await inputPostoApi();
        navigation.goBack(); 
      } catch (error) {
        console.error('Erro no envio:', error);
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
              label="Possui POssui urgência e emergência??"
              selectedValue={novoPosto.urgenciaEmergencia}
               onValueChange={handleUrgenciaEmergenciaChange}
               options={simNaoOptions}
            />

      <Input
              value={novoPosto.medicosPorTurno?.toFixed() || ''}
              onChange={handleMedicosPorTurnoChange}
              keyboardType='numeric'
              placeholder="Médicos por turno"
              margin="15px 10px 30px 5px"
              title="Área do Imóvel (m²)"
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