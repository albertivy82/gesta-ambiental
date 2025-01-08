import React, { useState } from 'react';
import { View, Button } from 'react-native';
import Text from '../text/Text';
import CheckBox from '@react-native-community/checkbox';

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
        setSelectedOptions((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option) // Remove a opção
                : [...prev, option] // Adiciona a opção
        );
    };

    const handleSave = () => {
        onSave(selectedOptions); // Retorna os valores selecionados para o pai
    };

    return (
        <View>
            {label && <Text style={{ marginBottom: 10 }}>{label}</Text>}
            {options.map((option) => (
                <View key={option} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                        value={selectedOptions.includes(option)}
                        onValueChange={() => toggleOption(option)}
                    />
                    <Text>{option}</Text>
                </View>
            ))}
            <Button title="Salvar" onPress={handleSave} />
        </View>
    );
};

export default CheckboxSelector;
