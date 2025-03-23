import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getAves } from '../../../realm/services/avesService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AvesType } from '../../../shared/types/AvesType';
import { AveDetailContainer } from '../styles/ave.style';
import RenderItemAve from '../ui-components/listaAves';



export interface ImoveisParam {
  ave: AvesType[];
}

export const novaAve = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoId: number) => {
  navigate('NovoImovel', { entrevistadoId });
}

const Aves = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, ImoveisParam>, 'Imovel'>>();
  const { ave } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [aves, setAves] = useState<AvesType[]>([]);
  

  // Carrega a lista inicial de imóveis
  const fetchAves = async () => {
    if (ave.length && ave[0].entrevistado.id) {
      const novasAves = getAves(ave[0].entrevistado.id);
  
      const avesUnicas = [...aves, ...novasAves].reduce((acc, curr) => {
        if (!acc.find(item => item.id === curr.id)) {
          acc.push(curr);
        }
        return acc;
      }, [] as AvesType[]);
  
      setAves(avesUnicas);
    }
  };
  



  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Atualiza a lista de imóveis
  const handleRefresh = () => {
    fetchAves();
    handleScrollToEnd();
  };

  const handleNovaAve = () => {
    novaAve(navigation.navigate, ave[0].entrevistado.id);
  };

  return (
    <AveDetailContainer>
      <View style={{  
        alignItems: 'center', 
        flexDirection: 'row',
        borderBottomWidth: 3, 
        borderColor: theme.colors.grayTheme.gray100, 
        marginBottom: 10, 
        backgroundColor: '#505050' 
      }}>
        <Icon size={30} name='stack' color='#fefeff'/>
        <Text 
          type={textTypes.TITLE_BOLD} 
          color={theme.colors.whiteTheme.white}
          margin="0px 0px 0px 30px"
        >
          LISTA DE AVES DO ENTREVISTADO
        </Text>
      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 1,
        borderBottomWidth: 3,
        borderColor: theme.colors.grayTheme.gray100,
        backgroundColor: '#ff4500'
      }}>
       
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleScrollToEnd}>
          <Icon size={20} name='point-down' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Fim da Página
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleRefresh}>
          <Icon size={20} name='spinner11' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

       
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaAve}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Ave
          </Text>
        </TouchableOpacity>
      </View>

    
        <FlatList
          ref={flatListRef}
          data={aves}
          extraData={aves} 
          renderItem={({ item }) => <RenderItemAve item={item} />}
          keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
        />
      
    </AveDetailContainer>
  );
}

export default Aves;
