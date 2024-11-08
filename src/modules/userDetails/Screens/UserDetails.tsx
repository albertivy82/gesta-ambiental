import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { View } from 'react-native';
import DeleteConfirmation from "../../../shared/components/input/DeleteComponent";
import EditConfirmation from "../ui-component/UseEditUser";
import Text from '../../../shared/components/text/Text';
import { textTypes } from '../../../shared/components/text/textTypes';
import { UserBody } from '../../../shared/types/userBody';
import { UserContainer } from "../styles/Userdetail.style";


export const GoToUserEdit= (navigate: NavigationProp<ParamListBase>['navigate'], user: UserBody) =>{
    navigate('User', {user});
}

/*
export const GoToProfileUser= (navigate: NavigationProp<ParamListBase>['navigate'], user: UserBody) =>{
    navigate('ProfileUser', {user});
}

*/


export interface UserParam{
    user: UserBody;
}



const UserDetails = ()=>{
    const {params} = useRoute<RouteProp<Record<string, UserParam>>>();
    const {user} = params;

        
  
    const renderField = (label: string, value: string | null)=>{
        return (
        <View style={{ marginBottom: 10 }}>
                <Text type={textTypes.BUTTON_REGULAR} color={"#000000"}>
                    {label}:{value || 'informação não cadastrada'}
        </Text>
        </View>)
    }

    
      return(

       <UserContainer>

           {renderField('Nome', user.nome)}
           {renderField('Matrícula', user.matricula)}
           {renderField('CPF', user.cpf)}
           {renderField('E-mail', user.email)}
           {renderField('Perfil', user.grupo.nome)}          
          
           
           <View style={{ flexDirection: 'row', 
                      justifyContent: 'space-around', 
                      padding: 10,
                      marginTop: 40, 
                      borderWidth: 5, 
                      borderColor: "#808080", 
                      backgroundColor: '#000000'
                    }}>
 
                   
            <EditConfirmation 
            user={user} 
            destino="User" 
            onEditSuccess={() => {
             
            }} 
            />

            <View style={{ width: 1, height: '100%', borderWidth: 2.5,  borderColor: "#808080" }} />
                    
            <DeleteConfirmation 
            id= {user.id} 
            deleteEndpoint="usuario" 
            onDeleteSuccess={() => {
                   
            }} 
            />
            </View>
        </UserContainer>
    );

};

export default UserDetails;
            
           

       