import { OptionContainer, ProfileUsersContainer } from "../styles/ProfileUser.style";
import CheckBox from '@react-native-community/checkbox';
import {useState} from 'react'
import { View } from "react-native";
import Text from "../../../shared/components/text/Text";


const ProfileUser = ()=>{
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isChecked4, setIsChecked4] = useState(false);
 

  const handleCheckboxChange = (checkboxNumber:number, newValue:boolean) => {
    
    switch (checkboxNumber) {
        case 1:
        setIsChecked1(newValue);
          if(newValue){
            setIsChecked2(false);
            setIsChecked3(false);
            setIsChecked4(false);
          }
          break;
        case 2:
        setIsChecked2(newValue);
          if(newValue){
            setIsChecked1(false);
            setIsChecked3(false);
            setIsChecked4(false);
          }
          break
        case 3:
        setIsChecked3(newValue);
          if(newValue){
            setIsChecked1(false);
            setIsChecked2(false);
            setIsChecked4(false);
          }
          break
        case 4:
        setIsChecked4(newValue);
          if(newValue){
            setIsChecked1(false);
            setIsChecked2(false);
            setIsChecked3(false);
          }
          break
       default:
        break;
    }
  };  
  
  
  return (
    
    <ProfileUsersContainer>
            
         <Text>PERFIL</Text>

           <OptionContainer>
              <Text>ADMINISTRADOR</Text>
            <CheckBox
            disabled={false}
            value={isChecked1}
            onValueChange={(newValue) => handleCheckboxChange(1, newValue)}
          />
          </OptionContainer>

          <OptionContainer>
              <Text>GESTOR AMBIENTAL</Text>
            <CheckBox
            disabled={false}
            value={isChecked2}
            onValueChange={(newValue) => handleCheckboxChange(2, newValue)}
          />
          </OptionContainer>

          <OptionContainer>
              <Text>ANALISTA AMBIENTAL</Text>
            <CheckBox
            disabled={false}
            value={isChecked3}
            onValueChange={(newValue) => handleCheckboxChange(3, newValue)}
          />
          </OptionContainer>

          <OptionContainer>
              <Text>ANALISTA SOCIAL</Text>
            <CheckBox
            disabled={false}
            value={isChecked4}
            onValueChange={(newValue) => handleCheckboxChange(4, newValue)}
          />
          </OptionContainer>

      </ProfileUsersContainer>
  );
};

export default ProfileUser;