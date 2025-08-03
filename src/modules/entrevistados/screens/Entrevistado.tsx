import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { getEntrevistados } from '../../../realm/services/entrevistado';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { useEntrevistados } from '../../localidade/hooks/useEntrevistados';
import { EntrevistadoContainer } from '../styles/entrevistado.style';
import RenderItemEntrevistado from '../ui-components/listaEntrevistados';
import { getTodosImoveis } from '../../../realm/services/imovelService';


export interface entrevistadoParam {
  localidadeId: number;
}



const Entrevistados = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, entrevistadoParam>, 'Entrevistado'>>();
  const { localidadeId } = route.params;
  const { contagemEntrevistados } = useEntrevistados(localidadeId);

  
  
  const flatListRef = useRef<FlatList>(null);
  const [entrevistados, setEntrevistados] = useState<EntrevistadoType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
    if (localidadeId) {
      const entrevistadoRealm = getEntrevistados(localidadeId);
      setEntrevistados(entrevistadoRealm);
    
    }
  }, [localidadeId]);
  
  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const fetchEntrevistados = useCallback(async () => {
      setIsLoading(true);
      if (localidadeId) {
        const eentrevistadosRealm = getEntrevistados(localidadeId);
        setEntrevistados(eentrevistadosRealm);
      }
      setIsLoading(false);
    }, [localidadeId]);

    useEffect(() => {
      fetchEntrevistados();
    }, [fetchEntrevistados]);

    const handleRefresh = () => {
      fetchEntrevistados();
      handleScrollToEnd();
    };

  const handleNovoEntrevistado = () => {
    navigation.navigate('NovoEntrevistado', { localidadeId: localidadeId });
  };

  return (
    <EntrevistadoContainer>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomWidth: 3,
          borderColor: theme.colors.grayTheme.gray100,
          marginBottom: 10,
          backgroundColor: '#505050',
        }}
      >
        <Icon size={30} name="stack" color="#fefeff" />
        <Text type={textTypes.TITLE_BOLD} color={theme.colors.whiteTheme.white} margin="0px 0px 0px 30px">
          LISTA DE ENTREVISTADOS
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 1,
          borderBottomWidth: 3,
          borderColor: theme.colors.grayTheme.gray100,
          backgroundColor: '#ff4500',
        }}
      >
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleScrollToEnd}>
          <Icon size={20} name="point-down" color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Fim da Página
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleRefresh} disabled={isLoading}>
          <Icon size={20} name="spinner11" color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoEntrevistado}>
          <Icon size={20} name="plus" color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Entrevistado
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.grayTheme.gray80} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={entrevistados}
          extraData={entrevistados}
          renderItem={({ item }) => <RenderItemEntrevistado item={item} />}
          keyExtractor={(item) => (item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id')}
        />
      )}
    </EntrevistadoContainer>
  );
};

export default Entrevistados;
