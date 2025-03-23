// Fauna.tsx
import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getFauna } from '../../../realm/services/faunaService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { FaunaType } from '../../../shared/types/FaunaType';
import { FaunaDetailContainer } from '../styles/fauna.style';
import RenderItemFauna from '../ui-components/listaFauna';


export interface FaunaParam {
  fauna: FaunaType[];
}

export const novaFauna = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoId: number) => {
  navigate('NovaFauna', { entrevistadoId });
}

const Fauna = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, FaunaParam>, 'Imovel'>>();
  const { fauna } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [faunaList, setFaunaList] = useState<FaunaType[]>(fauna);

  const fetchFauna = async () => {
    const entrevistadoId = fauna[0]?.entrevistado.id;
    if (entrevistadoId) {
      const faunaRealm = getFauna(entrevistadoId);
      const novos = faunaRealm.filter(f => !faunaList.some(existing => existing.id === f.id || existing.idLocal === f.idLocal));
      setFaunaList(prev => [...prev, ...novos]);
    }
  };

  useEffect(() => {
    fetchFauna();
  }, []);

  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleRefresh = () => {
    fetchFauna();
    handleScrollToEnd();
  };

  const handleNovaFauna = () => {
    const entrevistadoId = fauna[0]?.entrevistado.id;
    if (entrevistadoId) novaFauna(navigation.navigate, entrevistadoId);
  };

  return (
    <FaunaDetailContainer>
      <View style={{ alignItems: 'center', flexDirection: 'row', borderBottomWidth: 3, borderColor: theme.colors.grayTheme.gray100, marginBottom: 10, backgroundColor: '#505050' }}>
        <Icon size={30} name='stack' color='#fefeff'/>
        <Text type={textTypes.TITLE_BOLD} color={theme.colors.whiteTheme.white} margin="0px 0px 0px 30px">
          LISTA DE FAUNA DO ENTREVISTADO
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 1, borderBottomWidth: 3, borderColor: theme.colors.grayTheme.gray100, backgroundColor: '#ff4500' }}>
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleScrollToEnd}>
          <Icon size={20} name='point-down' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Fim da Página</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleRefresh}>
          <Icon size={20} name='spinner11' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaFauna}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Add Fauna</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={faunaList}
        extraData={faunaList}
        renderItem={({ item }) => <RenderItemFauna item={item} />}
        keyExtractor={(item) => item.id?.toString() ?? item.idLocal ?? 'SemId'}
      />
    </FaunaDetailContainer>
  );
};

export default Fauna;
