import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Alert, TouchableOpacity, View } from "react-native";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { ParticipacaoInstituicaoType } from "../../../shared/types/ParticipacaoInstituicaoType";
import { useState } from "react";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";
import { getMorador } from "../../../realm/services/moradorService";



const RenderItemParticipacaoInstituicao = ({ item }: { item: ParticipacaoInstituicaoType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);
 
   const id = typeof item.morador === 'number'
   ? item.morador
   : Number(item.morador);
   
   const morador = getMorador(id)
  
    const handleAcaoParticipacaoInstituicao = (participacaoInstituicao: ParticipacaoInstituicaoType) => {
     
      Alert.alert(
        'Ação sobre a Instituição vinculada',
        `O que você deseja fazer com o registro?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovaParticipacaoInstituicao', { participacaoInstituicao, morador }); // reuso da tela para edição
            },
          },
          {
            text: 'Apagar',
            onPress: () => {
              setMostrarModalDelete(true);
            },
            style: 'destructive',
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    };

  return (
    <TouchableOpacity onPress={() => handleAcaoParticipacaoInstituicao(item)}>
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
        <Text type={textTypes.BUTTON_REGULAR} color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}>
          Situação: {item.sincronizado ? 'Sincronizado' : 'Não Sincronizado'}
        </Text>
        <Text type={textTypes.BUTTON_REGULAR} color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}>Instituição: {item.instituicao}</Text>
        <Text type={textTypes.BUTTON_REGULAR} color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}>Tipo de registro: {item.tipoDeRegistro}</Text>
        <Text type={textTypes.BUTTON_REGULAR} color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}>Número de registro: {item.registro}</Text>
       
        {mostrarModalDelete && (
                  
        <DeleteConfirmation
           id={item.id}
           idLocal={item.idLocal}
           deleteEndpoint="vegetacao"
           onDeleteSuccess={() => {
           setMostrarModalDelete(false);}}
        />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RenderItemParticipacaoInstituicao;
