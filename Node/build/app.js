"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var ScannerPython_1 = __importDefault(require("./analizadoresPython/ScannerPython"));
var ParserPython_1 = __importDefault(require("./analizadoresPython/ParserPython"));
var app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
app.set('port', process.env.NODEPORT || 3000);
app.set('ip', process.env.NODEIP || "182.18.7.7");
app.post('/TraducirPython/', function (req, res) {
    console.log("Trabajando en el analisis... \n");
    console.log("...: \n\n");
    var analizadorLexico = new ScannerPython_1.default();
    analizadorLexico.scannear(req.body.CodigoJava.toString());
    var tokens = analizadorLexico.getTokes();
    var errores = analizadorLexico.getErrores();
    var analizadorSintactico = new ParserPython_1.default(tokens, errores);
    analizadorSintactico.traducir();
    var codigoPython = analizadorSintactico.codigoPyton;
    var erroresOut = analizadorSintactico.getErrores();
    var tablaTokensHTML = analizadorSintactico.getTablaTokesHTML();
    var tablaErroresHTML = analizadorSintactico.getTablaErroresHTML();
    var ASTree = "digraph D {\n\n" + analizadorSintactico.arbolGraphviz + "}";
    res.send(JSON.stringify({ CodigoPyton: codigoPython, ErroresOut: erroresOut, TablaTokens: tablaTokensHTML, TablaErrores: tablaErroresHTML, AST: ASTree }));
    console.log("Se ah realizado el analisis completo .. :D\n\n");
    //let SP : string = "hiciste un peticion y esta es la saida a Python ... :) ";
    //let SJS : String = "hiciste un peticion esta es la salida de JavaScripts... :D";
    //res.send(JSON.stringify({SalidaPyton: SP , SalidaJS:SJS}));
});
app.listen(app.get('port'), app.get('ip'), function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('API NODEJS en el Puerto: ' + app.get('port') + ', en la IP: ' + app.get('ip'));
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQThCO0FBRTlCLDhDQUF3QjtBQUV4QixxRkFBK0Q7QUFDL0QsbUZBQTZEO0FBRTdELElBQUksR0FBRyxHQUFHLGlCQUFPLEVBQUUsQ0FBQztBQUNwQixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLGNBQUksRUFBRSxDQUFDLENBQUM7QUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUUsSUFBSSxDQUFDLENBQUE7QUFDM0MsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUUsWUFBWSxDQUFDLENBQUE7QUFFL0MsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxVQUFTLEdBQVksRUFBRSxHQUFZO0lBRTVELE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztJQUMvQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRXpCLElBQUksZ0JBQWdCLEdBQUcsSUFBSSx1QkFBYSxFQUFFLENBQUM7SUFDM0MsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFFMUQsSUFBSSxNQUFNLEdBQWtCLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3hELElBQUksT0FBTyxHQUFrQixnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUUzRCxJQUFJLG9CQUFvQixHQUFHLElBQUksc0JBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0Qsb0JBQW9CLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFaEMsSUFBSSxZQUFZLEdBQVksb0JBQW9CLENBQUMsV0FBVyxDQUFDO0lBQzdELElBQUksVUFBVSxHQUFVLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRTFELElBQUksZUFBZSxHQUFVLG9CQUFvQixDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDdEUsSUFBSSxnQkFBZ0IsR0FBVSxvQkFBb0IsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBRXpFLElBQUksTUFBTSxHQUFHLGlCQUFpQixHQUFFLG9CQUFvQixDQUFDLGFBQWEsR0FBRSxHQUFHLENBQUM7SUFFeEUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUM7SUFFekosT0FBTyxDQUFDLEdBQUcsQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0lBRTlELDhFQUE4RTtJQUM5RSxrRkFBa0Y7SUFDbEYsNkRBQTZEO0FBRWpFLENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7O1FBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEdBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxjQUFjLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7S0FDOUYsQ0FBQyxDQUFDIn0=