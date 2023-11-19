import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { BenfeitoriaType } from '../../shared/types/BenfeitoriaType';
import { renderField } from '../renderFiel';
import { BenfeitoriaDetailContainer } from '../styles/BenfeitoriaDetails.style';
import { theme } from '../../shared/themes/theme';
import { Icon } from '../../shared/components/icon/Icon';
import Text from '../../shared/components/text/Text';
import { textTypes } from '../../shared/components/text/textTypes';




export interface BenfeitoriaParam {
 benfeitoria: BenfeitoriaType;
}

//BLOCO IMOVEL
export const BenfeitoriasDoImovel = (navigate: NavigationProp<ParamListBase>['navigate'], imovelId: number)=>{
  console.log(imovelId, 'imovelId')
  navigate('Benfeitorias', {imovelId})
}


const BenfeitoriaDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  
  console.log(params.benfeitoria.id, 'params.id')
  
  //vou usar sim ou não se tem pesca artesanal e outras categorias
  //const {contagemBenfeitoria} = useBenfeitorias(params.imovel.id);
  
  
 /*
  const  handleGerenciaBenfeitorias =  (imovelId: number, contagemBenfeitorias: number) =>{
    if(contagemBenfeitoria>0){
      benfeitoriasDoImovel(navigation.navigate, imovelId);
    }
  }
  */
 /*
  const renderField = (label: string, value: string | null| undefined) => {
     return (
          <View style={{ marginBottom: 10 }}>
             <Text type={textTypes.SUB_TITLE_SEMI_BOLD} color={theme.colors.blueTheme.blue1}>
              {label}:
             </Text>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.mainTheme.black}>
              {value? value : 'Informação não cadastrada'}
            </Text>
          </View>
        );
      };
 */ 
    



  return (
    
       <ScrollView style={{ flex: 1 }}>
        <BenfeitoriaDetailContainer>
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
                {renderField('Tipo', params.benfeitoria.tipoBenfeitoria)}
                {renderField('Função', params.benfeitoria.funcao)}
                {renderField('Tipo do Solo', params.benfeitoria.tipoSolo)}
                {renderField('Área aproximada', params.benfeitoria.areaBenfeitoria.toString())}
                {renderField('Pavimentos', params.benfeitoria.pavimentos.toString())}
                {renderField('Tipo de construção', params.benfeitoria.tipoConstrucao)}
                {renderField('Cobertura', params.benfeitoria.tipoCobertura)}
                {renderField('Esquadrias', params.benfeitoria.tipoEsquadrias)}
                {renderField('Alagamentos', params.benfeitoria.alagamentos)}
                {renderField('Nivel de alagamentos', params.benfeitoria.nivelAlagamentos)}
                {renderField('Efluentes', params.benfeitoria.efluentes)}
                {renderField('Resíduos', params.benfeitoria.residuos)}
                {renderField('Fonte de Energia', params.benfeitoria.fonteEnergia)}
                {renderField('Fonte de Enrgia para preparar alimentos', params.benfeitoria.energiaAlimentos)}
                {renderField('Informativo predominante', params.benfeitoria.informativoPredominante)}
                {renderField('Qual importância de proteger a fauna', params.benfeitoria.importanciaDeProtegerFauna)}
                {renderField('Qual espaço precisa ser preservado', params.benfeitoria.qualEspacoPrecisaSerPreservado)}
                {renderField('quais problemas relacionados ao meio ambiente', params.benfeitoria.problemasRelacionadosAoAmbiente)}
            </View>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          marginTop: 10, 
                                          borderWidth: 5, 
                                          borderColor: theme.colors.blueTheme.blue2 
                                        }}>
                            <Icon size={30} name='man' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> Entrevistado</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          marginTop: 10, 
                                          borderWidth: 5, 
                                          borderColor: theme.colors.blueTheme.blue2 
                                        }}>
                            <Icon size={30} name='droplet' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> Saneamento</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          marginTop: 10, 
                                          borderWidth: 5, 
                                          borderColor: theme.colors.blueTheme.blue2 
                                        }}>
                            <Icon size={30} name='office' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> Serviços Básicos</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          marginTop: 10, 
                                          borderWidth: 5, 
                                          borderColor: theme.colors.blueTheme.blue2 
                                        }}>
                            <Icon size={30} name='cogs' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Outros Serviços</Text>
                        </View>
                    </TouchableOpacity>

                   


              <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      marginTop: 40, 
                      borderWidth: 5, 
                      borderColor: theme.colors.blueTheme.blue2 
                    }}>

                    <TouchableOpacity onPress={() =>null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='bin' color='blue' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Imóvel</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: theme.colors.blueTheme.blue2 }} />


                    <TouchableOpacity onPress={() => null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='pencil2' color='blue' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Editar Imóvel</Text>
                        </View>
                    </TouchableOpacity>
               </View>
               
              
      
       </BenfeitoriaDetailContainer>
    </ScrollView>     
   
   
  );
}

export default BenfeitoriaDetails;