"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Reconocido_1 = __importDefault(require("./Reconocido"));
var scannerPython = /** @class */ (function () {
    function scannerPython() {
        this.errores = new Array();
        this.tokens = new Array();
        this.palabrasReservadas = [
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
    scannerPython.prototype.existePalabraReservada = function (lexema) {
        for (var i = 0; i < this.palabrasReservadas.length; i++) {
            if (lexema == this.palabrasReservadas[i]) {
                return true;
            }
        }
        return false;
    };
    scannerPython.prototype.scannear = function (entrada) {
        entrada += '#';
        var fila = 1;
        var col = 0;
        var estado = 0;
        var lexema = "";
        for (var i = 0; i < entrada.length; i++) {
            var char = entrada[i];
            var charAscii = char.charCodeAt(0);
            var EOF = char == '#' && i == (entrada.length - 1);
            switch (estado) {
                case 0:
                    if (charAscii == 13 || charAscii == 9 || charAscii == 10 || charAscii == 32) {
                        estado = 0;
                        if (charAscii == 10) {
                            col = 0;
                            fila++;
                        }
                    }
                    else if (char.match("[a-z]") || char.match("[A-Z]") || char == '_') {
                        estado = 1;
                        col++;
                        lexema += char;
                    }
                    else if (char.match("[0-9]")) {
                        estado = 2;
                        col++;
                        lexema += char;
                    }
                    else if (char == '&' || char == '|' || char == '>' || char == '<' || char == '=' || char == '!' || char == '+' || char == '-') {
                        estado = 11;
                        col++;
                        lexema += char;
                    }
                    else if (char == '{' || char == '}' || char == '(' || char == ')' || char == '[' || char == ']' || char == '^' || char == '*' || char == ',' || char == '.' || char == ';') {
                        estado = 0;
                        col++;
                        this.tokens.push(new Reconocido_1.default("simbolo", fila, col, char));
                    }
                    else if (char == "\"") {
                        estado = 5;
                        col++;
                        lexema += char;
                    }
                    else if (char == "'") {
                        estado = 6;
                        col++;
                        lexema += char;
                    }
                    else if (char == "/") {
                        estado = 7;
                        col++;
                        lexema += char;
                    }
                    else {
                        if (EOF) {
                            col++;
                            this.tokens.push(new Reconocido_1.default("EOF", fila, col, "#"));
                        }
                        else {
                            estado = 0;
                            col++;
                            this.errores.push(new Reconocido_1.default("lexico", fila, col, "El caracter '" + char + "' no pertenece al lenguaje"));
                        }
                    }
                    break;
                case 1:
                    if (char.match("[a-z]") || char.match("[A-Z]") || char == '_' || char.match("[0-9]")) {
                        estado = 1;
                        col++;
                        lexema += char;
                    }
                    else {
                        if (this.existePalabraReservada(lexema)) {
                            if (lexema == "true" || lexema == "false") {
                                this.tokens.push(new Reconocido_1.default("booleano", fila, col, lexema));
                            }
                            else if (lexema == "int" || lexema == "double" || lexema == "String" || lexema == "char" || lexema == "boolean") {
                                this.tokens.push(new Reconocido_1.default("Tipo primitivo", fila, col, lexema));
                            }
                            else if (lexema == "else") {
                                this.tokens.push(new Reconocido_1.default("else", fila, col, lexema));
                            }
                            else {
                                this.tokens.push(new Reconocido_1.default("Palabra reservada", fila, col, lexema));
                            }
                        }
                        else {
                            this.tokens.push(new Reconocido_1.default("ID", fila, col, lexema));
                        }
                        i--;
                        estado = 0;
                        lexema = "";
                    }
                    break;
                case 2:
                    if (char.match("[0-9]")) {
                        estado = 2;
                        col++;
                        lexema += char;
                    }
                    else if (char == '.') {
                        estado = 3;
                        col++;
                        lexema += char;
                    }
                    else {
                        this.tokens.push(new Reconocido_1.default("Numero entero", fila, col, lexema));
                        i--;
                        estado = 0;
                        lexema = "";
                    }
                    break;
                case 3:
                    if (char.match("[0-9]")) {
                        estado = 4;
                        col++;
                        lexema += char;
                    }
                    else {
                        this.tokens.push(new Reconocido_1.default("Punto", fila, col, lexema[lexema.length]));
                        lexema = lexema.replace(".", "");
                        this.tokens.push(new Reconocido_1.default("Numero entero", fila, col, lexema));
                        i--;
                        estado = 0;
                        lexema = "";
                    }
                    break;
                case 4:
                    if (char.match("[0-9]")) {
                        estado = 4;
                        col++;
                        lexema += char;
                    }
                    else {
                        this.tokens.push(new Reconocido_1.default("Numero decimal", fila, col, lexema));
                        i--;
                        estado = 0;
                        lexema = "";
                    }
                    break;
                case 5:
                    if (char != "\"" && charAscii != 10) {
                        if (!EOF) {
                            estado = 5;
                            lexema += char;
                            if (charAscii != 13 && charAscii != 9 && charAscii != 32) {
                                col++;
                            }
                        }
                        else {
                            this.errores.push(new Reconocido_1.default("lexico", fila, col, "El expresion '" + lexema + "' no pertenece al lenguaje"));
                            col++;
                            this.tokens.push(new Reconocido_1.default("ultimo", fila, col, "#"));
                        }
                    }
                    else {
                        if (char == "\"") {
                            lexema += char;
                            col++;
                            this.tokens.push(new Reconocido_1.default("Cadena comillas dobles", fila, col, lexema));
                        }
                        else {
                            this.errores.push(new Reconocido_1.default("lexico", fila, col, "La expresion '" + lexema + "' no pertenece al lenguaje"));
                            i--;
                        }
                        estado = 0;
                        lexema = "";
                    }
                    break;
                case 6:
                    if (char != "'" && charAscii != 10) {
                        if (!EOF) {
                            estado = 6;
                            lexema += char;
                            if (charAscii != 13 && charAscii != 9 && charAscii != 32) {
                                col++;
                            }
                        }
                        else {
                            this.errores.push(new Reconocido_1.default("lexico", fila, col, "El expresion '" + lexema + "' no pertenece al lenguaje"));
                            col++;
                            this.tokens.push(new Reconocido_1.default("ultimo", fila, col, "#"));
                        }
                    }
                    else {
                        if (char == "'") {
                            lexema += char;
                            col++;
                            this.tokens.push(new Reconocido_1.default("Cadena comillas simples", fila, col, lexema));
                        }
                        else {
                            this.errores.push(new Reconocido_1.default("lexico", fila, col, "La expresion '" + lexema + "' no pertenece al lenguaje"));
                            i--;
                        }
                        estado = 0;
                        lexema = "";
                    }
                    break;
                case 7:
                    if (char == "/") {
                        estado = 8;
                        col++;
                        lexema += char;
                    }
                    else if (char == "*") {
                        estado = 9;
                        col++;
                        lexema += char;
                    }
                    else {
                        this.tokens.push(new Reconocido_1.default("Signo Dividir", fila, col, lexema));
                        i--;
                        estado = 0;
                        lexema = "";
                    }
                    break;
                case 8:
                    if (charAscii != 10) {
                        if (!EOF) {
                            estado = 8;
                            lexema += char;
                            if (charAscii != 13 && charAscii != 9 && charAscii != 32) {
                                col++;
                            }
                        }
                        else {
                            this.tokens.push(new Reconocido_1.default("Comentario unilinea", fila, col, lexema));
                            col++;
                            this.tokens.push(new Reconocido_1.default("EOF", fila, col, "#"));
                        }
                    }
                    else {
                        this.tokens.push(new Reconocido_1.default("Comentario unilinea", fila, col, lexema));
                        col = 0;
                        fila++;
                        estado = 0;
                        lexema = "";
                    }
                    break;
                case 9:
                    if (char != '*') {
                        if (!EOF) {
                            estado = 9;
                            lexema += char;
                            if (charAscii != 13 && charAscii != 9 && charAscii != 32 && charAscii != 10) {
                                col++;
                            }
                            else if (charAscii == 10) {
                                col = 0;
                                fila++;
                            }
                        }
                        else {
                            this.errores.push(new Reconocido_1.default("lexico", fila, col, "El expresion '" + lexema + "' no pertenece al lenguaje"));
                            col++;
                            this.tokens.push(new Reconocido_1.default("EOF", fila, col, "#"));
                        }
                    }
                    else {
                        estado = 10;
                        col++;
                        lexema += char;
                    }
                    break;
                case 10:
                    if (char == '*') {
                        estado = 10;
                        col++;
                        lexema += char;
                    }
                    else if (char == '/') {
                        col++;
                        lexema += char;
                        this.tokens.push(new Reconocido_1.default("Comentario multilinea", fila, col, lexema));
                        estado = 0;
                        lexema = "";
                    }
                    else {
                        if (!EOF) {
                            estado = 9;
                            lexema += char;
                            if (charAscii != 13 && charAscii != 9 && charAscii != 32 && charAscii != 10) {
                                col++;
                            }
                            else if (charAscii == 10) {
                                col = 0;
                                fila++;
                            }
                        }
                        else {
                            this.errores.push(new Reconocido_1.default("lexico", fila, col, "El expresion '" + lexema + "' no pertenece al lenguaje"));
                            col++;
                            this.tokens.push(new Reconocido_1.default("EOF", fila, col, "#"));
                        }
                    }
                    break;
                case 11:
                    if (lexema == "&" && char == "&") {
                        col++;
                        lexema += char;
                        this.tokens.push(new Reconocido_1.default("And", fila, col, lexema));
                        estado = 0;
                        lexema = "";
                    }
                    else if (lexema == "|" && char == "|") {
                        col++;
                        lexema += char;
                        this.tokens.push(new Reconocido_1.default("OR", fila, col, lexema));
                        estado = 0;
                        lexema = "";
                    }
                    else if (lexema == ">" && char == "=") {
                        col++;
                        lexema += char;
                        this.tokens.push(new Reconocido_1.default("Mayor igual", fila, col, lexema));
                        estado = 0;
                        lexema = "";
                    }
                    else if (lexema == "<" && char == "=") {
                        col++;
                        lexema += char;
                        this.tokens.push(new Reconocido_1.default("Menor igual", fila, col, lexema));
                        estado = 0;
                        lexema = "";
                    }
                    else if (lexema == "=" && char == "=") {
                        col++;
                        lexema += char;
                        this.tokens.push(new Reconocido_1.default("Igual", fila, col, lexema));
                        estado = 0;
                        lexema = "";
                    }
                    else if (lexema == "!" && char == "=") {
                        col++;
                        lexema += char;
                        this.tokens.push(new Reconocido_1.default("DIferente", fila, col, lexema));
                        estado = 0;
                        lexema = "";
                    }
                    else if (lexema == "+" && char == "+") {
                        col++;
                        lexema += char;
                        this.tokens.push(new Reconocido_1.default("Incremento", fila, col, lexema));
                        estado = 0;
                        lexema = "";
                    }
                    else if (lexema == "-" && char == "-") {
                        col++;
                        lexema += char;
                        this.tokens.push(new Reconocido_1.default("Decremento", fila, col, lexema));
                        estado = 0;
                        lexema = "";
                    }
                    else {
                        this.tokens.push(new Reconocido_1.default("simbolo", fila, col, lexema));
                        i--;
                        estado = 0;
                        lexema = "";
                    }
                    break;
            }
        }
    };
    scannerPython.prototype.getErrores = function () {
        return this.errores;
    };
    scannerPython.prototype.getTokes = function () {
        return this.tokens;
    };
    return scannerPython;
}());
exports.default = scannerPython;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2Nhbm5lclB5dGhvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2FuYWxpemFkb3Jlc1B5dGhvbi9TY2FubmVyUHl0aG9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQXFDO0FBRXJDO0lBTUk7UUFFSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBRSxrQkFBa0IsR0FBRztZQUV2QixRQUFRO1lBQ1IsT0FBTztZQUNQLFdBQVc7WUFDWCxNQUFNO1lBQ04sS0FBSztZQUNMLFNBQVM7WUFDVCxNQUFNO1lBQ04sT0FBTztZQUNQLFFBQVE7WUFDUixRQUFRO1lBQ1IsTUFBTTtZQUNOLEtBQUs7WUFDTCxJQUFJO1lBQ0osT0FBTztZQUNQLElBQUk7WUFDSixNQUFNO1lBQ04sT0FBTztZQUNQLFVBQVU7WUFDVixRQUFRO1NBRVgsQ0FBQztJQUNOLENBQUM7SUFFTyw4Q0FBc0IsR0FBOUIsVUFBK0IsTUFBZTtRQUUxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFDdkQ7WUFDSSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQ3hDO2dCQUNJLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxnQ0FBUSxHQUFSLFVBQVMsT0FBZ0I7UUFFckIsT0FBTyxJQUFJLEdBQUcsQ0FBQTtRQUVkLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNiLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksTUFBTSxHQUFHLEVB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