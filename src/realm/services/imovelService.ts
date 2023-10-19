import { imovelBody } from "../../shared/types/imovelBody"
import { realmInstance } from "./databaseService"

export const salvarImoveis = (imoveis: imovelBody[]) =>{

    return new Promise<void>((resolve, reject)=>{

        try{
            realmInstance.write(()=>{

                imoveis.forEach(imovel=>{
                    
                    const imovelPadrao ={
                        ...imovel,

                        localidade: imovel.localidade.id

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

export const getImoveis = (localidadeId:number): imovelBody[]=>{

    const query = `localidade==${localidadeId}`;

    const imoveisRealm = realmInstance.objects<imovelBody>('Imovel').filtered(query).slice();

    const imoveisLimpos = JSON.parse(JSON.stringify(imoveisRealm));

    return imoveisLimpos as imovelBody[];
}