import { DependenciaType } from "../../shared/types/DependenciasType";
import { realmInstance } from "./databaseService";

export const salvarDependencias= (dependencias: DependenciaType[]) =>{

    return new Promise<void>((resolve, reject)=>{

            try{
                    realmInstance.write(()=>{

                        dependencias.forEach(dependencia=>{

                            const dependenciaCorrigida = {
                                ...dependencia,
                                benfeitoria: dependencia.benfeitoria.id
                            }

                            realmInstance.create('Dependencias', dependenciaCorrigida, true)

                        })

                    })

                    resolve();

            }catch(error){
                reject(error)
            }
    }) 
}

export const getDependencias=(benfeitoria:number): DependenciaType[]=>{
    
    const query = `benfeitoria == ${benfeitoria}`
    
    const dependenciasRealm = realmInstance.objects<DependenciaType>('Dependencias').filtered(query).slice();

    const cleanDependencias = JSON.parse(JSON.stringify(dependenciasRealm));

    return cleanDependencias as DependenciaType[];

}