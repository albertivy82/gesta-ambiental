import { ServicosComunicacao } from "../../shared/types/ComunicacaoType";
import { realmInstance } from "./databaseService";

export const salvarSevicosComunicacao = (comunicacoes: ServicosComunicacao[]) => {

    return new Promise<void>((resolve, reject)=>{

        try{
            realmInstance.write(()=>{

                comunicacoes.forEach(comunicacao=>{
                    
                    const comunicacaoCorrigida={
                    ...comunicacao,

                    benfeitoria: comunicacao.benfeitoria.id

                    }

                    realmInstance.create('ServicosComunicacao', comunicacaoCorrigida, true);
                })

            })

            resolve();

        }catch(error){
            reject(error);
        }

    });
}

export const getComunicacaoes = (benfeitoria:number):ServicosComunicacao[] =>{
    
    const query = `benfeitoria == ${benfeitoria}`

    const ComunicacaoesRealm = realmInstance.objects<ServicosComunicacao>('ServicosComunicacao').filtered(query).slice();

    const ComunicacaoesCorrigidas = JSON.parse(JSON.stringify(ComunicacaoesRealm));

    return ComunicacaoesCorrigidas as ServicosComunicacao[];
}