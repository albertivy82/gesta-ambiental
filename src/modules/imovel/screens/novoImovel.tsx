import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, ScrollView, TextInput, View } from "react-native";
import { SimNao } from "../../../enums/simNao.enum";
import { FormErrors } from "../../../shared/components/FormErrors";
import LocationInput from "../../../shared/components/input/LocationInput";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { theme } from "../../../shared/themes/theme";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { imovelBody } from "../../../shared/types/imovelType";
import { useNovoImovel } from "../hooks/useInputImovel";
import { ImovelDetailContainer } from "../styles/ImovelDetails.style";
import { documentacaoOptions, fundiarioOptions, lazerOptions, limitesOptions, pavimentacaoOptions, soloOptions, vizinhoOptions } from "../ui-component/opcoesImovel";


export interface NovoReptilParams {
  entrevistado: EntrevistadoType;
  imovel?: imovelBody;
}

export const detalharImovel = (navigate: NavigationProp<ParamListBase>['navigate'], imovel: imovelBody) => {
  navigate('ImovelDetail', { imovel });
};

export const NovoImovel = () => {
  const { params } = useRoute<RouteProp<Record<string, NovoReptilParams>, string>>();
  const entrevistado = params.entrevistado ?? params.imovel?.entrevistado;
  const imovel = params.imovel;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false); 
  const { novoImovel,
    handleOnChangeInput,
    handleArrayFieldChange,
    handleEnumChange,
    enviarRegistro,
    handleOnChangeAreaImovel,
    validateImovel,
    handleLocationChange,
    disabled} = useNovoImovel(entrevistado, imovel);
    

  const [pavimentacaoInformada, setPavimentacaoInformada] = useState<string[]>([]);  
  const [outrasInformadas, SetOutrasInformadas] = useState<string>('');
  const [vizinhosConfinantesInformados, setVizinhosConfinantesInformados] = useState<string[]>([]);
  const [linhaOnibus, setLinhaOnibus] = useState<string>('');     
  const [qual, SetQual] = useState<string>('');
  const [equipamentosUrbanosInformados, setEquipamentosUrbanosInformados] = useState<string>(''); 
  const [outrosEquipamentosUrbanos, setOutrosEquipamentosUrbanos] = useState<string>('');
  const [espacosLazer, setEspacosLazer]  = useState<string[]>([]);
  const [outrosEspacosLazer, setOutrosEspacosLazer] = useState<string>('');
  const simNaoOptions =  Object.values(SimNao);
      
   
  useEffect(()=>{
        const consolidaDados = [
          ...pavimentacaoInformada.filter((item) => item !== 'Outras'),
          ...(outrasInformadas ? [`Outras: ${outrasInformadas}`] : []),
        ];
  
        handleArrayFieldChange('pavimentacao', consolidaDados);
      
  },[pavimentacaoInformada, outrasInformadas ]);


  useEffect(() => {
    const consolidaDados = linhaOnibus === 'Sim' 
      ? (qual ? [`ocorrencia: ${qual}`] : [])  
      : ['Não']; 
  
    handleArrayFieldChange('linhasOnibus', consolidaDados);
  
  }, [linhaOnibus, qual]);



  useEffect(() => {
    const consolidaEquipamentosUrbanos = equipamentosUrbanosInformados === 'Sim' 
      ? (outrosEquipamentosUrbanos ? [`${outrosEquipamentosUrbanos}`] : [])  
      : ['Não']; 
  
    handleArrayFieldChange('equipamentosUrbanos', consolidaEquipamentosUrbanos);
  
  }, [equipamentosUrbanosInformados, outrosEquipamentosUrbanos]);

 
  useEffect(() => {
    const consolidaEspacosLaze = [
        ...espacosLazer.filter((item) => item !== 'Outros'),
        ...(outrosEspacosLazer ? [outrosEspacosLazer] : []),
    ];

    handleArrayFieldChange('espacosEsporteLazer', consolidaEspacosLaze);
  }, [espacosLazer, outrosEspacosLazer]);

     
    
    const ruaInput = useRef<TextInput>(null);
    const numeroInput = useRef<TextInput>(null);
    const bairroInput = useRef<TextInput>(null);
    const referencialInput = useRef<TextInput>(null);
    const areaImovelInput = useRef<TextInput>(null);
    const linhaBarcoInput = useRef<TextInput>(null);
    
    
    useEffect(() => {
      if (!imovel) return;
    
      // Campos básicos
      handleOnChangeInput(imovel.rua, 'rua');
      handleOnChangeInput(imovel.numero, 'numero');
      handleOnChangeInput(imovel.bairro, 'bairro');
      handleOnChangeInput(imovel.referencial, 'referencial');
    
         
      // Enums
      handleEnumChange('tipoSolo', imovel.tipoSolo);
      handleEnumChange('situacaoFundiaria', imovel.situacaoFundiaria);
      handleEnumChange('documentacaoImovel', imovel.documentacaoImovel);
      handleEnumChange('limites', imovel.limites);
      handleEnumChange('iluminacaoPublica', imovel.iluminacaoPublica);
      
    
      // Campos de texto
      handleOnChangeInput(imovel.linhasDeBarco ?? '', 'linhasDeBarco');
      handleOnChangeInput(imovel.programaInfraSaneamento ?? '', 'programaInfraSaneamento');
    }, [imovel]);
    

    const valorSalvoPavimentacao = imovel?.pavimentacao ?? '';
    const valorSalvoVizinhosConfinantes = imovel?.vizinhosConfinantes ?? '';
    const valorSalvoEquipamentosUrbanos = imovel?.equipamentosUrbanos ?? '';
    const valorSalvoAreaImovel = imovel?.areaImovel ? imovel.areaImovel.toFixed(2) : '';
    const valorSalvoLatitude = imovel?.latitude ?? '';
    const valorSalvoLongitude = imovel?.longitude ?? '';
    const linhasOnibusVelha = imovel?.linhasOnibus ?? '';
    const valorSalvoEsporteLazer = imovel?.espacosEsporteLazer ?? '';
    
     const handleEnviar = async () => {
          if (loading) return;
                
          const result = validateImovel(novoImovel);
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
               const imovelSalvo = await enviarRegistro(); 
                   if (imovelSalvo){
                     detalharImovel(navigation.navigate, imovelSalvo);
                   } else {
                     Alert.alert("Erro", "Não foi possível salvar a imovel. Tente novamente.");
                     navigation.goBack();
                   }
                  } catch (e) {
                    Alert.alert('Erro', 'Não foi possível realizar a operação.');
                  } finally {
                    setLoading(false); // 👈 desliga
                  }
        };

    

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <ImovelDetailContainer>
           <Input 
              value={novoImovel.rua} 
              maxLength={255}
              onChange={(event)=> handleOnChangeInput(event, 'rua')}
              placeholder="Informe a rua do imóvel"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Rua:"
              onSubmitEditing={()=>numeroInput.current?.focus()}
              ref={ruaInput}/>

           <Input 
              value={novoImovel.numero} 
              maxLength={45}
              onChange={(event)=> handleOnChangeInput(event, 'numero')}
              placeholder="Informe o número do Imóvel"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Número:"
              onSubmitEditing={()=>bairroInput.current?.focus()}
              ref={numeroInput}/>

           <Input 
              value={novoImovel.bairro} 
              maxLength={255}
              onChange={(event)=> handleOnChangeInput(event, 'bairro')}
              placeholder="Informe o bairro do imóvel"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Bairro:"
              onSubmitEditing={()=>referencialInput.current?.focus()}
              ref={bairroInput}
              />
             

            <Input 
              value={novoImovel.referencial} 
              maxLength={255}
              onChange={(event)=> handleOnChangeInput(event, 'referencial')}
              placeholder="Informe uma referência para o imóvel"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Informe algum referencial para o imóvel:"
              onSubmitEditing={()=>areaImovelInput.current?.focus()}
              ref={referencialInput}/>

           {valorSalvoLatitude && valorSalvoLongitude && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Latitude informada anteriormente:  {valorSalvoLatitude}{"\n"}
                 Longitude informada anteriormente:  {valorSalvoLongitude}
                </Text>
              )}
           <LocationInput
            initialLatitude={valorSalvoLatitude || undefined}
            initialLongitude={valorSalvoLongitude || undefined}
            onLocationChange={(lat, lon) => {
              handleLocationChange(lat, 'latitude');
              handleLocationChange(lon, 'longitude');
             }}
             />


              {valorSalvoAreaImovel && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  área informada anteriormente: {valorSalvoAreaImovel}
                </Text>
              )}
            <Input
              value={novoImovel.areaImovel?.toFixed(2) || ''}
              maxLength={20}
              onChange={handleOnChangeAreaImovel}
              keyboardType='numeric'
              placeholder="Área em m²"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Área do Imóvel (m²)"
              ref={areaImovelInput}
           />

            <RenderPicker
                    label="Qual o tipo de solo no imóvel?"
                    selectedValue={novoImovel.tipoSolo}
                    onValueChange={(value) => handleEnumChange('tipoSolo', value)}
                    options={soloOptions}
            />

                {valorSalvoVizinhosConfinantes  && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação dada anteriormente: {valorSalvoVizinhosConfinantes }
                </Text>
                 )}

                <CheckboxSelector
                 options={vizinhoOptions}
                 selectedValues={vizinhosConfinantesInformados}
                 label="Vizinhos Confinantes:"
                 exclusiveOptions={[ 'Não declarado','Não possui']}
                 onSave={(selectedValues) => {
                      setVizinhosConfinantesInformados(selectedValues);
                      handleArrayFieldChange('vizinhosConfinantes', selectedValues); 
                    }}
                 />
               

             <RenderPicker
              label="Situação Fundiária"
              selectedValue={novoImovel.situacaoFundiaria}
              onValueChange={(value) => handleEnumChange('situacaoFundiaria', value)}
               options={fundiarioOptions}
            />


             <RenderPicker
              label="Possui documentação?"
              selectedValue={novoImovel.documentacaoImovel}
              onValueChange={(value) => handleEnumChange('documentacaoImovel', value)}
              options={documentacaoOptions}
             />


             <RenderPicker
              label="Tipo de limites do imóvel"
              selectedValue={novoImovel.limites}
              onValueChange={(value) => handleEnumChange('limites', value)}
              options={limitesOptions}
             />

              <Input 
              value={novoImovel.linhasDeBarco} 
              maxLength={255}
              onChange={(event)=> handleOnChangeInput(event, 'linhasDeBarco')}
              placeholder="Se houver, informe as linhas de barco do local"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Há linhas de barco no local?"
              ref={linhaBarcoInput}
              />
 
 
              {linhasOnibusVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação dada anteriormente:  {linhasOnibusVelha}
                </Text>
              )}
             
              <RenderPicker
                  label="Existem linhas de ônibus que atendem o local?"
                  selectedValue={linhaOnibus}
                  onValueChange={(value) => {
                    setLinhaOnibus(value ?? ''); 
                    if (value !== 'Sim') {
                      SetQual('');
                    }
                  }}
                  options={['Sim', 'Não']}
                 />
                    {linhaOnibus.includes('Sim') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                      value={qual}
                      onChangeText={SetQual}
                      placeholder="Separe as informações por vírgula"
                      margin="15px 10px 30px 5px"
                      title="Quais linhas?"
                       />
                      </View>
                      )}



                {valorSalvoPavimentacao   && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informada dada anteriormente: {valorSalvoPavimentacao  }
                </Text>
                 )}

              <CheckboxSelector
                options={pavimentacaoOptions}
                selectedValues={pavimentacaoInformada}
                label="Pavimentação das vias?:"
                exclusiveOptions={['Nenhum']}
                onSave={(selectedValues) => {
                    setPavimentacaoInformada(selectedValues);
                    if (!selectedValues.includes('Outro')) {
                        SetOutrasInformadas('');
                    }
                }}
            />
            {pavimentacaoInformada.includes('Outro') && (
                <View style={{ marginTop: 10 }}>
                   <Input
                        value={outrasInformadas}
                        maxLength={200}
                        onChangeText={SetOutrasInformadas}
                        placeholder="Separe as informações por vírgula"
                        placeholderTextColor={theme.colors.grayTheme.gray80}
                        margin="15px 10px 30px 5px"
                        title="Informe quais:"
                    />
                </View>
            )}

                            
              <RenderPicker
              label="Iluminação pública?"
              selectedValue={novoImovel.iluminacaoPublica}
              onValueChange={(value) => handleEnumChange('iluminacaoPublica', value)}
              options={simNaoOptions}
              />

                 {valorSalvoEquipamentosUrbanos    && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informada dada anteriormente: {valorSalvoEquipamentosUrbanos   }
                </Text>
                 )}

                <RenderPicker
                  label="Equipamentos Urbanos Disponíveis:"  
                  selectedValue={equipamentosUrbanosInformados}
                  onValueChange={(value) => {
                      setEquipamentosUrbanosInformados(value ?? ''); 
                      if (value !== 'Sim') {
                        setOutrosEquipamentosUrbanos('');
                      }
                  }}
                  options={['Sim', 'Não']}
                />

                 {equipamentosUrbanosInformados.includes('Sim') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                      value={outrosEquipamentosUrbanos}
                      maxLength={200}
                      onChangeText={setOutrosEquipamentosUrbanos}
                      placeholder="Se não souber, infomar 'não sabe'"
                      placeholderTextColor={theme.colors.grayTheme.gray80}
                      margin="15px 10px 30px 5px"
                      title="Informe quais:"
                       />
                      </View>
                  )}


                 
                 {valorSalvoEsporteLazer    && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informada dada anteriormente: {valorSalvoEsporteLazer   }
                </Text>
                 )}
                <CheckboxSelector
                options={lazerOptions}
                selectedValues={espacosLazer}
                label="Espaços de Lazer?"
                exclusiveOptions={['Não tem','Não sabe']}
                onSave={(selectedValues) => {
                    setEspacosLazer(selectedValues);
                    if (!selectedValues.includes('Outros')) {
                        setOutrosEspacosLazer('');
                    }
                }}
            />
            {espacosLazer.includes('Outros') && (
                <View style={{ marginTop: 10 }}>
                   <Input
                        value={outrosEspacosLazer}
                        maxLength={300}
                        onChangeText={setOutrosEspacosLazer}
                        placeholder="Separe as informações por vírgula"
                        placeholderTextColor={theme.colors.grayTheme.gray80}
                        margin="15px 10px 30px 5px"
                        title="Informe quais:"
                    />
                </View>
            )}

              
             <Input 
              value={novoImovel.programaInfraSaneamento} 
              maxLength={450}
              onChange={(event)=> handleOnChangeInput(event, 'programaInfraSaneamento')}
              placeholder="Conhece algum programa destinado para a área?"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Programas de Infraestrutura e Saneamento:"
              />


          
              <FormErrors
                visible={showErrors && disabled}
                errors={validateImovel(novoImovel).errors}
              />
                               
              <Button
              title={loading ? "Enviando..." : "Enviar"}
              onPress={handleEnviar}
              color={"#ff4500"}
              disabled={loading}   // 👈 trava só enquanto envia
              />
    
      

        </ImovelDetailContainer>
        </ScrollView>
    )
}