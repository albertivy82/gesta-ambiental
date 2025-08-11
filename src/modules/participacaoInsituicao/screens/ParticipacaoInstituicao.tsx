import { NavigationProp, ParamListBase, RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getParticipacoesIntitucionais } from '../../../realm/services/ParticipacaoInstituicaoService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { MoradorType } from '../../../shared/types/MoradorType';
import { ParticipacaoInstituicaoType } from '../../../shared/types/ParticipacaoInstituicaoType';
import { useParticipacaoInstituicoes } from '../../morador/hooks/useParticipacaoInstituicao';
import { ParticipacaoInstituicaoDetailContainer } from '../styles/ParticipacaoInstituicao.style';
import RenderItemParticipacaoInstituicao from '../ui-components/listaParticipacaoInstituicao';


export interface ParticipacaoInstituicaoParam {
  morador: MoradorType;
}

export const novaParticipacaoInstituicao = (navigate: NavigationProp<ParamListBase>['navigate'], morador:  MoradorType) => {
  navigate('NovaParticipacaoInstituicao', { morador });
}

const ParticipacaoInstituicao = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, ParticipacaoInstituicaoParam>, 'ParticipacaoInstituicaoLista'>>();
  const { morador } = route.params;
  const foccus =useIsFocused();
  const flatListRef = useRef<FlatList>(null);
  const [participacoes, setParticipacoes] = useState<ParticipacaoInstituicaoType[]>();
 const {participacaoInsituicaoes} = useParticipacaoInstituicoes(morador.id, foccus);
 
  

  useEffect(()=>{
      if (morador) {
        const moradoresRealm = getParticipacoesIntitucionais(morador.id);
        setParticipacoes(moradoresRealm);
      }
    }, [morador])
    
    const fetchMorador = useCallback(async () => {
          
          if (morador.id) {
            const piRealm = getParticipacoesIntitucionais(morador.id);
            setParticipacoes(piRealm);
          }
          
        }, [morador]);
    
    useEffect(() => {
      fetchMorador();
    }, [fetchMorador]);
    
       
    const handleScrollToEnd = () => {
      flatListRef.current?.scrollToEnd({ animated: true });
    };  
    
    const handleRefresh = () => {
      fetchMorador();
      handleScrollToEnd();
    };
  

  const handleNovaParticipacaoInstituicao = () => {
    novaParticipacaoInstituicao(navigation.navigate, morador);
  };

  return (
    <ParticipacaoInstituicaoDetailContainer>
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
          type={textTypes.BUTTON_REGULAR}
          color={theme.colors.whiteTheme.white}
          margin="0px 0px 0px 30px"
        >
          VÍNCULO EM INSTIUIÇÕES 
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

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaParticipacaoInstituicao}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>
            Add Vegetação
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={participacoes}
        extraData={participacoes}
        renderItem={({ item }) => <RenderItemParticipacaoInstituicao item={item} />}
        keyExtractor={(item) => item.id?.toString() ?? item.idLocal ?? 'sem-id'}
      />
    </ParticipacaoInstituicaoDetailContainer>
  );
};

export default ParticipacaoInstituicao;
