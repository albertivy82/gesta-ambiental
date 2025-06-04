import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getMamiferos } from '../../../realm/services/mamiferosService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { MamiferosType } from '../../../shared/types/MamiferosType';
import { MamiferoDetailContainer } from '../styles/Mamifero.style';
import RenderItemMamifero from '../ui-components/listaMamiferos';



export interface MamiferosParam {
  mamifero: MamiferosType[];
}

export const novoMamifero = (
  navigate: NavigationProp<ParamListBase>['navigate'],
  entrevistadoId: number
) => {
  navigate('NovoMamifero', { entrevistadoId });
};

const Mamiferos = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, MamiferosParam>, 'Imovel'>>();
  const { mamifero } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [mamiferos, setMamiferos] = useState<MamiferosType[]>(mamifero);

  const fetchMamiferos = async () => {
    const entrevistadoId = mamifero[0]?.entrevistado?.id;
    if (entrevistadoId) {
      const realmData = getMamiferos(entrevistadoId);
      const novos = realmData.filter((novo) =>
        !mamiferos.some((existente) =>
          (novo.id && existente.id && novo.id === existente.id) ||
          (novo.idLocal && existente.idLocal && novo.idLocal === existente.idLocal)
        )
      );
      setMamiferos((prev) => [...prev, ...novos]);
    }
  };

  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleRefresh = () => {
    fetchMamiferos();
    handleScrollToEnd();
  };

  const handleNovoMamifero = () => {
    novoMamifero(navigation.navigate, mamifero[0]?.entrevistado?.id);
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
