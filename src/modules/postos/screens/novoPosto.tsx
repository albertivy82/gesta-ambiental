import { NavigationProp, ParamListBase, RouteProp, useRoute } from "@react-navigation/native";
import { Alert, Button, ScrollView, View } from "react-native";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { useNovoPosto } from "../hooks/useNovoPosto";
import { PostoContainer } from "../styles/Postos.style";
import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from "react-native-paper";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { SimNao } from "../../../enums/simNao.enum";
import { PostoType } from "../../../shared/types/postoTypes";
import { theme } from "../../../shared/themes/theme";
import { FormErrors } from "../../../shared/components/FormErrors";


export interface NovoPostoParams {
localidadeId?: number
posto?: PostoType;
}



export const detalharPosto = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
    navigate('Postos', {localidadeId})
}

export const NovoPosto = ()=>{
  const { params } = useRoute<RouteProp<Record<string, NovoPostoParams>, string>>();
  const localidadeId = params.localidadeId ?? params.posto?.localidade.id;
  const posto = params.posto;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 
  const [showErrors, setShowErrors] = useState(false);
  
  const {  novoPosto,
           enviarRegistro,
           handleOnChangeInput,
           handleAmbulatorialChange,
           handleUrgenciaEmergenciaChange,
           handleMedicosPorTurnoChange,
           validatePosto,
          disabled,} = useNovoPosto(localidadeId!, posto);
    
          useEffect(() => {
            if (posto) {
              handleOnChangeInput(posto.nome, 'nome');
              handleAmbulatorialChange(posto.ambulatorial as SimNao);
              handleUrgenciaEmergenciaChange(posto.urgenciaEmergencia as SimNao);
              if (posto.medicosPorTurno != null) {
                handleMedicosPorTurnoChange({
                  nativeEvent: { text: String(posto.medicosPorTurno) },
                } as any);
              }
              
            }
          }, [posto]);
          
          
    
  
    const simNaoOptions =  Object.values(SimNao);
      
  

    const handleEnviar = async () => {
      
      if (loading) return;
          
      const result = validatePosto(novoPosto);
      if (!result.isValid) {
        setShowErrors(true);
    
        Alert.alert(
          'Campos Obrigatórios',
          [
            'Por favor, corrija os campos abaixo:',
            '',
            ...result.errors.map((e, idx) => `${idx + 1}. ${e.message}`),
          ].join('\n')
        );
        return;
      }
                 
                try {
                  setLoading(true);
                   const postoSalvo = await enviarRegistro(); 
                       if (postoSalvo){
                         detalharPosto(navigation.navigate, localidadeId!);
                       } else {
                         Alert.alert("Erro", "Não foi possível salvar o posto de saúde. Tente novamente.");
                         navigation.goBack();
                       }
                  } catch (e) {
                    Alert.alert('Erro', 'Não foi possível realizar a operação.');
                  } finally {
                    setLoading(false); // 👈 desliga
                  }
    };



    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
        <PostoContainer>
           <Input 
              value={novoPosto.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              placeholder="Informe o nome do posto"
               placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="0px 0px 16px 0px"
              title="Nome do Posto:"
              />

      <RenderPicker
              label="Possui ambulatorial?"
              selectedValue={novoPosto.ambulatorial}
               onValueChange={handleAmbulatorialChange}
               options={simNaoOptions}
            />

      <RenderPicker
              label="Possui urgência e emergência?"
              selectedValue={novoPosto.urgenciaEmergencia}
               onValueChange={handleUrgenciaEmergenciaChange}
               options={simNaoOptions}
            />

      <Input
              value={novoPosto.medicosPorTurno?.toFixed() || ''}
              onChange={handleMedicosPorTurnoChange}
              keyboardType='numeric'
              placeholder=" "
              margin="15px 10px 30px 5px"
              title="Médicos por turno"
       />

     <FormErrors
        visible={showErrors && disabled}
        errors={validatePosto(novoPosto).errors}
      />
                       
      <Button
      title={loading ? "Enviando..." : "Enviar"}
      onPress={handleEnviar}
      color={"#ff4500"}
      disabled={loading}   // 👈 trava só enquanto envia
      />
     
        </PostoContainer>
        </ScrollView>
    )
}