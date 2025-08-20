import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useEffect } from 'react';
import { Button, FlatList, TouchableOpacity, View } from 'react-native';
import Text from "../../../shared/components/text/Text";
import { textTypes } from "../../../shared/components/text/textTypes";
import { connectionAPIGet } from "../../../shared/functions/connection/connectionAPI";
import { UserBody } from "../../../shared/types/userBody";
import { useUserReducer } from "../../../store/reducers/userReducer/useUserReducer";
import { AdmUsersContainer } from "../styles/AdmUser.style";



export const User= (navigate: NavigationProp<ParamListBase>['navigate']) =>{
     navigate('User');
}

export const GoToUserDetail= (navigate: NavigationProp<ParamListBase>['navigate'], user: UserBody) =>{
    navigate('UserDetail', {user});
}


const AdmUsers = ()=>{
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const {user, setUser} = useUserReducer();

    
    const renderItem = ({ item }: { item: UserBody }) => {
        return (
          <TouchableOpacity onPress={() => handleUserDetail(item)}>
             <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginBottom: 10 }}>
                  <Text
                    type={textTypes.BUTTON_REGULAR}
                    color={"#000000"}
                  >
                    Nome: {item.nome}
                   </Text>
                  <Text
                    type={textTypes.BUTTON_REGULAR}
                    color={"#000000"}
                  >
                  matrícula: {item.matricula}
                  </Text>
            </View>
          </TouchableOpacity>
        );
      };


      useEffect(() => {
        const fetchUsers = async () => {
          try {
            const usersData = await connectionAPIGet('http://192.168.100.28:8080/usuario');
            if (typeof usersData === 'object' && usersData !== null) {
              console.log(usersData)
              setUser(usersData as UserBody[]); 
            } else {
              console.error('Dados de usuários inválidos:', usersData);
            }
          } catch (error) {
            console.error('Erro ao obter dados de localidade:', error);
          }
        };
        fetchUsers();
      }, []);

     
    const handlegestUser =() => {
        User(navigation.navigate);
    };

    const handleUserDetail =(user: UserBody) => {
        GoToUserDetail(navigation.navigate, user);
    };

       
    
      return(

       <AdmUsersContainer>
          <View style={{ borderBottomWidth: 3, borderColor: "#000000", marginBottom: 10 }}>
            <Text 
            type={textTypes.PARAGRAPH_BOLD} 
            color={"#000000"}
            margin="0px 0px 0px 60px">
                LISTA DE USUÁRIOS DO SISTEMA
            </Text>
          </View>
        
         <FlatList
          data={user}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          />
        
        <Button
             title="Adicionar Usuário"
              onPress={handlegestUser}
              color={"#ff4500"}
         />
        </AdmUsersContainer>
    );

};

export default AdmUsers;