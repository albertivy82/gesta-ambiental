import React from 'react';
import { View } from 'react-native';
import Text from './text/Text';


type FormErrorsProps = {
  visible: boolean;
  title?: string;
  errors: { field: string; message: string }[];
};

export const FormErrors: React.FC<FormErrorsProps> = ({
  visible,
  title = 'Há campos a revisar:',
  errors,
}) => {
  if (!visible || !errors || errors.length === 0) return null;

  return (
    <View
      style={{
        backgroundColor: '#ffe6e6',
        padding: 8,
        borderRadius: 6,
        marginTop: 12,
      }}
    >
      <Text style={{ color: '#b30000', fontWeight: '600', marginBottom: 4 }}>
        {title}
      </Text>
      {errors.map((err, index) => (
        <Text key={index} style={{ color: '#b30000' }}>
          • {err.message}
        </Text>
      ))}
    </View>
  );
};
