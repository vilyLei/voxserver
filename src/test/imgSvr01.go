package main

import (
	// "os"
	// "path"
    "strings"
    "fmt"
    "io/ioutil"
    //"log"
    "net/http"
)
// thanks: https://zetcode.com/golang/http-serve-image/
func main() {

    handler := http.HandlerFunc(handleRequest)

    http.Handle("/static/", handler)

    fmt.Println("Server started at port 9090")
    http.ListenAndServe(":9090", nil)
}
func setupCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}
var errorTemplate string = `<!DOCTYPE html>
<html lang="en"><head></head>
<body><p align="center">Error: illegal request !!!</p></body>`
func handleRequest(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w);
	// ePath, err := os.Executable()
	// if err != nil {
	// 	panic(err)
	// }
	// // all path
	// fmt.Println(ePath)
	// // curr path
	// fmt.Println("file directory", path.Dir(ePath))

	r.ParseForm() //解析参数，默认是不会解析的
    fmt.Println(r.Form) //这些信息是输出到服务器端的打印信息
    fmt.Println("path", r.URL.Path)
    fmt.Println("scheme", r.URL.Scheme)
    fmt.Println(r.Form["url_long"])
    for k, v := range r.Form {
        fmt.Println("key:", k)
        fmt.Println("val:", strings.Join(v, ""))
    }

    // buf, err := ioutil.ReadFile("./static/letterA.png")
    // buf, err := ioutil.ReadFile("./static/box.jpg")
    // buf, err := ioutil.ReadFile("./static/info.txt")
    // buf, err := ioutil.ReadFile("/static/th1.js")
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
		w.Header().Set("Content-Type", "text/html")
		w.Header().Set("Content-Type", "application/javascript")
		w.Header().Set("Content-Type", "application/json")
		// w.Header().Set("Content-Type", "application/octet-stream")
		w.Write(buf)
	}
}