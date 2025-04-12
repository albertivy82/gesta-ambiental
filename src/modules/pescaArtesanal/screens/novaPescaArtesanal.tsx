import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { FontesRenda } from "../../../enums/fontesRenda.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useInputPescaArtesanal } from "../hooks/useInputPescaArtesanal";
import { PescaArtesanalDetailContainer } from "../styles/pescaArtesanal.style";
import { PescaArtesanalType } from "../../../shared/types/PescaArtesanal";


export interface idParam {
  benfeitoria: BenfeitoriaType;
}

export const detalharPescaArtesanal = (navigate: NavigationProp<ParamListBase>['navigate'], pescaArtesanal: PescaArtesanalType)=>{
  navigate('PescaArtesanalDetails', {pescaArtesanal})
}

export const NovaPescaArtesanal = () => {
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [fonteRenda, setFonteRenda] = useState<string>('');     
  const [outraFonte, SetOutraFonte] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const {  
    novaPescaArtesanal,
    enviarRegistro,
    handleNumberChange,
    handleArrayFieldChange,
    disabled
  } = useInputPescaArtesanal(params.benfeitoria);
  
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
             const pescaArtesanalSalvo = await enviarRegistro(); 
                 if (pescaArtesanalSalvo){
                   detalharPescaArtesanal(navigation.navigate, pescaArtesanalSalvo);
                 } else {
                   Alert.alert("Erro", "Não foi possível salvar a pescaArtesanal. Tente novomente.");
                   navigation.goBack();
                 }
           } catch (error) {
             console.error("Erro no envio:", error);
             Alert.alert("Erro ao enviar", "Tente novomente mais tarde.");
           } finally {
             setLoading(false);
           }
         };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
      <PescaArtesanalDetailContainer>
        

      <Input
              value={novaPescaArtesanal.concordaDefeso?.toString() || ''}
              onChange={(event)=> handleNumberChange(event, 'beneficiarios')}
              keyboardType='numeric'
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Quantos beneficiários dessa fonte?"
       />

             
      <Input
              value={novaPescaArtesanal.combustivelPorViagem?.toFixed(2) || ''}
              onChange={handleOnChangeRendimentoMensal}
              keyboardType='numeric'
              placeholder="R$"
              margin="15px 10px 30px 5px"
              title="Total mensal dessa renda"
      />

       
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

       
    

      

        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
          )}
        </View>

      </PescaArtesanalDetailContainer>
    </ScrollView>
  );
};
