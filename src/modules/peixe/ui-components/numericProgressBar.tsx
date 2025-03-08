import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import { MinMaxLabels, MinMaxText, ProgressBarContainer, ValueText } from '../styles/peixe.style';


// Definindo os tipos das props esperadas pelo componente
interface NumericProgressBarProps {
  value: number;
  maxValue: number;
  onValueChange: (value: number) => void; // Especifica que onValueChange é uma função que recebe um número
}

const NumericProgressBar = ({ value, maxValue, onValueChange }: NumericProgressBarProps) => {
  
  
  return (
    
    <ProgressBarContainer>
      <ValueText>Quantidade: {Math.round(value)}</ValueText>
      <Slider
        style={{height: 40}}
        minimumValue={1}
        maximumValue={maxValue}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#0000FF"
        maximumTrackTintColor="#000000"
        step={1}
      />
      <MinMaxLabels>
        <MinMaxText>{1}</MinMaxText>
        <MinMaxText>{maxValue}</MinMaxText>
      </MinMaxLabels>
    </ProgressBarContainer>
  );
};



export default NumericProgressBar;
