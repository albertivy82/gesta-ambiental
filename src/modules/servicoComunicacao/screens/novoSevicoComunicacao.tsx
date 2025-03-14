import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovoServicoComunicacao } from "../hooks/useInputServCom";
import { ServicoComunicacaoDetailContainer } from "../styles/servicoComunicacao.style";

export interface idParam {
  entrevistado: EntrevistadoType;
}

export const NovoServicoComunicacao = () => {
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [loading, setLoading] = useState(false); 
  const [outrosUsos, setOutrosUsos] = useState<string>('');     
  const [qual, SetQual] = useState<string>('');
  
  const {  
    novoServicoComunicacao,
    handleOnChangeInput,
    handleEnumChange,
    handleArrayFieldChange,
    disabled
  } = useNovoServicoComunicacao(params.entrevistado);

  useEffect(() => {
    const consolidaDados = outrosUsos === 'SIM' 
      ? (qual ? [`ocorrencia: ${qual}`] : [])  
      : ['NÃO']; 

    handleArrayFieldChange('usoOutros', consolidaDados);
  }, [outrosUsos, qual]);

  const simNaoOptions = Object.values(SimNao);
    
  const handleEnviar = async () => {
    setLoading(true);
    try {
      const servicoComunicacaoSalvo = true; //await enviarRegistro(); 
      if (servicoComunicacaoSalvo) {
        //detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
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
      <ServicoComunicacaoDetailContainer>
        
        <Input 
          value={novoServicoComunicacao.tipoServicoComunicacao} 
          onChange={(event) => handleOnChangeInput(event, 'tipoServicoComunicacao')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Informe o tipo de serviço de comunicação:"
        />

        <RenderPicker
          label="O serviço de comunicação é utilizado para fins comerciais?"
          selectedValue={novoServicoComunicacao.usoComercio}
          onValueChange={(value) => handleEnumChange('usoComercio', value)}
          options={simNaoOptions}
        />

        <RenderPicker
          label="O serviço de comunicação é utilizado para fins pessoais?"
          selectedValue={novoServicoComunicacao.usoPessoal}
          onValueChange={(value) => handleEnumChange('usoPessoal', value)}
          options={simNaoOptions}
        />

        <RenderPicker
          label="O serviço de comunicação é essencial para suas atividades?"
          selectedValue={novoServicoComunicacao.servicoEssencial}
          onValueChange={(value) => handleEnumChange('servicoEssencial', value)}
          options={simNaoOptions}
        />

        <RenderPicker
          label="Faz outro uso do serviço de comunicação?"
          selectedValue={outrosUsos}
          onValueChange={(value) => {
            setOutrosUsos(value ?? ''); 
            if (value !== 'SIM') {
              SetQual('');
            }
          }}
          options={['SIM', 'NÃO']}
        />
        {outrosUsos.includes('SIM') && (
          <View style={{ marginTop: 10 }}>
            <Input
              value={qual}
              onChangeText={SetQual}
              placeholder="Separe as informações por vírgula"
              margin="15px 10px 30px 5px"
              title="Qual?"
            />
          </View>
        )}

        <Input 
          value={novoServicoComunicacao.problemasRelacionados} 
          onChange={(event) => handleOnChangeInput(event, 'problemasRelacionados')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Quais problemas relacionados ao serviço de comunicação?"
        />

        <Input 
          value={novoServicoComunicacao.tipoAmeaca} 
          onChange={(event) => handleOnChangeInput(event, 'tipoAmeaca')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="O serviço de comunicação enfrenta algum tipo de ameaça?"
        />

        <Input 
          value={novoServicoComunicacao.localDisponibilidade} 
          onChange={(event) => handleOnChangeInput(event, 'localDisponibilidade')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Onde o serviço de comunicação está disponível?"
        />

        <Input 
          value={novoServicoComunicacao.importanciaServico} 
          onChange={(event) => handleOnChangeInput(event, 'importanciaServico')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Qual a importância do serviço de comunicação?"
        />

        <Input 
          value={novoServicoComunicacao.fonteDeInformacao} 
          onChange={(event) => handleOnChangeInput(event, 'fonteDeInformacao')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Qual a principal fonte de informação utilizada?"
        />

        <Input 
          value={novoServicoComunicacao.descricaoEspontanea} 
          onChange={(event) => handleOnChangeInput(event, 'descricaoEspontanea')}
          placeholder="..."
          margin="15px 10px 30px 5px"
          title="Deseja acrescentar mais informações sobre o serviço de comunicação?"
        />

        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
          )}
        </View>

      </ServicoComunicacaoDetailContainer>
    </ScrollView>
  );
};
