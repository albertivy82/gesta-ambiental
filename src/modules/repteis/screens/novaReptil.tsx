import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, ScrollView, View, Button } from "react-native";
import Input from "../../../shared/components/input/input";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovoReptil } from "../hooks/useInputRepteis";
import { ReptilDetailContainer } from "../styles/Reptil.style";
import { ActivityIndicator } from "react-native-paper";


export interface idParam {
  entrevistado: EntrevistadoType;
}


export const NovaVegetacao = ()=>{
     const { params } = useRoute<RouteProp<Record<string, idParam>>>();
     const navigation = useNavigation<NavigationProp<ParamListBase>>();
     const [loading, setLoading] = useState(false); 
     const {  novoReptil,
              handleOnChangeInput,
              disabled
            } = useNovoReptil(params.entrevistado);
  
  
       
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
        <ReptilDetailContainer>


        <Input 
              value={novoReptil.especie} 
              onChange={(event)=> handleOnChangeInput(event, 'especie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
        />

        <Input 
              value={novoReptil.local} 
              onChange={(event)=> handleOnChangeInput(event, 'local')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
         />
         
         <Input 
              value={novoReptil.periodo} 
              onChange={(event)=> handleOnChangeInput(event, 'periodo')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
         />

         <Input 
              value={novoReptil.uso} 
              onChange={(event)=> handleOnChangeInput(event, 'uso')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
         />

         <Input 
              value={novoReptil.ameacado} 
              onChange={(event)=> handleOnChangeInput(event, 'ameacado')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
         />

         <Input 
              value={novoReptil.problemasRelacionados} 
              onChange={(event)=> handleOnChangeInput(event, 'problemasRelacionados')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
         />

         <Input 
              value={novoReptil.cacado} 
              onChange={(event)=> handleOnChangeInput(event, 'cacado')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
         />

        <Input 
              value={novoReptil.descricaoEspontanea} 
              onChange={(event)=> handleOnChangeInput(event, 'descricaoEspontanea')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
         />
          

          <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
              )}
            </View>

        </ReptilDetailContainer>
        </ScrollView>
    )
}