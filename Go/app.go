package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
)

type analisis struct {
	CodigoJava string
}

type respuesta struct {
	CodigoPyton  string
	ErroresOut   string
	TablaTokens  string
	TablaErrores string
	AST          string
}

type salida struct {
	CodigoPyton string
	ErroresOut  string
}

//=================METODO QUE SE GENERA DEL ENDPOINT '/getInfo' TIPO POST=================//
func getInfo(w http.ResponseWriter, r *http.Request) {

	//=================CONSTRUIMOS LA URL DE LA NODE API(SERVER)=================//
	nodeip, defip := os.LookupEnv("NODEIP")
	nodeport, defport := os.LookupEnv("NODEPORT")

	if !defip {
		nodeip = "182.18.7.7" //"localhost"
	}

	if !defport {
		nodeport = "3000"
	}

	var nodeURL = "http://" + nodeip + ":" + nodeport + "/TraducirPython/"

	//============RECIBIMOS LA PETICION POST QUE VIENE COMO PARAMETRO============//
	var decoder = json.NewDecoder(r.Body) //almacenamos el body de la peticion que contiene el json, en la variable decoder
	var a analisis                        // creamos una instamcia de nuestro struct
	err := decoder.Decode(&a)             //le cargamos el json a nuestro struct
	if err != nil {
		panic(err)
	}

	//========CONSTRUIMOS EL JSON(con marshall) Y CREAMOS LA PETICION POST PARA NODEJS=================//
	jsonStr, _ := json.Marshal(a)
	req, err := http.NewRequest("POST", nodeURL, bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}    //creamos un cliente el cual realizara la peticion
	resp, err := client.Do(req) // generamos la peticion con el cliente y lo que devuelve la peticion la almacenamos en resp
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close() // cerramos la peticion
	bodyBytes, _ := ioutil.ReadAll(resp.Body)

	//fmt.Println(string(bodyBytes))
	//fmt.Fprintf(w, string(bodyBytes))

	var R respuesta                   // creamos una instamcia de nuestro struct
	_ = json.Unmarshal(bodyBytes, &R) // con unmarshal le asignamos el json a nuestro struct

	generaArchivos("tablaTokens.html", R.TablaTokens)
	generaArchivos("tablaErrores.html", R.TablaErrores)
	generaArchivos("ast.dot", R.AST)

	stdout, _ := exec.Command("dot", "-Tsvg", "ast.dot", "-o", "AST.svg").Output()

	fmt.Println("......................" + string(stdout))

	jsSalida := salida{R.CodigoPyton, R.ErroresOut}

	jsSal, _ := json.Marshal(jsSalida)

	w.Write(jsSal)

}

func generaArchivos(path string, contenido string) {

	var _, err = os.Stat(path)

	if os.IsNotExist(err) {

		file, err := os.Create(path)
		if err != nil {
			fmt.Println("ERROR: Al crear el archivo" + path)
			panic(err)
		}
		defer file.Close()
		fmt.Println("File creado Successfully", path)
	}

	// Abre archivo usando permisos READ & WRITE
	file, err := os.OpenFile(path, os.O_RDWR, 0644)
	if err != nil {
		fmt.Println("ERROR: Al abrir el archivo" + path)
		panic(err)
	}
	defer file.Close()

	_, err = file.WriteString(contenido)
	if err != nil {
		fmt.Println("ERROR: Al escribir el archivo" + path)
		panic(err)
	}

	fmt.Println("Archivo" + path + " se escribio existosamente.")

}

//=================METODO QUE SE GENERA DEL ENDPOINT TIPO GET=================//
func mostrarTokens(w http.ResponseWriter, r *http.Request) {

	t := template.Must(template.ParseFiles("tablaTokens.html"))
	t.Execute(w, "")
}

//=================METODO QUE SE GENERA DEL ENDPOINT  TIPO GET=================//
func mostrarErrores(w http.ResponseWriter, r *http.Request) {

	t := template.Must(template.ParseFiles("tablaErrores.html"))
	t.Execute(w, "")
}

//=================METODO QUE SE GENERA DEL ENDPOINT TIPO GET=================//
func mostrarAST(w http.ResponseWriter, r *http.Request) {

	var _, err = os.Stat("AST.svg")

	if !os.IsNotExist(err) {
		svgBytes, _ := ioutil.ReadFile("AST.svg")
		w.Write(svgBytes)
	}

}

//=================METODO QUE SE GENERA DEL ENDPOINT '/' TIPO GET=================//
func index(w http.ResponseWriter, r *http.Request) {

	t := template.Must(template.ParseFiles("index.html"))
	t.Execute(w, "")
}

func main() {

	//====================CONSTRUIMOS LA URL DE LA GO API(SERVER) ====================//
	ip, defip := os.LookupEnv("GOIP")
	port, defport := os.LookupEnv("GOPORT")

	if !defip {
		ip = "182.18.7.9"
	}

	if !defport {
		port = "8000"
	}

	//======JALAMOS LOS DIRECTORIOS ESTATICOS, DONDE SE ALMACENAN NUESTRAS DEPENDECIAS=======//
	http.Handle("/layout/", http.StripPrefix("/layout/", http.FileServer(http.Dir("layout/"))))

	//====================CREAMOS LOS ENPOINTS DE DEL SERVIDOR DE GO====================//
	http.HandleFunc("/", index)
	http.HandleFunc("/getInfo", getInfo)
	http.HandleFunc("/getTokens", mostrarTokens)
	http.HandleFunc("/getErrores", mostrarErrores)
	http.HandleFunc("/getAST", mostrarAST)

	//====================SE LEVANTA EL SERVICIO DE GO ====================//
	fmt.Println("API GO en el Puerto:" + port + " en la IP:" + ip)
	http.ListenAndServe(":"+port, nil)

}
