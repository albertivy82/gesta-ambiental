
import { ParticipacaoInstituicao } from '../../shared/types/ParticipacaoInstituicaoType';
import { realmInstance } from './databaseService';

export const salvarParticipacaoInstituicao = (participacoes: ParticipacaoInstituicao[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                participacoes.forEach(participacao => {
                    const participacaoCorrigida = {
                        ...participacao,
                        morador: participacao.morador.id
                    }
                    realmInstance.create('ParticipacaoInstituicao', participacaoCorrigida, true);
                });
                resolve();
            });
        } catch (error) {
            reject();
        }
    });
}

export const getParticipacoesInstituicoes = (morador: number): ParticipacaoInstituicao[] => {
   
    const query = `morador == ${morador}`;
    const participacoesRealm = realmInstance.objects<ParticipacaoInstituicao>('ParticipacaoInstituicao').filtered(query).slice();
    const participacoesLimpos = JSON.parse(JSON.stringify(participacoesRealm));
    return participacoesLimpos as ParticipacaoInstituicao[];
};
