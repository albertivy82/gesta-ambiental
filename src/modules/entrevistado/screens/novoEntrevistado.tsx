import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useRef } from "react";
import { Alert, Button, ScrollView, TextInput, View } from "react-native";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { useNovoEntrevistado } from "../hooks/useInputEntrevistado";
import { EntrevistadoContainer } from "../styles/entrevistado.style";


export interface localidadeParam {
   localidadeId: number,
  }

export const iniciarImovel = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoIdLocal: string, localidadeId:number)=>{
      navigate('NovoImovel', {entrevistadoIdLocal, localidadeId})
}

export const NovoEntrevistado = ()=>{
  const { params } = useRoute<RouteProp<Record<string, localidadeParam>>>();
  const navigation = useNavigation();
  
   
  
  const { novoEntrevistado,
          handleOnChangeInput,
          handlePropostaUcChange,
          objetoFila,
          disabled} = useNovoEntrevistado();
    
    
   
    const nomeInput = useRef<TextInput>(null);
    const apelidoInput = useRef<TextInput>(null);
    const naturalidadeInput = useRef<TextInput>(null);
    const simNaoOptions = Object.values(SimNaoTalvez);
  
      
    const handleEnviar = async () => {
       
      try {
        const entrevistadoIdLocal = objetoFila(); 
            
            if (entrevistadoIdLocal) {
              iniciarImovel(navigation.navigate, entrevistadoIdLocal, params.localidadeId);
            } else {
              Alert.alert("Erro ao salvar", "Não foi possível encontrar o entrevistado pendente.");
            }
      } catch (error) {
            Alert.alert("Erro ao enviar", "Tente novamente mais tarde.");
            console.error("Erro ao navegar para NovoImovel:", error);
      } 
    };
    

    

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <EntrevistadoContainer>
           <Input 
              value={novoEntrevistado.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              placeholder="Nome do entrevistado"
              margin="15px 10px 30px 5px"
              title="Nome:"
              onSubmitEditing={()=>apelidoInput.current?.focus()}
              ref={nomeInput}/>

           <Input 
              value={novoEntrevistado.apelido} 
              onChange={(event)=> handleOnChangeInput(event, 'apelido')}
              placeholder="Como o morador é mais conhecido na região"
              margin="15px 10px 30px 5px"
              title="Apelido:"
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={apelidoInput}/>

           <Input 
              value={novoEntrevistado.naturalidade} 
              onChange={(event)=> handleOnChangeInput(event, 'naturalidade')}
              placeholder="Onde nasceu?"
              margin="15px 10px 30px 5px"
              title="Naturalidade:"
              ref={naturalidadeInput}
              />
             

             <RenderPicker
              label="Foi informado sobre a proposta do UC?"
              selectedValue={novoEntrevistado.conheceUcProposta}
               onValueChange={handlePropostaUcChange}
               options={simNaoOptions}
            />

             <Input 
              value={novoEntrevistado.propostaMelhorarArea} 
              onChange={(event)=> handleOnChangeInput(event, 'propostaMelhorarArea')}
              placeholder="Onde nasTem alguma proposta para melhoria da área?"
              margin="15px 10px 30px 5px"
              title="Sugestões:"
            />
    
         
     <View style={{ marginTop: 40 }}>
     
        <Button title="Enviar" onPress={handleEnviar} color='#ff4500' disabled={disabled} />
      
    </View>
 
    
      

        </EntrevistadoContainer>
        </ScrollView>
    )
}