import { CreditoType } from '../../shared/types/CreditoType';
import { realmInstance } from './databaseService';

export const salvarCredito = (creditos: CreditoType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                creditos.forEach(credito => {
                    const creditoCorrigido = {
                        ...credito,
                        benfeitoria: credito.benfeitoria.id                     };
                    realmInstance.create('Credito', creditoCorrigido, true);
                });
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
}

export const getCreditos = (benfeitoria: number): CreditoType[] => {
    const query = `benfeitoria == ${benfeitoria}`;
    const creditosRealm = realmInstance.objects<CreditoType>('Credito').filtered(query).slice();
    const creditosLimpos = JSON.parse(JSON.stringify(creditosRealm));
    return creditosLimpos as CreditoType[];
};
