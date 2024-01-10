import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import { getAlimentos } from '../../../realm/services/alimentacaoService';
import Input from '../../../shared/components/input/input';
import Text from "../../../shared/components/text/Text";
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { sendConsumo } from '../hooks/fetchConsumo';
import { useBaseAlimentos } from '../hooks/useAlimentos';
import { CheckboxContainer, ConsumoContainer, RadioboxContainer } from '../styles/consumo.styles';
import { RadioButton } from 'react-native-paper';

type Selections = {
    [key: string]: { isSelected: boolean; id: number };
};

export interface BenfeitoriaParam {
    benfeitoria: number;
   }

const Consumo = () =>{

  const { params } = useRoute<RouteProp<Record<string, BenfeitoriaParam>>>();
  const [localDeCompras, setLocalDeCompras] = useState('');
  const [detalheLocal, setDetalheLocal] = useState('');
  const {alimentos} = useBaseAlimentos();
    
            const [selections, setSelections] = useState<Selections>({});

            useEffect(() => {
                const listaAlimentos = getAlimentos();
                const newSelections = listaAlimentos.reduce((acc, alimento) => {
                    acc[alimento.alimentacaoPrincipal] = { isSelected: false, id: alimento.id };
                    return acc;
                }, {} as Selections);
              
                setSelections(newSelections);
              }, [alimentos]);




          const handleSelection = (option: string) => {
                  setSelections(prevSelections => {
                   
                    if(option==="NAO_DECLARADO"){
                        return Object.fromEntries(Object.entries(prevSelections).map(([key, value])=>{
                            return [key, {...value, isSelected: key ===  option ? !value.isSelected : false}];
                        }));
                    }

                    const isSpecialOptionSelected = prevSelections["NAO_DECLARADO"]?.isSelected;
                    if (isSpecialOptionSelected) {
                    return {
                      ...prevSelections,
                        [option]: { ...prevSelections[option], isSelected: !prevSelections[option].isSelected },
                        "NAO_DECLARADO": { ...prevSelections["NAO_DECLARADO"], isSelected: false }
                    };
                    }

        
                    return {
                        ...prevSelections,
                        [option]: { ...prevSelections[option], isSelected: !prevSelections[option].isSelected }
                    };


                  })
          };
    
  

      const handleSubmit = () => {
        const selectedItems = Object.entries(selections)
        .filter(([_, value]) => value.isSelected)
        .map(([_, value]) => value.id);
        sendConsumo(selectedItems, localDeCompras, detalheLocal, params.benfeitoria)
    };
     

   return(
     
          <ConsumoContainer>

             <Text type={textTypes.TITLE_REGULAR}
              color={theme.colors.blueTheme.blue1}>
              Quais alimentos são mais consumidos em sua casa?
            </Text>

            {Object.entries(selections).map(([option, { isSelected, id }]) => (
                <CheckboxContainer key={id}>
                    <CheckBox
                        value={isSelected}
                        onValueChange={() => handleSelection(option)}
                    />
                    <Text type={textTypes.BUTTON_REGULAR}
                        color={theme.colors.blueTheme.blue1}>
                        {option}
                    </Text>
                </CheckboxContainer>
           ))}

              
             <Text type={textTypes.TITLE_REGULAR}
              color={theme.colors.blueTheme.blue1}>
              Onde as compras de sua casa são feitas?
            </Text>


            <RadioButton.Group onValueChange={value => setLocalDeCompras(value)} value={localDeCompras}>
             <RadioboxContainer>
                  <RadioButton value="Na_Própria_Localidade" />
                  <Text type={textTypes.BUTTON_REGULAR}
                  color={theme.colors.blueTheme.blue1}>NA PRÓPRIA LOCALIDADE</Text>
             </RadioboxContainer>

             <RadioboxContainer>
                  <RadioButton value="Em_Outra_Localidade" />
                  <Text type={textTypes.BUTTON_REGULAR}
                  color={theme.colors.blueTheme.blue1}>EM OUTRA LOCALIDADE</Text>
             </RadioboxContainer>
             
            </RadioButton.Group>

                {localDeCompras === 'Em_Outra_Localidade' && (
                    <Input
                    placeholder="Quais?"
                    value={detalheLocal}
                    onChangeText={setDetalheLocal}
                    />
                )}


            
        
           <Button title="Submeter" onPress={handleSubmit} />
        
        </ConsumoContainer>
);
};
  

export default Consumo;