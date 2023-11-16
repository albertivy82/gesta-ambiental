import Realm from 'realm';
import { LocalidadeSchema } from "../models/localidadeSchema";
import { CoordenadaSchema } from '../models/coordenadaSchema';
import { ImovelSchema } from '../models/imoveisSchema';
import { PostoSchema } from '../models/postoSchema ';
import { EscolaSchema } from '../models/escolaSchema ';
import { BenfeitoriaSchema } from '../models/benfeitoriaSchema';

const allSchemas = [LocalidadeSchema,
                     CoordenadaSchema, 
                     ImovelSchema, 
                     PostoSchema, 
                     EscolaSchema, 
                     BenfeitoriaSchema]; 

export const initializeRealm =()=>{
    return new Realm({schema: allSchemas})
};


export const realmInstance = initializeRealm();