import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Button, View } from "react-native";
import { SimNao } from "../../../enums/simNao.enum";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovaFauna } from "../hooks/useInputFuna";
import { FaunaDetailContainer } from "../styles/Fauna.style";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { ActivityIndicator } from "react-native-paper";
import { FaunaType } from "../../../shared/types/FaunaType";


export interface NovaFaunaParams {
  entrevistado: EntrevistadoType;
  fauna?: FaunaType;
}

export const detalharFauna = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoId: number) => {
  navigate('FaunaLista', { entrevistadoId });
};

export const NovaFauna = () => {
     const { params } = useRoute<RouteProp<Record<string, NovaFaunaParams>, string>>();
     const entrevistado = params.entrevistado ?? params.fauna?.entrevistado;
     const fauna = params.fauna;
     const navigation = useNavigation<NavigationProp<ParamListBase>>();
     const [loading, setLoading] = useState(false); 
     const {  novaFauna,
              enviarRegistro,
              handleOnChangeInput,
              handleEnumChange,
              handleArrayFieldChange,
              disabled
            } = useNovaFauna(params.entrevistado, fauna);
  const [outrasOcorrencias, setOutrasOcorrencias] = useState<string>('');     
  const [qual, SetQual] = useState<string>('');

   useEffect(() => {
          const consolidaDados = outrasOcorrencias === 'SIM' 
            ? (qual ? [`ocorrencia: ${qual}`] : [])  
            : ['NÃO']; 
        
          handleArrayFieldChange('outrasOcorrencias', consolidaDados);
        
    }, [outrasOcorrencias, qual]);
    
  const simNaoOptions =  Object.values(SimNao);
  const ocorrenciaOptions =  Object.values([
    'NUNCA', 
    'FREQUENTEMENTE', 
    'NO PERíODO DE CUVAS',
    'RARAMENTE',
    'DEIXOU DE OCORRER',
   ' NÃO INFORMADO']
  );
  const tempoOptions
  =  Object.values([
    'HÁ 6 MESES', 
    'HÁ 1 ANO', 
    'DIARIAMENTE',
    'RARAMENTE',
    'NO INVERNO',
   ' NO VERÃO',
    'HÁ MUITOS ANOS NÃO AVISTA',
    'NÃO SABE INFORMAR']
  );
      const handleEnviar = async () => {
           setLoading(true);
         
           try {
             const faunaSalva = await enviarRegistro(); 
                 if (faunaSalva){
                   detalharFauna(navigation.navigate, faunaSalva);
                 } else {
                   Alert.alert("Erro", "Não foi possível salvar a espécie. Tente novamente.");
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
        <FaunaDetailContainer>
        <Input 
              value={novaFauna.especie} 
              onChange={(event)=> handleOnChangeInput(event, 'especie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
        />

            <RenderPicker
               label="Consome a ave em casa?"
               selectedValue={novaFauna.ocorreMata}
               onValueChange={(value) => handleEnumChange('ocorreMata', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="comercializa a ave?"
               selectedValue={novaFauna.ocorreRio}
               onValueChange={(value) => handleEnumChange('ocorreRio', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Faz a criação da ave?"
               selectedValue={novaFauna.ocorreLago}
               onValueChange={(value) => handleEnumChange('ocorreLago', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Faz algum uso medicinal da ave?"
               selectedValue={novaFauna.ocorreRua}
               onValueChange={(value) => handleEnumChange('ocorreRua', value)}
               options={simNaoOptions}
              />

              <RenderPicker
               label="Faz algum uso medicinal da ave?"
               selectedValue={novaFauna.ocorreQuintal}
               onValueChange={(value) => handleEnumChange('ocorreQuintal', value)}
               options={simNaoOptions}
              />

              
             <RenderPicker
                  label="Faz outro uso?"
                  selectedValue={outrasOcorrencias}
                  onValueChange={(value) => {
                    setOutrasOcorrencias(value ?? ''); 
                    if (value !== 'SIM') {
                      SetQual('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
                 />
                    {outrasOcorrencias.includes('SIM') && (
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

                
              <RenderPicker
               label="Faz algum uso medicinal da ave?"
               selectedValue={novaFauna.frequenciaAtual}
               onValueChange={(value) => handleEnumChange('frequenciaAtual', value)}
               options={ocorrenciaOptions}
              />

               <RenderPicker
               label="Faz algum uso medicinal da ave?"
               selectedValue={novaFauna.frequenciaPassada}
               onValueChange={(value) => handleEnumChange('frequenciaPassada', value)}
               options={ocorrenciaOptions}
              />

               <RenderPicker
               label="Faz algum uso medicinal da ave?"
               selectedValue={novaFauna.tempoQueNaoVe}
               onValueChange={(value) => handleEnumChange('tempoQueNaoVe', value)}
               options={tempoOptions}
              />




             

          
             <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
              )}
            </View>
 
    
      

        </FaunaDetailContainer>
        </ScrollView>
    )
}