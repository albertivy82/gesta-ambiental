import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { MetodoTratamentoAgua } from "../../../enums/MetodoTratamentoAgua.enum";
import { QualidadeAguaEnum } from "../../../enums/qualidadeAgua.enum";
import { FormErrors } from "../../../shared/components/FormErrors";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import Text from "../../../shared/components/text/Text";
import { theme } from "../../../shared/themes/theme";
import { AguaType } from "../../../shared/types/AguaType";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovaAgua } from "../hooks/useInputAgua";
import EntrevistadoSection from "../../entrevistadoDetails/ui-component/EntrevistadoSection";
import ImovelSection from "../../imovel/ui-component/imovelSeccion";
import BenfeitoriaSection from "../../entrevistadoDetails/ui-component/BenfeitoriaSection";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { imovelBody } from "../../../shared/types/imovelType";
import { GlobalContainer } from "../../../shared/components/globalStyles/GlobalContainer";
import FormSection from "../../../shared/components/FormSection";


export interface NovaAguaParams {
  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  benfeitoria: BenfeitoriaType;
  agua?: AguaType;
}


export const NovaAgua = () => {
  const { params } = useRoute<RouteProp<Record<string, NovaAguaParams>, string>>();
  const navigation = useNavigation<any>();
  const benfeitoria = params.benfeitoria;
  const agua = params.agua;

  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fornecimentoAgua, setFornecimentoAgua] = useState<string>('');
  const [outroFornecimento, SetOutroFornecimento] = useState<string>('');
  const [tratamentoAgua, setTratamentoAgua] = useState<string[]>([]);
  const [outrosTratamentos, setOutrosTratamentos] = useState<string>('');

  const {
    novaAgua,
    enviarRegistro,
    handleArrayFieldChange,
    handleEnumChange,
    handleOnChangeProfundidade,
    disabled,
    validateAgua
  } = useNovaAgua(benfeitoria, agua);


  const abastecimentoOptions = [
    'ABASTECIMENTO PUBLICO',
    'POÇO AMAZONAS',
    'POÇO ARTESIANO',
    'OUTRO',
  ];

  const corOptions = ['INCOLOR (CRISTALINA)', 'APRESENTA COR'];
  const cheiroOptions = Object.values(['NÃO POSSUI CHEIRO', 'APRESENTA CHEIRO']);
  const saborOptions = Object.values(['NÃO POSSUI SABOR', 'APRESENTA SABOR']);
  const qualidadeOptions = Object.values(QualidadeAguaEnum);
  const tratamentoOptions = Object.values(MetodoTratamentoAgua);


  const selecionarOpcaoUnica = (
    selectedValues: string[],
    currentValue: string,
    onSelect: (value: string) => void
  ) => {
    const novaOpcao = selectedValues.find(
      (valor) => valor !== currentValue
    );

    onSelect(novaOpcao ?? '');
  };


  useEffect(() => {
    const fornecimentoInformado = fornecimentoAgua === 'OUTRO'
      ? (outroFornecimento ? [`OUTRO: ${outroFornecimento}`] : [])
      : [fornecimentoAgua];

    handleArrayFieldChange('tipoDeFornecimento', fornecimentoInformado);
  }, [fornecimentoAgua, outroFornecimento]);


  useEffect(() => {
    const base = tratamentoAgua
      .filter((v) => v !== 'OUTROS')
      .map((v) => v.trim());

    const outros = outrosTratamentos.trim()
      ? [`OUTROS: ${outrosTratamentos.trim()}`]
      : [];

    handleArrayFieldChange(
      'metodoTratamento',
      [...new Set([...base, ...outros])]
    );
  }, [tratamentoAgua, outrosTratamentos]);


  const handleEnviar = async () => {

    if (loading) return;

    const result = validateAgua(novaAgua);

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

      const aguaSalva = await enviarRegistro();

      if (aguaSalva) {
        //navigation.replace("EntrevistadoDetails", {entrevistado: params.entrevistado});
        navigation.goBack();
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível salvar a benfeitoria. Tente novamente."
        );
        navigation.goBack();
      }

    } catch (e) {
      Alert.alert(
        'Erro',
        'Não foi possível realizar a operação.'
      );
    } finally {
      setLoading(false); // 👈 desliga
    }
  };


  useEffect(() => {
    if (!agua) return;

    handleEnumChange('qualidadeDaAgua', agua.qualidadeDaAgua);
    handleEnumChange('corDagua', agua.corDagua);
    handleEnumChange('saborDagua', agua.saborDagua);
    handleEnumChange('cheiroDagua', agua.cheiroDagua);
  }, [agua]);


  const tipoFornecimento = agua?.tipoDeFornecimento
    ? agua.tipoDeFornecimento
    : '';

  const metTratamento = agua?.metodoTratamento
    ? agua.metodoTratamento
    : '';

  const profundidade = agua?.profundidadePoco
    ? agua.profundidadePoco.toFixed(2)
    : '';


  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
      <GlobalContainer>

        <EntrevistadoSection
          entrevistado={params.entrevistado}
          actionsEnabled={false}
        />

        <ImovelSection
          entrevistado={params.entrevistado}
          imovel={params.imovel}
          actionsEnabled={false}
        />

        <BenfeitoriaSection
          entrevistado={params.entrevistado}
          imovel={params.imovel}
          benfeitoria={params.benfeitoria}
          actionsEnabled={false}
        />

        <FormSection
          title="E - Informações Sobre a Qualidade da Água da Construção"
          initiallyOpen
          collapsible={false}
        >

          {tipoFornecimento && (
            <Text
              style={{
                fontStyle: 'italic',
                color: 'gray',
                marginBottom: 5
              }}
            >
              Informação dada anteriormente: {tipoFornecimento}
            </Text>
          )}

          <CheckboxSelector
            options={abastecimentoOptions}
            selectedValues={
              fornecimentoAgua ? [fornecimentoAgua] : []
            }
            label="Qual o tipo de fornecimento de água da moradia?"
            onSave={(values) =>
              selecionarOpcaoUnica(
                values,
                fornecimentoAgua,
                (value) => {
                  setFornecimentoAgua(value);

                  if (value !== '') {
                    SetOutroFornecimento('');
                  }
                }
              )
            }
          />

          {fornecimentoAgua.includes('OUTRO') && (
            <View style={{ marginTop: 10 }}>
              <Input
                maxLength={75}
                value={outroFornecimento}
                onChangeText={SetOutroFornecimento}
                margin="15px 10px 30px 5px"
                title="Informe qual"
              />
            </View>
          )}


          {profundidade && (
            <Text
              style={{
                fontStyle: 'italic',
                color: 'gray',
                marginBottom: 5
              }}
            >
              área informada anteriormente: {profundidade}
            </Text>
          )}

          {fornecimentoAgua.includes('POÇO') && (
            <View style={{ marginTop: 10 }}>
              <Input
                value={novaAgua.profundidadePoco?.toString() || ''}
                maxLength={5}
                onChange={handleOnChangeProfundidade}
                keyboardType='decimal-pad'
                placeholder="Ex: 10.5"
                placeholderTextColor={theme.colors.grayTheme.gray80}
                margin="15px 10px 30px 5px"
                title="Profundidade do Poço"
              />
            </View>
          )}


          <CheckboxSelector
            options={qualidadeOptions}
            selectedValues={
              novaAgua.qualidadeDaAgua
                ? [novaAgua.qualidadeDaAgua]
                : []
            }
            label="Qualidade da água"
            onSave={(values) =>
              selecionarOpcaoUnica(
                values,
                novaAgua.qualidadeDaAgua ?? '',
                (value) =>
                  handleEnumChange('qualidadeDaAgua', value)
              )
            }
          />


          {metTratamento && (
            <Text
              style={{
                fontStyle: 'italic',
                color: 'gray',
                marginBottom: 5
              }}
            >
              Informação dada anteriormente: {metTratamento}
            </Text>
          )}

          <CheckboxSelector
            options={tratamentoOptions}
            selectedValues={tratamentoAgua}
            label="Qual o método utilizado para tratamento da água"
            onSave={(selectedValues) => {
              setTratamentoAgua(selectedValues);

              if (!selectedValues.includes('OUTROS')) {
                setOutrosTratamentos('');
              }
            }}
          />

          {tratamentoAgua.includes('OUTROS') && (
            <View style={{ marginTop: 10 }}>
              <Input
                maxLength={95}
                value={outrosTratamentos}
                onChangeText={setOutrosTratamentos}
                placeholder="..."
                margin="15px 10px 30px 5px"
                title="Informe qual:"
              />
            </View>
          )}


          <CheckboxSelector
            options={corOptions}
            selectedValues={
              novaAgua.corDagua
                ? [novaAgua.corDagua]
                : []
            }
            label="Cor da água"
            onSave={(values) =>
              selecionarOpcaoUnica(
                values,
                novaAgua.corDagua ?? '',
                (value) =>
                  handleEnumChange('corDagua', value)
              )
            }
          />


          <CheckboxSelector
            options={cheiroOptions}
            selectedValues={
              novaAgua.cheiroDagua
                ? [novaAgua.cheiroDagua]
                : []
            }
            label="Cheiro da água"
            onSave={(values) =>
              selecionarOpcaoUnica(
                values,
                novaAgua.cheiroDagua ?? '',
                (value) =>
                  handleEnumChange('cheiroDagua', value)
              )
            }
          />


          <CheckboxSelector
            options={saborOptions}
            selectedValues={
              novaAgua.saborDagua
                ? [novaAgua.saborDagua]
                : []
            }
            label="Sabor da água"
            onSave={(values) =>
              selecionarOpcaoUnica(
                values,
                novaAgua.saborDagua ?? '',
                (value) =>
                  handleEnumChange('saborDagua', value)
              )
            }
          />


          <FormErrors
            visible={showErrors && disabled}
            errors={validateAgua(novaAgua).errors}
          />

          <Button
            title={loading ? "Enviando..." : "Enviar"}
            onPress={handleEnviar}
            color={"#ff4500"}
            disabled={loading}
          />

        </FormSection>
      </GlobalContainer>
    </ScrollView>
  );
};