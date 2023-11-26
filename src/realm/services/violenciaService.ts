
import { ViolenciaType } from '../../shared/types/violenciaType';
import { realmInstance } from './databaseService';

export const salvarViolencias = (violencias: ViolenciaType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                violencias.forEach(violencia => {
                    const violenciaCorrigida = {
                        ...violencia,
                        benfeitoria: violencia.benfeitoria.id
                    };

                    realmInstance.create('Violencia', violenciaCorrigida, true);
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getViolencias = (benfeitoria: number): ViolenciaType[] => {
    const query = `benfeitoria == ${benfeitoria}`;

    const violenciasRealm = realmInstance.objects<ViolenciaType>('Violencia').filtered(query).slice();

    const violenciasCorrigidas = JSON.parse(JSON.stringify(violenciasRealm));

    return violenciasCorrigidas as ViolenciaType[];
};
