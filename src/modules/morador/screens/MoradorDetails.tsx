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
import EditConfirmation from '../ui-components/UseEditMorador';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { useParticipacaoInstituicoes } from '../hooks/useParticipacaoInstituicao';



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
  const {participacaoInsituicaoes} = useParticipacaoInstituicoes(params.morador.id);
  

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
  // {//source={require('../../../assets/images/instituicoes.png')}
   
  return (
    
       <ScrollView style={{ flex: 1 }}>
        <MoradorDetailContainer>
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                {renderField('Perfil', params.morador.perfil)}  
                {renderField('ata de nascimento', params.morador.dataNascimento)}
                {renderField('Sexo', params.morador.sexo)}
                {renderField('Escolaridade', params.morador.escolaridade)}
                {renderField('Estado civil', params.morador.estadoCivil)}
                {renderField('religião', params.morador.religiao)}
                {renderField('Estuda:', params.morador.ondeEstuda)}
                {renderField('Trabalha', params.morador.trabalho)}
                {renderField('Já apresentou as seguintes doenças: ', params.morador.doencas)}
            </View>
                   

            <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      marginTop: 40, 
                      borderWidth: 5, 
                      borderColor: "#808080", 
                      backgroundColor: '#000000'
                    }}>                     
                     <EditConfirmation 
                      morador={params.morador} 
                      destino="NovoMorador" 
                      onEditSuccess={() => {
                       
                      }} 
                      />

                      <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: '#9b9999' }} />
                              
                      <DeleteConfirmation 
                      id={params.morador.id} 
                      idLocal={params.morador.idLocal}
                      deleteEndpoint="morador" 
                      onDeleteSuccess={() => {
                            //volta para infLocalidade
                      }} 
                      />
                
                </View>
               

                    
              
               
              
      
       </MoradorDetailContainer>
    </ScrollView>     
   
   
  );
}

export default MoradorDetails;