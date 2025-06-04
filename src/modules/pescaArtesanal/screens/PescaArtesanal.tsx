import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { PescaArtesanalType } from '../../../shared/types/PescaArtesanal';
import { getPescaArtesanal } from '../../../realm/services/pescaService';
import { PescaArtesanalDetailContainer } from '../styles/pescaArtesanal.style';
import RenderItemPescaArtesanal from '../ui-components/listaPescaArtesanal';



export interface PescaParams {
  pesca: PescaArtesanalType;
}

export const novaPesca = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoriaId: number) => {
  navigate('NovaPescaArtesanal', { benfeitoriaId });
}

const PescaArtesanal = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, PescaParams>, 'Imovel'>>();
  const { pesca } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [pescas, setPescas] = useState<PescaArtesanalType[]>([]);

  // Carrega a lista inicial de créditos
  const fetchPescas = async () => {
    if (pesca.benfeitoria.id) {
      const pescaRealm = getPescaArtesanal(pesca.benfeitoria.id);
      setPescas(pescaRealm);
    }
  };

  useEffect(() => {
    fetchPescas();
  }, [fetchPescas]);

  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Atualiza a lista de créditos
  const handleRefresh = () => {
    fetchPescas();
    handleScrollToEnd();
  };

  const handleNovaPesca = () => {
    novaPesca(navigation.navigate, pesca.benfeitoria.id);
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
          ENTREVISTAS SOBRE PESCA ARTESANAL NA BENFEITORIA
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

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaPesca}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Adicionar Entrevista
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={pescas}
        extraData={pescas} 
        renderItem={({ item }) => <RenderItemPescaArtesanal item={item} />}
        keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
      />
      
    </PescaArtesanalDetailContainer>
  );
}

export default PescaArtesanal;
