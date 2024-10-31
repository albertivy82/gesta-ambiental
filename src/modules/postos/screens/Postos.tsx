import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { getPostos } from '../../../realm/services/postoService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { PostoType } from '../../../shared/types/postoTypes';
import { PostoContainer } from '../styles/Postos.style';
import RenderItemImovel from '../ui-components/listaPostos';

export interface EscolaParam {
  localidadeId: number;
}

export const novoPosto = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number) => {
  navigate('NovoPosto', { localidadeId });
}

const Postos = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, EscolaParam>, 'Posto'>>();
  const { localidadeId } = route.params;
  const flatListRef = useRef<FlatList>(null);

  const [posto, setPosto] = useState<PostoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega a lista inicial de imóveis
  const fetchPosto = useCallback(async () => {
    setIsLoading(true);
    if (localidadeId) {
      const imovelRealm = getPostos(localidadeId);
      setPosto(imovelRealm);
    }
    setIsLoading(false);
  }, [localidadeId]);

  useEffect(() => {
    fetchPosto();
  }, [fetchPosto]);

  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Atualiza a lista de imóveis
  const handleRefresh = () => {
    fetchPosto();
    handleScrollToEnd();
  };

  const handleNovoImovel = () => {
    novoPosto(navigation.navigate, localidadeId);
  };

  return (
    <PostoContainer>
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
          LISTA DE POSTOS
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
        {/* Botão "Ir para o Fim" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleScrollToEnd}>
          <Icon size={20} name='point-down' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Fim da Página
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        {/* Botão "Atualizar" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleRefresh} disabled={isLoading}>
          <Icon size={20} name='spinner11' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Atualizar
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        {/* Botão "Adicionar Imóvel" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoImovel}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Posto
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.grayTheme.gray80} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={posto}
          extraData={posto} 
          renderItem={({ item }) => <RenderItemImovel item={item} />}
          keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
        />
      )}
    </PostoContainer>
  );
}

export default Postos;
