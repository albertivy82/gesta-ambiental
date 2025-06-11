import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Input from "../../../shared/components/input/input";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { MamiferosType } from "../../../shared/types/MamiferosType";
import { useNovoMamifero } from "../hooks/useInputMamifero";
import { MamiferoDetailContainer } from "../styles/Mamifero.style";


export interface NovoMamiferoParams {
  entrevistado: EntrevistadoType;
  mamifero?: MamiferosType;
}

export const detalharMamifero = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType) => {
  navigate('MamiferoLista', { entrevistado });
};

export const NovoMamifero = () => {
     const { params } = useRoute<RouteProp<Record<string, NovoMamiferoParams>, string>>();
     const entrevistado = params.entrevistado ?? params.mamifero?.entrevistado;
     const mamifero = params.mamifero;
     const navigation = useNavigation<NavigationProp<ParamListBase>>();
     const [loading, setLoading] = useState(false); 
     const [outrosUsos, setOutrosUsos] = useState<string>('');     
     const [qual, SetQual] = useState<string>('');
     const {  novoMamifero,
              enviarRegistro,
              handleOnChangeInput,
              handleEnumChange,
              handleArrayFieldChange,
              disabled
            } = useNovoMamifero(params.entrevistado, mamifero);

            useEffect(() => {
              if (mamifero) {
                handleOnChangeInput(mamifero.especie ?? '', 'especie');
                handleOnChangeInput(mamifero.local ?? '', 'problemasRelacionados');
                handleOnChangeInput(mamifero.usoDaEspecie ?? '', 'usoDaEspecie');
                handleOnChangeInput(mamifero.problemasGerados ?? '', 'problemasGerados');
                handleOnChangeInput(mamifero.alimentacao ?? '', 'alimentacao');
                handleOnChangeInput(mamifero.desricaoEspontanea ?? '', 'desricaoEspontanea');
              }
            }, [mamifero]);
            
   
    const handleEnviar = async () => {
      setLoading(true);
    
      try {
        const mamiferoSalvo = await enviarRegistro(); 
            if (mamiferoSalvo){
              detalharMamifero(navigation.navigate, entrevistado);
            } else {
              Alert.alert("Erro", "Não foi possível salvar a mamifero. Tente novamente.");
              navigation.goBack();
            }
      } catch (error) {
        console.error("Erro no envio:", error);
        Alert.alert("Erro ao enviar", "Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    console.log(disabled, loading)

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <MamiferoDetailContainer>
          
            <Input 
              value={novoMamifero.especie} 
              onChange={(event)=> handleOnChangeInput(event, 'especie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de mamífero:"
             />

            <Input 
              value={novoMamifero.local} 
              onChange={(event)=> handleOnChangeInput(event, 'local')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Onde a espécie é encontrada?"
              />

              <Input 
              value={novoMamifero.usoDaEspecie} 
              onChange={(event)=> handleOnChangeInput(event, 'usoDaEspecie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Faz algum uso da espécie?"
                />

              <Input 
              value={novoMamifero.problemasGerados} 
              onChange={(event)=> handleOnChangeInput(event, 'problemasGerados')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="A espécie causa algum problema no local?"
             />

              <Input 
              value={novoMamifero.alimentacao} 
              onChange={(event)=> handleOnChangeInput(event, 'alimentacao')}
              placeholder="frutas, insetos, néctar plantas, sangue de outros animais etc"
              margin="15px 10px 30px 5px"
              title="Do que a espécie se alimenta?"
             />

          
             <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading || disabled} />
              )}
            </View>
 
    
      

        </MamiferoDetailContainer>
        </ScrollView>
    )
}