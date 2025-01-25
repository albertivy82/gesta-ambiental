import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { EntrevistadoType } from "../../../shared/types/EntrevistadoType";


export const detalharEntrevistado = (navigate: NavigationProp<ParamListBase>['navigate'], entrevistado: EntrevistadoType)=>{
    navigate('EntrevistadoDetails', {entrevistado})
  }
  



const RenderItemImovel = ({ item }: { item: EntrevistadoType}) => {
const navigation = useNavigation<NavigationProp<ParamListBase>>();

    const  handleGoToEntrevistadoDetail =  (entrevistado: EntrevistadoType) =>{
      detalharEntrevistado(navigation.navigate, entrevistado );
     
   }


    return (
      <TouchableOpacity onPress={() => handleGoToEntrevistadoDetail(item)}>
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
                Nome: {item.nome}
              </Text>
              
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               
                Nome popular: {item.apelido}
               
              </Text>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               morador: {item.morador}
              </Text>
              
        </View>
      </TouchableOpacity>
    );
  };
  
  export default RenderItemImovel;