import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Molestias } from "../../../enums/molestias.enum";
import { Perfil } from "../../../enums/Perfil";
import { Sexo } from "../../../enums/Sexo";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";
import { theme } from "../../../shared/themes/theme";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { MoradorType } from "../../../shared/types/MoradorType";
import { useNovoMorador } from "../hooks/useInputMorador";
import { MoradorDetailContainer } from "../styles/morador.style";
import { estadoCivilOptions } from "../ui-components/opcoesMorador";
import { useBuscaEntrevistado } from "../hooks/useBuscaEntrevistado";


export interface NovoMoradorParams {
  benfeitoria: BenfeitoriaType;
  morador?: MoradorType;
}

export const detalharMorador = (navigate: NavigationProp<ParamListBase>['navigate'], morador: MoradorType)=>{
  navigate('MoradorDetails', {morador})
}

export const NovoMorador = ()=>{
   const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const { params } = useRoute<RouteProp<Record<string, NovoMoradorParams>, string>>();
   const benfeitoria = params.benfeitoria ?? params.morador?.benfeitoria;
   const morador = params.morador;
   const [loading, setLoading] = useState(false); 
   const [validator, setValidator] = useState(false); 
   const [estuda, setEstuda] = useState<string>('');     
   const [ondeEstuda, SetOndeEstuda] = useState<string>('');
   const [trabalha, setTrabalha] = useState<string>('');     
   const [ondeTrabalha, SetOndeTrabalha] = useState<string>('');
   const [doencaInformada, setDoencaInformada] = useState<string[]>([]);  
   const [idade, setIdade] = useState<number>();
   const {  novoMorador,
            handleEnumChange,
            handleArrayFieldChange,
            enviarRegistro,
            handleSetNumber,
            disabled
          } = useNovoMorador(benfeitoria, morador);
 const {entrevistado} = useBuscaEntrevistado(benfeitoria, morador);

     
  useEffect(() => {
        const consolidaDados = estuda === 'Sim' 
          ? (ondeEstuda ? [`onde estuda: ${ondeEstuda}`] : [])  
          : ['Não']; 
      
        handleArrayFieldChange('ondeEstuda', consolidaDados);
      
  }, [estuda, ondeEstuda]);

  useEffect(() => {
    const consolidaDados = trabalha === 'Sim' 
      ? (ondeTrabalha ? [`onde trabalha: ${ondeTrabalha}`] : [])  
      : ['Não']; 
  
    handleArrayFieldChange('trabalho', consolidaDados);
  
   }, [trabalha, ondeTrabalha]);


  useEffect(()=>{
   
    handleArrayFieldChange('doencas', doencaInformada);
  
  },[doencaInformada])

  useEffect(()=>{
    handleSetNumber(idade!,'dataNascimento');
 },[idade])
   
  const religiaoOptions = Object.values(['Católica', 'Evangélica', 'Espírita', 'Matriz Africana', 'Sem Religião']);
  const perfilOptions =  Object.values(Perfil);
  const sexoOptions =  Object.values(Sexo);
  const escolaridadeOptions =  Object.values([
    "Analfabeto",
    "Fundamental completo",
    "Fundamental incompleto",
    "Ensino médio completo",
    "Ensino médio incompleto",
    "Ensino superior completo",
    "Ensino superior incompleto",
    "Pós-graduação"
  ]);
  const molestiasOptions =  Object.values(Molestias);
    
    const handleEnviar = async () => {
         setLoading(true);
       
         try {
           const moradorSalvo = await enviarRegistro(); 
               if (moradorSalvo){
                 detalharMorador(navigation.navigate, moradorSalvo);
               } else {
                 Alert.alert("Erro", "Não foi possível salvar a morador. Tente novomente.");
                 navigation.goBack();
               }
         } catch (error) {
           console.error("Erro no envio:", error);
           Alert.alert("Erro ao enviar", "Tente novomente mais tarde.");
         } finally {
           setLoading(false);
         }
       };


       useEffect(() => {
        if (!morador) return;
        handleSetNumber(morador.dataNascimento ?? 0, 'dataNascimento');
        handleEnumChange('perfil', morador.perfil);
        handleEnumChange('sexo', morador.sexo);
        handleEnumChange('estadoCivil', morador.estadoCivil);
        handleEnumChange('escolaridade', morador.escolaridade);
        handleEnumChange('religiao', morador.religiao);
        setIdade(morador.dataNascimento);
        
      }, [morador]);

      const estudaVelho = morador?.ondeEstuda  ?? '';
      const trabalhoVelho = morador?.trabalho ?? '';
      const doencasVelhas = morador?.doencas ?? '';


      useEffect(() => {
           
         if (novoMorador.perfil==='ENTREVISTADO'){
        
          if(entrevistado){
           
                handleSetNumber(entrevistado.nascimentoData ?? 0, 'dataNascimento');
                handleEnumChange('sexo', entrevistado.sexo ?? null);
                handleEnumChange('estadoCivil', entrevistado.estadoCivil ?? null);
                handleEnumChange('escolaridade', entrevistado.escolaridade ?? '');
                handleEnumChange('religiao', entrevistado.religiao ?? '');
                  setValidator(true);
           }else{
                 setValidator(false);
            Alert.alert("Não foi possíel encontrar entrevistado!")
           }
          
        } else if(novoMorador.perfil==='COABITANTE'){
                  
              handleSetNumber( 0, 'dataNascimento');
              handleEnumChange('sexo', null);
              handleEnumChange('estadoCivil', null);
              handleEnumChange('escolaridade', '');
              handleEnumChange('religiao', '');
              setValidator(false);

        }else{
          setValidator(false);
          return;
        }
        
      }, [novoMorador.perfil]);
      


    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA'  }}>
        <MoradorDetailContainer>

        
             <RenderPicker
               label="Selecione o perfil do morador"
               selectedValue={novoMorador.perfil}
               onValueChange={(value) => handleEnumChange('perfil', value)}
               options={perfilOptions}
              />

              {!validator &&(  
               <Input
                value={idade?.toString() || ''}
                maxLength={3}
                onChangeText={(text) => {
                  const num = parseInt(text.replace(/\D/g, ''), 10);
                  setIdade(isNaN(num) ? undefined : num);
                }}
                keyboardType="numeric"
                placeholder="Digite a idade do morador"
                placeholderTextColor={theme.colors.grayTheme.gray80}
                title="Idade do morador"
              />)}  

             {!validator &&(  
              <RenderPicker
               label="Qual o sexo do morador"
               selectedValue={novoMorador.sexo}
               onValueChange={(value) => handleEnumChange('sexo', value)}
               options={sexoOptions}
              />)}
           {!validator &&(  
              <RenderPicker
               label="Informe o estado civil do morador?"
               selectedValue={novoMorador.estadoCivil}
               onValueChange={(value) => handleEnumChange('estadoCivil', value)}
               options={estadoCivilOptions}
            />)}
           {!validator &&(  
              <RenderPicker
               label="Qual o nível de escolaridade do morador?"
               selectedValue={novoMorador.escolaridade}
               onValueChange={(value) => handleEnumChange('escolaridade', value)}
               options={escolaridadeOptions}
              />)}

               {estudaVelho && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteiormente:  {estudaVelho}
               </Text>
                )}

                <RenderPicker
                  label="O morador estuda?"
                  selectedValue={estuda}
                  onValueChange={(value) => {
                    setEstuda(value ?? ''); 
                    if (value !== 'Sim') {
                      SetOndeEstuda('');
                    }
                  }}
                  options={['Sim', 'Não']}
                 />
                    {estuda.includes('Sim') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                       maxLength={255}
                      value={ondeEstuda}
                      onChangeText={SetOndeEstuda}
                      placeholder="..."
                      margin="15px 10px 30px 5px"
                      title="Onde Estuda?"
                       />
                      </View>
                 )}

                {trabalhoVelho && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteiormente:  {trabalhoVelho}
               </Text>
                )}

               <RenderPicker
                  label="O morador trabalha?"
                  selectedValue={trabalha}
                  onValueChange={(value) => {
                    setTrabalha(value ?? ''); 
                    if (value !== 'Sim') {
                      SetOndeTrabalha('');
                    }
                  }}
                  options={['Sim', 'Não']}
                 />
                    {trabalha.includes('Sim') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                       maxLength={255}
                      value={ondeTrabalha}
                      onChangeText={SetOndeTrabalha}
                      placeholder="..."
                      margin="15px 10px 30px 5px"
                      title="Onde trabalha?"
                       />
                      </View>
                 )}
               {!validator &&(               
               <RenderPicker
                  label="Qual a religião do morador?"
                  selectedValue={novoMorador.religiao}
                  onValueChange={(value) => handleEnumChange('religiao', value)}
                  options={religiaoOptions}
                 />)}
                  
                {doencasVelhas && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteiormente:  {doencasVelhas}
               </Text>
                )}
                <CheckboxSelector
                options={molestiasOptions}
                selectedValues={doencaInformada}
                label="O morador ja apresentou alguma das doenças abaixo?"
                onSave={(selectedValues) => {
                    setDoencaInformada(selectedValues);
                }}
                />

             
          
             <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={disabled} />
              )}
            </View>
      

        </MoradorDetailContainer>
        </ScrollView>
    )
} 