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

export const getBenfeitoriaDessincronizadas = (idImovelApi: number): BenfeitoriaType[] => {
    const query = `imovel == "${idImovelApi}" AND sincronizado == false AND idFather == " "`;
    const imoveisQueue = realmInstance.objects<BenfeitoriaType>('Benfeitoria').filtered(query);

    //cópia para evitar modificações, mapear os objetos para um novo formato
    const cleanedQueue = imoveisQueue.map(benfeitoria => ({
        ...benfeitoria
    }));

    return cleanedQueue;
};


export const setIdImovelFromApi = (idImovelApi: number, imovelIdLocal: string) => {
    try {
        const query = `idFather == "${imovelIdLocal}" AND sincronizado == false`;
        const benfeitoriaQueue = realmInstance.objects('Benfeitoria').filtered(query);

        realmInstance.write(() => {
            benfeitoriaQueue.forEach(benfeitoriaOrfan => {
                benfeitoriaOrfan.idFather = '';  // Ajuste conforme a lógica do seu domínio
                benfeitoriaOrfan.imovel = idImovelApi;
            });
        });

    } catch (error) {
        console.error(error);
    }
};


export const apagarBenfeitiaQueue = (idLocal: string) => {
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
