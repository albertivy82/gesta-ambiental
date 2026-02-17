import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { getBenfeitoria } from "../../../realm/services/benfeitoriaService";
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { AtividadeProdutivaType } from "../../../shared/types/AtividadeProdutiva";

const RenderItemAtividade = ({ item }: { item: AtividadeProdutivaType }) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [mostrarModalDelete, setMostrarModalDelete] = useState(false);

  const id = typeof item.benfeitoria === 'number'
    ? item.benfeitoria
    : Number(item.benfeitoria);
    
    const benfeitoria = getBenfeitoria(id)
    
  
  
      const handleAcaoAtividadeProdutiva = (atividadeProdutiva: AtividadeProdutivaType) => {
     
      Alert.alert(
        'Ação sobre registro sobre a Atividade Produtiva',
        `O que você deseja fazer com este registro"?`,
        [
          {
            text: 'Editar',
            onPress: () => {
              navigation.navigate('NovaAtividade', { atividadeProdutiva, benfeitoria }); // reuso da tela para edição
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
    <TouchableOpacity onPress={() => handleAcaoAtividadeProdutiva(item)}>
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
          Atividade: {item.atividade || 'Não informado'}
        </Text>

        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Pessoas envolvidas: {item.pessoasEnvolvidas}
        </Text>

        <Text
          type={textTypes.BUTTON_REGULAR}
          color={item.sincronizado ? "#000000" : theme.colors.redTheme.red}
        >
          Faturamento/mês: R$ {item.faturamentoAtividadeMesTotal.toFixed(2)}
        </Text>

        {mostrarModalDelete && (
                  
                  <DeleteConfirmation
                     id={item.id}
                     idLocal={item.idLocal}
                     deleteEndpoint="atividade-produtiva"
                     onDeleteSuccess={() => {
                     setMostrarModalDelete(false);}}
                  />
                  )}  

      </View>
    </TouchableOpacity>
  );
};

export default RenderItemAtividade;
