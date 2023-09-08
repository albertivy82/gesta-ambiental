import styled from 'styled-components/native';
import { theme } from '../../themes/theme';


interface ContainerInputProps {
  isError?: boolean;
 }

export const ContainerInput = styled.TextInput<ContainerInputProps>`
  width: 100%;
  height: 40px;
  padding: 8px 16px;
  background-color: #bacff1;
  color: ${theme.colors.mainTheme.black};
  border-bottom-width: 4px;


  border-color: ${(props) =>
    props.isError ? theme.colors.redTheme.red : theme.colors.blueTheme.blue};
`;



