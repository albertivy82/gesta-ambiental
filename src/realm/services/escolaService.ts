import { escolaInput } from "../../shared/types/EscolaInput";
import { EscolaType } from "../../shared/types/EscolaType"
import { realmInstance } from "./databaseService"

export const salvarEscolas = (escolas: EscolaType[]) =>{
   
    return new Promise<void>((resolve, reject)=>{
           
        try{
            realmInstance.write(()=>{

                escolas.forEach(escola=>{
                    //essa duplicação de código foi feita para controlar atualizações de todas os registros
                    //a primeira condição entram apenas atualizações
                    //no segundo novos registros
                   
                    const escolaRealm = realmInstance.objects('Escola').filtered(`id == ${escola.id}`)[0];
                    //console.log('Imóvel recuperado do Realm:', imovelRealm);
                    if(escola.sincronizado && escolaRealm && escola.idLocal==''){
                       
                              const escolaPadrao ={
                                    ...escola,
                                    localidade: escola.localidade.id,
                                };

                                realmInstance.create('Escola', escolaPadrao, true);
                    }else{
                       // console.log('Inserindo novo imóvel ou atualizando imóvel com condições diferentes:', imovel);
                        const escolaPadrao ={
                            ...escola,
                           localidade: escola.localidade.id,
                        };

                        console.log("xxxxxxxxxxxxx", escolaPadrao)
                        realmInstance.create('Escola', escolaPadrao, true);
                    }
                   
                
                });


               
            });

            resolve();

        }catch(error){
            reject(error)
        }
    
    
    
    });

};


export const getEscolas = (localidadeId:number): EscolaType[]=>{

    const query = `localidade == ${localidadeId}`;

    const escolasRealm = realmInstance.objects<EscolaType>('Escola').filtered(query).slice();

    const escolasLimpas = JSON.parse(JSON.stringify(escolasRealm));

    return escolasLimpas as EscolaType[];

}

export const salvarEscola= (escola:EscolaType): Promise<EscolaType> => {
    return new Promise((resolve, reject) => {

        try {
            let escolaSalvo;
            realmInstance.write(() => {
                const escolaExistente = realmInstance
                    .objects<EscolaType>("Escola")
                    .filtered(`id == ${escola.id}`)[0];

                const escolaPadrao = {
                    ...escola,
                    localidade: escola.localidade.id,
                };

                // Atualiza somente se sincronizado ou se não existir ainda
                if (escola.sincronizado && escolaExistente && escola.idLocal === '') {
                    escolaSalvo = realmInstance.create("Escola", escolaPadrao, true);
                } else {
                    escolaSalvo = realmInstance.create("Escola", escolaPadrao, true);
                }
            });
    if (escolaSalvo) {
        const cleanEscola = JSON.parse(JSON.stringify(escolaSalvo))
        resolve(cleanEscola as EscolaType);
    } else {
    throw new Error("Erro ao recuperar a escola salva.");
    }
           
        } catch (error) {
            reject(error);
        }
    });
};




export const getEscolasDessincronizadas = (localidade: number): EscolaType[] => {

    const query = `localidade == ${localidade} and sincronizado == false`;

    const escolasQueue = realmInstance.objects<EscolaType>('Escola').filtered(query).slice();

    const cleanedQueue = JSON.parse(JSON.stringify(escolasQueue));

    return cleanedQueue as EscolaType[];
};

export const apagarEscolaQueue = (escolaIdLocal: string) => {
    try {
        realmInstance.write(() => {
           
            const query = `idLocal == "${escolaIdLocal}"`;
            const escolaAExcluir = realmInstance.objects<EscolaType>('Escola').filtered(query);

            if (escolaAExcluir.length > 0) {
                realmInstance.delete(escolaAExcluir);
            } 
        });
    } catch (error) {
        console.error(`Erro ao excluir escola da fila com idLocal ${escolaIdLocal}:`, error);
    }
};

export const salvarEscolaQueue = (escola: escolaInput) =>{


    return new Promise<void>((resolve, reject) => {
        // Função para gerar um ID aleatório
        const Id = () => {
            const min = Math.ceil(0);
            const max = -Math.floor(1000);
            return Math.floor(Math.random() * (max - min + 1)) + min; 
        };
               
        try {
            realmInstance.write(() => {
               
                const escolaPadrao = {
                    ...escola,
                    id: Id(), 
                    localidade: escola.localidade.id,
                };
                realmInstance.create('Escola', escolaPadrao, true);
            });
    
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};


 // Apagar escola sincronizado
 export const apagarEscolaSyncronizada = (escolaId: number) => {
    try {
      realmInstance.write(() => {
        const query = `id == ${escolaId}`;
        const escolaAExcluir = realmInstance.objects<EscolaType>("Escola").filtered(query);
        if (escolaAExcluir.length > 0) {
          realmInstance.delete(escolaAExcluir);
        }
      });
    } catch (error) {
      console.error("Erro ao excluir escola sincronizado:", error);
    }
  };
  

