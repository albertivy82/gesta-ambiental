import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { MoradorType } from "../../../shared/types/MoradorType";



export const detalharMorador = (navigate: NavigationProp<ParamListBase>['navigate'], morador: MoradorType)=>{
    navigate('MoradorDetails', {morador})
  }
  



const RenderItemMorador = ({ item }: { item: MoradorType}) => {
const navigation = useNavigation<NavigationProp<ParamListBase>>();

    const  handleGoToMoradorDetail =  (morador: MoradorType) =>{
      detalharMorador(navigation.navigate, morador );
     
   }


    return (
      <TouchableOpacity onPress={() => handleGoToMoradorDetail(item)}>
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
                Perfil: {item.perfil}
              </Text>
              
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               
                idade: {item.dataNascimento}
               
              </Text>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               Sexo: {item.sexo}
              </Text>
              
        </View>
      </TouchableOpacity>
    );
  };
  
  export default RenderItemMorador;