import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { getDependencias } from "../../../realm/services/dependenciaService";
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { theme } from "../../../shared/themes/theme";
import { DependenciaType } from "../../../shared/types/DependenciasType";
import { UseCadastrarRegistro } from "../hooks/useInputServicoComunicacao";
import { Container, Row, Title } from "../styles/depndencia.style";
import DropdownDependencias from "../ui-components/dropdownDependencias";
import RenderItem from "../ui-components/listaDeDependencias";
import NumericProgressBar from "../ui-components/numericProgressBar";

export interface BenfeitoriaParam {
    benfeitoria: number;
}


export const Dependencias = ()=>{
  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const [escolha, setEscolha] = useState<string>('');
  const [progress, setProgress] = useState(1);
  const [dependencias, setDepedencias] = useState<DependenciaType[]>();
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(()=>{

    const dependenciasBanco = getDependencias(params.benfeitoria)
    console.log(1)
    if(dependenciasBanco){
      console.log(2)
        setDepedencias(dependenciasBanco);
    }

  }, [updateKey]);

 
  const handleDropdownChange = (value: string) => {
    setEscolha(value);
  };

  const handleValueChange = (value: number) => {
    setProgress(Math.round(value));
  };
 
  const handleCadstrarDependencia= async ()=>{
    try{
    await UseCadastrarRegistro(progress, escolha, params.benfeitoria)
    setUpdateKey(prevKey => prevKey + 1);
    console.log(updateKey)
    }catch (error){
      console.error(error)

    }
  }

  return (
        <Container>
            <Title>Informe as Dependencias da Benfeitoria</Title>
            <Row>
                <DropdownDependencias onValueChange={handleDropdownChange}/>
                
            </Row>
           
            <Row>
            {escolha && (
            <NumericProgressBar value={progress} maxValue={10} onValueChange={handleValueChange} />
            )}</Row>
            <Row>

            <Row>
                 <TouchableOpacity onPress={() =>handleCadstrarDependencia()}>
                          <Text type={textTypes.BUTTON_BOLD} color={theme.colors.blueTheme.blue1}>Cadastrar</Text>
                 </TouchableOpacity>
            </Row>
            <Title>Itens Cadastrados</Title>
           
            <FlatList
            data={dependencias}
            extraData={dependencias} // ou extraData={dependencias}
            renderItem={({ item }) => <RenderItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            />

            </Row>

        </Container>
    )
}