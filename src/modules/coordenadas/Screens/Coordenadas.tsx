import { View, TextInput, Button } from "react-native";
import { useEffect,useState } from 'react';
import { EditUserContainer } from "../styles/Coordenadas.style";
import { useCoordenadas} from "../hooks/useCoordenadas";
import { useRef } from "react";
import Input from "../../../shared/components/input/input";
import { RouteProp, useRoute } from "@react-navigation/native";
import { coordenadasBody } from "../../../shared/types/coordenadaBody";
import Navigation from "../../../Navigation";

export interface LocalidadeId {
  localidadeId: string;
}

export interface coordenadaParam {
  coordenadasErradas: coordenadasBody;
}



const Coordenadas = () =>{
    type RotaLocalidadeId = RouteProp<Record<string, LocalidadeId>, 'LocalidadeId'>;
    type RotaCoordenadaParam = RouteProp<Record<string, coordenadaParam>, 'CoordenadaParam'>;
    const paramsLocalidadeId = useRoute<RotaLocalidadeId>().params;
    const paramsCoordenadaParam = useRoute<RotaCoordenadaParam>().params;
    const [coordenadasAlterar, setCoordenadasAlterar] = useState<coordenadaParam>();
    const {registrarCoordenada, atualizarCoordenada, setCoordenadaNova, handleOnChangeInput, coordenadaNova, disabled} = useCoordenadas();
    const latitutdeInput = useRef<TextInput>(null);
    const longitudeInput = useRef<TextInput>(null);
    
 

    
    useEffect(()=>{
      console.log('antes')
      if (paramsCoordenadaParam !== undefined && Object.keys(paramsCoordenadaParam).length>1){
        console.log()
        console.log('entrou 1');
        setCoordenadasAlterar(paramsCoordenadaParam)
      }
    }, [paramsCoordenadaParam]
    );

    useEffect(() => {
      console.log(paramsCoordenadaParam)
      if (coordenadasAlterar !== undefined){
        setCoordenadaNova({
          ...coordenadaNova,
          latitude: coordenadasAlterar.coordenadasErradas.latitude,
          longitude: coordenadasAlterar.coordenadasErradas.longitude,
      });
    }
      
        
    }, [coordenadasAlterar]
    );
           
      const enviar = async ()=>{
         
        if (coordenadasAlterar) {
          await atualizarCoordenada(coordenadasAlterar.coordenadasErradas.id);
        } else{
         
          await registrarCoordenada(paramsLocalidadeId.localidadeId);
        }
      }

   return(
        <EditUserContainer>


              <Input 
                   value={coordenadaNova.latitude} 
                   onChange={(event)=> handleOnChangeInput(event, 'latitude')}
                   margin="0px 0px 16px 0px"
                   placeholder="latitude..."
                   title="Latitude:"
                   onSubmitEditing={()=>longitudeInput.current?.focus()}
                   ref={latitutdeInput}
              />

               <Input 
                   value={coordenadaNova.longitude} 
                   onChange={(event)=> handleOnChangeInput(event,'longitude')}
                   margin="0px 0px 16px 0px"
                   placeholder="longitude..."
                   title="Longitude:"
                  ref={longitudeInput}
              />

              <Button title="enviar" disabled={disabled} onPress={enviar} />
        </EditUserContainer>
  );

};

export default Coordenadas;