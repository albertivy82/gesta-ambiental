import { DependenciaType } from "../../shared/types/DependenciasType";
import { realmInstance } from "./databaseService";

export const salvarDependencias= (dependencias: DependenciaType[]) =>{

    return new Promise<void>((resolve, reject)=>{

            try{
                    realmInstance.write(()=>{

                    })



            }catch(error){
                reject(error)
            }




    }) 
}