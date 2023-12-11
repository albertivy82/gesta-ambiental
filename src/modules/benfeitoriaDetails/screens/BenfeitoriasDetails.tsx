import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { BenfeitoriaDetailContainer, Icones } from '../styles/BenfeitoriaDetails.style';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { renderField } from '../ui-components/renderField';
import Text from '../../../shared/components/text/Text';
import { Icon } from '../../../shared/components/icon/Icon';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { UseConsumo } from '../hooks/UseConsumo';
import { AlimentacaoSchema } from '../../../realm/models/alimentacaoSchema';




export interface BenfeitoriaParam {
 benfeitoria: BenfeitoriaType;
}

//BLOCO CONSUMO
export const comprasDaBenfeitoria = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: number)=>{
    navigate('ConsumoItens', {benfeitoria})
}
export const cadastrarCompras = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: number)=>{
  navigate('Consumo', {benfeitoria})
}


const BenfeitoriaDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const {compras, benfeitoriaAlimentos} = UseConsumo(params.benfeitoria.id)
  
  let origemMaterialConstrucaoString = '';
  if ( params.benfeitoria.OrigemMaterialConstrucao &&  params.benfeitoria.OrigemMaterialConstrucao.length > 0) {
      origemMaterialConstrucaoString =  params.benfeitoria.OrigemMaterialConstrucao.join(', ');
  }
 
  console.log("estes itens devem ser boleanos", compras, benfeitoriaAlimentos);
  const  handleGerenciaConsumos =  (benfeitoria: number) =>{
    if(benfeitoriaAlimentos && compras){
     
      comprasDaBenfeitoria(navigation.navigate, benfeitoria);
    } else {
      
      cadastrarCompras(navigation.navigate, benfeitoria)
    }
  }



  return (
    
       <ScrollView style={{ flex: 1 }}>
        <BenfeitoriaDetailContainer>
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
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

                    <TouchableOpacity onPress={() =>handleGerenciaConsumos(params.benfeitoria.id)}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icon name="cart" size={30} color="red" />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> consumo</Text>
                                           <View>
                                            {!benfeitoriaAlimentos && !compras && (
                                               <Text type={textTypes.PARAGRAPH_REGULAR} color={theme.colors.blueTheme.blue1}> 
                                                Não há itens cadastrados neste aspecto
                                               </Text>
                                            )}
                                            </View>
                           </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100
                                        }}>
                            <Icon size={30} name='delicious' color='orange' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> dependencias</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icon size={30} name='mobile' color='blue' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}> Serviços de Comunicação disponiveis</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icon size={30} name='leaf' color='green' />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Vegetação</Text>
                        </View>
                    </TouchableOpacity>

                    
                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/peixes.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Peixes</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/macaco.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Mamíferos</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/fauna.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>fauna</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100 
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/aves.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>aves</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/agua.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Água</Text>
                        </View>
                    </TouchableOpacity>
                   
                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/instituicoes.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Instituições Conhecidas</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/producao.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Ativiades Produtivas</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/violencia.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>violencias</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/renda.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Outras Fontes de Renda</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/credito.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Crédito</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/moradores.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Moradores</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() =>null}>
                          <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                          padding: 10,
                                          borderWidth: 2, 
                                          borderColor: theme.colors.grayTheme.gray100
                                        }}>
                            <Icones resizeMode="contain" source={require('../../../assets/images/pesca.png')} />
                            <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Pesca Artesanal</Text>
                        </View>
                    </TouchableOpacity>

                   
                    

              <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      
                      borderWidth: 2, 
                      borderColor: theme.colors.grayTheme.gray100 
                    }}>

                    <TouchableOpacity onPress={() =>null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='bin' color='red' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Imóvel</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: theme.colors.grayTheme.gray100 }} />


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