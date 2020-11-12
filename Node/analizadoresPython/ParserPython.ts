import reconocido from './Reconocido'

export default class parserPython
{

    private errores : reconocido[]=[];
    private tokens : reconocido[]=[];
    
    private noToken : number = 0;
    private token : reconocido;
    private EOF : reconocido ;
    
    constructor (tokens : reconocido[], errores : reconocido[] )
    {
        this.tokens = tokens;
        this.errores = errores; 
        this.token = this.tokens[this.noToken]
        this.EOF = this.tokens[(this.tokens.length-1)]

    }

    codigoPyton : string = "";
    arbolGraphviz : string = "";

    private identacion : string = "";

    private salidaLinea: string = "";
    private arbolAux: string = "";

    private llamadaMain = "";


    //---------------------------------------------------RECUPERACION DE CLASES--------------------------------------------------------------------------------------------------------------  
    private emparejarClaseID(clase : string): boolean 
    {
        if (this.token.tipo != "ID")
        {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea")
            {
                let coment = ""

                if (this.token.tipo == "Comentario unilinea")
                {
                    coment = this.token.valor.replace("//","#");
                    
                }else 
                {
                    coment = this.token.valor.replace("/*","'''");
                    coment = coment.replace("*/","'''");
                }

                this.codigoPyton += coment + "\n"
                coment = "";

                this.avanzar();

            }else 
            {
                this.errores.push(new reconocido("sintactico",this.token.fila, this.token.columna, "Se encontró '"+this.token.valor+"' y se esperaba: ID "))

                if(this.token != this.EOF) 
                {
                    for (let i = this.noToken ; i < this.tokens.length; i++, this.noToken++) 
                    {
                        this.token = this.tokens[i];

                        if (this.token.valor == "public" || this.token.valor == "interface"||this.token.valor == "class")
                        {
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            return false;
                        }
                        
                    }

                }
                return false;
            }

        }
        else 
        {

            //codigoGraphviz del arbol 
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
            this.arbolAux += clase + "->" + this.noToken +"\n\n";  

            //traduccion
            this.salidaLinea += this.token.valor + " "; 
                    
            this.avanzar();

        }

        return true;

    }

    private emparejarClase(tokenValor : string, clase: string): boolean 
    {
        if (this.token.valor != tokenValor)
        {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea")
            {
                let coment = ""

                if (this.token.tipo == "Comentario unilinea")
                {
                    coment = this.token.valor.replace("//","#");

                }else 
                {
                    coment = this.token.valor.replace("/*","'''");
                    coment = coment.replace("*/","'''");
                }

                this.codigoPyton += coment + "\n"
                coment = "";

                this.avanzar();

            }else 
            {
                this.errores.push(new reconocido("sintactico",this.token.fila, this.token.columna, "Se encontró '"+this.token.valor+"' y se esperaba: " + tokenValor));

                if(this.token != this.EOF) 
                {
                    for (let i = this.noToken ; i < this.tokens.length; i++, this.noToken++)
                    {    
                        this.token = this.tokens[i];

                        if (this.token.valor == "public" || this.token.valor == "interface"||this.token.valor == "class")
                        {  
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            return false;
                        }
                        
                    }

                }
                return false;
            }
        }
        else 
        {
            //codigo del arbol
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
            this.arbolAux += clase + "->" + this.noToken + "\n\n";  

            //traduccion
            if (this.token.valor != "public" )
            {
                if (this.token.valor == "{")
                {
                    this.salidaLinea +=  ":\n\n"
                    this.identacion += "\t"

                    //codigoGraphviz del arbol, agrarlos a los archivos de salida 
                    this.codigoPyton += this.salidaLinea;
                    this.arbolGraphviz += this.arbolAux;

                    this.salidaLinea = "";
                    this.arbolAux = "";
                    
                }
                else if ( this.token.valor == "}")
                {
                    this.identacion = this.identacion.substr(1);

                    //codigoGraphviz del arbol, agrarlos a los archivos de salida y limpiar para una nueva clase y se resta una identacion
                    this.codigoPyton += this.llamadaMain;
                    this.arbolGraphviz += this.arbolAux;
                    
                    this.llamadaMain = "";
                    this.salidaLinea = "";
                    this.arbolAux = "";

                } 
                else if (this.token.valor == "class" ||this.token.valor == "interface")
                {
                    this.salidaLinea += "class ";
                }
                else 
                {
                    this.salidaLinea += this.token.valor + " ";
                }

            }

            this.avanzar();
        }

        return true;

    }
    
    //-------------------------------------------RECUPERACION DE SENTENCIAS & DE INTERFACE------------------------------------------------------------------------------------------------------
    private emparejarSentIDInterface(sentG:string): boolean 
    {
        if (this.token.tipo != "ID")
        {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea")
            {
                let coment = ""

                if (this.token.tipo == "Comentario unilinea")
                {
                    coment = this.token.valor.replace("//","#");
                    
                }else 
                {
                    coment = this.token.valor.replace("/*","'''");
                    coment = coment.replace("*/","'''");
                }

                this.codigoPyton += coment + "\n"
                coment = "";
                
                this.avanzar();

            }else 
            {
                this.errores.push(new reconocido("sintactico",this.token.fila, this.token.columna, "Se encontró '"+this.token.valor+"' y se esperaba: ID" ));

                if(this.token != this.EOF) 
                {   
                    for (let i = this.noToken ; i < this.tokens.length; i++,this.noToken++)
                    {
                        this.token = this.tokens[i];

                        if (this.token.valor == ";" )
                        {
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            this.avanzar();
                            return false;
                        }
                        else if(this.token.valor == "}")
                        {
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            return false;
                        }
                        
                    }

                }
                return false;
            }
            
        }else 
        {
            //codigoGraphviz del arbol 
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
            this.arbolAux += sentG + "->" + this.noToken +"\n\n";  

            //traduccion
            this.salidaLinea += this.token.valor + " ";
                    
            this.avanzar();
        }

        return true;
    }
    
    private emparejarSentInterface(tokenValor : string, sentG:string): boolean 
    {
        if (this.token.valor != tokenValor)
        {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea")
            {
                let coment = ""

                if (this.token.tipo == "Comentario unilinea")
                {
                    coment = this.token.valor.replace("//","#");
                    
                }else 
                {
                    coment = this.token.valor.replace("/*","'''");
                    coment = coment.replace("*/","'''");
                }

                this.codigoPyton += coment+ "\n"
                coment = "";
                
                this.avanzar();

            }else 
            {
                this.errores.push(new reconocido("sintactico",this.token.fila, this.token.columna, "Se encontró '"+this.token.valor+"' y se esperaba: " + tokenValor));

                if(this.token != this.EOF) 
                {
                    for (let i = this.noToken ; i < this.tokens.length; i++,this.noToken++)
                    {
                        this.token = this.tokens[i];

                        if (this.token.valor == ";" )
                        {
                            if (tokenValor == ";")
                            {
                                //codigo del arbol
                                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                                this.arbolAux += sentG + "->" + this.noToken + "\n\n";  

                                //traduccion
                                this.salidaLinea += this.token.valor

                                //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                this.codigoPyton += this.salidaLinea + "\n\n";
                                this.arbolGraphviz += this.arbolAux;
                                
                                //codigoGraphviz, limpiamos variables para una nueva sentencia
                                this.salidaLinea = "";
                                this.arbolAux = "";

                                this.avanzar();
                                return true;
                            }

                            this.salidaLinea = "";
                            this.arbolAux = "";

                            this.avanzar();
                            return false;

                        }
                        else if(this.token.valor == "}")
                        {
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            return false;
                        }
                        
                    }

                }
                return false;

            }
        }
        else
        {

            //codigo del arbol
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
            this.arbolAux += sentG + "->" + this.noToken + "\n\n";  

            if (this.token.valor != "public")
            {
                //traduccion
                if (this.token.valor == "void"||this.token.tipo == "Tipo primitivo")
                {
                    this.salidaLinea += this.identacion+ "def "
                }
                else if(this.token.valor == ";")
                {
                    this.salidaLinea += this.token.valor;

                    //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                    this.codigoPyton += this.salidaLinea + "\n\n";
                    this.arbolGraphviz += this.arbolAux;
                    
                    //codigoGraphviz, limpiamos variables para una nueva sentencia
                    this.salidaLinea = "";
                    this.arbolAux = "";
                }
                else 
                {
                    if (this.token.valor == "(" || this.token.valor == ")")
                    {
                        this.salidaLinea += this.token.valor;
                    }
                    else
                    {
                        this.salidaLinea += this.token.valor+ " ";
                    }
                }
                
                
            }

            this.avanzar();
        } 

        return true;
    }

    //------------------------------------------------RECUPERACION DE SENTENCIAS------------------------------------------------------------------------------------------------------
    private emparejarSentID(sentG:string): boolean 
    {
        if (this.token.tipo != "ID")
        {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea")
            {
                let coment = ""

                if (this.token.tipo == "Comentario unilinea")
                {
                    coment = this.token.valor.replace("//","#");
                    
                }else 
                {
                    coment = this.token.valor.replace("/*","'''");
                    coment = coment.replace("*/","'''");
                }

                this.codigoPyton += coment + "\n"
                coment = "";
                
                this.avanzar();

            }else 
            {
                this.errores.push(new reconocido("sintactico",this.token.fila, this.token.columna, "Se encontró '"+this.token.valor+"' y se esperaba: ID" ))

                if(this.token != this.EOF) 
                {   
                    for (let i = this.noToken ; i < this.tokens.length; i++,this.noToken++)
                    {
                        this.token = this.tokens[i];

                        if (this.token.valor == ";" )
                        {
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            this.avanzar();
                            return false;
                        }
                        else if (this.token.valor == "{")
                        {
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            this.avanzar();
                            return false;
                        }
                        else if(this.token.valor == "}")
                        {
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            return false;
                        }
                        
                    }

                }
                return false;

            }
            
        }else 
        {
            //codigo del arbol
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
            this.arbolAux += sentG + "->" + this.noToken + "\n\n";  

            //traduccion
            this.salidaLinea += this.token.valor + " ";
            
            this.avanzar();
        }

        return true;
    }

    private emparejarSent(tokenValor : string, sentG:string) : boolean
    {
        if (this.token.valor != tokenValor)
        {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea")
            {
                let coment = ""

                if (this.token.tipo == "Comentario unilinea")
                {
                    coment = this.token.valor.replace("//","#");
                    
                }else 
                {
                    coment = this.token.valor.replace("/*","'''");
                    coment = coment.replace("*/","'''");
                }

                this.codigoPyton += coment + "\n"
                coment = "";
                 
                this.avanzar();

            }else 
            {
                this.errores.push(new reconocido("sintactico",this.token.fila, this.token.columna, "Se encontró '"+this.token.valor+"' y se esperaba: " + tokenValor));

                if(this.token != this.EOF) 
                {   
                    for (let i = this.noToken ; i < this.tokens.length; i++,this.noToken++)
                    {
                        this.token = this.tokens[i];

                        if (this.token.valor == ";" )
                        {
                            if (tokenValor == ";")
                            {
                                //codigo del arbol
                                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                                this.arbolAux += sentG + "->" + this.noToken + "\n\n";  

                                this.avanzar();
                                return true;
                            }

                            this.salidaLinea = "";
                            this.arbolAux = "";

                            this.avanzar();
                            return false;
                        }
                        else if (this.token.valor == "{")
                        {
                            if (tokenValor == "{")
                            {
                                //codigo del arbol
                                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                                this.arbolAux += sentG + "->" + this.noToken + "\n\n";  

                                this.salidaLinea +=  " :\n\n"
                                this.identacion += "\t"

                                //codigoGraphviz del arbol, agrarlos a los archivos de salida 
                                this.codigoPyton += this.salidaLinea;
                                this.arbolGraphviz += this.arbolAux;

                                this.salidaLinea = "";
                                this.arbolAux = "";

                                this.avanzar();
                                return true;
                            }

                            this.salidaLinea = "";
                            this.arbolAux = "";
                            
                            this.avanzar();
                            return false;

                        }
                        else if(this.token.valor == "}")
                        {
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            return false;
                        }
                        
                    }

                }
                return false;

            }
            
        }
        else 
        {
            if (this.token.tipo == "Cadena comillas dobles")
            {
                //codigo del arbol
                this.arbolAux += this.noToken + "[label=" + this.token.valor + "; shape=plaintext] \n"
                this.arbolAux += sentG + "->" + this.noToken + "\n\n"; 
            } 
            else 
            {
                //codigo del arbol
                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                this.arbolAux += sentG + "->" + this.noToken + "\n\n"; 
            }
            
            
            if (this.token.valor != "public" && this.token.valor != ";")
            {
                //traduccion
                if (this.token.tipo == "Tipo primitivo" )
                {
                    this.salidaLinea += this.identacion + "var "
                }
                else if (this.token.tipo == "ID"||this.token.valor == "return" || this.token.valor  == "System"|| this.token.valor == "continue"
                || this.token.valor == "break" || this.token.valor == "if"||this.token.valor == "for"||this.token.valor == "while" ||this.token.valor == "do")
                {
                    this.salidaLinea += this.identacion + this.token.valor + " "
                }
                else if (this.token.valor == "void")
                {
                    this.salidaLinea += this.identacion+ "def "
                }
                else if (this.token.valor == "{")
                {
                    this.salidaLinea +=  ":\n\n"
                    this.identacion += "\t"

                    //codigoGraphviz del arbol, agrarlos a los archivos de salida 
                    this.codigoPyton += this.salidaLinea;
                    this.arbolGraphviz += this.arbolAux;

                    this.salidaLinea = "";
                    this.arbolAux = "";
                    
                }
                else if ( this.token.valor == "}")
                {
                    this.identacion = this.identacion.substr(1);

                    //codigoGraphviz del arbol, agrarlos a los archivos de salida y limpiar para una nueva clase y se resta una identacion
                    //this.codigoPyton += "\n\n"; SOLO PORQUE MUCHOS SALTOS DE LINEA
                    this.arbolGraphviz += this.arbolAux;

                    this.salidaLinea = "";
                    this.arbolAux = "";

                }
                else 
                {
                    if (this.token.valor == "++")
                    {
                        this.salidaLinea += "+= 1" 
                    }
                    else if ( this.token.valor == "--")
                    {
                        this.salidaLinea +=  "-= 1" 
                    }
                    else if (this.token.valor == "(" || this.token.valor == ")")
                    {
                        this.salidaLinea += this.token.valor;
                    }
                    else if (this.token.valor == " && " )
                    {
                        this.salidaLinea += " and " 
                    }
                    else if (this.token.valor == "||")
                    {
                        this.salidaLinea += " or " 
                    }
                    else if (this.token.valor == "!" )
                    {
                        this.salidaLinea += "not " 
                    }
                    else if (this.token.valor == "^")
                    {
                        this.salidaLinea += " xor " 
                    }
                    else
                    {
                        this.salidaLinea += this.token.valor+ " ";
                    }

                }
                
            }

            this.avanzar();

        }

        return true;
    }

    //------------------------------------------------AVANZAR EN LA LISTA DE TOKENS----------------------------------------------------------------------------------------------------------------------------------
    private avanzar ()
    {
        if(this.token != this.EOF) 
        {
            this.noToken++;
            this.token =  this.tokens[this.noToken]
            
        }
    }

    //----------------------------------------------------ANALIZADOR SINTACTICO------------------------------------------------------------------------------------------------------------------------------
    traducir ()
    {
        this.arbolGraphviz += "\/\/------------------------iniico--------------------------\n\n"
        this.arbolGraphviz += "inicio [label=\"<inicio>\"] \n\n\n"
        this.inicio();
    }

    private inicio () 
    {   
        if (this.noToken < this.tokens.length)
        {
            //codigoGraphviz del arbol 
            let clase : string = "Clase" + this.noToken;
            this.arbolGraphviz += "\/\/--------------------------" + clase + "--------------------------\n\n"
            this.arbolGraphviz += clase + " [label=\"<Clase>\"] \n"
            this.arbolGraphviz += "inicio" + "->" + clase+"\n\n";

            this.TC(clase);

        }
        
    }

    private TC (clase :string)
    {
        if (this.token != this.EOF)
        {
            if (this.token.valor == "public")
            {
                this.emparejarClase("public", clase);
            }
            
            if (this.token.valor == "interface" || this.token.valor == "class")
            { 
                let tipoClase : string = this.token.valor

                this.emparejarClase(tipoClase, clase);
                
                if (this.emparejarClaseID(clase))
                {
                    if (this.emparejarClase("{", clase))
                    {
                        if(tipoClase == "interface")
                        {
                            //codigoGraphviz del arbol 
                            let sentGI : string = "sentGI" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sentGI + "--------------------------\n\n"
                            this.arbolGraphviz += sentGI + " [label=\"<Sentecia Interfaz>\"] \n"
                            this.arbolGraphviz += clase + "->" + sentGI + "\n\n";

                            this.Dec_M_F(sentGI);
                            
                        }
                        else if (tipoClase == "class") 
                        {
                            //codigoGraphviz del arbol 
                            let sentG : string = "sentG" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sentG + "--------------------------\n\n"
                            this.arbolGraphviz += sentG + " [label=\"<Sentecia clase>\"] \n"
                            this.arbolGraphviz += clase + "->" + sentG +"\n\n";

                            this.sentG(sentG);
                        } 

                        //codigoGraphviz del arbol, creando una nueva clase en el mismo archivo
                        let newClass : string = "masClases" + this.noToken;
                        this.arbolGraphviz += "\/\/--------------------------" + newClass + "--------------------------\n\n"
                        this.arbolGraphviz +=  newClass + " [label=\"<mas Clases>\"] \n\n"
                        this.arbolGraphviz += clase + "->" + newClass + "\n\n";

                        this.TC(newClass);

                    }else {this.TC(clase);}

                }else { this.TC(clase);}

            }
            else 
            {
                this.emparejarClase("interface or class", clase) // error
                this.TC(clase);
            }

        }

    }

    private Dec_M_F(sentGI:string)
    {
        if (this.token != this.EOF)
        {
            if (this.token.valor == "}"|| this.token == this.EOF)
            {
                this.emparejarClase("}", sentGI);
            }
            else 
            {
                if (this.token.valor == "public")
                {
                    this.emparejarSentInterface("public", sentGI);
                }

                if(this.token.valor == "void"||this.token.tipo == "Tipo primitivo")
                {
                    this.emparejarSentInterface(this.token.valor, sentGI);
                    
                    if (this.emparejarSentIDInterface(sentGI))
                    {
                        if (this.emparejarSentInterface("(", sentGI))
                        {
                            //codigoGraphviz del arbol
                            let params : string = "parametos" + this.noToken;
                            this.arbolAux += "\/\/--------------------------" + params + "--------------------------\n\n"
                            this.arbolAux += params + " [label=\"<Parametros>\"] \n";
                            this.arbolAux += sentGI + "->" + params +"\n\n";

                            if (this.params("interface", params))
                            {
                                if (this.emparejarSentInterface(")",sentGI))
                                {
                                    if (this.emparejarSentInterface(";",sentGI))
                                    {
                                        //codigoGraphviz del arbol
                                        let newSentGI : string = "masSentGl" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + newSentGI + "--------------------------\n\n"
                                        this.arbolGraphviz +=  newSentGI + " [label=\"<mas Sentencias Interfaz>\"] \n\n"
                                        this.arbolGraphviz += sentGI + "->" + newSentGI + "\n\n";
                                        
                                        this.Dec_M_F(newSentGI);

                                    }else {this.Dec_M_F(sentGI); }

                                }else {this.Dec_M_F(sentGI);}

                            }else {this.Dec_M_F(sentGI);}
                            
                        }else {this.Dec_M_F(sentGI);}

                    }else {this.Dec_M_F(sentGI);}

                }
                else 
                {
                    this.emparejarSentInterface("void o tipo primitivo", sentGI);// error
                    this.Dec_M_F(sentGI);
                }
            }

        }

    }

    private params(tipoC : string, params:string): boolean   
    {
        if (this.token != this.EOF)
        { 
            if(this.token.valor == "int" ||this.token.valor == "double" ||this.token.valor == "String" ||this.token.valor == "char" ||this.token.valor == "boolean")
            {
                //codigoGraphviz del arbol   
                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                this.arbolAux += params + "->" + this.noToken +"\n\n";  

                this.avanzar();

                if (this.token.tipo == "ID")
                {
                    //codigoGraphviz del arbol   
                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                    this.arbolAux += params + "->" + this.noToken +"\n\n"; 
                    
                    this.salidaLinea += this.token.valor;

                    this.avanzar();

                    let masParams : string = "masParams" + this.noToken;
                    this.arbolAux += "\/\/--------------------------" + masParams + "--------------------------\n"
                    this.arbolAux += masParams + " [label=\"<mas Parametros>\"] \n";
                    this.arbolAux += params + "->" + masParams +"\n\n";

                    return this.masParamas(tipoC, masParams);
                }
                else 
                {
                    if (tipoC = "interface")
                    {
                        return this.emparejarSentIDInterface(params);

                    }else if (tipoC == "class")
                    {
                        return this.emparejarSentID(params);
                        
                    }else {return false; }

                }
                
            }else {return true;}

        }else {return false;}

    }

    private masParamas(tipoC : string, params:string): boolean
    {
        if (this.token != this.EOF)
        {
            if(this.token.valor == ",")
            {
                //codigoGraphviz del arbol
                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                this.arbolAux += params + "->" + this.noToken +"\n\n";  

               //traduccion
                this.salidaLinea += ", " 

                this.avanzar();

                if (this.token.tipo != "Parentesis derecho")
                {
                    return this.params(tipoC, params);
                }
                else
                {
                    if (tipoC == "interface")
                    {
                        return this.emparejarSentInterface("Tipo Primitivo", params);

                    }else if (tipoC == "class")
                    {
                        return this.emparejarSent("Tipo Primitivo", params)

                    }else {return false; }
                }
                
            }else {return true;}

        }else {return false;}
    }
    
    private sentG(sentG:string)
    {
        if (this.token != this.EOF)
        {
            if (this.token.valor == "}" || this.token == this.EOF)
            {
                this.emparejarClase("}", sentG);

            } 
            else 
            {
                if (this.token.valor == "public")
                {
                    this.emparejarSent(this.token.valor, sentG);
                }

                if (this.token.valor == "static")
                {
                    this.emparejarSent(this.token.valor, sentG);

                    if (this.emparejarSent("void", sentG))
                    {
                        if (this.emparejarSent("main", sentG))
                        {
                            if (this.emparejarSent("(", sentG))
                            {
                                if (this.emparejarSent("String", sentG))
                                {
                                    if (this.emparejarSent("[", sentG))
                                    {
                                        if (this.emparejarSent("]", sentG))
                                        {
                                            if (this.emparejarSent("args", sentG))
                                            {
                                                if (this.emparejarSent(")", sentG))
                                                {
                                                    // traduccion
                                                    this.salidaLinea = ""
                                                    this.salidaLinea += this.identacion + "def main ()"

                                                    if (this.emparejarSent("{", sentG))
                                                    {   
                                                        //llamada del main
                                                        this.llamadaMain = "\tif __name__ = '__main__':\n\t\tmain()\n\n"

                                                        let sentMain : string = "sentMain" + this.noToken;
                                                        this.arbolGraphviz += "\/\/--------------------------" + sentMain + "--------------------------\n\n"
                                                        this.arbolGraphviz += sentMain + " [label=\"<Sentecia>\"] \n"
                                                        this.arbolGraphviz += sentG + "->" + sentMain +"\n\n";

                                                        this.sent(sentMain);

                                                        //codigoGraphviz del arbol 
                                                        let newSentG : string = "sentG" + this.noToken;
                                                        this.arbolGraphviz += "\/\/--------------------------" + newSentG + "--------------------------\n\n"
                                                        this.arbolGraphviz += newSentG + " [label=\"<mas Sentecia>\"] \n"
                                                        this.arbolGraphviz += sentG + "->" + newSentG +"\n\n";

                                                        this.sentG(newSentG);

                                                    }
                                                    else {this.sentG(sentG);}

                                                }
                                                else {this.sentG(sentG);}

                                            }
                                            else {this.sentG(sentG);}

                                        }
                                        else {this.sentG(sentG);}

                                    }
                                    else {this.sentG(sentG);}

                                }
                                else {this.sentG(sentG);}

                            }
                            else {this.sentG(sentG);}

                        }
                        else {this.sentG(sentG);}

                    }
                    else {this.sentG(sentG);}

                }
                else if(this.token.valor == "void") 
                {
                    this.emparejarSent(this.token.valor, sentG);
                    
                    if (this.emparejarSentID(sentG))
                    {
                        if (this.emparejarSent("(", sentG))
                        {
                            //codigoGraphviz del arbol
                            let params : string = "parametos" + this.noToken;
                            this.arbolAux += "\/\/--------------------------" + params + "--------------------------\n\n"
                            this.arbolAux += params + " [label=\"<Parametros>\"] \n";
                            this.arbolAux += sentG + "->" + params +"\n\n";

                            if (this.params("class", params))
                            {
                                if (this.emparejarSent(")", sentG))
                                {
                                    if (this.emparejarSent("{", sentG))
                                    {
                                        let sentVoid : string = "sentVoid" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sentVoid + "--------------------------\n\n"
                                        this.arbolGraphviz += sentVoid + " [label=\"<Sentecia>\"] \n"
                                        this.arbolGraphviz += sentG + "->" + sentVoid +"\n\n";

                                        this.sent(sentVoid);

                                        //codigoGraphviz del arbol 
                                        let newSentG : string = "sentG" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + newSentG + "--------------------------\n\n"
                                        this.arbolGraphviz += newSentG + " [label=\"<mas Sentecia>\"] \n"
                                        this.arbolGraphviz += sentG + "->" + newSentG +"\n\n";

                                        this.sentG(newSentG);
                                        
                                    }else {this.sentG(sentG);}
                                    
                                }else{this.sentG(sentG);}

                            }else {this.sentG(sentG);}

                        }else{this.sentG(sentG);}

                    }else{this.sentG(sentG);}

                }
                else if(this.token.valor == "int" ||this.token.valor == "double" ||this.token.valor == "String" ||this.token.valor == "char" ||this.token.valor == "boolean")
                {
                    //codigoGraphviz del arbol
                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                    this.arbolAux += sentG + "->" + this.noToken +"\n\n";  

                    this.avanzar();

                    if (this.token.tipo == "ID")
                    {
                        //no avanzo para guardar id adentro de este metodo
                        this.IoD(sentG);
                    }
                    else 
                    {
                        this.emparejarSentID(sentG);// error
                        this.sentG(sentG);
                    }
                    
                }
                else 
                {
                    this.emparejarSent("static, void o tipo primitivo", sentG); // error
                    this.sentG(sentG);
                }

            }

        }

    }

    private IoD(sentG:string)
    { 
        let id : string = this.token.valor;
        
        //codigo del arbol
        this.arbolAux += this.noToken + "[label=\"" + id + "\"; shape=plaintext] \n"
        this.arbolAux += sentG + "->" + this.noToken + "\n\n"; 

        this.avanzar();

        if (this.token.valor == "(")
        {
            // traduccion 
            this.salidaLinea += this.identacion + "def "+ id;

            this.emparejarSent("(", sentG)

            //codigoGraphviz del arbol
            let params : string = "parametos" + this.noToken;
            this.arbolAux += "\/\/--------------------------" + params + "--------------------------\n\n"
            this.arbolAux += params + " [label=\"<Parametros>\"] \n";
            this.arbolAux += sentG + "->" + params +"\n\n";

            if (this.params("class", params))
            {
                if (this.emparejarSent(")", sentG))
                {
                    if (this.emparejarSent("{", sentG))
                    {
                        let sentFunc : string = "sentFunc" + this.noToken;
                        this.arbolGraphviz += "\/\/--------------------------" + sentFunc + "--------------------------\n\n"
                        this.arbolGraphviz += sentFunc + " [label=\"<Sentecia>\"] \n"
                        this.arbolGraphviz += sentG + "->" + sentFunc +"\n\n";

                        this.sent(sentFunc);

                        //codigoGraphviz del arbol 
                        let newSentG : string = "sentG" + this.noToken;
                        this.arbolGraphviz += "\/\/--------------------------" + newSentG + "--------------------------\n\n"
                        this.arbolGraphviz += newSentG + " [label=\"<mas Sentecia>\"] \n"
                        this.arbolGraphviz += sentG + "->" + newSentG +"\n\n";

                        this.sentG(newSentG);

                    }else {this.sentG(sentG);}

                }else {this.sentG(sentG);}

            }else {this.sentG(sentG);}

        }
        else 
        {
            this.salidaLinea += this.identacion + "var " + id 

                //codigoGraphviz del arbol 
                let asigV : string = "asig" + this.noToken;
                this.arbolAux += "\/\/--------------------------" + asigV + "--------------------------\n\n"
                this.arbolAux += asigV + " [label=\"<Asignacion>\"] \n"
                this.arbolAux += sentG + "->" + asigV +"\n\n";

            if (this.asig(asigV))
            {
                //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                this.codigoPyton += this.salidaLinea + "\n\n";
                this.arbolGraphviz += this.arbolAux;
                
                //codigoGraphviz, limpiamos variables para una nueva sentencia
                this.salidaLinea = "";
                this.arbolAux = "";
                
                //codigoGraphviz
                let newSentG : string = "sentG" + this.noToken;
                this.arbolGraphviz += "\/\/--------------------------" + newSentG + "--------------------------\n\n"
                this.arbolGraphviz += newSentG + " [label=\"<mas Sentecia>\"] \n"
                this.arbolGraphviz += sentG + "->" + newSentG +"\n\n";

                this.sentG(newSentG);
            }
            else {this.sentG(sentG);}

        }

    }

    private asig (asigV:string): boolean 
    {
        if (this.token.valor == "=")
        {
            this.emparejarSent("=", asigV);

            if (this.exp(asigV))
            {
                return this.masAsig(asigV);
            }
            else 
            {
                return false;
            }

        }
        else
        {
            return this.masAsig(asigV);
        }
                
    }

    private masAsig(asigV:string): boolean
    {
        if (this.token.valor == ";"|| this.token == this.EOF) 
        {
            return this.emparejarSent(";", asigV);
        }
        else if (this.token.valor == ",")
        {
            //codigoGraphviz del arbol 
            let masAsigV : string = "masAsig" + this.noToken;
            this.arbolAux += "\/\/--------------------------" + masAsigV + "--------------------------\n\n"
            this.arbolAux += masAsigV + " [label=\"<mas Asignacion>\"] \n"
            this.arbolAux += asigV + "->" + masAsigV +"\n\n";

            this.emparejarSent (",", masAsigV)

            if(this.emparejarSentID(masAsigV))
            {
                return this.asig(masAsigV);
            }
            else 
            {
                return false;
            }

        }
        else 
        {
            return this.emparejarSent(" ';' , ',' o = ", asigV); // error
        }

    }

    private sent(sent:string)
    {
        if (this.token != this.EOF)
        {
            if (this.token.valor == "}" || this.token == this.EOF)
            {
                this.emparejarSent("}", sent);
            }
            else 
            {
                switch (this.token.valor) 
                {
                    case "return":

                        this.emparejarSent("return", sent)

                            if (this.token.tipo == "Punto y Coma")
                            {
                                this.emparejarSent(";", sent);

                                //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                this.codigoPyton += this.salidaLinea + "\n\n";
                                this.arbolGraphviz += this.arbolAux;
                                
                                //codigoGraphviz, limpiamos variables para una nueva sentencia
                                this.salidaLinea = "";
                                this.arbolAux = "";

                                //codigoGraphviz del arbol 
                                let newSent : string = "sent" + this.noToken;
                                this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                                this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                                this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                this.sent(newSent);
                            } 
                            else if (this.exp(sent))
                            {
                                if (this.emparejarSent(";", sent))
                                {
                                    //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                    this.codigoPyton += this.salidaLinea + "\n\n";
                                    this.arbolGraphviz += this.arbolAux;
                                    
                                    //codigoGraphviz, limpiamos variables para una nueva sentencia
                                    this.salidaLinea = "";
                                    this.arbolAux = "";
    
                                    //codigoGraphviz del arbol 
                                    let newSent : string = "sent" + this.noToken;
                                    this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                                    this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                                    this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                    this.sent(newSent);

                                }else {this.sent(sent);}

                            }
                            else
                            {
                                this.emparejarSent("; o expresion", sent) // error
                                this.sent(sent); 
                            } 
                            

                        break;

                    case "break":
                        
                        this.emparejarSent("break",sent)
                        
                        if (this.emparejarSent(";", sent))
                        {
                            //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                            this.codigoPyton += this.salidaLinea + "\n\n";
                            this.arbolGraphviz += this.arbolAux;
                            
                            //codigoGraphviz, limpiamos variables para una nueva sentencia
                            this.salidaLinea = "";
                            this.arbolAux = "";

                            //codigoGraphviz del arbol 
                            let newSent : string = "sent" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                            this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                            this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                            this.sent(newSent);

                        }else {this.sent(sent);}

                        break;

                    case "continue":

                        this.emparejarSent("continue",sent)
                        
                        if (this.emparejarSent(";", sent))
                        {
                            //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                            this.codigoPyton += this.salidaLinea + "\n\n";
                            this.arbolGraphviz += this.arbolAux;
                            
                            //codigoGraphviz, limpiamos variables para una nueva sentencia
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            
                            //codigoGraphviz del arbol 
                            let newSent : string = "sent" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                            this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                            this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                            this.sent(newSent);
                            
                        }else {this.sent(sent);}

                        break; 
                    
                    case "System":

                        this.emparejarSent("System", sent);

                            if (this.emparejarSent(".", sent))
                            {
                                if(this.emparejarSent("out", sent))
                                {
                                    if (this.emparejarSent(".", sent))
                                    {
                                        if (this.sl(sent))
                                        {
                                            //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                            this.codigoPyton += this.salidaLinea + "\n\n";
                                            this.arbolGraphviz += this.arbolAux;
                                            
                                            //codigoGraphviz, limpiamos variables para una nueva sentencia
                                            this.salidaLinea = "";
                                            this.arbolAux = "";
                                                            
                                            //codigoGraphviz del arbol 
                                            let newSent : string = "sent" + this.noToken;
                                            this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                                            this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                                            this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                            this.sent(newSent);

                                        }else {this.sent(sent);}

                                    }else {this.sent(sent);}

                                }else {this.sent(sent);}

                            }else {this.sent(sent);}

                        break;
    
                    case "if":

                        this.emparejarSent("if", sent)
                         
                        if (this.token.tipo == "Parentesis izquierdo")
                        {
                            //codigoGraphviz del arbol 
                            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                            this.arbolAux += sent + "->" + this.noToken +"\n\n"; 
                            
                            this.avanzar();
                            
                            if (this.exp(sent))
                            {
                                let parentCierra = this.token.tipo;
                                if(parentCierra == "Parentesis derecho")
                                {
                                    //codigoGraphviz del arbol 
                                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                                    this.arbolAux += sent + "->" + this.noToken +"\n\n"; 
                                    
                                    this.avanzar();

                                    if (this.emparejarSent("{", sent))
                                    {
                                        //codigoGraphviz del arbol 
                                        let Sentif : string = "sentif" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + Sentif + "--------------------------\n\n"
                                        this.arbolGraphviz += Sentif + " [label=\"<Sentecia>\"] \n"
                                        this.arbolGraphviz += sent + "->" + Sentif +"\n\n";

                                        this.sent(Sentif);

                                        //codigoGraphviz del arbol 
                                        let bloqueElse : string = "else" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + bloqueElse + "--------------------------\n\n"
                                        this.arbolGraphviz += bloqueElse + " [label=\"<else>\"] \n"
                                        this.arbolGraphviz += sent + "->" + bloqueElse +"\n\n";

                                        this.bloqueElse(bloqueElse);

                                        //codigoGraphviz del arbol 
                                        let newSent = "sent" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + newSent + "--------------------------\n\n"
                                        this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                                        this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                        this.sent(newSent);

                                    }else {this.sent(sent);}

                                }else {this.emparejarSent(" ) ", sent); this.sent(sent);}

                            }else {this.sent(sent);}

                        }else {this.emparejarSent(" ( ", sent); this.sent(sent);}
                        
                        break;

                    case "while":

                        this.emparejarSent("while", sent);

                        if (this.token.tipo == "Parentesis izquierdo")
                        {
                            //codigoGraphviz del arbol 
                            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                            this.arbolAux += sent + "->" + this.noToken +"\n\n"; 
                            
                            this.avanzar();

                            if (this.exp(sent))
                            {
                                let parentCierra = this.token.tipo;
                                if (parentCierra == "Parentesis derecho")
                                {
                                    //codigoGraphviz del arbol 
                                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                                    this.arbolAux += sent + "->" + this.noToken +"\n\n"; 
                                    
                                    this.avanzar();

                                    if (this.emparejarSent("{", sent))
                                    {   
                                        //codigoGraphviz del arbol 
                                        let sentWhile : string = "sentWhile" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sentWhile + "--------------------------\n\n"
                                        this.arbolGraphviz += sentWhile + " [label=\"<Sentecia>\"] \n"
                                        this.arbolGraphviz += sent + "->" + sentWhile +"\n\n";

                                        this.sent(sentWhile);

                                        //codigoGraphviz del arbol 
                                        let newSent : string = "sent" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                                        this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                                        this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                        this.sent(newSent);

                                    }else {this.sent(sent);}

                                }else {this.emparejarSent(" ) ", sent); this.sent(sent);}
                                
                            }else {this.sent(sent);}

                        }else {this.emparejarSent(" ( ", sent); this.sent(sent);}
                        
                        break;
                        
                    case "do":

                        this.emparejarSent("do", sent);

                        this.salidaLinea = this.identacion + "while true "

                        if (this.emparejarSent("{", sent))
                        {
                            //codigoGraphviz del arbol 
                            let sentDo : string = "sentDo" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sentDo + "--------------------------\n\n"
                            this.arbolGraphviz += sentDo + " [label=\"<Sentecia>\"] \n"
                            this.arbolGraphviz += sent + "->" + sentDo +"\n\n";

                            this.sent(sentDo);

                            if (this.emparejarSent("while", sent))
                            {
                                this.salidaLinea = this.identacion +"   "+ "if "

                                if (this.token.tipo == "Parentesis izquierdo")
                                {
                                    //codigoGraphviz del arbol 
                                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                                    this.arbolAux += sent + "->" + this.noToken +"\n\n"; 
                                    
                                    this.avanzar();

                                    if(this.exp(sent))
                                    {
                                        let parentCierra = this.token.tipo;
                                        if (parentCierra == "Parentesis derecho")
                                        {
                                            //codigoGraphviz del arbol 
                                            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                                            this.arbolAux += sent + "->" + this.noToken +"\n\n"; 
                                            
                                            this.avanzar();

                                            if (this.emparejarSent(";", sent))
                                            {
                                                this.salidaLinea += ":\n\n"
                                                this.salidaLinea += this.identacion + "        break"
                                                    
                                                //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                                this.codigoPyton += this.salidaLinea + "\n\n";
                                                this.arbolGraphviz += this.arbolAux;
                                                
                                                //codigoGraphviz, limpiamos variables para una nueva sentencia
                                                this.salidaLinea = "";
                                                this.arbolAux = "";

                                                //codigoGraphviz del arbol 
                                                let newSent = "sent" + this.noToken;
                                                this.arbolGraphviz += "\/\/--------------------------" + newSent + "--------------------------\n\n"
                                                this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                                                this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                                this.sent(newSent);

                                            }else {this.sent(sent);}

                                        }else {this.emparejarSent(" ) ", sent); this.sent(sent);}

                                    }else {this.sent(sent);}

                                }else {this.emparejarSent(" ( ", sent); this.sent(sent);}

                            }else {this.sent(sent);}
                            
                        }else {this.sent(sent);}
                        
                        break;            
                    
                    case "for":

                        this.emparejarSent("for", sent)

                        if (this.emparejarSent("(", sent))
                        {
                            this.salidaLinea = this.identacion + "for "

                            if (this.dec(sent))
                            {
                                if (this.emparejarSent(";", sent))
                                {
                                    this.salidaLinea += "in range ("

                                    if (this.exp(sent))
                                    {
                                        if (this.emparejarSent(";", sent))
                                        {
                                            this.salidaLinea += ", "

                                            if (this.exp(sent))
                                            { 
                                                if (this.emparejarSent(")", sent))
                                                {
                                                    if (this.emparejarSent("{", sent))
                                                    {
                                                        //codigoGraphviz del arbol 
                                                        let sentFor : string = "sentFor" + this.noToken;
                                                        this.arbolGraphviz += "\/\/--------------------------" + sentFor + "--------------------------\n\n"
                                                        this.arbolGraphviz += sentFor + " [label=\"<Sentecia>\"] \n"
                                                        this.arbolGraphviz += sent + "->" + sentFor +"\n\n";

                                                        this.sent(sentFor);
                                                        
                                                        //codigoGraphviz del arbol 
                                                        let newSent : string = "sent" + this.noToken;
                                                        this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                                                        this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                                                        this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                                        this.sent(newSent);

                                                    }else {this.sent(sent);}

                                                }else {this.sent(sent);}

                                            }else {this.sent(sent);}

                                        }else {this.sent(sent);}

                                    }else {this.sent(sent);}

                                }else {this.sent(sent);}

                            }else {this.sent(sent);}
                            
                        }else {this.sent(sent);}
                        
                        break;
                    
                    default: 

                        if (this.token.tipo == "Tipo primitivo") // declaracion de valriables
                        {
                            this.emparejarSent(this.token.valor, sent);

                            if (this.emparejarSentID(sent))
                            {
                                //codigoGraphviz del arbol 
                                let asigV : string = "asig" + this.noToken;
                                this.arbolAux += "\/\/--------------------------" + asigV + "--------------------------\n\n"
                                this.arbolAux += asigV + " [label=\"<Asignacion>\"] \n"
                                this.arbolAux += sent + "->" + asigV +"\n\n";

                                if (this.asig (asigV))
                                {
                                    //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                    this.codigoPyton += this.salidaLinea + "\n\n";
                                    this.arbolGraphviz += this.arbolAux;
                                    
                                    //codigoGraphviz, limpiamos variables para una nueva sentencia
                                    this.salidaLinea = "";
                                    this.arbolAux = "";

                                    //codigoGraphviz del arbol 
                                    let newSent : string = "sent" + this.noToken;
                                    this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                                    this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                                    this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                    this.sent(newSent);

                                }else {this.sent(sent);}
                                
            
                            }else {this.sent(sent);}
            
                        }
                        else if (this.token.tipo =="ID") // invocacion de ID
                        {
                            this.emparejarSent(this.token.valor, sent);

                            if (this.token.valor == "=") // asignacion de varable
                            {
                                this.emparejarSent ("=", sent)

                                if (this.exp(sent))
                                {
                                    if (this.emparejarSent(";", sent))
                                    {
                                        //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                        this.codigoPyton += this.salidaLinea + "\n\n";
                                        this.arbolGraphviz += this.arbolAux;
                                        
                                        //codigoGraphviz, limpiamos variables para una nueva sentencia
                                        this.salidaLinea = "";
                                        this.arbolAux = "";

                                        //codigoGraphviz del arbol 
                                        let newSent : string = "sent" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                                        this.arbolGraphviz + newSent + " [label=\"<mas Sentecia>\"] \n"
                                        this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                        this.sent(newSent);

                                    }else {this.sent(sent);}

                                }else {this.sent(sent);}

                            }
                            else if (this.token.valor == "(" || this.token.valor == "++" || this.token.valor == "--") //llamada metodos, incrementar o drecemtar
                            {
                                if (this.LLoI_D(sent))
                                {
                                    if (this.emparejarSent(";", sent))
                                    {
                                        //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                        this.codigoPyton += this.salidaLinea + "\n\n";
                                        this.arbolGraphviz += this.arbolAux;
                                        
                                        //codigoGraphviz, limpiamos variables para una nueva sentencia
                                        this.salidaLinea = "";
                                        this.arbolAux = "";

                                        //codigoGraphviz del arbol 
                                        let newSent : string = "sent" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                                        this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n"
                                        this.arbolGraphviz += sent + "->" + newSent +"\n\n";

                                        this.sent(newSent);

                                    }else {this.sent(sent);}
                                    
                                }else {this.sent(sent);}

                            }
                            else 
                            {
                                this.emparejarSent("=, '(', '++', '--'", sent);
                                this.sent(sent);
                            }

                        }
                        else 
                        {
                            this.emparejarSent("una sentencia", sent);
                            this.sent(sent);
                            
                        }

                        break;

                } 

            }

        }

        
    }

    private sl (sent:string)
    {  
        if (this.token.valor == "print"||this.token.valor =="println")
        {
            this.emparejarSent(this.token.valor, sent)

            this.salidaLinea = this.identacion + "print "

            if (this.emparejarSent("(", sent))
            {
                if (this.token.tipo == "Parentesis derecho")
                {
                    this.emparejarSent(")",sent)
                    
                    return this.emparejarSent(";",sent);
                }
                else 
                {
                    if (this.exp(sent))
                    {
                        if (this.emparejarSent(")",sent))
                        {
                            return this.emparejarSent(";",sent)

                        }else {return false}
                        
                    }else {return false;}

                }

            }else {return false}

        }else 
        {
            return this.emparejarSent("print o println",sent)
        }

    }

    private bloqueElse(sent:string) 
    {
        if (this.token != this.EOF)
        {
            if (this.token.tipo == "else")
            {
                //codigo del arbol
                this.arbolAux += this.noToken + "[label=\" else \"; shape=plaintext] \n"
                this.arbolAux += sent + "->" + this.noToken + "\n\n"; 

                this.avanzar();

                if(this.token.valor == "{")
                {
                    this.salidaLinea += this.identacion + "else "

                    this.emparejarSent("{", sent);

                    //codigoGraphviz del arbol 
                    let SentElse : string = "sentElse" + this.noToken;
                    this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                    this.arbolGraphviz += SentElse + " [label=\"<Sentecia>\"] \n"
                    this.arbolGraphviz += sent + "->" + SentElse +"\n\n";

                    this.sent(SentElse);

                }
                else if(this.token.valor == "if")
                {
                    //codigo del arbol
                    this.arbolAux += this.noToken + "[label=\" if \"; shape=plaintext] \n"
                    this.arbolAux += sent + "->" + this.noToken + "\n\n"; 

                    this.salidaLinea += this.identacion + "elif "

                    this.avanzar();
                        
                    let parentAbre = this.token.valor; 
                    if (parentAbre == "(")
                    {
                        //codigoGraphviz del arbol 
                        this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                        this.arbolAux += sent + "->" + this.noToken +"\n\n"; 
                        
                        this.avanzar();

                        if (this.exp(sent))
                        {
                            let parentCierra = this.token.valor; 
                            if(parentCierra == ")")
                            {
                                //codigoGraphviz del arbol 
                                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
                                this.arbolAux += sent + "->" + this.noToken +"\n\n"; 
                                
                                this.avanzar();

                                if (this.emparejarSent("{", sent))
                                {
                                    //codigoGraphviz del arbol 
                                    let SentElseIf : string = "sentElseIf" + this.noToken;
                                    this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n"
                                    this.arbolGraphviz += SentElseIf + " [label=\"<Sentecia>\"] \n"
                                    this.arbolGraphviz += sent + "->" + SentElseIf +"\n\n";

                                    this.sent(SentElseIf);

                                    //codigoGraphviz del arbol 
                                    let bloqueElse : string = "bloqueElse" + this.noToken;
                                    this.arbolGraphviz += "\/\/--------------------------" + bloqueElse + "--------------------------\n\n"
                                    this.arbolGraphviz += bloqueElse + " [label=\"<else>\"] \n"
                                    this.arbolGraphviz += sent + "->" + bloqueElse +"\n\n";

                                    this.bloqueElse(bloqueElse);


                                }else {this.sent(sent);}

                            }else {this.emparejarSent(" ) ", sent); this.sent(sent);}

                        }else {this.sent(sent);}

                    }else { this.emparejarSent(" ( ", sent);  this.sent(sent);}
                        
                }
                else
                {
                    this.emparejarSent("{ o if", sent);
                }

            } 

        }
    }

    private dec (sent:string) : boolean
    {
        //codigoGraphviz del arbol 
        let Dec : string = "Dec" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + Dec + "--------------------------\n\n"
        this.arbolAux + Dec + " [label=\"<Asignar\\n o\\n Invocar>\"] \n"
        this.arbolAux += sent + "->" + Dec +"\n\n";

        if (this.token.tipo == "Tipo primitivo")
        {
            //codigo del arbol
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n"
            this.arbolAux += Dec + "->" + this.noToken + "\n\n";  

            this.avanzar();
        }
        
        if (this.token.tipo == "ID")
        {
            this.emparejarSentID(Dec);

            if (this.emparejarSent("=", Dec))
            {
                return this.exp(Dec)

            }else {return false; }
        }
        else 
        {
            return this.emparejarSent("tipo primitivo  o ID", Dec);
        }


    }

    private LLoI_D(sent:string):boolean
    {
        //codigoGraphviz del arbol 
        let LLoI_D : string = "LLoI_D" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + LLoI_D + "--------------------------\n\n"
        this.arbolAux += LLoI_D + " [label=\"<LLoI_D>\"] \n"
        this.arbolAux += sent + "->" + LLoI_D +"\n\n";

        if (this.token.valor == "(")
        {
            this.emparejarSent("(", LLoI_D);

            if(this.valores(LLoI_D))
            {
                return this.emparejarSent(")", LLoI_D);

            }else {return false;}

        }else if (this.token.valor == "++")
        {
            return this.emparejarSent("++", LLoI_D);

        }else if (this.token.valor == "--")
        {
            return this.emparejarSent ("--", LLoI_D);         
        }
        else 
        {
            return this.emparejarSent("'(', '++', '--'", LLoI_D)
        }

    }

    private valores (LLoI_D:string):boolean
    {   
        //codigoGraphviz del arbol 
        let Valores : string = "Valores" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + Valores + "--------------------------\n\n"
        this.arbolAux += Valores + " [label=\"<Valores>\"] \n"
        this.arbolAux += LLoI_D + "->" + Valores +"\n\n"; 

        if (this.token.valor != ")")
        {
            if (this.exp(Valores))
            {
                return this.masValores(Valores); 

            }else{return false;} 

        }else {return true;}


    }

    private masValores(Valores:string):boolean
    {
        if (this.token.valor == ",")
        {
            //codigoGraphviz del arbol 
            let masValores : string = "Valores" + this.noToken;
            this.arbolAux += "\/\/--------------------------" + masValores + "--------------------------\n\n"
            this.arbolAux += masValores + " [label=\"<mas Valores>\"] \n"
            this.arbolAux += Valores + "->" + masValores +"\n\n";

            this.emparejarSent(",", masValores);
            
            if (this.exp(masValores))
            {
                return this.masValores(masValores); 

            }else{return false;} 

        }else {return true; }

    }

    private exp(sent:string):boolean
    {
        //codigoGraphviz del arbol 
        let Exp : string = "exp" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + Exp + "--------------------------\n\n"
        this.arbolAux += Exp + " [label=\"<Exp>\"] \n"
        this.arbolAux += sent + "->" + Exp +"\n\n";

        if (this.expA(Exp))
        {
            return this.E(Exp);

        }else {return false;}

    }

    private E(Exp:string):boolean
    {
        //codigoGraphviz del arbol 
        let E : string = "E" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + E + "--------------------------\n\n"
        this.arbolAux += E + " [label=\"<E>\"] \n"
        this.arbolAux += Exp + "->" + E +"\n\n";

        switch (this.token.valor) {

            case "||" :

                this.emparejarSent("||", E);

                if (this.expA(E))
                {
                    return this.E(E);

                }else {return false; }

            case "&&":

                this.emparejarSent("&&", E);

                if (this.expA(E))
                {
                    return this.E(E);

                }else {return false; }

            case "^":

                this.emparejarSent("^", E);

                if (this.expA(E))
                {
                    return this.E(E);

                }else {return false; }

            case ">":

                this.emparejarSent(">", E);

                if (this.expA(E))
                {
                    return this.E(E);

                }else {return false; }
                
            case "<":
                
                this.emparejarSent("<", E);

                if (this.expA(E))
                {
                    return this.E(E);

                }else {return false; }

            case ">=":

                this.emparejarSent(">=", E);

                if (this.expA(E))
                {
                    return this.E(E);

                }else {return false; }

            case "<=":
                
                this.emparejarSent("<=", E);

                if (this.expA(E))
                {
                    return this.E(E);

                }else {return false; }

            case "==" :
                
                this.emparejarSent("==", E);

                if (this.expA(E))
                {
                    return this.E(E);

                }else {return false; }

            case "!=":

                this.emparejarSent("!=", E);

                if (this.expA(E))
                {
                    return this.E(E);

                }else {return false; }
                
            default:

                return true;
        }

    }

    private expA(Exp:string):boolean
    {
        //codigoGraphviz del arbol 
        let ExpA : string = "ExpA" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + ExpA + "--------------------------\n\n"
        this.arbolAux += ExpA + " [label=\"<ExpeA>\"] \n"
        this.arbolAux += Exp + "->" + ExpA +"\n\n";

        if (this.token.valor == "-")
        {
            this.emparejarSent ("-", ExpA);
            
            if (this.dato(ExpA))
            {
                return this.EA(ExpA);

            }else {return false;}
            
        }
        else 
        {
            if (this.dato(ExpA))
            {
                return this.EA(ExpA);

            }else {return false; }

        }

    }

    private EA (ExpA:string):boolean
    {
        //codigoGraphviz del arbol 
        let EA : string = "EA" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + EA + "--------------------------\n\n"
        this.arbolAux += EA + " [label=\"<EA>\"] \n"
        this.arbolAux += ExpA + "->" + EA +"\n\n";

        switch (this.token.valor) 
        {
            case "+":
                
                this.emparejarSent("+", EA);

                if (this.dato(EA))
                {
                    return this.EA(EA);
                    
                }else {return false; }

            case "-":

                this.emparejarSent("-", EA);

                if (this.dato(EA))
                {
                    return this.EA(EA);
                    
                }else {return false; }

            case "*":

                this.emparejarSent("*", EA);

                if (this.dato(EA))
                {
                    return this.EA(EA);

                }else {return false; }

            case "/":

                this.emparejarSent("/", EA);

                if (this.dato(EA))
                {
                    return this.EA(EA);
                    
                }else {return false; }
                
            default:

                return true;
        }

    }

    private dato (ExpA:string) :boolean
    {
        //codigoGraphviz del arbol 
        let dato : string = "dato" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + dato + "--------------------------\n\n"
        this.arbolAux += dato + " [label=\"<Dato>\"] \n"
        this.arbolAux += ExpA + "->" + dato +"\n\n";

        if (this.token.valor == "!")
        {   
            this.emparejarSent("!", dato)

            if (this.token.tipo == "Parentesis izquierdo")
            {
                this.emparejarSent("(", dato);
                    
                if (this.exp(dato))
                {
                    return this.emparejarSent(")", dato)

                }else {return false;}

            }
            else if (this.token.tipo == "ID")
            {
                this.emparejarSentID(dato);

                let parentAbre = this.token.valor; 
                if (parentAbre == "(")
                {
                    this.emparejarSent("(", dato);

                    if(this.valores(dato))
                    {
                        return this.emparejarSent(")", dato);

                    }else {return false; }

                }else {return true;}
                
            }
            else if (this.token.tipo == "booleano")
            {
                return this.emparejarSent(this.token.valor, dato);
            }
            else 
            {
                return this.emparejarSent("una expresion", dato);
            }

        }
        else if (this.token.valor == "(")
        {
            this.emparejarSent("(", dato);
                    
            if (this.exp(dato))
            {
                return this.emparejarSent(")", dato)

            }else {return false;}

        }
        else if (this.token.tipo == "ID")
        {
            this.emparejarSentID(dato);

            let parentAbre = this.token.valor; 
            if (parentAbre == "(" || parentAbre == "++" || parentAbre == "--")
            {
                return this.LLoI_D(dato);

            }else { return true;}
           

        }
        else if (this.token.tipo == "Numero entero")
        {
            return this.emparejarSent(this.token.valor, dato);
        }
        else if (this.token.tipo == "Numero decimal")
        {
            return this.emparejarSent(this.token.valor, dato);
        }
        else if (this.token.tipo == "Cadena comillas dobles")
        {
            return this.emparejarSent(this.token.valor, dato);
        }
        else if (this.token.tipo == "Cadena comillas simples")
        {
            return this.emparejarSent(this.token.valor, dato);
        }
        else if (this.token.tipo == "booleano")
        {
            return this.emparejarSent(this.token.valor, dato);
        }
        else 
        {
            return this.emparejarSent("una expresion ", dato);
        }

    }
    
    getErrores (): string
    {
        let outPut= "";

        for (let i = 0; i < this.errores.length; i++) {
            
            outPut += "Error " + this.errores[i].tipo + ", en la fila " + this.errores[i].fila+"\n\n";
            
        }

        return outPut;
    }

    getTablaErroresHTML () : string 
    {
        let content = "<title>Errores Java</title>\n\n"

        content += "<style type = \"text/css\">"

        content += "    table, th, td {\n"
        content += "        border: 1px solid black;"
        content += "        border-collapse: collapse;"
        content +=  "   }\n\n"

        content += " th, td{\n\n"
        content += "        padding: 10px;"
        content += "    }\n\n";

        content +=" </style>"

        content += "<h1  style=\"text-align: center;\">Reporte de Errores de Java, analizar a patita</h1>"

        content += "<table border = 1.5 width = 100%>\n"
        content += "    <head>\n\n"
        content += "        <tr bgcolor = blue >\n"
        content += "            <th>Tipo Error</th>\n"
        content += "            <th>fila</th>\n"
        content += "            <th>Columna</th>\n"
        content += "            <th>Descripcion</th>\n"
        content += "        </tr>\n"
        content += "    </head>\n\n"

        for (let i = 0; i < this.errores.length; i++) {
        
            content += "    <tr>\n"
            content += "        <td>" + this.errores[i].tipo + "</td>\n";
            content += "        <td>" + this.errores[i].fila + "</td>\n";
            content += "        <td>" + this.errores[i].columna + "</td>\n"; 
            content += "        <td>" + this.errores[i].valor + "</td>\n";
            content += "    </tr>"

        }

        content += "\n</table>"

        return content;
    }

    getTablaTokesHTML () : string 
    {
        let content = "<title>Tokens Java</title>\n\n"

        content += "<style type = \"text/css\">"

        content += "    table, th, td {\n"
        content += "        border: 1px solid black;"
        content += "        border-collapse: collapse;"
        content +=  "   }\n\n"

        content += " th, td{\n\n"
        content += "        padding: 10px;"
        content += "    }\n\n";

        content +=" </style>"

        content += "<h1  style=\"text-align: center;\">Reporte de Tokens de Java, analizar a patita </h1>"

        content += "<table border = 1.5 width = 100%>\n\n"
        content += "    <head>\n"
        content += "        <tr bgcolor = blue >\n"
        content += "            <th>fila</th>\n"
        content += "            <th>Columna</th>\n"
        content += "            <th>Tipo Error</th>\n"
        content += "            <th>Descripcion</th>\n"
        content += "        </tr>\n"
        content += "    </head>\n\n"

        for (let i = 0; i < this.tokens.length; i++) {
        
            content += "    <tr>\n"
            content += "        <td>" + this.tokens[i].fila + "</td>\n";
            content += "        <td>" + this.tokens[i].columna + "</td>\n"; 
            content += "        <td>" + this.tokens[i].tipo + "</td>\n";
            content += "        <td>" + this.tokens[i].valor + "</td>\n";
            content += "    </tr>\n"

        }

        content += "\n</table>"

        return content;

    }

}