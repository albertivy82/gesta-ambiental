import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View, Button } from "react-native";
import Input from "../../../shared/components/input/input";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovoReptil } from "../hooks/useInputRepteis";
import { ReptilDetailContainer } from "../styles/Reptil.style";
import { ActivityIndicator } from "react-native-paper";
import { RepteisType } from "../../../shared/types/RepteisType";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import Text from "../../../shared/components/text/Text";


export interface NovoReptilParams {
  entrevistado: EntrevistadoType;
  reptil?: RepteisType;
}

export const detalharReptil = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType) => {
  navigate('RepteisLista', { entrevistado });
};

export const NovoReptil = () => {
  const { params } = useRoute<RouteProp<Record<string, NovoReptilParams>, string>>();
  const entrevistado = params.entrevistado ?? params.reptil?.entrevistado;
  const reptil = params.reptil;
     const navigation = useNavigation<NavigationProp<ParamListBase>>();
     const [loading, setLoading] = useState(false); 
     const {  novoReptil,
              enviarRegistro,
              handleEnumChange,
              handleOnChangeInput,
              disabled
            } = useNovoReptil(params.entrevistado, reptil);
    const [desova, setDesova] = useState<string>('');
    const [localDesova, setLocalDesova] = useState<string>('');
    const [periodoDesova, setPeriodoDesova] = useState<string>('');
            
     
   
    useEffect(() => {
      handleEnumChange('desova', desova);
    
      setLocalDesova('');
      setPeriodoDesova('');
    }, [desova]);


    useEffect(() => {
    
      handleOnChangeInput("localDesova", localDesova)
     
    }, [localDesova]);

    useEffect(() => {
      handleOnChangeInput("periodoDesova", periodoDesova);
    }, [periodoDesova]);
    


    
            
            useEffect(() => {
              if (reptil) {
                handleOnChangeInput(reptil.especie ?? '', 'especie');
                handleOnChangeInput(reptil.local ?? '', 'local');
                handleOnChangeInput(reptil.usoDaEspecie ?? '', 'usoDaEspecie');
                handleOnChangeInput(reptil.ameacaParaEspecie ?? '', 'ameacaParaEspecie');
                handleOnChangeInput(reptil.problemasGerados ?? '', 'problemasGerados');
                handleOnChangeInput(reptil.descricaoEspontanea ?? '', 'descricaoEspontanea');
              }
            }, [reptil]);
             
            const dadosDesova = reptil
            ? [
                reptil.desova ?? '',
                reptil.localDesova ?? '',
                reptil.periodoDesova ?? '',
              ]
                .filter(Boolean)
                .join(' - ')
            : '';
          
            
            
            
       
      const handleEnviar = async () => {
           setLoading(true);
         
           try {
             const reptilSalvo = await enviarRegistro(); 
                 if (reptilSalvo){
                  detalharReptil(navigation.navigate, entrevistado);
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
  
  
    
    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <ReptilDetailContainer>


        <Input 
              value={novoReptil.especie} 
              onChange={(event)=> handleOnChangeInput(event, 'especie')}
              placeholder="tartarugas, jabutis, jacarés, cobras etc."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de reptil:"
        />

        <Input 
              value={novoReptil.local} 
              onChange={(event)=> handleOnChangeInput(event, 'local')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe onde se encontra a espécie:"
         />

            {reptil && dadosDesova && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                Informações anteriores sobre desova: {dadosDesova}
              </Text>
              )}

            <RenderPicker
              label="Há desova dessa espécie na região?"
              selectedValue={desova}
              onValueChange={(value) => setDesova(value ?? '')}
              options={['SIM', 'NÃO']}
            />

          {desova === 'SIM' && (
            <>
              <View style={{ marginTop: 10 }}>
                <Input
                  value={localDesova}
                  onChangeText={setLocalDesova}
                  placeholder="Descreva o local"
                  margin="15px 10px 30px 5px"
                  title="Qual é o local de desova?"
                />
              </View>

              <View style={{ marginTop: 10 }}>
                <Input
                  value={periodoDesova}
                  onChangeText={setPeriodoDesova}
                  placeholder="Ex: Janeiro a Março"
                  margin="15px 10px 30px 5px"
                  title="Qual é o período de desova?"
                />
              </View>
            </>
          )}


         <Input 
              value={novoReptil.usoDaEspecie} 
              onChange={(event)=> handleOnChangeInput(event, 'usoDaEspecie')}
              placeholder="Comércio, consumo etc"
              margin="15px 10px 30px 5px"
              title="Faz algum uso da espécie? Qual?"

         />

         <Input 
              value={novoReptil.ameacaParaEspecie} 
              onChange={(event)=> handleOnChangeInput(event, 'ameacaParaEspecie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Existe alguma práica local que ameace a espécie"
         />

         <Input 
              value={novoReptil.problemasGerados} 
              onChange={(event)=> handleOnChangeInput(event, 'problemasGerados')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Existe algum problema gerado por sua presença? Qual(is)?"
         />

         <Input 
              value={novoReptil.descricaoEspontanea} 
              onChange={(event)=> handleOnChangeInput(event, 'descricaoEspontanea')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Deseja acrescentar alguma observação sobre a espécie?"
         />

           <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading || disabled} />
              )}
            </View>

        </ReptilDetailContainer>
        </ScrollView>
    )
}