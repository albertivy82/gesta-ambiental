import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { BenfeitoriaDetailContainer } from '../styles/BenfeitoriaDetails.style';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { renderField } from '../ui-components/renderField';
import Text from '../../../shared/components/text/Text';
import { Icon } from '../../../shared/components/icon/Icon';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';




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
  
  let origemMaterialConstrucaoString = '';
  if ( params.benfeitoria.OrigemMaterialConstrucao &&  params.benfeitoria.OrigemMaterialConstrucao.length > 0) {
      origemMaterialConstrucaoString =  params.benfeitoria.OrigemMaterialConstrucao.join(', ');
  }
    



  return (
    
       <ScrollView style={{ flex: 1 }}>
        <BenfeitoriaDetailContainer>
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
                {renderField('Tipo', params.benfeitoria.tipoBenfeitoria)}
                {renderField('Função', params.benfeitoria.funcao)}
                {renderField('Tipo do Solo', params.benfeitoria.tipoSolo)}
                {renderField('Área aproximada', params.benfeitoria.areaBenfeitoria.toString()+' km²')}
                {renderField('Pavimentos', params.benfeitoria.pavimentos.toString())}
                {renderField('Tipo de construção', params.benfeitoria.tipoConstrucao)}
                {renderField('Origem dos materiais de construção', origemMaterialConstrucaoString)}
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