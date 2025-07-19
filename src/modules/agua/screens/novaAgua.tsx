import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovaAgua } from "../hooks/useInputAgua";
import { AguaDetailContainer } from "../styles/agua.style";
import { QualidadeAguaEnum } from "../../../enums/qualidadeAgua.enum";
import { MetodoTratamentoAgua } from "../../../enums/MetodoTratamentoAgua.enum";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import { AguaType } from "../../../shared/types/AguaType";


export interface NovaAveParams {
  benfeitoria: BenfeitoriaType;
  agua?: AguaType;
}

export const detalharAgua = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType) => {
  navigate('AguaLista', { benfeitoria });
};

export const NovaAgua = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, NovaAveParams>, string>>();
  const benfeitoria = params.benfeitoria ?? params.agua?.benfeitoria;
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
    disabled
  } = useNovaAgua(params.benfeitoria, agua);

  const abastecimentoOptions = Object.values([
    'ABASTECIMENTO PUBLICO', 'POÇO AMAZONAS',
    'POÇO ARTESIANO',
    'OUTRO'
  ]);

  const corOptions = Object.values(['INCOLOR (CRISTALINA)', 'COR']);
  const cheiroOptions = Object.values(['NÃO POSSUI CHEIRO', 'CHEIRO']);
  const saborOptions = Object.values(['NÃO POSSUI SABOR', 'SABOR']);
  const qualidadeOptions = Object.values(QualidadeAguaEnum);
  const tratamentoOptions = Object.values(MetodoTratamentoAgua);


  useEffect(() => {
    const fornecimentoInformado = fornecimentoAgua === 'OUTRO' 
    ? (outroFornecimento ? [`OUTRO: ${outroFornecimento}`] : [])  // Se for "SIM", adiciona sobreUso se houver
    : [fornecimentoAgua];

    handleArrayFieldChange('tipoDeFornecimento', fornecimentoInformado);
  }, [fornecimentoAgua, outroFornecimento]);

  useEffect(()=>{
    const consolidaDados = [
      ...tratamentoAgua.filter((item) => item !== 'OUTROS'),
      ...(outrosTratamentos ? [`Outros ${outrosTratamentos}`] : []),
    ];

    handleArrayFieldChange('metodoTratamento', consolidaDados);
  
  },[tratamentoAgua, outrosTratamentos ])

  const handleEnviar = async () => {
    setLoading(true);
    try {
      const aguaSalva = await enviarRegistro();
      if (aguaSalva) {
        detalharAgua(navigation.navigate, benfeitoria);
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
      <AguaDetailContainer>

       
      <RenderPicker
       label="Qual o tipo de fornecimento de água da moradia?"
       selectedValue={fornecimentoAgua}
       onValueChange={(value) => {
       setFornecimentoAgua(value ?? ''); 
          if (value !== '') {
           SetOutroFornecimento('OUTRO:');
           }
        }}
        options={abastecimentoOptions}
              />
               {fornecimentoAgua.includes('OUTRO') && (
                <View style={{ marginTop: 10 }}>
                   <Input
                        value={outroFornecimento}
                        onChangeText={SetOutroFornecimento}
                        placeholder="Separe por vírgulas"
                        margin="15px 10px 30px 5px"
                        title="Qual(is) a(s) instituição(ões) e que tipo de trabalho desenvolve?"
                    />
                </View>
       )}

             <RenderPicker
              label="Qualidade da água"
              selectedValue={novaAgua.qualidadeDaAgua}
               onValueChange={(value) => handleEnumChange('qualidadeDaAgua', value)}
               options={qualidadeOptions}
              />

             <RenderPicker
              label="Cor da água"
              selectedValue={novaAgua.corDagua}
               onValueChange={(value) => handleEnumChange('qualidadeDaAgua', value)}
               options={corOptions}
              />
              
              <RenderPicker
              label="Cheiro da água"
              selectedValue={novaAgua.cheiroDagua}
               onValueChange={(value) => handleEnumChange('qualidadeDaAgua', value)}
               options={cheiroOptions}
              />
              
              <RenderPicker
              label="Sabor da água"
              selectedValue={novaAgua.saborDagua}
               onValueChange={(value) => handleEnumChange('qualidadeDaAgua', value)}
               options={saborOptions}
              />

            <CheckboxSelector
                options={tratamentoOptions}
                selectedValues={tratamentoAgua}
                label="Qual o método utilizado para tratamento da água"
                onSave={(selectedValues) => {
                    setTratamentoAgua(selectedValues);
                    if (!selectedValues.includes('OUTRO')) {
                        setOutrosTratamentos('');
                    }
                }}
            />
            {tratamentoAgua.includes('OUTRO') && (
                <View style={{ marginTop: 10 }}>
                    <Input
                        value={outrosTratamentos}
                        onChangeText={setOutrosTratamentos}
                        placeholder="..."
                        margin="15px 10px 30px 5px"
                        title="Informe qual:"
                    />
                </View>
            )}

            {fornecimentoAgua.includes('POÇO AMAZONAS') 
            ||fornecimentoAgua.includes('POÇO ARTESIANO') &&
            ( <View style={{ marginTop: 10 }}>
              <Input
                  value={outrosTratamentos}
                  onChangeText={setOutrosTratamentos}
                  placeholder="..."
                  margin="15px 10px 30px 5px"
                  title="Informe qual:"
              />
             </View>)
            }

        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
          )}
        </View>

      </AguaDetailContainer>
    </ScrollView>
  );
};
