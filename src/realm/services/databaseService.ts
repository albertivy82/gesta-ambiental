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
import { ViolenciaSchema } from '../models/violenciaSchema';
import { MamiferosSchema } from '../models/mamiferosSchema';
import { RepteisSchema } from '../models/repteisSchema';
import { PeixesSchema } from '../models/peixesSchema';
import { AguaSchema } from '../models/aguaSchema';
import { EntrevistadoSchema } from '../models/entrevistadoSchema';
import { IndicadoConsultaPublicaSchema } from '../models/indicadoConsultaPublicaSchema';
import { QuantidadePescaPorTipoSchema } from '../models/quantidadePescaPorTipo';
import { EmbarcacaoSchema } from '../models/embarcacaoSchema';
import { EspecieSchema } from '../models/especieSchema';
import { MoradorSchema } from '../models/moradorSchema';
import { ParticipacaoInstituicaoSchema } from '../models/ParticipacaoInstituicaoSchema';
import { CreditoSchema } from '../models/creditoSchema';
import { RendaOutrasFontesSchema } from '../models/rendaOutrasFontesSchema';
import { AtividadeProdutivaSchema } from '../models/atividadeProdutivaSchema';

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
                     MamiferosSchema,
                     RepteisSchema,
                     VegetacaoSchema,
                     ViolenciaSchema,
                     PeixesSchema,
                     AguaSchema,
                     EntrevistadoSchema,
                     IndicadoConsultaPublicaSchema,
                     QuantidadePescaPorTipoSchema,
                     EmbarcacaoSchema,
                     EspecieSchema, 
                     MoradorSchema,
                     ParticipacaoInstituicaoSchema,
                     CreditoSchema,
                     RendaOutrasFontesSchema,
                     AtividadeProdutivaSchema
                   ]; 

export const initializeRealm =()=>{
    return new Realm({schema: allSchemas})
};


export const realmInstance = initializeRealm();