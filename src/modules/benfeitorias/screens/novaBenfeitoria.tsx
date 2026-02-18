import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { FormErrors } from "../../../shared/components/FormErrors";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { theme } from "../../../shared/themes/theme";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { imovelBody } from "../../../shared/types/imovelType";
import { UseNovaBenfeitoria } from "../hooks/useBenfeitoriaInput";
import { BenfeitoriaContainer } from "../styles/benfeitoria.style";
import {
  limitesOptions,
  optionsEfluentes,
  optionsEnergiaAlimentos,
  optionsFonteEnergia,
  optionsFuncao,
  optionsInformativoPredominante,
  optionsLocomocao,
  optionsOrigemMaterial,
  optionsResiduos,
  optionsTipoBenfeitoria,
  optionsTipoCobertura,
  optionsTipoConstrucao,
  optionsTipoEsquadrias,
  optionsTipoSolo,
  vizinhoOptions
} from "../ui-components/opcoesBenfeitoria";

export interface imovelParam {
imovel: imovelBody, 
benfeitoria?: BenfeitoriaType,
}



export const NovaBenfeitoria=()=>{
  const { params } = useRoute<RouteProp<Record<string, imovelParam>, string>>();
  const imovel = params.imovel ?? params.benfeitoria?.imovel;
  const benfeitoria = params.benfeitoria;
  const navigation = useNavigation<any>();
  const {novaBenfeitoria, 
           enviarRegistro,
           handleEnumChange,
           handleArrayFieldChange,
           handleOnChangeAreaBenfeitoria,
           handleNumberChange,      
           handleOnChangeInput,     
           validateBenfeitoria,
           disabled,
           } = UseNovaBenfeitoria(imovel, benfeitoria);

    const [referenciaDaPrincipal, setReferenciaDaPrincipal] = useState<string[]>([]);
    const [showErrors, setShowErrors] = useState(false);
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
    const [meioInofrmativo, setMeioInformativo] = useState<string[]>([]);     
    const [outrosMeioInformativos, SetOutrosMeioInformativos] = useState<string>('');

    useEffect(() => {
      
      if (novaBenfeitoria.funcao === 'Principal') {
         setReferenciaDaPrincipal([]);
        handleArrayFieldChange('afastamentoDaPrincipal', []);
      } else {
         novaBenfeitoria.afastamentoDaPrincipal='';
        setReferenciaDaPrincipal([]);
        handleArrayFieldChange('afastamentoDaPrincipal', []);
      }
    }, [novaBenfeitoria.funcao]);
    
    
    
    useEffect(() => {
      const consolidaDados = alagamento === 'Sim' 
        ? (ocorrencia ? [`ocorrencia: ${ocorrencia}`] : [])  
        : ['Não']; 
    
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

    useEffect(() => {
      const consolidaDados = [
        ...energiAlimento.filter((item) => item !== 'Outros'),
        ...(outrasEnergias ? [`Outros: ${outrasEnergias}`] : []),
      ];
    
      handleArrayFieldChange('energiaAlimentos', consolidaDados);
    
    }, [energiAlimento, outrasEnergias]); // <- corrigido
    

     useEffect(()=>{
      const consolidaDados = [
        ...meioInofrmativo.filter((item) => item !== 'Outros'),
        ...(outrosMeioInformativos ? [`Outros: ${outrosMeioInformativos}`] : []),
      ];

      handleArrayFieldChange('informativoPredominante', consolidaDados);
    
    },[meioInofrmativo, outrosMeioInformativos])
     

      
    const handleEnviar = async () => {
      
      if (loading) return;
                
          const result = validateBenfeitoria(novaBenfeitoria);
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
        const benfeitoriaSalva = await enviarRegistro(); 
            if (benfeitoriaSalva){
              navigation.replace("BenfeitoriaDetails", { benfeitoria: benfeitoriaSalva });
            } else {
              Alert.alert("Erro", "Não foi possível salvar a benfeitoria. Tente novamente.");
              navigation.goBack();
            }
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível realizar a operação.');
          } finally {
            setLoading(false); // 👈 desliga
          }
    };

    useEffect(() => {
      if (!benfeitoria) return;

      handleEnumChange('tipoBenfeitoria', benfeitoria.tipoBenfeitoria);
      handleEnumChange('funcao', benfeitoria.funcao);
      handleEnumChange('impermeabilizacaoSolo', benfeitoria.impermeabilizacaoSolo);
      handleEnumChange('limites', benfeitoria.limites);
      handleEnumChange('paredes', benfeitoria.paredes);
      handleEnumChange('tipoCobertura', benfeitoria.tipoCobertura);
      handleEnumChange('tipoEsquadrias', benfeitoria.tipoEsquadrias);
      handleEnumChange('origemMadeiraDaConstrucao', benfeitoria.origemMadeiraDaConstrucao);
      handleEnumChange('origemPedraDaConstrucao', benfeitoria.origemPedraDaConstrucao);
      handleEnumChange('origemAreiaDaConstrucao', benfeitoria.origemAreiaDaConstrucao);
      handleEnumChange('meiosLocomocao', benfeitoria.meiosLocomocao);
      handleOnChangeInput(benfeitoria.epocaOcorrencia ?? '', 'epocaOcorrencia');
    }, [benfeitoria]);
    
       
    const afastamentoDaPrincipalvelha = benfeitoria?.afastamentoDaPrincipal ?? '';
    const areaBenfeitoriaVelha = benfeitoria?.areaBenfeitoria ?? '';
    const pavimentosVelha = benfeitoria?.pavimentos ?? '';
    const alagamentosVelha = benfeitoria?.alagamentos ?? '';
    const epocaOcorrenciaVelha = benfeitoria?.epocaOcorrencia ?? '';
    const efluentesVelha = benfeitoria?.efluentes ?? '';
    const residuosVelha = benfeitoria?.residuos ?? '';
    const fonteEnergiaVelha = benfeitoria?.fonteEnergia ?? '';
    const energiaAlimentosVelha = benfeitoria?.energiaAlimentos ?? '';
    const informativoPredominanteVelha = benfeitoria?.informativoPredominante ?? '';
    
    
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

              {afastamentoDaPrincipalvelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteiormente:  {afastamentoDaPrincipalvelha}
               </Text>
              )}

              {novaBenfeitoria.funcao !=="Principal" && (
               <CheckboxSelector
                options={vizinhoOptions}
                selectedValues={referenciaDaPrincipal}
                exclusiveOptions={['Não declarado','Não possui']}
                label="Localização em relação à edificação principal:"
                onSave={(selectedValues) => {
                  setReferenciaDaPrincipal(selectedValues);
                  handleArrayFieldChange('afastamentoDaPrincipal', selectedValues); 
                }}
            /> )}


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

               {areaBenfeitoriaVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteiormente:  {areaBenfeitoriaVelha}
               </Text>
              )}
            <Input
              value={novaBenfeitoria.areaBenfeitoria?.toFixed(2) || ''}
              onChange={handleOnChangeAreaBenfeitoria}
              keyboardType='numeric'
              placeholder="Área em m²"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Área da benfeitoria (m²)"
            />


                {pavimentosVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteiormente:  {pavimentosVelha}
               </Text>
                )}
             <Input
              value={novaBenfeitoria.pavimentos?.toString() || ''}
              onChange={(event)=>handleNumberChange(event, 'pavimentos')}
              keyboardType='numeric'
              placeholder="Área em m²"
              placeholderTextColor={theme.colors.grayTheme.gray80}
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
              label="Qual é a origem da madeira utilizada na construção?"
              selectedValue={novaBenfeitoria.origemMadeiraDaConstrucao}
              onValueChange={(value) => handleEnumChange('origemMadeiraDaConstrucao', value)}
              options={optionsOrigemMaterial}
             />

             <RenderPicker
              label="Qual é a origem da pedra utilizada na construção?"
              selectedValue={novaBenfeitoria.origemPedraDaConstrucao}
              onValueChange={(value) => handleEnumChange('origemPedraDaConstrucao', value)}
              options={optionsOrigemMaterial}
             />


             <RenderPicker
              label="Qual é a origem da areia utilizada na construção?"
              selectedValue={novaBenfeitoria.origemAreiaDaConstrucao}
              onValueChange={(value) => handleEnumChange('origemAreiaDaConstrucao', value)}
              options={optionsOrigemMaterial}
             />
              
              
              {alagamentosVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteriormente:  {alagamentosVelha}
                </Text>
              )}
               {epocaOcorrenciaVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação dada anteriormente:  {epocaOcorrenciaVelha}
                </Text>
              )}
              <RenderPicker
                  label="Há ou já houve ocorrência de Alagamento ou Enchentes?"
                  selectedValue={alagamento}
                  onValueChange={(value) => {
                    setAlagamento(value ?? ''); 
                    if (value !== 'Sim') {
                      SetOcorrencia('');
                    }
                  }}
                  options={['Sim', 'Não']}
              />
                    {alagamento === 'Sim' && (
                      <View style={{ marginTop: 10 }}>
                            <RenderPicker
                            label="Qual é a ocorrência"
                            selectedValue={ocorrencia}
                            onValueChange={(value) => {SetOcorrencia(value ?? '');}}
                            options={['BAIXA', 'PERÍODICA']}
                        />
                      </View>
                      )}
               
                    {alagamento.includes('Sim') && (
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

           
               {efluentesVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação dada anteriormente:  {efluentesVelha}
                </Text>
              )}

             <CheckboxSelector
                options={optionsEfluentes}
                selectedValues={efluenteSanitario}
                label="Qual é o destino dos efluentes sanitários?"
                onSave={(selectedValues) => {
                    setEfluenteSanitário(selectedValues);
                    if (!selectedValues.includes('Outro')) {
                        SetOutrosDestinos('');
                    }
                }}
              />
              {efluenteSanitario.includes('Outro') && (
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

               {residuosVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação dada anteriormente:  {residuosVelha}
                </Text>
              )}

            <CheckboxSelector
                options={optionsResiduos}
                selectedValues={residuosSolidos}
                label="Qual é o destino do lixo produzido?"
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
                              title="Qual é o destino?"
                          />
                      </View>
                  )}

               {fonteEnergiaVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação dada anteriormente:  {fonteEnergiaVelha}
                </Text>
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

               {energiaAlimentosVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação dada anteriormente:  {energiaAlimentosVelha}
                </Text>
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
                              placeholderTextColor={theme.colors.grayTheme.gray80}
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

                         
             {informativoPredominanteVelha && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação dada anteriormente:  {informativoPredominanteVelha}
                </Text>
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
            
           
              <FormErrors
                visible={showErrors && disabled}
                errors={validateBenfeitoria(novaBenfeitoria).errors}
              />
                               
              <Button
              title={loading ? "Enviando..." : "Enviar"}
              onPress={handleEnviar}
              color={"#ff4500"}
              disabled={loading}   // 👈 trava só enquanto envia
              />
    
        </BenfeitoriaContainer>
    </ScrollView>
    )
}