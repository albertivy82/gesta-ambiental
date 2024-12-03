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
import EditUser from "./modules/editUser";
import Entrevistados from "./modules/entrevistado/screens/Entrevistado";
import { NovoEntrevistado } from "./modules/entrevistado/screens/novoEntrevistado";
import Escolas from "./modules/escolas/screens/Escolas";
import { NovaEscola } from "./modules/escolas/screens/novaEscola";
import Home from "./modules/home";
import Imovel from "./modules/imoveis/screens/Imovel";
import { NovoImovel } from "./modules/imoveis/screens/novoImovel";
import ImovelDetails from "./modules/imoveisDetails/screens/imovelDetails";
import InfLocalidade from "./modules/localidade/screens/InfLocalidade";
import Localidade from "./modules/localidades";
import Login from "./modules/login";
import OutrosServicos from "./modules/outrosSevicos/screens/OutroServico";
import { NovoOutroServico } from "./modules/outrosSevicos/screens/novoOutroServico";
import Postos from "./modules/postos/screens/Postos";
import { NovoPosto } from "./modules/postos/screens/novoPosto";
import ProfileUser from "./modules/profileUser";
import ServicosBasicos from "./modules/sevicosBasicos/screens/SevicoBasico";
import { NovoServicoBasico } from "./modules/sevicosBasicos/screens/novoServicoBasico";
import Splash from "./modules/splash";
import UserDetails from "./modules/userDetails";
import { Icon } from "./shared/components/icon/Icon";
import Text from "./shared/components/text/Text";
import { textTypes } from "./shared/components/text/textTypes";
import { theme } from "./shared/themes/theme";
import { UserBody } from "./shared/types/userBody";
import { NovaVegetacao } from "./modules/vegetacao/screens/novaVegetacao";
import Vegetacoes from "./modules/vegetacao/screens/Vegetacao";
import { NovoServicoComunicacao } from "./modules/servicoComunicacao/screens/novoServicoComunicacao";
import ServicosComunicacao from "./modules/servicoComunicacao/screens/ServicoComunicacao";
import Peixes from "./modules/peixe/screens/Peixe";
import { NovoPeixe } from "./modules/peixe/screens/novoPeixe";
import Dependencias from "./modules/dependencias/screens/Dependencia";
import Mamiferos from "./modules/mamifero/screens/Mamifero";
import { NovoMamifero } from "./modules/mamifero/screens/novoMamifero";
import Faunas from "./modules/fauna/screens/Fauna";
import { NovaFauna } from "./modules/fauna/screens/novaFauna";
import Aguas from "./modules/agua/screens/Agua";
import { NovaAgua } from "./modules/agua/screens/novaAgua";
import Aves from "./modules/aves/screens/Ave";
import { NovaAve } from "./modules/aves/screens/novaAve";
import IntituicoesConhecidas from "./modules/insituticaoConhecida/screens/InstituicaoConhecida";
import { NovaInstituicaoConhecida } from "./modules/insituticaoConhecida/screens/novaInsituicaoConhecida";
import AtividadesProdutivas from "./modules/atividadeProdutiva/screens/AtividadeProdutiva";
import { NovaAtividadeProdutiva } from "./modules/atividadeProdutiva/screens/novaAtividadeProdutiva";
import Violencias from "./modules/violencia/screens/Violencia";
import { NovaViolencia } from "./modules/violencia/screens/novaViolencia";
import RendasOutrasFontes from "./modules/credito/screens/rendaOutrasFontes";
import { NovaRendaOutrasFontes } from "./modules/credito/screens/novoMamifero";
import Creditos from "./modules/rendaOutrasFontes/screens/Credito";
import { NovoCredito } from "./modules/rendaOutrasFontes/screens/novoCredito";
import Moradores from "./modules/morador/screens/Morador";
import { NovoMorador } from "./modules/morador/screens/novoMorador";
import PescasArtesanais from "./modules/pescaArtesanal/screens/PescaArtesanal";
import { NovaPescaArtesal } from "./modules/pescaArtesanal/screens/novaPescaArtesanal";




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
          <Stack.Screen name="Imovel" component={Imovel} options={{title: 'Imóveis'}} />
          <Stack.Screen name="ImovelDetail" component={ImovelDetails} options={{title: 'Imóvel'}} />
          <Stack.Screen name="Benfeitorias" component={Benfeitorias} options={{title: 'Benfeitorias'}} />
          <Stack.Screen name="BenfeitoriaDetails" component={BenfeitoriaDetails} options={{title: 'Benfeitoria'}} />
          <Stack.Screen name="Consumo" component={Consumo} options={{title: 'Dados de Consumo'}} />
          <Stack.Screen name="ConsumoItens" component={ConsumoItens} options={{title: 'Dados de Consumo'}} />
          <Stack.Screen name="Dependencias" component={Dependencias} options={{title: 'Dependências'}} />
          <Stack.Screen name="NovoImovel" component={NovoImovel} options={{title: 'Cadastro de Imóveis'}} />
          <Stack.Screen name="NovaBenfeitoria" component={NovaBenfeitoria} options={{title: 'Cadastro de Benfeitoria'}} />
          <Stack.Screen name="Postos" component={Postos} options={{title: 'Postos'}} />
          <Stack.Screen name="NovoPosto" component={NovoPosto} options={{title: 'Cadastro de Postos'}} />
          <Stack.Screen name="Escolas" component={Escolas} options={{title: 'Ecolas'}} />
          <Stack.Screen name="NovaEscola" component={NovaEscola} options={{title: 'Cadastro de Ecolas'}} />
          <Stack.Screen name="Entrevistados" component={Entrevistados} options={{title: 'Entrevistado'}} />
          <Stack.Screen name="NovoEntrevistado" component={NovoEntrevistado} options={{title: 'Cadastro de Entrevistado'}} />
          <Stack.Screen name="OutrosServicos" component={OutrosServicos} options={{title: 'Outros Serviços'}} />
          <Stack.Screen name="NovoOutroServico" component={NovoOutroServico} options={{title: 'Cadastro de Serviços'}} />
          <Stack.Screen name="ServicosBasicos" component={ServicosBasicos} options={{title: 'Saneamento Básico'}} />
          <Stack.Screen name="NovoServicosBasicos" component={NovoServicoBasico} options={{title: 'Levantamento sobre Saneamento Básico'}} />        
          <Stack.Screen name="Vegetacoes" component={Vegetacoes} options={{title: 'Vegetação'}} />
          <Stack.Screen name="NovaVegetacao" component={NovaVegetacao} options={{title: 'Levantamento sobre vegetação'}} />        
          <Stack.Screen name="ServicosComunicacao" component={ServicosComunicacao} options={{title: 'Serviços de Comunicação'}} />
          <Stack.Screen name="NovoServicoComunicacao" component={NovoServicoComunicacao} options={{title: 'Serviços de comunicação disponíveis'}} />        
          <Stack.Screen name="Peixes" component={Peixes} options={{title: 'Registro de Peixes'}} />
          <Stack.Screen name="NovoPeixe" component={NovoPeixe} options={{title: 'Peixes'}} /> 
          <Stack.Screen name="Mamiferos" component={Mamiferos} options={{title: 'Registro de mamíferos'}} />
          <Stack.Screen name="NovoMamifero" component={NovoMamifero} options={{title: 'Mamíferos'}} /> 
          <Stack.Screen name="Faunas" component={Faunas} options={{title: 'Registro de Fauna'}} />
          <Stack.Screen name="NovasFaunas" component={NovaFauna} options={{title: 'Fauna'}} /> 
          <Stack.Screen name="Aguas" component={Aguas} options={{title: 'Água'}} />
          <Stack.Screen name="NovaAgua" component={NovaAgua} options={{title: 'Água'}} /> 
          <Stack.Screen name="Aves" component={Aves} options={{title: 'Aves'}} />
          <Stack.Screen name="NovaAve" component={NovaAve} options={{title: 'Aves'}} />
          <Stack.Screen name="IntituicoesConhecidas" component={IntituicoesConhecidas} options={{title: 'Instituições conhecidas'}} />
          <Stack.Screen name="NovaInstituicaoConhecida" component={NovaInstituicaoConhecida} options={{title: 'Cadastro de Intituições Conhecidas'}} /> 
          <Stack.Screen name="AtividadesProdutivas" component={AtividadesProdutivas} options={{title: 'Atividades Produtivas'}} />
          <Stack.Screen name="NovaAtividadeProdutiva" component={NovaAtividadeProdutiva} options={{title: 'Lvantamento sobre Atidades Produtivas'}} /> 
          <Stack.Screen name="Violencias" component={Violencias} options={{title: 'Casos de Violencia'}} />
          <Stack.Screen name="NovaViolencia" component={NovaViolencia} options={{title: 'Levantamento sobre violência'}} /> 
          <Stack.Screen name="RendasOutrasFontes" component={RendasOutrasFontes} options={{title: 'Outras Fontes deRenda'}} />
          <Stack.Screen name="NovaRendaOutrasFontes" component={NovaRendaOutrasFontes} options={{title: 'Levantamento de Outras Fontes de Renda'}} /> 
          <Stack.Screen name="Creditos" component={Creditos} options={{title: 'Creditos acessados'}} />
          <Stack.Screen name="NovoCredito" component={NovoCredito} options={{title: 'Levantamento sobre Créditos Acessados'}} /> 
          <Stack.Screen name="Moradores" component={Moradores} options={{title: 'Moradores'}} />
          <Stack.Screen name="NovoMorador" component={NovoMorador} options={{title: 'Moradores do Imovel'}} /> 
          <Stack.Screen name="PescasArtesanais" component={PescasArtesanais} options={{title: 'Pesca Artesanal'}} />
          <Stack.Screen name="NovaPescaArtesal" component={NovaPescaArtesal} options={{title: 'Levantamento sobre PescaA rtesanal'}} /> 
        </Stack.Navigator>
      </NavigationContainer>
    );
};

export default Navigation;

