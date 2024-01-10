import { DependenciaInput } from "../../../shared/types/DependenciaIput"
import { connectionAPIDelete, connectionAPIPost } from "../../../shared/functions/connection/connectionAPI"

export const UseCadastrarRegistro = async (progress: number, escolha: string, benfeitoria: number)=>{
    try{

        
    const dependencia: DependenciaInput = {
        dependencia: escolha,
        quantidade: progress,
        benfeitoria: {
            id: benfeitoria,
        }
     }
     console.log(dependencia);

       const response = await connectionAPIPost(`http://192.168.100.28:8080/dependencias`, dependencia)
    }catch (error){

    }
}


export const UseDeletarRegistro = async (dependencia: number)=>{
    try{
         const response = await connectionAPIDelete(`http://192.168.100.28:8080/dependencias/${dependencia}`)
    }catch (error){

    }
}