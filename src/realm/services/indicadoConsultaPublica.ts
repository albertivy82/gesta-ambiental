import { IndicadoConsultaPublica } from '../../shared/types/IndicadoConsultaPublicaType';
import { realmInstance } from './databaseService';

export const salvarIndicadoConsultaPublica = (indicado: IndicadoConsultaPublica) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
               
                    realmInstance.create('IndicadoConsultaPublica', indicado, true);
                
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

export const getServicosIndicadoConsultaPublica = (entrevistador: number): IndicadoConsultaPublica => {
    const query = `entrevistador == ${entrevistador}`;

    const indicado = realmInstance.objects<IndicadoConsultaPublica>('IndicadoConsultaPublica').filtered(query).slice();

    const cleanIndicado = JSON.parse(JSON.stringify(indicado));

    return cleanIndicado;
};
