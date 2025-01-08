import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getImoveisComEntrevistados } from '../../../realm/services/imovelService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { ImovelComEntrevistado } from '../../../shared/types/imovelType';
import { useEntrevistado } from '../hooks/useEntrevistado';
import { ImovelContainer } from '../styles/Imovel.style';
import RenderItemImovel from '../ui-components/listaImoveis';

export interface ImoveisParam {
  localidadeId: number;
  idsImoveis: number[];
}

export const NovoEntrevistado = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number)=>{
  navigate('NovoEntrevistado', {localidadeId})
}

/*export const novoImovel = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number) => {
  navigate('NovoImovel', { localidadeId });
}*/

const Imoveis = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, ImoveisParam>, 'Imovel'>>();
  const { localidadeId} = route.params;
  const { idsImoveis} = route.params;
  useEntrevistado(idsImoveis);
  const flatListRef = useRef<FlatList>(null);
  const [imovel, setImovel] = useState<ImovelComEntrevistado[]>([]);
  

  // Carrega a lista inicial de imóveis
  const fetchImoveis = useCallback(async () => {
    
    if (localidadeId) {
      const imovelRealmComEntrevistados = getImoveisComEntrevistados(localidadeId);
      setImovel(imovelRealmComEntrevistados);

    }
   
  }, [localidadeId]);

  

  useEffect(() => {
    fetchImoveis();
  }, [fetchImoveis]);

  
  

  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  // Atualiza a lista de imóveis
  const handleRefresh = () => {
    setImovel([]); // Limpa os imóveis antes de carregar novamente
    fetchImoveis(); // Recarrega a lista
  };

  const handleNovoImovel = () => {
   
    NovoEntrevistado(navigation.navigate, localidadeId)
   
  };

  return (
    <ImovelContainer>
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
          LISTA DE IMÓVEIS
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
        {/* Botão "Ir para o Fim" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleScrollToEnd}>
          <Icon size={20} name='point-down' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>
            Fim da Página
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        {/* Botão "Atualizar" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleRefresh}>
          <Icon size={20} name='spinner11' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        {/* Botão "Adicionar Imóvel" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoImovel}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Imóvel
          </Text>
        </TouchableOpacity>
      </View>

      
        <FlatList
          ref={flatListRef}
          data={imovel}
          extraData={imovel} 
          renderItem={({ item }) => <RenderItemImovel item={item} />}
          keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
        />
        </ImovelContainer>
  );
}

export default Imoveis;
