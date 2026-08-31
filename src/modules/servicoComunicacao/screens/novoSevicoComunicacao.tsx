import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { FormErrors } from "../../../shared/components/FormErrors";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { ServicosComunicacaoType } from "../../../shared/types/ComunicacaoType";
import { useNovoServicoComunicacao } from "../hooks/useInputServCom";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { imovelBody } from "../../../shared/types/imovelType";
import EntrevistadoSection from "../../entrevistadoDetails/ui-component/EntrevistadoSection";
import ImovelSection from "../../imovel/ui-component/imovelSeccion";
import BenfeitoriaSection from "../../entrevistadoDetails/ui-component/BenfeitoriaSection";
import { GlobalContainer } from "../../../shared/components/globalStyles/GlobalContainer";

export interface NovoServicoParams {
  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  benfeitoria: BenfeitoriaType;
  servicosComunicacao?: ServicosComunicacaoType;
}

export const detalharServicoComunicacao = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType) => {
  navigate('', { benfeitoria })
}

export const NovoServicoComunicacao = () => {
  const { params } = useRoute<RouteProp<Record<string, NovoServicoParams>, string>>();
  const benfeitoria = params.benfeitoria;
  const servicosComunicacao = params.servicosComunicacao;
  const navigation = useNavigation<any>();
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviCom, setServCom] = useState<string>('');
  const [outroServCom, SetOutroServCom] = useState<string>('');
  const {
    novoServicoComunicacao,
    enviarRegistro,
    handleEnumChange,
    handleOnChangeInput,
    handleArrayFieldChange,
    validateServicosComunicacao,
    disabled
  } = useNovoServicoComunicacao(benfeitoria, servicosComunicacao);
  const servicosOptions = Object.values([
    "Telefonia rural",
    "Telefonia móvel",
    "Internet",
    "Rádio comunicador",
    "Sinal de TV",
    "Não possui",
    "Não declarado",
    "Outros"
  ]);
  const operadoraOptions = Object.values([
    "Oi",
    "Vivo",
    "Tim",
    "Claro",
    "Não declarado",
    "Outro"
  ]);


  useEffect(() => {
    const servicoInformado = serviCom === 'Outros'
      ? (outroServCom ? [`QUAIS: ${outroServCom}`] : [])  // Se for "SIM", adiciona sobreUso se houver
      : [serviCom];

    handleArrayFieldChange('tipoServicoComunicacao', servicoInformado);
  }, [serviCom, outroServCom]);

  useEffect(() => {
    if (!servicosComunicacao) return;
    handleEnumChange('operadoraServicoComunicacao', servicosComunicacao.operadoraServicoComunicacao)
  }, [servicosComunicacao]);

  const val1 = servicosComunicacao?.tipoServicoComunicacao ? servicosComunicacao.tipoServicoComunicacao : '';

  const handleEnviar = async () => {
    if (loading) return;

    const result = validateServicosComunicacao(novoServicoComunicacao);
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
      const servicoComunicacaoSalvo = await enviarRegistro();
      if (servicoComunicacaoSalvo) {
         navigation.replace("EntrevistadoDetails", {entrevistado: params.entrevistado});
      } else {
        Alert.alert("Erro", "Não foi possível salvar serviço de comunicação. Tente novamente.");
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível realizar a operação.');
    } finally {
      setLoading(false); // 👈 desliga
    }
  };

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
          label="Selecione o tipo de serviço de comunicação informado"
          selectedValue={serviCom}
          onValueChange={(value) => {
            setServCom(value ?? 'Outros');
            if (value !== '') {
              SetOutroServCom('');
            }
          }}
          options={servicosOptions}
        />
        {serviCom.includes('Outros') && (
          <View style={{ marginTop: 10 }}>
            <Input
              value={outroServCom}
              maxLength={100}
              onChangeText={SetOutroServCom}
              placeholder="Separe por vírgulas"
              margin="15px 10px 30px 5px"
              title="Informe qual ou quais?"
            />
          </View>
        )}

        <RenderPicker
          label="Selecione a operadora"
          selectedValue={novoServicoComunicacao.operadoraServicoComunicacao}
          onValueChange={(value) => handleEnumChange('operadoraServicoComunicacao', value)}
          options={operadoraOptions}
        />



        <FormErrors
          visible={showErrors && disabled}
          errors={validateServicosComunicacao(novoServicoComunicacao).errors}
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
