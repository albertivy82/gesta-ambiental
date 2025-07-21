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
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';

export interface BenfeitoriaParams {
  benfeitoria: BenfeitoriaType;
}

export const novoServicoComunicacao = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoriaId: number) => {
  navigate('NovoServicoComunicacao', { benfeitoriaId });
}

const ServicosComunicacao = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, BenfeitoriaParams>, 'Benfeitoria'>>();
  const { benfeitoria } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [servicosComunicacao, setServicosComunicacao] = useState<ServicosComunicacaoType[]>([]);

  useEffect(()=>{
           setIsLoading(true);
             if(benfeitoria){
                const creitoRealm = getServicosComunicacao(benfeitoria.id);
                setServicosComunicacao(creitoRealm);
                console.log(benfeitoria.id, creitoRealm)
              }
             
              setIsLoading(false);
     }, [benfeitoria])
   

    // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Atualiza a lista de serviços de comunicação
  const handleRefresh = () => {
       handleScrollToEnd();
  };

  const handleNovoServicoComunicacao = () => {
    novoServicoComunicacao(navigation.navigate, benfeitoria.id);
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
