import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovaAves } from "../hooks/useInputAve";
import { AveDetailContainer } from "../styles/ave.style";




export interface idParam {
  entrevistado: EntrevistadoType;
}

export const NovaAve = ()=>{
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
   const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const [loading, setLoading] = useState(false); 
   const [outrosUsos, setOutrosUsos] = useState<string>('');     
   const [qual, SetQual] = useState<string>('');
   const {  novaAve,
            handleOnChangeInput,
            handleEnumChange,
            handleArrayFieldChange,
            disabled
          } = useNovaAves(params.entrevistado);


  useEffect(() => {
        const consolidaDados = outrosUsos === 'SIM' 
          ? (qual ? [`ocorrencia: ${qual}`] : [])  
          : ['NÃO']; 
      
        handleArrayFieldChange('usoOutros', consolidaDados);
      
  }, [outrosUsos, qual]);
   
  const simNaoOptions =  Object.values(SimNao);
    
    const handleEnviar = async () => {
         setLoading(true);
       
         try {
           const aveSalva = true//await enviarRegistro(); 
               if (aveSalva){
                 //detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
               } else {
                 Alert.alert("Erro", "Não foi possível salvar a benfeitoria. Tente novamente.");
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
        <AveDetailContainer>
          
        <Input 
              value={novaAve.especie} 
              onChange={(event)=> handleOnChangeInput(event, 'especie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
        />

            <RenderPicker
               label="Consome a ave em casa?"
               selectedValue={novaAve.useCosumo}
               onValueChange={(value) => handleEnumChange('useCosumo', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="comercializa a ave?"
               selectedValue={novaAve.usoComercio}
               onValueChange={(value) => handleEnumChange('usoComercio', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Faz a criação da ave?"
               selectedValue={novaAve.usoCriacao}
               onValueChange={(value) => handleEnumChange('usoCriacao', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Faz algum uso medicinal da ave?"
               selectedValue={novaAve.usoRemedio}
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
              value={novaAve.problemasRelacionados} 
              onChange={(event)=> handleOnChangeInput(event, 'problemasRelacionados')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Quai problemas relacionados a ave:"
              />

              <Input 
              value={novaAve.ameacaSofrida} 
              onChange={(event)=> handleOnChangeInput(event, 'ameacaSofrida')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Qual tipo de ameaça ele sofre:"
              />


              <Input 
              value={novaAve.localDeAglomeracao} 
              onChange={(event)=> handleOnChangeInput(event, 'localDeAglomeracao')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Onde ocorre a reunião da espécie:"
              />

              <Input 
              value={novaAve.qualImpotanciaDaEespecie} 
              onChange={(event)=> handleOnChangeInput(event, 'qualImpotanciaDaEespecie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Qual é a importância da espécie:"
              />


              <Input 
              value={novaAve.alimentacao} 
              onChange={(event)=> handleOnChangeInput(event, 'alimentacao')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="A espécie se elimenta de que?:"
                />

              <Input 
              value={novaAve.descricaoEspontanea} 
              onChange={(event)=> handleOnChangeInput(event, 'descricaoEspontanea')}
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
      

        </AveDetailContainer>
        </ScrollView>
    )
} 