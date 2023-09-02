import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Button } from 'react-native';
import { AdmUsersContainer } from "../styles/AdmUser.style";



export const User= (navigate: NavigationProp<ParamListBase>['navigate']) =>{
     navigate('User');
}

const AdmUsers = ()=>{
    const navigation = useNavigation<NavigationProp<ParamListBase>>();

     
    const handlegestUser =() => {
        User(navigation.navigate);
      };
    
    
      return(

       <AdmUsersContainer>
            <Button
             title="Gerenciar Usuários"
              onPress={handlegestUser}
            />

            <Button
             title="Editar usuário"
            />

            <Button
             title="excluir usuário"
            />
        </AdmUsersContainer>
    );

};

export default AdmUsers;