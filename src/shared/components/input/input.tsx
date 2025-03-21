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
    type?: 'matricula' | 'cpf';
}


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
             <View style={{ backgroundColor: '#808080', padding: 4, borderRadius: 4 }}>
            <Text
              margin="0px 0px 4px 8px"
              color={theme.colors.whiteTheme.white}
              type={textTypes.SUB_TITLE_BOLD}
              style={{ 
                textAlign: "justify", // Tenta justificar o texto
                flexWrap: "wrap", // Permite quebra de linha
                //width: "100%" // Garante que ocupe toda a largura
              }}
              
            >
              {title}
            </Text>
            </View>
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
