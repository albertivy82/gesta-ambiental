import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { MetodoTratamentoAgua } from "../../../enums/MetodoTratamentoAgua.enum";
import { QualidadeAguaEnum } from "../../../enums/qualidadeAgua.enum";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { theme } from "../../../shared/themes/theme";
import { AguaType } from "../../../shared/types/AguaType";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovaAgua } from "../hooks/useInputAgua";
import { AguaDetailContainer } from "../styles/agua.style";


export interface NovaAguaParams {
  benfeitoria: BenfeitoriaType;
  agua?: AguaType;
}

export const detalharAgua = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType) => {
  navigate('AguaLista', { benfeitoria });
};

export const NovaAgua = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, NovaAguaParams>, string>>();
  const benfeitoria = params.benfeitoria;
  const agua = params.agua;
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


  useEffect(() => {
    const fornecimentoInformado = fornecimentoAgua === 'OUTRO' 
    ? (outroFornecimento ? [`OUTRO: ${outroFornecimento}`] : [])  // Se for "SIM", adiciona sobreUso se houver
    : [fornecimentoAgua];

    handleArrayFieldChange('tipoDeFornecimento', fornecimentoInformado);
  }, [fornecimentoAgua, outroFornecimento]);

  useEffect(() => {
    const base = tratamentoAgua
      .filter((v) => v !== 'OUTROS')
      .map((v) => v.trim());
  
    const outros = outrosTratamentos.trim() ? [`OUTROS: ${outrosTratamentos.trim()}`] : [];
  
    handleArrayFieldChange('metodoTratamento', [...new Set([...base, ...outros])]);
  }, [tratamentoAgua, outrosTratamentos]);
  

  const handleEnviar = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = validateAgua(novaAgua);
      if (!result.isValid) {
        const msg = [
          'Por favor, corrija os itens abaixo:',
          '',
          ...result.errors.map((e, idx) => `${idx + 1}. ${e.message}`),
        ].join('\n');
  
        Alert.alert('Campos obrigatórios ou inválidos', msg);
        return; // deixa o finally desligar o loading
      }
  
      const aguaSalva = await enviarRegistro();
      if (aguaSalva) {
        detalharAgua(navigation.navigate, benfeitoria);
      } else {
        Alert.alert('Erro', 'Não foi possível salvar a benfeitoria. Tente novamente.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro no envio:', error);
      Alert.alert('Erro ao enviar', 'Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (!agua) return;
    handleEnumChange( 'qualidadeDaAgua', agua.qualidadeDaAgua);
    handleEnumChange( 'corDagua', agua.corDagua);
    handleEnumChange( 'saborDagua', agua.saborDagua);
    handleEnumChange( 'cheiroDagua', agua.cheiroDagua);
  }, [agua]);
                  
  const tipoFornecimento = agua?.tipoDeFornecimento ? agua.tipoDeFornecimento : '';
  const metTratamento = agua?.metodoTratamento ? agua.metodoTratamento : '';
  const profundidade = agua?.profundidadePoco ? agua.profundidadePoco.toFixed(2)  : '';
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA'  }}>
      <AguaDetailContainer>

      {tipoFornecimento && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteriormente: {tipoFornecimento}
                </Text>
        )}
      <RenderPicker
       label="Qual o tipo de fornecimento de água da moradia?"
       selectedValue={fornecimentoAgua}
       onValueChange={(value) => {
       setFornecimentoAgua(value ?? ''); 
          if (value !== '') {
           SetOutroFornecimento('');
           }
        }}
        options={abastecimentoOptions}
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

             <RenderPicker
              label="Qualidade da água"
              selectedValue={novaAgua.qualidadeDaAgua}
               onValueChange={(value) => handleEnumChange('qualidadeDaAgua', value)}
               options={qualidadeOptions}
              />

{metTratamento && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
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


             <RenderPicker
              label="Cor da água"
              selectedValue={novaAgua.corDagua}
               onValueChange={(value) => handleEnumChange('corDagua', value)}
               options={corOptions}
              />
              
              <RenderPicker
              label="Cheiro da água"
              selectedValue={novaAgua.cheiroDagua}
               onValueChange={(value) => handleEnumChange('cheiroDagua', value)}
               options={cheiroOptions}
              />
              
              <RenderPicker
              label="Sabor da água"
              selectedValue={novaAgua.saborDagua}
               onValueChange={(value) => handleEnumChange('saborDagua', value)}
               options={saborOptions}
              />

          {profundidade && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
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


        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={disabled} />
          )}
        </View>

      </AguaDetailContainer>
    </ScrollView>
  );
};
