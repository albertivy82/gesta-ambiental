import { useRoute, RouteProp } from '@react-navigation/native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import Text from '../../../shared/components/text/Text';
import { LocalidadeType } from '../../../shared/types/LocalidadeType';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { Button, View, TouchableOpacity, ScrollView } from 'react-native';
import { LocalidadeContainer } from '../styles/Localidade.style';
import { Icon } from '../../../shared/components/icon/Icon';
import { connectionAPIDelete } from '../../../shared/functions/connection/connectionAPI';
import { coordenadasBody } from '../../../shared/types/coordenadaBody';

export interface LocalidadeParam {
  localidade: LocalidadeType;
}


const DeleteUser = async (id: number) => {
  await connectionAPIDelete(`http://192.168.100.28:8080/localidade/${id}`);
};


//BLOCO COORDENADAS
export const novasCoorenadas = (navigate: NavigationProp<ParamListBase>['navigate'], localidadeId: number) =>{
    
    navigate('Coordenadas', {localidadeId});
}

export const editarCoordenadas = (navigate: NavigationProp<ParamListBase>['navigate'], coordenadas: null) =>{
  
  navigate('Coordenadas', {coordenadas});
}


const InfLocalidade = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, LocalidadeParam>>>();
  const { localidade } = params;

  console.log(localidade);

  const handleDeleteLocalidade = () => {
    DeleteUser(localidade.id);
  };

  //BLOCO COORDENADAS
  const handleCoordenadasInserir =  (localidadeId: number) =>{
    novasCoorenadas(navigation.navigate, localidadeId);
  }
  const handleCoordenadasEditar =  (coordenadas: null) =>{
    editarCoordenadas(navigation.navigate, null);
  }



  const renderField = (label: string, value: string[] | null) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
          {label}: {value && value.length > 0 ? value.join(', ') : 'Informação não cadastrada'}
        </Text>
      </View>
    );
  };

  const renderCoordenada= (label: string, value: string[] | null) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
          {label}: {value && value.length > 0 ? value.join(', ') : 'Informação não cadastrada'}
        </Text>
      </View>
    );
  };





  return (
    <ScrollView style={{ flex: 1 }}>
    <LocalidadeContainer>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
        {renderField('Nome', [localidade.nome])}
        {renderField('Município', [localidade.municipio])}
        {renderField('Esfera', [localidade.esfera])}
      </View>
      <View style={{ padding: 10, marginBottom: 10 }}>
        <Button title="Excluir Localidade" onPress={handleDeleteLocalidade} />
        <Button title="Editar Localidade" onPress={handleDeleteLocalidade} />
      </View>

      
      <TouchableOpacity onPress={() => handleCoordenadasEditar(null)}>
          <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
              {renderCoordenada('Coordenadas', null)}
          </View>
      </TouchableOpacity>
     
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      <TouchableOpacity onPress={() => handleCoordenadasInserir(localidade.id)}>
          <Icon name="plus" size={10} color="blue">
              <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}> 
                  adicionar
              </Text>
          </Icon>
      </TouchableOpacity>
      </View> 


      <TouchableOpacity>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      {renderField('Residencias', null)}
      </View>
      </TouchableOpacity>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      <TouchableOpacity>
      <Icon name="plus" size={10} color="blue">
      <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}> adicionar
      </Text>
      </Icon>
      </TouchableOpacity>
      </View> 


      <TouchableOpacity>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      {renderField('Postos', null)}
      </View>
      </TouchableOpacity>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      <TouchableOpacity>
      <Icon name="plus" size={10} color="blue">
      <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}> adicionar
      </Text>
      </Icon>
      </TouchableOpacity>
      </View> 

      <TouchableOpacity>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      {renderField('Escolas', null)}
      </View>
      </TouchableOpacity>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      <TouchableOpacity>
      <Icon name="plus" size={10} color="blue">
      <Text type={textTypes.PARAGRAPH_LIGHT} color={theme.colors.blueTheme.blue1}> adicionar
      </Text>
      </Icon>
      </TouchableOpacity>
      </View> 
      
    </LocalidadeContainer>
    </ScrollView>
  );
};

export default InfLocalidade;
