import * as LIB from "./algo/lib.js";

const str = LIB.alphaUtf8("Qui va subir une intervention chirurgicale ce Jeudi vingt-deux septembre deux-mille-vingt-deux ?").toLowerCase();
const almObj = LIB.almo(str);
console.log(JSON.stringify(almObj));