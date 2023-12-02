import { EmbarcacaoType } from "../../shared/types/EmbarcacaoType";
import { realmInstance } from "./databaseService";

export const salvarEmbarcacao = (embarcacoes: EmbarcacaoType[]) => {
    
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                embarcacoes.forEach(embarcacao => {

                    const embarcacaoCorrigida = {

                        ...embarcacao,
                        pescaArtesanal: embarcacao.pescaArtesanal.id

                    }

                    realmInstance.create('Embarcacao', embarcacaoCorrigida, true);
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export const getEmbarcacao = (pescaArtesanal: number): EmbarcacaoType[] =>{
   
    const query = `pescaArtesanal == ${pescaArtesanal}`

    const embarcacaoRealm = realmInstance.objects<EmbarcacaoType>('Embarcacao').filtered(query).slice()

    const embarcacaoCleaned = JSON.parse(JSON.stringify(embarcacaoRealm))

    return embarcacaoCleaned as EmbarcacaoType[]
}