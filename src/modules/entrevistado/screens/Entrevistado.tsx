import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { getImoveis } from '../../../realm/services/imovelService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { imovelBody } from '../../../shared/types/imovelType';
import { EntrevitadoContainer, ImovelContainer } from '../styles/entrevistado.style';
import RenderItemImovel from '../ui-components/listaImoveis';
import { useImoveis } from '../../localidade/hooks/useImoveis';
import { getEntrevistados } from '../../../realm/services/entrevistado';
import { useEntrevistado } from '../../imoveis/hooks/useEntrevistado';
import { EntrevistadoType } from '../../../shared/types/EntrevistadoType';

export interface entrevistadoParam {
  imovelId: number; 
}

/*
export const novoEntrevistado = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number) => {
  navigate('NovoImovel', { localidadeId });
}*/

const Entrevistados = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, entrevistadoParam>, 'Imovel'>>();
  const { imovelId } = route.params;
  //const { contagemEntrevistado } = useEntrevistado(imovelId);
  
  const flatListRef = useRef<FlatList>(null);
  const [entrevistado, setEntrevistado] = useState<EntrevistadoType[]>([]);
  

  // Carrega a lista inicial de imóveis
  const fetchEntrevistado = useCallback(async () => {
    
    if (imovelId) {
      const entrevistadoRealm = getEntrevistados(imovelId);
      setEntrevistado(entrevistadoRealm);
    }
   
  }, [imovelId]);

  useEffect(() => {
    fetchEntrevistado();
  }, [fetchEntrevistado]);

  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };


 /*
  const handleNovoEntrevistado = () => {
    novoEntrevistado(navigation.navigate, imovelId);
  };*/

  return (
    <EntrevitadoContainer>
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
        
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleScrollToEnd}>
          <Icon size={20} name='point-down' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Fim da Página
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

      
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={refreshImoveis} disabled={isLoading}>
          <Icon size={20} name='spinner11' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

       
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoImovel}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Imóvel
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.grayTheme.gray80} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={imovel}
          extraData={imovel} 
          renderItem={({ item }) => <RenderItemImovel item={item} />}
          keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
        />
      )}
    </EntrevitadoContainer>
  );
}

export default Entrevistados;
