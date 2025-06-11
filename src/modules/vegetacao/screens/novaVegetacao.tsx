import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovaVegetacao } from "../hooks/useInputVegetacao";
import { VegetacaoDetailContainer } from "../styles/Vegetacao.style";
import { ActivityIndicator } from "react-native-paper";
import { VegetacaoType } from "../../../shared/types/VegetacaoType";
import Text from "../../../shared/components/text/Text";



export interface NovaVegetacaoParams {
  entrevistado: EntrevistadoType;
  vegetacao?: VegetacaoType;
}

export const detalharVegetacao = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType)=>{
    navigate('VegetacaoLista', {entrevistado})
}

export const NovaVegetacao = ()=>{
   const { params } = useRoute<RouteProp<Record<string, NovaVegetacaoParams>, string>>();
   const entrevistado = params.entrevistado ?? params.vegetacao?.entrevistado;
   const vegetacao = params.vegetacao;
   const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const [loading, setLoading] = useState(false); 
   const [outrosUsos, setOutrosUsos] = useState<string>('');     
   const [qual, SetQual] = useState<string>('');
   const {  novaVegetacao,
            enviarRegistro,
            handleOnChangeInput,
            handleEnumChange,
            handleArrayFieldChange,
            disabled
          } = useNovaVegetacao(entrevistado, vegetacao);

console.log(entrevistado)
          useEffect(() => {
            if (vegetacao) {
              handleOnChangeInput(vegetacao.especie ?? '', 'especie');
              handleEnumChange('usoMedicinal', vegetacao.usoMedicinal);
              handleEnumChange('usoAlimentacao', vegetacao.usoAlimentacao);
              handleEnumChange('usoOrnamental', vegetacao.usoOrnamental);
              handleEnumChange('usoComercial', vegetacao.usoComercial);
              handleEnumChange('usaFlor', vegetacao.usaFlor);
              handleEnumChange('usaFolha', vegetacao.usaFolha);
              handleEnumChange('usaSemente', vegetacao.usaSemente);
              handleEnumChange('usaFruto', vegetacao.usaFruto);
              handleEnumChange('usaCasca', vegetacao.usaCasca);
              handleEnumChange('usaRaiz', vegetacao.usaRaiz);
              handleEnumChange('usoLeiteLatex', vegetacao.usoLeiteLatex);
              handleEnumChange('coletaLocalPublico', vegetacao.coletaLocalPublico);
              handleEnumChange('coletaCultivo', vegetacao.coletaCultivo);
              handleEnumChange('coletaCompra', vegetacao.coletaCompra);
              handleEnumChange('coletaAmbienteEspecifica', vegetacao.coletaAmbienteEspecifica);
              handleOnChangeInput(vegetacao.quemEnsinouUso ?? '', 'quemEnsinouUso');
              handleOnChangeInput(vegetacao.repassaConhecimento ?? '',  'repassaConhecimento');
              handleOnChangeInput(vegetacao.observacoesEspontaneas ?? '',  'observacoesEspontaneas');
                        
            }
          }, [vegetacao]);
          
          const outorsUsos = vegetacao?.outrosUsos ?? '';

  useEffect(() => {
        const consolidaDados = outrosUsos === 'SIM' 
          ? (qual ? [`ocorrencia: ${qual}`] : [])  
          : ['NÃO']; 
      
        handleArrayFieldChange('outrosUsos', consolidaDados);
      
  }, [outrosUsos, qual]);
   
  const simNaoOptions =  Object.values(SimNao);
    
    const handleEnviar = async () => {
         setLoading(true);
       
         try {
           const vegetacaoSalva = await enviarRegistro(); 
           console.log("hendleEnviar - vegetacaoSalva", vegetacaoSalva)
               if (vegetacaoSalva){
                console.log("hendleEnviar - vegetacaoSalva", entrevistado.id)
                 detalharVegetacao(navigation.navigate, entrevistado);
                } else {
                 Alert.alert("Erro", "Não foi possível salvar a vegetacao. Tente novamente.");
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
        <VegetacaoDetailContainer>

        <Input 
              value={novaVegetacao.especie} 
              onChange={(event)=> handleOnChangeInput(event, 'especie')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Informe  a espécie de vegetacao:"
        />

            <RenderPicker
               label="Faz algum uso medicinal da espécie?"
               selectedValue={novaVegetacao.usoMedicinal}
               onValueChange={(value) => handleEnumChange('usoMedicinal', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Utiliza a espécie na alimentação?"
               selectedValue={novaVegetacao.usoAlimentacao}
               onValueChange={(value) => handleEnumChange('usoAlimentacao', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Faz algum uso ornamental da espécie?"
               selectedValue={novaVegetacao.usoOrnamental}
               onValueChange={(value) => handleEnumChange('usoOrnamental', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Comercializa a espécie?"
               selectedValue={novaVegetacao.usoComercial}
               onValueChange={(value) => handleEnumChange('usoComercial', value)}
               options={simNaoOptions}
            />
          
              <RenderPicker
               label="Utiliza a flor da espécie?"
               selectedValue={novaVegetacao.usaFlor}
               onValueChange={(value) => handleEnumChange('usaFlor', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Utiliza a folha da espécie?"
               selectedValue={novaVegetacao.usaFolha}
               onValueChange={(value) => handleEnumChange('usaFolha', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Utiliza a semente da espécie?"
               selectedValue={novaVegetacao.usaSemente}
               onValueChange={(value) => handleEnumChange('usaSemente', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Utiliza o fruto da espécie?"
               selectedValue={novaVegetacao.usaFruto}
               onValueChange={(value) => handleEnumChange('usaFruto', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Utiliza a casca da espécie?"
               selectedValue={novaVegetacao.usaCasca}
               onValueChange={(value) => handleEnumChange('usaCasca', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Utiliza a raiz da espécie?"
               selectedValue={novaVegetacao.usaRaiz}
               onValueChange={(value) => handleEnumChange('usaRaiz', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Utiliza o látex da espécie?"
               selectedValue={novaVegetacao.usoLeiteLatex}
               onValueChange={(value) => handleEnumChange('usoLeiteLatex', value)}
               options={simNaoOptions}
            />
                {outorsUsos && (
                <Text style={{ fontStyle: 'italic', color: 'gray', marginBottom: 5 }}>
                  Informação registrada anteriormente: {outorsUsos}
                </Text>
              )}
               <RenderPicker
                  label="Faz outro uso?"
                  selectedValue={outrosUsos}
                  onValueChange={(value) => {
                    setOutrosUsos(value ?? ''); 
                    if (value !== 'SIM') {
                      SetQual('');
                    }
                  }}
                  options={['SIM', 'NÃO']}
                 />
                    {outrosUsos.includes('SIM') && (
                      <View style={{ marginTop: 10 }}>
                      <Input
                      value={qual}
                      onChangeText={SetQual}
                      placeholder="Separe as informações por vírgula"
                      margin="15px 10px 30px 5px"
                      title="Qual?"
                       />
                      </View>
            )}
 
             <RenderPicker
               label="A coleta é realizada em local público?"
               selectedValue={novaVegetacao.coletaLocalPublico}
               onValueChange={(value) => handleEnumChange('coletaLocalPublico', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="A coleta é fruto de cultivo da espécie?"
               selectedValue={novaVegetacao.coletaCultivo}
               onValueChange={(value) => handleEnumChange('coletaCultivo', value)}
               options={simNaoOptions}
            />

            <RenderPicker
               label="A espécie é obtida por meio de compra?"
               selectedValue={novaVegetacao.coletaCompra}
               onValueChange={(value) => handleEnumChange('coletaCompra', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="A coleta é realizada em ambientes naturais específicos (como restingas, lagos)?"
               selectedValue={novaVegetacao.coletaAmbienteEspecifica}
               onValueChange={(value) => handleEnumChange('coletaAmbienteEspecifica', value)}
               options={simNaoOptions}
            />

          <Input 
              value={novaVegetacao.quemEnsinouUso} 
              onChange={(event)=> handleOnChangeInput(event, 'quemEnsinouUso')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Quem ensinou o uso da espécie?"
           />

          <Input 
              value={novaVegetacao.repassaConhecimento} 
              onChange={(event)=> handleOnChangeInput(event, 'repassaConhecimento')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Você repassa esse conhecimento para outras pessoas? Se sim, para quem?"
           />

          <Input 
              value={novaVegetacao.observacoesEspontaneas} 
              onChange={(event)=> handleOnChangeInput(event, 'observacoesEspontaneas')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="“Deseja registrar alguma observação relevante (como número da fotografia ou outro detalhe)?"
           />


           <View style={{ marginTop: 40 }}>
                         {loading ? (
                           <ActivityIndicator size="large" color="#ff4500" /> 
                         ) : (
                           <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={disabled || loading} />
                         )}
            </View>
    
      

        </VegetacaoDetailContainer>
        </ScrollView>
    )
}