import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Text from '../shared/components/text/Text';
import { theme } from '../shared/themes/theme';
import { removeAuthData } from './authStore';
import { removeRefreshToken } from './refreshTokenStore';
import { removeToken } from './tokenStore';
import { removeUser } from './userStore';

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
    await removeRefreshToken();
    await removeUser();
    
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





