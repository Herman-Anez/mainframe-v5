# Tipos de Hocs (segun mi criterio) 


## 1 Mutadores

Estos Hocs alteran las propiedades del componente

### 1 Secuestra atributos

Hocs que agarran componentes con *atributos Obligatorios*  y los implementa retornando un componente que ya no necesita esos atributos

#### 1.1.1 Le asigna un valor por defecto

f(a,b,c)
h()(f())=f(b,c) // a=fefault

#### 1.1.2 Le asigna un nuevo como constante

f(a,b,c)
h(z)(f())=f(b,c) // a=z

#### 1.1.3 mixto

f(a,b,c)
h()(f())=f(b,c) // a=fefault
h(z)(f())=f(b,c) // a=z

### 2 Inyecta atributos

Hocs que agarran componentes sin *atributos Obligatorios*  y los implementa retornando un componente que necesita el atributo nuevo