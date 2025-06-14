import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getMamiferos } from '../../../realm/services/mamiferosService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';
import { MamiferosType } from '../../../shared/types/MamiferosType';
import { MamiferoDetailContainer } from '../styles/Mamifero.style';
import RenderItemMamifero from '../ui-components/listaMamiferos';


export interface MamiferoParam {
  entrevistado: EntrevistadoType;
}

export const novoMamifero = (navigate: NavigationProp<ParamListBase>['navigate'],  entrevistado: EntrevistadoType) => {
  navigate('NovoMamifero', { entrevistado });
}

const Mamiferos = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, MamiferoParam>, 'Mamiferos'>>();
  const { entrevistado } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [mamiferos, setMamiferos] = useState<MamiferosType[]>();

  const fetchMamiferos = async () => {
    if (!entrevistado.id) return;

    const novas = getMamiferos(entrevistado.id);

    const novasNaoDuplicadas = novas.filter(nova =>
      !mamiferos?.some(v =>
        (v.id && nova.id && v.id === nova.id) ||
        (v.idLocal && nova.idLocal && v.idLocal === nova.idLocal)
      )
    );

    setMamiferos(prev => [...(prev ?? []), ...novasNaoDuplicadas]);
  };


  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleRefresh = () => {
    fetchMamiferos();
    handleScrollToEnd();
  };

  const handleNovoMamifero = () => {
    novoMamifero(navigation.navigate, entrevistado);
  };

  return (
    <MamiferoDetailContainer>
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
          LISTA DE MAMÍFEROS DO ENTREVISTADO
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
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoMamifero}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>
            Add Mamífero
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={mamiferos}
        extraData={mamiferos}
        renderItem={({ item }) => <RenderItemMamifero item={item} />}
        keyExtractor={(item) =>
          item.id?.toString() || item.idLocal || 'Sem Id'
        }
      />
    </MamiferoDetailContainer>
  );
};

export default Mamiferos;
