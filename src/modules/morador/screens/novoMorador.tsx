import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { useNovoMorador } from "../hooks/useInputMorador";
import { MoradorDetailContainer } from "../styles/morador.style";
import DateSelector from "../../../shared/components/input/DateSelector";
import { Perfil } from "../../../enums/Perfil";
import { Sexo } from "../../../enums/Sexo";
import { EstadoCivil } from "../../../enums/EstadoCivil.enum";
import { Escolaridade } from "../../../enums/Escolaridade";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import { Molestias } from "../../../enums/molestias.enum";





export interface idParam {
  Benfeitoria: BenfeitoriaType;
}

export const NovoMorador = ()=>{
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
   const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const [loading, setLoading] = useState(false); 
   const [estuda, setEstuda] = useState<string>('');     
   const [ondeEstuda, SetOndeEstuda] = useState<string>('');
   const [trabalha, setTrabalha] = useState<string>('');     
   const [ondeTrabalha, SetOndeTrabalha] = useState<string>('');
   const [religiao, setReligiao] = useState<string>('');     
   const [qualReligiao, SetQualReligiao] = useState<string>('');
   const [doencaInformada, setDoencaInformada] = useState<string[]>([]);  
   const {  novoMorador,
            handleOnChangeInput,
            handleEnumChange,
            handleArrayFieldChange,
            handleOnChangeData,
            disabled
          } = useNovoMorador(params.Benfeitoria);


  useEffect(() => {
        const consolidaDados = estuda === 'SIM' 
          ? (ondeEstuda ? [`onde estuda: ${ondeEstuda}`] : [])  
          : ['NÃO']; 
      
        handleArrayFieldChange('ondeEstuda', consolidaDados);
      
  }, [estuda, ondeEstuda]);

  useEffect(() => {
    const consolidaDados = trabalha === 'SIM' 
      ? (ondeTrabalha ? [`onde trabalha: ${ondeTrabalha}`] : [])  
      : ['NÃO']; 
  
    handleArrayFieldChange('trabalho', consolidaDados);
  
   }, [trabalha, ondeEstuda]);

  useEffect(() => {
    const consolidaDados = religiao === 'SIM' 
      ? (qualReligiao ? [`Qual: ${qualReligiao}`] : [])  
      : ['NÃO']; 

    handleArrayFieldChange('religiao', consolidaDados);

  }, [religiao, qualReligiao]);

  useEffect(()=>{
   
    handleArrayFieldChange('doencas', doencaInformada);
  
  },[doencaInformada])
   
  
  const perfilOptions =  Object.values(Perfil);
  const sexoOptions =  Object.values(Sexo);
  const estadoCivilOptions =  Object.values(EstadoCivil);
  const escolaridadeOptions =  Object.values(Escolaridade);
  const molestiasOptions =  Object.values(Molestias);
    
    const handleEnviar = async () => {
         setLoading(true);
       
         try {
           const moradorSalva = true//await enviarRegistro(); 
               if (moradorSalva){
                 //detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
               } else {
                 Alert.alert("Erro", "Não foi possível salvar a benfeitoria. Tente novomente.");
                 navigation.goBack();
               }
         } catch (error) {
           console.error("Erro no envio:", error);
           Alert.alert("Erro ao enviar", "Tente novomente mais tarde.");
         } finally {
           setLoading(false);
         }
       };

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <MoradorDetailContainer>
          
      
             <DateSelector   
                label="Data de nascimento"
                onDateChange={(selectedDate) => handleOnChangeData(selectedDate, 'dataNascimento')}
              />


              <RenderPicker
               label="Selecione o perfil do morador"
               selectedValue={novoMorador.perfil}
               onValueChange={(value) => handleEnumChange('perfil', value)}
               options={perfilOptions}
              />


              <RenderPicker
               label="Qual o sexo do morador"
               selectedValue={novoMorador.sexo}
               onValueChange={(value) => handleEnumChange('sexo', value)}
               options={sexoOptions}
              />

              <RenderPicker
               label="Informe o estado civil do morador?"
               selectedValue={novoMorador.estadoCivil}
               onValueChange={(value) => handleEnumChange('estadoCivil', value)}
               options={estadoCivilOptions}
            />

              <RenderPicker
               label="Qual o nível de escolaridade do morador?"
               selectedValue={novoMorador.escolaridade}
               onValueChange={(value) => handleEnumChange('escolaridade', value)}
               options={escolaridadeOptions}
              />

             <RenderPicker
                  label="Estuda?"
                  selectedValue={estuda}
                  onValueChange={(value) => {
                    setEstuda(value ?? ''); 
                    if (value !== 'SIM') {
                      SetOndeEstuda('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
                 />
                    {estuda.includes('SIM') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                      value={ondeEstuda}
                      onChangeText={SetOndeEstuda}
                      placeholder="..."
                      margin="15px 10px 30px 5px"
                      title="Onde Etuda?"
                       />
                      </View>
                 )}

                <RenderPicker
                  label="Trabalha?"
                  selectedValue={trabalha}
                  onValueChange={(value) => {
                    setTrabalha(value ?? ''); 
                    if (value !== 'SIM') {
                      SetOndeTrabalha('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
                 />
                    {trabalha.includes('SIM') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                      value={ondeTrabalha}
                      onChangeText={SetOndeTrabalha}
                      placeholder="..."
                      margin="15px 10px 30px 5px"
                      title="Onde trabalha?"
                       />
                      </View>
                 )}

                  <RenderPicker
                  label="Trabalha?"
                  selectedValue={trabalha}
                  onValueChange={(value) => {
                    setTrabalha(value ?? ''); 
                    if (value !== 'SIM') {
                      SetOndeTrabalha('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
                 />
                    {trabalha.includes('SIM') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                      value={ondeTrabalha}
                      onChangeText={SetOndeTrabalha}
                      placeholder="..."
                      margin="15px 10px 30px 5px"
                      title="Onde trabalha?"
                       />
                      </View>
                 )}
               
               <RenderPicker
                  label="O morador possui religião?"
                  selectedValue={religiao}
                  onValueChange={(value) => {
                    setReligiao(value ?? ''); 
                    if (value !== 'SIM') {
                      SetQualReligiao('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
                 />
                    {religiao.includes('SIM') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                      value={qualReligiao}
                      onChangeText={SetQualReligiao}
                      placeholder="..."
                      margin="15px 10px 30px 5px"
                      title="Qual?"
                       />
                      </View>
                 )}

                <CheckboxSelector
                options={molestiasOptions}
                selectedValues={doencaInformada}
                label="Selecione as opções de Alimentação"
                onSave={(selectedValues) => {
                    setDoencaInformada(selectedValues);
                }}
                />

             
          
             <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
              )}
            </View>
      

        </MoradorDetailContainer>
        </ScrollView>
    )
} 