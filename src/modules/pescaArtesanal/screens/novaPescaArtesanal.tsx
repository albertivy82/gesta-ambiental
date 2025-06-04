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
import { RenderTimePicker } from "../../../shared/components/input/renderTimerPicker";


export interface idParam {
  benfeitoria: BenfeitoriaType;
}

export const detalharPescaArtesanal = (navigate: NavigationProp<ParamListBase>['navigate'], pescaArtesanal: PescaArtesanalType)=>{
  navigate('PescaArtesanalDetails', {pescaArtesanal})
}

export const NovaPescaArtesanal = () => {
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [horaPreferida, setHoraPreferida] = useState<number | null>(null);
  const [minutoPreferido, setMinutoPreferido] = useState<number | null>(null);
  const [horasPorDia, setHoraPorDia] = useState<number | null>(null);
  const [minutoPorDia, setMinutPorDia] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const {  
    novaPescaArtesanal,
    enviarRegistro,
    handleNumberChange,
    handleOnChangeInput,
    handleArrayFieldChange,
    handleEnumChange,
    handleOnChangeMedidasPesca,
    handleHoraMinutoFieldChange,
    disabled
  } = useInputPescaArtesanal(params.benfeitoria);
  
  
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
       value={novaPescaArtesanal.freqPescaSemanal?.toString() || ''} 
       onChange={(event)=> handleNumberChange(event, 'freqPescaSemanal')}
       keyboardType='numeric'
       placeholder="Número Inteiro"
       margin="15px 10px 30px 5px"
       title="Qual a freqência de pescas por semana?"
      />
             

       <RenderTimePicker
        label="Quantas horas por dia pesca?"
        hour={horasPorDia}
        minute={minutoPorDia}
        onChangeHour={(value) => {
          setHoraPreferida(value);
          handleHoraMinutoFieldChange('horasPorDia', value, minutoPreferido);
        }}
        onChangeMinute={(value) => {
          setMinutoPreferido(value);
          handleHoraMinutoFieldChange('horasPorDia', horaPreferida, value);
        }}
        />

      <Input
        value={novaPescaArtesanal.localDaPesca}
        onChange={(event)=> handleOnChangeInput(event, 'localDaPesca')}
        placeholder="Local onde realiza a pesca"
        margin="15px 10px 30px 5px"
        title="Local da pesca"
      />

      <RenderTimePicker
        label="Horário preferido da pesca"
        hour={horaPreferida}
        minute={minutoPreferido}
        onChangeHour={(value) => {
          setHoraPreferida(value);
          handleHoraMinutoFieldChange('horarioPrefencialPesca', value, minutoPreferido);
        }}
        onChangeMinute={(value) => {
          setMinutoPreferido(value);
          handleHoraMinutoFieldChange('horarioPrefencialPesca', horaPreferida, value);
        }}
        />


        <Input
          value={novaPescaArtesanal.descartePorPescaria?.toFixed(2) || ''}
          onChange={(event) => handleOnChangeMedidasPesca('descartePorPescaria', event)}
          keyboardType='numeric'
          placeholder="Quantidade em KG"
          margin="15px 10px 30px 5px"
          title="Descarte de pescado (kg)"
        />



      <Input
        value={novaPescaArtesanal.conservacaoPeixe}
        onChange={(event)=> handleOnChangeInput(event, 'conservacaoPeixe')}
        placeholder="Como conserva o peixe"
        margin="15px 10px 30px 5px"
        title="Forma de conservação do peixe"
      />

      <Input
        value={novaPescaArtesanal.custeio}
        onChange={(event)=> handleOnChangeInput(event, 'custeio')}
        placeholder="Como pesca é custeada?"
        margin="15px 10px 30px 5px"
        title="Custeio da pesca"
      />

      
        <Input
          value={novaPescaArtesanal.geloPorPescaria?.toFixed(2) || ''}
          onChange={(event) => handleOnChangeMedidasPesca('geloPorPescaria', event)}
          keyboardType='numeric'
          placeholder="Quantidade em KG"
          margin="15px 10px 30px 5px"
          title="Gelo por pescaria"
        />


      <Input
          value={novaPescaArtesanal.custoGeloPorPescaria?.toFixed(2) || ''}
          onChange={(event) => handleOnChangeMedidasPesca('custoGeloPorPescaria', event)}
          keyboardType="numeric"
          placeholder="Custo total em R$"
          margin="15px 10px 30px 5px"
          title="Custo do gelo por pescaria"
        />

      <Input
        value={novaPescaArtesanal.composicaoRancho}
        onChange={(event)=> handleOnChangeInput(event, 'composicaoRancho')}
        placeholder="Descreva a composição do rancho"
        margin="15px 10px 30px 5px"
        title="Composição do rancho"
      />

      <Input
       value={novaPescaArtesanal.custoRanchoPorViagem?.toFixed(2) || ''}
       onChange={(event) => handleOnChangeMedidasPesca('custoRanchoPorViagem', event)}
        keyboardType="numeric"
        placeholder="Custo em R$"
        margin="15px 10px 30px 5px"
        title="Custo do rancho por viagem"
      />

      <Input
      value={novaPescaArtesanal.combustivelPorViagem?.toFixed(2) || ''}
      onChange={(event) => handleOnChangeMedidasPesca('combustivelPorViagem', event)}
      keyboardType="numeric"
      placeholder="Litros por viagem"
      margin="15px 10px 30px 5px"
      title="Combustível por viagem"
      />

      <Input
      value={novaPescaArtesanal.custoCombustivelPorViagem?.toFixed(2) || ''}
      onChange={(event) => handleOnChangeMedidasPesca('custoCombustivelPorViagem', event)}
      keyboardType="numeric"
      placeholder="R$"
      margin="15px 10px 30px 5px"
      title="Custo do combustível por viagem"
      />

      <Input
        value={novaPescaArtesanal.localDesembarque}
        onChange={(event)=> handleOnChangeInput(event, 'localDesembarque')}
        placeholder="Local de desembarque"
        margin="15px 10px 30px 5px"
        title="Local de desembarque"
      />

      <Input
        value={novaPescaArtesanal.pescaPorSafra?.toFixed(2) || ''}
        onChange={(event) => handleOnChangeMedidasPesca('pescaPorSafra', event)}
        keyboardType="numeric"
        placeholder="Nº de vezes"
        margin="15px 10px 30px 5px"
        title="Quantidade de pescas por safra"
      />

      <Input
        value={novaPescaArtesanal.localPescaSafra}
        onChange={(event)=> handleOnChangeInput(event, 'localPescaSafra')}
        placeholder="Informe onde pesca na safra"
        margin="15px 10px 30px 5px"
        title="Local da pesca na safra"
      />

      <Input
        value={novaPescaArtesanal.localDeReproducaoPeixe}
        onChange={(event)=> handleOnChangeInput(event, 'localDeReproducaoPeixe')}
        placeholder="Informe local de reprodução dos peixes"
        margin="15px 10px 30px 5px"
        title="Local de reprodução do peixe"
      />

      <Input
        value={novaPescaArtesanal.periodoDefeso}
        onChange={(event)=> handleOnChangeInput(event, 'localDeReproducaoPeixe')}
        placeholder="Ex: novembro a março"
        margin="15px 10px 30px 5px"
        title="Período de defeso"
      />

      <RenderPicker
        label="Você conhece o defeso?"
        selectedValue={novaPescaArtesanal.conheceDefeso}
        onValueChange={(value) => handleEnumChange('conheceDefeso', value)}
        options={['SIM', 'NÃO']}
      />

      <RenderPicker
        label="Você concorda com o defeso?"
        selectedValue={novaPescaArtesanal.concordaDefeso}
        onValueChange={(value) => handleEnumChange('concordaDefeso', value)}
        options={['SIM', 'NÃO']}
      />

      <RenderPicker
        label="Você recebe o defeso?"
        selectedValue={novaPescaArtesanal.recebeDefeso}
        onValueChange={(value) => handleEnumChange('recebeDefeso', value)}
        options={['SIM', 'NÃO']}
      />

   

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
