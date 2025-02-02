import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import LogoutButton from "./context/authUtils";
import { getUser } from "./context/userStore";
import User from "./modules/User";
import admUsers from "./modules/admUsers/screens/AdmUsers";
import BenfeitoriaDetails from "./modules/benfeitoriaDetails/screens/BenfeitoriasDetails";
import Benfeitorias from "./modules/benfeitorias/screens/Benfeitorias";
import { NovaBenfeitoria } from "./modules/benfeitorias/screens/novaBenfeitoria";
import Consumo from "./modules/consumo/screens/Consumo";
import ConsumoItens from "./modules/consumo/screens/ConsumoItens";
import Coordenadas from "./modules/coordenadas";
//import Dependencias from "./modules/dependencias/screens/Dependencia";
import EditUser from "./modules/editUser";
import Escolas from "./modules/escolas/screens/Escolas";
import { NovaEscola } from "./modules/escolas/screens/novaEscola";
import Home from "./modules/home";
import InfLocalidade from "./modules/localidade/screens/InfLocalidade";
import Localidade from "./modules/localidades";
import Login from "./modules/login";
import Postos from "./modules/postos/screens/Postos";
import { NovoPosto } from "./modules/postos/screens/novoPosto";
import ProfileUser from "./modules/profileUser";
import Splash from "./modules/splash";
import UserDetails from "./modules/userDetails";
import { Icon } from "./shared/components/icon/Icon";
import Text from "./shared/components/text/Text";
import { textTypes } from "./shared/components/text/textTypes";
import { theme } from "./shared/themes/theme";
import { UserBody } from "./shared/types/userBody";
import Entrevistados from "./modules/entrevistados/screens/Entrevistado";
import { NovoEntrevistado } from "./modules/entrevistados/screens/novoEntrevistado";
import EntrevistadoDetails from "./modules/entrevistadoDetails/screens/EntrevistadoDetails";
import { NovoImovel } from "./modules/imovel/screens/novoImovel";
import ImovelDetails from "./modules/imovel/screens/imovelDetails";





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
      tabBarActiveTintColor: "#fcf9f7",
      tabBarInactiveTintColor: "#ff4500",
      tabBarStyle: {
        backgroundColor: 'black', // Cor de fundo do rodapé
      },
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
          <Stack.Screen name="Entrevistados" component={Entrevistados} options={{title: 'Entrevistados'}} />
          <Stack.Screen name="NovoEntrevistado" component={NovoEntrevistado} options={{title: 'Cadastro de Entrevistado'}} />
          <Stack.Screen name="EntrevistadoDetails" component={EntrevistadoDetails} options={{title: 'Entrevistado'}} />
          <Stack.Screen name="NovoImovel" component={NovoImovel} options={{title: 'Cadastro de Imóveis'}} />
          <Stack.Screen name="ImovelDetail" component={ImovelDetails} options={{title: 'Imóvel'}} />
          <Stack.Screen name="Benfeitorias" component={Benfeitorias} options={{title: 'Benfeitorias'}} />
          <Stack.Screen name="BenfeitoriaDetails" component={BenfeitoriaDetails} options={{title: 'Benfeitoria'}} />
          <Stack.Screen name="Consumo" component={Consumo} options={{title: 'Dados de Consumo'}} />
          <Stack.Screen name="ConsumoItens" component={ConsumoItens} options={{title: 'Dados de Consumo'}} />
          <Stack.Screen name="NovaBenfeitoria" component={NovaBenfeitoria} options={{title: 'Cadastro de Benfeitoria'}} />
          <Stack.Screen name="Postos" component={Postos} options={{title: 'Postos'}} />
          <Stack.Screen name="NovoPosto" component={NovoPosto} options={{title: 'Cadastro de Postos'}} />
          <Stack.Screen name="Escolas" component={Escolas} options={{title: 'Ecolas'}} />
          <Stack.Screen name="NovaEscola" component={NovaEscola} options={{title: 'Cadastro de Ecolas'}} />
         
         </Stack.Navigator>
      </NavigationContainer>
    );
};

export default Navigation;

