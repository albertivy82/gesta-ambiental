import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView } from "react-native";
import { EsferaEnum } from "../../../enums/esfera.enum";
import { SimNao } from "../../../enums/simNao.enum";
import { FormErrors } from "../../../shared/components/FormErrors";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { theme } from "../../../shared/themes/theme";
import { EscolaType } from "../../../shared/types/EscolaType";
import { useNovaEscola } from "../hooks/useNovaEscola";
import { EscolaContainer } from "../styles/Escolas.style";




export interface NovaEscolaParams {
localidadeId?: number
escola?: EscolaType;
}


export const detalharEscola = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
    navigate('Escolas', {localidadeId})
}


export const NovaEscola = ()=>{
 const { params } = useRoute<RouteProp<Record<string, NovaEscolaParams>, string>>();
 const localidadeId = params.localidadeId ?? params.escola?.localidade.id;
 const escola = params.escola;
 const navigation = useNavigation();
 const [loading, setLoading] = useState(false); 
 const [showErrors, setShowErrors] = useState(false);
  
  const { novaEscola,
          handleOnChangeInput,
          enviarRegistro,
          handleIniciativa,
          handleMerenda,
          handleEducAmbiental,
          handleTransporte,
          validateEscola,
          disabled,} = useNovaEscola(params.localidadeId!, escola);
    
          useEffect(() => {
            if (escola) {
              handleOnChangeInput(escola.nome, 'nome');
              handleIniciativa(escola.iniciativa);
              handleMerenda(escola.merenda as SimNao);
              handleTransporte(escola.transporte as SimNao);
              handleEducAmbiental(escola.educacaoAmbiental as SimNao);
            }
          }, [escola]);
            
  
    const simNaoOptions =  Object.values(SimNao);
    const Iniciativa =  Object.values(EsferaEnum);
      
  

    const handleEnviar = async () => {
      if (loading) return;
          
        const result = validateEscola(novaEscola);
        if (!result.isValid) {
          setShowErrors(true);
      
          Alert.alert(
            'Campos Obrigatórios',
            [
              'Por favor, corrija os campos abaixo:',
              '',
              ...result.errors.map((e, idx) => `${idx + 1}. ${e.message}`),
            ].join('\n')
          );
          return;
        }
            try {
              setLoading(true);
               const vegetacaoSalva = await enviarRegistro(); 
                   if (vegetacaoSalva){
                     detalharEscola(navigation.navigate, params.localidadeId! );
                   } else {
                     Alert.alert("Erro", "Não foi possível salvar a escola. Tente novamente.");
                     navigation.goBack();
                   }
                  } catch (e) {
                    Alert.alert('Erro', 'Não foi possível realizar a operação.');
                  } finally {
                    setLoading(false); // 👈 desliga
                  }
    };
      
  


    return(
      <ScrollView style={{ flex: 1, backgroundColor: '#E6E8FA' }}>
        <EscolaContainer>

        <Input 
              value={novaEscola.nome} 
              onChange={(event)=> handleOnChangeInput(event, 'nome')}
              placeholder="Nome da Escola:"
              placeholderTextColor={theme.colors.grayTheme.gray80}
              margin="15px 10px 30px 5px"
              title="Nome:"
        />
          
          <RenderPicker
                  label="Pertence a qual esfera?"
                  selectedValue={novaEscola.iniciativa}
                  onValueChange={handleIniciativa}
                  options={Iniciativa}
                />

          <RenderPicker
              label="Possui merenda escolar"
              selectedValue={novaEscola.merenda}
               onValueChange={handleMerenda}
               options={simNaoOptions}
            />

          <RenderPicker
              label="Possui transporte escolar"
              selectedValue={novaEscola.transporte}
               onValueChange={handleTransporte}
               options={simNaoOptions}
            />

          <RenderPicker
              label="Possui educação ambiental"
              selectedValue={novaEscola.educacaoAmbiental}
               onValueChange={handleEducAmbiental}
               options={simNaoOptions}
            />

     

           <FormErrors
              visible={showErrors && disabled}
              errors={validateEscola(novaEscola).errors}
            />
                             
            <Button
            title={loading ? "Enviando..." : "Enviar"}
            onPress={handleEnviar}
            color={"#ff4500"}
            disabled={loading}   // 👈 trava só enquanto envia
            />
 
        </EscolaContainer>
        </ScrollView>
    )
}