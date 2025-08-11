import { NavigationProp, ParamListBase, RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import RenderItemAtividade from '../ui-components/listaAtvProdutivas';
import { AtividadeProdutivaType } from '../../../shared/types/AtividadeProdutiva';
import { AtividadeDetailContainer } from '../styles/ativdade.style';
import { getAtividadesProdutivas } from '../../../realm/services/atividadeProdutivaService';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { useAtividadesProdutivas } from '../../benfeitoriaDetails/hooks/useAtividadeProdutiva';

export interface BenfeitoriaParams {
  benfeitoria: BenfeitoriaType;
}

export const novaAtividade = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType) => {
  navigate('NovaAtividade', { benfeitoria });
}

const Atividades = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, BenfeitoriaParams>>>();
  const { benfeitoria } = route.params;
  const flatListRef = useRef<FlatList>(null);
   const [isLoading, setIsLoading] = useState(false);
  const [atividades, setAtividades] = useState<AtividadeProdutivaType[]>([]);
  const {} = useAtividadesProdutivas(benfeitoria.id);

  
 const isFocused = useIsFocused();

  const carregarAtividades = () => {
    if (benfeitoria) {
      setIsLoading(true);
      const atividadesRealm = getAtividadesProdutivas(benfeitoria.id);
      setAtividades(atividadesRealm);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isFocused) {
      carregarAtividades();
    }
  }, [isFocused]);
  
  const handleRefresh = () => {
    carregarAtividades();
    handleScrollToEnd();
  };

   // Rola até o final da lista
const handleScrollToEnd = () => {
  flatListRef.current?.scrollToEnd({ animated: true });
};  



  const handleNovaAtividade = () => {
    novaAtividade(navigation.navigate, benfeitoria);
  };

  return (
    <AtividadeDetailContainer>
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 3,
        borderColor: theme.colors.grayTheme.gray100,
        marginBottom: 10,
        backgroundColor: '#505050'
      }}>
        <Icon size={30} name='stack' color='#fefeff' />
        <Text
          type={textTypes.TITLE_BOLD}
          color={theme.colors.whiteTheme.white}
          margin="0px 0px 0px 10px"
        >
        ATIVIDADES PRODUTIVAS
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
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>
            Atualizar
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaAtividade}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Atividade
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={atividades}
        extraData={atividades}
        renderItem={({ item }) => <RenderItemAtividade item={item} />}
        keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
      />
    </AtividadeDetailContainer>
  );
}

export default Atividades;
