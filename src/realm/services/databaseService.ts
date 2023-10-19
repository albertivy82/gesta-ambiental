import Realm from 'realm';
import { LocalidadeSchema } from "../models/localidadeSchema";
import { CoordenadaSchema } from '../models/coordenadaSchema';

const allSchemas = [LocalidadeSchema, CoordenadaSchema]; 

export const initializeRealm =()=>{
    return new Realm({schema: allSchemas})
};


export const realmInstance = initializeRealm();