import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { AvesType } from "../../../shared/types/AvesType";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovaAves } from "../hooks/useInputAve";
import { AveDetailContainer } from "../styles/ave.style";




export interface NovaAveParams {
  entrevistado: EntrevistadoType;
  ave?: AvesType;
}

export const detalharAves = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType) => {
  navigate('AveLista', { entrevistado });
};

export const NovaAve = () => {
   const { params } = useRoute<RouteProp<Record<string, NovaAveParams>, string>>();
   const entrevistado = params.entrevistado ?? params.ave?.entrevistado;
   const ave = params.ave;
   const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const [loading, setLoading] = useState(false); 
   const {  novaAve,
            enviarRegistro,
            handleOnChangeInput,
            handleEnumChange,
            disabled
          } = useNovaAves(params.entrevistado, ave);
          
          useEffect(() => {
            if (ave) {
              handleOnChangeInput(ave.especie ?? '', 'especie');
              handleEnumChange('climaOcorrencia', ave.climaOcorrencia);
              handleOnChangeInput(ave.usosDaEspecie ?? '', 'usosDaEspécie');
              handleOnChangeInput(ave.localDeAglomeracao ?? '', 'localDeAglomeracao');
              handleOnChangeInput(ave.problemasGerados ?? '', 'problemasGerados');
              handleOnChangeInput(ave.ameacaSofrida ?? '', 'ameacaSofrida');
                           
            }
          }, [ave]);
          

      
    const handleEnviar = async () => {
         setLoading(true);
       
         try {
           const aveSalva = await enviarRegistro(); 
               if (aveSalva){
                 detalharAves(navigation.navigate, entrevistado);
               } else {
                 Alert.alert("Erro", "Não foi possível salvar a aves. Tente novamente.");
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
              label="Em qual período do ano elas são mais comumente observadas?"
              selectedValue={novaAve.climaOcorrencia}
              onValueChange={(value) => handleEnumChange('climaOcorrencia', value)}
              options={['INVERNO / CHUVOSO', 'VERÃO / SECO']}
              />

              <Input 
              value={novaAve.usosDaEspecie} 
              onChange={(event)=> handleOnChangeInput(event, 'usosDaEspecie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="A comunidade faz uso de algum tipo de ave? Qual?"
              />

              <Input 
              value={novaAve.localDeAglomeracao} 
              onChange={(event)=> handleOnChangeInput(event, 'localDeAglomeracao')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Qual tipo de ameaça ele sofre:"
              />


              <Input 
              value={novaAve.problemasGerados} 
              onChange={(event)=> handleOnChangeInput(event, 'problemasGerados')}
              placeholder=".."
              margin="15px 10px 30px 5px"
              title="A espécie causa algum problema no local?"
              />

              <Input 
              value={novaAve.ameacaSofrida} 
              onChange={(event)=> handleOnChangeInput(event, 'ameacaSofrida')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="A espécie sofre alguma ameaça no local?"
              />

                     
             <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={disabled || loading} />
              )}
            </View>
      

        </AveDetailContainer>
        </ScrollView>
    )
} 