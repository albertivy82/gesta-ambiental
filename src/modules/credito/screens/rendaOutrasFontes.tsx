import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { getImoveis } from '../../../realm/services/imovelService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { imovelBody } from '../../../shared/types/imovelType';
import { ImovelContainer } from '../styles/Imovel.style';
import RenderItemImovel from '../ui-components/listaImoveis';
import { useImoveis } from '../../localidade/hooks/useImoveis';

export interface ImoveisParam {
  localidadeId: number;
}

export const novoImovel = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number) => {
  navigate('NovoImovel', { localidadeId });
}

const RendasOutrasFontes = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, ImoveisParam>, 'Imovel'>>();
  const { localidadeId } = route.params;
  const { contagemImoveis, isLoading, refreshImoveis } = useImoveis(localidadeId);
  const flatListRef = useRef<FlatList>(null);
  const [imovel, setImovel] = useState<imovelBody[]>([]);
  

  // Carrega a lista inicial de imóveis
  const fetchImoveis = useCallback(async () => {
    
    if (localidadeId) {
      const imovelRealm = getImoveis(localidadeId);
      setImovel(imovelRealm);
    }
   
  }, [localidadeId]);

  useEffect(() => {
    fetchImoveis();
  }, [fetchImoveis]);

  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Atualiza a lista de imóveis
  const handleRefresh = () => {
    fetchImoveis();
    handleScrollToEnd();
  };

  const handleNovoImovel = () => {
    novoImovel(navigation.navigate, localidadeId);
  };

  return (
    <ImovelContainer>
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
          LISTA DE IMÓVEIS
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
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={refreshImoveis} disabled={isLoading}>
          <Icon size={20} name='spinner11' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        {/* Botão "Adicionar Imóvel" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoImovel}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Imóvel
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.grayTheme.gray80} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={imovel}
          extraData={imovel} 
          renderItem={({ item }) => <RenderItemImovel item={item} />}
          keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
        />
      )}
    </ImovelContainer>
  );
}

export default RendasOutrasFontes;
