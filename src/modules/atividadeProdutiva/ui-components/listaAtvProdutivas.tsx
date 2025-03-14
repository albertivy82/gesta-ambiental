import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { AtividadeProdutivaType } from "../../../shared/types/AtividadeProdutiva";




export const detalharAtividade = (navigate: NavigationProp<ParamListBase>['navigate'], ave: AtividadeProdutivaType)=>{
    navigate('AtividadeDetails', {ave})
  }
  



const RenderItemAtividade = ({ item }: { item: AtividadeProdutivaType}) => {
const navigation = useNavigation<NavigationProp<ParamListBase>>();

    const  handleGoToAtividadeDetail =  (ave: AtividadeProdutivaType) =>{
      detalharAtividade(navigation.navigate, ave );
     
   }


    return (
      <TouchableOpacity onPress={() => handleGoToAtividadeDetail(item)}>
         <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
              
             <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
                situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
              </Text>
              
             <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
                Espécie: {item.especie}
              </Text>
              
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               
                Uso para consumo: {item.useCosumo}
               
              </Text>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               Uso para comércio: {item.usoComercio}
              </Text>
              
        </View>
      </TouchableOpacity>
    );
  };
  
  export default RenderItemAtividade;