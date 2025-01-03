import { RouteProp, useRoute } from "@react-navigation/native";
import { Alert, Button, ScrollView, View } from "react-native";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { useNovaEscola } from "../hooks/useNovaEscola";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from "react-native-paper";
import { EscolaContainer } from "../styles/Escolas.style";
import { EsferaEnum } from "../../../enums/esfera.enum";


export interface idParam {
localidadeId: number;
}

export const NovaEscola = ()=>{
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 
  
  const { novaEscola,
          handleOnChangeInput,
          inputEscolaApi,
          handleIniciativa,
          handleMerenda,
          handleEducAmbiental,
          handleTransporte,
          disabled,} = useNovaEscola(params.localidadeId);
    
    
  
    const simNaoOptions =  Object.values(SimNaoTalvez);
    const Iniciativa =  Object.values(EsferaEnum);
      
  

    const handleEnviar = async () => {
      setLoading(true)
      try {
        await inputEscolaApi();
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
        <EscolaContainer>

        <Input 
              value={novaEscola.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'rua')}
              placeholder="Informe a rua do imóvel"
              margin="15px 10px 30px 5px"
              title="Rua:"
        />
          
          <RenderPicker
                  label="Pertence a qual esfera?"
                  selectedValue={novaEscola.iniciativa}
                  onValueChange={handleIniciativa}
                  options={Iniciativa}
                />

          <RenderPicker
              label="Possui merenda escolar"
              selectedValue={novaEscola.merenda}
               onValueChange={handleMerenda}
               options={simNaoOptions}
            />

          <RenderPicker
              label="Possui transporte escolar"
              selectedValue={novaEscola.transporte}
               onValueChange={handleTransporte}
               options={simNaoOptions}
            />

          <RenderPicker
              label="Possui educação ambiental"
              selectedValue={novaEscola.educacaoAmbiental}
               onValueChange={handleEducAmbiental}
               options={simNaoOptions}
            />

     

      <View style={{ marginTop: 40 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff4500" /> // Exibe o spinner enquanto está carregando
      ) : (
        <Button title="Enviar" onPress={handleEnviar} color='#ff4500' disabled={disabled || loading} />
      )}
      </View>
 
        </EscolaContainer>
        </ScrollView>
    )
}