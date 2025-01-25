import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, ScrollView, TextInput, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Alimentacao } from "../../../enums/Alimentacao.enum";
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
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { useNovoEntrevistado } from "../hooks/useInputEntrevistado";
import { EntrevistadoContainer } from "../styles/entrevistado.style";

export interface localidadeParam {
   localidadeId: number,
}

export const NovoEntrevistado = ()=>{
  const { params } = useRoute<RouteProp<Record<string, localidadeParam>>>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 
  const { novoEntrevistado,
          enviarEntrevistado,
          handleOnChangeInput,
          handleOnChangeData,
          handleArrayFieldChange,
          handleEnumChange,
          handleNumberChange,
          disabled} = useNovoEntrevistado(params.localidadeId);
    
    
   
    const nomeInput = useRef<TextInput>(null);
    const naturalidadeInput = useRef<TextInput>(null);
    const sexoOptions = Object.values(Sexo);
    const sexoEscolaridade = Object.values(Escolaridade);
    const simNaoOptions = Object.values(SimNao);
    const estadoCivilOptions = Object.values(EstadoCivil);
    const simNaoTalvezOptions = Object.values(SimNaoTalvez);
    const alimentacaoOptions = Object.values(Alimentacao);
    const comprasOptions = Object.values(Compras);
    const servicosOptions = Object.values(ServicoPublicos);
    const relacaoAreaInput = useRef<TextInput>(null);
    const relacaoVizinhoInput = useRef<TextInput>(null);
  
    const [alimentacoInformada, setAlimentacoInformada] = useState<string[]>([]);  
    const [outrasInformadas, setOutrasInformadas] = useState<string>('');

    const [localCompras, setLocalCompras] = useState<string[]>([]);  
    const [outrosLocais, SetOutrosLocais] = useState<string>('');

    const [servicosPublicos, setServicosPublicos] = useState<string[]>([]);  
    const [outrosLServicosPublicos, SetOutrosServicosPublicos] = useState<string>('');

    
    
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
   
    
    
    
    
    const handleEnviar = async () => {

       setLoading(true); 
        
            try {
              await enviarEntrevistado(); 
              navigation.goBack; 
             
            } catch (error) {
              console.error('Erro no envio:', error);
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
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={nomeInput}/>

           <Input 
              value={novoEntrevistado.naturalidade} 
              onChange={(event)=> handleOnChangeInput(event, 'naturalidade')}
              placeholder="naturalidade"
              margin="15px 10px 30px 5px"
              title="Naturalidade:"
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={nomeInput}/>

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
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={nomeInput}
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
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={nomeInput}/>

            <RenderPicker
                label="É morador do imóvel?"
                selectedValue={novoEntrevistado.morador}
                onValueChange={(value) => handleEnumChange('morador', value)}
                options={simNaoOptions}
              />
            
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
                    <Text
                      margin="0px 0px 4px 8px"
                      color={theme.colors.mainTheme.black}
                      type={textTypes.SUB_TITLE_BOLD}
                    >
                      Informe o motivo:
                    </Text>
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
              value={novoEntrevistado.motivoVontadeMudanca} 
              onChange={(event)=> handleOnChangeInput(event, 'motivoVontadeMudanca')}
              placeholder="Por qual motivo?"
              margin="15px 10px 30px 5px"
              title="Motivo:"
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={nomeInput}/>

              <Input 
              value={novoEntrevistado.relacaoAreaImovel} 
              onChange={(event)=> handleOnChangeInput(event, 'relacaoAreaImovel')}
              placeholder="Relação do entrevistado com a área do imóvel"
              margin="15px 10px 30px 5px"
              title="Relação com a área"
              onSubmitEditing={()=>relacaoVizinhoInput.current?.focus()}
              ref={relacaoAreaInput}
              />

            <Input 
                  value={novoEntrevistado.relacaoVizinhos} 
                  onChange={(event)=> handleOnChangeInput(event, 'relacaoVizinhos')}
                  placeholder="Relação do entrevistado com a vizinhança"
                  margin="15px 10px 30px 5px"
                  title="Relação com a vizinhança"
                  ref={relacaoVizinhoInput}
                  />
            
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
                    <Text
                        margin="0px 0px 4px 8px"
                        color={theme.colors.mainTheme.black}
                        type={textTypes.SUB_TITLE_BOLD}
                    >
                        Informe quais:
                    </Text>
                    <Input
                        value={outrasInformadas}
                        onChangeText={setOutrasInformadas}
                        placeholder="Separe as informações por vírgula"
                        margin="15px 10px 30px 5px"
                        title="Informe quais:"
                    />
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
                    <Text
                        margin="0px 0px 4px 8px"
                        color={theme.colors.mainTheme.black}
                        type={textTypes.SUB_TITLE_BOLD}
                    >
                        Informe onde:
                    </Text>
                    <Input
                        value={outrosLocais}
                        onChangeText={SetOutrosLocais}
                        placeholder="Separe as informações por vírgula"
                        margin="15px 10px 30px 5px"
                        title="Informe onde:"
                    />
                </View>
            )}


          <CheckboxSelector
                options={servicosOptions}
                selectedValues={servicosPublicos}
                label="Serviços Públicos: quais os maiores problemas enfrentados?"
                onSave={(selectedValues) => {
                  setServicosPublicos(selectedValues);
                  if (!selectedValues.includes('OUTRA_LOCALIDADE')) {
                      //SetOutrosServicosPublicos('');
                  }
              }}
            />
            {servicosPublicos.includes('OUTROS') && (
                <View style={{ marginTop: 10 }}>
                    <Text
                        margin="0px 0px 4px 8px"
                        color={theme.colors.mainTheme.black}
                        type={textTypes.SUB_TITLE_BOLD}
                    >
                        Especifique qual ou quais:
                    </Text>
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
              onChange={(event)=>handleNumberChange(event, 'sofreuAssaltos')}
              keyboardType='numeric'
              placeholder="Área em m²"
              margin="15px 10px 30px 5px"
              title="Já sofreu Assaltos nesse local"
            />

             
             <Input
              value={novoEntrevistado.presenciouAssalto?.toString() || ''}
              onChange={(event)=> handleNumberChange(event, 'presenciouAssalto')}
              keyboardType='numeric'
              placeholder="Área em m²"
              margin="15px 10px 30px 5px"
              title="Já presenciou Assaltos nesse local"
            />

               <Input 
              value={novoEntrevistado.problemasDeViolenciaLocal} 
              onChange={(event)=> handleOnChangeInput(event, 'problemasDeViolenciaLocal')}
              placeholder="separe por vírgulas se houver mais de uma relato"
              margin="15px 10px 30px 5px"
              title="Quais os problemas de violência aqui no local?"
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

              <Input 
              value={novoEntrevistado.utilizaAreaUc} 
              onChange={(event)=> handleOnChangeInput(event, 'utilizaAreaUc')}
              placeholder="Como?"
              margin="15px 10px 30px 5px"
              title="Utiliza a área?"
              />
              
              <Input 
              value={novoEntrevistado.propostaMelhorarArea} 
              onChange={(event)=> handleOnChangeInput(event, 'propostaMelhorarArea')}
              placeholder=" "
              margin="15px 10px 30px 5px"
              title="Qual sua sugestão de melhorias para a área?"
              ref={relacaoVizinhoInput}/>

              <Input 
              value={novoEntrevistado.indicadoConsultaPublica} 
              onChange={(event)=> handleOnChangeInput(event, 'indicadoConsultaPublica')}
              placeholder=" "
              margin="15px 10px 30px 5px"
              title="Indicação de Nome para Participar da Consulta Pública"
              ref={relacaoVizinhoInput}/>
            
             <Input 
              value={novoEntrevistado.contatoIndicadoConsultaPublica} 
              onChange={(event)=> handleOnChangeInput(event, 'contatoIndicadoConsultaPublica')}
              placeholder=" "
              margin="15px 10px 30px 5px"
              title="Informe um contato do indicado"
              ref={relacaoVizinhoInput}/>

    
         
         
    <View style={{ marginTop: 40 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff4500" /> 
      ) : (
        <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
      )}
    </View>
 
    
      

        </EntrevistadoContainer>
        </ScrollView>
    )
}