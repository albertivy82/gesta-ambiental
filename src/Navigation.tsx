import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./modules/login";
import Home from "./modules/home";
import Splash from "./modules/splash";
import EditUser from "./modules/editUser";
import User from "./modules/User";
import Localidade from "./modules/localidades";


const Stack = createNativeStackNavigator();

const Navigation =() =>{
    return(

        <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false}}/>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false}}/>
          <Stack.Screen name="Home" component={Home} options={{title: 'Home'}} />
          <Stack.Screen name="EditUser" component={EditUser} options={{title: 'Dados cadastrais'}} />
          <Stack.Screen name="User" component={User} options={{title: 'Gerenciar Usuários'}} />
          <Stack.Screen name="Localidade" component={Localidade} options={{title: 'Gerenciar Localidades'}} />
        </Stack.Navigator>
      </NavigationContainer>
    )
};

export default Navigation;