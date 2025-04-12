import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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

export interface AtividadesParams {
  atividade: AtividadeProdutivaType;
}

export const novaAtividade = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoriaId: number) => {
  navigate('NovoImovel', { benfeitoriaId });
}

const Atividades = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, AtividadesParams>, 'Imovel'>>();
  const { atividade } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [atividades, setAtividades] = useState<AtividadeProdutivaType[]>([]);

  const fetchAtividades = async () => {
    if (atividade.benfeitoria.id) {
      const imovelRealm = getAtividadesProdutivas(atividade.benfeitoria.id);
      setAtividades(imovelRealm);
    }
  };

  useEffect(() => {
    fetchAtividades();
  }, [fetchAtividades]);

  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleRefresh = () => {
    fetchAtividades();
    handleScrollToEnd();
  };

  const handleNovaAtividade = () => {
    novaAtividade(navigation.navigate, atividade.benfeitoria.id);
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
          margin="0px 0px 0px 30px"
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
