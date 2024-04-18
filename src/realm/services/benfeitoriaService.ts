import { realmInstance } from './databaseService';
import { BenfeitoriaType } from '../../shared/types/BenfeitoriaType';
import { BenfeitoriaInput } from '../../shared/types/BenfeitoriaInput';




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

export const salvarBenfeitoriaQueue = (benfeitoria:BenfeitoriaInput)=>{
   
   return new Promise<void>((resolve, reject)=>{

        const Id = () => {
            const min = Math.ceil(0);
            const max = Math.floor(1000);
            return Math.floor(Math.random() * (max - min + 1)) + min; 
        };
        
                try{

                        realmInstance.write(() => {
                        console.log('ERRO QUEUE');
                        const benfeitoriaPadrao = {
                            ...benfeitoria,
                            id: Id(), 
                           imovel: benfeitoria.imovel!.id,
                        };
            
                        realmInstance.create('Benfeitoria', benfeitoriaPadrao, true);
                    });

                    resolve()
                } catch(error){
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

export const getBenfeitoriaDessincronizadas=()=>{

        
            const query = `sincronizado == false`;

            const imoveisQueue = realmInstance.objects<BenfeitoriaType>('Benfeitoria').filtered(query).slice();

            const cleanedQueue = JSON.parse(JSON.stringify(imoveisQueue));

    return cleanedQueue as BenfeitoriaType[];
};

export const apagarImovelQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
           
            const query = `idLocal == "${idLocal}"`;
            const benfeitoriaExcluir = realmInstance.objects<BenfeitoriaType>('Benfeitoria').filtered(query);

            if (benfeitoriaExcluir.length > 0) {
                realmInstance.delete(benfeitoriaExcluir);
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir benfeitoria da fila:', error);
    }
};
