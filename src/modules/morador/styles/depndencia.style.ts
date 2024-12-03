import { styled } from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #FFFFFF;
  padding: 16px;
`;

export const Row = styled.View`
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 22px;
  margin-bottom: 20px;
`;

export const Subtitle = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
`;

export const ProgressBarContainer = styled.View`
  width: 100%;
`;

export const ValueText = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
  text-align: center;
`;

export const MinMaxLabels = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const MinMaxText = styled.Text`
  font-size: 16px;
`;