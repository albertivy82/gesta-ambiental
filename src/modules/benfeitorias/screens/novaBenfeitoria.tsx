import { Picker } from "@react-native-picker/picker";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, ScrollView, TouchableOpacity, View } from "react-native";
import { Efluentes } from "../../../enums/Efluentes.enum";
import { EnergiaAlimentos } from "../../../enums/EnergiaAlimentos.enum";
import { FonteEnergia } from "../../../enums/FonteEnergia.enum";
import { Funcao } from "../../../enums/Funcao.enum";
import { InformativoPredominante } from "../../../enums/InformativoPredominante.enum";
import { NivelAlagamento } from "../../../enums/NivelAlagamento.enum";
import { Ocorrencia } from "../../../enums/Ocorrencia.enum";
import { origemMaterialConstrucao } from "../../../enums/OrigemMaterialConstrucao.enum";
import { Residuos } from "../../../enums/Residuos.enum";
import { TipoBenfeitoria } from "../../../enums/TipoBenfeitoria.enum";
import { TipoCobertura } from "../../../enums/TipoCobertura.enum";
import { TipoConstrucao } from "../../../enums/TipoConstrucao.enum";
import { TipoEsquadrias } from "../../../enums/TipoEsquadrias.enum";
import { tipoSoloBenfeitoriaEnum } from "../../../enums/tipoSoloBenfeitoria.enum copy";
import Input from "../../../shared/components/input/input";
import Text from "../../../shared/components/text/Text";
import { theme } from "../../../shared/themes/theme";
import { UseNovaBenfeitoria } from "../hooks/useBenfeitoriaInput";
import { BenfeitoriaContainer } from "../styles/benfeitoria.style";

export interface imovelParam {
imovelId: number, 
idLocal : string|undefined,
sincronizado: boolean
}

export const NovaBenfeitoria=()=>{
    const { params } = useRoute<RouteProp<Record<string, imovelParam>>>();
    const {novaBenfeitoria, 
           handleTipoBenfeitoria,
           handleFuncao,
           handleSolo,
           handleAreaBenfeitoria,
           handlePavimentos,
           handleTipoConstrucao,
           handleMaterialConstrução,
           handleCobertura,
           handleEsquadrias,
           handleAlagamentos,
           handleNivelAlagamentos,
           handleEfluentes,
           hendleResiduos,
           handleFonteEnergia,
           handleEnergiaAlimentos,
           handleInformativoPredominante,
           handleOnChangeInput,
           enviarRegistro,
           disabled,
           } = UseNovaBenfeitoria(params.imovelId, params.idLocal, params.sincronizado);
   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

   //console.log("25/10/2024, 18:37", params.idLocal)
 

   const toggleOption = (option:string) =>{
     if (selectedOptions.includes(option)){
        setSelectedOptions(selectedOptions.filter(item=> item !== option));
     } else {
        setSelectedOptions([...selectedOptions, option]);
     }
   }

   useEffect(()=>{
    handleMaterialConstrução(selectedOptions)
   }, [selectedOptions])

    const optionsTipoBenfeitoria = Object.values(TipoBenfeitoria)
    const optionsFuncao = Object.values(Funcao)
    const optionsTipoSolo = Object.values(tipoSoloBenfeitoriaEnum)
    const optionsTipoConstrucao = Object.values(TipoConstrucao)
    const optionsTipoCobertura = Object.values(TipoCobertura)
    const optionsTipoEsquadrias = Object.values(TipoEsquadrias)
    const optionsOcorrencia = Object.values(Ocorrencia)
    const optionsNivelAlagamento = Object.values(NivelAlagamento)
    const optionsEfluentes = Object.values(Efluentes)
    const optionsResiduos = Object.values(Residuos)
    const optionsFonteEnergia = Object.values(FonteEnergia)
    const optionsEnergiaAlimentos = Object.values(EnergiaAlimentos)
    const optionsInformativoPredominante = Object.values(InformativoPredominante)

    const handleEnviar=() =>{
        
        enviarRegistro();

    }
      
    
       
    return( 
    
    <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
            <BenfeitoriaContainer>

            <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
                <Picker selectedValue={novaBenfeitoria.tipoBenfeitoria} onValueChange={(value)=>handleTipoBenfeitoria(value)} >
                    <Picker.Item label="Qual o tipo de benfeitoria?" color="black" value="" />
                        {optionsTipoBenfeitoria.map(tipos=>(<Picker.Item key={tipos} label={tipos} value={tipos}/>))}    
                </Picker>
            </View>
            
            <View style={{ borderBottomWidth: 4, borderBottomColor: theme.colors.whiteTheme.white }}>
                <Picker selectedValue={novaBenfeitoria.funcao} onValueChange={(value)=>handleFuncao(value)}>
                    <Picker.Item label="Qual é a função dela?" color="black" value="" />
                            {optionsFuncao.map(funcao=>(<Picker.Item key={funcao} label={funcao} value={funcao}/>))}
                </Picker>
            </View>

            <View>
                <Picker selectedValue={novaBenfeitoria.tipoSolo} onValueChange={(value)=>handleSolo(value)}>
                    <Picker.Item label="Característica predominante do solo" color="black" value="" />
                            {optionsTipoSolo.map(solo=>(<Picker.Item key={solo} label={solo} value={solo}/>))}
                </Picker>
            </View>
                       
            <Input 
                value={(novaBenfeitoria.areaBenfeitoria ?? '').toString()} 
                onChange={handleAreaBenfeitoria}
                keyboardType='numeric'
                placeholder="dimensões aproximadas..."
                margin="0px 0px 16px 0px"
                title="Qual a dimensão aproximda da benfeitoria?"
            />
            
            <Input 
                value={(novaBenfeitoria.pavimentos ?? '').toString()} 
                onChange={handlePavimentos}
                keyboardType='numeric'
                placeholder="numeros inteiros"
                margin="0px 0px 16px 0px"
                title="Quantidade de pavimentos:"
                />


          <View>
            <Picker selectedValue={novaBenfeitoria.tipoConstrucao} onValueChange={(value)=>handleTipoConstrucao(value)}>
                <Picker.Item label="Qual o tipo de construção?" color="black" value=""/>
                    {optionsTipoConstrucao.map(construcao=>(<Picker.Item key={construcao} label={construcao} value={construcao}/>))}
            </Picker>
          </View>


          
        <View>
            {Object.values(origemMaterialConstrucao).map((option,index) =>(
                    <TouchableOpacity key={index} onPress={()=> toggleOption(option)}
                        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10,}}>

                            <View style={{height: 20,width: 20, borderWidth: 1,
                                        borderColor: 'black', marginRight: 10, 
                                        justifyContent: 'center', alignItems: 'center',}}>
                                    
                                    {selectedOptions.includes(option) &&(
                                        <View style={{height: 10, width: 10, backgroundColor: 'black',}}/>
                                    )}
                            </View>
                            <Text>{option}</Text>
                    </TouchableOpacity>
                )
            )}
        </View>      
       
       
       <View>
        <Picker selectedValue={novaBenfeitoria.tipoCobertura} onValueChange={(value)=>handleCobertura(value)}>
            <Picker.Item label="Qual o tipo de cobertura?" color="black" value=""/>
                {optionsTipoCobertura.map(cobertura=>(<Picker.Item key={cobertura} label={cobertura} value={cobertura}/>))}
        </Picker>
      </View>  

      <View>
      <Picker selectedValue={novaBenfeitoria.tipoEsquadrias} onValueChange={(value)=>handleEsquadrias(value)}>
          <Picker.Item label="Esquadrias" color="black" value=""/>
              {optionsTipoEsquadrias.map(esquadrias=>(<Picker.Item key={esquadrias} label={esquadrias} value={esquadrias}/>))}
      </Picker>
      </View>  
      
      <View>
      <Picker selectedValue={novaBenfeitoria.alagamentos} onValueChange={(value)=>handleAlagamentos(value)}>
          <Picker.Item label="Sofre alagamentos?" color="black" value=""/>
              {optionsOcorrencia.map(alagamentos=>(<Picker.Item key={alagamentos} label={alagamentos} value={alagamentos}/>))}
      </Picker>
      </View>  

      <View>
      <Picker selectedValue={novaBenfeitoria.nivelAlagamentos} onValueChange={(value)=>handleNivelAlagamentos(value)}>
          <Picker.Item label="qual o nível de alagamentos?" color="black" value=""/>
              {optionsNivelAlagamento.map(nivelAlgamentos=>(<Picker.Item key={nivelAlgamentos} label={nivelAlgamentos} value={nivelAlgamentos}/>))}
      </Picker>
      </View>  

      <View>
      <Picker selectedValue={novaBenfeitoria.efluentes} onValueChange={(value)=>handleEfluentes(value)}>
          <Picker.Item label="Há descarte de efluentes?" color="black" value=""/>
              {optionsEfluentes.map(efluntes=>(<Picker.Item key={efluntes} label={efluntes} value={efluntes}/>))}
      </Picker>
      </View>  

      <View>
      <Picker selectedValue={novaBenfeitoria.residuos} onValueChange={(value)=>hendleResiduos(value)}>
          <Picker.Item label="Há descarte de resíduos no ambiente?" color="black" value=""/>
              {optionsResiduos.map(residuos=>(<Picker.Item key={residuos} label={residuos} value={residuos}/>))}
      </Picker>
      </View>  

      <View>
      <Picker selectedValue={novaBenfeitoria.fonteEnergia} onValueChange={(value)=>handleFonteEnergia(value)}>
          <Picker.Item label="Qual a fonte de energia?" color="black" value=""/>
              {optionsFonteEnergia.map(energia=>(<Picker.Item key={energia} label={energia} value={energia}/>))}
      </Picker>
      </View>  

      <View>
      <Picker selectedValue={novaBenfeitoria.energiaAlimentos} onValueChange={(value)=>handleEnergiaAlimentos(value)}>
          <Picker.Item label="Como são cozidos os alimentos?" color="black" value=""/>
              {optionsEnergiaAlimentos.map(energiaAlimentos=>(<Picker.Item key={energiaAlimentos} label={energiaAlimentos} value={energiaAlimentos}/>))}
      </Picker>
      </View>  
          
      <View>
      <Picker selectedValue={novaBenfeitoria.informativoPredominante} onValueChange={(value)=>handleInformativoPredominante(value)}>
          <Picker.Item label="Qual o informativo predominante?" color="black" value=""/>
              {optionsInformativoPredominante.map(informativos=>(<Picker.Item key={informativos} label={informativos} value={informativos}/>))}
      </Picker>
      </View>  

      <Input 
      value={novaBenfeitoria.importanciaDeProtegerFauna} 
      onChange={(event)=> handleOnChangeInput(event, 'importanciaDeProtegerFauna')}
      placeholder="..."
      margin="0px 0px 16px 0px"
      title="Em sua opnião, qual é a importência de proteger a fauna?"
     
      />
      
      <Input 
      value={novaBenfeitoria.importanciaDeProtegerAmbiente} 
      onChange={(event)=> handleOnChangeInput(event, 'importanciaDeProtegerAmbiente')}
      placeholder="..."
      margin="0px 0px 16px 0px"
      title="Em sua opnião, qual é a importência de protegeer o meio ambiente?"
     
      />

      <Input 
      value={novaBenfeitoria.qualEspacoPrecisaSerPreservado} 
      onChange={(event)=> handleOnChangeInput(event, 'qualEspacoPrecisaSerPreservado')}
      placeholder="..."
      margin="0px 0px 16px 0px"
      title="Qual espaço presisa ser preservado?"
      
      />

      <Input 
      value={novaBenfeitoria.problemasRelacionadosAoAmbiente} 
      onChange={(event)=> handleOnChangeInput(event, 'problemasRelacionadosAoAmbiente')}
      placeholder="..."
      margin="0px 0px 16px 0px"
      title="Quais os problemas abeintais observados??"
      
      />

          
          <View style={{ marginTop:40 }}>
          <Button title="enviar"  onPress={handleEnviar} />
          </View>
    
        </BenfeitoriaContainer>
    </ScrollView>
    )
}