import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { FontesRenda } from "../../../enums/fontesRenda.enum";
import { FormErrors } from "../../../shared/components/FormErrors";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { RendaOutrasFontesType } from "../../../shared/types/RendaOutrasFontesType";
import { useNovaRendaOutrasFontes } from "../hooks/useInputRendasOutrasFontes";
import EntrevistadoSection from "../../entrevistadoDetails/ui-component/EntrevistadoSection";
import ImovelSection from "../../imovel/ui-component/imovelSeccion";
import BenfeitoriaSection from "../../entrevistadoDetails/ui-component/BenfeitoriaSection";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { imovelBody } from "../../../shared/types/imovelType";
import { GlobalContainer } from "../../../shared/components/globalStyles/GlobalContainer";

export interface NovoCreditoParams {
  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  benfeitoria: BenfeitoriaType;
  renda?: RendaOutrasFontesType;
}



export const NovaRendaOutrasFontes = () => {
  const { params } = useRoute<RouteProp<Record<string, NovoCreditoParams>, string>>();
  const benfeitoria = params.benfeitoria;
  const renda = params.renda;
  const navigation = useNavigation<any>();
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fonteRenda, setFonteRenda] = useState<string>('');
  const [outraFonte, SetOutraFonte] = useState<string>('');
  const {
    novaRendaOutrasFontes,
    enviarRegistro,
    handleArrayFieldChange,
    handleNumberChange,
    handleOnChangeRendimentoMensal,
    validateRendaOutrasFontes,
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
    if (loading) return;

    const result = validateRendaOutrasFontes(novaRendaOutrasFontes);
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

      const rendaSalva = await enviarRegistro();
      if (rendaSalva) {
        navigation.replace("EntrevistadoDetails", {entrevistado: params.entrevistado});
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


  const val1 = renda?.fonte ? renda.fonte : '';
  const val2 = renda?.beneficiarios ? renda.beneficiarios : '';
  const val3 = renda?.rendaMesTotal ? renda.rendaMesTotal : '';
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
      <GlobalContainer>

        <EntrevistadoSection entrevistado={params.entrevistado} />
        <ImovelSection entrevistado={params.entrevistado} imovel={params.imovel} />
        <BenfeitoriaSection entrevistado={params.entrevistado} imovel={params.imovel} benfeitoria={params.benfeitoria} />

        {val1 && (
          <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
            Informação cadastrada anteriormente:  {val1}
          </Text>
        )}
        <RenderPicker
          label="Selecione uma fonte de renda (além da atividade produtiva principal):"
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
              title="Informe qual(is):"
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
          onChange={(event) => handleNumberChange(event, 'beneficiarios')}
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



        <FormErrors
          visible={showErrors && disabled}
          errors={validateRendaOutrasFontes(novaRendaOutrasFontes).errors}
        />

        <Button
          title={loading ? "Enviando..." : "Enviar"}
          onPress={handleEnviar}
          color={"#ff4500"}
          disabled={loading}   // 👈 trava só enquanto envia
        />


      </GlobalContainer>
    </ScrollView>
  );
};
