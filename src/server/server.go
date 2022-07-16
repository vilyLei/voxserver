package main
//git clone https://github.com/golang/tools.git $GOPATH/src/golang.org/x/tools
//git clone https://github.com/golang/tools.git $GOPATH/src/golang.org/x/tools
//go get -v github.com/ramya-rao-a/go-outline
//go get -v github.com/sqs/goreturns
//go get -v github.com/rogpeppe/godef
import (
	"os"
	// "path"
    "strings"
    "fmt"
	"compress/gzip"
	"io"
    "io/ioutil"
    //"log"
    "path/filepath"
    // "time"
    "net/http"
    "bytes"
)
// go build -o .\ ..\src\server\server.go
// go build -o ./bin ./src/server/server.go

func respApplyCORS(w *http.ResponseWriter) {
	header := (*w).Header();
	header.Set("Access-Control-Allow-Origin", "*")
	header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	header.Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
var errorTemplate string = `
<!DOCTYPE html>
<html lang="en"><head></head>
<body><p align="center">Error: illegal request !!!</p></body>
`
func gzipit(source, target string) error {
	reader, err := os.Open(source)
	if err != nil {
		return err
	}

	filename := filepath.Base(source)
	target = filepath.Join(target, fmt.Sprintf("%s.gz", filename))
	writer, err := os.Create(target)
	if err != nil {
		return err
	}
	defer writer.Close()

	archiver := gzip.NewWriter(writer)
	archiver.Name = filename
	defer archiver.Close()

	_, err = io.Copy(archiver, reader)
	return err
}
func commonResponse(w *http.ResponseWriter, pathStr *string) {

	wr := (*w)
    fmt.Println("pathStr", *pathStr)
    buf, err := ioutil.ReadFile("."+(*pathStr))

	if err != nil {
		// log.Fatal(err)
		fmt.Println("Error: ", err)
		// fmt.Fprintf(w, "Error: illegal request !!!");
		fmt.Fprintf(wr, errorTemplate);
	}else {
		contentType := http.DetectContentType(buf);
		header := wr.Header();
		header.Set("Content-Type", contentType)
		wr.Write(buf)
	}
}
func gzipResponse(w *http.ResponseWriter, pathStr *string) {

	wr := (*w)
    fmt.Println("pathStr", *pathStr)
    buf, err := ioutil.ReadFile("."+(*pathStr))
	if err != nil {
        // log.Fatal(err)
		fmt.Println("Error: ", err)
		// fmt.Fprintf(w, "Error: illegal request !!!");
		fmt.Fprintf(wr, errorTemplate);
    }else {
		contentType := http.DetectContentType(buf);
		// fmt.Println("contentType: ", contentType)
		header := wr.Header();
		header.Set("Content-Type", contentType)

		// header.Set("Accept-Encoding", "gzip,deflate")
		header.Set("Content-encoding", "gzip")
		header.Set("Server", "golang")
		header.Set("Vary", "Accept-Encoding")
		var zBuf bytes.Buffer
		zw := gzip.NewWriter(&zBuf)
		if _, err = zw.Write(buf); err != nil {
		    fmt.Println("gzip is faild,err:", err)
		}
		zw.Close()
		wr.Write(zBuf.Bytes())
	}
}
func handleRequest(w http.ResponseWriter, r *http.Request) {

	if r.Method == "OPTIONS" {
		fmt.Fprintf(w, errorTemplate);
		return;
	}
	respApplyCORS(&w);

	r.ParseForm()// parse some parameters, the default parsing process do not exec
    fmt.Println(r.Form) // print the client req info
    fmt.Println("path", r.URL.Path)
    fmt.Println("scheme", r.URL.Scheme)
    fmt.Println(r.Form["url_long"])
    for k, v := range r.Form {
        fmt.Println("key:", k)
        fmt.Println("val:", strings.Join(v, ""))
    }
	pathStr := r.URL.Path
	// commonResponse(&w, &pathStr);
	gzipResponse(&w, &pathStr)
	
}
func main() {

	// for i ,v := range os.Args {
	// 	fmt.Println(i, v)
	// }
	var portStr string = "9090";
	argsLen := len(os.Args)
	// fmt.Println("argsLen: ", argsLen)
	if argsLen > 1 {
		portStr = "" + os.Args[1];
		fmt.Println("init current port: ", portStr)
	}
    handler := http.HandlerFunc(handleRequest)

    http.Handle("/static/", handler)

    fmt.Println("Server started at port: ", portStr)
    http.ListenAndServe(":"+portStr, nil)
}