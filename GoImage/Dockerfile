FROM golang
RUN apt-get update
RUN apt-get install graphviz -y
WORKDIR /App
CMD ["go", "run", "app.go"]