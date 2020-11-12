"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reconocido = /** @class */ (function () {
    function reconocido(tipo, fila, columna, valor) {
        this.tipo = "";
        this.fila = 0;
        this.columna = 0;
        this.valor = "";
        if (tipo.toLowerCase() == "simbolo") {
            this.tipo = this.getNombreSimbolo(valor);
        }
        else {
            this.tipo = tipo;
        }
        this.fila = fila;
        this.columna = columna;
        this.valor = valor;
    }
    reconocido.prototype.getNombreSimbolo = function (simbolo) {
        switch (simbolo) {
            case '{':
                return "Llave izquierda";
            case '}':
                return "Llave derecha";
            case '(':
                return "Parentesis izquierdo";
            case ')':
                return "Parentesis derecho";
            case '[':
                return "Corchete izquierdo";
            case ']':
                return "Corchete derecho";
            case '&':
                return "Signo amperson";
            case '|':
                return "Barra vertical";
            case '!':
                return "Signo negacion";
            case '^':
                return "Signo XOR";
            case '=':
                return "Signo asignar";
            case '>':
                return "Signo mayor";
            case '<':
                return "Signo menor";
            case '+':
                return "Signo mas";
            case '-':
                return "Signo menos";
            case '*':
                return "Signo por";
            case ',':
                return "Coma";
            case '.':
                return "Ṕunto";
            case ';':
                return "Punto y Coma";
            default:
                return "Desconocido";
        }
    };
    return reconocido;
}());
exports.default = reconocido;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVjb25vY2lkby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2FuYWxpemFkb3Jlc1B5dGhvbi9SZWNvbm9jaWRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0E7SUFPSSxvQkFBYSxJQUFXLEVBQUUsSUFBVyxFQUFFLE9BQWMsRUFBRSxLQUFhO1FBTHBFLFNBQUksR0FBWSxFQUFFLENBQUE7UUFDbEIsU0FBSSxHQUFXLENBQUMsQ0FBQztRQUNqQixZQUFPLEdBQVksQ0FBQyxDQUFDO1FBQ3JCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFJZixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBRyxTQUFTLEVBQ2xDO1lBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUM7YUFFRDtZQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1NBQ25CO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFFdkIsQ0FBQztJQUVPLHFDQUFnQixHQUF4QixVQUF5QixPQUFnQjtRQUdyQyxRQUFRLE9BQU8sRUFDZjtZQUVJLEtBQUssR0FBRztnQkFFSixPQUFPLGlCQUFpQixDQUFBO1lBRTVCLEtBQUssR0FBRztnQkFFSixPQUFPLGVBQWUsQ0FBQTtZQUUxQixLQUFLLEdBQUc7Z0JBRUosT0FBTyxzQkFBc0IsQ0FBQTtZQUVqQyxLQUFLLEdBQUc7Z0JBRUosT0FBTyxvQkFBb0IsQ0FBQTtZQUUvQixLQUFLLEdBQUc7Z0JBRUosT0FBTyxvQkFBb0IsQ0FBQTtZQUUvQixLQUFLLEdBQUc7Z0JBRUosT0FBTyxrQkFBa0IsQ0FBQTtZQUU3QixLQUFLLEdBQUc7Z0JBRUosT0FBTyxnQkFBZ0IsQ0FBQTtZQUUzQixLQUFLLEdBQUc7Z0JBRUosT0FBTyxnQkFBZ0IsQ0FBQztZQUU1QixLQUFLLEdBQUc7Z0JBRUosT0FBTyxnQkFBZ0IsQ0FBQztZQUU1QixLQUFLLEdBQUc7Z0JBRUosT0FBTyxXQUFXLENBQUM7WUFFdkIsS0FBSyxHQUFHO2dCQUVKLE9BQU8sZUFBZSxDQUFDO1lBRTNCLEtBQUssR0FBRztnQkFFSixPQUFPLGFBQWEsQ0FBQztZQUV6QixLQUFLLEdBQUc7Z0JBRUosT0FBTyxhQUFhLENBQUM7WUFFekIsS0FBSyxHQUFHO2dCQUVKLE9BQU8sV0FBVyxDQUFDO1lBRXZCLEtBQUssR0FBRztnQkFFSixPQUFPLGFBQWEsQ0FBQztZQUV6QixLQUFLLEdBQUc7Z0JBRUosT0FBTyxXQUFXLENBQUM7WUFFdkIsS0FBSyxHQUFHO2dCQUVKLE9BQU8sTUFBTSxDQUFDO1lBRWxCLEtBQUssR0FBRztnQkFFSixPQUFPLE9BQU8sQ0FBQztZQUVuQixLQUFLLEdBQUc7Z0JBRUosT0FBTyxjQUFjLENBQUM7WUFFMUI7Z0JBRUksT0FBTyxhQUFhLENBQUE7U0FFM0I7SUFFTCxDQUFDO0lBRUwsaUJBQUM7QUFBRCxDQUFDLEFBbEhELElBa0hDIn0=