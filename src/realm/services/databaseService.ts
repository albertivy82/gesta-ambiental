import Realm from 'realm';
import { ParticipacaoInstituicaoSchema } from '../models/ParticipacaoInstituicaoSchema';
import { ServicosComunicacaoSchema } from '../models/ServicosComunicacaoSchema';
import { AguaSchema } from '../models/aguaSchema';
import { AtividadeProdutivaSchema } from '../models/atividadeProdutivaSchema';
import { BenfeitoriaAlimentosSchema } from '../models/benfeitoriaAlimentos';
import { BenfeitoriaSchema } from '../models/benfeitoriaSchema';
import { CreditoSchema } from '../models/creditoSchema';
import { DependenciasSchema } from '../models/dependenciaSchema';
import { EntrevistadoSchema } from '../models/entrevistadoSchema';
import { EscolaSchema } from '../models/escolaSchema ';
import { ImovelSchema } from '../models/imoveisSchema';
import { LocalidadeSchema } from "../models/localidadeSchema";
import { MoradorSchema } from '../models/moradorSchema';
import { OutrosServicosSchema } from '../models/outrosServicosSchema';
import { PostoSchema } from '../models/postoSchema ';
import { RendaOutrasFontesSchema } from '../models/rendaOutrasFontesSchema';

const allSchemas = [LocalidadeSchema,
                     ImovelSchema, 
                     PostoSchema, 
                     EscolaSchema, 
                     BenfeitoriaSchema,
                     ServicosComunicacaoSchema,
                     DependenciasSchema,
                     AguaSchema,
                     EntrevistadoSchema,
                     MoradorSchema,
                     ParticipacaoInstituicaoSchema,
                     CreditoSchema,
                     RendaOutrasFontesSchema,
                     AtividadeProdutivaSchema,
                     OutrosServicosSchema,
                     BenfeitoriaAlimentosSchema, 
                                        
                   ]; 

export const initializeRealm =()=>{
    return new Realm({schema: allSchemas})
};


export const realmInstance = initializeRealm();