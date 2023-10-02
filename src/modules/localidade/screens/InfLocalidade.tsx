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

export interface LocalidadeParam {
  localidade: LocalidadeType;
}

const DeleteUser = async (id: string) => {
  await connectionAPIDelete(`http://192.168.100.28:8080/localidade/${id}`);
};

const InfLocalidade = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { params } = useRoute<RouteProp<Record<string, LocalidadeParam>>>();
  const { localidade } = params;

  console.log(localidade);

  const handleDeleteLocalidade = () => {
    DeleteUser(localidade.id);
  };

  const renderField = (label: string, value: string[] | null) => {
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

      
      <TouchableOpacity>
      <View style={{ padding: 10, borderWidth: 1, borderColor: theme.colors.blueTheme.blue2 }}>
      {renderField('Coordenadas', localidade.coordenadas)}
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
      {renderField('Residencias', localidade.residencia)}
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
      {renderField('Postos', localidade.posto)}
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
      {renderField('Escolas', localidade.escola)}
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
