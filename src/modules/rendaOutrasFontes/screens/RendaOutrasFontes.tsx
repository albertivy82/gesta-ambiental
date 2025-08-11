import { NavigationProp, ParamListBase, RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getRendaOutrasFontes } from '../../../realm/services/rendaOutrasFontes';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { RendaOutrasFontesType } from '../../../shared/types/rendaOutrasFontesType';
import { RendaOutrasFontesDetailContainer } from '../styles/rendaOutrasFontes.style';
import RenderItemRendaOutrasFontes from '../ui-components/listaRendasOutrasFontes';
import { useRendasOutrasFontes } from '../../benfeitoriaDetails/hooks/useRendaOutrasfontes';


export interface BenfeitoriaParams {
  benfeitoria: BenfeitoriaType;
}

export const novoCredito = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType) => {
  navigate('NovoCredito', { benfeitoria });
}

const RendaOutrasFontes = () => {
 const navigation = useNavigation<NavigationProp<ParamListBase>>();
 const route = useRoute<RouteProp<Record<string, BenfeitoriaParams>, 'Benfeitoria'>>();
 const { benfeitoria } = route.params;
 const foccus =useIsFocused();
 const [isLoading, setIsLoading] = useState(false);
 const flatListRef = useRef<FlatList>(null);
 const [rendasF, setRendasF] = useState<RendaOutrasFontesType[]>([]);
 const {} = useRendasOutrasFontes(benfeitoria.id, foccus);

   
 useEffect(()=>{
  if(benfeitoria){
    const rendasRealm = getRendaOutrasFontes(benfeitoria.id);
    setRendasF(rendasRealm);
   
  }
  }, [benfeitoria])
  
  const fetchMorador = useCallback(async () => {
        setIsLoading(true);
        if (benfeitoria.id) {
          const moradoresRealm = getRendaOutrasFontes(benfeitoria.id);
          setRendasF(moradoresRealm);
        }
        setIsLoading(false);
      }, [benfeitoria]);
  
  useEffect(() => {
    fetchMorador();
  }, [fetchMorador]);
  
     
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };  
  
  const handleRefresh = () => {
    fetchMorador();
    handleScrollToEnd();
  }
  const handleNovoCredito = () => {
    novoCredito(navigation.navigate, benfeitoria);
  };

  return (
    <RendaOutrasFontesDetailContainer>
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
          LISTA DE CRÉDITOS DA BENFEITORIA
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

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoCredito}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Adicionar Crédito
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={rendasF}
        extraData={rendasF} 
        renderItem={({ item }) => <RenderItemRendaOutrasFontes item={item} />}
        keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
      />
      
    </RendaOutrasFontesDetailContainer>
  );
}

export default RendaOutrasFontes;
