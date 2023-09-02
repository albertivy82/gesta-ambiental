import jwtDecode from 'jwt-decode'; 
import { getToken } from './tokenStore';
import { UserBody } from '../shared/types/userBody';
import { connectionAPIGet } from '../shared/functions/connection/connectionAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const userData = async ()=>{
const token = await getToken();


    if (token) {
            
      const decodedToken = jwtDecode(token);

      
      const matricula = decodedToken["matrícula"];    
                  
      const usuarioAtual = await connectionAPIGet<UserBody>(`http://192.168.100.28:8080/usuario/buscapormatricula/${matricula}`);

      console.log('consulta', usuarioAtual)
      
      storeUserName(usuarioAtual.nome);
      storeUserId(usuarioAtual.id);
      //salvar o rupo

  } else {
    console.log('Token de autenticação não encontrado.');
  }

 
}



const storeUserName = async (nome: string) => {
  try {
    await AsyncStorage.setItem('usuarioNome', nome);
    
        
  } catch (error) {
    console.log('Error storing users Name:', error);
  }
};

const storeUserId = async (id: Number) => {
  try {


    await AsyncStorage.setItem('usuarioId', id.toString());
    console.log('o id est´nulo por que?', id);
        
  } catch (error) {
    console.log('Error storing users id:', error);
  }
};



export const getUserName = async () => {
try {
const nome = await AsyncStorage.getItem('usuarioNome');
return nome;
} catch (error) {
console.log('Error getting Nome:', error);
return null;
}
};

export const getUserId = async () => {
  try {
  const id = await AsyncStorage.getItem('usuarioId');
  return id;
  } catch (error) {
  console.log('Error getting Id:', error);
  return null;
  }
  };

export const removeNaeAndId = async () => {
try {
await AsyncStorage.removeItem('usuarioNome');
await AsyncStorage.removeItem('usuarioId');
} catch (error) {
console.log('Error removing informações do usuário:', error);
}
};