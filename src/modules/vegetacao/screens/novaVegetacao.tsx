import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";
import { useNovaVegetacao } from "../hooks/useInputVegetacao";
import { VegetacaoDetailContainer } from "../styles/Vegetacao.style";

export interface idParam {
  entrevistado: EntrevistadoType;
}
export const NovaVegetacao = ()=>{
   const { params } = useRoute<RouteProp<Record<string, idParam>>>();
   const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const [loading, setLoading] = useState(false); 
   const [outrosUsos, setOutrosUsos] = useState<string>('');     
   const [qual, SetQual] = useState<string>('');
   const {  novaVegetacao,
            handleOnChangeInput,
            handleEnumChange,
            handleArrayFieldChange,
            disabled
          } = useNovaVegetacao(params.entrevistado);


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
           const aveSalva = true//await enviarRegistro(); 
               if (aveSalva){
                 //detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
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
               label="Utiliza a flor da espécia?"
               selectedValue={novaVegetacao.usaFlor}
               onValueChange={(value) => handleEnumChange('usaFlor', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Utiliza a folha da espécia?"
               selectedValue={novaVegetacao.usaFolha}
               onValueChange={(value) => handleEnumChange('usaFolha', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Utiliza a semente da espécia?"
               selectedValue={novaVegetacao.usaSemente}
               onValueChange={(value) => handleEnumChange('usaSemente', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Utiliza o fruto da espécia?"
               selectedValue={novaVegetacao.usaFruto}
               onValueChange={(value) => handleEnumChange('usaFruto', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Utiliza a casca da espécia?"
               selectedValue={novaVegetacao.usaCasca}
               onValueChange={(value) => handleEnumChange('usaCasca', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Utiliza a raiz da espécia?"
               selectedValue={novaVegetacao.usaRaiz}
               onValueChange={(value) => handleEnumChange('usaRaiz', value)}
               options={simNaoOptions}
            />

              <RenderPicker
               label="Utiliza o látex da espécia?"
               selectedValue={novaVegetacao.usoLeiteLatex}
               onValueChange={(value) => handleEnumChange('usoLeiteLatex', value)}
               options={simNaoOptions}
            />

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
               label="Coleta"
               selectedValue={novaVegetacao.coletaLocalPublico}
               onValueChange={(value) => handleEnumChange('coletaLocalPublico', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Coleta"
               selectedValue={novaVegetacao.coletaCultivo}
               onValueChange={(value) => handleEnumChange('coletaCultivo', value)}
               options={simNaoOptions}
            />

            <RenderPicker
               label="Coleta"
               selectedValue={novaVegetacao.coletaCompra}
               onValueChange={(value) => handleEnumChange('coletaCompra', value)}
               options={simNaoOptions}
            />

             <RenderPicker
               label="Coleta"
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
              title="O conhecimento está sendo repassado?"
           />

          <Input 
              value={novaVegetacao.observacoesEspontaneas} 
              onChange={(event)=> handleOnChangeInput(event, 'observacoesEspontaneas')}
              placeholder="..."
              margin="15px 10px 30px 5px"
              title="Deseja acrescentar alguma observação sobre o tema?"
           />
    
      

        </VegetacaoDetailContainer>
        </ScrollView>
    )
}