%{
  const {ValueTranslator, WordTranslator, ApplyTranslator} = require('./ast-translate');
  const inspect = require('util').inspect;
  const ins = (x) => inspect(x, {depth: null });
  
  function makeApplyTree(w, calls) {
    //console.log('word = '+ins(w)+' calls = '+ins(calls));
    let first = new ApplyTranslator(w, calls.shift())
    // debugger;
    if (calls.length === 0) return first;
    let result = calls.reduce(
      (s, args) => {
        return new ApplyTranslator(s, args);
      }, 
      first
    ); 
    //console.log(ins(result));
    return result;
  }
%}

%lex
%%

\s+|"#".*|"/*"(.|\n)*?"*/"                /* skip */
","                                       return 'COMMA';
[({]                                       return 'LP';
[)}]                                       return 'RP';
\"((?:[^"\\]|\\.)*)\"                     return 'STRING';
[+-]?\d*\.?\d+(?:[eE][-+]?\d+)?           yytext = Number(yytext); return 'NUMBER';
(?!\$)([^\s(),"])+                        return 'WORD';
.                                         return 'ERROR'
/lex

%%

start
  : expression  
    { 
        //console.log(ins($1)); 
        $$ = $1; 
        return $$; 
    }
  ;

expression
  : STRING { $$ = new ValueTranslator({ value: $1 }); }
  | NUMBER { $$ = new ValueTranslator({ value: $1 }); }
  | word apply 
    { 
      if ($apply.length === 0) 
        $$ = $1; 
      else $$ = makeApplyTree($word, $apply)
    }
  ;

word
  : WORD 
    { 
      $$ = new WordTranslator({value: $1}); 
    } 
  ;

apply
  :  /* empty */ { $$ = []; }
  | LP RP apply
     {
        $$ = [[]].concat($apply); 
     }
  | LP expressionlist RP apply 
     {
        $$ = [ $expressionlist ].concat($apply); 
     }
  ;

expressionlist
  : expression { $$ = [ $1 ]; }
  | expression COMMA expressionlist { $$ = [ $1 ].concat($3); }
  ;