import { styled } from "styled-components/native";

export const ConsumoContainer = styled.View`

    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
    justify-content: center;
    justify-items: center;
    padding: 16px;

`

export const CheckboxContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`;

export const RadioboxContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`;

export const LabelContainer = styled.View`
    background-color: #0077B6; 
    padding: 8px 16px; 
    margin: 8px 0; 
    border-radius: 10px; 
`;

export const AlterarRegistroButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-width: 1px;
  border-color: #708090;
  background-color: #00008B;
  border-radius: 10px;
  margin: 10px;
`;
