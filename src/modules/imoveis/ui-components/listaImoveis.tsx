import { TouchableOpacity, View } from "react-native";
import { imovelBody, ImovelComEntrevistado } from "../../../shared/types/imovelType";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";


export const detalharImovel = (navigate: NavigationProp<ParamListBase>['navigate'], item:ImovelComEntrevistado)=>{

  if(!item.entrevistado){
    navigate('NovoEntrevistado', {item})
  }else{
    navigate('ImovelDetail', {item})
  }
}
  
  interface RenderItemImovelProps {
    item: ImovelComEntrevistado;
  }

  


const RenderItemImovel: React.FC<RenderItemImovelProps> = ({ item })=> {
const navigation = useNavigation<NavigationProp<ParamListBase>>();

    const  handleGoToImovelDetail =  (imovel: imovelBody) =>{
        detalharImovel(navigation.navigate, imovel );
     
   }


    return (
      <TouchableOpacity onPress={() => handleGoToImovelDetail(item)}>
         <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
              
              {item.entrevistado ? (
                <Text type={textTypes.BUTTON_BOLD}
                      color={item.sincronizado ? "#000000": theme.colors.redTheme.red}>
                  {item.entrevistado.nome}</Text> // Renderiza o nome do entrevistado, se existir
              ) : (
                <Text type={textTypes.BUTTON_BOLD}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}>Sem entrevistado cadastrado</Text>
                )}


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
                Rua: {item.rua}
              </Text>
              
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               
                Número: {item.numero}
               
              </Text>
              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               Bairro: {item.bairro}
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               Referencial: {item.referencial}
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               Latitude: {item.latitude}
              </Text>

              <Text
                type={textTypes.BUTTON_REGULAR}
                color={item.sincronizado ? "#000000": theme.colors.redTheme.red}
              >
               longitude: {item.longitude}
              </Text>

              
        </View>
      </TouchableOpacity>
    );
  };
  
  export default RenderItemImovel;