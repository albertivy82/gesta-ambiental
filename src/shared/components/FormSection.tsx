import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { theme } from '../themes/theme';
import { textTypes } from './text/textTypes';
import Text from './text/Text';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
  collapsible?: boolean;
  summary?: React.ReactNode;
  helperText?: string;
}

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
  initiallyOpen = false,
  collapsible = true,
  summary,
  helperText = 'Toque para visualizar',
}) => {
  const [open, setOpen] = useState(initiallyOpen);

  const toggleSection = () => {
    if (!collapsible) return;

    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setOpen((current) => !current);
  };

  return (
    <View
      style={{
        marginVertical: 10,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#dcdcdc',
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleSection}
        style={{
          backgroundColor: theme.colors.greenTheme.green,
          paddingHorizontal: 15,
          paddingVertical: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            color={theme.colors.whiteTheme.white}
            type={textTypes.SUB_TITLE_BOLD}
          >
            {title}
          </Text>

          {collapsible && (
            <Text
              type={textTypes.BUTTON_REGULAR}
              color="#dff5df"
              style={{
                fontSize: 11,
                marginTop: 2,
              }}
            >
              {open ? 'Toque para recolher' : helperText}
            </Text>
          )}
        </View>

        {collapsible && (
          <Text
            color={theme.colors.whiteTheme.white}
            type={textTypes.SUB_TITLE_BOLD}
          >
            {open ? '−' : '+'}
          </Text>
        )}
      </TouchableOpacity>

      {!open && summary && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleSection}
          disabled={!collapsible}
          style={{
            padding: 12,
            backgroundColor: '#f8f8f8',
          }}
        >
          {summary}
        </TouchableOpacity>
      )}

      {open && (
        <View
          style={{
            paddingHorizontal: 8,
            paddingBottom: 10,
            backgroundColor: '#ffffff',
          }}
        >
          {children}
        </View>
      )}
    </View>
  );
};

export default FormSection;