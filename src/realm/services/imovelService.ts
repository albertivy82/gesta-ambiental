import { imovelInput } from "../../shared/types/imovelInput";
import { imovelBody } from "../../shared/types/imovelType";
import { realmInstance } from "./databaseService";

export const salvarImoveis = (imoveis: imovelBody[]) =>{

    return new Promise<void>((resolve, reject)=>{
           
        try{
            realmInstance.write(()=>{

                imoveis.forEach(imovel=>{

                    //essa duplicação de código foi feita para controlar atualizações de todas os registros
                    //a primeira condição entram apenas atualizações
                    //no segundo novos registros
                    const imovelRealm = realmInstance.objects('Imovel').filtered(`id == ${imovel.id}`)[0];
                    //console.log('Imóvel recuperado do Realm:', imovelRealm);
                    if(imovel.sincronizado && imovelRealm && imovel.idLocal==''){
                       // console.log('Atualizando imóvel existente:', imovel);
                              const imovelPadrao ={
                                    ...imovel,
                                    localidade: imovel.localidade.id,
                                };

                                realmInstance.create('Imovel', imovelPadrao, true);
                    }else{
                       // console.log('Inserindo novo imóvel ou atualizando imóvel com condições diferentes:', imovel);
                        const imovelPadrao ={
                            ...imovel,
                           localidade: imovel.localidade.id,
                        };

                        realmInstance.create('Imovel', imovelPadrao, true);
                    }
                   
                
                });


               
            });

            resolve();

        }catch(error){
            reject(error)
        }
    
    
    
    });

};

export const salvarImovelQueue = (imovel: imovelInput) =>{


        return new Promise<void>((resolve, reject) => {
            // Função para gerar um ID aleatório
            const Id = () => {
                const min = Math.ceil(0);
                const max = -Math.floor(1000);
                return Math.floor(Math.random() * (max - min + 1)) + min; 
            };
                   
            try {
                realmInstance.write(() => {
                   
                    const imovelPadrao = {
                        ...imovel,
                        id: Id(), 
                        localidade: imovel.localidade.id,
                    };
                    console.log(imovelPadrao.id)
                    realmInstance.create('Imovel', imovelPadrao, true);
                });
        
                resolve();
            } catch (error) {
                reject(error);
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
};

export const apagarImovelQueue = (imovelidLocal: string) => {
    try {
        realmInstance.write(() => {
           
            const query = `idLocal == "${imovelidLocal}"`;
            const imovelAExcluir = realmInstance.objects<imovelBody>('Imovel').filtered(query);

            if (imovelAExcluir.length > 0) {
                realmInstance.delete(imovelAExcluir);
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir imóvel da fila:', error);
    }
};

export const apagarImovelSyncronizado = (imovelId: number) => {
    try {
        realmInstance.write(() => {
           
            const query = `id == "${imovelId}"`;
            const imovelAExcluir = realmInstance.objects<imovelBody>('Imovel').filtered(query);

            if (imovelAExcluir.length > 0) {

             realmInstance.delete(imovelAExcluir);
             
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir imóvel da fila:', error);
    }
};


/*
função de limpesa do banco-> criar componente para todas as categorias
export const apagarTodosImoveis = () => {
    try {
        realmInstance.write(() => {
           
            
            const imovelAExcluir = realmInstance.objects<imovelBody>('Imovel');

            if (imovelAExcluir.length > 0) {
                imovelAExcluir.forEach(imovel=>{
                        realmInstance.delete(imovel);
                })
            } 
        });
    } catch (error) {
        console.error('Erro ao excluir imóvel da fila:', error);
    }
};
*/

