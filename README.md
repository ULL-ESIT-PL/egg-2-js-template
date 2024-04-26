# Práctica: "Generating JS" 

## Objetivos

Escriba un traductor desde el lenguaje [Egg](https://eloquentjavascript.net/12_language.html) hasta el lenguaje JavaScript.

Reutilice su parser para  crear los árboles sintácticos. Añada funciones de recorrido de los ASTs para ir generando el código JS.

## El ejecutable

Añada una opción `-j --js`a su ejecutable o bien en su directorio `bin`  un nuevo ejecutable `egg2js.js` que permita hacer la traducción
 

## Un ejemplo sencillo: examples/times.egg

Cuando al programa se le proporciona una entrada con expresiones Egg de tipo *apply* como estas:

```ruby
$ cat examples/times.egg
print(
 +(3,
    *(4,
      5
    )
  ),
  -(9,3)
)
```

debería dar como salida un fichero `examples/times.js` con la evaluación correspondiente:

```js
$ bin/egg.js -j examples/times
$ cat examples/times.js 
console.log((3 + (4 * 5)),(9 - 3))
```

## Un ejemplo mas complejo: Manejo de Ámbitos

Cuando se declaren variables y funciones y se creen nuevos ámbitos como en este ejemplo (supongamos que además de las funciones el `do` tiene su propio ámbito):

```js
✗ cat examples/hello-scope.egg
print("computed value = ", 
  do(
    def(x,4),
    def(inc, fun(w, do(
        def(y, 999),
        +(w,1)
      ) # do
    ) # fun
    ),# def
    def(z,-1),
    set(x, inc(x))
  )
)
```

La traducción debe producir el código JavaScript equivalente:

```
✗ bin/egg.js -j examples/hello-scope.egg
✗ cat examples/hello-scope.js              
```
```js
console.log("computed value = ", (() => {
  let $x = 4
  let $inc =
    function ($w) {
      return (() => {
        let $y = 999
        return ($w + 1)
      })()

    }

  let $z = -1
  return $x = $inc($x)
})()
)
```

Note como prefijamos las variables del fuente con "`$`"  de manera que `def(x,4)` se convierte en:

```js
let $x = 4
```

esto es para que las *variables traducidas* no **colisionen** contra variables auxiliares que pudieramos necesitar introducir para dar soporte a la traducción.

Obsérvese como es la traducción que hemos hecho de un `do`: 

```js
do(
  def(y, 999),
  +(w,1)
) # do
```

lo hemos convertido en:

```js
(() => {
  let $y = 999
  return ($w + 1)
})()
```

Vea como se crea el ámbito mediante una función anónima `(() => { ... })()` que se ejecuta sobre la marcha *de manera que retorna la última expresión evaluada*.  

No hemos hecho uso de una traducción directa de un `do` por una sentencia compuesta 

```js
{ ... }
```
y nos hemos tomado estas molestias para respetar la semántica de Egg.

## Traduciendo applys sobre applys

Nótese que en Egg el operador de un apply puede ser a su vez un apply como en este ejemplo con la expresión `f(2)(4)`:

```js
➜  crguezl-egg-2-js-2021 git:(operator) ✗ cat examples/funfun.egg 
do(
  def(f, fun(x, fun(y, +(x,y)))),
  print(f(2)(4)) # 6
)
```

Es por tanto necesario traducir correctamente el operador: 

```js
(() => {
  let $f = function ($x) {
    return function ($y) {
      return ($x + $y)
    }

  }
  return console.log($f(2)(4))
})()
```

## Añadiendo Métodos a las Clases de los Nodos del AST

Una aproximación es añadir métodos `generateJS` a cada uno de los diferentes tipos de nodos del AST que se encarguen de la generación del código JS correspondiente a ese tipo de nodo:

```js
class Apply {
  ...
  generateJS() {
    let argsTranslations = this.args.map(x => x.generateJS())
    if (this.operator.type === 'word') {
      ...
    }
    else {
      ...
    }
  }
}
```

## Strategy Pattern Again: Un mapa de generadores de JS

Para facilitar la generación del código JS puede serle útil tener un módulo con un mapa de funciones de generación de código según el nombre del operador del nodo `APPLY` evitando en lo posible violar el principio OPEN/CLOSED:

```js
const util = require('util');
const ins = x => util.inspect(x, { depth: null});
let generateJS = Object.create(null);

const ARITHM_OPERATORS = [ "+", "-", ... ">>>" ];
  
ARITHM_OPERATORS.forEach(op => {
  generateJS[op] = function([left, right]) {
      return `(${left} ${op} ${right})`;
    }
});
  
generateJS['print'] = function(...args) {
   return `console.log(${args})\n`;
}

generateJS['do'] = function(statements) {
   ...
}

generateJS['def'] = function([variable, initexpression]) {
  ...
  
  return translation;
}


generateJS['='] = generateJS['set'] = function([variable, expression]) {
  ...

  return translation;
}

generateJS['fun'] = function(parameters) {
  ...

  return translation;
}

...

module.exports = {
  generateJS,
  ...
};
```

## Simplificaciones

No hace falta añadir comprobaciones de errores de ámbito ni de tipo en esta fase.
Esto es, se asume que el código Egg es correcto y las variables han sido declaradas antes de su uso y que son usadas de acuerdo a su tipo.

No hace falta que traduzca el total de su lenguaje Egg, sólo las funcionalidades mas importantes. Deberían funcionar al menos los ejemplos usados en esta página.

Procure mantener la semántica de Egg pero no se complique si es difícil. Tanto si le resulta muy difícil o decide cambiarla en algún punto, hágalo notar en la documentación.


## Referencias

* [js-beautify](https://www.npmjs.com/package/js-beautify) npm module
* [Apuntes 2019/2020 de PL: Compilador de Egg a JS](https://ull-esit-pl-1819.github.io/introduccion/tfa/#compilador-de-egg-a-js)