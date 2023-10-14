import Realm from 'realm';
import { LocalidadeSchema } from "../models/localidadeSchema";

const allSchemas = [LocalidadeSchema]; 

export const initializeRealm =()=>{
    return new Realm({schema: allSchemas})
};


export const realmInstance = initializeRealm();