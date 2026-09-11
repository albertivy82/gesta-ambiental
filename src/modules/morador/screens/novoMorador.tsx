import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { Perfil } from "../../../enums/Perfil";
import { Sexo } from "../../../enums/Sexo";
import { FormErrors } from "../../../shared/components/FormErrors";
import { GlobalContainer } from "../../../shared/components/globalStyles/GlobalContainer";
import CheckboxSelector from "../../../shared/components/input/checkBox";
import Input from "../../../shared/components/input/input";
import Text from "../../../shared/components/text/Text";
import { theme } from "../../../shared/themes/theme";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { imovelBody } from "../../../shared/types/imovelType";
import { MoradorType } from "../../../shared/types/MoradorType";
import BenfeitoriaSection from "../../entrevistadoDetails/ui-component/BenfeitoriaSection";
import EntrevistadoSection from "../../entrevistadoDetails/ui-component/EntrevistadoSection";
import ImovelSection from "../../imovel/ui-component/imovelSeccion";
import { useNovoMorador } from "../hooks/useInputMorador";
import { doencasOptions, estadoCivilOptions } from "../ui-components/opcoesMorador";


export interface NovoMoradorParams {
  entrevistado: EntrevistadoType;
  imovel: imovelBody;
  benfeitoria: BenfeitoriaType;
  morador?: MoradorType;
}


export const NovoMorador = ()=>{
   const { params } = useRoute<RouteProp<Record<string, NovoMoradorParams>, string>>();
   const benfeitoria = params.benfeitoria
   const morador = params.morador;
   const navigation = useNavigation<any>();
   const [loading, setLoading] = useState(false); 
   const [showErrors, setShowErrors] = useState(false);
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
            validateMorador,
            disabled
          } = useNovoMorador(benfeitoria, morador);
 
     
 useEffect(() => {
  let consolidaDados: string[] = [];

  if (estuda === '') {
    // ainda não respondeu nada → deixa vazio
    consolidaDados = [];
  } else if (estuda === 'Não') {
    consolidaDados = ['Não'];
  } else if (estuda === 'Sim') {
    if (ondeEstuda && ondeEstuda.trim().length > 0) {
      consolidaDados = [`Sim: ${ondeEstuda.trim()}`];
    } else {
      // marcou "Sim" mas ainda não informou onde → guardamos "Sim"
      consolidaDados = ['Sim'];
    }
  }

  handleArrayFieldChange('ondeEstuda', consolidaDados);
}, [estuda, ondeEstuda]);


useEffect(() => {
  let consolidaDados: string[] = [];

  if (trabalha === '') {
    consolidaDados = [];
  } else if (trabalha === 'Não') {
    consolidaDados = ['Não'];
  } else if (trabalha === 'Sim') {
    if (ondeTrabalha && ondeTrabalha.trim().length > 0) {
      consolidaDados = [`Sim: ${ondeTrabalha.trim()}`];
    } else {
      consolidaDados = ['Sim'];
    }
  }

  handleArrayFieldChange('trabalho', consolidaDados);
}, [trabalha, ondeTrabalha]);



  useEffect(()=>{
   
    handleArrayFieldChange('doencas', doencaInformada);
  
  },[doencaInformada])

  useEffect(()=>{
    handleSetNumber(idade!,'idade');
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
  const molestiasOptions =  Object.values(doencasOptions);
    
    

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
const handleEnviar = async () => {
      if (loading) return;
                
      const result = validateMorador(novoMorador);
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
           const moradorSalvo = await enviarRegistro(); 
               if (moradorSalvo){
                 navigation.replace("EntrevistadoDetails", {entrevistado: params.entrevistado});
               } else {
                 Alert.alert("Erro", "Não foi possível salvar a morador. Tente novomente.");
                 navigation.goBack();
               }
              } catch (e) {
                Alert.alert('Erro', 'Não foi possível realizar a operação.');
              } finally {
                setLoading(false); // 👈 desliga
              }
       };


       useEffect(() => {
        if (!morador) return;
        handleSetNumber(morador.idade ?? 0, 'idade');
        handleEnumChange('perfil', morador.perfil);
        handleEnumChange('sexo', morador.sexo);
        handleEnumChange('estadoCivil', morador.estadoCivil);
        handleEnumChange('escolaridade', morador.escolaridade);
        handleEnumChange('religiao', morador.religiao);
        setIdade(morador.idade);
        
      }, [morador]);

      const estudaVelho = morador?.ondeEstuda  ?? '';
      const trabalhoVelho = morador?.trabalho ?? '';
      const doencasVelhas = morador?.doencas ?? '';


      

      useEffect(() => {
           
         if (novoMorador.perfil==='ENTREVISTADO'){
        
          
           
                handleSetNumber(params.entrevistado.idade ?? 0, 'idade');
                handleEnumChange('sexo', params.entrevistado.sexo ?? null);
                handleEnumChange('estadoCivil', params.entrevistado.estadoCivil ?? null);
                handleEnumChange('escolaridade', params.entrevistado.escolaridade ?? '');
                handleEnumChange('religiao', params.entrevistado.religiao ?? '');
                  setValidator(true);
          
          
        } else if(novoMorador.perfil==='COABITANTE'){
                  
              handleSetNumber( 0, 'idade');
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
        <GlobalContainer>

             <EntrevistadoSection entrevistado={params.entrevistado} />
             <ImovelSection entrevistado={params.entrevistado} imovel={params.imovel} />
             <BenfeitoriaSection entrevistado={params.entrevistado} imovel={params.imovel} benfeitoria={params.benfeitoria}  />
             <CheckboxSelector
               options={perfilOptions}
               selectedValues={novoMorador.perfil ? [novoMorador.perfil] : []}
               label="Selecione o perfil do morador"
               onSave={(values) =>
                 selecionarOpcaoUnica(
                   values,
                   novoMorador.perfil ?? '',
                   (value) => handleEnumChange('perfil', value)
                 )
               }
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
              <CheckboxSelector
               options={sexoOptions}
               selectedValues={novoMorador.sexo ? [novoMorador.sexo] : []}
               label="Qual o sexo do morador"
               onSave={(values) =>
                 selecionarOpcaoUnica(
                   values,
                   novoMorador.sexo ?? '',
                   (value) => handleEnumChange('sexo', value)
                 )
               }
              />
)}
           {!validator &&(
              <CheckboxSelector
               options={estadoCivilOptions}
               selectedValues={novoMorador.estadoCivil ? [novoMorador.estadoCivil] : []}
               label="Informe o estado civil do morador?"
               onSave={(values) =>
                 selecionarOpcaoUnica(
                   values,
                   novoMorador.estadoCivil ?? '',
                   (value) => handleEnumChange('estadoCivil', value)
                 )
               }
              />
)}
           {!validator &&(
              <CheckboxSelector
               options={escolaridadeOptions}
               selectedValues={novoMorador.escolaridade ? [novoMorador.escolaridade] : []}
               label="Qual o nível de escolaridade do morador?"
               onSave={(values) =>
                 selecionarOpcaoUnica(
                   values,
                   novoMorador.escolaridade ?? '',
                   (value) => handleEnumChange('escolaridade', value)
                 )
               }
              />
)}

               {estudaVelho && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteiormente:  {estudaVelho}
               </Text>
                )}
                <CheckboxSelector
                  options={['Sim', 'Não']}
                  selectedValues={estuda ? [estuda] : []}
                  label="O morador estuda?"
                  onSave={(values) =>
                    selecionarOpcaoUnica(
                      values,
                      estuda,
                      (value) => {
                        setEstuda(value);
                        if (value !== 'Sim') {
                          SetOndeEstuda('');
                        }
                      }
                    )
                  }
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
               <CheckboxSelector
                  options={['Sim', 'Não']}
                  selectedValues={trabalha ? [trabalha] : []}
                  label="O morador trabalha?"
                  onSave={(values) =>
                    selecionarOpcaoUnica(
                      values,
                      trabalha,
                      (value) => {
                        setTrabalha(value);
                        if (value !== 'Sim') {
                          SetOndeTrabalha('');
                        }
                      }
                    )
                  }
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
               <CheckboxSelector
                  options={religiaoOptions}
                  selectedValues={novoMorador.religiao ? [novoMorador.religiao] : []}
                  label="Qual a religião do morador?"
                  onSave={(values) =>
                    selecionarOpcaoUnica(
                      values,
                      novoMorador.religiao ?? '',
                      (value) => handleEnumChange('religiao', value)
                    )
                  }
                 />
)}
                  
                {doencasVelhas && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                 Informação dada anteiormente:  {doencasVelhas}
               </Text>
                )}
                <CheckboxSelector
                options={molestiasOptions}
                selectedValues={doencaInformada}
                exclusiveOptions={['DESCONHECE']}
                label="O morador ja apresentou alguma das doenças abaixo?"
                onSave={(selectedValues) => {
                    setDoencaInformada(selectedValues);
                }}
                />

             
            <FormErrors
                visible={showErrors && disabled}
                errors={validateMorador(novoMorador).errors}
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