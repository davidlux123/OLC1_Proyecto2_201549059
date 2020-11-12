# **Manual técnico**

## **Introducción** 

El proyecto se realizó para el analisis lexcico y sintactico para la transpilacion del lenguaje Java a el de Python. Haciendo uso de una aplicación web.

El proyecto se realizo en ubuntu-linux 20.04 S.0. Y los lenguajes Utilizados fueron: Java script, type script, Golang y sintaxis de docker y docker-compose.

## **Despliegue de la aplicacion**

El despliege de la aplicacion de realizo por medio de dos contenedores de **Docker** en donde se crearon y levantaran los servidores, el frontend situado en un contenedor y el backend en otro contenedor.

para realizar el despligue de la aplicacion necesita realizar docker y docker-compose instalados.

1. **Construccion de imagenes de los revicios**

	```
	:~$ sudo docker build -t golang:v0 .
	:~$ sudo docker build -t node:v0 .
	```
2. **Levantar los contenedores como servicios:**

	Recordar que para que el servicio se levante posicionarse siempre en la misla ubicacion donde se encuentra el archivo docker-compose.yml

	```
	:~$ sudo docker-compose up -d
	```
3. **Para detener los servicios:**

	```
	:~$ sudo docker-compose down
	```
4.	**Dado que ejecutaremos el docker-compose como un deamon, no podremos 		observar el log que el contenedor provea, por lo tanto utilizaremos 	el siguiente comando para que logremos ver el log.**

	```
	:~$ sudo docker logs -f nodeserver
	:~$ sudo docker logs -f goserver
	```

# Carpeta: GoImage

-	## **Dockerfile**
	Este archivo construirá la imagen del contenedor del frontend que contendrá el servidor de Golang. ya que el tipo de archivo en el cual esta codificado el servidor es **go**, Ésta imagen tambien necesita la instalacion de liberería graphviz para poder construir el reporte del AST. 

# Carpeta: Go
	
Contiene los archivos del servidor del frontend.

- ## **layout:**
	Contiene los archivos que darán el formato visual y funcionamiento al index.html. Ésto, se hace con la finalidad de crear un directorio estático en el servidor del frontend de Golang los cuales son:

	+ ## **codemirror :** 
		Dará color al texto fuente que reconoce la sintaxis de Java.
	
	+ ## **css :**  
		Caperta que contiene los archivos .CSS que brindara estilo a los elementos del index.html. 

	+ ## **js :**

		* ### **index.js:** 
			Contiene los metodos del funcionamiento de la página index.html. También se encarga de recoger el código **Java** para enviarlo como petición de tipo POST  por medio de el endpoint /getInfo al servidor de Golang. 

		+ ### **jquery-1.7.2.min.js:** 
			Ejecutará la animación de la página index.html . 

- ## **app.go:** 
	En este archivo se levanta el servidor del frontend de Golang, recibe la petición POST que envía el index.js y contruye otra petición POST
	 por medio de el endpoint /TraducirPython/ que enviará al servidor de del backend de NodeJS para que realize el analisis y provea los resutlados los cuales serviran para generar los archivos de los reportes y la transílasion de la salida.

- ## **index.html:**
	página principal en la que el clinete interactúa para realizar la el analisis, transiplasion y reportes que genera la aplicación web. 

# Carpeta: NodeImage

-	## **Dockerfile**
	Este archivo construirá la imagen del contenedor del backend que contendrá el servidor de NodeJs. ya que el tipo de archivo en el cual esta codificado el servidor es **js**, Ésta imagen tambien necesita la instalacion de gestor de paquetes npm, expres y cors para la configuracion del servidor de NodeJs. 

# Carpeta: Node

Contiene los archivos de los servidores del backend.

- ## **analizadoresPython:** 
	En esta carpeta se encuentra los archivo que generar el analisis del para reconocer el codigo (Java):

	+ ### **ScannerPython.ts:**
		Este archivo se encarga de realizar el analisis lexico del lenguaje de Java, el cual recibe como entrada el codigo de Java y devuelve como salida la lista de tokens reconocidos asi como los que no pertencen al lenguaje.

	+ ### **ParserPython.ts:**
		Este archivo se encarga de realizar el analisis sintactico del lenguaje de Java, el cual recibe como entrada los tokens reconocidos por el analisia lexico y devuelve como salida la transpilacion del lenguaje de Java a Python y los errres en los que se ordenan los tokens reconocidos

	+ ### **Reconocido.ts:**
		En este archivo describe la clase en el cual se almacenaran los datos de los tokesn reconocidos

- ## **build:**
	En esta capeta se encuenta los archivos transpilados de TypeScript a JavaScript que seran los cuales seran los que daran funcionamento al backend, son los mismos archivos typescript de la carpeta Node, solo que codificados en JavaScript.

- ## **node_modules, packpage-lock.json**
	En esta capeta estan instaladas las dependecnias de las instalaciones de cors, experess y lo necesario para correr un archivo de Node.js

- ## **app.js**
	En este archvio configura y levanta el servidor de NodeJS, el cual recibe la peticion que envia el servidor de Golang que contiene le codigo de java obtenido de la pestaña actual para comenzar el analisis y transpilasion del lenguaje java

- ## **tsconfig.json**
	Este archivo se encuentra la configuracion de las herramientas de typescript