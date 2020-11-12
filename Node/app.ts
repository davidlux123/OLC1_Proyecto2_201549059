import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import reconocido from './analizadoresPython/Reconocido';
import scannerPython from "./analizadoresPython/ScannerPython";
import ParserPython from "./analizadoresPython/ParserPython";

var app = express();
app.use(express.json());
app.use(cors());
app.set('port', process.env.NODEPORT||3000)
app.set('ip', process.env.NODEIP||"182.18.7.7")

app.post('/TraducirPython/', function(req: Request, res:Response)
{
    console.log("Trabajando en el analisis... \n");
    console.log("...: \n\n");

    let analizadorLexico = new scannerPython();
    analizadorLexico.scannear(req.body.CodigoJava.toString());

    let tokens : reconocido[] = analizadorLexico.getTokes();
    let errores : reconocido[] = analizadorLexico.getErrores();

    let analizadorSintactico = new ParserPython(tokens, errores);
    analizadorSintactico.traducir();

    let codigoPython : string = analizadorSintactico.codigoPyton;
    let erroresOut:string = analizadorSintactico.getErrores();
    
    let tablaTokensHTML:string = analizadorSintactico.getTablaTokesHTML();
    let tablaErroresHTML:string = analizadorSintactico.getTablaErroresHTML();

    let ASTree = "digraph D {\n\n" +analizadorSintactico.arbolGraphviz +"}"; 
    
    res.send(JSON.stringify({CodigoPyton: codigoPython, ErroresOut: erroresOut, TablaTokens: tablaTokensHTML, TablaErrores: tablaErroresHTML, AST: ASTree}));

    console.log("Se ah realizado el analisis completo .. :D\n\n");

    //let SP : string = "hiciste un peticion y esta es la saida a Python ... :) ";
    //let SJS : String = "hiciste un peticion esta es la salida de JavaScripts... :D";
    //res.send(JSON.stringify({SalidaPyton: SP , SalidaJS:SJS}));

});

app.listen(app.get('port'), app.get('ip'), async () => {
    console.log('API NODEJS en el Puerto: '+ app.get('port') + ', en la IP: ' + app.get('ip'));
});


