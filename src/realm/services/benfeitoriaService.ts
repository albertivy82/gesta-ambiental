import { realmInstance } from './databaseService';
import { BenfeitoriaType } from '../../shared/types/BenfeitoriaType';




export const salvarBenfeitoria = (benfeitorias: BenfeitoriaType[]) => {
    
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                benfeitorias.forEach(benfeitoria => {
                   
                    const benfeitoriaCorrigida = {
                        ...benfeitoria,
                        imovel: benfeitoria.imovel.id
                    };

                    realmInstance.create('Benfeitoria', benfeitoriaCorrigida, true);
                    
                });
            });
            resolve();
        } catch (error) {
            reject(error)
        }
    })
};



export const getBenfeitorias = (imovel:number): BenfeitoriaType[]=>{

    const query = `imovel == ${imovel}`;
    
    const benfeitorias = realmInstance.objects<BenfeitoriaType>('Benfeitoria').filtered(query).slice(); 
    
    const cleanBenfeitoria = JSON.parse(JSON.stringify(benfeitorias));
    
    return cleanBenfeitoria as BenfeitoriaType[];
};