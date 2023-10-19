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