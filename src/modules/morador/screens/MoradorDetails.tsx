import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { MoradorType } from '../../../shared/types/MoradorType';
import { renderField } from '../../../shared/components/input/renderFilds';
import { MoradorDetailContainer } from '../styles/morador.style';
import { Icones } from '../../entrevistadoDetails/styles/EntrevistadoDetails.style';



export const handleNavigation = <T,>(
  navigate: NavigationProp<ParamListBase>['navigate'], 
  route: string, 
  data: T | T[]
) => {
  navigate(route, { data });
};

export const handleNewEntry = (
  navigate: NavigationProp<ParamListBase>['navigate'], 
  route: string, 
  morador: MoradorType
) => {
  navigate(route, { morador });
};

export interface MoradorParam {
 morador: MoradorType;
}



const MoradorDetails = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, MoradorParam>>>();
  let ParticipacaoInstituicao: string[];
    

   const handleDecision = <T,>(
      data: T | T[],
      detailRoute: string,
      newRoute: string
    ) => {
      if (Array.isArray(data) ? data.length > 0 : !!data) {
        handleNavigation(navigation.navigate, detailRoute, data);
      } else {
        handleNewEntry(navigation.navigate, newRoute, params.morador);
      }
    };
  
        


  return (
    
       <ScrollView style={{ flex: 1 }}>
        <MoradorDetailContainer>
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                {renderField('Tipo', params.morador.dataNascimento)}
                {renderField('Função', params.morador.idade.toString())}
                {renderField('Tipo do Solo', params.morador.perfil)}
                {renderField('Tipo de construção', params.morador.sexo)}
                {renderField('Origem dos materiais de construção', params.morador.estadoCivil)}
                {renderField('Cobertura', params.morador.escolaridade)}
                {renderField('Esquadrias', params.morador.religiao)}
                {renderField('Alagamentos', params.morador.ondeEstuda)}
                {renderField('Nivel de alagamentos', params.morador.religiao)}
                {renderField('Efluentes', params.morador.doencas)}
            </View>


            <TouchableOpacity  onPress={() => {handleDecision(ParticipacaoInstituicao!, "moradoresDetails", "NovoMorador")}}>
                          
                          {ParticipacaoInstituicao!.length >0? (
     
                           <Text type={textTypes.BUTTON_BOLD} color={theme.colors.whiteTheme.white}>
                           Participação em que participa: {ParticipacaoInstituicao!.length}
                           </Text>
     
                          ):( 
                              <View style={{ alignItems: 'stretch', flexDirection: 'row', 
                                padding: 10,
                                borderWidth: 2, 
                                borderColor: theme.colors.grayTheme.gray100
                              }}>
                              <Icones resizeMode="contain" source={require('../../../assets/images/instituicoes.png')} />
                              <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Instituições +</Text>
                              </View>
                          )}
            </TouchableOpacity>

                        

                   
                    

              <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      
                      borderWidth: 2, 
                      borderColor: theme.colors.grayTheme.gray100 
                    }}>

                    <TouchableOpacity onPress={() =>null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='bin' color='red' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Apagar Morador</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: theme.colors.grayTheme.gray100 }} />


                    <TouchableOpacity onPress={() => null}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon size={40} name='pencil2' color='blue' />
                            <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}>Editar Morador</Text>
                        </View>
                    </TouchableOpacity>
               </View>
               
              
      
       </MoradorDetailContainer>
    </ScrollView>     
   
   
  );
}

export default MoradorDetails;