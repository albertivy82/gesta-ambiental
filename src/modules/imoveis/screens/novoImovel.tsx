import { RouteProp, useRoute } from "@react-navigation/native";
import { useRef, useState } from "react";
import { Alert, Button, ScrollView, TextInput, View } from "react-native";
import { Vizinhos } from "../../../enums/Vizinhos";
import { documentacao } from "../../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../../enums/limitesTerreno.enum";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { situacaoFundiaria } from "../../../enums/situacaoFundiaria.enum";
import { tipoSoloEnum } from "../../../enums/tipoSolo.enum";
import { transporteEnum } from "../../../enums/transporte.enum";
import DateSelector from "../../../shared/components/input/DateSelector";
import LocationInput from "../../../shared/components/input/LocationInput";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { useNovoImovel } from "../hooks/useInputImovel";
import { ImovelContainer } from "../styles/Imovel.style";
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from "react-native-paper";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";


export interface idParam {
Entrevistado: EntrevistadoType;
localidadeId: number;
}

export const NovoImovel = ()=>{
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); 
   
  console.log(params)
  const { novoImovel,
           handleOnChangeInput,
           inputImovelApi,
           handleDocumentacaoChange,
           handleTransporteChange,
           handleLazerChange,
           handleSoloChange,
           handleSimNaoChange,
           handleLimitesChange,
           handleFundiarioChange,
           handleVizinhosChange,
           handleOnChangeData,
           handleIluminacaoChange,
           handleOnChangeAreaImovel,
           disabled} = useNovoImovel(params.localidadeId);
    
    
    const fundiarioOptions = Object.values(situacaoFundiaria);
    const documentacaoOptions = Object.values(documentacao);
    const limitesOptions = Object.values(limitesTerrenoEnum);
    const transporteOptions = Object.values(transporteEnum);
    const soloOptions = Object.values(tipoSoloEnum);
    const lazerOptions = Object.values(esporteLazerEnum);
    const simNaoOptions =  Object.values(SimNaoTalvez);
    const vizinhoOptions =  Object.values(Vizinhos);
    const ruaInput = useRef<TextInput>(null);
    const numeroInput = useRef<TextInput>(null);
    const bairroInput = useRef<TextInput>(null);
    const referencialInput = useRef<TextInput>(null);
    const areaImovelInput = useRef<TextInput>(null);
    const motivoMudancaInput = useRef<TextInput>(null);
    const relacaoAreaInput = useRef<TextInput>(null);
    const relacaoVizinhoInput = useRef<TextInput>(null);
    const linhaBarcoInput = useRef<TextInput>(null);
    const inraestruturaInput = useRef<TextInput>(null);
    
    
    
    
    const handleEnviar = async () => {
      setLoading(true); 
  
      try {
        await inputImovelApi(); 
        navigation.goBack(); 
      } catch (error) {
        console.error('Erro no envio:', error);
        Alert.alert("Erro ao enviar", "Tente novamente mais tarde.");
      } finally {
        setLoading(false); 
      }
    };

    console.log(disabled, loading)

    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <ImovelContainer>
           <Input 
              value={novoImovel.rua} 
              onChange={(event)=> handleOnChangeInput(event, 'rua')}
              placeholder="Informe a rua do imóvel"
              margin="15px 10px 30px 5px"
              title="Rua:"
              onSubmitEditing={()=>numeroInput.current?.focus()}
              ref={ruaInput}/>

           <Input 
              value={novoImovel.numero} 
              onChange={(event)=> handleOnChangeInput(event, 'numero')}
              placeholder="Imforme o número do Imóvel"
              margin="15px 10px 30px 5px"
              title="Número:"
              onSubmitEditing={()=>bairroInput.current?.focus()}
              ref={numeroInput}/>

           <Input 
              value={novoImovel.bairro} 
              onChange={(event)=> handleOnChangeInput(event, 'bairro')}
              placeholder="Informe o bairro imóvel"
              margin="15px 10px 30px 5px"
              title="Bairro:"
              onSubmitEditing={()=>referencialInput.current?.focus()}
              ref={bairroInput}
              />
             

            <Input 
              value={novoImovel.referencial} 
              onChange={(event)=> handleOnChangeInput(event, 'referencial')}
              placeholder="Informe uma referência para o imóvel"
              margin="15px 10px 30px 5px"
              title="Referencial:"
              onSubmitEditing={()=>areaImovelInput.current?.focus()}
              ref={referencialInput}/>

    

              <LocationInput
                onLocationChange={(lat, lon) => {
                  handleOnChangeInput(lat, 'latitude');
                  handleOnChangeInput(lon, 'longitude');
                }}
              />



            <Input
              value={novoImovel.areaImovel?.toFixed(2) || ''}
              onChange={handleOnChangeAreaImovel}
              keyboardType='numeric'
              placeholder="Área em m²"
              margin="15px 10px 30px 5px"
              title="Área do Imóvel (m²)"
              ref={areaImovelInput}
           />


            <RenderPicker
              label="Possui vizinhos?"
              selectedValue={novoImovel.vizinhos}
               onValueChange={handleVizinhosChange}
               options={vizinhoOptions}
            />

             <RenderPicker
              label="Situação Fundiária"
              selectedValue={novoImovel.situacaoFundiaria}
               onValueChange={handleFundiarioChange}
               options={fundiarioOptions}
            />


             <RenderPicker
              label="Possui documentação?"
              selectedValue={novoImovel.documentacaoImovel}
               onValueChange={handleDocumentacaoChange}
               options={documentacaoOptions}
             />


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

          <RenderPicker
              label="Tipo de limites do imóvel"
              selectedValue={novoImovel.limites}
               onValueChange={handleLimitesChange}
               options={limitesOptions}
            />
              
           <RenderPicker
              label="Ilumincao pública?"
              selectedValue={novoImovel.iluminacaoPublica}
               onValueChange={handleIluminacaoChange}
               options={simNaoOptions}
            />

          <RenderPicker
              label="Qual o tipo de transporte utilizado?"
              selectedValue={novoImovel.transporte}
               onValueChange={handleTransporteChange}
               options={transporteOptions}
            />

           <Input 
              value={novoImovel.programaInfraSaneamento} 
              onChange={(event)=> handleOnChangeInput(event, 'programaInfraSaneamento')}
              placeholder="área do programaInfraSaneamento"
              margin="15px 10px 30px 5px"
              title="programa InfraSaneamento:"
              onSubmitEditing={()=>linhaBarcoInput.current?.focus()}
              ref={inraestruturaInput}
              />

           <Input 
              value={novoImovel.linhasDeBarco} 
              onChange={(event)=> handleOnChangeInput(event, 'linhasDeBarco')}
              placeholder="Se houver, informe as linhas de barco do local"
              margin="15px 10px 30px 5px"
              title="Há linhas de barco no local?"
              ref={linhaBarcoInput}
              />

         <RenderPicker
              label="Qual o tipo de solo no imóvel?"
              selectedValue={novoImovel.tipoSolo}
               onValueChange={handleSoloChange}
               options={soloOptions}
            />
         
           <RenderPicker
              label="Esporte e lazer no local:"
              selectedValue={novoImovel.esporteLazer}
               onValueChange={handleLazerChange}
               options={lazerOptions}
            />

          
<View style={{ marginTop: 40 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff4500" /> // Exibe o spinner enquanto está carregando
      ) : (
        <Button title="Enviar" onPress={handleEnviar} color='#ff4500' disabled={disabled || loading} />
      )}
    </View>
 
    
      

        </ImovelContainer>
        </ScrollView>
    )
}