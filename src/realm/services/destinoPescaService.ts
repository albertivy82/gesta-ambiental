import { DestinoPescaType } from '../../shared/types/DestinoPescaType';
import { realmInstance } from './databaseService';

export const salvarDestinoPesca = (destinosPesca: DestinoPescaType[]): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                destinosPesca.forEach(destinoPesca => {

                    const destinoPescaCoorigida = {
                            ...destinoPesca,
                            pescaArtesanal: destinoPesca.pescaArtesanal.id
                    }
                    realmInstance.create('DestinoPesca', destinoPesca, true);
                });
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
};

export const getDestinosPesca = (pescaArtesanal:number):DestinoPescaType[] => {

    const query = `pescaArtesanal == ${pescaArtesanal}`;

    const destinoPescaRealm = realmInstance.objects<DestinoPescaType>('DestinoPesca').filtered(query).slice();
    
    const cleanDestinoPesca = JSON.parse(JSON.stringify(destinoPescaRealm));

    return cleanDestinoPesca as DestinoPescaType[];
};
