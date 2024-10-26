import { styled } from 'styled-components/native';

export const ContainerSplash = styled.View<{ width: number; height: number }>`
  flex: 1;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: #000000;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

export const ImagelogoSplash = styled.Image<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  max-width: 100%;
  max-height: 100%;
`;
