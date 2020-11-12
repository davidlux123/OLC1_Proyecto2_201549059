import reconocido from './Reconocido'

export default class scannerPython 
{
    private errores : reconocido[];
    private tokens : reconocido[];
    private palabrasReservadas : string [];

    constructor()
    {
        this.errores = new Array();
        this.tokens = new Array();
        this. palabrasReservadas = [

            "public",
            "class",
            "interface",
            "void",
            "int",
            "boolean",
            "true",
            "false",
            "double",
            "String",
            "char",
            "for",
            "do",
            "while",
            "if",
            "else",
            "break",
            "continue",
            "return"
        
        ];
    }

    private existePalabraReservada(lexema : string): boolean
    {
        for (let i = 0; i < this.palabrasReservadas.length; i++)
        {
            if (lexema == this.palabrasReservadas[i])
            {
                return true;
            }
        }

        return false;
    }

    scannear(entrada : string)
    {
        entrada += '#'
        
        let fila = 1;
        let col = 0;
        let estado = 0;
        let lexema = "";

        for (let i = 0; i< entrada.length; i++)
        {
            let char = entrada [i];
            let charAscii = char.charCodeAt(0);

            let EOF : Boolean = char == '#' && i == (entrada.length-1)

            switch (estado)
            {
                case 0:

                    if(charAscii == 13 || charAscii == 9 || charAscii == 10 || charAscii == 32){

                        estado = 0;

                        if (charAscii == 10)
                        { 
                            col = 0;
                            fila++;
                        }
                    }
                    else if (char.match("[a-z]") || char.match("[A-Z]") || char == '_')
                    {
                        estado = 1;
                        col++;
                        lexema += char;
                    }
                    else if (char.match("[0-9]"))
                    {
                        estado = 2
                        col++;
                        lexema += char
                    }
                    else if (char == '&'||char == '|'||char == '>'||char == '<'||char == '='||char == '!'||char == '+'||char == '-')
                    {
                        estado = 11;
                        col++;
                        lexema += char
                    }
                    else if (char == '{'||char == '}'||char == '('||char == ')'||char == '['||char == ']'|| char == '^'||char == '*'||char == ','|| char == '.'|| char == ';')
                    {
                        estado = 0;
                        col++;
                        this.tokens.push(new reconocido("simbolo", fila, col, char))                        
                    }
                    else if (char == "\"")
                    {
                        estado = 5;
                        col++;
                        lexema += char;
                    }
                    else if (char == "'")
                    {
                        estado = 6;
                        col++;
                        lexema += char;
                    }
                    else if (char == "/")
                    {
                        estado = 7
                        col++;
                        lexema += char
                    }
                    else
                    {
                        if(EOF)
                        {
                            col++;
                            this.tokens.push(new reconocido("EOF", fila, col, "#"))
                        }
                        else 
                        {
                            estado = 0
                            col++;
                            this.errores.push(new reconocido("lexico",fila, col, "El caracter '"+char+"' no pertenece al lenguaje"));
                        }
                        
                    } 
                    
                    break;

                case 1:

                    if (char.match("[a-z]") || char.match("[A-Z]") || char == '_' || char.match("[0-9]"))
                    {
                        estado = 1;
                        col++;
                        lexema += char;
                    }
                    else 
                    {
                        if(this.existePalabraReservada(lexema))
                        {
                            if (lexema == "true" || lexema == "false") 
                            {
                                this.tokens.push(new reconocido("booleano", fila, col, lexema))  

                            }else if (lexema == "int" ||lexema == "double" || lexema == "String" ||lexema == "char" ||lexema == "boolean" )
                            {
                                this.tokens.push(new reconocido("Tipo primitivo", fila, col, lexema))
                            }
                            else if (lexema == "else")
                            {
                                this.tokens.push(new reconocido("else", fila, col, lexema))
                            }
                            else 
                            {
                                this.tokens.push(new reconocido("Palabra reservada", fila, col, lexema))
                            }
                            
                        }
                        else
                        {
                            this.tokens.push(new reconocido("ID", fila, col, lexema))
                        }

                        i--;
                        estado = 0;
                        lexema = "";
                        
                    }
                    
                    break;

                case 2:
                    
                    if (char.match("[0-9]"))
                    {
                        estado = 2;
                        col++;
                        lexema += char;  

                    }
                    else if (char == '.')
                    {
                        estado = 3;
                        col++;
                        lexema += char

                    }
                    else
                    {
                        this.tokens.push(new reconocido("Numero entero", fila, col, lexema))

                        i--;
                        estado = 0;
                        lexema = "";
                    }
                    

                    break;

                case 3:

                    if (char.match("[0-9]"))
                    {
                        estado = 4;
                        col++;
                        lexema += char;

                    }
                    else 
                    {
                        this.tokens.push(new reconocido("Punto", fila, col, lexema[lexema.length]))

                        lexema = lexema.replace(".","")
                        this.tokens.push(new reconocido("Numero entero", fila, col, lexema))

                        i--;
                        estado = 0;
                        lexema = "";
                    }
                    
                    break;

                case 4:

                    if (char.match("[0-9]"))
                    {
                        estado = 4;
                        col++;
                        lexema += char;
                    }
                    else 
                    {
                        this.tokens.push(new reconocido("Numero decimal", fila, col, lexema));

                        i--;
                        estado = 0;
                        lexema = "";

                    }

                    break;

                case 5:

                    if (char != "\"" && charAscii != 10 )
                    {
                        if (!EOF)
                        {
                            estado = 5;
                            lexema += char; 

                            if(charAscii != 13 && charAscii != 9 && charAscii != 32)
                            {
                                col++;
                            }

                        }
                        else
                        {
                            this.errores.push(new reconocido("lexico",fila, col, "El expresion '"+lexema+"' no pertenece al lenguaje"))
                            col++;
                            this.tokens.push(new reconocido("ultimo", fila, col, "#"))
                        }

                    }
                    else
                    {
                        if (char == "\"")
                        {
                            lexema += char;
                            col++;
                            this.tokens.push(new reconocido("Cadena comillas dobles", fila, col, lexema))
                            
                        }
                        else
                        {
                            this.errores.push(new reconocido("lexico", fila, col, "La expresion '"+lexema+"' no pertenece al lenguaje"))
                            i--;
                        }

                        estado = 0;
                        lexema = "";

                    }
                    
                    break;

                case 6:
                    
                    if (char != "'" && charAscii != 10 )
                    {
                        if (!EOF)
                        {
                            estado = 6;
                            lexema += char; 

                            if(charAscii != 13 && charAscii != 9 && charAscii != 32)
                            {
                                col++;
                            }

                        }
                        else 
                        {
                            this.errores.push(new reconocido("lexico",fila, col, "El expresion '"+lexema+"' no pertenece al lenguaje"))
                            col++;
                            this.tokens.push(new reconocido("ultimo", fila, col, "#"))
                        }

                    }
                    else
                    {
                        if (char == "'")
                        {
                            lexema += char;
                            col++;
                            this.tokens.push(new reconocido("Cadena comillas simples", fila, col, lexema))
                            
                        }
                        else
                        {
                            this.errores.push(new reconocido("lexico", fila, col, "La expresion '"+lexema+"' no pertenece al lenguaje"))
                            i--;
                        }

                        estado = 0;
                        lexema ="";
                    }

                    break;

                case 7:
                    
                    if (char == "/")
                    {
                        estado = 8;
                        col++;
                        lexema += char;
                    }
                    else if (char == "*")
                    {
                        estado = 9;
                        col++;
                        lexema += char;
                    }
                    else 
                    {
                        this.tokens.push(new reconocido("Signo Dividir", fila, col, lexema));

                        i--;
                        estado = 0;
                        lexema = "";
                    }
                
                    
                    break;

                case 8:

                    if (charAscii != 10)
                    {
                        if (!EOF)
                        {
                            estado = 8;
                            lexema += char;

                            if(charAscii != 13 && charAscii != 9 && charAscii != 32)
                            {
                                col++;
                            }

                        }
                        else 
                        {
                            this.tokens.push(new reconocido("Comentario unilinea",fila, col, lexema))
                            col++;
                            this.tokens.push(new reconocido("EOF", fila, col, "#"))
                        }

                    }
                    else 
                    {   
                        this.tokens.push(new reconocido("Comentario unilinea",fila, col, lexema))

                        col=0;
                        fila++;

                        estado = 0;
                        lexema = "";

                    }
                
                    break;

                case 9:

                    if (char != '*')
                    {
                        if (!EOF)
                        {
                            estado = 9
                            lexema += char

                            if(charAscii != 13 && charAscii != 9 && charAscii != 32 && charAscii != 10)
                            {
                                col++;
                            }
                            else if (charAscii == 10)
                            {
                                col = 0;
                                fila++;
                            }

                        }
                        else 
                        {
                            this.errores.push(new reconocido("lexico",fila, col, "El expresion '"+lexema+"' no pertenece al lenguaje"))
                            col++;
                            this.tokens.push(new reconocido("EOF", fila, col, "#"))
                        }

                    }
                    else
                    {   
                        estado = 10;
                        col++;
                        lexema += char
                    }
                    
                    break;

                case 10:

                    if(char == '*')
                    {
                        estado = 10;
                        col++;
                        lexema += char;
                    }
                    else if (char == '/') 
                    {
                        
                        col++;
                        lexema += char;

                        this.tokens.push(new reconocido("Comentario multilinea", fila, col, lexema))

                        estado = 0;
                        lexema = "";

                    }
                    else 
                    {
                        if (!EOF)
                        {
                            estado = 9;
                            lexema += char;

                            if(charAscii != 13 && charAscii != 9 && charAscii != 32 && charAscii != 10)
                            {
                                col++;
                            }
                            else if (charAscii == 10)
                            {
                                col = 0;
                                fila++;
                                
                            }
                        }
                        else 
                        {
                            this.errores.push(new reconocido("lexico",fila, col, "El expresion '"+lexema+"' no pertenece al lenguaje"))
                            col++;
                            this.tokens.push(new reconocido("EOF", fila, col, "#"))
                        }
                    }
                    
                    break;
                
                case 11:

                    if (lexema == "&" && char == "&")
                    {
                        col++;
                        lexema += char;

                        this.tokens.push(new reconocido("And", fila, col, lexema)); 

                        estado = 0;
                        lexema = ""

                    }
                    else if (lexema == "|" && char == "|")
                    {
                        col++;
                        lexema += char;

                        this.tokens.push(new reconocido("OR", fila, col, lexema)); 

                        estado = 0;
                        lexema = ""

                    }
                    else if (lexema == ">" && char == "=")
                    {
                        col++;
                        lexema += char;

                        this.tokens.push(new reconocido("Mayor igual", fila, col, lexema)); 

                        estado = 0;
                        lexema = ""

                    }
                    else if (lexema == "<" && char == "=")
                    {
                        col++;
                        lexema += char;

                        this.tokens.push(new reconocido("Menor igual", fila, col, lexema)); 

                        estado = 0;
                        lexema = ""


                    }
                    else if (lexema == "=" && char == "=")
                    {
                        col++;
                        lexema += char;

                        this.tokens.push(new reconocido("Igual", fila, col, lexema)); 

                        estado = 0;
                        lexema = ""

                    }
                    else if (lexema == "!" && char == "=")
                    {
                        col++;
                        lexema += char;

                        this.tokens.push(new reconocido("DIferente", fila, col, lexema)); 

                        estado = 0;
                        lexema = ""

                    }
                    else if (lexema == "+" && char == "+")
                    {
                        col++;
                        lexema += char;

                        this.tokens.push(new reconocido("Incremento", fila, col, lexema)); 

                        estado = 0;
                        lexema = ""

                    }
                    else if (lexema == "-" && char == "-")
                    {
                        col++;
                        lexema += char;

                        this.tokens.push(new reconocido("Decremento", fila, col, lexema)); 

                        estado = 0;
                        lexema = ""

                    }
                    else 
                    {
                        this.tokens.push(new reconocido("simbolo", fila, col, lexema)); 

                        i--;
                        estado = 0;
                        lexema = "";
                        
                    }
                    

                break;
                
            }
            
        }
        

    }

    getErrores () : reconocido [] 
    {
        return this.errores
    }

    getTokes () : reconocido [] 
    {
        return this.tokens;

    }

}
