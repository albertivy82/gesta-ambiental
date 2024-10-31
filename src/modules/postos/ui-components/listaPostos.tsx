import { TouchableOpacity, View } from "react-native";
import { imovelBody } from "../../../shared/types/imovelType";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { PostoType } from "../../../shared/types/postoTypes";



const RenderItemPosto = ({ item }: { item: PostoType}) => {


    const  handleDeletarPosto =  (posto: PostoType) =>{
        //detalharImovel(navigation.navigate, imovel );
     
   }


    return (
      <TouchableOpacity onPress={() => handleDeletarPosto(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
    
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>
    
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Nome: {item.nome}
        </Text>
    
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Ambulatorial: {item.ambulatorial}
        </Text>
    
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Urgência/Emergência: {item.urgenciaEmergencia}
        </Text>
    
        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Médicos por Turno: {item.medicosPorTurno}
        </Text>
    
      </View>
    </TouchableOpacity>
    
    );
  };
  
  export default RenderItemPosto;