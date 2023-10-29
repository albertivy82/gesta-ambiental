import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./modules/login";
import Home from "./modules/home";
import Splash from "./modules/splash";
import EditUser from "./modules/editUser";
import User from "./modules/User";
import Localidade from "./modules/localidades";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "./shared/components/icon/Icon";
import { theme } from "./shared/themes/theme";
import admUsers from "./modules/admUsers/screens/AdmUsers";
import InfLocalidade from "./modules/localidade/screens/InfLocalidade";
import Text from "./shared/components/text/Text";
import LogoutButton from "./context/authUtils";
import { useUserReducer } from "./store/reducers/userReducer/useUserReducer";
import { getToken } from "./context/tokenStore";
import { getUser } from "./context/userStore";
import { UserBody } from "./shared/types/userBody";
import { useEffect, useState } from 'react';
import { textTypes } from "./shared/components/text/textTypes";
import UserDetails from "./modules/userDetails";
import ProfileUser from "./modules/profileUser";
import Coordenadas from "./modules/coordenadas";
import Imovel from "./modules/imoveis/screens/Imovel";
import ImovelDetails from "./modules/imoveisDetails/screens/imovelDetails";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const TabNavigation = ()=>{
   

    return(
        <Tab.Navigator
        screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
        let iconName: string
            
            switch (route.name) {
              case 'HOME': 
              iconName = 'home';
              break;
              case 'Usuários': 
              iconName = 'users';
              break;
              default:
              iconName = 'profile';
              break;
            }

            return <Icon size={20} name={iconName} color={color}/>;
      },
      tabBarActiveTintColor: theme.colors.blueTheme.blue1,
      tabBarInactiveTintColor: theme.colors.grayTheme.gray100,
      })}
      >
      <Tab.Screen name="HOME" component={Home} />
      <Tab.Screen name="Config." component={EditUser} options={{title:'Senha'}}/>
      <Tab.Screen name="Usuários" component={admUsers} options={{title:'Usuários'}}/>
      </Tab.Navigator>
    );

};


const Navigation =() =>{

    const [userData, setUserData] = useState<UserBody | null>(null);

        useEffect(() => {
            const fetchUserData = async () => {
                const currentUser = await getUser();
                      if (currentUser) {
                        const userDataParsed: UserBody = JSON.parse(currentUser);
                        setUserData(userDataParsed);
                      }
            };
    
        fetchUserData();
      }, []);

    return(
        <NavigationContainer>
        <Stack.Navigator>
         <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false}}/>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false}}/>
          <Stack.Screen name="Home" component={TabNavigation} 
              options={{
                title: '',
                headerTransparent: true, // Deixa o cabeçalho transparente
                headerRight: () => (
                <LogoutButton />
                                 
                ),
                headerTitle:() => (
                  
                   <Text margin="30px 100px 0px 100px"
                   type={textTypes.PARAGRAPH_REGULAR} color={theme.colors.blueTheme.blue1}>
                    USUÁRIO:{userData?.nome}
                    </Text>
                
                                   
                  ),
              }} 
          />
          <Stack.Screen name="EditUser" component={EditUser} options={{title: 'Dados cadastrais'}} />
          <Stack.Screen name="Users" component={admUsers} options={{title: 'Gerenciar Usuários'}} />
          <Stack.Screen name="User" component={User} options={{title: 'Gerenciar Usuários'}} />
          <Stack.Screen name="Localidade" component={Localidade} options={{title: 'Gerenciar Localidades'}} />
          <Stack.Screen name="Localidade_Detalhada" component={InfLocalidade} options={{title: 'Localidade'}} />
          <Stack.Screen name="UserDetail" component={UserDetails} options={{title: 'Usuário'}} />
          <Stack.Screen name="ProfileUser" component={ProfileUser} options={{title: 'Editar Perfil'}} />
          <Stack.Screen name="Coordenadas" component={Coordenadas} options={{title: 'Coordenadas'}} />
          <Stack.Screen name="Imovel" component={Imovel} options={{title: 'Imóveis'}} />
          <Stack.Screen name="ImovelDetail" component={ImovelDetails} options={{title: 'Imóvel'}} />

          
        </Stack.Navigator>
      </NavigationContainer>
    );
};

export default Navigation;