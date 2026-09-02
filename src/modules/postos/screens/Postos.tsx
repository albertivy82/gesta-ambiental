import { NavigationProp, ParamListBase, RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { usePostos } from '../../localidade/hooks/usePostos';
import RenderItemImovel from '../ui-components/listaPostos';
import { GlobalContainer } from '../../../shared/components/globalStyles/GlobalContainer';
import { PostoType } from '../../../shared/types/postoTypes';
import { getPostos } from '../../../realm/services/postoService';


export interface postoParam {
  localidadeId: number;
}

export const novoPosto = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number) => {
  navigate('NovoPosto', { localidadeId });
}

const Postos = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, postoParam>, 'Posto'>>();
  const { localidadeId } = route.params;
  const foccus=useIsFocused();
  const {contagemPostos, loadingPostos } = usePostos(localidadeId, foccus);
  const flatListRef = useRef<FlatList>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postos, setPostos] = useState<PostoType[]>([]);
  
 useEffect(() => {

  if (!foccus || loadingPostos || !localidadeId) {
    return;
  }

  const postosDoRealm = getPostos(localidadeId);
  setPostos(postosDoRealm);

}, [localidadeId, foccus, loadingPostos]);
    
   
    const handleRefresh = () => {
      console.log('localidadeId', localidadeId);
          setIsLoading(true);
        
              if (localidadeId) {
                const postodoRealm = getPostos(localidadeId);
                console.log('postodoRealm', postodoRealm);
                setPostos(postodoRealm);}
          setIsLoading(false);
        
          handleScrollToEnd();
        };
  // Rola até o final da lista
  
  
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  

  const handleNovoImovel = () => {
     novoPosto(navigation.navigate, localidadeId);
  };

  
  return (
    <GlobalContainer>
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
          LISTA DE POSTOS
        </Text>
      </View>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 1,
        borderBottomWidth: 3,
        borderColor: theme.colors.grayTheme.gray100,
        backgroundColor: theme.colors.greenTheme.green
      }}>
        {/* Botão "Ir para o Fim" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleScrollToEnd}>
          <Icon size={20} name='point-down' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Fim da Página
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        {/* Botão "Atualizar" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleRefresh} disabled={loadingPostos}>
          <Icon size={20} name='spinner11' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Atualizar
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        {/* Botão "Adicionar Imóvel" */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoImovel}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Posto
          </Text>
        </TouchableOpacity>
      </View>

      {loadingPostos ? (
        <ActivityIndicator size="large" color={theme.colors.grayTheme.gray80} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={postos}
          extraData={postos} 
          renderItem={({ item }) => <RenderItemImovel item={item} />}
          keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
        />
      )}
    </GlobalContainer>
  );
}

export default Postos;
