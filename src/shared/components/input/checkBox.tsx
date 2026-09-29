import React, { useEffect, useState } from 'react'; 
import { View } from 'react-native';
import Text from '../text/Text';
import CheckBox from '@react-native-community/checkbox';
import { theme } from '../../themes/theme';
import { textTypes } from '../text/textTypes';
import { DisplayFlexColumn } from '../globalStyles/globalView.style';

interface CheckboxSelectorProps {
  options: string[];                 // Lista de opções para exibir
  selectedValues?: string[];         // Valores inicialmente selecionados
  label?: string;                    // Rótulo opcional do componente
  onSave: (selectedValues: string[]) => void; // Callback para salvar os valores
  exclusiveOptions?: string[];       // 👈 opções que bloqueiam as demais
}

const CheckboxSelector: React.FC<CheckboxSelectorProps> = ({
  options,
  selectedValues = [],
  label = 'Selecione:',
  onSave,
  exclusiveOptions = [],
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selectedValues);

  // garante que, se o pai atualizar selectedValues, o componente acompanhe
  useEffect(() => {
    setSelectedOptions(selectedValues);
  }, [selectedValues]);

  const hasExclusiveSelected = selectedOptions.some((opt) =>
    exclusiveOptions.includes(opt)
  );
  const hasNonExclusiveSelected = selectedOptions.some(
    (opt) => !exclusiveOptions.includes(opt)
  );

  const toggleOption = (option: string) => {
    const isExclusive = exclusiveOptions.includes(option);

    // 🔒 Se já existe exclusiva selecionada e o usuário clicou em NÃO exclusiva → ignora
    if (!isExclusive && hasExclusiveSelected) {
      return;
    }

    // 🔒 Se já existem não-exclusivas selecionadas e o usuário clicou na exclusiva:
    // limpa tudo e deixa só a exclusiva
    if (isExclusive && hasNonExclusiveSelected) {
      const updated = [option];
      setSelectedOptions(updated);
      onSave(updated);
      return;
    }

    // Comportamento normal de toggle
    const alreadySelected = selectedOptions.includes(option);
    const updated = alreadySelected
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updated);
    onSave(updated);
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
              style={{ textAlign: "justify", flexWrap: "wrap" }}
            >
              {label}
            </Text>
          </View>
        )}
        {options.map((option) => {
          const isExclusive = exclusiveOptions.includes(option);

          // regra visual de bloqueio:
          // - se exclusiva foi marcada → bloqueia todas não-exclusivas
          // - se alguma não-exclusiva foi marcada → bloqueia as exclusivas
          const disabled =
            (hasExclusiveSelected && !isExclusive) ||
            (hasNonExclusiveSelected && isExclusive) ||
            (
              hasExclusiveSelected &&
              isExclusive &&
              !selectedOptions.includes(option)
            );

          return (
            <View 
              key={option} 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                flexWrap: 'wrap',
                width: '100%',
                paddingVertical: 4,
                opacity: disabled ? 0.5 : 1, // 🔒 feedback visual
              }}
            >
              <CheckBox
                value={selectedOptions.includes(option)}
                onValueChange={() => !disabled && toggleOption(option)} // 🔒 trava clique se disabled
                disabled={disabled}
              />
              <Text
                margin="0px 0px 4px 8px"
                color={theme.colors.mainTheme.black}
                type={textTypes.SUB_TITLE_REGULAR}
                style={{
                  flexShrink: 1,
                  flexWrap: 'wrap',
                  width: '85%',
                }}
              >
                {option.replace(/_/g, ' ')}
              </Text>
            </View>
          );
        })}
      </View>
    </DisplayFlexColumn>
  );
};

export default CheckboxSelector;
