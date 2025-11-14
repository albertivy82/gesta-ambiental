import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, ScrollView, TextInput, View } from "react-native";
import { Alimentacao } from "../../../enums/Alimentacao.enum";
import { Compras } from "../../../enums/Compras.enum";
import { ServicoPublicos } from "../../../enums/ServicoPublicos";
import { Sexo } from "../../../enums/Sexo";
import { SimNao } from "../../../enums/simNao.enum";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { getAllEntrevistados } from "../../../realm/services/entrevistado";
import { FormErrors } from "../../../shared/components/FormErrors";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { theme } from "../../../shared/themes/theme";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovoEntrevistado } from "../hooks/useInputEntrevistado";
import { EntrevistadoContainer } from "../styles/entrevistado.style";
import { estadoCivilOptions, saudeOptions, sexoEscolaridade, tempomoradiaOptions } from "../ui-components/opcoesEntrevistado";


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
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false); 
  const { novoEntrevistado,
          enviarRegistro,
          handleOnChangeInput,
          handleArrayFieldChange,
          handleEnumChange,
          handleNumberChange,
          handleSetNumber,
          validateEntrevistado,
          disabled} = useNovoEntrevistado(localidadeId!, entrevistado);
         
          //getAllEntrevistados();
          useEffect(() => {
            if (!entrevistado) return;
          
            // Campos básicos
            handleOnChangeInput(entrevistado.nome, 'nome');
            handleOnChangeInput(entrevistado.naturalidade, 'naturalidade');
            handleOnChangeInput(entrevistado.apelido, 'apelido');
            handleOnChangeInput(entrevistado.religiao, 'religiao');
            setIdade(entrevistado.nascimentoData);
            // Enums
            handleEnumChange('dataChegada', entrevistado.dataChegada);
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
            handleNumberChange({ nativeEvent: { text: entrevistado.nascimentoData?.toString() ?? '' } } as any, 'nascimentoData');
          }, [entrevistado]);

          const valorSalvoUsoArea = entrevistado?.utilizaAreaUc ?? '';
          const valorSalvoCuidadosSaude = entrevistado?.comoCuidaSaudeFamilia ?? '';
          const valorSalvoInstituicaoConhecida = entrevistado?.instituicaoConhecida ?? '';
          const valorSalvoTipoAlimentacao = entrevistado?.tipoAlimentacao ?? '';
          const valorSalvoLocalCompras = entrevistado?.localCompras ?? '';
          const valorSalvoServicosDeficitarios = entrevistado?.servicosDeficitarios ?? '';
          
          
            
   
    const religiaoOptions = Object.values(['Católica', 'Evangélica', 'Espírita', 'Matriz Africana', 'Sem Religião']);
    const relacaoVizinhosOptions = ['Boa','Muito boa','Indiferente','Conflituosa','Não se relaciona', 'Outros',];
    const simNaoOptions = Object.values(SimNao);
    const simNaoTalvezOptions = Object.values(SimNaoTalvez);
    const alimentacaoOptions = Object.values(Alimentacao);
    const comprasOptions = Object.values(Compras);
    const servicosOptions = Object.values(ServicoPublicos);
    const sexoOptions = Object.values(Sexo);
      
    const nomeInput = useRef<TextInput>(null);
    const naturalidadeInput = useRef<TextInput>(null);
    const apelidoInput = useRef<TextInput>(null);
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

    const [idade, setIdade] = useState<number>();

   // estado do picker (se ainda não tiver)
    const [indicacaoTipo, setIndicacaoTipo] = useState<string>('');

      // reage à mudança do picker e aplica as regras
      useEffect(() => {
        if (indicacaoTipo === 'Ninguém') {
          handleOnChangeInput('Ninguém', 'indicadoConsultaPublica');
          handleOnChangeInput('Não se aplica', 'contatoIndicadoConsultaPublica');
        } else if (indicacaoTipo === 'O próprio entrevistado') {
          handleOnChangeInput('O próprio entrevistado', 'indicadoConsultaPublica');
          handleOnChangeInput('', 'contatoIndicadoConsultaPublica'); // usuário digita
        } else if (indicacaoTipo === 'Outra pessoa') {
          handleOnChangeInput('', 'indicadoConsultaPublica');        // usuário digita
          handleOnChangeInput('', 'contatoIndicadoConsultaPublica'); // usuário digita
        } else {
          // estado inicial (opcional)
          handleOnChangeInput('', 'indicadoConsultaPublica');
          handleOnChangeInput('', 'contatoIndicadoConsultaPublica');
        }
      }, [indicacaoTipo]);


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
      const consolidaDados = usoArea === 'Sim' 
        ? (sobreUso ? [`COMO: ${sobreUso}`] : [])  // Se for "SIM", adiciona sobreUso se houver
        : ['Não']; // Se não for "SIM", mantém apenas "Não"
    
      handleArrayFieldChange('utilizaAreaUc', consolidaDados);
    
    }, [usoArea, sobreUso]);


    useEffect(()=>{
      const consolidaDados = [
        ...cuidadoMedico.filter((item) => item !== 'OUTROS'),
        ...(outrosCuidados ? [`Outras: ${outrosCuidados}`] : []),
      ];

      handleArrayFieldChange('comoCuidaSaudeFamilia', consolidaDados);
    
    },[cuidadoMedico, outrosCuidados ])

    useEffect(()=>{
       handleSetNumber(idade!,'nascimentoData');
    },[idade])

    useEffect(() => {
      const consolidaDados = conheceInstituicao === 'Sim' 
        ? (quaisConhece ? [`Instituições Conhecidas: ${quaisConhece}`] : [])  // Se for "SIM", adiciona sobreUso se houver
        : ['Não']; // Se não for "SIM", mantém apenas "Não"
    
      handleArrayFieldChange('instituicaoConhecida', consolidaDados);
    
    }, [conheceInstituicao, quaisConhece]);
    
   
       
    
    const handleEnviar = async () => {
            
        if (loading) return;
            
        const result = validateEntrevistado(novoEntrevistado);
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
           const entrevistadoSalvo = await enviarRegistro(); 
               if (entrevistadoSalvo){
                 detalharEntrevistado(navigation.navigate, entrevistadoSalvo);
               } else {
                 Alert.alert("Erro", "Não foi possível salvar o entrevistado. Tente novamente.");
                 navigation.goBack();
               }
              } catch (e) {
                Alert.alert('Erro', 'Não foi possível realizar a operação.');
              } finally {
                setLoading(false); // 👈 desliga
              }
    };
    
    

    

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA'}}>
       
        <EntrevistadoContainer>
           
           <Input 
              value={novoEntrevistado.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              maxLength={255}
              placeholder="Nome do entrevistado"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Nome:"
              ref={nomeInput}
              onSubmitEditing={() => naturalidadeInput.current?.focus()}
            />
           <Input 
              value={novoEntrevistado.naturalidade} 
              onChange={(event)=> handleOnChangeInput(event, 'naturalidade')}
              maxLength={100}
              placeholder="naturalidade"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Naturalidade:"
              ref={naturalidadeInput}
              />

           <Input
              value={idade?.toString() || ''}
              onChangeText={(text) => {
                  const num = parseInt(text.replace(/\D/g, ''), 10);
                  setIdade(isNaN(num) ? undefined : num);
                 }}
              keyboardType="numeric"
              placeholder="Idade do entrevistado"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              title="Qual sua idade?"
            />

             {Number(novoEntrevistado.nascimentoData) < 18 && (
                <Text style={{ fontStyle: 'italic', color: 'grey', marginTop: 8 }}>
                     O entrevistado precisa ter 18 anos ou mais
                </Text>
              )}
            

            <RenderPicker
              label="Sexo"
              selectedValue={novoEntrevistado.sexo}
               onValueChange={(value) => handleEnumChange('sexo', value)}
               options={sexoOptions}
            />

            <Input 
              value={novoEntrevistado.apelido} 
              onChange={(event)=> handleOnChangeInput(event, 'apelido')}
              maxLength={100}
              placeholder="como você é mais conhecido na região"
              placeholderTextColor={theme.colors.grayTheme.gray80}
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

            <RenderPicker
                label="Qual a sua religião"
                selectedValue={novoEntrevistado.religiao}
                onValueChange={(value) => handleEnumChange('religiao', value)}
                options={religiaoOptions}
             />

             <RenderPicker
                label="É morador do imóvel?"
                selectedValue={novoEntrevistado.morador}
                onValueChange={(value) => handleEnumChange('morador', value)}
                options={simNaoOptions}
              />
           
             <RenderPicker
                label={
                  novoEntrevistado.morador === 'Sim'
                    ? 'Há quanto tempo você reside neste local?'
                    : 'Há quanto tempo você está presente neste local?'
                }
                selectedValue={novoEntrevistado.dataChegada}
                onValueChange={(value) => handleEnumChange('dataChegada', value)}
                options={tempomoradiaOptions}
              />

                <RenderPicker
                    label={
                    novoEntrevistado.morador === 'Sim'
                    ? 'Pretende Mudar?'
                    : 'Pretende deixar o local?'
                    }
                    selectedValue={novoEntrevistado.pretendeMudar}
                    onValueChange={(value) => handleEnumChange('pretendeMudar', value)}
                    options={simNaoTalvezOptions}
                />
                

                {novoEntrevistado.pretendeMudar === SimNaoTalvez.Sim && (
                  <View style={{ marginTop: 10 }}>
                    <Input
                      value={novoEntrevistado.motivoVontadeMudanca}
                      maxLength={255}
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
                  maxLength={255}
                  placeholder="Relação do entrevistado com a área do imóvel"
                  placeholderTextColor={theme.colors.grayTheme.gray80}
                  margin="15px 10px 30px 5px"
                  title="Como você define a sua relação com o local onde você mora?"
                  ref={relacaoAreaInput}
                  onSubmitEditing={() => relacaoVizinhoInput.current?.focus()}
              />

              
              <RenderPicker
                label="Como é a sua relação com a vizinhança?"
                selectedValue={novoEntrevistado.relacaoVizinhos}
                onValueChange={(value) => handleEnumChange('relacaoVizinhos', value)}
                options={relacaoVizinhosOptions}
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
                label="Quais alimentos você consome com mais frequência no dia a dia?
                Selecione as opções que se aplicam."

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
                        maxLength={255}
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
                      SetOutrosLocais('');
                    }
                }}
            />
            {localCompras.includes('OUTRA_LOCALIDADE') && (
                <View style={{ marginTop: 10 }}>
                    <Input
                        maxLength={200}
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
                    if (!selectedValues.includes('Outros')) {
                        SetOutrosCuidados('');
                    }
                }}
            />
            {cuidadoMedico.includes('Outros') && (
                <View style={{ marginTop: 10 }}>
                    <Input
                        value={outrosCuidados}
                        maxLength={100}
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
                  if (!selectedValues.includes('Outros')) {
                      SetOutrosServicosPublicos('');
                  }
              }}
            />
            {servicosPublicos.includes('Outros') && (
                <View style={{ marginTop: 10 }}>
                    <Input
                        value={outrosLServicosPublicos}
                        maxLength={100}
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
                maxLength={3}
                keyboardType="numeric"
                placeholder="Área em m²"
                placeholderTextColor={theme.colors.grayTheme.gray80}
                margin="15px 10px 30px 5px"
                title="Já sofreu Assaltos nesse local? Quantas vezes?"
                ref={sofreuAssaltosInput}
                onSubmitEditing={() => presenciouAssaltosInput.current?.focus()}
              />

              <Input
                value={novoEntrevistado.presenciouAssalto?.toString() || ''}
                onChange={(event) => handleNumberChange(event, 'presenciouAssalto')}
                maxLength={3}
                keyboardType="numeric"
                placeholder="Quantas vezes?"
                placeholderTextColor={theme.colors.grayTheme.gray80}
                margin="15px 10px 30px 5px"
                title="Já presenciou Assaltos nesse local? Quantas vezes?"
                ref={presenciouAssaltosInput}
                onSubmitEditing={() => violenciaLocalInput.current?.focus()}
              />

              <Input
                value={novoEntrevistado.problemasDeViolenciaLocal}
                onChange={(event) => handleOnChangeInput(event, 'problemasDeViolenciaLocal')}
                maxLength={255}
                placeholder="Separe por vírgulas se houver mais de um relato"
                placeholderTextColor={theme.colors.grayTheme.gray80}
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
                  label="Você conhece o trabalho de alguma instituição governamental ou não governamental na sua localidade?"
                  selectedValue={conheceInstituicao}
                  onValueChange={(value) => {
                    setConheceInstituicao(value ?? ''); 
                    if (value !== '') {
                      SetQuaisConhece('');
                    }
                  }}
                  options={['Sim', 'Não']}
              />
               {conheceInstituicao.includes('Sim') && (
                <View style={{ marginTop: 10 }}>
                   <Input
                        value={quaisConhece}
                        maxLength={100}
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
                maxLength={255}
                placeholder="..."
                margin="15px 10px 30px 5px"
                title="Para você, qual a importância de proteger o meio ambiente?"
                ref={protegerAmbienteInput}
                onSubmitEditing={() => protegerFaunaInput.current?.focus()}
              />

              <Input 
                value={novoEntrevistado.importanciaDeProtegerFauna} 
                onChange={(event) => handleOnChangeInput(event, 'importanciaDeProtegerFauna')}
                maxLength={255}
                placeholder="..."
                margin="15px 10px 30px 5px"
                title="Qual a importância de proteger a fauna?"
                ref={protegerFaunaInput}
                onSubmitEditing={() => espacoPreservadoInput.current?.focus()}
              />

              <Input 
                value={novoEntrevistado.qualEspacoPrecisaSerPreservado} 
                onChange={(event) => handleOnChangeInput(event, 'qualEspacoPrecisaSerPreservado')}
                maxLength={255}
                placeholder="..."
                margin="15px 10px 30px 5px"
                title="Há algum espaço na sua localidade que você acredite que precisa ser protegido?"
                ref={espacoPreservadoInput}
                onSubmitEditing={() => problemasAmbienteInput.current?.focus()}
              />

              <Input 
                value={novoEntrevistado.problemasRelacionadosAoAmbiente} 
                maxLength={255}
                onChange={(event) => handleOnChangeInput(event, 'problemasRelacionadosAoAmbiente')}
                placeholder="..."
                margin="15px 10px 30px 5px"
                title="Qual é o problema relacionado ao meio ambiente que você percebe em sua localidade?"
                ref={problemasAmbienteInput}
              />


              
              <RenderPicker
                label="Já ouviu falar de Unidades de Conservação?"
                selectedValue={novoEntrevistado.conheceUcs}
                onValueChange={(value) => handleEnumChange('conheceUcs', value)}
                options={simNaoOptions}
              />

              <RenderPicker
                label="Conhece a proposta da Unidade de Conservação no local?"
                selectedValue={novoEntrevistado.conheceUcProposta}
                onValueChange={(value) => handleEnumChange('conheceUcProposta', value)}
                options={simNaoOptions}
              />

              <RenderPicker
                label="Conhece a Área onde a Unidade de Conservação pode ser implantada?"
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
                  label="Você utiliza essa área?"
                  selectedValue={usoArea}
                  onValueChange={(value) => {
                    setUsoArea(value ?? ''); 
                    if (value !== 'Sim') {
                      SetSobreUso('');
                    }
                  }}
                  options={['Sim', 'Não']}
                />
            {usoArea.includes('Sim') && (
                <View style={{ marginTop: 10 }}>
                   <Input
                        value={sobreUso}
                        maxLength={240}
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
            maxLength={255}
            placeholder=" "
            margin="15px 10px 30px 5px"
            title="Qual sua sugestão de melhorias para a área?"
            ref={propostaMelhoriaInput}
            onSubmitEditing={() => indicadoConsultaInput.current?.focus()}
          />


            <RenderPicker
              label="Quem indicará para participar da Consulta Pública?"
              selectedValue={indicacaoTipo}
              onValueChange={(value) => setIndicacaoTipo(value ?? '')}
              options={['Ninguém', 'O próprio entrevistado', 'Outra pessoa']}
            />

       {indicacaoTipo === 'Outra pessoa' && (
          <Input 
            value={novoEntrevistado.indicadoConsultaPublica} 
            onChange={(event) => handleOnChangeInput(event, 'indicadoConsultaPublica')}
            placeholderTextColor={theme.colors.grayTheme.gray80}
            maxLength={150}
            placeholder="Nome"
            margin="15px 10px 30px 5px"
            title="Indicação de um nome para Participar da Consulta Pública"
            ref={indicadoConsultaInput}
            onSubmitEditing={() => contatoConsultaInput.current?.focus()}
          />
        )}
         
         {(indicacaoTipo === 'Outra pessoa' || indicacaoTipo === 'O próprio entrevistado') && (
          <Input 
            value={novoEntrevistado.contatoIndicadoConsultaPublica} 
            onChange={(event) => handleOnChangeInput(event, 'contatoIndicadoConsultaPublica')}
            placeholderTextColor={theme.colors.grayTheme.gray80}
            maxLength={50}
            placeholder="Qualquer meio disponível"
            margin="15px 10px 30px 5px"
            title="Informe um contato do indicado"
            ref={contatoConsultaInput}
          />
        )}
       
         
          <FormErrors
            visible={showErrors && disabled}
            errors={validateEntrevistado(novoEntrevistado).errors}
          />
                           
          <Button
          title={loading ? "Enviando..." : "Enviar"}
          onPress={handleEnviar}
          color={"#ff4500"}
          disabled={loading}   // 👈 trava só enquanto envia
          />
    
      

        </EntrevistadoContainer>
        </ScrollView>
    )
}