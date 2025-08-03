import { EntrevistadoInput } from '../../shared/types/EntrevistadoInput';
import { EntrevistadoType } from '../../shared/types/EntrevistadoType';
import { realmInstance } from './databaseService';


export const salvarEntrevistados = (entrevistados: EntrevistadoType[]) =>{

    return new Promise<void>((resolve, reject)=>{
           
        try{
            realmInstance.write(()=>{

                entrevistados.forEach(entrevistado=>{

                    //essa duplicação de código foi feita para controlar atualizações de todas os registros
                    //a primeira condição entram apenas atualizações
                    //no segundo novos registros
                    const entrevistadoRealm = realmInstance.objects('Localidade').filtered(`id == ${entrevistado.id}`)[0];
                    //console.log('Imóvel recuperado do Realm:', entrevistadoRealm);
                    if(entrevistado.sincronizado && entrevistadoRealm && entrevistado.idLocal==''){
                       // console.log('Atualizando imóvel existente:', entrevistado);
                              const entrevistadoPadrao ={
                                    ...entrevistado,
                                    localidade: entrevistado.localidade.id,
                                };

                                realmInstance.create('Entrevistado', entrevistadoPadrao, true);
                    }else{
                       // console.log('Inserindo novo imóvel ou atualizando imóvel com condições diferentes:', entrevistado);
                        const entrevistadoPadrao ={
                            ...entrevistado,
                           localidade: entrevistado.localidade.id,
                        };

                        realmInstance.create('Entrevistado', entrevistadoPadrao, true);
                    }
                           
                });
              
            });

            resolve();

        }catch(error){
            reject(error)
        }
        
    });

};
  
export const salvarEntrevistado = (entrevistado: EntrevistadoType): Promise<EntrevistadoType> =>{

    return new Promise((resolve, reject)=>{
           
        try{
            let entrevistadoSalvo;
            realmInstance.write(()=>{
              const entrevistadoRealm = realmInstance.objects('Localidade')
              .filtered(`id == ${entrevistado.id}`)[0];
                    
                    if(entrevistado.sincronizado && entrevistadoRealm && entrevistado.idLocal==''){
                     
                        const entrevistadoPadrao ={
                         ...entrevistado,
                        localidade: entrevistado.localidade.id,
                        };
                        entrevistadoSalvo =  realmInstance.create('Entrevistado', entrevistadoPadrao, true);
                    }else{
                        const entrevistadoPadrao ={
                            ...entrevistado,
                           localidade: entrevistado.localidade.id,
                        };
                        entrevistadoSalvo =  realmInstance.create('Entrevistado', entrevistadoPadrao, true);
                    }
            });
            if(entrevistadoSalvo){
                const cleanEntrevistado = JSON.parse(JSON.stringify(entrevistadoSalvo));
                resolve(cleanEntrevistado);
            }else{
                throw new Error("Erro ao recuperar o entrevistado Salvo.");
            }
            

        }catch(error){
            reject(error)
        }
        
    });

};

export const salvarEntrevistadoQueue = (entrevistado: EntrevistadoInput): Promise<EntrevistadoType> =>{
    

        return new Promise((resolve, reject) => {
            // Função para gerar um ID aleatório
            const Id = () => {
                const min = Math.ceil(0);
                const max = -Math.floor(1000);
                return Math.floor(Math.random() * (max - min + 1)) + min; 
            };
                   
            try {
                let entrevistadoSalvo;
                realmInstance.write(() => {
                   
                    const entrevistadoPadrao = {
                        ...entrevistado,
                        id: Id(), 
                        localidade: entrevistado.localidade.id,
                    };
                    console.log('salvarImovelqueue', entrevistadoPadrao)
                    entrevistadoSalvo = realmInstance.create('Entrevistado', entrevistadoPadrao, true);
                    console.log('salvarImovelQueue - Ok!')
                });
                if(entrevistadoSalvo){
                    const cleanEntrevistado = JSON.parse(JSON.stringify(entrevistadoSalvo));
                    resolve(cleanEntrevistado);
                }else{
                throw new Error("Erro ao recuperar o entrevistado Salvo.");
                }
                
            } catch (error) {
                reject(error);
            }
        });
        

};

export const getEntrevistados = (localidade:number): EntrevistadoType[]=>{

  
    const query = `localidade == ${localidade}`;
   
  
    const entrevistadosRealm = realmInstance.objects<EntrevistadoType>('Entrevistado').filtered(query).slice();
    
    const entrevistadosLimpos = JSON.parse(JSON.stringify(entrevistadosRealm));

 

    return entrevistadosLimpos as EntrevistadoType[];
}


export const getEntrevistadosDessincronizados = (localidade:number): EntrevistadoType[]=>{

   
    const query = `localidade == ${localidade} and sincronizado == false`;

    const entrevistadoQueue = realmInstance.objects<EntrevistadoType>('Entrevistado').filtered(query).slice();

    const cleanedQueue = JSON.parse(JSON.stringify(entrevistadoQueue));

    return cleanedQueue as EntrevistadoType[];
};
  


export const getAllEntrevistados = (): EntrevistadoType[] => {
    const entrevistados = realmInstance.objects<EntrevistadoType>('Entrevistado');
    const cleanEntrevistados = JSON.parse(JSON.stringify(entrevistados));
    console.log('getAllEntrevistados', cleanEntrevistados);
    return cleanEntrevistados as EntrevistadoType[];
};







export const apagarEntrevistadoQueue = (idLocal: string) => {
    try {
        realmInstance.write(() => {
            const query = `idLocal == "${idLocal}"`;
            const entrevistadoExcluir = realmInstance.objects<EntrevistadoType>('Entrevistado').filtered(query);

            if (entrevistadoExcluir.length > 0) {
                realmInstance.delete(entrevistadoExcluir);
            }
        });
       
    } catch (error) {
        console.error('Erro ao excluir entrevistado da fila:', error);
    }
};

export const apagarEntrevistadoSyncronizado = (entrevistadoId: number) => {
    try {
        realmInstance.write(() => {
           
            const query = `id == "${entrevistadoId}"`;
            const entevistadoAExcluir = realmInstance.objects<EntrevistadoType>('Entrevistado').filtered(query);

            if (entevistadoAExcluir.length > 0) {

             realmInstance.delete(entevistadoAExcluir);
             
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir entrevistado da fila:', error);
    }
};




export const apagarQueueEntrevistados = () => {
    try {
        realmInstance.write(() => {
            const entrevistadoExcluir = realmInstance.objects<EntrevistadoType>('Entrevistado');

            if (entrevistadoExcluir.length > 0) {
                realmInstance.delete(entrevistadoExcluir);
                console.log(`${entrevistadoExcluir.length} entrevistados excluídos com sucesso.`);
            } else {
                console.log('Nenhum entrevistado encontrado para exclusão.');
            }
        });
    } catch (error) {
        console.error('Erro ao excluir entrevistados da fila:', error);
    }
};



