import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Efluentes } from "../../../enums/Efluentes.enum";
import { EnergiaAlimentos } from "../../../enums/EnergiaAlimentos.enum";
import { FonteEnergia } from "../../../enums/FonteEnergia.enum";
import { Funcao } from "../../../enums/Funcao.enum";
import { InformativoPredominante } from "../../../enums/InformativoPredominante.enum";
import { origemMaterialConstrucao } from "../../../enums/OrigemMaterialConstrucao.enum";
import { Residuos } from "../../../enums/Residuos.enum";
import { TipoBenfeitoria } from "../../../enums/TipoBenfeitoria.enum";
import { TipoCobertura } from "../../../enums/TipoCobertura.enum";
import { TipoConstrucao } from "../../../enums/TipoConstrucao.enum";
import { TipoEsquadrias } from "../../../enums/TipoEsquadrias.enum";
import { Vizinhos } from "../../../enums/Vizinhos";
import { limitesTerrenoEnum } from "../../../enums/limitesTerreno.enum";
import { tipoSoloBenfeitoriaEnum } from "../../../enums/tipoSoloBenfeitoria.enum copy";
import { transporteEnum } from "../../../enums/transporte.enum";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { UseNovaBenfeitoria } from "../hooks/useBenfeitoriaInput";
import { BenfeitoriaContainer } from "../styles/benfeitoria.style";
import { imovelBody } from "../../../shared/types/imovelType";

export interface imovelParam {
imovel: imovelBody, 
benfeitoria?: BenfeitoriaType,
}

export const detalharBenfeitoria = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType)=>{
    navigate('BenfeitoriaDetails', {benfeitoria})
}

export const NovaBenfeitoria=()=>{
  const { params } = useRoute<RouteProp<Record<string, imovelParam>, string>>();
  const imovel = params.imovel ?? params.benfeitoria?.imovel;
  const benfeitoria = params.benfeitoria;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const {novaBenfeitoria, 
           enviarRegistro,
           handleEnumChange,
           handleArrayFieldChange,
           handleOnChangeAreaBenfeitoria,
           handleNumberChange,      
           handleOnChangeInput,     
           disabled,
           } = UseNovaBenfeitoria(imovel, benfeitoria);

    const [referencaiDaPrincipal, setReferencaiDaPrincipal] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);    
    const [alagamento, setAlagamento] = useState<string>('');     
    const [ocorrencia, SetOcorrencia] = useState<string>('');
    const [efluenteSanitario, setEfluenteSanitário] = useState<string[]>([]);     
    const [outrosDestinos, SetOutrosDestinos] = useState<string>('');
    const [residuosSolidos, setResiduosSolidos] = useState<string[]>([]);     
    const [outrosDescartes, SetOutrosDescartes] = useState<string>('');
    const [fonteEnergia, setFonteEnergia] = useState<string[]>([]);     
    const [outrasFontes, SetOutrasFontes] = useState<string>('');
    const [energiAlimento, setEnergiAlimento] = useState<string[]>([]);     
    const [outrasEnergias, SetOutrasEnergias] = useState<string>('');
    const [linhaOnibus, setLinhaOnibus] = useState<string>('');     
    const [qual, SetQual] = useState<string>('');
    const [meioInofrmativo, setMeioInformativo] = useState<string[]>([]);     
    const [outrosMeioInformativos, SetOutrosMeioInformativos] = useState<string>('');

    useEffect(() => {
      const consolidaDados = alagamento === 'SIM' 
        ? (ocorrencia ? [`ocorrencia: ${ocorrencia}`] : [])  
        : ['NÃO']; 
    
      handleArrayFieldChange('alagamentos', consolidaDados);
    
    }, [alagamento, ocorrencia]);

       

    useEffect(()=>{
      const consolidaDados = [
        ...efluenteSanitario.filter((item) => item !== 'Outro'),
        ...(outrosDestinos ? [`Outros: ${outrosDestinos}`] : []),
      ];

      handleArrayFieldChange('efluentes', consolidaDados);
    
    },[efluenteSanitario, outrosDestinos ])


    useEffect(()=>{
      const consolidaDados = [
        ...residuosSolidos.filter((item) => item !== 'Outro'),
        ...(outrosDescartes ? [`Outros: ${outrosDescartes}`] : []),
      ];

      handleArrayFieldChange('residuos', consolidaDados);
    
    },[residuosSolidos, outrosDescartes])

    useEffect(()=>{
      const consolidaDados = [
        ...fonteEnergia.filter((item) => item !== 'Outro'),
        ...(outrasFontes ? [`Outro: ${outrasFontes}`] : []),
      ];

      handleArrayFieldChange('fonteEnergia', consolidaDados);
    
    },[fonteEnergia, outrasFontes])

    useEffect(()=>{
      const consolidaDados = [
        ...energiAlimento.filter((item) => item !== 'Outros'),
        ...(outrasEnergias ? [`Outros: ${outrasEnergias}`] : []),
      ];

      handleArrayFieldChange('energiaAlimentos', consolidaDados);
    
    },[fonteEnergia, outrasEnergias])

    useEffect(() => {
      const consolidaDados = linhaOnibus === 'SIM' 
        ? (qual ? [`ocorrencia: ${qual}`] : [])  
        : ['NÃO']; 
    
      handleArrayFieldChange('linhasOnibus', consolidaDados);
    
    }, [linhaOnibus, qual]);

    useEffect(()=>{
      const consolidaDados = [
        ...meioInofrmativo.filter((item) => item !== 'Outros'),
        ...(outrosMeioInformativos ? [`Outros: ${outrosMeioInformativos}`] : []),
      ];

      handleArrayFieldChange('informativoPredominante', consolidaDados);
    
    },[meioInofrmativo, outrosMeioInformativos])
     
    const optionsTipoBenfeitoria = Object.values(TipoBenfeitoria)
    const vizinhoOptions =  Object.values(Vizinhos);
    const optionsFuncao = Object.values(Funcao)
    const optionsTipoSolo = Object.values(tipoSoloBenfeitoriaEnum)
    const limitesOptions = Object.values(limitesTerrenoEnum);
    const optionsTipoConstrucao = Object.values(TipoConstrucao)
    const optionsTipoCobertura = Object.values(TipoCobertura)
    const optionsTipoEsquadrias = Object.values(TipoEsquadrias)
    const optionsOrigemMaterial = Object.values(origemMaterialConstrucao)
    const optionsEfluentes = Object.values(Efluentes)
    const optionsLocomocao = Object.values(transporteEnum)
    const optionsResiduos = Object.values(Residuos)
    const optionsFonteEnergia = Object.values(FonteEnergia)
    const optionsEnergiaAlimentos = Object.values(EnergiaAlimentos)
    const optionsInformativoPredominante = Object.values(InformativoPredominante)
      
    


    const handleEnviar = async () => {
      setLoading(true);
    
      try {
        const benfeitoriaSalva = await enviarRegistro(); 
            if (benfeitoriaSalva){
              detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
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

    useEffect(() => {
      if (!benfeitoria) return;
    
      // Enums (selects diretos)
      handleEnumChange('tipoBenfeitoria', novaBenfeitoria.tipoBenfeitoria);
      handleEnumChange('funcao', novaBenfeitoria.funcao);
      handleEnumChange('impermeabilizacaoSolo', novaBenfeitoria.impermeabilizacaoSolo);
      handleEnumChange('limites', novaBenfeitoria.limites);
      handleEnumChange('paredes', novaBenfeitoria.paredes);
      handleEnumChange('tipoCobertura', novaBenfeitoria.tipoCobertura);
      handleEnumChange('tipoEsquadrias', novaBenfeitoria.tipoEsquadrias);
      handleEnumChange('origemMadeiraDaConstrucao', novaBenfeitoria.origemMadeiraDaConstrucao);
      handleEnumChange('origemPedraDaConstrucao', novaBenfeitoria.origemPedraDaConstrucao);
      handleEnumChange('origemAreiaDaConstrucao', novaBenfeitoria.origemAreiaDaConstrucao);
      handleEnumChange('meiosLocomocao', novaBenfeitoria.meiosLocomocao);
      handleOnChangeInput(novaBenfeitoria.epocaOcorrencia ?? '', 'epocaOcorrencia');
    }, [benfeitoria]);
    
       
    return( 
    
    <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
            <BenfeitoriaContainer>

             <RenderPicker
               label="Qual é a finalidade da benfeitoria?"
               selectedValue={novaBenfeitoria.tipoBenfeitoria}
               onValueChange={(value) => handleEnumChange('tipoBenfeitoria', value)}
               options={optionsTipoBenfeitoria}
            />

             <RenderPicker
               label="Qual é a função da benfeitoria?"
               selectedValue={novaBenfeitoria.funcao}
               onValueChange={(value) => handleEnumChange('funcao', value)}
               options={optionsFuncao}
            />

            <CheckboxSelector
              options={vizinhoOptions}
              selectedValues={referencaiDaPrincipal}
              label="Localização em relação à edificação principal:"
              onSave={(selectedValues) => {
                setReferencaiDaPrincipal(selectedValues);
                handleArrayFieldChange('afastamentoDaPrincipal', selectedValues); 
              }}
            />


            <RenderPicker
               label="Impermeabilização do Solo"
               selectedValue={novaBenfeitoria.impermeabilizacaoSolo}
               onValueChange={(value) => handleEnumChange('impermeabilizacaoSolo', value)}
               options={optionsTipoSolo}
            />

            <RenderPicker
              label="Tipo de limites da benfeitoria"
              selectedValue={novaBenfeitoria.limites}
              onValueChange={(value) => handleEnumChange('limites', value)}
              options={limitesOptions}
             />

            <Input
              value={novaBenfeitoria.areaBenfeitoria?.toFixed(2) || ''}
              onChange={handleOnChangeAreaBenfeitoria}
              keyboardType='numeric'
              placeholder="Área em m²"
              margin="15px 10px 30px 5px"
              title="Área da benfeitoria (m²)"
            />

             <Input
              value={novaBenfeitoria.pavimentos?.toString() || ''}
              onChange={(event)=>handleNumberChange(event, 'pavimentos')}
              keyboardType='numeric'
              placeholder="Área em m²"
              margin="15px 10px 30px 5px"
              title="Nº de pavimentos (térreo e altos):"
            />

             
             <RenderPicker
              label="Qual é o material das paredes da benfeitoria?"
              selectedValue={novaBenfeitoria.paredes}
              onValueChange={(value) => handleEnumChange('paredes', value)}
              options={optionsTipoConstrucao}
             />

             <RenderPicker
              label="Qual é o material da cobertura da benfeitoria?"
              selectedValue={novaBenfeitoria.tipoCobertura}
              onValueChange={(value) => handleEnumChange('tipoCobertura', value)}
              options={optionsTipoCobertura}
             />

              <RenderPicker
              label="Qual é o material da esquadria da benfeitoria?"
              selectedValue={novaBenfeitoria.tipoEsquadrias}
              onValueChange={(value) => handleEnumChange('tipoEsquadrias', value)}
              options={optionsTipoEsquadrias}
             />

             <RenderPicker
              label="Qual Origem da madeira utilizada na construção?"
              selectedValue={novaBenfeitoria.origemMadeiraDaConstrucao}
              onValueChange={(value) => handleEnumChange('origemMadeiraDaConstrucao', value)}
              options={optionsOrigemMaterial}
             />

             <RenderPicker
              label="Qual Origem da pedra utilizada na construção?"
              selectedValue={novaBenfeitoria.origemPedraDaConstrucao}
              onValueChange={(value) => handleEnumChange('origemPedraDaConstrucao', value)}
              options={optionsOrigemMaterial}
             />


             <RenderPicker
              label="Qual Origem da areia utilizada na construção?"
              selectedValue={novaBenfeitoria.origemAreiaDaConstrucao}
              onValueChange={(value) => handleEnumChange('origemAreiaDaConstrucao', value)}
              options={optionsOrigemMaterial}
             />

              <RenderPicker
                  label="Há ou já houve ocorrência de Alagamento ou Enchentes?"
                  selectedValue={alagamento}
                  onValueChange={(value) => {
                    setAlagamento(value ?? ''); 
                    if (value !== 'SIM') {
                      SetOcorrencia('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
              />
                    {alagamento.includes('SIM') && (
                      <View style={{ marginTop: 10 }}>
                            <RenderPicker
                            label="Qual é a ocorrência"
                            selectedValue={ocorrencia}
                            onValueChange={(value) => {SetOcorrencia(value ?? '');}}
                            options={['BAIXA', 'PERÍODICA']}
                        />
                      </View>
                      )}
               
                    {alagamento.includes('SIM') && (
                    <View style={{ marginTop: 10 }}>
                          <Input 
                          value={novaBenfeitoria.epocaOcorrencia} 
                          onChange={(event)=> handleOnChangeInput(event, 'epocaOcorrencia')}
                          placeholder="..."
                          margin="15px 10px 30px 5px"
                          title="Em que época do ano ocorrem/ocorreram os alagamentos?"
                          />
                    </View>
                    )}

             <RenderPicker
              label="Qual Origem da pedra utilizada na construção?"
              selectedValue={novaBenfeitoria.origemPedraDaConstrucao}
              onValueChange={(value) => handleEnumChange('origemPedraDaConstrucao', value)}
              options={optionsOrigemMaterial}
             />

             <CheckboxSelector
                options={optionsEfluentes}
                selectedValues={efluenteSanitario}
                label="Qual o destino dos efluentes sanitários?"
                onSave={(selectedValues) => {
                    setEfluenteSanitário(selectedValues);
                    if (!selectedValues.includes('Outros')) {
                        SetOutrosDestinos('');
                    }
                }}
              />
                  {efluenteSanitario.includes('Outros') && (
                      <View style={{ marginTop: 10 }}>
                          <Input
                              value={outrosDestinos}
                              onChangeText={SetOutrosDestinos}
                              placeholder="Separe as informações por vírgula"
                              margin="15px 10px 30px 5px"
                              title="Informe qual:"
                          />
                      </View>
                  )}



            <CheckboxSelector
                options={optionsResiduos}
                selectedValues={residuosSolidos}
                label="Qual o destino do lixo?"
                onSave={(selectedValues) => {
                    setResiduosSolidos(selectedValues);
                    if (!selectedValues.includes('Outro')) {
                        SetOutrosDescartes('');
                    }
                }}
              />
                  {residuosSolidos.includes('Outro') && (
                      <View style={{ marginTop: 10 }}>
                          <Input
                              value={outrosDescartes}
                              onChangeText={SetOutrosDescartes}
                              placeholder="Separe as informações por vírgula"
                              margin="15px 10px 30px 5px"
                              title="Qual?"
                          />
                      </View>
                  )}


              <CheckboxSelector
                options={optionsFonteEnergia}
                selectedValues={fonteEnergia}
                label="Qual a fonte de energia elétrica?"
                onSave={(selectedValues) => {
                    setFonteEnergia(selectedValues);
                    if (!selectedValues.includes('Outro')) {
                        SetOutrasFontes('');
                    }
                }}
              />
                  {fonteEnergia.includes('Outro') && (
                      <View style={{ marginTop: 10 }}>
                          <Input
                              value={outrasFontes}
                              onChangeText={SetOutrasFontes}
                              placeholder="Separe as informações por vírgula"
                              margin="15px 10px 30px 5px"
                              title="Qual?"
                          />
                      </View>
                  )}


               <CheckboxSelector
                options={optionsEnergiaAlimentos}
                selectedValues={energiAlimento}
                label="Qual a fonte de energia usada para a produção de alimentos?"
                onSave={(selectedValues) => {
                    setEnergiAlimento(selectedValues);
                    if (!selectedValues.includes('Outros')) {
                        SetOutrasEnergias('');
                    }
                }}
              />
                  {energiAlimento.includes('Outros') && (
                      <View style={{ marginTop: 10 }}>
                          <Input
                              value={outrasEnergias}
                              onChangeText={SetOutrasEnergias}
                              placeholder="Separe as informações por vírgula"
                              margin="15px 10px 30px 5px"
                              title="Qual?"
                          />
                      </View>
                  )}


             <RenderPicker
              label="Qual o meio de locomoção mais usado para deslocamento?"
              selectedValue={novaBenfeitoria.meiosLocomocao}
              onValueChange={(value) => handleEnumChange('meiosLocomocao', value)}
              options={optionsLocomocao}
             />

             
             <RenderPicker
                  label="Existem linhas de ônibus que atendem o local?"
                  selectedValue={linhaOnibus}
                  onValueChange={(value) => {
                    setLinhaOnibus(value ?? ''); 
                    if (value !== 'SIM') {
                      SetQual('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
                 />
                    {linhaOnibus.includes('SIM') && (
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


              
              <CheckboxSelector
                options={optionsInformativoPredominante}
                selectedValues={meioInofrmativo}
                label="Qual(is) meio(s) de informação a família mais utiliza?"
                onSave={(selectedValues) => {
                    setMeioInformativo(selectedValues);
                    if (!selectedValues.includes('Outros')) {
                        SetOutrosMeioInformativos('');
                    }
                }}
              />
                  {meioInofrmativo.includes('Outros') && (
                      <View style={{ marginTop: 10 }}>
                          <Input
                              value={outrosMeioInformativos}
                              onChangeText={SetOutrosMeioInformativos}
                              placeholder="Separe as informações por vírgula"
                              margin="15px 10px 30px 5px"
                              title="Qual?"
                          />
                      </View>
                  )}
            
           

              
            <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
              )}
            </View>
    
        </BenfeitoriaContainer>
    </ScrollView>
    )
}