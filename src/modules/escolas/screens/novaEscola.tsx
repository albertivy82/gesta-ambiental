import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { EsferaEnum } from "../../../enums/esfera.enum";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { EscolaType } from "../../../shared/types/EscolaType";
import { useNovaEscola } from "../hooks/useNovaEscola";
import { EscolaContainer } from "../styles/Escolas.style";




export interface NovaEscolaParams {
localidadeId?: number
escola?: EscolaType;
}


export const detalharEscola = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
    navigate('Escolas', {localidadeId})
}


export const NovaEscola = ()=>{
 const { params } = useRoute<RouteProp<Record<string, NovaEscolaParams>, string>>();
 const localidadeId = params.localidadeId ?? params.escola?.localidade.id;
 const escola = params.escola;
 const navigation = useNavigation();
 const [loading, setLoading] = useState(false); 
  
  const { novaEscola,
          handleOnChangeInput,
          enviarRegistro,
          handleIniciativa,
          handleMerenda,
          handleEducAmbiental,
          handleTransporte,
          disabled,} = useNovaEscola(params.localidadeId!, escola);
    
          useEffect(() => {
            if (escola) {
              handleOnChangeInput(escola.nome, 'nome');
              handleIniciativa(escola.iniciativa);
              handleMerenda(escola.merenda as SimNao);
              handleTransporte(escola.transporte as SimNao);
              handleEducAmbiental(escola.educacaoAmbiental as SimNao);
            }
          }, [escola]);
            
  
    const simNaoOptions =  Object.values(SimNao);
    const Iniciativa =  Object.values(EsferaEnum);
      
  console.log(escola?.localidade.id, localidadeId)

    const handleEnviar = async () => {
             setLoading(true);
            try {
               const vegetacaoSalva = await enviarRegistro(); 
                   if (vegetacaoSalva){
                     detalharEscola(navigation.navigate, params.localidadeId! );
                   } else {
                     Alert.alert("Erro", "Não foi possível salvar a escola. Tente novamente.");
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
        <EscolaContainer>

        <Input 
              value={novaEscola.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              placeholder="Nome da Escola:"
              margin="15px 10px 30px 5px"
              title="Nome:"
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