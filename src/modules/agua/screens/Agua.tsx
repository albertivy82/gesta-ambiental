import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getAguas } from '../../../realm/services/aguasService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { AguaType } from '../../../shared/types/AguaType';
import { AguaDetailContainer } from '../styles/agua.style';
import RenderItemAgua from '../ui-components/listaAgua';


export interface AguaParams {
  aguas: AguaType;
}

export const novaAgua = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoriaId: number) => {
  navigate('NovaAgua', { benfeitoriaId });
}

const Aguas = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, AguaParams>>>();
  const { aguas } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [aguass, setAguas] = useState<AguaType[]>([]);

  const fetchAguas = async () => {
    if (aguas.benfeitoria.id) {
      const imovelRealm = getAguas(aguas.benfeitoria.id);
      setAguas(imovelRealm);
    }
  };

  useEffect(() => {
    fetchAguas();
  }, [fetchAguas]);

  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleRefresh = () => {
    fetchAguas();
    handleScrollToEnd();
  };

  const handleNovaAgua = () => {
    novaAgua(navigation.navigate, aguas.benfeitoria.id);
  };

  return (
    <AguaDetailContainer>
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
          ÁGUA
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

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaAgua}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={aguass}
        extraData={aguass}
        renderItem={({ item }) => <RenderItemAgua item={item} />}
        keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
      />
    </AguaDetailContainer>
  );
}

export default Aguas;
