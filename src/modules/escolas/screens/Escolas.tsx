import { NavigationProp, ParamListBase, RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { getEscolas } from '../../../realm/services/escolaService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { EscolaType } from '../../../shared/types/EscolaType';
import { EscolaContainer } from '../styles/Escolas.style';
import RenderItemEscola from '../ui-components/listaEscolas';
import { useEscolas } from '../../localidade/hooks/useEscolas';

export interface EscolasParam {
  localidadeId: number;
}

export const novaEscola = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number) => {
  navigate('NovaEscola', { localidadeId });
}

const Escolas = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
   const route = useRoute<RouteProp<Record<string, EscolasParam>, 'Localidade'>>();
   const { localidadeId } = route.params;
   const foccus=useIsFocused();
  const {contagemEscolas} = useEscolas(localidadeId, foccus);
  const flatListRef = useRef<FlatList>(null);

  const [escola, setEscola] = useState<EscolaType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega a lista inicial de escolas
  const fetchEscolas = useCallback(async () => {
    setIsLoading(true);
    if (localidadeId) {
      const escolasRealm = getEscolas(localidadeId);
      setEscola(escolasRealm);
    }
    setIsLoading(false);
  }, [localidadeId]);

  useEffect(() => {
    fetchEscolas();
  }, [fetchEscolas]);

  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };
   
 
  // Atualiza a lista de escolas
  const handleRefresh = () => {
    fetchEscolas();
    handleScrollToEnd();
  };

  const handleNovaEscola = () => {
    navigation.navigate('NovaEscola', { localidadeId: localidadeId });
  };

  return (
    <EscolaContainer>
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
          LISTA DE ESCOLAS
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
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaEscola}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Escola
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.grayTheme.gray80} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={escola}
          extraData={escola} 
          renderItem={({ item }) => <RenderItemEscola item={item} />}
          keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
        />
      )}
    </EscolaContainer>
  );
}

export default Escolas;
