import {useRoute, RouteProp} from '@react-navigation/native'
import Text from "../../../shared/components/text/Text";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';

export interface LocalidadeParam{
    localidade: LocalidadeType;
}

const InfLocalidade = () =>{
   const {params} = useRoute<RouteProp<Record<string, LocalidadeParam>>>();
   const {localidade} = params;
   
   return(

    <Text type={textTypes.TITLE_REGULAR} color={theme.colors.blueTheme.blue}>
        
        {localidade.nome},
        {localidade.municipio}
     
    </Text>
    
    
    )
};

export default InfLocalidade;