import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, ScrollView, TextInput, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Alimentacao } from "../../../enums/Alimentacao.enum";
import { AtendimentoSaude } from "../../../enums/AtendimentoSaude.enum";
import { Compras } from "../../../enums/Compras.enum";
import { Escolaridade } from "../../../enums/Escolaridade";
import { EstadoCivil } from "../../../enums/EstadoCivil.enum";
import { ServicoPublicos } from "../../../enums/ServicoPublicos";
import { Sexo } from "../../../enums/Sexo";
import { SimNao } from "../../../enums/simNao.enum";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import DateSelector from "../../../shared/components/input/DateSelector";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { useNovoEntrevistado } from "../hooks/useInputEntrevistado";
import { EntrevistadoContainer } from "../styles/entrevistado.style";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import Text from "../../../shared/components/text/Text";
import { formatarData, formatDateForApi } from "../../../shared/functions/data";


export interface NovoEntrevistadoParams {
localidadeId?: number
entrevistado?: EntrevistadoType;
}


export const detalharEntrevistado = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType)=>{
    navigate('EntrevistadoDetails', {entrevistado})
}

export const NovoEntrevistado = ()=>{
  const { params } = useRoute<RouteProp<Record<string, NovoEntrevistadoParams>, string>>();
  const localidadeId = params.localidadeId ?? params.entrevistado?.localidade.id;
  const entrevistado = params.entrevistado;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [loading, setLoading] = useState(false); 
  const { novoEntrevistado,
          enviarRegistro,
          handleOnChangeInput,
          handleOnChangeData,
          handleArrayFieldChange,
          handleEnumChange,
          handleNumberChange,
          disabled} = useNovoEntrevistado(localidadeId!, entrevistado);
         
    
          useEffect(() => {
            if (!entrevistado) return;
          
            // Campos básicos
            handleOnChangeInput(entrevistado.nome, 'nome');
            handleOnChangeInput(entrevistado.naturalidade, 'naturalidade');
            handleOnChangeInput(entrevistado.apelido, 'apelido');
            handleOnChangeInput(entrevistado.religiao, 'religiao');
          
            // Datas
            handleOnChangeData(new Date(entrevistado.nascimentoData), 'nascimentoData');
            handleOnChangeData(new Date(entrevistado.dataChegada), 'dataChegada');
          
            // Enums
            handleEnumChange('sexo', entrevistado.sexo);
            handleEnumChange('escolaridade', entrevistado.escolaridade);
            handleEnumChange('estadoCivil', entrevistado.estadoCivil);
            handleEnumChange('morador', entrevistado.morador);
            handleEnumChange('pretendeMudar', entrevistado.pretendeMudar);
            handleEnumChange('conheceUcs', entrevistado.conheceUcs);
            handleEnumChange('conheceUcProposta', entrevistado.conheceUcProposta);
            handleEnumChange('conheceAreaUc', entrevistado.conheceAreaUc);
            



            // Campos de texto opcionais
            handleOnChangeInput(entrevistado.motivoVontadeMudanca ?? '', 'motivoVontadeMudanca');
            handleOnChangeInput(entrevistado.relacaoAreaImovel ?? '', 'relacaoAreaImovel');
            handleOnChangeInput(entrevistado.relacaoVizinhos ?? '', 'relacaoVizinhos');
            handleOnChangeInput(entrevistado.tipoAlimentacao ?? '', 'tipoAlimentacao');
            handleOnChangeInput(entrevistado.localCompras ?? '', 'localCompras');
            handleOnChangeInput(entrevistado.servicosDeficitarios ?? '', 'servicosDeficitarios');
            handleOnChangeInput(entrevistado.comoCuidaSaudeFamilia ?? '', 'comoCuidaSaudeFamilia');
            handleOnChangeInput(entrevistado.instituicaoConhecida ?? '', 'instituicaoConhecida');
            handleOnChangeInput(entrevistado.problemasDeViolenciaLocal ?? '', 'problemasDeViolenciaLocal');
            handleOnChangeInput(entrevistado.propostaMelhorarArea ?? '', 'propostaMelhorarArea');
            handleOnChangeInput(entrevistado.indicadoConsultaPublica ?? '', 'indicadoConsultaPublica');
            handleOnChangeInput(entrevistado.contatoIndicadoConsultaPublica ?? '', 'contatoIndicadoConsultaPublica');
            handleOnChangeInput(entrevistado.importanciaDeProtegerAmbiente ?? '', 'importanciaDeProtegerAmbiente');
            handleOnChangeInput(entrevistado.importanciaDeProtegerFauna ?? '', 'importanciaDeProtegerFauna');
            handleOnChangeInput(entrevistado.qualEspacoPrecisaSerPreservado ?? '', 'qualEspacoPrecisaSerPreservado');
            handleOnChangeInput(entrevistado.problemasRelacionadosAoAmbiente ?? '', 'problemasRelacionadosAoAmbiente');
            
          
            // Campos numéricos
            handleNumberChange({ nativeEvent: { text: entrevistado.sofreuAssaltos?.toString() ?? '' } } as any, 'sofreuAssaltos');
            handleNumberChange({ nativeEvent: { text: entrevistado.presenciouAssalto?.toString() ?? '' } } as any, 'presenciouAssalto');
          
          }, [entrevistado]);

          const valorSalvoUsoArea = entrevistado?.utilizaAreaUc ?? '';
          const valorSalvoCuidadosSaude = entrevistado?.comoCuidaSaudeFamilia ?? '';
          const valorSalvoInstituicaoConhecida = entrevistado?.instituicaoConhecida ?? '';
          const valorSalvoTipoAlimentacao = entrevistado?.tipoAlimentacao ?? '';
          const valorSalvoLocalCompras = entrevistado?.localCompras ?? '';
          const valorSalvoServicosDeficitarios = entrevistado?.servicosDeficitarios ?? '';
          const valorSalvoNascimento = entrevistado?.nascimentoData ? formatDateForApi(new Date(entrevistado.nascimentoData)) : '';
          const valorSalvoDataChegada = entrevistado?.dataChegada   ? formatarData(new Date(entrevistado.dataChegada)) : '';
          
          
            
   
    const sexoOptions = Object.values(Sexo);
    const saudeOptions = Object.values(AtendimentoSaude);
    const sexoEscolaridade = Object.values(Escolaridade);
    const simNaoOptions = Object.values(SimNao);
    const estadoCivilOptions = Object.values(EstadoCivil);
    const simNaoTalvezOptions = Object.values(SimNaoTalvez);
    const alimentacaoOptions = Object.values(Alimentacao);
    const comprasOptions = Object.values(Compras);
    const servicosOptions = Object.values(ServicoPublicos);
    
    
    const nomeInput = useRef<TextInput>(null);
    const naturalidadeInput = useRef<TextInput>(null);
    const apelidoInput = useRef<TextInput>(null);
    const religiaoInput = useRef<TextInput>(null);
    const relacaoAreaInput = useRef<TextInput>(null);
    const relacaoVizinhoInput = useRef<TextInput>(null);
    const propostaMelhoriaInput = useRef<TextInput>(null);
    const indicadoConsultaInput = useRef<TextInput>(null);
    const sofreuAssaltosInput = useRef<TextInput>(null);
    const presenciouAssaltosInput = useRef<TextInput>(null);
    const violenciaLocalInput = useRef<TextInput>(null);
    const protegerAmbienteInput = useRef<TextInput>(null);
    const protegerFaunaInput = useRef<TextInput>(null);
    const espacoPreservadoInput = useRef<TextInput>(null);
    const problemasAmbienteInput = useRef<TextInput>(null);
    const contatoConsultaInput = useRef<TextInput>(null);




  
    const [alimentacoInformada, setAlimentacoInformada] = useState<string[]>([]);  
    const [outrasInformadas, setOutrasInformadas] = useState<string>('');

    const [localCompras, setLocalCompras] = useState<string[]>([]);  
    const [outrosLocais, SetOutrosLocais] = useState<string>('');

    const [servicosPublicos, setServicosPublicos] = useState<string[]>([]);  
    const [outrosLServicosPublicos, SetOutrosServicosPublicos] = useState<string>('');

    const [usoArea, setUsoArea] = useState<string>('');  
    const [sobreUso, SetSobreUso] = useState<string>('');  

    const [cuidadoMedico, setCuidadoMedico] = useState<string[]>([]);   
    const [outrosCuidados, SetOutrosCuidados] = useState<string>(''); 

    const [conheceInstituicao, setConheceInstituicao] = useState<string>('');     
    const [quaisConhece, SetQuaisConhece] = useState<string>('');
    

    useEffect(()=>{
      const consolidaDados = [
        ...alimentacoInformada.filter((item) => item !== 'Outras'),
        ...(outrasInformadas ? [`Outras: ${outrasInformadas}`] : []),
      ];

      handleArrayFieldChange('tipoAlimentacao', consolidaDados);
    
    },[alimentacoInformada, outrasInformadas ])


    useEffect(()=>{
      const consolidaDados = [
        ...localCompras.filter((item) => item !== 'Outras'),
        ...(outrosLocais ? [`Outras: ${outrosLocais}`] : []),
      ];

      console.log("mudanças no local de compras", novoEntrevistado.localCompras)

      handleArrayFieldChange('localCompras', consolidaDados);
    
    },[localCompras, outrosLocais ])


    useEffect(()=>{
      const consolidaDados = [
        ...servicosPublicos.filter((item) => item !== 'OUTROS'),
        ...(outrosLServicosPublicos ? [`Outras: ${outrosLServicosPublicos}`] : []),
      ];

      handleArrayFieldChange('servicosDeficitarios', consolidaDados);
    
    },[servicosPublicos, outrosLServicosPublicos ])


    useEffect(() => {
      const consolidaDados = usoArea === 'SIM' 
        ? (sobreUso ? [`COMO: ${sobreUso}`] : [])  // Se for "SIM", adiciona sobreUso se houver
        : ['NÃO']; // Se não for "SIM", mantém apenas "NÃO"
    
      handleArrayFieldChange('utilizaAreaUc', consolidaDados);
    
    }, [usoArea, sobreUso]);


    useEffect(()=>{
      const consolidaDados = [
        ...cuidadoMedico.filter((item) => item !== 'OUTROS'),
        ...(outrosCuidados ? [`Outras: ${outrosCuidados}`] : []),
      ];

      handleArrayFieldChange('comoCuidaSaudeFamilia', consolidaDados);
    
    },[cuidadoMedico, outrosCuidados ])


    useEffect(() => {
      const consolidaDados = conheceInstituicao === 'SIM' 
        ? (quaisConhece ? [`Instituições Conhecidas: ${quaisConhece}`] : [])  // Se for "SIM", adiciona sobreUso se houver
        : ['NÃO']; // Se não for "SIM", mantém apenas "NÃO"
    
      handleArrayFieldChange('instituicaoConhecida', consolidaDados);
    
    }, [conheceInstituicao, quaisConhece]);
    
   
       
    
    const handleEnviar = async () => {
         setLoading(true);
       
         try {
           const entrevistadoSalvo = await enviarRegistro(); 
               if (entrevistadoSalvo){
                 detalharEntrevistado(navigation.navigate, entrevistadoSalvo);
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
    

    

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA'}}>
       
        <EntrevistadoContainer>
           
           <Input 
              value={novoEntrevistado.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              placeholder="Nome do entrevistado"
              margin="15px 10px 30px 5px"
              title="Nome:"
              ref={nomeInput}
              onSubmitEditing={() => naturalidadeInput.current?.focus()}
            />
           <Input 
              value={novoEntrevistado.naturalidade} 
              onChange={(event)=> handleOnChangeInput(event, 'naturalidade')}
              placeholder="naturalidade"
              margin="15px 10px 30px 5px"
              title="Naturalidade:"
              ref={naturalidadeInput}
              />

              {valorSalvoNascimento && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Data de nascimento salva (ano/mês/dia): {valorSalvoNascimento}
                </Text>
              )}

              <DateSelector
                label="Data de nascimento"
                onDateChange={(selectedDate) => handleOnChangeData(selectedDate, 'nascimentoData')}
              />

            <RenderPicker
              label="Sexo"
              selectedValue={novoEntrevistado.sexo}
               onValueChange={(value) => handleEnumChange('sexo', value)}
               options={sexoOptions}
              />

           <Input 
              value={novoEntrevistado.apelido} 
              onChange={(event)=> handleOnChangeInput(event, 'apelido')}
              placeholder="como é mais conhecido na região"
              margin="15px 10px 30px 5px"
              title="Apelido:"
              ref={apelidoInput}
            />
             
          <RenderPicker
              label="Escolaridade"
              selectedValue={novoEntrevistado.escolaridade}
               onValueChange={(value) => handleEnumChange('escolaridade', value)}
               options={sexoEscolaridade}
              />
                   
           <RenderPicker
                label="Estado Civil"
                selectedValue={novoEntrevistado.estadoCivil}
                onValueChange={(value) => handleEnumChange('estadoCivil', value)}
                options={estadoCivilOptions}
              />

            <Input 
              value={novoEntrevistado.religiao} 
              onChange={(event)=> handleOnChangeInput(event, 'religiao')}
              placeholder="Qual a sua religião"
              margin="15px 10px 30px 5px"
              title="Qual a sua religião?"
              ref={religiaoInput}
              />

            <RenderPicker
                label="É morador do imóvel?"
                selectedValue={novoEntrevistado.morador}
                onValueChange={(value) => handleEnumChange('morador', value)}
                options={simNaoOptions}
              />
            
            {valorSalvoDataChegada && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Data de chegada salva (ano/mês/dia): {valorSalvoDataChegada}
                </Text>
              )}
            <DateSelector
                label="Data de Chegada no Local"
                onDateChange={(selectedDate) => handleOnChangeData(selectedDate, 'dataChegada')}
              />

                <RenderPicker
                  label="Pretende Mudar"
                  selectedValue={novoEntrevistado.pretendeMudar}
                  onValueChange={(value) => handleEnumChange('pretendeMudar', value)} // Atualiza o estado
                  options={simNaoTalvezOptions}
                />

                {/* Exibe o campo de texto apenas se a resposta for 'Sim' */}
                {novoEntrevistado.pretendeMudar === SimNaoTalvez.SIM && ( 
                  <View style={{ marginTop: 10 }}>
                    <Input 
                      value={novoEntrevistado.motivoVontadeMudanca} 
                      onChange={(event) => handleOnChangeInput(event, 'motivoVontadeMudanca')}
                      placeholder="Por qual motivo?"
                      margin="15px 10px 30px 5px"
                      title="Motivo da mudança:"
                    />
                  </View>
                )}


              <Input 
              value={novoEntrevistado.relacaoAreaImovel} 
              onChange={(event)=> handleOnChangeInput(event, 'relacaoAreaImovel')}
              placeholder="Relação do entrevistado com a área do imóvel"
              margin="15px 10px 30px 5px"
              title="Relação com a área"
              ref={relacaoAreaInput}
              onSubmitEditing={() => relacaoVizinhoInput.current?.focus()}
              />

            <Input 
                  value={novoEntrevistado.relacaoVizinhos} 
                  onChange={(event)=> handleOnChangeInput(event, 'relacaoVizinhos')}
                  placeholder="Relação do entrevistado com a vizinhança"
                  margin="15px 10px 30px 5px"
                  title="Relação com a vizinhança"
                  ref={relacaoVizinhoInput}
              />

                {valorSalvoTipoAlimentacao && (
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontStyle: 'italic', color: 'gray' }}>
                      Valor salvo sobre a alimentação: {valorSalvoTipoAlimentacao}
                    </Text>
                  </View>
                )}
            
            <CheckboxSelector
                options={alimentacaoOptions}
                selectedValues={alimentacoInformada}
                label="Selecione as opções de Alimentação"
                onSave={(selectedValues) => {
                    setAlimentacoInformada(selectedValues);
                    if (!selectedValues.includes('OUTRAS')) {
                        setOutrasInformadas('');
                    }
                }}
            />
            {alimentacoInformada.includes('OUTRAS') && (
                <View style={{ marginTop: 10 }}>
                    <Input
                        value={outrasInformadas}
                        onChangeText={setOutrasInformadas}
                        placeholder="Separe as informações por vírgula"
                        margin="15px 10px 30px 5px"
                        title="Informe quais:"
                    />
                </View>
            )}

            {valorSalvoLocalCompras && (
                        <View style={{ marginBottom: 5 }}>
                          <Text style={{ fontStyle: 'italic', color: 'gray' }}>
                            Valor salvo sobre local de compras: {valorSalvoLocalCompras}
                          </Text>
                        </View>
              )}

             <CheckboxSelector
                options={comprasOptions}
                selectedValues={localCompras}
                label="Onde realiza suas compras gerais?"
                onSave={(selectedValues) => {
                    setLocalCompras(selectedValues);
                    if (!selectedValues.includes('OUTRA_LOCALIDADE')) {
                        setOutrasInformadas('');
                    }
                }}
            />
            {localCompras.includes('OUTRA_LOCALIDADE') && (
                <View style={{ marginTop: 10 }}>
                    <Input
                        value={outrosLocais}
                        onChangeText={SetOutrosLocais}
                        placeholder="Separe as informações por vírgula"
                        margin="15px 10px 30px 5px"
                        title="Informe onde:"
                    />
                </View>
            )}

            {valorSalvoCuidadosSaude && (
                        <View style={{ marginBottom: 5 }}>
                          <Text style={{ fontStyle: 'italic', color: 'gray' }}>
                            Valor salvo sobre  o atendimento de saúde: {valorSalvoCuidadosSaude}
                          </Text>
                        </View>
            )}

            <CheckboxSelector
                options={saudeOptions}
                selectedValues={cuidadoMedico}
                label="Como é feito o atendimento de saúde a sua família?"
                onSave={(selectedValues) => {
                    setCuidadoMedico(selectedValues);
                    if (!selectedValues.includes('OUTROS')) {
                        SetOutrosCuidados('');
                    }
                }}
            />
            {cuidadoMedico.includes('OUTROS') && (
                <View style={{ marginTop: 10 }}>
                    <Input
                        value={outrosCuidados}
                        onChangeText={SetOutrosCuidados}
                        placeholder="Separe as informações por vírgula"
                        margin="15px 10px 30px 5px"
                        title="Informe quais:"
                    />
                </View>
            )}

        {valorSalvoServicosDeficitarios && (
                    <View style={{ marginBottom: 5 }}>
                      <Text style={{ fontStyle: 'italic', color: 'gray' }}>
                        Valor salvo sobre serviços públicos deficitários: {valorSalvoServicosDeficitarios}
                      </Text>
                    </View>
         )}
          
          <CheckboxSelector
                options={servicosOptions}
                selectedValues={servicosPublicos}
                label="Serviços Públicos: quais os maiores problemas enfrentados?"
                onSave={(selectedValues) => {
                  setServicosPublicos(selectedValues);
                  if (!selectedValues.includes('OUTRA_LOCALIDADE')) {
                      SetOutrosServicosPublicos('');
                  }
              }}
            />
            {servicosPublicos.includes('OUTROS') && (
                <View style={{ marginTop: 10 }}>
                    <Input
                        value={outrosLServicosPublicos}
                        onChangeText={SetOutrosServicosPublicos}
                        placeholder="Separe por vírgulas"
                        margin="15px 10px 30px 5px"
                        title="Especifique:"
                    />
                </View>
            )}


              <Input
                value={novoEntrevistado.sofreuAssaltos?.toString() || ''}
                onChange={(event) => handleNumberChange(event, 'sofreuAssaltos')}
                keyboardType="numeric"
                placeholder="Área em m²"
                margin="15px 10px 30px 5px"
                title="Já sofreu Assaltos nesse local"
                ref={sofreuAssaltosInput}
                onSubmitEditing={() => presenciouAssaltosInput.current?.focus()}
              />

              <Input
                value={novoEntrevistado.presenciouAssalto?.toString() || ''}
                onChange={(event) => handleNumberChange(event, 'presenciouAssalto')}
                keyboardType="numeric"
                placeholder="Quantas vezes?"
                margin="15px 10px 30px 5px"
                title="Já presenciou Assaltos nesse local"
                ref={presenciouAssaltosInput}
                onSubmitEditing={() => violenciaLocalInput.current?.focus()}
              />

              <Input
                value={novoEntrevistado.problemasDeViolenciaLocal}
                onChange={(event) => handleOnChangeInput(event, 'problemasDeViolenciaLocal')}
                placeholder="Separe por vírgulas se houver mais de um relato"
                margin="15px 10px 30px 5px"
                title="Quais os problemas de violência aqui no local?"
                ref={violenciaLocalInput}
              />

              {valorSalvoInstituicaoConhecida && (
                <View style={{ marginBottom: 5 }}>
                  <Text style={{ fontStyle: 'italic', color: 'gray' }}>
                    Valor salvo sobre Intituições conhecidas: {valorSalvoInstituicaoConhecida}
                  </Text>
                </View>
              )}
              <RenderPicker
                  label="Você conhece o trabalho de alguma instituição governamental ou não governamental na sua localidade??"
                  selectedValue={conheceInstituicao}
                  onValueChange={(value) => {
                    setConheceInstituicao(value ?? ''); 
                    if (value !== '') {
                      SetQuaisConhece('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
              />
               {conheceInstituicao.includes('SIM') && (
                <View style={{ marginTop: 10 }}>
                   <Input
                        value={quaisConhece}
                        onChangeText={SetQuaisConhece}
                        placeholder="Separe por vírgulas"
                        margin="15px 10px 30px 5px"
                        title="Qual(is) a(s) instituição(ões) e que tipo de trabalho desenvolve?"
                    />
                </View>
               )}

             
              <Input 
                value={novoEntrevistado.importanciaDeProtegerAmbiente} 
                onChange={(event) => handleOnChangeInput(event, 'importanciaDeProtegerAmbiente')}
                placeholder="..."
                margin="15px 10px 30px 5px"
                title="Para você, qual a importância de proteger o meio ambiente?"
                ref={protegerAmbienteInput}
                onSubmitEditing={() => protegerFaunaInput.current?.focus()}
              />

              <Input 
                value={novoEntrevistado.importanciaDeProtegerFauna} 
                onChange={(event) => handleOnChangeInput(event, 'importanciaDeProtegerFauna')}
                placeholder="..."
                margin="15px 10px 30px 5px"
                title="Qual a importância de proteger a fauna?"
                ref={protegerFaunaInput}
                onSubmitEditing={() => espacoPreservadoInput.current?.focus()}
              />

              <Input 
                value={novoEntrevistado.qualEspacoPrecisaSerPreservado} 
                onChange={(event) => handleOnChangeInput(event, 'qualEspacoPrecisaSerPreservado')}
                placeholder="..."
                margin="15px 10px 30px 5px"
                title="Há algum espaço na sua localidade que você acredite que precisa ser protegido?"
                ref={espacoPreservadoInput}
                onSubmitEditing={() => problemasAmbienteInput.current?.focus()}
              />

              <Input 
                value={novoEntrevistado.problemasRelacionadosAoAmbiente} 
                onChange={(event) => handleOnChangeInput(event, 'problemasRelacionadosAoAmbiente')}
                placeholder="..."
                margin="15px 10px 30px 5px"
                title="Qual é o problema relacionado ao meio ambiente que você percebe em sua localidade?"
                ref={problemasAmbienteInput}
              />


              
              <RenderPicker
                label="Já ouviu falar de UC?"
                selectedValue={novoEntrevistado.conheceUcs}
                onValueChange={(value) => handleEnumChange('conheceUcs', value)}
                options={simNaoOptions}
              />

              <RenderPicker
                label="Conhece a proposta de UC para área?"
                selectedValue={novoEntrevistado.conheceUcProposta}
                onValueChange={(value) => handleEnumChange('conheceUcProposta', value)}
                options={simNaoOptions}
              />

              <RenderPicker
                label="Conhece a Área onde a UC pode ser implantada?"
                selectedValue={novoEntrevistado.conheceAreaUc}
                onValueChange={(value) => handleEnumChange('conheceAreaUc', value)}
                options={simNaoOptions}
              />

                {valorSalvoUsoArea && (
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontStyle: 'italic', color: 'gray' }}>
                      Valor salvo no banco de dados parao campo abaixo: {valorSalvoUsoArea}
                    </Text>
                  </View>
                )}
       
                <RenderPicker
                  label="Utiliza a área?"
                  selectedValue={usoArea}
                  onValueChange={(value) => {
                    setUsoArea(value ?? ''); 
                    if (value !== 'SIM') {
                      SetSobreUso('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
                />
            {usoArea.includes('SIM') && (
                <View style={{ marginTop: 10 }}>
                   <Input
                        value={sobreUso}
                        onChangeText={SetSobreUso}
                        placeholder="Separe por vírgulas"
                        margin="15px 10px 30px 5px"
                        title="Como?"
                    />
                </View>
            )}


          <Input 
            value={novoEntrevistado.propostaMelhorarArea} 
            onChange={(event) => handleOnChangeInput(event, 'propostaMelhorarArea')}
            placeholder=" "
            margin="15px 10px 30px 5px"
            title="Qual sua sugestão de melhorias para a área?"
            ref={propostaMelhoriaInput}
            onSubmitEditing={() => indicadoConsultaInput.current?.focus()}
          />

          <Input 
            value={novoEntrevistado.indicadoConsultaPublica} 
            onChange={(event) => handleOnChangeInput(event, 'indicadoConsultaPublica')}
            placeholder=" "
            margin="15px 10px 30px 5px"
            title="Indicação de Nome para Participar da Consulta Pública"
            ref={indicadoConsultaInput}
            onSubmitEditing={() => contatoConsultaInput.current?.focus()}
          />

          <Input 
            value={novoEntrevistado.contatoIndicadoConsultaPublica} 
            onChange={(event) => handleOnChangeInput(event, 'contatoIndicadoConsultaPublica')}
            placeholder=" "
            margin="15px 10px 30px 5px"
            title="Informe um contato do indicado"
            ref={contatoConsultaInput}
          />


       
         
    <View style={{ marginTop: 40 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff4500" /> 
      ) : (
        <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={disabled || loading} />
      )}
    </View>
 
    
      

        </EntrevistadoContainer>
        </ScrollView>
    )
}