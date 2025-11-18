import { NavigationProp, ParamListBase, RouteProp, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Icon } from '../../../shared/components/icon/Icon';
import DeleteConfirmation from '../../../shared/components/input/DeleteComponent';
import { renderField } from '../../../shared/components/input/renderFilds';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { MoradorType } from '../../../shared/types/MoradorType';
import { useParticipacaoInstituicoes } from '../hooks/useParticipacaoInstituicao';
import { MoradorDetailContainer } from '../styles/morador.style';
import EditConfirmation from '../ui-components/UseEditMorador';
import { ActivityIndicator } from 'react-native-paper';



export const handleNavigation = <T,>(
  navigate: NavigationProp<ParamListBase>['navigate'], 
  route: string, 
  morador: MoradorType
) => {
  navigate(route, { morador });
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
  const morador = params.morador;
  const foccus =useIsFocused();
  const {participacaoInsituicaoes, loadingParticipacoes} = useParticipacaoInstituicoes(morador.id, foccus);
  

 const handleDecision = <T,>(
      data: T | T[],
      detailRoute: string,
      newRoute: string
    ) => {
      if (Array.isArray(data) ? data.length > 0 : !!data) {
        handleNavigation(navigation.navigate, detailRoute, morador);
      } else {
         handleNewEntry(navigation.navigate, newRoute, morador);
      }
    };


    if (loadingParticipacoes) {
      return (
        <MoradorDetailContainer
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator
            animating={true}
            size={80}      
            color="#ff4500"
            style={{ marginTop: 20 }}
          />
    
          <Text
            type={textTypes.BUTTON_REGULAR}
            color="#000"
            margin="20px 0 0 0"
          >
            Sincronizando dados...
          </Text>
        </MoradorDetailContainer>
      );
    }
   
  return (
    
       <ScrollView style={{ flex: 1 }}>
        <MoradorDetailContainer>
              <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                {renderField('Perfil', params.morador.perfil)}  
                {renderField('ata de nascimento', params.morador.dataNascimento.toString())}
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
               

                <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.grayTheme.gray100 }}>
                 
                 </View>
                       
                <TouchableOpacity onPress={() => handleDecision(participacaoInsituicaoes, "ParticipacaoInstituicao", "NovaParticipacaoInstituicao")}>
                      <View style={{
                        alignItems: 'stretch',
                        flexDirection: 'row',
                        padding: 10,
                        borderWidth: 2,
                        borderColor: theme.colors.grayTheme.gray100
                      }}>
                        <Icon size={30} name='flag' color='green' />
                        <Text
                          type={textTypes.BUTTON_BOLD}
                          color={participacaoInsituicaoes.length > 0 ? theme.colors.grayTheme.gray80 : theme.colors.blueTheme.blue1}
                          style={{ marginLeft: 10 }}
                        >
                          {participacaoInsituicaoes.length > 0
                            ? `Participação em Instituição: ${participacaoInsituicaoes.length}`
                            : 'Registro de Participação em Instituição: '}
                        </Text>
                      </View>
                </TouchableOpacity>          
              
               
              
      
       </MoradorDetailContainer>
    </ScrollView>     
   
   
  );
}

export default MoradorDetails;