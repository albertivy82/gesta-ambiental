import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovoMamifero } from "../hooks/useInputMamifero";
import { MamiferoDetailContainer } from "../styles/Mamifero.style";
import { MamiferosType } from "../../../shared/types/MamiferosType";


export interface NovoMamiferoParams {
  entrevistado: EntrevistadoType;
  mamifero?: MamiferosType;
}

export const detalharMamifero = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoId: number) => {
  navigate('MamiferoLista', { entrevistadoId });
};

export const NovoMamifero = () => {
     const { params } = useRoute<RouteProp<Record<string, NovoMamiferoParams>, string>>();
     const entrevistado = params.entrevistado ?? params.mamifero?.entrevistado;
     const mamifero = params.mamifero;
     const navigation = useNavigation<NavigationProp<ParamListBase>>();
     const [loading, setLoading] = useState(false); 
     const [outrosUsos, setOutrosUsos] = useState<string>('');     
     const [qual, SetQual] = useState<string>('');
     const {  novoMamifero,
              enviarRegistro,
              handleOnChangeInput,
              handleEnumChange,
              handleArrayFieldChange,
              disabled
            } = useNovoMamifero(params.entrevistado, mamifero);
   
    useEffect(() => {
            const consolidaDados = outrosUsos === 'SIM' 
              ? (qual ? [`ocorrencia: ${qual}`] : [])  
              : ['NÃO']; 
          
            handleArrayFieldChange('usoOutros', consolidaDados);
          
      }, [outrosUsos, qual]);
   
    const simNaoOptions =  Object.values(SimNaoTalvez);
    
    const handleEnviar = async () => {
      setLoading(true);
    
      try {
        const mamiferoSalvo = await enviarRegistro(); 
            if (mamiferoSalvo){
              detalharMamifero(navigation.navigate, mamiferoSalvo);
            } else {
              Alert.alert("Erro", "Não foi possível salvar a mamifero. Tente novamente.");
              navigation.goBack();
            }
      } catch (error) {
        console.error("Erro no envio:", error);
        Alert.alert("Erro ao enviar", "Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    console.log(disabled, loading)

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <MamiferoDetailContainer>
          
        <Input 
              value={novoMamifero.especie} 
              onChange={(event)=> handleOnChangeInput(event, 'rua')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
        />

            <RenderPicker
               label="Consome a ave em casa?"
               selectedValue={novoMamifero.usoConsumo}
               onValueChange={(value) => handleEnumChange('usoConsumo', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="comercializa a ave?"
               selectedValue={novoMamifero.usoComercio}
               onValueChange={(value) => handleEnumChange('usoComercio', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Faz a criação da ave?"
               selectedValue={novoMamifero.usoCriacao}
               onValueChange={(value) => handleEnumChange('usoCriacao', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Faz algum uso medicinal da ave?"
               selectedValue={novoMamifero.usoRemedio}
               onValueChange={(value) => handleEnumChange('usoRemedio', value)}
               options={simNaoOptions}
              />

             <RenderPicker
                  label="Faz outro uso?"
                  selectedValue={outrosUsos}
                  onValueChange={(value) => {
                    setOutrosUsos(value ?? ''); 
                    if (value !== 'SIM') {
                      SetQual('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
                 />
                    {outrosUsos.includes('SIM') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                      value={qual}
                      onChangeText={SetQual}
                      placeholder="Separe as informações por vírgula"
                      margin="15px 10px 30px 5px"
                      title="Qual?"
                       />
                      </View>
            )}

             <Input 
              value={novoMamifero.problemasRelacionados} 
              onChange={(event)=> handleOnChangeInput(event, 'problemasRelacionados')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Quai problemas relacionados a ave:"
              />

              <Input 
              value={novoMamifero.alimentacao} 
              onChange={(event)=> handleOnChangeInput(event, 'alimentacao')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="A espécie se elimenta de que?:"
                />

              <Input 
              value={novoMamifero.desricaoEspontanea} 
              onChange={(event)=> handleOnChangeInput(event, 'desricaoEspontanea')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Deseja acrescentar mais informações sobre a espécie:"
             />

          
             <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
              )}
            </View>
 
    
      

        </MamiferoDetailContainer>
        </ScrollView>
    )
}