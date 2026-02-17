import { NavigationProp, ParamListBase, RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { getBenfeitorias } from '../../../realm/services/benfeitoriaService';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { BenfeitoriaType } from '../../../shared/types/BenfeitoriaType';
import { imovelBody } from '../../../shared/types/imovelType';
import { BenfeitoriaContainer } from '../styles/benfeitoria.style';
import RenderItem from '../ui-components/listaBenfeitorias';

export interface benfeitoriasParam {
   imovel: imovelBody; 
}


const Benfeitorias = ()=>{
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<Record<string, benfeitoriasParam>, 'Imovel'>>();
  const flatListRef = useRef<FlatList>(null);
   const foccus =useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const { imovel } = route.params;
  const [benfeitoria, setBenfeitoria] = useState<BenfeitoriaType[]>()
  
 

useEffect(() => {
    setIsLoading(true);
  
          if (imovel?.id) {
            const benfeitoriassRealm = getBenfeitorias(imovel.id);
            setBenfeitoria(benfeitoriassRealm);
          }
      setIsLoading(false);
  }, [imovel?.id, foccus]);


  const handleRefresh = () => {
         setIsLoading(true);
            if (imovel.id) {
                const benfeitoriassRealm = getBenfeitorias(imovel.id);
                  setBenfeitoria(benfeitoriassRealm);
            }
        setIsLoading(false);
        handleScrollToEnd();
   };

  // Rola até o final da lista
  const handleScrollToEnd = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };


 
const handleNovaBenfeitoria = () => {
  navigation.navigate('NovaBenfeitoria', { imovel});
};


return(
  <BenfeitoriaContainer>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomWidth: 3,
          borderColor: theme.colors.grayTheme.gray100,
          marginBottom: 10,
          backgroundColor: '#505050',
        }}
      >
        <Icon size={30} name="stack" color="#fefeff" />
        <Text type={textTypes.TITLE_BOLD} color={theme.colors.whiteTheme.white} margin="0px 0px 0px 30px">
          LISTA DE BENFEITORIAS DO IMÓVEL
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 1,
          borderBottomWidth: 3,
          borderColor: theme.colors.grayTheme.gray100,
          backgroundColor: '#ff4500',
        }}
      >
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleScrollToEnd}>
          <Icon size={20} name="point-down" color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Fim da Página
          </Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleRefresh} disabled={isLoading}>
          <Icon size={20} name="spinner11" color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white}>Atualizar</Text>
        </TouchableOpacity>

        <View style={{ width: 1, backgroundColor: theme.colors.grayTheme.gray80 }} />

        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={handleNovaBenfeitoria}>
          <Icon size={20} name="plus" color={theme.colors.whiteTheme.white} />
          <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.whiteTheme.white} margin="0px 0 0 0">
            Add Benfeitoria do Imóvel
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator
        animating={true}
        size={40}      
        color="#ff4500"
        style={{ marginTop: 5 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={benfeitoria}
          extraData={benfeitoria}
          renderItem={({ item }) => <RenderItem item={item} />}
          keyExtractor={(item) => (item.id ? item.id.toString() : item.idLocal ? item.idLocal : 'Sem Id')}
        />
      )}
           </BenfeitoriaContainer>
    )

}

export default Benfeitorias;