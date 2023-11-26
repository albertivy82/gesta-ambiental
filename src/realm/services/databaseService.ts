import Realm from 'realm';
import { ServicosComunicacaoSchema } from '../models/ServicosComunicacaoSchema';
import { AlimentacaoSchema } from '../models/alimentacaoSchema';
import { BenfeitoriaSchema } from '../models/benfeitoriaSchema';
import { ComprasSchema } from '../models/comprasSchema';
import { CoordenadaSchema } from '../models/coordenadaSchema';
import { EscolaSchema } from '../models/escolaSchema ';
import { ImovelSchema } from '../models/imoveisSchema';
import { LocalidadeSchema } from "../models/localidadeSchema";
import { PostoSchema } from '../models/postoSchema ';
import { DependenciasSchema } from '../models/dependenciaSchema';
import { AvesSchema } from '../models/avesSchema';
import { FaunaSchema } from '../models/FaunaSchema';
import { VegetacaoSchema } from '../models/vegetacaoSchema';

const allSchemas = [LocalidadeSchema,
                     CoordenadaSchema, 
                     ImovelSchema, 
                     PostoSchema, 
                     EscolaSchema, 
                     BenfeitoriaSchema,
                     AlimentacaoSchema,
                    ComprasSchema,
                    ServicosComunicacaoSchema,
                    DependenciasSchema,
                    AvesSchema,
                    FaunaSchema,
                    VegetacaoSchema,
                
                
                ]; 

export const initializeRealm =()=>{
    return new Realm({schema: allSchemas})
};


export const realmInstance = initializeRealm();