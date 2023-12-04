import { OutrosServicosType } from '../../shared/types/OutrosServicosType';
import { realmInstance } from './databaseService';




export const salvarOutrosServicos = (servicos: OutrosServicosType[]) => {
    
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                servicos.forEach(servico => {
                  realmInstance.create('OutrosServicos', servicos, true);
                    
                });
            });
            resolve();
        } catch (error) {
            reject(error)
        }
    })
};



export const getOutrosServicos = (imovel:number): OutrosServicosType[]=>{

    const query = `imovel == ${imovel}`;
    
    const servicos = realmInstance.objects<OutrosServicosType>('Benfeitoria').filtered(query).slice(); 
    
    const cleanServicos = JSON.parse(JSON.stringify(servicos));
    
    return cleanServicos as OutrosServicosType[];
};