import { EntrevistadoType } from '../../shared/types/EntrevistadoType';
import { coordenadasBody } from '../../shared/types/coordenadaBody';
import { realmInstance } from './databaseService';




export const salvarEntrevistado = (entrevistado: EntrevistadoType) => {
    
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                                 
                    const corrigidoCoordenada = {
                       ...entrevistado,
                        imovel: entrevistado.imovel.id
                    };

                   realmInstance.create('Coordenada', corrigidoCoordenada, true);
                    
                });
        resolve();

        } catch (error) {
            reject(error)
        }
    })
};



export const getCoordenadas = (imovel:number) =>{

    const query = `imovel == ${imovel}`;
    const entrevistado = realmInstance.objects<coordenadasBody>('Entrevistado').filtered(query).slice(); 
   
   const cleanEntrevistado = JSON.parse(JSON.stringify(entrevistado));
   
    return cleanEntrevistado;
};