import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SimNao } from "../../../enums/simNao.enum";
import Input from "../../../shared/components/input/input";
import { RenderPicker } from "../../../shared/components/input/renderPicker";
import { BenfeitoriaType } from "../../../shared/types/BenfeitoriaType";
import { RendaOutrasFontesDetailContainer } from "../styles/rendaOutrasFontes.style";
import { useNovaRendaOutrasFontes } from "../hooks/useInputRendasOutrasFontes";

export interface idParam {
  benfeitoria: BenfeitoriaType;
}

export const NovaRendaOutrasFontes = () => {
  const { params } = useRoute<RouteProp<Record<string, idParam>>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [loading, setLoading] = useState(false);
  

  const {  
    novaRendaOutrasFontes,
    disabled
  } = useNovaRendaOutrasFontes(params.benfeitoria);

  
    
  const handleEnviar = async () => {
    setLoading(true);
    try {
      const rendaSalva = true; // await enviarRegistro(); 
      if (rendaSalva) {
        // detalharBenfeitoria(navigation.navigate, benfeitoriaSalva);
      } else {
        Alert.alert("Erro", "Não foi possível salvar a benfeitoria. Tente novamente.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      Alert.alert("Erro ao enviar", "Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#010203' }}>
      <RendaOutrasFontesDetailContainer>
        
       
        <RenderPicker
          label="Essa renda é fixa?"
          selectedValue={novaRendaOutrasFontes.fonte}
          onValueChange={(value) => handleEnumChange('fonte', value)}
          options={[?]}
        />

      

        <View style={{ marginTop: 40 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff4500" /> 
          ) : (
            <Button title="Enviar" onPress={handleEnviar} color="#ff4500" disabled={loading} />
          )}
        </View>

      </RendaOutrasFontesDetailContainer>
    </ScrollView>
  );
};
