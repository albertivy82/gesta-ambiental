import { useMemo } from 'react';
import { TextProps as TextPropsNative } from 'react-native/types';

import { ContainerText } from './text.style';
import { textTypes } from './textTypes';

interface TextProps extends TextPropsNative {
  color?: string;
  margin?: string;
  type?: string;
}

const Text = ({ margin, color, type, ...props }: TextProps) => {
  const fontSize = useMemo(() => {
    switch (type) {
      case textTypes.TITLE_BOLD:
      case textTypes.TITLE_LIGHT:
      case textTypes.TITLE_REGULAR:
      case textTypes.TITLE_SEMI_BOLD:
        return '24px';
      case textTypes.SUB_TITLE_BOLD:
      case textTypes.SUB_TITLE_LIGHT:
      case textTypes.SUB_TITLE_REGULAR:
      case textTypes.SUB_TITLE_SEMI_BOLD:
        return '20px';
      case textTypes.BUTTON_BOLD:
      case textTypes.BUTTON_LIGHT:
      case textTypes.BUTTON_REGULAR:
      case textTypes.BUTTON_SEMI_BOLD:
        return '18px';
      case textTypes.PARAGRAPH_SMALL_BOLD:
      case textTypes.PARAGRAPH_SMALL_LIGHT:
      case textTypes.PARAGRAPH_SMALL_REGULAR:
      case textTypes.PARAGRAPH_SMALL_SEMI_BOLD:
        return '10px';
      case textTypes.PARAGRAPH_BOLD:
      case textTypes.PARAGRAPH_LIGHT:
      case textTypes.PARAGRAPH_REGULAR:
      case textTypes.PARAGRAPH_SEMI_BOLD:
      default:
        return '14px';
    }
  }, [type]);

  const fontFamily = useMemo(() => {
    switch (type) {
      case textTypes.TITLE_BOLD:
      case textTypes.BUTTON_BOLD:
      case textTypes.SUB_TITLE_BOLD:
      case textTypes.PARAGRAPH_SMALL_BOLD:
      case textTypes.PARAGRAPH_BOLD:
        return 'RobotoMono-Bold';
      case textTypes.BUTTON_LIGHT:
      case textTypes.TITLE_LIGHT:
      case textTypes.SUB_TITLE_LIGHT:
      case textTypes.PARAGRAPH_SMALL_LIGHT:
      case textTypes.PARAGRAPH_LIGHT:
        return 'RobotoMono-Light';
      case textTypes.BUTTON_SEMI_BOLD:
      case textTypes.TITLE_SEMI_BOLD:
      case textTypes.SUB_TITLE_SEMI_BOLD:
      case textTypes.PARAGRAPH_SMALL_SEMI_BOLD:
      case textTypes.PARAGRAPH_SEMI_BOLD:
        return 'RobotoMono-SemiBold';
      case textTypes.BUTTON_REGULAR:
      case textTypes.TITLE_REGULAR:
      case textTypes.SUB_TITLE_REGULAR:
      case textTypes.PARAGRAPH_SMALL_REGULAR:
      case textTypes.PARAGRAPH_REGULAR:
      default:
        return 'RobotoMono-Regular';
    }
  }, [type]);

  return (
    <ContainerText
      customMargin={margin}
      fontFamily={fontFamily}
      fontSize={fontSize}
      color={color}
      {...props}
    />
  );
};

export default Text;