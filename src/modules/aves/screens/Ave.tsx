import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getAves } from '../../../realm/services/avesService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AvesType } from '../../../shared/types/AvesType';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { AveDetailContainer } from '../styles/ave.style';
import RenderItemAve from '../ui-components/listaAves';



export interface aveParam {
  entrevistado: EntrevistadoType;
}

export const novaAve = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoId: number) => {
  navigate('NovaAve', { entrevistadoId });
}

const Aves = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, aveParam>, 'AvesLista'>>();
  const { entrevistado } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [aves, setAves] = useState<AvesType[]>();
  

  const fetchAves = async () => {
      if (!entrevistado.id) return;
    
      const novas = getAves(entrevistado.id);
    
      const novasNaoDuplicadas = novas.filter(nova =>
        !aves?.some(a =>
          (a.id && nova.id && a.id === nova.id) ||
          (a.idLocal && nova.idLocal && a.idLocal === nova.idLocal)
        )
      );
    
      setAves(prev => [...(prev ?? []), ...novasNaoDuplicadas]);
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
    novaAve(navigation.navigate, entrevistado.id);
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
