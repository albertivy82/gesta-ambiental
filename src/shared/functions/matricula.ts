export const insertMaskInMatricula = (matricula:string)=>{

    return matricula
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{8})\d+?$/, '$1') // captura 2 numeros s

}