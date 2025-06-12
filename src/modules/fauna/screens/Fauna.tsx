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
import { FaunaDetailContainer } from '../styles/Fauna.style';
import RenderItemFauna from '../ui-components/listaFauna';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';


export interface FaunaParam {
  entrevistado: EntrevistadoType;
}

export const novaFauna = (navigate: NavigationProp<ParamListBase>['navigate'],  entrevistado: EntrevistadoType) => {
  navigate('NovaFauna', { entrevistado });
}

  const Fauna = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, FaunaParam>, 'FaunaLista'>>();
  const { entrevistado } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [faunas, setFaunas] = useState<FaunaType[]>();

  const fetchFauna = async () => {
    if (!entrevistado.id) return;

    const novas = getFauna(entrevistado.id);

    const novasNaoDuplicadas = novas.filter(nova =>
      !faunas?.some(v =>
        (v.id && nova.id && v.id === nova.id) ||
        (v.idLocal && nova.idLocal && v.idLocal === nova.idLocal)
      )
    );

    setFaunas(prev => [...(prev ?? []), ...novasNaoDuplicadas]);
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
    novaFauna(navigation.navigate, entrevistado);
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
        data={faunas}
        extraData={faunas}
        renderItem={({ item }) => <RenderItemFauna item={item} />}
        keyExtractor={(item) => item.id?.toString() ?? item.idLocal ?? 'SemId'}
      />
    </FaunaDetailContainer>
  );
};

export default Fauna;
