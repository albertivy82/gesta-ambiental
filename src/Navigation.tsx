import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import LogoutButton from "./context/authUtils";
import { getUser } from "./context/userStore";
import admUsers from "./modules/admUsers/screens/AdmUsers";
import Aguas from "./modules/agua/screens/Agua";
import { NovaAgua } from "./modules/agua/screens/novaAgua";
import Atividades from "./modules/atividadeProdutiva/screens/AtividadeProdutiva";
import { NovaAtividade } from "./modules/atividadeProdutiva/screens/novaAtividade";
import BenfeitoriaDetails from "./modules/benfeitoriaDetails/screens/BenfeitoriasDetails";
import Benfeitorias from "./modules/benfeitorias/screens/Benfeitorias";
import { NovaBenfeitoria } from "./modules/benfeitorias/screens/novaBenfeitoria";
import Coordenadas from "./modules/coordenadas";
import Credito from "./modules/credito/screens/Credito";
import { NovoCredito } from "./modules/credito/screens/novoCredito";
import EditUser from "./modules/editUser";
import EntrevistadoDetails from "./modules/entrevistadoDetails/screens/EntrevistadoDetails";
import Entrevistados from "./modules/entrevistados/screens/Entrevistado";
import { NovoEntrevistado } from "./modules/entrevistados/screens/novoEntrevistado";
import Escolas from "./modules/escolas/screens/Escolas";
import { NovaEscola } from "./modules/escolas/screens/novaEscola";
import Home from "./modules/home";
import ImovelDetails from "./modules/imovel/screens/imovelDetails";
import { NovoImovel } from "./modules/imovel/screens/novoImovel";
import InfLocalidade from "./modules/localidade/screens/InfLocalidade";
import Localidade from "./modules/localidades";
import Login from "./modules/login";
import Morador from "./modules/morador/screens/Morador";
import MoradorDetails from "./modules/morador/screens/MoradorDetails";
import { NovoMorador } from "./modules/morador/screens/novoMorador";
import { NovaParticipacaoInstituicao } from "./modules/participacaoInsituicao/screens/novaParticipacaoInstituicao";
import ParticipacaoInstituicao from "./modules/participacaoInsituicao/screens/ParticipacaoInstituicao";
import { NovoPosto } from "./modules/postos/screens/novoPosto";
import Postos from "./modules/postos/screens/Postos";
import { NovaRendaOutrasFontes } from "./modules/rendaOutrasFontes/screens/novaRendaOutrasFontes";
import RendaOutrasFontes from "./modules/rendaOutrasFontes/screens/RendaOutrasFontes";
import { NovoServicoComunicacao } from "./modules/servicoComunicacao/screens/novoSevicoComunicacao";
import ServicosComunicacao from "./modules/servicoComunicacao/screens/ServicoComunicacao";
import Splash from "./modules/splash";
import User from "./modules/User";
import UserDetails from "./modules/userDetails";
import { Icon } from "./shared/components/icon/Icon";
import Text from "./shared/components/text/Text";
import { textTypes } from "./shared/components/text/textTypes";
import { theme } from "./shared/themes/theme";
import { UserBody } from "./shared/types/userBody";





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

                listeners={{
                  focus: async () => {
                    const currentUser = await getUser();
                    if (currentUser) {
                      const userDataParsed: UserBody = JSON.parse(currentUser);
                      setUserData(userDataParsed);
                    } else {
                      setUserData(null);
                    }
                  },
                }}
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
          <Stack.Screen name="Coordenadas" component={Coordenadas} options={{title: 'Coordenadas'}} />
          <Stack.Screen name="Entrevistados" component={Entrevistados} options={{title: 'Entrevistados'}} />
          <Stack.Screen name="NovoEntrevistado" component={NovoEntrevistado} options={{title: 'Cadastro de Entrevistado'}} />
          <Stack.Screen name="EntrevistadoDetails" component={EntrevistadoDetails} options={{title: 'Entrevistado'}} />
          <Stack.Screen name="NovoImovel" component={NovoImovel} options={{title: 'Cadastro de Imóveis'}} />
          <Stack.Screen name="ImovelDetail" component={ImovelDetails} options={{title: 'Imóvel'}} />
          <Stack.Screen name="Benfeitorias" component={Benfeitorias} options={{title: 'Benfeitorias'}} />
          <Stack.Screen name="BenfeitoriaDetails" component={BenfeitoriaDetails} options={{title: 'Benfeitoria'}} />
          <Stack.Screen name="NovaBenfeitoria" component={NovaBenfeitoria} options={{title: 'Cadastro de Benfeitoria'}} />
          <Stack.Screen name="Postos" component={Postos} options={{title: 'Postos'}} />
          <Stack.Screen name="NovoPosto" component={NovoPosto} options={{title: 'Cadastro de Postos'}} />
          <Stack.Screen name="Escolas" component={Escolas} options={{title: 'Escolas'}} />
          <Stack.Screen name="NovaEscola" component={NovaEscola} options={{title: 'Cadastro de Escolas'}} />
          <Stack.Screen name="NovoCredito" component={NovoCredito} options={{ title: 'Cadastro de Crédito' }} />
          <Stack.Screen name="CreditoLista" component={Credito} options={{ title: 'Registro de Crédito' }} />
          <Stack.Screen name="NovaRendaOutrasFontes" component={NovaRendaOutrasFontes} options={{ title: 'Cadastro de Outras Fontes de Renda' }} />
          <Stack.Screen name="RendaOutrasFontesLista" component={RendaOutrasFontes} options={{ title: 'Registro de Outras Fontes de Renda' }} />
          <Stack.Screen name="NovaAgua" component={NovaAgua} options={{ title: 'Cadastro de Água' }} />
          <Stack.Screen name="AguaLista" component={Aguas} options={{ title: 'Registro de Água' }} />
          <Stack.Screen name="NovoServicoComunicacao" component={NovoServicoComunicacao} options={{ title: 'Cadastro de Serviço de Comunicação' }} />
          <Stack.Screen name="ServicosComunicacaoLista" component={ServicosComunicacao} options={{ title: 'Registro de Serviços de Comunicação' }} />
          <Stack.Screen name="Atividades" component={Atividades} options={{ title: 'Atividade Produtiva' }} />
          <Stack.Screen name="NovaAtividade" component={NovaAtividade} options={{ title: 'Cadastro de Atividade Produtiva' }} />
          <Stack.Screen name="Morador" component={Morador} options={{ title: 'Listagem de Moradores' }} />
          <Stack.Screen name="MoradorDetails" component={MoradorDetails} options={{ title: 'Morador' }} />
          <Stack.Screen name="NovoMorador" component={NovoMorador} options={{ title: 'Cadastro de Morador' }} />
          <Stack.Screen name="NovaParticipacaoInstituicao" component={NovaParticipacaoInstituicao} options={{ title: 'Instituição' }} />
          <Stack.Screen name="ParticipacaoInstituicao" component={ParticipacaoInstituicao} options={{ title: 'Instituições' }} />
         </Stack.Navigator>
      </NavigationContainer>
    );
};

export default Navigation;

