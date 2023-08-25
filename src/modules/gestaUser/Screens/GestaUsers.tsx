import { Button, ScrollView, TextInput } from "react-native";
import { GetaUserContainer } from "../styles/GestaUser.style";

const GestaUser = () =>{

      return(
            <GetaUserContainer>
                  <TextInput underlineColorAndroid={'black'} placeholderTextColor={'black'} placeholder="Digite nome"/>
                  <TextInput underlineColorAndroid={'black'} placeholderTextColor={'black'} placeholder="matricula"/>
                  <TextInput underlineColorAndroid={'black'} placeholderTextColor={'black'} placeholder="email"/>
                  <TextInput underlineColorAndroid={'black'} placeholderTextColor={'black'} placeholder="cpf"/>
                  <TextInput underlineColorAndroid={'black'} placeholderTextColor={'black'} placeholder="senha"/>
                  <Button title="enviar" />
            </GetaUserContainer>
      );

};

export default GestaUser;

//interessnate criar um arqui para url como ela faz: ver aula57
//userBody é o meu retorno
//const resultBack = await connectionAPIGet<UserBody>('http://192.168.100.28:8080/usuario')