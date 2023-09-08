import {useRoute, RouteProp} from '@react-navigation/native'
import { Button } from 'react-native';
import { UserContainer } from "../styles/Userdetail.style";
import { UserBody } from '../../../shared/types/userBody';
import { View } from 'react-native';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import Text from '../../../shared/components/text/Text';

export interface UserParam{
    user: UserBody;
}

const UserDetails = ()=>{
    const {params} = useRoute<RouteProp<Record<string, UserParam>>>();
    const {user} = params;

      return(

       <UserContainer>

            <View style={{ marginBottom: 10 }}>
                        <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                            Nome: {user.nome}
                        </Text>
           </View>

           <View style={{ marginBottom: 10 }}>
                        <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                            Matrícula: {user.matricula}
                        </Text>
           </View>

           <View style={{ marginBottom: 10 }}>
                        <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                            CPF: {user.cpf}
                        </Text>
           </View>

           <View style={{ marginBottom: 10 }}>
                        <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                            E-mail: {user.email}
                        </Text>
           </View>

           <View style={{ marginBottom: 10 }}>
                        <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue}>
                            Perfil: {user.grupos}
                        </Text>
           </View>
          
           <Button
             title="Editar usuário"
            />

            <Button
             title="excluir usuário"
            />

            <Button
             title="Editar Perfil"
            />
        </UserContainer>
    );

};

export default UserDetails;