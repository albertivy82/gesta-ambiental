import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { RendaOutrasFontesDetailContainer } from "../styles/rendaOutrasFontes.style";
import { useNovaRendaOutrasFontes } from "../hooks/useInputRendasOutrasFontes";
import { FontesRenda } from "../../../enums/fontesRenda.enum";

export interface idParam {
  benfeitoria: BenfeitoriaType;
}

export const NovaRendaOutrasFontes = () => {
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [fonteRenda, setFonteRenda] = useState<string>('');     
  const [outraFonte, SetOutraFonte] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const {  
    novaRendaOutrasFontes,
    handleArrayFieldChange,
    handleNumberChange,
    handleOnChangeRendimentoMensal,
    disabled
  } = useNovaRendaOutrasFontes(params.benfeitoria);
  
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
      const rendaSalva = true; // await enviarRegistro(); 
      if (rendaSalva) {
        // detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
      <RendaOutrasFontesDetailContainer>
        
       
      <RenderPicker
       label="Escolha o tipo de fornecimento de água?"
       selectedValue={fonteRenda}
       onValueChange={(value) => {
       setFonteRenda(value ?? ''); 
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
                        onChangeText={SetOutraFonte}
                        placeholder="Separe por vírgulas"
                        margin="15px 10px 30px 5px"
                        title="Informe qual ou quais?"
                    />
                </View>
       )}

       
       <Input
              value={novaRendaOutrasFontes.beneficiarios?.toString() || ''}
              onChange={(event)=> handleNumberChange(event, 'beneficiarios')}
              keyboardType='numeric'
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Quantos beneficiários dessa fonte?"
       />

             
      <Input
              value={novaRendaOutrasFontes.rendaMesTotal?.toFixed(2) || ''}
              onChange={handleOnChangeRendimentoMensal}
              keyboardType='numeric'
              placeholder="R$"
              margin="15px 10px 30px 5px"
              title="Total mensal dessa renda"
      />

      

        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
          )}
        </View>

      </RendaOutrasFontesDetailContainer>
    </ScrollView>
  );
};
