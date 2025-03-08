import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { SimNao } from "../../../enums/simNao.enum";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovoPeixe } from "../hooks/useInputPeixe";
import { PeixeDetailContainer } from "../styles/peixe.style";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";


export interface idParam {
  entrevistado: EntrevistadoType;
}

export const NovoPeixe = ()=>{
    const { params } = useRoute<RouteProp<Record<string, idParam>>>();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [loading, setLoading] = useState(false); 
     const {  novoPeixe,
             handleOnChangeInput,
             handleEnumChange,
             disabled
           } = useNovoPeixe(params.entrevistado);
 
 
    
   const simNaoOptions =  Object.values(SimNao);
     
     const handleEnviar = async () => {
          setLoading(true);
        
          try {
            const peixeSalvo = true//await enviarRegistro(); 
                if (peixeSalvo){
                  //detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
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
        
    
      

        </PeixeDetailContainer>
        </ScrollView>
    )
}