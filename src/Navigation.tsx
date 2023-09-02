import { NavigationContainer } from "@react-navigation/native";
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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigation = ()=>{


    return(
        <Tab.Navigator
        screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
        let iconName: string
            
            switch (route.name) {
              case 'Home': 
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
      tabBarActiveTintColor: theme.colors.blueTheme.blue,
      tabBarInactiveTintColor: theme.colors.grayTheme.gray100,
      })}
      >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Config." component={EditUser} options={{title:'Alterar Senha'}}/>
      <Tab.Screen name="Usuários" component={admUsers} options={{title:'Usuários'}}/>
      </Tab.Navigator>
    );

};


const Navigation =() =>{
    return(
        <NavigationContainer>
        <Stack.Navigator>
         <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false}}/>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false}}/>
          <Stack.Screen name="Home" component={TabNavigation} options={{headerShown:false}} />
          <Stack.Screen name="EditUser" component={EditUser} options={{title: 'Dados cadastrais'}} />
          <Stack.Screen name="Users" component={admUsers} options={{title: 'Gerenciar Usuários'}} />
          <Stack.Screen name="User" component={User} options={{title: 'Gerenciar Usuários'}} />
          <Stack.Screen name="Localidade" component={Localidade} options={{title: 'Gerenciar Localidades'}} />
          <Stack.Screen name="Localidade_Detalhada" component={InfLocalidade} options={{title: 'Localidade'}} />
        </Stack.Navigator>
      </NavigationContainer>
    );
};

export default Navigation;