// Arquivo: especieService.ts
import { EspecieType } from "../../shared/types/EspecieType"; // Assumindo a existência deste tipo
import { realmInstance } from "./databaseService";

export const salvarEspecie = (especies: EspecieType[]) => {
    return new Promise<void>((resolve, reject) => {
        try {
            realmInstance.write(() => {
                especies.forEach(especie => {

                    const especieCorrigida = {
                        ...especie,
                        pescaArtesanal: especie.pescaArtesanal.id // Assumindo que pescaArtesanal é um objeto com um id
                    };

                    realmInstance.create('Especie', especieCorrigida, true);
                });
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

export const getEspecie = (pescaArtesanal: number): EspecieType[] => {
    const query = `pescaArtesanal == ${pescaArtesanal}`;

    const especieRealm = realmInstance.objects<EspecieType>('Especie').filtered(query).slice();

    const especieCleaned = JSON.parse(JSON.stringify(especieRealm));

    return especieCleaned as EspecieType[];
}
