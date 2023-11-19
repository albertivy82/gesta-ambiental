import { useRoute, RouteProp } from '@react-navigation/native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import Text from '../../../shared/components/text/Text';
import { LocalidadeType } from '../../../shared/types/LocalidadeType';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { Button, View, TouchableOpacity, ScrollView } from 'react-native';
import { LocalidadeContainer } from '../styles/Localidade.style';
import { Icon } from '../../../shared/components/icon/Icon';
import { coordenadasBody } from '../../../shared/types/coordenadaBody';
import { useCoordenadas } from '../hooks/useCoordenadas';
import { useEscolas } from '../hooks/useEscolas';
import { useEffect, useState } from 'react';
import { getCoordenadas } from '../../../realm/services/coordenadaService';
import useDeleteLocalidade from '../hooks/useDeleteLocalidade';
import { useImoveis } from '../hooks/useImoveis';
import { getEscolas } from '../../../realm/services/escolaService';
import { EscolaType } from '../../../shared/types/EscolaType';
import { PostoType } from '../../../shared/types/postoTypes';
import { getPostos } from '../../../realm/services/postoService';
import { usePostos } from '../hooks/usePostos';

export interface LocalidadeParam {
  localidade: LocalidadeType;
}


//BLOCO COORDENADAS
export const novasCoorenadas = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number) =>{
   navigate('Coordenadas', {localidadeId});
}

export const editarCoordenadas = (navigate: NavigationProp<ParamListBase>['navigate'], coordenadas: null) =>{
  navigate('Coordenadas', {coordenadas});
}

//BLOCO IMOVEL
export const imoveisDaLocalidade = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('Imovel', {localidadeId})
}


const InfLocalidade = () => {

      const navigation = useNavigation<NavigationProp<ParamListBase>>();
      const { params } = useRoute<RouteProp<Record<string, LocalidadeParam>>>();
      const { localidade } = params;
      const {coordenadas} = useCoordenadas(localidade.id);
      const {escolas} = useEscolas(localidade.id);
      const {postos} = usePostos(localidade.id);     
      const {contagemImoveis} = useImoveis(localidade.id);
      const [coordenadasRealm, setCorrdenadasRealm] = useState<coordenadasBody[]>([]);
      const [escolasRealm, setEscolasRealm] = useState<EscolaType[]>([]);
      const [postosRealm, setPostosRealm] = useState<PostoType[]>([]);
      const { deleteLocalidade } = useDeleteLocalidade(localidade.id);


      //inicializando listagens...
            useEffect(()=>{
                if(coordenadas){
                  const getCoordenadasRealm = getCoordenadas(localidade.id);
                 
                  setCorrdenadasRealm(getCoordenadasRealm);
                }
            }, [coordenadas]);

            useEffect(()=>{
                if(escolas){
                  const getEscolasRealm = getEscolas(localidade.id);
                  setEscolasRealm(getEscolasRealm);
                }
            },[escolas]);

            useEffect(()=>{
              if(postos){
                const getPostosRealm = getPostos(localidade.id);
                setPostosRealm(getPostosRealm);
              }
            },[postos]);


        
     
      const handleDeleteLocalidade = () => {
        deleteLocalidade();
      };

     const handleCoordinatePress=()=>{return null};
     const handleSchoolPress=()=>{};
     const  handlePostPress=()=>{};

      //BLOCO COORDENADAS
      const handleCoordenadasInserir =  (localidadeId: number) =>{
        novasCoorenadas(navigation.navigate, localidadeId);
      }
      const handleCoordenadasEditar =  (coordenadas: null) =>{
        editarCoordenadas(navigation.navigate, null);
      }
      
      //BLOCO IMOVEL
      const  handleGerenciaImoveis =  (localidadeId: number, contagemImoveis: number) =>{
        if(contagemImoveis>0){
        imoveisDaLocalidade(navigation.navigate, localidadeId);
        }
      }
      

        const renderField = (label: string, value: string[] | null) => {
          return (
            <View style={{ marginBottom: 10 }}>
              <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                {label}: {value && value.length > 0 ? value.join(', ') : 'Informação não cadastrada'}
              </Text>
            </View>
          );
        };

       

        const renderImovel = (label: string, values: number) => {
            return (
                <View style={{ marginBottom: 10 }}>
                    <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                        {label}:
                </Text>
              <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                        {values && values > 0 ? values: 'Não há imóveis cadstrados'}
              </Text>
                </View>
            );
        };

            type ItemList = coordenadasBody | EscolaType | PostoType;
            type OnItemPressCallback = (items: ItemList) => void;
            const renderItemList = (items: ItemList[], label: string, onItemPress: (item: ItemList) => void) => {
              
           
              if (items.length === 0) {
                return (
                  <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
                    <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                      {label}: Não há itens cadastrados
                    </Text>
                  </View>
                )
              };
            

              return (
                
                <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
                  <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>

                    {label}:
                  </Text>
                
                  {items.map((item, index) => {
                    let displayText: string;
                    
                    if ('latitude' in item && 'longitude' in item) {
                      displayText = `${item.latitude}, ${item.longitude}`;
                    } else if ('nome' in item) {
                      displayText = item.nome;
                    } else {
                      displayText = "Unknown Item";
                    }
            
                    return (
                      <TouchableOpacity key={index} onPress={() => onItemPress(item)}>
                            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                              {displayText}
                            </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            };
    





  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#bacff1' }}>
    <LocalidadeContainer>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
        {renderField('Nome', [localidade.nome])}
        {renderField('Município', [localidade.municipio])}
        {renderField('Esfera', [localidade.esfera])}
      </View>

           
      <View>
            {renderItemList(coordenadasRealm, 'Coordenadas', handleCoordinatePress)}
            {renderItemList(escolasRealm, 'Escolas', handleSchoolPress)}
            {renderItemList(postosRealm, 'Postos', handlePostPress)}
      </View>
      

      <TouchableOpacity onPress={() => handleGerenciaImoveis(localidade.id, contagemImoveis)}>
          <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
             {renderImovel('Imoveis Cadastrados', contagemImoveis)}
          </View>
      </TouchableOpacity>
       
      
      
      
      
      <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      marginTop: 40, 
                      borderWidth: 5, 
                      borderColor: theme.colors.blueTheme.blue2 
                    }}>

                    <TouchableOpacity onPress={() => handleDeleteLocalidade}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='bin' color='blue' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Localidade</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: theme.colors.blueTheme.blue2 }} />


                    <TouchableOpacity onPress={() => null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='pencil2' color='blue' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Editar Localidade</Text>
                        </View>
                    </TouchableOpacity>
        </View>
    </LocalidadeContainer>
    </ScrollView>
  );
};

export default InfLocalidade;
