import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { FormErrors } from "../../../shared/components/FormErrors";
import { GlobalContainer } from "../../../shared/components/globalStyles/GlobalContainer";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import Text from "../../../shared/components/text/Text";
import { theme } from "../../../shared/themes/theme";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { imovelBody } from "../../../shared/types/imovelType";
import EntrevistadoSection from "../../entrevistadoDetails/ui-component/EntrevistadoSection";
import ImovelSection from "../../imovel/ui-component/imovelSeccion";
import { UseNovaBenfeitoria } from "../hooks/useBenfeitoriaInput";
import FormSection from "../../../shared/components/FormSection";
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
entrevistado: EntrevistadoType;
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

    const selecionarOpcaoUnica = (
      selectedValues: string[],
      currentValue: string,
      onSelect: (value: string) => void
    ) => {
      const novaOpcao = selectedValues.find(
        (valor) => valor !== currentValue
      );

      onSelect(novaOpcao ?? '');
    };

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
                
          const result = validateBenfeitoria(novaBenfeitoria, imovel.areaImovel );
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
             navigation.replace('EntrevistadoDetails', { entrevistado: params.entrevistado});
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
            <GlobalContainer>

              <EntrevistadoSection entrevistado={params.entrevistado} />
              <ImovelSection entrevistado={params.entrevistado} imovel={params.imovel} />



              <FormSection
                title="C.1 - Caracterização de Área Construída"
                initiallyOpen
                summary={
                  <Text style={{ color: 'gray' }}>
                    {novaBenfeitoria.tipoBenfeitoria || novaBenfeitoria.funcao
                      ? `${novaBenfeitoria.tipoBenfeitoria || 'Finalidade não informada'} • ${novaBenfeitoria.funcao || 'Função não informada'}`
                      : 'Nenhuma informação cadastrada'}
                  </Text>
                }
              >
             <CheckboxSelector
               options={optionsTipoBenfeitoria}
               selectedValues={novaBenfeitoria.tipoBenfeitoria ? [novaBenfeitoria.tipoBenfeitoria] : []}
               label="Qual é a finalidade desta benfeitoria?"
               onSave={(values) =>
                 selecionarOpcaoUnica(
                   values,
                   novaBenfeitoria.tipoBenfeitoria ?? '',
                   (value) => handleEnumChange('tipoBenfeitoria', value)
                 )
               }
            />

             <CheckboxSelector
               options={optionsFuncao}
               selectedValues={novaBenfeitoria.funcao ? [novaBenfeitoria.funcao] : []}
               label="Qual é a função desta benfeitoria?"
               onSave={(values) =>
                 selecionarOpcaoUnica(
                   values,
                   novaBenfeitoria.funcao ?? '',
                   (value) => handleEnumChange('funcao', value)
                 )
               }
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
              title="Área desta benfeitoria (m²)"
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
              </FormSection>

              <FormSection
                title="C.2 - Características da construção"
                summary={
                  <Text style={{ color: 'gray' }}>
                    {novaBenfeitoria.impermeabilizacaoSolo ||
                    novaBenfeitoria.limites ||
                    novaBenfeitoria.paredes ||
                    novaBenfeitoria.tipoCobertura ||
                    novaBenfeitoria.tipoEsquadrias ||
                    novaBenfeitoria.origemMadeiraDaConstrucao ||
                    novaBenfeitoria.origemPedraDaConstrucao ||
                    novaBenfeitoria.origemAreiaDaConstrucao
                      ? 'Informações cadastradas'
                      : 'Nenhuma informação cadastrada'}
                  </Text>
                }
              >
            <CheckboxSelector
               options={optionsTipoSolo}
               selectedValues={novaBenfeitoria.impermeabilizacaoSolo ? [novaBenfeitoria.impermeabilizacaoSolo] : []}
               label="Impermeabilização do Solo"
               onSave={(values) =>
                 selecionarOpcaoUnica(
                   values,
                   novaBenfeitoria.impermeabilizacaoSolo ?? '',
                   (value) => handleEnumChange('impermeabilizacaoSolo', value)
                 )
               }
            />

            <CheckboxSelector
              options={limitesOptions}
              selectedValues={novaBenfeitoria.limites ? [novaBenfeitoria.limites] : []}
              label="Tipo de limites desta benfeitoria"
              onSave={(values) =>
                selecionarOpcaoUnica(
                  values,
                  novaBenfeitoria.limites ?? '',
                  (value) => handleEnumChange('limites', value)
                )
              }
             />
             <CheckboxSelector
              options={optionsTipoConstrucao}
              selectedValues={novaBenfeitoria.paredes ? [novaBenfeitoria.paredes] : []}
              label="Qual é o material das paredes desta benfeitoria?"
              onSave={(values) =>
                selecionarOpcaoUnica(
                  values,
                  novaBenfeitoria.paredes ?? '',
                  (value) => handleEnumChange('paredes', value)
                )
              }
             />

             <CheckboxSelector
              options={optionsTipoCobertura}
              selectedValues={novaBenfeitoria.tipoCobertura ? [novaBenfeitoria.tipoCobertura] : []}
              label="Qual é o material da cobertura desta benfeitoria?"
              onSave={(values) =>
                selecionarOpcaoUnica(
                  values,
                  novaBenfeitoria.tipoCobertura ?? '',
                  (value) => handleEnumChange('tipoCobertura', value)
                )
              }
             />

              <CheckboxSelector
              options={optionsTipoEsquadrias}
              selectedValues={novaBenfeitoria.tipoEsquadrias ? [novaBenfeitoria.tipoEsquadrias] : []}
              label="Qual é o material da esquadria desta benfeitoria?"
              onSave={(values) =>
                selecionarOpcaoUnica(
                  values,
                  novaBenfeitoria.tipoEsquadrias ?? '',
                  (value) => handleEnumChange('tipoEsquadrias', value)
                )
              }
             />

             <CheckboxSelector
              options={optionsOrigemMaterial}
              selectedValues={novaBenfeitoria.origemMadeiraDaConstrucao ? [novaBenfeitoria.origemMadeiraDaConstrucao] : []}
              label="Qual é a origem da madeira utilizada na construção?"
              onSave={(values) =>
                selecionarOpcaoUnica(
                  values,
                  novaBenfeitoria.origemMadeiraDaConstrucao ?? '',
                  (value) => handleEnumChange('origemMadeiraDaConstrucao', value)
                )
              }
             />

             <CheckboxSelector
              options={optionsOrigemMaterial}
              selectedValues={novaBenfeitoria.origemPedraDaConstrucao ? [novaBenfeitoria.origemPedraDaConstrucao] : []}
              label="Qual é a origem da pedra utilizada na construção?"
              onSave={(values) =>
                selecionarOpcaoUnica(
                  values,
                  novaBenfeitoria.origemPedraDaConstrucao ?? '',
                  (value) => handleEnumChange('origemPedraDaConstrucao', value)
                )
              }
             />


             <CheckboxSelector
              options={optionsOrigemMaterial}
              selectedValues={novaBenfeitoria.origemAreiaDaConstrucao ? [novaBenfeitoria.origemAreiaDaConstrucao] : []}
              label="Qual é a origem da areia utilizada na construção?"
              onSave={(values) =>
                selecionarOpcaoUnica(
                  values,
                  novaBenfeitoria.origemAreiaDaConstrucao ?? '',
                  (value) => handleEnumChange('origemAreiaDaConstrucao', value)
                )
              }
             />
              </FormSection>

              <FormSection
                title="C.3 - Condições ambientais e saneamento"
                summary={
                  <Text style={{ color: 'gray' }}>
                    {alagamento ||
                    efluenteSanitario.length > 0 ||
                    residuosSolidos.length > 0
                      ? 'Informações cadastradas'
                      : 'Nenhuma informação cadastrada'}
                  </Text>
                }
              >
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
              <CheckboxSelector
                  options={['Sim', 'Não']}
                  selectedValues={alagamento ? [alagamento] : []}
                  label="Há ou já houve ocorrência de Alagamento ou Enchentes?"
                  onSave={(values) =>
                    selecionarOpcaoUnica(
                      values,
                      alagamento,
                      (value) => {
                        setAlagamento(value);
                        if (value !== 'Sim') {
                          SetOcorrencia('');
                        }
                      }
                    )
                  }
              />
                    {alagamento === 'Sim' && (
                      <View style={{ marginTop: 10 }}>
                            <CheckboxSelector
                            options={['BAIXA', 'PERÍODICA']}
                            selectedValues={ocorrencia ? [ocorrencia] : []}
                            label="Qual é a ocorrência"
                            onSave={(values) =>
                              selecionarOpcaoUnica(
                                values,
                                ocorrencia,
                                SetOcorrencia
                              )
                            }
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

 </FormSection>

              <FormSection
                title="C.4 - Infraestrutura e rotina da família"
                summary={
                  <Text style={{ color: 'gray' }}>
                    {fonteEnergia.length > 0 ||
                    energiAlimento.length > 0 ||
                    novaBenfeitoria.meiosLocomocao ||
                    meioInofrmativo.length > 0
                      ? 'Informações cadastradas'
                      : 'Nenhuma informação cadastrada'}
                  </Text>
                }
              >
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


             <CheckboxSelector
              options={optionsLocomocao}
              selectedValues={novaBenfeitoria.meiosLocomocao ? [novaBenfeitoria.meiosLocomocao] : []}
              label="Qual o meio de locomoção mais usado para deslocamento?"
              onSave={(values) =>
                selecionarOpcaoUnica(
                  values,
                  novaBenfeitoria.meiosLocomocao ?? '',
                  (value) => handleEnumChange('meiosLocomocao', value)
                )
              }
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
              </FormSection>

              <FormErrors
                visible={showErrors && disabled}
                errors={validateBenfeitoria(
                  novaBenfeitoria,
                  imovel.areaImovel
                ).errors}
              />
                               
              <Button
              title={loading ? "Enviando..." : "Enviar"}
              onPress={handleEnviar}
              color={"#ff4500"}
              disabled={loading}   // 👈 trava só enquanto envia
              />
    
        </GlobalContainer>
    </ScrollView>
    )

}