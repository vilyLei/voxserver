package main

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
    "time"
    "net/http"
    "bytes"
)
// go build -o .\ ..\src\server\server.go
// The gzip file stores a header giving metadata about the compressed file.
// That header is exposed as the fields of the Writer and Reader structs.
type Header struct {
	Comment string    // comment
	Extra   []byte    // "extra data"
	ModTime time.Time // modification time
	Name    string    // file name
	OS      byte      // operating system type
}
// thanks: https://zetcode.com/golang/http-serve-image/
// gzipped: https://www.cnblogs.com/chaselogs/p/9964487.html

func main() {

    handler := http.HandlerFunc(handleRequest)

    http.Handle("/static/", handler)

    fmt.Println("Server started at port 9090")
    http.ListenAndServe(":9090", nil)
}
func setupCORS(w *http.ResponseWriter) {
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
		// header.Set("Content-Type", "image/png")
		// header.Set("Content-Type", "image/jpeg")
		// header.Set("Content-Type", "image/gif")
		// header.Set("Content-Type", "text/html")
		// header.Set("Content-Type", "application/javascript")
		// header.Set("Content-Type", "application/json")
		// w.Header().Set("Content-Type", "application/octet-stream")
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
		/*
		header.Set("Content-Type", "image/png")
		header.Set("Content-Type", "image/jpeg")
		header.Set("Content-Type", "image/gif")
		// header.Set("Content-Type", "text/html")
		header.Set("Content-Type", "application/javascript")
		//*/
		// header.Set("Content-Type", "application/json")
		// header.Set("Content-Type", "application/x-gzip")
		// header.Set("Content-Type", "application/octet-stream")
		// header.Set("Accept-Encoding", "gzip,deflate")
		// header.Set("Accept-Encoding", "gzip")
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
	setupCORS(&w);

	r.ParseForm() //解析参数，默认是不会解析的
    fmt.Println(r.Form) //这些信息是输出到服务器端的打印信息
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
	/*
	// 一种正确的实现
	pathstr := r.URL.Path
    fmt.Println("pathstr", pathstr)
    buf, err := ioutil.ReadFile("."+pathstr)

    if err != nil {
        // log.Fatal(err)
		fmt.Println("Error: ", err)
		// fmt.Fprintf(w, "Error: illegal request !!!");
		fmt.Fprintf(w, errorTemplate);
    }else {
		w.Header().Set("Content-Type", "image/png")
		w.Header().Set("Content-Type", "image/jpeg")
		w.Header().Set("Content-Type", "image/gif")
		w.Header().Set("Content-Type", "text/html")
		w.Header().Set("Content-Type", "application/javascript")
		w.Header().Set("Content-Type", "application/json")
		// w.Header().Set("Content-Type", "application/octet-stream")
		w.Write(buf)
	}
	//*/
	/**
	pathstr := r.URL.Path
    fmt.Println("pathstr", pathstr)
    buf, err := ioutil.ReadFile("."+pathstr)
	if err != nil {
        // log.Fatal(err)
		fmt.Println("Error: ", err)
		// fmt.Fprintf(w, "Error: illegal request !!!");
		fmt.Fprintf(w, errorTemplate);
    }else {
		contentType := http.DetectContentType(buf);
		// fmt.Println("contentType: ", contentType)
		header := w.Header();
		header.Set("Content-Type", contentType)
		// header.Set("Content-Type", "application/json")
		// header.Set("Content-Type", "application/x-gzip")
		// header.Set("Content-Type", "application/octet-stream")
		// header.Set("Accept-Encoding", "gzip,deflate")
		// header.Set("Accept-Encoding", "gzip")
		header.Set("Content-encoding", "gzip")
		header.Set("Server", "golang")
		header.Set("Vary", "Accept-Encoding")
		var zBuf bytes.Buffer
		zw := gzip.NewWriter(&zBuf)
		if _, err = zw.Write(buf); err != nil {
		    fmt.Println("gzip is faild,err:", err)
		}
		zw.Close()
		w.Write(zBuf.Bytes())
	}
	//*/
}