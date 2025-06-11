import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getRepteis } from '../../../realm/services/repteisService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { RepteisType } from '../../../shared/types/RepteisType';
import RenderItemReptil from '../ui-components/listaRepteis';
import { ReptilDetailContainer } from '../styles/Reptil.style';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';


export interface ReptilParam {
  entrevistado: EntrevistadoType;
}

export const novoReptil = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistadoId: number) => {
  navigate('NovoReptil', { entrevistadoId });
}

const Repteis = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, ReptilParam>, 'ReptilLista'>>();
  const { entrevistado } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [repteis, setRepteis] = useState<RepteisType[]>();

  const fetchRepteis = async () => {
    if (!entrevistado.id) return;

    const novas = getRepteis(entrevistado.id);

    const novasNaoDuplicadas = novas.filter(nova =>
      !repteis?.some(v =>
        (v.id && nova.id && v.id === nova.id) ||
        (v.idLocal && nova.idLocal && v.idLocal === nova.idLocal)
      )
    );

    setRepteis(prev => [...(prev ?? []), ...novasNaoDuplicadas]);
  };


  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleRefresh = () => {
    fetchRepteis();
    handleScrollToEnd();
  };

  const handleNovaReptil = () => {
    novoReptil(navigation.navigate, entrevistado.id);
  };

  return (
    <ReptilDetailContainer>
      <View style={{ alignItems: 'center', flexDirection: 'row', borderBottomWidth: 3, borderColor: theme.colors.grayTheme.gray100, marginBottom: 10, backgroundColor: '#505050' }}>
        <Icon size={30} name='stack' color='#fefeff'/>
        <Text type={textTypes.TITLE_BOLD} color={theme.colors.whiteTheme.white} margin="0px 0px 0px 30px">
          LISTA DE RÉPTEIS DO ENTREVISTADO
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

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaReptil}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Adicionar Réptil</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={repteis}
        extraData={repteis}
        renderItem={({ item }) => <RenderItemReptil item={item} />}
        keyExtractor={(item) => item.id?.toString() || item.idLocal || 'Sem Id'}
      />
    </ReptilDetailContainer>
  );
};

export default Repteis;
