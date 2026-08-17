import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView } from "react-native";
import { FormErrors } from "../../../shared/components/FormErrors";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { AtividadeProdutivaType } from "../../../shared/types/AtividadeProdutiva";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovaAtvProd } from "../hooks/useInputAtvProd";
import { AtividadeDetailContainer } from "../styles/ativdade.style";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { imovelBody } from "../../../shared/types/imovelType";
import EntrevistadoSection from "../../entrevistadoDetails/ui-component/EntrevistadoSection";
import ImovelSection from "../../imovel/ui-component/imovelSeccion";
import BenfeitoriaSection from "../../benfeitoriaDetails/ui-components/BenfeitoriaSection";


export interface NovaAtividadeParams {
  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  benfeitoria: BenfeitoriaType;
  atividadeProdutiva?: AtividadeProdutivaType;
}


export const NovaAtividade = () => {
  const { params } = useRoute<RouteProp<Record<string, NovaAtividadeParams>, string>>();
  const navigation = useNavigation<any>();
  const benfeitoria = params.benfeitoria;
  const atividadeProdutiva = params.atividadeProdutiva;
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const { novaAtividade,
    enviarRegistro,
    handleEnumChange,
    handleNumberChange,
    handleOnChangeRendimentoMensal,
    validateAtividadeProdutiva,
    disabled
  } = useNovaAtvProd(benfeitoria, atividadeProdutiva);


  const atividadeOptions = Object.values(
    ["PESCA ARTESANAL", "COMÉRCIO", "SERVIÇO", "INDÚSTRIA E COMÉRCIO", "SERVIÇOE COMÉRCIO"]
  );

  const handleEnviar = async () => {
    if (loading) return;

    const result = validateAtividadeProdutiva(novaAtividade);
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
      const atividadeSalva = await enviarRegistro();
      console.log("ppp", atividadeSalva);
      if (atividadeSalva) {
         navigation.replace("EntrevistadoDetails", {entrevistado: params.entrevistado});
      } else {
        Alert.alert("Erro", "Não foi possível salvar a atividadeProdutiva. Tente novamente.");
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível realizar a operação.');
    } finally {
      setLoading(false); // 👈 desliga
    }
  };

  useEffect(() => {
    if (!atividadeProdutiva) return;
    handleEnumChange('atividade', atividadeProdutiva.atividade);

  }, [atividadeProdutiva]);

  const valorSalvoPessoas = atividadeProdutiva?.pessoasEnvolvidas ? atividadeProdutiva.pessoasEnvolvidas.toFixed(2) : '';
  const valorSalvoRendimento = atividadeProdutiva?.faturamentoAtividadeMesTotal ? atividadeProdutiva.faturamentoAtividadeMesTotal : '';
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
      <AtividadeDetailContainer>
         <EntrevistadoSection entrevistado={params.entrevistado} />
        <ImovelSection entrevistado={params.entrevistado} imovel={params.imovel} />
        <BenfeitoriaSection entrevistado={params.entrevistado} imovel={params.imovel} benfeitoria={params.benfeitoria} />
        <RenderPicker
          label="A qual ramo pertence a atividade realizada?"
          selectedValue={novaAtividade.atividade}
          onValueChange={(value) => handleEnumChange('atividade', value)}
          options={atividadeOptions}
        />


        {valorSalvoPessoas && (
          <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
            Informação cadastrada anteriormente: {valorSalvoPessoas}
          </Text>
        )}

        <Input
          value={novaAtividade.pessoasEnvolvidas?.toString() || ''}
          maxLength={3}
          onChange={(event) => handleNumberChange(event, 'pessoasEnvolvidas')}
          keyboardType='numeric'
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Quantas pessoas de sua residência estão envolvidas na atividade?"
        />

        {valorSalvoRendimento && (
          <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
            Informação cadastrada anteriormente: {valorSalvoRendimento}
          </Text>
        )}
        <Input
          value={novaAtividade.faturamentoAtividadeMesTotal.toFixed(2)}
          maxLength={9}
          onChange={handleOnChangeRendimentoMensal}
          keyboardType="numeric"
          placeholder="R$"
          title="Informe o rendimento mensal aproximado da atividade"
        />


        <FormErrors
          visible={showErrors && disabled}
          errors={validateAtividadeProdutiva(novaAtividade).errors}
        />

        <Button
          title={loading ? "Enviando..." : "Enviar"}
          onPress={handleEnviar}
          color={"#ff4500"}
          disabled={loading}   // 👈 trava só enquanto envia
        />


      </AtividadeDetailContainer>
    </ScrollView>
  )
} 