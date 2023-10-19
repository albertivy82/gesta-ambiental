import { realmInstance } from './databaseService';
import { coordenadasBody } from '../../shared/types/coordenadaBody';




export const salvarCoordenadas = (coordenadas: coordenadasBody[]) => {
   
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                coordenadas.forEach(coordenada => {
                   
                    const corrigidoCoordenada = {
                        ...coordenada,
                        localidade: coordenada.localidade.id
                    };
                    realmInstance.create('Coordenada', corrigidoCoordenada, true);
                    
                });
            });
            resolve();
        } catch (error) {
            reject(error)
        }
    })
};



export const getCoordenadas = (localidade:number): coordenadasBody[]=>{

    const query = `localidade == ${localidade}`;
    const coordenadas = realmInstance.objects<coordenadasBody>('Coordenada').filtered(query).slice(); 
   
   const cleanCoordenadas = JSON.parse(JSON.stringify(coordenadas));
   
    return cleanCoordenadas as coordenadasBody[];
};