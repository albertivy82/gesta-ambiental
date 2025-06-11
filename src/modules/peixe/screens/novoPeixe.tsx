import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, View } from "react-native";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { PeixesType } from "../../../shared/types/PeixesType";
import { useNovoPeixe } from "../hooks/useInputPeixe";
import { PeixeDetailContainer } from "../styles/peixe.style";
import { RenderPicker } from "../../../shared/components/input/renderPicker";


export interface NovoPeixeParams {
  entrevistado: EntrevistadoType;
  peixe?: PeixesType;
}

export const detalharPeixe = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType) => {
  navigate('PeixesLista', { entrevistado });
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
           } = useNovoPeixe(params.entrevistado, peixe);
 
           useEffect(() => {
            if (peixe) {
              handleOnChangeInput(peixe.especie ?? '', 'especie');
             
            }
          }, [peixe]);
    
        
     const handleEnviar = async () => {
          setLoading(true);
        
          try {
            const peixeSalvo = await enviarRegistro(); 
                if (peixeSalvo){
                  detalharPeixe(navigation.navigate, entrevistado);
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
              title="Informe  a espécie do peixe:"
        />

         <RenderPicker
          label="A espécie é mais comuns no verão ou no inverno?"
          selectedValue={novoPeixe.climaOcorrencia}
          onValueChange={(value) => handleEnumChange('climaOcorrencia', value)}
          options={['VERÃO', 'INVERNO']}
          />

        <Input 
              value={novoPeixe.locaisEspecificosReprodução} 
              onChange={(event)=> handleOnChangeInput(event, 'locaisEspecificosReprodução')}
              placeholder="informe quais"
              margin="15px 10px 30px 5px"
              title="Existem locais muito importantes para  a reprodução do peixe?"
        />

         <Input 
              value={novoPeixe.locaisEspecificosAlimentacao} 
              onChange={(event)=> handleOnChangeInput(event, 'locaisEspecificosAlimentacao')}
              placeholder="Informe quais"
              margin="15px 10px 30px 5px"
              title="Existem locais muito importantes para alimentação do peixe?"
         />

          <RenderPicker
            label="A espécie é a mais importante da região?"
            selectedValue={novoPeixe.maisImportanteDaRegiao}
            onValueChange={(value) => handleEnumChange('maisImportanteDaRegiao', value)}
            options={['SIM', 'NÃO']}
            />

         <Input 
              value={novoPeixe.usosDaEspécie} 
              onChange={(event)=> handleOnChangeInput(event, 'usosDaEspécie')}
              placeholder="Informe quais"
              margin="15px 10px 30px 5px"
              title="Faz algum uso da espécie, como comércio, alimnetação etc?"
         />


        <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading || disabled} />
              )}
        </View>
 
      

        </PeixeDetailContainer>
        </ScrollView>
    )
}