import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { FontesRenda } from "../../../enums/fontesRenda.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { RendaOutrasFontesType } from "../../../shared/types/RendaOutrasFontesType";
import { useNovaRendaOutrasFontes } from "../hooks/useInputRendasOutrasFontes";
import { RendaOutrasFontesDetailContainer } from "../styles/rendaOutrasFontes.style";
import Text from "../../../shared/components/text/Text";

export interface NovoCreditoParams {
  benfeitoria: BenfeitoriaType;
  renda?: RendaOutrasFontesType;
}

export const detalharRenda = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType) => {
  navigate('RendaOutrasFontesLista', { benfeitoria });
};


export const NovaRendaOutrasFontes = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, NovoCreditoParams>, string>>();
  const benfeitoria = params.benfeitoria;
  const renda = params.renda;
  const [loading, setLoading] = useState(false); 
  const [fonteRenda, setFonteRenda] = useState<string>('');     
  const [outraFonte, SetOutraFonte] = useState<string>('');
  const {  
    novaRendaOutrasFontes,
    enviarRegistro,
    handleArrayFieldChange,
    handleNumberChange,
    handleOnChangeRendimentoMensal,
    disabled
  } = useNovaRendaOutrasFontes(benfeitoria, renda);
  
  const fontesOptions = Object.values(FontesRenda);
  
  useEffect(() => {
    const fonteInformada = fonteRenda === 'OUTROS' 
    ? (outraFonte ? [`QUAIS: ${outraFonte}`] : [])  // Se for "SIM", adiciona sobreUso se houver
    : [fonteRenda];

    handleArrayFieldChange('fonte', fonteInformada);
  }, [fonteRenda, outraFonte]);

  
    
  const handleEnviar = async () => {
    setLoading(true);
    try {
      const rendaSalva = await enviarRegistro(); 
      if (rendaSalva) {
        detalharRenda(navigation.navigate, benfeitoria);
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

                
   const val1 = renda?.fonte? renda.fonte: '';
   const val2 = renda?.beneficiarios? renda.beneficiarios  : '';
   const val3 = renda?.rendaMesTotal? renda.rendaMesTotal : '';
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
      <RendaOutrasFontesDetailContainer>
        
      {val1 && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                   Informação cadastrada anteriormente:  {val1}
                </Text>
        )}
      <RenderPicker
       label="Selecione uma fonte de renda"
       selectedValue={fonteRenda}
       onValueChange={(value) => {
       setFonteRenda(value ?? 'OUTROS'); 
          if (value !== '') {
           SetOutraFonte('');
           }
        }}
        options={fontesOptions}
              />
               {fonteRenda.includes('OUTROS') && (
                <View style={{ marginTop: 10 }}>
                   <Input
                        value={outraFonte}
                        maxLength={150}
                        onChangeText={SetOutraFonte}
                        placeholder="Separe por vírgulas"
                        margin="15px 10px 30px 5px"
                        title="Informe qual ou quais?"
                    />
                </View>
       )}

        {val2 && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                   Informação cadastrada anteriormente: {val2}
                </Text>
        )}
       
       <Input
              value={novaRendaOutrasFontes.beneficiarios?.toString() || ''}
              onChange={(event)=> handleNumberChange(event, 'beneficiarios')}
              maxLength={3}
              keyboardType='numeric'
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Quantos beneficiários dessa fonte?"
       />


        {val3 && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                   Informação cadastrada anteriormente: {val3}
                </Text>
        )}
             
      <Input
              value={novaRendaOutrasFontes.rendaMesTotal.toFixed(2)}
              onChange={handleOnChangeRendimentoMensal}
              maxLength={10}
              keyboardType='numeric'
              placeholder="R$"
              margin="15px 10px 30px 5px"
              title="Total mensal dessa renda"
      />

      

        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={disabled} />
          )}
        </View>

      </RendaOutrasFontesDetailContainer>
    </ScrollView>
  );
};
