import RNPickerSelect from 'react-native-picker-select';
import { DependenciasEnum } from '../../../enums/Dependencias.enum';
import { useState } from 'react';

const DropdownDependencias: React.FC<{onValueChange: (value: string) => void}> = ({ onValueChange }) => {
    const handleValueChange = (value: string) => {
    onValueChange(value);
    
  };

  return (
    <RNPickerSelect
      onValueChange={handleValueChange}
      items={Object.entries(DependenciasEnum).map(([key, value]) => ({
        label: value,
        value: key,
      }))}
      placeholder={{ label: "Selecione um item", value: null }}
    />
  );
};

export default DropdownDependencias;