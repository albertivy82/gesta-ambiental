import { useState } from 'react';
import { LocalidadeType } from '../../shared/types/LocalidadeType';
import { realmInstance } from './databaseService';




export const salvarLocalidades = (localidades:LocalidadeType[])=>{
    
    return new Promise<void>((resolve, reject)=>{
        try{
           
            realmInstance.write(()=>{
        
                localidades.forEach(localidade =>{
                        realmInstance.create('Localidade', localidade, true);
                });
            });
        resolve();
            } catch (error){
            reject(error)
        }
    })
   
};



export const getLocalidades = (): LocalidadeType[]=>{
   
    const localidades = realmInstance.objects<LocalidadeType>('Localidade').slice(); 
   
    const cleanLocalidades = JSON.parse(JSON.stringify(localidades));
  
    return cleanLocalidades as LocalidadeType[];
}


export const getLocalidadesPorId = (islocalidade:number): LocalidadeType=>{
   
   const query = `id == ${islocalidade}`;
      
     
       const localidadeRealm = realmInstance.objects<LocalidadeType>('Localidade').filtered(query).slice();
       
       const localidadeLimpa = JSON.parse(JSON.stringify(localidadeRealm[0]));
   
       
   
       return localidadeLimpa as LocalidadeType;
}