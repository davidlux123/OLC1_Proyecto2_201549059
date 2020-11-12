"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Reconocido_1 = __importDefault(require("./Reconocido"));
var parserPython = /** @class */ (function () {
    function parserPython(tokens, errores) {
        this.errores = [];
        this.tokens = [];
        this.noToken = 0;
        this.codigoPyton = "";
        this.arbolGraphviz = "";
        this.identacion = "";
        this.salidaLinea = "";
        this.arbolAux = "";
        this.llamadaMain = "";
        this.tokens = tokens;
        this.errores = errores;
        this.token = this.tokens[this.noToken];
        this.EOF = this.tokens[(this.tokens.length - 1)];
    }
    //---------------------------------------------------RECUPERACION DE CLASES--------------------------------------------------------------------------------------------------------------  
    parserPython.prototype.emparejarClaseID = function (clase) {
        if (this.token.tipo != "ID") {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea") {
                var coment = "";
                if (this.token.tipo == "Comentario unilinea") {
                    coment = this.token.valor.replace("//", "#");
                }
                else {
                    coment = this.token.valor.replace("/*", "'''");
                    coment = coment.replace("*/", "'''");
                }
                this.codigoPyton += coment + "\n";
                coment = "";
                this.avanzar();
            }
            else {
                this.errores.push(new Reconocido_1.default("sintactico", this.token.fila, this.token.columna, "Se encontró '" + this.token.valor + "' y se esperaba: ID "));
                if (this.token != this.EOF) {
                    for (var i = this.noToken; i < this.tokens.length; i++, this.noToken++) {
                        this.token = this.tokens[i];
                        if (this.token.valor == "public" || this.token.valor == "interface" || this.token.valor == "class") {
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            return false;
                        }
                    }
                }
                return false;
            }
        }
        else {
            //codigoGraphviz del arbol 
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
            this.arbolAux += clase + "->" + this.noToken + "\n\n";
            //traduccion
            this.salidaLinea += this.token.valor + " ";
            this.avanzar();
        }
        return true;
    };
    parserPython.prototype.emparejarClase = function (tokenValor, clase) {
        if (this.token.valor != tokenValor) {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea") {
                var coment = "";
                if (this.token.tipo == "Comentario unilinea") {
                    coment = this.token.valor.replace("//", "#");
                }
                else {
                    coment = this.token.valor.replace("/*", "'''");
                    coment = coment.replace("*/", "'''");
                }
                this.codigoPyton += coment + "\n";
                coment = "";
                this.avanzar();
            }
            else {
                this.errores.push(new Reconocido_1.default("sintactico", this.token.fila, this.token.columna, "Se encontró '" + this.token.valor + "' y se esperaba: " + tokenValor));
                if (this.token != this.EOF) {
                    for (var i = this.noToken; i < this.tokens.length; i++, this.noToken++) {
                        this.token = this.tokens[i];
                        if (this.token.valor == "public" || this.token.valor == "interface" || this.token.valor == "class") {
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            return false;
                        }
                    }
                }
                return false;
            }
        }
        else {
            //codigo del arbol
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
            this.arbolAux += clase + "->" + this.noToken + "\n\n";
            //traduccion
            if (this.token.valor != "public") {
                if (this.token.valor == "{") {
                    this.salidaLinea += ":\n\n";
                    this.identacion += "\t";
                    //codigoGraphviz del arbol, agrarlos a los archivos de salida 
                    this.codigoPyton += this.salidaLinea;
                    this.arbolGraphviz += this.arbolAux;
                    this.salidaLinea = "";
                    this.arbolAux = "";
                }
                else if (this.token.valor == "}") {
                    this.identacion = this.identacion.substr(1);
                    //codigoGraphviz del arbol, agrarlos a los archivos de salida y limpiar para una nueva clase y se resta una identacion
                    this.codigoPyton += this.llamadaMain;
                    this.arbolGraphviz += this.arbolAux;
                    this.llamadaMain = "";
                    this.salidaLinea = "";
                    this.arbolAux = "";
                }
                else if (this.token.valor == "class" || this.token.valor == "interface") {
                    this.salidaLinea += "class ";
                }
                else {
                    this.salidaLinea += this.token.valor + " ";
                }
            }
            this.avanzar();
        }
        return true;
    };
    //-------------------------------------------RECUPERACION DE SENTENCIAS & DE INTERFACE------------------------------------------------------------------------------------------------------
    parserPython.prototype.emparejarSentIDInterface = function (sentG) {
        if (this.token.tipo != "ID") {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea") {
                var coment = "";
                if (this.token.tipo == "Comentario unilinea") {
                    coment = this.token.valor.replace("//", "#");
                }
                else {
                    coment = this.token.valor.replace("/*", "'''");
                    coment = coment.replace("*/", "'''");
                }
                this.codigoPyton += coment + "\n";
                coment = "";
                this.avanzar();
            }
            else {
                this.errores.push(new Reconocido_1.default("sintactico", this.token.fila, this.token.columna, "Se encontró '" + this.token.valor + "' y se esperaba: ID"));
                if (this.token != this.EOF) {
                    for (var i = this.noToken; i < this.tokens.length; i++, this.noToken++) {
                        this.token = this.tokens[i];
                        if (this.token.valor == ";") {
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            this.avanzar();
                            return false;
                        }
                        else if (this.token.valor == "}") {
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            return false;
                        }
                    }
                }
                return false;
            }
        }
        else {
            //codigoGraphviz del arbol 
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
            this.arbolAux += sentG + "->" + this.noToken + "\n\n";
            //traduccion
            this.salidaLinea += this.token.valor + " ";
            this.avanzar();
        }
        return true;
    };
    parserPython.prototype.emparejarSentInterface = function (tokenValor, sentG) {
        if (this.token.valor != tokenValor) {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea") {
                var coment = "";
                if (this.token.tipo == "Comentario unilinea") {
                    coment = this.token.valor.replace("//", "#");
                }
                else {
                    coment = this.token.valor.replace("/*", "'''");
                    coment = coment.replace("*/", "'''");
                }
                this.codigoPyton += coment + "\n";
                coment = "";
                this.avanzar();
            }
            else {
                this.errores.push(new Reconocido_1.default("sintactico", this.token.fila, this.token.columna, "Se encontró '" + this.token.valor + "' y se esperaba: " + tokenValor));
                if (this.token != this.EOF) {
                    for (var i = this.noToken; i < this.tokens.length; i++, this.noToken++) {
                        this.token = this.tokens[i];
                        if (this.token.valor == ";") {
                            if (tokenValor == ";") {
                                //codigo del arbol
                                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                                this.arbolAux += sentG + "->" + this.noToken + "\n\n";
                                //traduccion
                                this.salidaLinea += this.token.valor;
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
                        else if (this.token.valor == "}") {
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            return false;
                        }
                    }
                }
                return false;
            }
        }
        else {
            //codigo del arbol
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
            this.arbolAux += sentG + "->" + this.noToken + "\n\n";
            if (this.token.valor != "public") {
                //traduccion
                if (this.token.valor == "void" || this.token.tipo == "Tipo primitivo") {
                    this.salidaLinea += this.identacion + "def ";
                }
                else if (this.token.valor == ";") {
                    this.salidaLinea += this.token.valor;
                    //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                    this.codigoPyton += this.salidaLinea + "\n\n";
                    this.arbolGraphviz += this.arbolAux;
                    //codigoGraphviz, limpiamos variables para una nueva sentencia
                    this.salidaLinea = "";
                    this.arbolAux = "";
                }
                else {
                    if (this.token.valor == "(" || this.token.valor == ")") {
                        this.salidaLinea += this.token.valor;
                    }
                    else {
                        this.salidaLinea += this.token.valor + " ";
                    }
                }
            }
            this.avanzar();
        }
        return true;
    };
    //------------------------------------------------RECUPERACION DE SENTENCIAS------------------------------------------------------------------------------------------------------
    parserPython.prototype.emparejarSentID = function (sentG) {
        if (this.token.tipo != "ID") {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea") {
                var coment = "";
                if (this.token.tipo == "Comentario unilinea") {
                    coment = this.token.valor.replace("//", "#");
                }
                else {
                    coment = this.token.valor.replace("/*", "'''");
                    coment = coment.replace("*/", "'''");
                }
                this.codigoPyton += coment + "\n";
                coment = "";
                this.avanzar();
            }
            else {
                this.errores.push(new Reconocido_1.default("sintactico", this.token.fila, this.token.columna, "Se encontró '" + this.token.valor + "' y se esperaba: ID"));
                if (this.token != this.EOF) {
                    for (var i = this.noToken; i < this.tokens.length; i++, this.noToken++) {
                        this.token = this.tokens[i];
                        if (this.token.valor == ";") {
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            this.avanzar();
                            return false;
                        }
                        else if (this.token.valor == "{") {
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            this.avanzar();
                            return false;
                        }
                        else if (this.token.valor == "}") {
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            return false;
                        }
                    }
                }
                return false;
            }
        }
        else {
            //codigo del arbol
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
            this.arbolAux += sentG + "->" + this.noToken + "\n\n";
            //traduccion
            this.salidaLinea += this.token.valor + " ";
            this.avanzar();
        }
        return true;
    };
    parserPython.prototype.emparejarSent = function (tokenValor, sentG) {
        if (this.token.valor != tokenValor) {
            if (this.token.tipo == "Comentario unilinea" || this.token.tipo == "Comentario multilinea") {
                var coment = "";
                if (this.token.tipo == "Comentario unilinea") {
                    coment = this.token.valor.replace("//", "#");
                }
                else {
                    coment = this.token.valor.replace("/*", "'''");
                    coment = coment.replace("*/", "'''");
                }
                this.codigoPyton += coment + "\n";
                coment = "";
                this.avanzar();
            }
            else {
                this.errores.push(new Reconocido_1.default("sintactico", this.token.fila, this.token.columna, "Se encontró '" + this.token.valor + "' y se esperaba: " + tokenValor));
                if (this.token != this.EOF) {
                    for (var i = this.noToken; i < this.tokens.length; i++, this.noToken++) {
                        this.token = this.tokens[i];
                        if (this.token.valor == ";") {
                            if (tokenValor == ";") {
                                //codigo del arbol
                                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                                this.arbolAux += sentG + "->" + this.noToken + "\n\n";
                                this.avanzar();
                                return true;
                            }
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            this.avanzar();
                            return false;
                        }
                        else if (this.token.valor == "{") {
                            if (tokenValor == "{") {
                                //codigo del arbol
                                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                                this.arbolAux += sentG + "->" + this.noToken + "\n\n";
                                this.salidaLinea += " :\n\n";
                                this.identacion += "\t";
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
                        else if (this.token.valor == "}") {
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            return false;
                        }
                    }
                }
                return false;
            }
        }
        else {
            if (this.token.tipo == "Cadena comillas dobles") {
                //codigo del arbol
                this.arbolAux += this.noToken + "[label=" + this.token.valor + "; shape=plaintext] \n";
                this.arbolAux += sentG + "->" + this.noToken + "\n\n";
            }
            else {
                //codigo del arbol
                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                this.arbolAux += sentG + "->" + this.noToken + "\n\n";
            }
            if (this.token.valor != "public" && this.token.valor != ";") {
                //traduccion
                if (this.token.tipo == "Tipo primitivo") {
                    this.salidaLinea += this.identacion + "var ";
                }
                else if (this.token.tipo == "ID" || this.token.valor == "return" || this.token.valor == "System" || this.token.valor == "continue"
                    || this.token.valor == "break" || this.token.valor == "if" || this.token.valor == "for" || this.token.valor == "while" || this.token.valor == "do") {
                    this.salidaLinea += this.identacion + this.token.valor + " ";
                }
                else if (this.token.valor == "void") {
                    this.salidaLinea += this.identacion + "def ";
                }
                else if (this.token.valor == "{") {
                    this.salidaLinea += ":\n\n";
                    this.identacion += "\t";
                    //codigoGraphviz del arbol, agrarlos a los archivos de salida 
                    this.codigoPyton += this.salidaLinea;
                    this.arbolGraphviz += this.arbolAux;
                    this.salidaLinea = "";
                    this.arbolAux = "";
                }
                else if (this.token.valor == "}") {
                    this.identacion = this.identacion.substr(1);
                    //codigoGraphviz del arbol, agrarlos a los archivos de salida y limpiar para una nueva clase y se resta una identacion
                    //this.codigoPyton += "\n\n"; SOLO PORQUE MUCHOS SALTOS DE LINEA
                    this.arbolGraphviz += this.arbolAux;
                    this.salidaLinea = "";
                    this.arbolAux = "";
                }
                else {
                    if (this.token.valor == "++") {
                        this.salidaLinea += "+= 1";
                    }
                    else if (this.token.valor == "--") {
                        this.salidaLinea += "-= 1";
                    }
                    else if (this.token.valor == "(" || this.token.valor == ")") {
                        this.salidaLinea += this.token.valor;
                    }
                    else if (this.token.valor == " && ") {
                        this.salidaLinea += " and ";
                    }
                    else if (this.token.valor == "||") {
                        this.salidaLinea += " or ";
                    }
                    else if (this.token.valor == "!") {
                        this.salidaLinea += "not ";
                    }
                    else if (this.token.valor == "^") {
                        this.salidaLinea += " xor ";
                    }
                    else {
                        this.salidaLinea += this.token.valor + " ";
                    }
                }
            }
            this.avanzar();
        }
        return true;
    };
    //------------------------------------------------AVANZAR EN LA LISTA DE TOKENS----------------------------------------------------------------------------------------------------------------------------------
    parserPython.prototype.avanzar = function () {
        if (this.token != this.EOF) {
            this.noToken++;
            this.token = this.tokens[this.noToken];
        }
    };
    //----------------------------------------------------ANALIZADOR SINTACTICO------------------------------------------------------------------------------------------------------------------------------
    parserPython.prototype.traducir = function () {
        this.arbolGraphviz += "\/\/------------------------iniico--------------------------\n\n";
        this.arbolGraphviz += "inicio [label=\"<inicio>\"] \n\n\n";
        this.inicio();
    };
    parserPython.prototype.inicio = function () {
        if (this.noToken < this.tokens.length) {
            //codigoGraphviz del arbol 
            var clase = "Clase" + this.noToken;
            this.arbolGraphviz += "\/\/--------------------------" + clase + "--------------------------\n\n";
            this.arbolGraphviz += clase + " [label=\"<Clase>\"] \n";
            this.arbolGraphviz += "inicio" + "->" + clase + "\n\n";
            this.TC(clase);
        }
    };
    parserPython.prototype.TC = function (clase) {
        if (this.token != this.EOF) {
            if (this.token.valor == "public") {
                this.emparejarClase("public", clase);
            }
            if (this.token.valor == "interface" || this.token.valor == "class") {
                var tipoClase = this.token.valor;
                this.emparejarClase(tipoClase, clase);
                if (this.emparejarClaseID(clase)) {
                    if (this.emparejarClase("{", clase)) {
                        if (tipoClase == "interface") {
                            //codigoGraphviz del arbol 
                            var sentGI = "sentGI" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sentGI + "--------------------------\n\n";
                            this.arbolGraphviz += sentGI + " [label=\"<Sentecia Interfaz>\"] \n";
                            this.arbolGraphviz += clase + "->" + sentGI + "\n\n";
                            this.Dec_M_F(sentGI);
                        }
                        else if (tipoClase == "class") {
                            //codigoGraphviz del arbol 
                            var sentG = "sentG" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sentG + "--------------------------\n\n";
                            this.arbolGraphviz += sentG + " [label=\"<Sentecia clase>\"] \n";
                            this.arbolGraphviz += clase + "->" + sentG + "\n\n";
                            this.sentG(sentG);
                        }
                        //codigoGraphviz del arbol, creando una nueva clase en el mismo archivo
                        var newClass = "masClases" + this.noToken;
                        this.arbolGraphviz += "\/\/--------------------------" + newClass + "--------------------------\n\n";
                        this.arbolGraphviz += newClass + " [label=\"<mas Clases>\"] \n\n";
                        this.arbolGraphviz += clase + "->" + newClass + "\n\n";
                        this.TC(newClass);
                    }
                    else {
                        this.TC(clase);
                    }
                }
                else {
                    this.TC(clase);
                }
            }
            else {
                this.emparejarClase("interface or class", clase); // error
                this.TC(clase);
            }
        }
    };
    parserPython.prototype.Dec_M_F = function (sentGI) {
        if (this.token != this.EOF) {
            if (this.token.valor == "}" || this.token == this.EOF) {
                this.emparejarClase("}", sentGI);
            }
            else {
                if (this.token.valor == "public") {
                    this.emparejarSentInterface("public", sentGI);
                }
                if (this.token.valor == "void" || this.token.tipo == "Tipo primitivo") {
                    this.emparejarSentInterface(this.token.valor, sentGI);
                    if (this.emparejarSentIDInterface(sentGI)) {
                        if (this.emparejarSentInterface("(", sentGI)) {
                            //codigoGraphviz del arbol
                            var params = "parametos" + this.noToken;
                            this.arbolAux += "\/\/--------------------------" + params + "--------------------------\n\n";
                            this.arbolAux += params + " [label=\"<Parametros>\"] \n";
                            this.arbolAux += sentGI + "->" + params + "\n\n";
                            if (this.params("interface", params)) {
                                if (this.emparejarSentInterface(")", sentGI)) {
                                    if (this.emparejarSentInterface(";", sentGI)) {
                                        //codigoGraphviz del arbol
                                        var newSentGI = "masSentGl" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + newSentGI + "--------------------------\n\n";
                                        this.arbolGraphviz += newSentGI + " [label=\"<mas Sentencias Interfaz>\"] \n\n";
                                        this.arbolGraphviz += sentGI + "->" + newSentGI + "\n\n";
                                        this.Dec_M_F(newSentGI);
                                    }
                                    else {
                                        this.Dec_M_F(sentGI);
                                    }
                                }
                                else {
                                    this.Dec_M_F(sentGI);
                                }
                            }
                            else {
                                this.Dec_M_F(sentGI);
                            }
                        }
                        else {
                            this.Dec_M_F(sentGI);
                        }
                    }
                    else {
                        this.Dec_M_F(sentGI);
                    }
                }
                else {
                    this.emparejarSentInterface("void o tipo primitivo", sentGI); // error
                    this.Dec_M_F(sentGI);
                }
            }
        }
    };
    parserPython.prototype.params = function (tipoC, params) {
        if (this.token != this.EOF) {
            if (this.token.valor == "int" || this.token.valor == "double" || this.token.valor == "String" || this.token.valor == "char" || this.token.valor == "boolean") {
                //codigoGraphviz del arbol   
                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                this.arbolAux += params + "->" + this.noToken + "\n\n";
                this.avanzar();
                if (this.token.tipo == "ID") {
                    //codigoGraphviz del arbol   
                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                    this.arbolAux += params + "->" + this.noToken + "\n\n";
                    this.salidaLinea += this.token.valor;
                    this.avanzar();
                    var masParams = "masParams" + this.noToken;
                    this.arbolAux += "\/\/--------------------------" + masParams + "--------------------------\n";
                    this.arbolAux += masParams + " [label=\"<mas Parametros>\"] \n";
                    this.arbolAux += params + "->" + masParams + "\n\n";
                    return this.masParamas(tipoC, masParams);
                }
                else {
                    if (tipoC = "interface") {
                        return this.emparejarSentIDInterface(params);
                    }
                    else if (tipoC == "class") {
                        return this.emparejarSentID(params);
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    };
    parserPython.prototype.masParamas = function (tipoC, params) {
        if (this.token != this.EOF) {
            if (this.token.valor == ",") {
                //codigoGraphviz del arbol
                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                this.arbolAux += params + "->" + this.noToken + "\n\n";
                //traduccion
                this.salidaLinea += ", ";
                this.avanzar();
                if (this.token.tipo != "Parentesis derecho") {
                    return this.params(tipoC, params);
                }
                else {
                    if (tipoC == "interface") {
                        return this.emparejarSentInterface("Tipo Primitivo", params);
                    }
                    else if (tipoC == "class") {
                        return this.emparejarSent("Tipo Primitivo", params);
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    };
    parserPython.prototype.sentG = function (sentG) {
        if (this.token != this.EOF) {
            if (this.token.valor == "}" || this.token == this.EOF) {
                this.emparejarClase("}", sentG);
            }
            else {
                if (this.token.valor == "public") {
                    this.emparejarSent(this.token.valor, sentG);
                }
                if (this.token.valor == "static") {
                    this.emparejarSent(this.token.valor, sentG);
                    if (this.emparejarSent("void", sentG)) {
                        if (this.emparejarSent("main", sentG)) {
                            if (this.emparejarSent("(", sentG)) {
                                if (this.emparejarSent("String", sentG)) {
                                    if (this.emparejarSent("[", sentG)) {
                                        if (this.emparejarSent("]", sentG)) {
                                            if (this.emparejarSent("args", sentG)) {
                                                if (this.emparejarSent(")", sentG)) {
                                                    // traduccion
                                                    this.salidaLinea = "";
                                                    this.salidaLinea += this.identacion + "def main ()";
                                                    if (this.emparejarSent("{", sentG)) {
                                                        //llamada del main
                                                        this.llamadaMain = "\tif __name__ = '__main__':\n\t\tmain()\n\n";
                                                        var sentMain = "sentMain" + this.noToken;
                                                        this.arbolGraphviz += "\/\/--------------------------" + sentMain + "--------------------------\n\n";
                                                        this.arbolGraphviz += sentMain + " [label=\"<Sentecia>\"] \n";
                                                        this.arbolGraphviz += sentG + "->" + sentMain + "\n\n";
                                                        this.sent(sentMain);
                                                        //codigoGraphviz del arbol 
                                                        var newSentG = "sentG" + this.noToken;
                                                        this.arbolGraphviz += "\/\/--------------------------" + newSentG + "--------------------------\n\n";
                                                        this.arbolGraphviz += newSentG + " [label=\"<mas Sentecia>\"] \n";
                                                        this.arbolGraphviz += sentG + "->" + newSentG + "\n\n";
                                                        this.sentG(newSentG);
                                                    }
                                                    else {
                                                        this.sentG(sentG);
                                                    }
                                                }
                                                else {
                                                    this.sentG(sentG);
                                                }
                                            }
                                            else {
                                                this.sentG(sentG);
                                            }
                                        }
                                        else {
                                            this.sentG(sentG);
                                        }
                                    }
                                    else {
                                        this.sentG(sentG);
                                    }
                                }
                                else {
                                    this.sentG(sentG);
                                }
                            }
                            else {
                                this.sentG(sentG);
                            }
                        }
                        else {
                            this.sentG(sentG);
                        }
                    }
                    else {
                        this.sentG(sentG);
                    }
                }
                else if (this.token.valor == "void") {
                    this.emparejarSent(this.token.valor, sentG);
                    if (this.emparejarSentID(sentG)) {
                        if (this.emparejarSent("(", sentG)) {
                            //codigoGraphviz del arbol
                            var params = "parametos" + this.noToken;
                            this.arbolAux += "\/\/--------------------------" + params + "--------------------------\n\n";
                            this.arbolAux += params + " [label=\"<Parametros>\"] \n";
                            this.arbolAux += sentG + "->" + params + "\n\n";
                            if (this.params("class", params)) {
                                if (this.emparejarSent(")", sentG)) {
                                    if (this.emparejarSent("{", sentG)) {
                                        var sentVoid = "sentVoid" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sentVoid + "--------------------------\n\n";
                                        this.arbolGraphviz += sentVoid + " [label=\"<Sentecia>\"] \n";
                                        this.arbolGraphviz += sentG + "->" + sentVoid + "\n\n";
                                        this.sent(sentVoid);
                                        //codigoGraphviz del arbol 
                                        var newSentG = "sentG" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + newSentG + "--------------------------\n\n";
                                        this.arbolGraphviz += newSentG + " [label=\"<mas Sentecia>\"] \n";
                                        this.arbolGraphviz += sentG + "->" + newSentG + "\n\n";
                                        this.sentG(newSentG);
                                    }
                                    else {
                                        this.sentG(sentG);
                                    }
                                }
                                else {
                                    this.sentG(sentG);
                                }
                            }
                            else {
                                this.sentG(sentG);
                            }
                        }
                        else {
                            this.sentG(sentG);
                        }
                    }
                    else {
                        this.sentG(sentG);
                    }
                }
                else if (this.token.valor == "int" || this.token.valor == "double" || this.token.valor == "String" || this.token.valor == "char" || this.token.valor == "boolean") {
                    //codigoGraphviz del arbol
                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                    this.arbolAux += sentG + "->" + this.noToken + "\n\n";
                    this.avanzar();
                    if (this.token.tipo == "ID") {
                        //no avanzo para guardar id adentro de este metodo
                        this.IoD(sentG);
                    }
                    else {
                        this.emparejarSentID(sentG); // error
                        this.sentG(sentG);
                    }
                }
                else {
                    this.emparejarSent("static, void o tipo primitivo", sentG); // error
                    this.sentG(sentG);
                }
            }
        }
    };
    parserPython.prototype.IoD = function (sentG) {
        var id = this.token.valor;
        //codigo del arbol
        this.arbolAux += this.noToken + "[label=\"" + id + "\"; shape=plaintext] \n";
        this.arbolAux += sentG + "->" + this.noToken + "\n\n";
        this.avanzar();
        if (this.token.valor == "(") {
            // traduccion 
            this.salidaLinea += this.identacion + "def " + id;
            this.emparejarSent("(", sentG);
            //codigoGraphviz del arbol
            var params = "parametos" + this.noToken;
            this.arbolAux += "\/\/--------------------------" + params + "--------------------------\n\n";
            this.arbolAux += params + " [label=\"<Parametros>\"] \n";
            this.arbolAux += sentG + "->" + params + "\n\n";
            if (this.params("class", params)) {
                if (this.emparejarSent(")", sentG)) {
                    if (this.emparejarSent("{", sentG)) {
                        var sentFunc = "sentFunc" + this.noToken;
                        this.arbolGraphviz += "\/\/--------------------------" + sentFunc + "--------------------------\n\n";
                        this.arbolGraphviz += sentFunc + " [label=\"<Sentecia>\"] \n";
                        this.arbolGraphviz += sentG + "->" + sentFunc + "\n\n";
                        this.sent(sentFunc);
                        //codigoGraphviz del arbol 
                        var newSentG = "sentG" + this.noToken;
                        this.arbolGraphviz += "\/\/--------------------------" + newSentG + "--------------------------\n\n";
                        this.arbolGraphviz += newSentG + " [label=\"<mas Sentecia>\"] \n";
                        this.arbolGraphviz += sentG + "->" + newSentG + "\n\n";
                        this.sentG(newSentG);
                    }
                    else {
                        this.sentG(sentG);
                    }
                }
                else {
                    this.sentG(sentG);
                }
            }
            else {
                this.sentG(sentG);
            }
        }
        else {
            this.salidaLinea += this.identacion + "var " + id;
            //codigoGraphviz del arbol 
            var asigV = "asig" + this.noToken;
            this.arbolAux += "\/\/--------------------------" + asigV + "--------------------------\n\n";
            this.arbolAux += asigV + " [label=\"<Asignacion>\"] \n";
            this.arbolAux += sentG + "->" + asigV + "\n\n";
            if (this.asig(asigV)) {
                //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                this.codigoPyton += this.salidaLinea + "\n\n";
                this.arbolGraphviz += this.arbolAux;
                //codigoGraphviz, limpiamos variables para una nueva sentencia
                this.salidaLinea = "";
                this.arbolAux = "";
                //codigoGraphviz
                var newSentG = "sentG" + this.noToken;
                this.arbolGraphviz += "\/\/--------------------------" + newSentG + "--------------------------\n\n";
                this.arbolGraphviz += newSentG + " [label=\"<mas Sentecia>\"] \n";
                this.arbolGraphviz += sentG + "->" + newSentG + "\n\n";
                this.sentG(newSentG);
            }
            else {
                this.sentG(sentG);
            }
        }
    };
    parserPython.prototype.asig = function (asigV) {
        if (this.token.valor == "=") {
            this.emparejarSent("=", asigV);
            if (this.exp(asigV)) {
                return this.masAsig(asigV);
            }
            else {
                return false;
            }
        }
        else {
            return this.masAsig(asigV);
        }
    };
    parserPython.prototype.masAsig = function (asigV) {
        if (this.token.valor == ";" || this.token == this.EOF) {
            return this.emparejarSent(";", asigV);
        }
        else if (this.token.valor == ",") {
            //codigoGraphviz del arbol 
            var masAsigV = "masAsig" + this.noToken;
            this.arbolAux += "\/\/--------------------------" + masAsigV + "--------------------------\n\n";
            this.arbolAux += masAsigV + " [label=\"<mas Asignacion>\"] \n";
            this.arbolAux += asigV + "->" + masAsigV + "\n\n";
            this.emparejarSent(",", masAsigV);
            if (this.emparejarSentID(masAsigV)) {
                return this.asig(masAsigV);
            }
            else {
                return false;
            }
        }
        else {
            return this.emparejarSent(" ';' , ',' o = ", asigV); // error
        }
    };
    parserPython.prototype.sent = function (sent) {
        if (this.token != this.EOF) {
            if (this.token.valor == "}" || this.token == this.EOF) {
                this.emparejarSent("}", sent);
            }
            else {
                switch (this.token.valor) {
                    case "return":
                        this.emparejarSent("return", sent);
                        if (this.token.tipo == "Punto y Coma") {
                            this.emparejarSent(";", sent);
                            //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                            this.codigoPyton += this.salidaLinea + "\n\n";
                            this.arbolGraphviz += this.arbolAux;
                            //codigoGraphviz, limpiamos variables para una nueva sentencia
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            //codigoGraphviz del arbol 
                            var newSent = "sent" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                            this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                            this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                            this.sent(newSent);
                        }
                        else if (this.exp(sent)) {
                            if (this.emparejarSent(";", sent)) {
                                //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                this.codigoPyton += this.salidaLinea + "\n\n";
                                this.arbolGraphviz += this.arbolAux;
                                //codigoGraphviz, limpiamos variables para una nueva sentencia
                                this.salidaLinea = "";
                                this.arbolAux = "";
                                //codigoGraphviz del arbol 
                                var newSent = "sent" + this.noToken;
                                this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                                this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                                this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                                this.sent(newSent);
                            }
                            else {
                                this.sent(sent);
                            }
                        }
                        else {
                            this.emparejarSent("; o expresion", sent); // error
                            this.sent(sent);
                        }
                        break;
                    case "break":
                        this.emparejarSent("break", sent);
                        if (this.emparejarSent(";", sent)) {
                            //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                            this.codigoPyton += this.salidaLinea + "\n\n";
                            this.arbolGraphviz += this.arbolAux;
                            //codigoGraphviz, limpiamos variables para una nueva sentencia
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            //codigoGraphviz del arbol 
                            var newSent = "sent" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                            this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                            this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                            this.sent(newSent);
                        }
                        else {
                            this.sent(sent);
                        }
                        break;
                    case "continue":
                        this.emparejarSent("continue", sent);
                        if (this.emparejarSent(";", sent)) {
                            //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                            this.codigoPyton += this.salidaLinea + "\n\n";
                            this.arbolGraphviz += this.arbolAux;
                            //codigoGraphviz, limpiamos variables para una nueva sentencia
                            this.salidaLinea = "";
                            this.arbolAux = "";
                            //codigoGraphviz del arbol 
                            var newSent = "sent" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                            this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                            this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                            this.sent(newSent);
                        }
                        else {
                            this.sent(sent);
                        }
                        break;
                    case "System":
                        this.emparejarSent("System", sent);
                        if (this.emparejarSent(".", sent)) {
                            if (this.emparejarSent("out", sent)) {
                                if (this.emparejarSent(".", sent)) {
                                    if (this.sl(sent)) {
                                        //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                        this.codigoPyton += this.salidaLinea + "\n\n";
                                        this.arbolGraphviz += this.arbolAux;
                                        //codigoGraphviz, limpiamos variables para una nueva sentencia
                                        this.salidaLinea = "";
                                        this.arbolAux = "";
                                        //codigoGraphviz del arbol 
                                        var newSent = "sent" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                                        this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                                        this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                                        this.sent(newSent);
                                    }
                                    else {
                                        this.sent(sent);
                                    }
                                }
                                else {
                                    this.sent(sent);
                                }
                            }
                            else {
                                this.sent(sent);
                            }
                        }
                        else {
                            this.sent(sent);
                        }
                        break;
                    case "if":
                        this.emparejarSent("if", sent);
                        if (this.token.tipo == "Parentesis izquierdo") {
                            //codigoGraphviz del arbol 
                            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                            this.arbolAux += sent + "->" + this.noToken + "\n\n";
                            this.avanzar();
                            if (this.exp(sent)) {
                                var parentCierra = this.token.tipo;
                                if (parentCierra == "Parentesis derecho") {
                                    //codigoGraphviz del arbol 
                                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                                    this.arbolAux += sent + "->" + this.noToken + "\n\n";
                                    this.avanzar();
                                    if (this.emparejarSent("{", sent)) {
                                        //codigoGraphviz del arbol 
                                        var Sentif = "sentif" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + Sentif + "--------------------------\n\n";
                                        this.arbolGraphviz += Sentif + " [label=\"<Sentecia>\"] \n";
                                        this.arbolGraphviz += sent + "->" + Sentif + "\n\n";
                                        this.sent(Sentif);
                                        //codigoGraphviz del arbol 
                                        var bloqueElse = "else" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + bloqueElse + "--------------------------\n\n";
                                        this.arbolGraphviz += bloqueElse + " [label=\"<else>\"] \n";
                                        this.arbolGraphviz += sent + "->" + bloqueElse + "\n\n";
                                        this.bloqueElse(bloqueElse);
                                        //codigoGraphviz del arbol 
                                        var newSent = "sent" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + newSent + "--------------------------\n\n";
                                        this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                                        this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                                        this.sent(newSent);
                                    }
                                    else {
                                        this.sent(sent);
                                    }
                                }
                                else {
                                    this.emparejarSent(" ) ", sent);
                                    this.sent(sent);
                                }
                            }
                            else {
                                this.sent(sent);
                            }
                        }
                        else {
                            this.emparejarSent(" ( ", sent);
                            this.sent(sent);
                        }
                        break;
                    case "while":
                        this.emparejarSent("while", sent);
                        if (this.token.tipo == "Parentesis izquierdo") {
                            //codigoGraphviz del arbol 
                            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                            this.arbolAux += sent + "->" + this.noToken + "\n\n";
                            this.avanzar();
                            if (this.exp(sent)) {
                                var parentCierra = this.token.tipo;
                                if (parentCierra == "Parentesis derecho") {
                                    //codigoGraphviz del arbol 
                                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                                    this.arbolAux += sent + "->" + this.noToken + "\n\n";
                                    this.avanzar();
                                    if (this.emparejarSent("{", sent)) {
                                        //codigoGraphviz del arbol 
                                        var sentWhile = "sentWhile" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sentWhile + "--------------------------\n\n";
                                        this.arbolGraphviz += sentWhile + " [label=\"<Sentecia>\"] \n";
                                        this.arbolGraphviz += sent + "->" + sentWhile + "\n\n";
                                        this.sent(sentWhile);
                                        //codigoGraphviz del arbol 
                                        var newSent = "sent" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                                        this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                                        this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                                        this.sent(newSent);
                                    }
                                    else {
                                        this.sent(sent);
                                    }
                                }
                                else {
                                    this.emparejarSent(" ) ", sent);
                                    this.sent(sent);
                                }
                            }
                            else {
                                this.sent(sent);
                            }
                        }
                        else {
                            this.emparejarSent(" ( ", sent);
                            this.sent(sent);
                        }
                        break;
                    case "do":
                        this.emparejarSent("do", sent);
                        this.salidaLinea = this.identacion + "while true ";
                        if (this.emparejarSent("{", sent)) {
                            //codigoGraphviz del arbol 
                            var sentDo = "sentDo" + this.noToken;
                            this.arbolGraphviz += "\/\/--------------------------" + sentDo + "--------------------------\n\n";
                            this.arbolGraphviz += sentDo + " [label=\"<Sentecia>\"] \n";
                            this.arbolGraphviz += sent + "->" + sentDo + "\n\n";
                            this.sent(sentDo);
                            if (this.emparejarSent("while", sent)) {
                                this.salidaLinea = this.identacion + "   " + "if ";
                                if (this.token.tipo == "Parentesis izquierdo") {
                                    //codigoGraphviz del arbol 
                                    this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                                    this.arbolAux += sent + "->" + this.noToken + "\n\n";
                                    this.avanzar();
                                    if (this.exp(sent)) {
                                        var parentCierra = this.token.tipo;
                                        if (parentCierra == "Parentesis derecho") {
                                            //codigoGraphviz del arbol 
                                            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                                            this.arbolAux += sent + "->" + this.noToken + "\n\n";
                                            this.avanzar();
                                            if (this.emparejarSent(";", sent)) {
                                                this.salidaLinea += ":\n\n";
                                                this.salidaLinea += this.identacion + "        break";
                                                //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                                this.codigoPyton += this.salidaLinea + "\n\n";
                                                this.arbolGraphviz += this.arbolAux;
                                                //codigoGraphviz, limpiamos variables para una nueva sentencia
                                                this.salidaLinea = "";
                                                this.arbolAux = "";
                                                //codigoGraphviz del arbol 
                                                var newSent = "sent" + this.noToken;
                                                this.arbolGraphviz += "\/\/--------------------------" + newSent + "--------------------------\n\n";
                                                this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                                                this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                                                this.sent(newSent);
                                            }
                                            else {
                                                this.sent(sent);
                                            }
                                        }
                                        else {
                                            this.emparejarSent(" ) ", sent);
                                            this.sent(sent);
                                        }
                                    }
                                    else {
                                        this.sent(sent);
                                    }
                                }
                                else {
                                    this.emparejarSent(" ( ", sent);
                                    this.sent(sent);
                                }
                            }
                            else {
                                this.sent(sent);
                            }
                        }
                        else {
                            this.sent(sent);
                        }
                        break;
                    case "for":
                        this.emparejarSent("for", sent);
                        if (this.emparejarSent("(", sent)) {
                            this.salidaLinea = this.identacion + "for ";
                            if (this.dec(sent)) {
                                if (this.emparejarSent(";", sent)) {
                                    this.salidaLinea += "in range (";
                                    if (this.exp(sent)) {
                                        if (this.emparejarSent(";", sent)) {
                                            this.salidaLinea += ", ";
                                            if (this.exp(sent)) {
                                                if (this.emparejarSent(")", sent)) {
                                                    if (this.emparejarSent("{", sent)) {
                                                        //codigoGraphviz del arbol 
                                                        var sentFor = "sentFor" + this.noToken;
                                                        this.arbolGraphviz += "\/\/--------------------------" + sentFor + "--------------------------\n\n";
                                                        this.arbolGraphviz += sentFor + " [label=\"<Sentecia>\"] \n";
                                                        this.arbolGraphviz += sent + "->" + sentFor + "\n\n";
                                                        this.sent(sentFor);
                                                        //codigoGraphviz del arbol 
                                                        var newSent = "sent" + this.noToken;
                                                        this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                                                        this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                                                        this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                                                        this.sent(newSent);
                                                    }
                                                    else {
                                                        this.sent(sent);
                                                    }
                                                }
                                                else {
                                                    this.sent(sent);
                                                }
                                            }
                                            else {
                                                this.sent(sent);
                                            }
                                        }
                                        else {
                                            this.sent(sent);
                                        }
                                    }
                                    else {
                                        this.sent(sent);
                                    }
                                }
                                else {
                                    this.sent(sent);
                                }
                            }
                            else {
                                this.sent(sent);
                            }
                        }
                        else {
                            this.sent(sent);
                        }
                        break;
                    default:
                        if (this.token.tipo == "Tipo primitivo") // declaracion de valriables
                         {
                            this.emparejarSent(this.token.valor, sent);
                            if (this.emparejarSentID(sent)) {
                                //codigoGraphviz del arbol 
                                var asigV = "asig" + this.noToken;
                                this.arbolAux += "\/\/--------------------------" + asigV + "--------------------------\n\n";
                                this.arbolAux += asigV + " [label=\"<Asignacion>\"] \n";
                                this.arbolAux += sent + "->" + asigV + "\n\n";
                                if (this.asig(asigV)) {
                                    //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                    this.codigoPyton += this.salidaLinea + "\n\n";
                                    this.arbolGraphviz += this.arbolAux;
                                    //codigoGraphviz, limpiamos variables para una nueva sentencia
                                    this.salidaLinea = "";
                                    this.arbolAux = "";
                                    //codigoGraphviz del arbol 
                                    var newSent = "sent" + this.noToken;
                                    this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                                    this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                                    this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                                    this.sent(newSent);
                                }
                                else {
                                    this.sent(sent);
                                }
                            }
                            else {
                                this.sent(sent);
                            }
                        }
                        else if (this.token.tipo == "ID") // invocacion de ID
                         {
                            this.emparejarSent(this.token.valor, sent);
                            if (this.token.valor == "=") // asignacion de varable
                             {
                                this.emparejarSent("=", sent);
                                if (this.exp(sent)) {
                                    if (this.emparejarSent(";", sent)) {
                                        //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                        this.codigoPyton += this.salidaLinea + "\n\n";
                                        this.arbolGraphviz += this.arbolAux;
                                        //codigoGraphviz, limpiamos variables para una nueva sentencia
                                        this.salidaLinea = "";
                                        this.arbolAux = "";
                                        //codigoGraphviz del arbol 
                                        var newSent = "sent" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                                        this.arbolGraphviz + newSent + " [label=\"<mas Sentecia>\"] \n";
                                        this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                                        this.sent(newSent);
                                    }
                                    else {
                                        this.sent(sent);
                                    }
                                }
                                else {
                                    this.sent(sent);
                                }
                            }
                            else if (this.token.valor == "(" || this.token.valor == "++" || this.token.valor == "--") //llamada metodos, incrementar o drecemtar
                             {
                                if (this.LLoI_D(sent)) {
                                    if (this.emparejarSent(";", sent)) {
                                        //codigoGraphviz al arbol y salida de clase, agregamos la sentencia global reconocida
                                        this.codigoPyton += this.salidaLinea + "\n\n";
                                        this.arbolGraphviz += this.arbolAux;
                                        //codigoGraphviz, limpiamos variables para una nueva sentencia
                                        this.salidaLinea = "";
                                        this.arbolAux = "";
                                        //codigoGraphviz del arbol 
                                        var newSent = "sent" + this.noToken;
                                        this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                                        this.arbolGraphviz += newSent + " [label=\"<mas Sentecia>\"] \n";
                                        this.arbolGraphviz += sent + "->" + newSent + "\n\n";
                                        this.sent(newSent);
                                    }
                                    else {
                                        this.sent(sent);
                                    }
                                }
                                else {
                                    this.sent(sent);
                                }
                            }
                            else {
                                this.emparejarSent("=, '(', '++', '--'", sent);
                                this.sent(sent);
                            }
                        }
                        else {
                            this.emparejarSent("una sentencia", sent);
                            this.sent(sent);
                        }
                        break;
                }
            }
        }
    };
    parserPython.prototype.sl = function (sent) {
        if (this.token.valor == "print" || this.token.valor == "println") {
            this.emparejarSent(this.token.valor, sent);
            this.salidaLinea = this.identacion + "print ";
            if (this.emparejarSent("(", sent)) {
                if (this.token.tipo == "Parentesis derecho") {
                    this.emparejarSent(")", sent);
                    return this.emparejarSent(";", sent);
                }
                else {
                    if (this.exp(sent)) {
                        if (this.emparejarSent(")", sent)) {
                            return this.emparejarSent(";", sent);
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }
        else {
            return this.emparejarSent("print o println", sent);
        }
    };
    parserPython.prototype.bloqueElse = function (sent) {
        if (this.token != this.EOF) {
            if (this.token.tipo == "else") {
                //codigo del arbol
                this.arbolAux += this.noToken + "[label=\" else \"; shape=plaintext] \n";
                this.arbolAux += sent + "->" + this.noToken + "\n\n";
                this.avanzar();
                if (this.token.valor == "{") {
                    this.salidaLinea += this.identacion + "else ";
                    this.emparejarSent("{", sent);
                    //codigoGraphviz del arbol 
                    var SentElse = "sentElse" + this.noToken;
                    this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                    this.arbolGraphviz += SentElse + " [label=\"<Sentecia>\"] \n";
                    this.arbolGraphviz += sent + "->" + SentElse + "\n\n";
                    this.sent(SentElse);
                }
                else if (this.token.valor == "if") {
                    //codigo del arbol
                    this.arbolAux += this.noToken + "[label=\" if \"; shape=plaintext] \n";
                    this.arbolAux += sent + "->" + this.noToken + "\n\n";
                    this.salidaLinea += this.identacion + "elif ";
                    this.avanzar();
                    var parentAbre = this.token.valor;
                    if (parentAbre == "(") {
                        //codigoGraphviz del arbol 
                        this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                        this.arbolAux += sent + "->" + this.noToken + "\n\n";
                        this.avanzar();
                        if (this.exp(sent)) {
                            var parentCierra = this.token.valor;
                            if (parentCierra == ")") {
                                //codigoGraphviz del arbol 
                                this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
                                this.arbolAux += sent + "->" + this.noToken + "\n\n";
                                this.avanzar();
                                if (this.emparejarSent("{", sent)) {
                                    //codigoGraphviz del arbol 
                                    var SentElseIf = "sentElseIf" + this.noToken;
                                    this.arbolGraphviz += "\/\/--------------------------" + sent + "--------------------------\n\n";
                                    this.arbolGraphviz += SentElseIf + " [label=\"<Sentecia>\"] \n";
                                    this.arbolGraphviz += sent + "->" + SentElseIf + "\n\n";
                                    this.sent(SentElseIf);
                                    //codigoGraphviz del arbol 
                                    var bloqueElse = "bloqueElse" + this.noToken;
                                    this.arbolGraphviz += "\/\/--------------------------" + bloqueElse + "--------------------------\n\n";
                                    this.arbolGraphviz += bloqueElse + " [label=\"<else>\"] \n";
                                    this.arbolGraphviz += sent + "->" + bloqueElse + "\n\n";
                                    this.bloqueElse(bloqueElse);
                                }
                                else {
                                    this.sent(sent);
                                }
                            }
                            else {
                                this.emparejarSent(" ) ", sent);
                                this.sent(sent);
                            }
                        }
                        else {
                            this.sent(sent);
                        }
                    }
                    else {
                        this.emparejarSent(" ( ", sent);
                        this.sent(sent);
                    }
                }
                else {
                    this.emparejarSent("{ o if", sent);
                }
            }
        }
    };
    parserPython.prototype.dec = function (sent) {
        //codigoGraphviz del arbol 
        var Dec = "Dec" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + Dec + "--------------------------\n\n";
        this.arbolAux + Dec + " [label=\"<Asignar\\n o\\n Invocar>\"] \n";
        this.arbolAux += sent + "->" + Dec + "\n\n";
        if (this.token.tipo == "Tipo primitivo") {
            //codigo del arbol
            this.arbolAux += this.noToken + "[label=\"" + this.token.valor + "\"; shape=plaintext] \n";
            this.arbolAux += Dec + "->" + this.noToken + "\n\n";
            this.avanzar();
        }
        if (this.token.tipo == "ID") {
            this.emparejarSentID(Dec);
            if (this.emparejarSent("=", Dec)) {
                return this.exp(Dec);
            }
            else {
                return false;
            }
        }
        else {
            return this.emparejarSent("tipo primitivo  o ID", Dec);
        }
    };
    parserPython.prototype.LLoI_D = function (sent) {
        //codigoGraphviz del arbol 
        var LLoI_D = "LLoI_D" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + LLoI_D + "--------------------------\n\n";
        this.arbolAux += LLoI_D + " [label=\"<LLoI_D>\"] \n";
        this.arbolAux += sent + "->" + LLoI_D + "\n\n";
        if (this.token.valor == "(") {
            this.emparejarSent("(", LLoI_D);
            if (this.valores(LLoI_D)) {
                return this.emparejarSent(")", LLoI_D);
            }
            else {
                return false;
            }
        }
        else if (this.token.valor == "++") {
            return this.emparejarSent("++", LLoI_D);
        }
        else if (this.token.valor == "--") {
            return this.emparejarSent("--", LLoI_D);
        }
        else {
            return this.emparejarSent("'(', '++', '--'", LLoI_D);
        }
    };
    parserPython.prototype.valores = function (LLoI_D) {
        //codigoGraphviz del arbol 
        var Valores = "Valores" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + Valores + "--------------------------\n\n";
        this.arbolAux += Valores + " [label=\"<Valores>\"] \n";
        this.arbolAux += LLoI_D + "->" + Valores + "\n\n";
        if (this.token.valor != ")") {
            if (this.exp(Valores)) {
                return this.masValores(Valores);
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    };
    parserPython.prototype.masValores = function (Valores) {
        if (this.token.valor == ",") {
            //codigoGraphviz del arbol 
            var masValores = "Valores" + this.noToken;
            this.arbolAux += "\/\/--------------------------" + masValores + "--------------------------\n\n";
            this.arbolAux += masValores + " [label=\"<mas Valores>\"] \n";
            this.arbolAux += Valores + "->" + masValores + "\n\n";
            this.emparejarSent(",", masValores);
            if (this.exp(masValores)) {
                return this.masValores(masValores);
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    };
    parserPython.prototype.exp = function (sent) {
        //codigoGraphviz del arbol 
        var Exp = "exp" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + Exp + "--------------------------\n\n";
        this.arbolAux += Exp + " [label=\"<Exp>\"] \n";
        this.arbolAux += sent + "->" + Exp + "\n\n";
        if (this.expA(Exp)) {
            return this.E(Exp);
        }
        else {
            return false;
        }
    };
    parserPython.prototype.E = function (Exp) {
        //codigoGraphviz del arbol 
        var E = "E" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + E + "--------------------------\n\n";
        this.arbolAux += E + " [label=\"<E>\"] \n";
        this.arbolAux += Exp + "->" + E + "\n\n";
        switch (this.token.valor) {
            case "||":
                this.emparejarSent("||", E);
                if (this.expA(E)) {
                    return this.E(E);
                }
                else {
                    return false;
                }
            case "&&":
                this.emparejarSent("&&", E);
                if (this.expA(E)) {
                    return this.E(E);
                }
                else {
                    return false;
                }
            case "^":
                this.emparejarSent("^", E);
                if (this.expA(E)) {
                    return this.E(E);
                }
                else {
                    return false;
                }
            case ">":
                this.emparejarSent(">", E);
                if (this.expA(E)) {
                    return this.E(E);
                }
                else {
                    return false;
                }
            case "<":
                this.emparejarSent("<", E);
                if (this.expA(E)) {
                    return this.E(E);
                }
                else {
                    return false;
                }
            case ">=":
                this.emparejarSent(">=", E);
                if (this.expA(E)) {
                    return this.E(E);
                }
                else {
                    return false;
                }
            case "<=":
                this.emparejarSent("<=", E);
                if (this.expA(E)) {
                    return this.E(E);
                }
                else {
                    return false;
                }
            case "==":
                this.emparejarSent("==", E);
                if (this.expA(E)) {
                    return this.E(E);
                }
                else {
                    return false;
                }
            case "!=":
                this.emparejarSent("!=", E);
                if (this.expA(E)) {
                    return this.E(E);
                }
                else {
                    return false;
                }
            default:
                return true;
        }
    };
    parserPython.prototype.expA = function (Exp) {
        //codigoGraphviz del arbol 
        var ExpA = "ExpA" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + ExpA + "--------------------------\n\n";
        this.arbolAux += ExpA + " [label=\"<ExpeA>\"] \n";
        this.arbolAux += Exp + "->" + ExpA + "\n\n";
        if (this.token.valor == "-") {
            this.emparejarSent("-", ExpA);
            if (this.dato(ExpA)) {
                return this.EA(ExpA);
            }
            else {
                return false;
            }
        }
        else {
            if (this.dato(ExpA)) {
                return this.EA(ExpA);
            }
            else {
                return false;
            }
        }
    };
    parserPython.prototype.EA = function (ExpA) {
        //codigoGraphviz del arbol 
        var EA = "EA" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + EA + "--------------------------\n\n";
        this.arbolAux += EA + " [label=\"<EA>\"] \n";
        this.arbolAux += ExpA + "->" + EA + "\n\n";
        switch (this.token.valor) {
            case "+":
                this.emparejarSent("+", EA);
                if (this.dato(EA)) {
                    return this.EA(EA);
                }
                else {
                    return false;
                }
            case "-":
                this.emparejarSent("-", EA);
                if (this.dato(EA)) {
                    return this.EA(EA);
                }
                else {
                    return false;
                }
            case "*":
                this.emparejarSent("*", EA);
                if (this.dato(EA)) {
                    return this.EA(EA);
                }
                else {
                    return false;
                }
            case "/":
                this.emparejarSent("/", EA);
                if (this.dato(EA)) {
                    return this.EA(EA);
                }
                else {
                    return false;
                }
            default:
                return true;
        }
    };
    parserPython.prototype.dato = function (ExpA) {
        //codigoGraphviz del arbol 
        var dato = "dato" + this.noToken;
        this.arbolAux += "\/\/--------------------------" + dato + "--------------------------\n\n";
        this.arbolAux += dato + " [label=\"<Dato>\"] \n";
        this.arbolAux += ExpA + "->" + dato + "\n\n";
        if (this.token.valor == "!") {
            this.emparejarSent("!", dato);
            if (this.token.tipo == "Parentesis izquierdo") {
                this.emparejarSent("(", dato);
                if (this.exp(dato)) {
                    return this.emparejarSent(")", dato);
                }
                else {
                    return false;
                }
            }
            else if (this.token.tipo == "ID") {
                this.emparejarSentID(dato);
                var parentAbre = this.token.valor;
                if (parentAbre == "(") {
                    this.emparejarSent("(", dato);
                    if (this.valores(dato)) {
                        return this.emparejarSent(")", dato);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
            else if (this.token.tipo == "booleano") {
                return this.emparejarSent(this.token.valor, dato);
            }
            else {
                return this.emparejarSent("una expresion", dato);
            }
        }
        else if (this.token.valor == "(") {
            this.emparejarSent("(", dato);
            if (this.exp(dato)) {
                return this.emparejarSent(")", dato);
            }
            else {
                return false;
            }
        }
        else if (this.token.tipo == "ID") {
            this.emparejarSentID(dato);
            var parentAbre = this.token.valor;
            if (parentAbre == "(" || parentAbre == "++" || parentAbre == "--") {
                return this.LLoI_D(dato);
            }
            else {
                return true;
            }
        }
        else if (this.token.tipo == "Numero entero") {
            return this.emparejarSent(this.token.valor, dato);
        }
        else if (this.token.tipo == "Numero decimal") {
            return this.emparejarSent(this.token.valor, dato);
        }
        else if (this.token.tipo == "Cadena comillas dobles") {
            return this.emparejarSent(this.token.valor, dato);
        }
        else if (this.token.tipo == "Cadena comillas simples") {
            return this.emparejarSent(this.token.valor, dato);
        }
        else if (this.token.tipo == "booleano") {
            return this.emparejarSent(this.token.valor, dato);
        }
        else {
            return this.emparejarSent("una expresion ", dato);
        }
    };
    parserPython.prototype.getErrores = function () {
        var outPut = "";
        for (var i = 0; i < this.errores.length; i++) {
            outPut += "Error " + this.errores[i].tipo + ", en la fila " + this.errores[i].fila + "\n\n";
        }
        return outPut;
    };
    parserPython.prototype.getTablaErroresHTML = function () {
        var content = "<title>Errores Java</title>\n\n";
        content += "<style type = \"text/css\">";
        content += "    table, th, td {\n";
        content += "        border: 1px solid black;";
        content += "        border-collapse: collapse;";
        content += "   }\n\n";
        content += " th, td{\n\n";
        content += "        padding: 10px;";
        content += "    }\n\n";
        content += " </style>";
        content += "<h1  style=\"text-align: center;\">Reporte de Errores de Java, analizar a patita</h1>";
        content += "<table border = 1.5 width = 100%>\n";
        content += "    <head>\n\n";
        content += "        <tr bgcolor = blue >\n";
        content += "            <th>Tipo Error</th>\n";
        content += "            <th>fila</th>\n";
        content += "            <th>Columna</th>\n";
        content += "            <th>Descripcion</th>\n";
        content += "        </tr>\n";
        content += "    </head>\n\n";
        for (var i = 0; i < this.errores.length; i++) {
            content += "    <tr>\n";
            content += "        <td>" + this.errores[i].tipo + "</td>\n";
            content += "        <td>" + this.errores[i].fila + "</td>\n";
            content += "        <td>" + this.errores[i].columna + "</td>\n";
            content += "        <td>" + this.errores[i].valor + "</td>\n";
            content += "    </tr>";
        }
        content += "\n</table>";
        return content;
    };
    parserPython.prototype.getTablaTokesHTML = function () {
        var content = "<title>Tokens Java</title>\n\n";
        content += "<style type = \"text/css\">";
        content += "    table, th, td {\n";
        content += "        border: 1px solid black;";
        content += "        border-collapse: collapse;";
        content += "   }\n\n";
        content += " th, td{\n\n";
        content += "        padding: 10px;";
        content += "    }\n\n";
        content += " </style>";
        content += "<h1  style=\"text-align: center;\">Reporte de Tokens de Java, analizar a patita </h1>";
        content += "<table border = 1.5 width = 100%>\n\n";
        content += "    <head>\n";
        content += "        <tr bgcolor = blue >\n";
        content += "            <th>fila</th>\n";
        content += "            <th>Columna</th>\n";
        content += "            <th>Tipo Error</th>\n";
        content += "            <th>Descripcion</th>\n";
        content += "        </tr>\n";
        content += "    </head>\n\n";
        for (var i = 0; i < this.tokens.length; i++) {
            content += "    <tr>\n";
            content += "        <td>" + this.tokens[i].fila + "</td>\n";
            content += "        <td>" + this.tokens[i].columna + "</td>\n";
            content += "        <td>" + this.tokens[i].tipo + "</td>\n";
            content += "        <td>" + this.tokens[i].valor + "</td>\n";
            content += "    </tr>\n";
        }
        content += "\n</table>";
        return content;
    };
    return parserPython;
}());
exports.default = parserPython;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VyUHl0aG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYW5hbGl6YWRvcmVzUHl0aG9uL1BhcnNlclB5dGhvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFxQztBQUVyQztJQVVJLHNCQUFhLE1BQXFCLEVBQUUsT0FBc0I7UUFQbEQsWUFBTyxHQUFnQixFQUFFLENBQUM7UUFDMUIsV0FBTSxHQUFnQixFQUFFLENBQUM7UUFFekIsWUFBTyxHQUFZLENBQUMsQ0FBQztRQWE3QixnQkFBVyxHQUFZLEVBQUUsQ0FBQztRQUMxQixrQkFBYSxHQUFZLEVBQUUsQ0FBQztRQUVwQixlQUFVLEdBQVksRUFBRSxDQUFDO1FBRXpCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBQ3pCLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFFdEIsZ0JBQVcsR0FBRyxFQUFFLENBQUM7UUFmckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN0QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRWxELENBQUM7SUFhRCwyTEFBMkw7SUFDbkwsdUNBQWdCLEdBQXhCLFVBQXlCLEtBQWM7UUFFbkMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQzNCO1lBQ0ksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxxQkFBcUIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSx1QkFBdUIsRUFDMUY7Z0JBQ0ksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFBO2dC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