import { forwardRef, useState } from "react";
import { NativeSyntheticEvent, TextInput, TextInputChangeEventData, TextInputProps, View } from "react-native";
import { isertMaskInCpf } from "../../functions/cpf";
import { insertMaskInMatricula } from "../../functions/matricula";
import { theme } from "../../themes/theme";
import { DisplayFlexColumn } from "../globalStyles/globalView.style";
import Text from "../text/Text";
import { textTypes } from "../text/textTypes";
import { ContainerInput } from "./input.style";

interface InputProps extends TextInputProps {
    title?: string;
    errorMessage?: string;
    margin?: string;
    type?: 'matricula' | 'cpf' | 'data';
}

const applyDateMask = (value: string) => {
  return value
      .replace(/\D/g, '') // Remove qualquer caractere não numérico
      .replace(/^(\d{2})(\d)/, '$1/$2') // Insere a primeira barra após o dia
      .replace(/(\d{2})(\d{1,4})$/, '$1/$2') // Insere a segunda barra após o mês
      .slice(0, 10); // Limita o comprimento para 10 caracteres
};


const Input = forwardRef<TextInput, InputProps>(
    (
      {
        margin,
        title,
        errorMessage,
        onChange,
        type,
          ...props
      }: InputProps, 
      ref
    ) => {
      const handleOnChange = (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
        if (onChange) {
            event.persist();
            let text = event.nativeEvent.text;
            switch (type) {
                case 'cpf':
                   text = isertMaskInCpf(text); 
                break;
                case 'matricula':
                   text = insertMaskInMatricula(text); 
                break;
                case 'data':
                   text = insertMaskInDate(text); 
                break;
                default:
                   text = event.nativeEvent.text;
                break;
            }
  
          onChange({
            ...event,
            nativeEvent: {
              ...event.nativeEvent,
              text,
            },
          });
        }
      };
  
      return (
        <DisplayFlexColumn customMargin={margin}>
          {title && (
            <Text
              margin="0px 0px 4px 8px"
              color={theme.colors.mainTheme.black}
              type={textTypes.SUB_TITLE_BOLD}
            >
              {title}
            </Text>
          )}
  
          <View>
            <ContainerInput
              {...props}
              isError={!!errorMessage}
              onChange={handleOnChange}
              ref={ref}
             />
          </View>
          {errorMessage && (
            <Text
              margin="0px 0px 0px 8px"
              type={textTypes.PARAGRAPH_SMALL_SEMI_BOLD}
              color={theme.colors.redTheme.red}
            >
              {errorMessage}
            </Text>
          )}
        </DisplayFlexColumn>
      );
    },
);

export default Input;
