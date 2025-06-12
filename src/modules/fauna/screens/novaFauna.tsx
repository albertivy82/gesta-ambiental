import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Button, View } from "react-native";
import { SimNao } from "../../../enums/simNao.enum";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovaFauna } from "../hooks/useInputFuna";
import { FaunaDetailContainer } from "../styles/Fauna.style";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { ActivityIndicator } from "react-native-paper";
import { FaunaType } from "../../../shared/types/FaunaType";


export interface NovaFaunaParams {
  entrevistado: EntrevistadoType;
  fauna?: FaunaType;
}

export const detalharFauna = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType) => {
  navigate('FaunaLista', { entrevistado });
};

export const NovaFauna = () => {
     const { params } = useRoute<RouteProp<Record<string, NovaFaunaParams>, string>>();
     const entrevistado = params.entrevistado ?? params.fauna?.entrevistado;
     const fauna = params.fauna;
     const navigation = useNavigation<NavigationProp<ParamListBase>>();
     const [loading, setLoading] = useState(false); 
     const {  novaFauna,
              enviarRegistro,
              handleOnChangeInput,
              disabled
            } = useNovaFauna(params.entrevistado, fauna);

            useEffect(() => {
              if (fauna) {
                handleOnChangeInput(fauna.especie ?? '', 'especie');
                handleOnChangeInput(fauna.ondeOcorre ?? '', 'ondeOcorre');
                handleOnChangeInput(fauna.abundanciaAtual ?? '', 'abundanciaAtual');
                handleOnChangeInput(fauna.abundanciaPassada ?? '', 'abundanciaPassada');
                handleOnChangeInput(fauna.tempoQueNaoVe ?? '', 'tempoQueNaoVe');
                handleOnChangeInput(fauna.usoDaEspecie ?? '', 'usoDaEspecie');
                }
            }, [fauna]);
            
      const handleEnviar = async () => {
           setLoading(true);
         
           try {
             const faunaSalva = await enviarRegistro(); 
                 if (faunaSalva){
                   detalharFauna(navigation.navigate, entrevistado);
                 } else {
                   Alert.alert("Erro", "Não foi possível salvar a espécie. Tente novamente.");
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
        <FaunaDetailContainer>
        <Input 
              value={novaFauna.especie} 
              onChange={(event)=> handleOnChangeInput(event, 'especie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie:"
        />

          <Input 
              value={novaFauna.ondeOcorre} 
              onChange={(event)=> handleOnChangeInput(event, 'ondeOcorre')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Onde é o local de cocrrência da espécie?"
          />

            <Input 
              value={novaFauna.abundanciaAtual} 
              onChange={(event)=> handleOnChangeInput(event, 'abundanciaAtual')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="É abundante atualmente?"
           />

            <Input 
              value={novaFauna.abundanciaPassada} 
              onChange={(event)=> handleOnChangeInput(event, 'abundanciaPassada')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Era abundante no passado?"
            />

             <Input 
              value={novaFauna.tempoQueNaoVe} 
              onChange={(event)=> handleOnChangeInput(event, 'tempoQueNaoVe')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Foi vista há quanto tempo pela última vez?"
            />
            
            <Input 
              value={novaFauna.usoDaEspecie} 
              onChange={(event)=> handleOnChangeInput(event, 'usoDaEspecie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Faz algum uso da espécie? Se SIM, diga qual."
            />

                    
             <View style={{ marginTop: 40 }}>
              {loading ? (
                <ActivityIndicator size="large" color="#ff4500" /> 
              ) : (
                <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading || disabled} />
              )}
            </View>
 
    
      

        </FaunaDetailContainer>
        </ScrollView>
    )
}