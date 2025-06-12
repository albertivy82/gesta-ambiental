import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { NavigationProp, ParamListBase, RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getPeixes } from '../../../realm/services/peixesService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { PeixeDetailContainer } from '../styles/peixe.style';
import { PeixesType } from '../../../shared/types/PeixesType';
import RenderItemPeixe from '../ui-components/listaPeixe';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';

export interface PeixeParam {
  entrevistado: EntrevistadoType;
}

export const novoPeixe = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType) => {
  navigate('NovoPeixe', { entrevistado });
}

const Peixes = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, PeixeParam>, 'PeixeLista'>>();
  const { entrevistado } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [peixes, setPeixes] = useState<PeixesType[]>();

  const fetchPeixes = async () => {
    if (!entrevistado.id) return;

    const novas = getPeixes(entrevistado.id);

    const novasNaoDuplicadas = novas.filter(nova =>
      !peixes?.some(v =>
        (v.id && nova.id && v.id === nova.id) ||
        (v.idLocal && nova.idLocal && v.idLocal === nova.idLocal)
      )
    );

    setPeixes(prev => [...(prev ?? []), ...novasNaoDuplicadas]);
  };


  useEffect(() => {
    fetchPeixes();
  }, []);

  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleRefresh = () => {
    fetchPeixes();
    handleScrollToEnd();
  };

  

  const handleNovoPeixe = () => {
    novoPeixe(navigation.navigate, entrevistado);
  };

  return (
    <PeixeDetailContainer>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#505050', marginBottom: 10, borderBottomWidth: 3, borderColor: theme.colors.grayTheme.gray100 }}>
        <Icon size={30} name='fish' color='#fff' />
        <Text type={textTypes.TITLE_BOLD} color={theme.colors.whiteTheme.white} margin="0px 0px 0px 30px">LISTA DE PEIXES</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 3, borderColor: theme.colors.grayTheme.gray100, backgroundColor: '#ff4500' }}>
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleScrollToEnd}>
          <Icon size={20} name='point-down' color="#fff" />
          <Text type={textTypes.PARAGRAPH_LIGHT} color="#fff">Fim da Página</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleRefresh}>
          <Icon size={20} name='spinner11' color="#fff" />
          <Text type={textTypes.PARAGRAPH_LIGHT} color="#fff">Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoPeixe}>
          <Icon size={20} name='plus' color="#fff" />
          <Text type={textTypes.PARAGRAPH_LIGHT} color="#fff">Add Peixe</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={peixes}
        extraData={peixes}
        renderItem={({ item }) => <RenderItemPeixe item={item} />}
        keyExtractor={(item) => item.id?.toString() || item.idLocal || 'sem-id'}
      />
    </PeixeDetailContainer>
  );
};

export default Peixes;
