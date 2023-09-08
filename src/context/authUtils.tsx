import { Button, TouchableOpacity } from 'react-native';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { removeAuthData } from './authStore';
import { removeToken } from './tokenStore';
import React from 'react';
import { theme } from '../shared/themes/theme';
import Text from '../shared/components/text/Text';
import { Icon } from '../shared/components/icon/Icon';

interface TransparentRedButtonProps {
  onPress: () => void; // Defina o tipo da propriedade onPress
  title: string;
}

const TransparentRedButton: React.FC<TransparentRedButtonProps> = ({ onPress, title }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: theme.colors.redTheme.red,
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
    }}
  >
    <Text style={{ color: theme.colors.redTheme.red }}>{title}</Text>
  </TouchableOpacity>
);




const LogoutButton: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleLogout = async () => {
    await removeAuthData();
    await removeToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Splash' }],
    });
  };

  return (
    <TransparentRedButton
      title="SAIR"
      onPress={handleLogout}
    />
    
  );
};

export default LogoutButton;





