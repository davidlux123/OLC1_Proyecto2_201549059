
export default class reconocido{

    tipo : string = ""
    fila: number = 0;
    columna : number = 0;
    valor: string = "";

    constructor (tipo:string, fila:number, columna:number, valor: string){

        if (tipo.toLowerCase()== "simbolo") 
        {
            this.tipo = this.getNombreSimbolo(valor);
        }
        else
        {
            this.tipo = tipo
        }

        this.fila = fila;
        this.columna = columna;
        this.valor = valor; 

    }
    
    private getNombreSimbolo(simbolo : string) : string 
    {

        switch (simbolo)
        {
            
            case '{':

                return "Llave izquierda"
                
            case '}':

                return "Llave derecha"

            case '(':
                
                return "Parentesis izquierdo"

            case ')':
                
                return "Parentesis derecho"

            case '[':
                
                return "Corchete izquierdo"

            case ']':
                
                return "Corchete derecho"

            case '&':
                
                return "Signo amperson"

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

                return "Desconocido"

        }

    }

}