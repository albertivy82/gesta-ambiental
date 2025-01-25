import React, { useState } from 'react';
import { View } from 'react-native';
import Text from '../text/Text';
import CheckBox from '@react-native-community/checkbox';
import { theme } from '../../themes/theme';
import { textTypes } from '../text/textTypes';
import { DisplayFlexColumn } from '../globalStyles/globalView.style';

interface CheckboxSelectorProps {
    options: string[]; // Lista de opções para exibir
    selectedValues?: string[]; // Valores inicialmente selecionados
    label?: string; // Rótulo opcional do componente
    onSave: (selectedValues: string[]) => void; // Callback para salvar os valores
}

const CheckboxSelector: React.FC<CheckboxSelectorProps> = ({
    options,
    selectedValues = [],
    label = 'Selecione:',
    onSave,
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedValues);

    const toggleOption = (option: string) => {
        const updatedOptions = selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option) // Remove a opção
            : [...selectedOptions, option]; // Adiciona a opção

        setSelectedOptions(updatedOptions);
        onSave(updatedOptions); // Notifica o pai sobre a mudança imediatamente
    };

    return (
         <DisplayFlexColumn customMargin={"15px 10px 30px 5px"}>
        <View>
            {label && (
            <View style={{ backgroundColor: '#808080', padding: 4, borderRadius: 4 }}>
                <Text
                    margin="0px 0px 4px 8px"
                    color={theme.colors.whiteTheme.white}
                    type={textTypes.SUB_TITLE_BOLD}
                >
                    {label}
                </Text>
            </View>
             )}
            {options.map((option) => (
                <View key={option} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                        value={selectedOptions.includes(option)}
                        onValueChange={() => toggleOption(option)}
                    />
                    <Text
                        margin="0px 0px 4px 8px"
                        color={theme.colors.mainTheme.black}
                        type={textTypes.SUB_TITLE_REGULAR}
                        >
                        {option}
                    </Text>
                </View>
            ))}
        </View>
        </DisplayFlexColumn>
    );
};

export default CheckboxSelector;
