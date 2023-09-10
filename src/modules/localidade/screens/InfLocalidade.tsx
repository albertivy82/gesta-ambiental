import {useRoute, RouteProp} from '@react-navigation/native'
import Text from "../../../shared/components/text/Text";
import { LocalidadeType } from "../../../shared/types/LocalidadeType";
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { Button, View } from 'react-native';
import { LocalidadeContainer } from '../styles/Localidade.style';
import { Icon } from '../../../shared/components/icon/Icon';

export interface LocalidadeParam{
    localidade: LocalidadeType;
}

const InfLocalidade = () =>{
   const {params} = useRoute<RouteProp<Record<string, LocalidadeParam>>>();
   const {localidade} = params;

   const renderField = (label: string, value: string | null)=>{

    return(
        <View style={{ marginBottom: 10 }}>
            <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
               {label}: {value || "Informação não cadastrada"}
            </Text>
        </View>
        );
   }
   
   return(
    <LocalidadeContainer>
        <View style={{ padding: 10, marginBottom: 10 }}>
        <Button title="Excluir Localidade"/>
        </View>
        {renderField('Nome', localidade.nome)}
        {renderField('Município', localidade.municipio)}
        {renderField('Esfera', localidade.esfera)}
        {renderField('Coordenadas', localidade.coordenadas)}
        <Icon name='folder-plus' size={20} color='blue'/>
        {renderField('Escolas', localidade.escola)}
        <Icon name='plus' color='blue'/>
        {renderField('Postos de Saude', localidade.posto)}
        <Icon name='plus' color='blue'/>
        {renderField('Imoveis:', localidade.residencia)}
    
    </LocalidadeContainer>
    )
};

export default InfLocalidade;