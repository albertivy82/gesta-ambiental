import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { ServicoComunicacaoDetailContainer } from '../styles/servicoComunicacao.style';
import { getServicosComunicacao } from '../../../realm/services/servicosComunicacaoService';
import { ServicosComunicacaoType } from '../../../shared/types/ComunicacaoType';
import RenderItemServicoComunicacao from '../ui-components/listaServicoComunicacao';

export interface ServicosComunicacaoParams {
  servicoComunicacao: ServicosComunicacaoType;
}

export const novoServicoComunicacao = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoriaId: number) => {
  navigate('NovoImovel', { benfeitoriaId });
}

const ServicosComunicacao = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, ServicosComunicacaoParams>, 'Imovel'>>();
  const { servicoComunicacao } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const [servicosComunicacao, setServicosComunicacao] = useState<ServicosComunicacaoType[]>([]);

  // Carrega a lista inicial de serviços de comunicação
  const fetchServicosComunicacao = async () => {
    if (servicoComunicacao.benfeitoria.id) {
      const servicosRealm = getServicosComunicacao(servicoComunicacao.benfeitoria.id);
      setServicosComunicacao(servicosRealm);
    }
  };

  useEffect(() => {
    fetchServicosComunicacao();
  }, [fetchServicosComunicacao]);

  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Atualiza a lista de serviços de comunicação
  const handleRefresh = () => {
    fetchServicosComunicacao();
    handleScrollToEnd();
  };

  const handleNovoServicoComunicacao = () => {
    novoServicoComunicacao(navigation.navigate, servicoComunicacao.benfeitoria.id);
  };

  return (
    <ServicoComunicacaoDetailContainer>
      <View style={{  
        alignItems: 'center', 
        flexDirection: 'row',
        borderBottomWidth: 3, 
        borderColor: theme.colors.grayTheme.gray100, 
        marginBottom: 10, 
        backgroundColor: '#505050' 
      }}>
        <Icon size={30} name='stack' color='#fefeff'/>
        <Text 
          type={textTypes.TITLE_BOLD} 
          color={theme.colors.whiteTheme.white}
          margin="0px 0px 0px 30px"
        >
          SERVIÇOS DE COMUNICAÇÃO
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
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoServicoComunicacao}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Serviço
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={servicosComunicacao}
        extraData={servicosComunicacao} 
        renderItem={({ item }) => <RenderItemServicoComunicacao item={item} />}
        keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
      />
      
    </ServicoComunicacaoDetailContainer>
  );
}

export default ServicosComunicacao;
