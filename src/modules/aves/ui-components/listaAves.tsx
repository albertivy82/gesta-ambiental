import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { AvesType } from "../../../shared/types/AvesType";



export const detalharAve = (navigate: NavigationProp<ParamListBase>['navigate'], ave: AvesType)=>{
    navigate('AveDetails', {ave})
  }
  



const RenderItemAve = ({ item }: { item: AvesType}) => {
const navigation = useNavigation<NavigationProp<ParamListBase>>();

    const  handleGoToAveDetail =  (ave: AvesType) =>{
      detalharAve(navigation.navigate, ave );
     
   }


    return (
      <TouchableOpacity onPress={() => handleGoToAveDetail(item)}>
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
  
  export default RenderItemAve;