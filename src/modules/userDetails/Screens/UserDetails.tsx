import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import {useRoute, RouteProp} from '@react-navigation/native'
import { Button } from 'react-native';
import { UserContainer } from "../styles/Userdetail.style";
import { UserBody } from '../../../shared/types/userBody';
import { View } from 'react-native';
import { textTypes } from '../../../shared/components/text/textTypes';
import { theme } from '../../../shared/themes/theme';
import Text from '../../../shared/components/text/Text';
import { connectionAPIDelete } from "../../../shared/functions/connection/connectionAPI";


export const GoToUserEdit= (navigate: NavigationProp<ParamListBase>['navigate'], user: UserBody) =>{
    navigate('User', {user});
}


export const GoToProfileUser= (navigate: NavigationProp<ParamListBase>['navigate'], user: UserBody) =>{
    navigate('ProfileUser', {user});
}



const DeleteUser = async (id:string)=>{
    await connectionAPIDelete(`http://192.168.100.28:8080/usuario/${id}`);
}




export interface UserParam{
    user: UserBody;
}



const UserDetails = ()=>{
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const {params} = useRoute<RouteProp<Record<string, UserParam>>>();
    const {user} = params;

    const handleEditUser =() => {
        GoToUserEdit(navigation.navigate, user);
    };

    const handleDeleteUser =() => {
        DeleteUser(user.id);
    };

    const handleProfile =() => {
        GoToProfileUser(navigation.navigate, user);
    };

    const renderField = (label: string, value: string | null)=>{
        return (
        <View style={{ marginBottom: 10 }}>
                <Text type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                    {label}:{value || 'informação não cadastrada'}
        </Text>
        </View>)
    }

    const renderGrupos = (grupos: String[]) =>{
        if (grupos && grupos.length >0){
            return(
                <View style={{marginBottom: 10}}>
                        {grupos.map((grupo, index) =>(
                            <Text key={index} type={textTypes.BUTTON_REGULAR} color={theme.colors.blueTheme.blue1}>
                                Perfil: {grupo}
                            </Text>
                        ))}
                </View>
            );    
        }else{
            return null;
        }
    }

      return(

       <UserContainer>

           {renderField('Nome', user.nome)}
           {renderField('Matrícula', user.matricula)}
           {renderField('CPF', user.cpf)}
           {renderField('E-mail', user.email)}
           {renderGrupos(user.grupo)}
           
           
           <Button
             title="Editar usuário"
             onPress={handleEditUser}
            />

            <Button
             title="excluir usuário"
             onPress={handleDeleteUser}
            />

            <Button
             title="Editar Perfil"
             onPress={handleProfile}
            />
        </UserContainer>
    );

};

export default UserDetails;