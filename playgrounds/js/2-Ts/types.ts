function ejemplo(numero1: number, texto: string): number {return numero1+numero1 }
typeof ejemplo
//function ejemplo(a: number, b: number): number

type parametro=Parameters <typeof ejemplo>[1] ///retorna string

//parametro es string
function ejemplo2(texto: parametro): number {return 3 }

/////////////////////// Generics

function identidad<T>(valor: T): T { 
    return valor; 
}
let texto = identidad<string>("Hola"); // T = string
let numero = identidad<number>(123);   // T = number
// Y lo mejor: TypeScript puede adivinarlo solo (inferencia):
let texto2 = identidad("Hola"); // ¡Automáticamente sabe que T es 'string'!