import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import Input from '../../../shared/components/input/input';
import Text from "../../../shared/components/text/Text";
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { CheckboxContainer, ConsumoContainer } from '../styles/consumo.styles';


const Consumo = () =>{
  const [localDeCompras, setLocalDeCompras] = useState('');
  const [detalheLocal, setDetalheLocal] = useState('');

    type Selections = {
        [key: string]: boolean;
      };
    
    const [selections, setSelections] = useState<Selections>({
        PEIXE: false,
        AVES: false,
        CARNES: false,
        VEJETAIS: false,
        MARISCOS: false,
        VARIADO: false,
      });;
    
    const handleSelection = (option:string) => {
        setSelections(prevSelections => ({
          ...prevSelections,
          [option]: !prevSelections[option]
        }));
      };
     

   return(
     
          <ConsumoContainer>

             <Text type={textTypes.TITLE_REGULAR}
              color={theme.colors.blueTheme.blue1}>
              Quais alimentos são mais consumidos em sua casa?
            </Text>

              {Object.entries(selections).map(([option, isSelected]) => (
                      <CheckboxContainer key={option}>
                          <CheckBox
                              value={isSelected}
                              onValueChange={() => handleSelection(option)}
                          />
                          <Text type={textTypes.BUTTON_REGULAR}
                           color={theme.colors.blueTheme.blue1}>
                                              {`${option}`}
                          </Text>
                      </CheckboxContainer>
                  ))}

              
             <Text type={textTypes.TITLE_REGULAR}
              color={theme.colors.blueTheme.blue1}>
              Onde as compras de sua casa são feitas?
            </Text>


            <Picker
                selectedValue={localDeCompras}
                onValueChange={(itemValue, itemIndex) => setLocalDeCompras(itemValue)}
            >
                <Picker.Item label="Na Própria Localidade" value="Na_Própria_Localidade" />
                <Picker.Item label="Em Outra Localidade" value="Em_Outra_Localidade" />
            </Picker>

            {localDeCompras === 'Em_Outra_Localidade' && (
                <Input
                    placeholder="Quais?"
                    value={detalheLocal}
                    onChangeText={setDetalheLocal}
                />
            )}
        
        
        
        </ConsumoContainer>
);
};
  

export default Consumo;