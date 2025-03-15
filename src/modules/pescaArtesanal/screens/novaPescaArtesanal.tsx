import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { PescaArtesanalDetailContainer } from '../styles/pescaArtesanal.style';
import RenderItemPescaArtesanal from '../ui-components/listaPescaArtesanal';
import { PescaArtesanalType } from '../../../shared/types/PescaArtesanal';

export interface PescaArtesanalParams {
  pescaArtesanal: PescaArtesanalType;
}

export const novaPescaArtesanal = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoriaId: number) => {
  navigate('NovaPescaArtesanal', { benfeitoriaId });
}

const PescaArtesanal = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, PescaArtesanalParams>, 'Imovel'>>();
  const { pescaArtesanal } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [pescasArtesanais, setPescasArtesanais] = useState<PescaArtesanalType[]>([]);

  // Carrega a lista inicial de registros de pesca artesanal
  const fetchPescasArtesanais = async () => {
    if (pescaArtesanal.benfeitoria.id) {
      // const pescaRealm = getPescasArtesanais(pescaArtesanal.benfeitoria.id);
      // setPescasArtesanais(pescaRealm);
    }
  };

  useEffect(() => {
    fetchPescasArtesanais();
  }, [fetchPescasArtesanais]);

  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Atualiza a lista de registros de pesca artesanal
  const handleRefresh = () => {
    fetchPescasArtesanais();
    handleScrollToEnd();
  };

  const handleNovaPescaArtesanal = () => {
    novaPescaArtesanal(navigation.navigate, pescaArtesanal.benfeitoria.id);
  };

  return (
    <PescaArtesanalDetailContainer>
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
          LISTA DE REGISTROS DE PESCA ARTESANAL
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

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaPescaArtesanal}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Adicionar Registro de Pesca
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={pescasArtesanais}
        extraData={pescasArtesanais} 
        renderItem={({ item }) => <RenderItemPescaArtesanal item={item} />}
        keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
      />
      
    </PescaArtesanalDetailContainer>
  );
}

export default PescaArtesanal;
