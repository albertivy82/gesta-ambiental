import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, View } from "react-native";
import { SimNao } from "../../../enums/simNao.enum";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovoPeixe } from "../hooks/useInputPeixe";
import { PeixeDetailContainer } from "../styles/peixe.style";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { PeixesType } from "../../../shared/types/PeixesType";


export interface NovoPeixeParams {
  entrevistado: EntrevistadoType;
  peixe?: PeixesType;
}

export const detalharPeixe = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoId: number) => {
  navigate('PeixeLista', { entrevistadoId });
};

export const NovoPeixe = () => {
  const { params } = useRoute<RouteProp<Record<string, NovoPeixeParams>, string>>();
  const entrevistado = params.entrevistado ?? params.peixe?.entrevistado;
  const peixe = params.peixe;
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [loading, setLoading] = useState(false); 
     const {  novoPeixe,
             enviarRegistro,
             handleOnChangeInput,
             handleEnumChange,
             disabled
           } = useNovoPeixe(params.entrevistado);
 
 
    
   const simNaoOptions =  Object.values(SimNao);
     
     const handleEnviar = async () => {
          setLoading(true);
        
          try {
            const peixeSalvo = await enviarRegistro(); 
                if (peixeSalvo){
                  detalharPeixe(navigation.navigate, peixeSalvo);
                } else {
                  Alert.alert("Erro", "Não foi possível salvar o peixe. Tente novamente.");
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
        <PeixeDetailContainer>

        <Input 
              value={novoPeixe.especie} 
              onChange={(event)=> handleOnChangeInput(event, 'especie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de ave:"
        />

          <RenderPicker
           label="locaisEspeciais?"
           selectedValue={novoPeixe.locaisEspeciais}
           onValueChange={(value) => handleEnumChange('locaisEspeciais', value)}
           options={simNaoOptions}
           />

          <RenderPicker
           label="locaisEspecificosAlimentacao?"
           selectedValue={novoPeixe.locaisEspecificosAlimentacao}
           onValueChange={(value) => handleEnumChange('locaisEspecificosAlimentacao', value)}
           options={simNaoOptions}
           />

          <RenderPicker
           label="usoAlimnetacao?"
           selectedValue={novoPeixe.usoAlimnetacao}
           onValueChange={(value) => handleEnumChange('usoAlimnetacao', value)}
           options={simNaoOptions}
           />
            
          <RenderPicker
           label="usoComercio?"
           selectedValue={novoPeixe.usoAlimnetacao}
           onValueChange={(value) => handleEnumChange('usoComercio', value)}
           options={simNaoOptions}
           />
        
    
          <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
              )}
            </View>
 
      

        </PeixeDetailContainer>
        </ScrollView>
    )
}