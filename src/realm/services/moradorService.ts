
import { MoradorType } from '../../shared/types/MoradorType';
import { realmInstance } from './databaseService';

export const salvarMorador = (moradores: MoradorType[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                moradores.forEach(morador => {
                   
                    const moradorCorrigido = {
                        ...morador,
                        benfeitoria: morador.benfeitoria.id
                    }
                    realmInstance.create('Morador', moradorCorrigido, true);
                });
                resolve();
            });
        } catch (error) {
            reject();
        }
    });
}

export const getMoradores = (benfeitoria: number): MoradorType[] => {
   
    const query = `benfeitoria == ${benfeitoria}`;
    const moradoresRealm = realmInstance.objects<MoradorType>('Morador').filtered(query).slice();
    const moradoresLimpos = JSON.parse(JSON.stringify(moradoresRealm));
    return moradoresLimpos as MoradorType[];
};
