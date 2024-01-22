import { Picker } from "@react-native-picker/picker";
import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useRef } from "react";
import { Button, ScrollView, TextInput, View } from "react-native";
import { Vizinhos } from "../../../enums/Vizinhos";
import { documentacao } from "../../../enums/documentacao.enum";
import { esporteLazerEnum } from "../../../enums/esporteLazer.enum";
import { limitesTerrenoEnum } from "../../../enums/limitesTerreno.enum";
import { SimNaoTalvez } from "../../../enums/simNaoTalvez.enum";
import { situacaoFundiaria } from "../../../enums/situacaoFundiaria.enum";
import { tipoSoloEnum } from "../../../enums/tipoSolo.enum";
import { transporteEnum } from "../../../enums/transporte.enum";
import Input from "../../../shared/components/input/input";
import { theme } from "../../../shared/themes/theme";
import { useNovoImovel } from "../hooks/useInputImovel";
import { ImovelContainer } from "../styles/Imovel.style";


export interface idParam {
localidadeId: number;
}

export const NovoImovel = ()=>{
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  
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
           disabled} = useNovoImovel();
    
    
    const fundiarioOptions = Object.values(situacaoFundiaria);
    const documentacaoOptions = Object.values(documentacao);
    const limitesOptions = Object.values(limitesTerrenoEnum);
    const transporteOptions = Object.values(transporteEnum);
    const soloOptions = Object.values(tipoSoloEnum);
    const lazerOptions = Object.values(esporteLazerEnum);
    const simNaoOptions =  Object.values(SimNaoTalvez);
    const vizinhoOptions =  Object.values(Vizinhos);
    

    console.log('param', params)
    console.log('localidadeId', params.localidadeId);

    
    const ruaInput = useRef<TextInput>(null);
    const numeroInput = useRef<TextInput>(null);
    const bairroInput = useRef<TextInput>(null);
    const referencialInput = useRef<TextInput>(null);
    const latitudeInput = useRef<TextInput>(null);
    const longitudeInput = useRef<TextInput>(null);
   
  

    const handleEnviar = async () => {
      await inputImovelApi(params.localidadeId);
      
  };



    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
        <ImovelContainer>
           <Input 
              value={novoImovel.rua} 
              onChange={(event)=> handleOnChangeInput(event, 'rua')}
              placeholder="Informe a rua do imóvel"
              margin="0px 0px 16px 0px"
              title="Rua:"
              onSubmitEditing={()=>numeroInput.current?.focus()}
              ref={ruaInput}/>

           <Input 
              value={novoImovel.numero} 
              onChange={(event)=> handleOnChangeInput(event, 'numero')}
              placeholder="Imforme o número do Imóvel"
              margin="0px 0px 16px 0px"
              title="Número:"
              onSubmitEditing={()=>bairroInput.current?.focus()}
              ref={numeroInput}/>

           <Input 
              value={novoImovel.bairro} 
              onChange={(event)=> handleOnChangeInput(event, 'bairro')}
              placeholder="Informe o bairro imóvel"
              margin="0px 0px 16px 0px"
              title="Bairro:"
              onSubmitEditing={()=>referencialInput.current?.focus()}
              ref={bairroInput}
              />
             

            <Input 
              value={novoImovel.referencial} 
              onChange={(event)=> handleOnChangeInput(event, 'referencial')}
              placeholder="Informe uma referência para o imóvel"
              margin="0px 0px 16px 0px"
              title="Referencial:"
              onSubmitEditing={()=>latitudeInput.current?.focus()}
              ref={referencialInput}/>

            <Input 
              value={novoImovel.latitude} 
              onChange={(event)=> handleOnChangeInput(event, 'latitude')}
              placeholder="latitude"
              margin="0px 0px 16px 0px"
              title="Latitude:"
              onSubmitEditing={()=>longitudeInput.current?.focus()}
              ref={latitudeInput}/>

            <Input 
              value={novoImovel.longitude} 
              onChange={(event)=> handleOnChangeInput(event, 'longitude')}
              placeholder="longitude"
              margin="0px 0px 16px 0px"
              title="Longitude:"
              ref={longitudeInput}/>

<Input
    value={(novoImovel.areaImovel ?? '').toString()} 
    onChange={(event) => handleOnChangeInput(event, 'areaImovel')}
    keyboardType='numeric'
    // outros props...
/>




            <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
            <Picker
              selectedValue={novoImovel.vizinhos}
              onValueChange={(value) => handleVizinhosChange(value)}>
                <Picker.Item label="Possui vizinhos?" color="black" value="" />
                        {vizinhoOptions.map(vizinhos => (
                          <Picker.Item key={vizinhos} label={vizinhos} value={vizinhos} />
                        ))}
                </Picker>
            </View>

            <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
            <Picker
              selectedValue={novoImovel.situacaoFundiaria}
              onValueChange={(value) => handleFundiarioChange(value)}>
                  <Picker.Item label="Qual a situação fundiária do imóvel?" color="black" value="" />
                        {fundiarioOptions.map(fundiario => (
                          <Picker.Item key={fundiario} label={fundiario} value={fundiario} />
                        ))}
                       
              </Picker>
              
           </View> 
           
           <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
            <Picker
              selectedValue={novoImovel.documentacaoImovel}
              onValueChange={(value) => handleDocumentacaoChange(value)}>
                  <Picker.Item label="Possui documentação?" color="black" value="" />
                        {documentacaoOptions.map(documentacao => (
                          <Picker.Item key={documentacao} label={documentacao} value={documentacao} />
                        ))}
                       
              </Picker>
              
           </View> 

           <Input 
              value={novoImovel.dataChegada} 
              onChange={(event)=> handleOnChangeData(event, 'dataChegada')}
              placeholder="data da chegada"
              margin="0px 0px 16px 0px"
              title="Desde quando está no imóvel?"
              />

           <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
            <Picker
              selectedValue={novoImovel.pretendeMudar}
              onValueChange={(value) => handleSimNaoChange(value)}>
                  <Picker.Item label="Pretente mudar?" color="black" value="" />
                        {simNaoOptions.map(mudar => (
                          <Picker.Item key={mudar} label={mudar} value={mudar} />
                        ))}
                       
              </Picker>
            </View>
          
          <Input 
              value={novoImovel.motivoVontadeMudanca} 
              onChange={(event)=> handleOnChangeInput(event, 'motivoVontadeMudanca')}
              placeholder="Informe um motivo"
              margin="0px 0px 16px 0px"
              title="Por que pretende mudar?"
              />

         <Input 
              value={novoImovel.relacaoArea} 
              onChange={(event)=> handleOnChangeInput(event, 'relacaoArea')}
              placeholder="Relação do entrevistado com a área do imóvel"
              margin="0px 0px 16px 0px"
              title="Relação com a área"
              />

         <Input 
              value={novoImovel.relacaoVizinhos} 
              onChange={(event)=> handleOnChangeInput(event, 'relacaoVizinhos')}
              placeholder="Relação do entrevistado com a vizinhança"
              margin="0px 0px 16px 0px"
              title="Relação com a vizinhança"
              />

           <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
            <Picker
              selectedValue={novoImovel.limites}
              onValueChange={(value) => handleLimitesChange(value)}>
                  <Picker.Item label="Possui documentação?" color="black" value="" />
                        {limitesOptions.map(limite => (
                          <Picker.Item key={limite} label={limite} value={limite} />
                        ))}
                       
              </Picker>
              
           </View> 

           <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
            <Picker
              selectedValue={novoImovel.iluminacaoPublica}
              onValueChange={(value) => handleIluminacaoChange(value)}>
                  <Picker.Item label="Ilumincao pública?" color="black" value="" />
                        {simNaoOptions.map(iluminacao => (
                          <Picker.Item key={iluminacao} label={iluminacao} value={iluminacao} />
                        ))}
                       
              </Picker>
              
           </View> 

           <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
            <Picker
              selectedValue={novoImovel.transporte}
              onValueChange={(value) => handleTransporteChange(value)}>
                  <Picker.Item label="Possui documentação?" color="black" value="" />
                        {transporteOptions.map(transporte => (
                          <Picker.Item key={transporte} label={transporte} value={transporte} />
                        ))}
                       
              </Picker>
              
           </View> 

           <Input 
              value={novoImovel.programaInfraSaneamento} 
              onChange={(event)=> handleOnChangeInput(event, 'programaInfraSaneamento')}
              placeholder="área do programaInfraSaneamento"
              margin="0px 0px 16px 0px"
              title="programaInfraSaneamento:"
              />

           <Input 
              value={novoImovel.linhasDeBarco} 
              onChange={(event)=> handleOnChangeInput(event, 'linhasDeBarco')}
              placeholder="Se houver, informe as linhas de barco do local"
              margin="0px 0px 16px 0px"
              title="Há linhas de barco no local?"
              />

          <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
            <Picker
              selectedValue={novoImovel.tipoSolo}
              onValueChange={(value) => handleSoloChange(value)}>
                  <Picker.Item label="Qual o tipo de solo no imóvel?" color="black" value="" />
                        {soloOptions.map(solo => (
                          <Picker.Item key={solo} label={solo} value={solo} />
                        ))}
                       
              </Picker>
              
           </View> 

           
          <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
            <Picker
              selectedValue={novoImovel.esporteLazer}
              onValueChange={(value) => handleLazerChange(value)}>
                  <Picker.Item label="Esporte e lazer no local:" color="black" value="" />
                        {lazerOptions.map(lazer => (
                          <Picker.Item key={lazer} label={lazer} value={lazer} />
                        ))}
                       
              </Picker>
              
           </View> 

          
          <View style={{ marginTop:40 }}>
          <Button title="enviar" disabled={disabled} onPress={handleEnviar} />
          </View>
 
    
      

        </ImovelContainer>
        </ScrollView>
    )
}