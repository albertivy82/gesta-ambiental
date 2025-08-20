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
      //const usuarioAtual = await connectionAPIGet<UserBody>(`http://192.168.100.28:8080/usuario/buscapormatricula/${matricula}`);

      console.log('consulta', usuarioAtual)
      
      storeUser(usuarioAtual);
    

  } else {
    console.log('Token de autenticação não encontrado.');
  }

 
}


const storeUser = async (user: UserBody) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.log('Error storing user:', error);
  }
};



export const getUser = async () => {
try {
const user = await AsyncStorage.getItem('user');
return user;
} catch (error) {
console.log('Error getting User:', error);
return null;
}
};


export const removeUser = async () => {
try {
await AsyncStorage.removeItem('user');
} catch (error) {
console.log('Error removing informações do usuário:', error);
}
};