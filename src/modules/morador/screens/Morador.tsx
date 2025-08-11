import { NavigationProp, ParamListBase, RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getMoradores } from '../../../realm/services/moradorService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { MoradorType } from '../../../shared/types/MoradorType';
import { MoradorDetailContainer } from '../styles/morador.style';
import RenderItemMorador from '../ui-components/listaMoradores';
import { useMoradores } from '../../benfeitoriaDetails/hooks/useMorador';



export interface BenfeitoriaParams {
  benfeitoria: BenfeitoriaType;
}

export const novaAve = (navigate: NavigationProp<ParamListBase>['navigate'], benfeitoria: BenfeitoriaType) => {
  navigate('NovoMorador', { benfeitoria });
}

const Morador = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, BenfeitoriaParams>, 'Benfeitoria'>>();
  const { benfeitoria } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [moradors, setMorador] = useState<MoradorType[]>([]);
   const foccus =useIsFocused();
  const {moradores} = useMoradores(benfeitoria.id, foccus );
 
  
  useEffect(()=>{
    if (benfeitoria) {
      const moradoresRealm = getMoradores(benfeitoria.id);
      setMorador(moradoresRealm);
    }
  }, [benfeitoria])
  
  const fetchMorador = useCallback(async () => {
        setIsLoading(true);
        if (benfeitoria.id) {
          const moradoresRealm = getMoradores(benfeitoria.id);
          setMorador(moradoresRealm);
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
  };



  const handleNovoMorador = () => {
    console.log(benfeitoria)
    novaAve(navigation.navigate, benfeitoria);
  };

  return (
    <MoradorDetailContainer>
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
          LISTA DE MORADORES DA BENFEITORIA
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

       
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovoMorador}>
          <Icon size={20} name='plus' color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Morador
          </Text>
        </TouchableOpacity>
      </View>

    
        <FlatList
          ref={flatListRef}
          data={moradors}
          extraData={moradors} 
          renderItem={({ item }) => <RenderItemMorador item={item} />}
          keyExtractor={(item) => item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id'}
        />
      
    </MoradorDetailContainer>
  );
}

export default Morador;
