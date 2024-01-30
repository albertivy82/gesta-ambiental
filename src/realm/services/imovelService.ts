import { imovelBody } from "../../shared/types/imovelType"
import { realmInstance } from "./databaseService"

export const salvarImoveis = (imoveis: imovelBody[]) =>{

    return new Promise<void>((resolve, reject)=>{
           
        try{
            realmInstance.write(()=>{

                imoveis.forEach(imovel=>{
                    
                    const imovelPadrao ={
                        ...imovel,

                        localidade: imovel.localidade.id,
                    };

                    realmInstance.create('Imovel', imovelPadrao, true);
                });
               
            });

            resolve();

        }catch(error){
            reject(error)
        }
    
    
    
    });

};

export const salvarImovelQueue = (imovel: imovelBody) =>{

    return new Promise<void>((resolve, reject)=>{
           
        try{
            realmInstance.write(()=>{

               const imovelPadrao ={
                        ...imovel,

                        localidade: imovel.localidade.id,
              };

                    realmInstance.create('Imovel', imovelPadrao, true);
                }
               
            );

            resolve();

        }catch(error){
            reject(error)
        }
    
    
    
    });

};


export const getImoveis = (localidade:number): imovelBody[]=>{

   
    const query = `localidade == ${localidade}`;
   
  
    const imoveisRealm = realmInstance.objects<imovelBody>('Imovel').filtered(query).slice();
    
    const imoveisLimpos = JSON.parse(JSON.stringify(imoveisRealm));

    return imoveisLimpos as imovelBody[];
}


export const getImoveisDessincronizados = (localidade:number): imovelBody[]=>{

   
    const query = `localidade == ${localidade} and sincronizado == false`;

    const imoveisQueue = realmInstance.objects<imovelBody>('Imovel').filtered(query).slice();

     
    const cleanedQueue = JSON.parse(JSON.stringify(imoveisQueue));

    return cleanedQueue as imovelBody[];
}