import { TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { EscolaType } from "../../../shared/types/EscolaType";


const RenderItemEscola = ({ item }: { item: EscolaType}) => {

  const  handleDeletarEscola =  (imovel: EscolaType) =>{
       // detalharImovel(navigation.navigate, imovel );
     
   }


   return (
  <TouchableOpacity onPress={() => handleDeletarEscola(item)}>
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
        Iniciativa: {item.iniciativa}
      </Text>

      <Text
        type={textTypes.BUTTON_REGULAR}
        color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
      >
        Merenda: {item.merenda}
      </Text>

      <Text
        type={textTypes.BUTTON_REGULAR}
        color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
      >
        Transporte: {item.transporte}
      </Text>

      <Text
        type={textTypes.BUTTON_REGULAR}
        color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
      >
        Educação Ambiental: {item.educacaoAmbiental}
      </Text>

    </View>
  </TouchableOpacity>
);
}
  
  export default RenderItemEscola;