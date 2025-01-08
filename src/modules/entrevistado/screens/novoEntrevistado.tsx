import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useRef } from "react";
import { Alert, Button, ScrollView, TextInput, View } from "react-native";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { ImovelComEntrevistado } from "../../../shared/types/imovelType";
import { useNovoEntrevistado } from "../hooks/useInputEntrevistado";
import { EntrevistadoContainer } from "../styles/entrevistado.style";
import DateSelector from "../../../shared/components/input/DateSelector";


export interface localidadeParam {
   item: ImovelComEntrevistado,
   localidadeId: number,
  }

export const iniciarImovel = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoIdLocal: string|undefined, localidade:number)=>{
    
      navigate('NovoImovel', {entrevistadoIdLocal, localidade})
}

export const Imovel = (navigate: NavigationProp<ParamListBase>['navigate'], item:localidadeParam)=>{
 
  navigate('Imovel', {item})
}

export const NovoEntrevistado = ()=>{
  const { params } = useRoute<RouteProp<Record<string, localidadeParam>>>();
  const navigation = useNavigation();
  
  // console.log(params.item.localidade, params.localidadeId)
  
  const { novoEntrevistado,
          handleOnChangeInput,
          handlePropostaUcChange,
          handleOnChangeData,
          enviarEntrevistado,
          objetoFila,
          disabled} = useNovoEntrevistado();
    
    
   
    const nomeInput = useRef<TextInput>(null);
    const apelidoInput = useRef<TextInput>(null);
    const naturalidadeInput = useRef<TextInput>(null);
    const simNaoOptions = Object.values(SimNaoTalvez);
    const motivoMudancaInput = useRef<TextInput>(null);
    const relacaoAreaInput = useRef<TextInput>(null);
    const relacaoVizinhoInput = useRef<TextInput>(null);
  
      
    const handleEnviar = async () => {
       
      try {

        if(params.localidadeId){
         
           const entrevistadoIdLocal = objetoFila(); 
             if (entrevistadoIdLocal) {
                iniciarImovel(navigation.navigate, entrevistadoIdLocal, params.localidadeId);
             } else {
               Alert.alert("Erro ao salvar", "Não foi possível encontrar o entrevistado pendente.");
             }
        }else{
              if(params.item.sincronizado){
                await enviarEntrevistado(novoEntrevistado, params.item);
                Imovel(navigation.navigate, params);
              }else{
                  const entrevistadoIdLocal = objetoFila(); 
              
                  if (entrevistadoIdLocal) {
                    iniciarImovel(navigation.navigate, params.item.idLocal, params.item.localidade.id);
                  } else {
                    Alert.alert("Erro ao salvar", "Não foi possível encontrar o entrevistado pendente.");
                  }
              }
            }
      } catch (error) {
            Alert.alert("Erro ao enviar (novoEntrevistado: handleEnviar)", "Tente novamente mais tarde.");
            console.error("Erro ao navegar para NovoImovel novoEntrevistado: handleEnviar:", error);
      } 
    };
    

    

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA'}}>
        <EntrevistadoContainer>
           
           <Input 
              value={novoEntrevistado.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              placeholder="Nome do entrevistado"
              margin="15px 10px 30px 5px"
              title="Nome:"
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={nomeInput}/>

            <Input 
              value={novoEntrevistado.naturalidade} 
              onChange={(event)=> handleOnChangeInput(event, 'naturalidade')}
              placeholder="Onde nasceu?"
              margin="15px 10px 30px 5px"
              title="Naturalidade:"
              ref={naturalidadeInput}
              />

               <DateSelector
                label="Data de nascimento"
                onDateChange={(selectedDate) => handleOnChangeData(selectedDate, 'dataNascimento')}
              />


              <Input 
              value={novoEntrevistado.sexo} 
              onChange={(event)=> handleOnChangeInput(event, 'sexo')}
              placeholder="Sexo"
              margin="15px 10px 30px 5px"
              title="Sexo:"
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={apelidoInput}/>

              
              <Input 
              value={novoEntrevistado.escolaridade} 
              onChange={(event)=> handleOnChangeInput(event, 'apelido')}
              placeholder="Como o morador é mais conhecido na região"
              margin="15px 10px 30px 5px"
              title="Apelido:"
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={apelidoInput}/>

              <Input 
              value={novoEntrevistado.estadoCivil} 
              onChange={(event)=> handleOnChangeInput(event, 'apelido')}
              placeholder="Como o morador é mais conhecido na região"
              margin="15px 10px 30px 5px"
              title="Apelido:"
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={apelidoInput}/>

              <Input 
              value={novoEntrevistado.religiao} 
              onChange={(event)=> handleOnChangeInput(event, 'apelido')}
              placeholder="Como o morador é mais conhecido na região"
              margin="15px 10px 30px 5px"
              title="Apelido:"
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={apelidoInput}/>



           <Input 
              value={novoEntrevistado.apelido} 
              onChange={(event)=> handleOnChangeInput(event, 'apelido')}
              placeholder="Como o morador é mais conhecido na região"
              margin="15px 10px 30px 5px"
              title="Apelido:"
              onSubmitEditing={()=>naturalidadeInput.current?.focus()}
              ref={apelidoInput}/>

             



         

              <DateSelector
                label="Data de Chegada no Local"
                onDateChange={(selectedDate) => handleOnChangeData(selectedDate, 'dataChegada')}
              />

              <RenderPicker
                  label="Pretente mudar?"
                  selectedValue={novoImovel.pretendeMudar}
                  onValueChange={handleSimNaoChange}
                  options={simNaoOptions}
                />
          
              <Input 
                  value={novoImovel.motivoVontadeMudanca} 
                  onChange={(event)=> handleOnChangeInput(event, 'motivoVontadeMudanca')}
                  placeholder="Informe um motivo"
                  margin="15px 10px 30px 5px"
                  title="Por que pretende mudar?"
                  onSubmitEditing={()=>relacaoAreaInput.current?.focus()}
                  ref={motivoMudancaInput}
                  />

              <Input 
                    value={novoImovel.relacaoArea} 
                    onChange={(event)=> handleOnChangeInput(event, 'relacaoArea')}
                    placeholder="Relação do entrevistado com a área do imóvel"
                    margin="15px 10px 30px 5px"
                    title="Relação com a área"
                    onSubmitEditing={()=>relacaoVizinhoInput.current?.focus()}
                    ref={relacaoAreaInput}
                    />

            <Input 
                  value={novoImovel.relacaoVizinhos} 
                  onChange={(event)=> handleOnChangeInput(event, 'relacaoVizinhos')}
                  placeholder="Relação do entrevistado com a vizinhança"
                  margin="15px 10px 30px 5px"
                  title="Relação com a vizinhança"
                  ref={relacaoVizinhoInput}
                  />

              <Input 
                  value={novoImovel.sabeOQueeUC} 
                  onChange={(event)=> handleOnChangeInput(event, 'relacaoVizinhos')}
                  placeholder="Relação do entrevistado com a vizinhança"
                  margin="15px 10px 30px 5px"
                  title="Relação com a vizinhança"
                  ref={relacaoVizinhoInput}
                  />

                 <Input 
                  value={novoImovel.relacaoVizinhos} 
                  onChange={(event)=> handleOnChangeInput(event, 'relacaoVizinhos')}
                  placeholder="Relação do entrevistado com a vizinhança"
                  margin="15px 10px 30px 5px"
                  title="Relação com a vizinhança"
                  ref={relacaoVizinhoInput}
                
                  <Input 
                  value={novoImovel.conheceaareapara uc?} 
                  onChange={(event)=> handleOnChangeInput(event, 'relacaoVizinhos')}
                  placeholder="Relação do entrevistado com a vizinhança"
                  margin="15px 10px 30px 5px"
                  title="Relação com a vizinhança"
                  ref={relacaoVizinhoInput}

                  <Input 
                  value={novoImovel.utiliza a área?} 
                  onChange={(event)=> handleOnChangeInput(event, 'relacaoVizinhos')}
                  placeholder="Relação do entrevistado com a vizinhança"
                  margin="15px 10px 30px 5px"
                  title="Relação com a vizinhança"
                  ref={relacaoVizinhoInput}



             <RenderPicker
              label="Foi informado sobre a proposta do UC?"
              selectedValue={novoEntrevistado.conheceUcProposta}
               onValueChange={handlePropostaUcChange}
               options={simNaoOptions}
            />

              <Input 
                  value={novoImovel.relacaoVizinhos} 
                  onChange={(event)=> handleOnChangeInput(event, 'relacaoVizinhos')}
                  placeholder="Relação do entrevistado com a vizinhança"
                  margin="15px 10px 30px 5px"
                  title="Relação com a vizinhança"
                  ref={relacaoVizinhoInput}

             <Input 
              value={novoEntrevistado.propostaMelhorarArea} 
              onChange={(event)=> handleOnChangeInput(event, 'propostaMelhorarArea')}
              placeholder="Tem alguma proposta para melhoria da área?"
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