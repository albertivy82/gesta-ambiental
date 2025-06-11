import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, ScrollView, TextInput, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Vizinhos } from "../../../enums/Vizinhos";
import { documentacao } from "../../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../../enums/limitesTerreno.enum";
import { ServicosBasicos } from "../../../enums/servicosBasicos.enum";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { situacaoFundiaria } from "../../../enums/situacaoFundiaria.enum";
import { tipoSoloEnum } from "../../../enums/tipoSolo.enum";
import { transporteEnum } from "../../../enums/transporte.enum";
import { getLocalidadesPorId } from "../../../realm/services/localidadeServices";
import LocationInput from "../../../shared/components/input/LocationInput";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { useNovoImovel } from "../hooks/useInputImovel";
import { ImovelDetailContainer } from "../styles/ImovelDetails.style";
import { SimNao } from "../../../enums/simNao.enum";
import { pavimentacao } from "../../../enums/pavimentacao.enum";
import { theme } from "../../../shared/themes/theme";
import { textTypes } from "../../../shared/components/text/textTypes";
import Text from "../../../shared/components/text/Text";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { imovelBody } from "../../../shared/types/imovelType";


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
  const [loading, setLoading] = useState(false); 
  const { novoImovel,
    handleOnChangeInput,
    handleArrayFieldChange,
    handleEnumChange,
    enviarRegistro,
    handleOnChangeAreaImovel,
    disabled} = useNovoImovel(entrevistado, imovel);
    

  const [pavimentacaoInformada, setPavimentacaoInformada] = useState<string[]>([]);  
  const [outrasInformadas, SetOutrasInformadas] = useState<string>('');
  const [vizinhosConfinantesInformados, setVizinhosConfinantesInformados] = useState<string[]>([]);
  const [outrasVizinhosConfinantes, setOutrasVizinhosConfinantes] = useState<string>('');
  const [equipamentosUrbanosInformados, setEquipamentosUrbanosInformados] = useState<string[]>([]);
  const [outrosEquipamentosUrbanos, setOutrosEquipamentosUrbanos] = useState<string>('');
  
      
      
  useEffect(()=>{
        const consolidaDados = [
          ...pavimentacaoInformada.filter((item) => item !== 'Outras'),
          ...(outrasInformadas ? [`Outras: ${outrasInformadas}`] : []),
        ];
  
        handleArrayFieldChange('pavimentacao', consolidaDados);
      
  },[pavimentacaoInformada, outrasInformadas ])

  
  useEffect(() => {
    const consolidaVizinhosConfinantes = [
        ...vizinhosConfinantesInformados.filter((item) => item !== 'Outras'),
        ...(outrasVizinhosConfinantes ? [`Outras: ${outrasVizinhosConfinantes}`] : []),
    ];

    handleArrayFieldChange('vizinhosConfinantes', consolidaVizinhosConfinantes);
  }, [vizinhosConfinantesInformados, outrasVizinhosConfinantes]);


  useEffect(() => {
    const consolidaEquipamentosUrbanos = [
        ...equipamentosUrbanosInformados.filter((item) => item !== 'SIM'),
        ...(outrosEquipamentosUrbanos ? [`Outros: ${outrosEquipamentosUrbanos}`] : []),
    ];

    handleArrayFieldChange('equipamentosUrbanos', consolidaEquipamentosUrbanos);
  }, [equipamentosUrbanosInformados, outrosEquipamentosUrbanos]);


  

    
    const fundiarioOptions = Object.values(situacaoFundiaria);
    const documentacaoOptions = Object.values(documentacao);
    const limitesOptions = Object.values(limitesTerrenoEnum);
    const soloOptions = Object.values(tipoSoloEnum);
    const lazerOptions = Object.values(esporteLazerEnum);
    const equipamentosUrbanosOptions = Object.values(SimNao);
    const simNaoOptions =  Object.values(SimNao);
    const vizinhoOptions =  Object.values(Vizinhos);
    const ruaInput = useRef<TextInput>(null);
    const numeroInput = useRef<TextInput>(null);
    const bairroInput = useRef<TextInput>(null);
    const referencialInput = useRef<TextInput>(null);
    const areaImovelInput = useRef<TextInput>(null);
    const linhaBarcoInput = useRef<TextInput>(null);
    const inraestruturaInput = useRef<TextInput>(null);
    const pavimentacaoOptions = Object.values(pavimentacao);
    
    
    
    
     const handleEnviar = async () => {
             setLoading(true);
           
             try {
               const imovelSalvo = await enviarRegistro(); 
                   if (imovelSalvo){
                     detalharImovel(navigation.navigate, imovelSalvo);
                   } else {
                     Alert.alert("Erro", "Não foi possível salvar a imovel. Tente novamente.");
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
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <ImovelDetailContainer>
           <Input 
              value={novoImovel.rua} 
              onChange={(event)=> handleOnChangeInput(event, 'rua')}
              placeholder="Informe a rua do imóvel"
              margin="15px 10px 30px 5px"
              title="Rua:"
              onSubmitEditing={()=>numeroInput.current?.focus()}
              ref={ruaInput}/>

           <Input 
              value={novoImovel.numero} 
              onChange={(event)=> handleOnChangeInput(event, 'numero')}
              placeholder="Imforme o número do Imóvel"
              margin="15px 10px 30px 5px"
              title="Número:"
              onSubmitEditing={()=>bairroInput.current?.focus()}
              ref={numeroInput}/>

           <Input 
              value={novoImovel.bairro} 
              onChange={(event)=> handleOnChangeInput(event, 'bairro')}
              placeholder="Informe o bairro imóvel"
              margin="15px 10px 30px 5px"
              title="Bairro:"
              onSubmitEditing={()=>referencialInput.current?.focus()}
              ref={bairroInput}
              />
             

            <Input 
              value={novoImovel.referencial} 
              onChange={(event)=> handleOnChangeInput(event, 'referencial')}
              placeholder="Informe uma referência para o imóvel"
              margin="15px 10px 30px 5px"
              title="Referencial:"
              onSubmitEditing={()=>areaImovelInput.current?.focus()}
              ref={referencialInput}/>

            <LocationInput
                onLocationChange={(lat, lon) => {
                  handleOnChangeInput(lat, 'latitude');
                  handleOnChangeInput(lon, 'longitude');
                }}
              />

            <Input
              value={novoImovel.areaImovel?.toFixed(2) || ''}
              onChange={handleOnChangeAreaImovel}
              keyboardType='numeric'
              placeholder="Área em m²"
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

                <CheckboxSelector
                    options={vizinhoOptions}
                    selectedValues={vizinhosConfinantesInformados}
                    label="Vizinhos Confinantes:"
                    onSave={(selectedValues) => {
                        setVizinhosConfinantesInformados(selectedValues);
                        if (!selectedValues.includes('Outras')) {
                            setOutrasVizinhosConfinantes('');
                        }
                    }}
                />
                {vizinhosConfinantesInformados.includes('Outras') && (
                    <View style={{ marginTop: 10 }}>
                        <Text
                            margin="0px 0px 4px 8px"
                            color={theme.colors.whiteTheme.white}
                            type={textTypes.SUB_TITLE_BOLD}
                        >
                            Informe quais:
                        </Text>
                        <Input
                            value={outrasVizinhosConfinantes}
                            onChangeText={setOutrasVizinhosConfinantes}
                            placeholder="Separe as informações por vírgula"
                            margin="15px 10px 30px 5px"
                            title="Informe quais:"
                        />
                    </View>
                )}
           

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
              onChange={(event)=> handleOnChangeInput(event, 'linhasDeBarco')}
              placeholder="Se houver, informe as linhas de barco do local"
              margin="15px 10px 30px 5px"
              title="Há linhas de barco no local?"
              ref={linhaBarcoInput}
              />

              <CheckboxSelector
                options={pavimentacaoOptions}
                selectedValues={pavimentacaoInformada}
                label="Pavimentação das vias?:"
                onSave={(selectedValues) => {
                    setPavimentacaoInformada(selectedValues);
                    if (!selectedValues.includes('Outras')) {
                        SetOutrasInformadas('');
                    }
                }}
            />
            {pavimentacaoInformada.includes('Outras') && (
                <View style={{ marginTop: 10 }}>
                    <Text
                        margin="0px 0px 4px 8px"
                        color={theme.colors.whiteTheme.white}
                        type={textTypes.SUB_TITLE_BOLD}
                    >
                        Informe quais:
                    </Text>
                    <Input
                        value={outrasInformadas}
                        onChangeText={SetOutrasInformadas}
                        placeholder="Separe as informações por vírgula"
                        margin="15px 10px 30px 5px"
                        title="Informe quais:"
                    />
                </View>
            )}

                            
              <RenderPicker
              label="Ilumincao pública?"
              selectedValue={novoImovel.iluminacaoPublica}
              onValueChange={(value) => handleEnumChange('iluminacaoPublica', value)}
              options={simNaoOptions}
              />

             

                <CheckboxSelector
                    options={equipamentosUrbanosOptions}
                    selectedValues={equipamentosUrbanosInformados}
                    label="Equipamentos Urbanos Disponíveis:"
                    onSave={(selectedValues) => {
                        setEquipamentosUrbanosInformados(selectedValues);
                        if (!selectedValues.includes('Outras')) {
                            setOutrosEquipamentosUrbanos('');
                        }
                    }}
                />
                {equipamentosUrbanosInformados.includes('SIM') && (
                    <View style={{ marginTop: 10 }}>
                        <Text
                            margin="0px 0px 4px 8px"
                            color={theme.colors.whiteTheme.white}
                            type={textTypes.SUB_TITLE_BOLD}
                        >
                            Informe quais:
                        </Text>
                        <Input
                            value={outrosEquipamentosUrbanos}
                            onChangeText={setOutrosEquipamentosUrbanos}
                            placeholder="Se não souber, infomar 'não sabe'"
                            margin="15px 10px 30px 5px"
                            title="Informe quais:"
                        />
                    </View>
                )}

                
              
             <RenderPicker
             label="Espaços de Lazer?"
             selectedValue={novoImovel.espacosEsporteLazer}
             onValueChange={(value) => handleEnumChange('espacosEsporteLazer', value)}
             options={lazerOptions}
             />

              
             <Input 
              value={novoImovel.programaInfraSaneamento} 
              onChange={(event)=> handleOnChangeInput(event, 'programaInfraSaneamento')}
              placeholder="Conhece algum destinado para a área"
              margin="15px 10px 30px 5px"
              title="Programas de Infraestrutura e Saneamento:"
              onSubmitEditing={()=>linhaBarcoInput.current?.focus()}
              ref={inraestruturaInput}
              />


          
     <View style={{ marginTop: 40 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff4500" /> // Exibe o spinner enquanto está carregando
      ) : (
        <Button title="Enviar" onPress={handleEnviar} color='#ff4500' disabled={disabled || loading} />
      )}
    </View>
 
    
      

        </ImovelDetailContainer>
        </ScrollView>
    )
}