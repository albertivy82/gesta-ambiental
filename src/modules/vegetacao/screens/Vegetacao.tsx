import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getVegetacoes } from '../../../realm/services/vegetacaoService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { VegetacaoType } from '../../../shared/types/VegetacaoType';
import { VegetacaoDetailContainer } from '../styles/vegetacao.style';
import RenderItemVegetacao from '../ui-components/listaVegetacao';


export interface VegetacaoParam {
  vegetacao: VegetacaoType[];
}

export const novaVegetacao = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoId: number) => {
  navigate('NovaVegetacao', { entrevistadoId });
}

const Vegetacao = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, VegetacaoParam>, 'Vegetacao'>>();
  const { vegetacao } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [vegetacoes, setVegetacoes] = useState<VegetacaoType[]>(vegetacao);

  const fetchVegetacoes = async () => {
    const entrevistadoId = vegetacao[0]?.entrevistado.id;
    if (entrevistadoId) {
      const novas = getVegetacoes(entrevistadoId);
      const filtradas = novas.filter(nova =>
        !vegetacoes.some(v => (v.id && nova.id && v.id === nova.id) || (v.idLocal && nova.idLocal && v.idLocal === nova.idLocal))
      );
      setVegetacoes(prev => [...prev, ...filtradas]);
    }
  };

  useEffect(() => {
    fetchVegetacoes();
  }, []);

  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleRefresh = () => {
    fetchVegetacoes();
    handleScrollToEnd();
  };

  const handleNovaVegetacao = () => {
    novaVegetacao(navigation.navigate, vegetacao[0]?.entrevistado.id);
  };

  return (
    <VegetacaoDetailContainer>
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 3,
        borderColor: theme.colors.grayTheme.gray100,
        marginBottom: 10,
        backgroundColor: '#505050'
      }}>
        <Icon size={30} name='leaf' color='#fefeff' />
        <Text
          type={textTypes.TITLE_BOLD}
          color={theme.colors.whiteTheme.white}
          margin="0px 0px 0px 30px"
        >
          LISTA DE VEGETAÇÃO DO ENTREVISTADO
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
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>
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

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaVegetacao}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>
            Add Vegetação
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={vegetacoes}
        extraData={vegetacoes}
        renderItem={({ item }) => <RenderItemVegetacao item={item} />}
        keyExtractor={(item) => item.id?.toString() ?? item.idLocal ?? 'sem-id'}
      />
    </VegetacaoDetailContainer>
  );
};

export default Vegetacao;
