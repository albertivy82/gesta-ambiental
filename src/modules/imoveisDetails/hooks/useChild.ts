import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native"
import { imovelBody } from "../../../shared/types/imovelType"

//BLOCO BENFEITORIA
export const benfeitoriasDoImovel = (navigate: NavigationProp<ParamListBase>['navigate'], imovelId: number)=>{
    navigate('Benfeitorias', {imovelId})
}
  
export const novaBenfeitoria = (navigate: NavigationProp<ParamListBase>['navigate'], 
                                  imovelId: number, 
                                  idLocal:string|undefined,
                                  sincronizado:boolean)=>{
                                  
    navigate('NovaBenfeitoria', {imovelId, idLocal, sincronizado})
  }
  

interface ItensProps {
    imovel:imovelBody
    contagemItem: number
    item: string
 
}

  
  


export const  handleGerenciaFilhas =  (navigate: NavigationProp<ParamListBase>['navigate'], 
                                       { imovel, contagemItem, item }: ItensProps ) =>{
     
      if(item=="Benfeitoria"){
        
        if(contagemItem>0){
                      benfeitoriasDoImovel(navigate, imovel.id);
          }else{
                     novaBenfeitoria(navigate, imovel.id, imovel.idLocal, imovel.sincronizado);
        }
    }else{
        console.log("não handle para isso")
    }
}