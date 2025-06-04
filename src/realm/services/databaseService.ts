import Realm from 'realm';
import { FaunaSchema } from '../models/FaunaSchema';
import { ParticipacaoInstituicaoSchema } from '../models/ParticipacaoInstituicaoSchema';
import { ServicosComunicacaoSchema } from '../models/ServicosComunicacaoSchema';
import { AguaSchema } from '../models/aguaSchema';
import { AtividadeProdutivaSchema } from '../models/atividadeProdutivaSchema';
import { AvesSchema } from '../models/avesSchema';
import { BenfeitoriaSchema } from '../models/benfeitoriaSchema';
import { CreditoSchema } from '../models/creditoSchema';
import { DependenciasSchema } from '../models/dependenciaSchema';
import { EmbarcacaoSchema } from '../models/embarcacaoSchema';
import { EntrevistadoSchema } from '../models/entrevistadoSchema';
import { EscolaSchema } from '../models/escolaSchema ';
import { EspecieSchema } from '../models/especieSchema';
import { ImovelSchema } from '../models/imoveisSchema';
import { IndicadoConsultaPublicaSchema } from '../models/indicadoConsultaPublicaSchema';
import { LocalidadeSchema } from "../models/localidadeSchema";
import { MamiferosSchema } from '../models/mamiferosSchema';
import { MoradorSchema } from '../models/moradorSchema';
import { OutrosServicosSchema } from '../models/outrosServicosSchema';
import { PeixesSchema } from '../models/peixesSchema';
import { PostoSchema } from '../models/postoSchema ';
import { QuantidadePescaPorTipoSchema } from '../models/quantidadePescaPorTipo';
import { RendaOutrasFontesSchema } from '../models/rendaOutrasFontesSchema';
import { RepteisSchema } from '../models/repteisSchema';
import { VegetacaoSchema } from '../models/vegetacaoSchema';
import { ViolenciaSchema } from '../models/violenciaSchema';
import { BenfeitoriaAlimentosSchema } from '../models/benfeitoriaAlimentos';

const allSchemas = [LocalidadeSchema,
                     ImovelSchema, 
                     PostoSchema, 
                     EscolaSchema, 
                     BenfeitoriaSchema,
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
                     AtividadeProdutivaSchema,
                     OutrosServicosSchema,
                     BenfeitoriaAlimentosSchema                     
                   ]; 

export const initializeRealm =()=>{
    return new Realm({schema: allSchemas})
};


export const realmInstance = initializeRealm();