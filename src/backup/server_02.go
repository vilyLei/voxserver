package main

import (
	"os"
    "strings"
    "fmt"
	"compress/gzip"
	"io"
    "io/ioutil"
    "path/filepath"
    "net/http"
    "bytes"
)
// go build -o .\bin\ .\src\server\server.go

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

	/*
	f, err := os.Create("as.jpg")
	if err != nil {
		panic(err)
	}
	defer func() { _ = f.Close() }()

	_, err = io.Copy(f, r.Body)
	if err != nil {
		panic(err)
	}
	*/

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

    fmt.Println("gzipResponse(), begin...")
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
    fmt.Println("gzipResponse(), end...")
}
/*
func Cors() gin.HandlerFunc {
   return func(c *gin.Context) {
      method := c.Request.Method
      origin := c.Request.Header.Get("Origin") //请求头部
      if origin != "" {
         // 当Access-Control-Allow-Credentials为true时，将*替换为指定的域名
         c.Header("Access-Control-Allow-Origin", "http://a.com") 
         c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
         c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Extra-Header, Content-Type, Accept, Authorization")
         c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Cache-Control, Content-Language, Content-Type")
         c.Header("Access-Control-Allow-Credentials", "true")
         c.Header("Access-Control-Max-Age", "86400") // 可选
         c.Set("content-type", "application/json") // 可选
      }

      if method == "OPTIONS" {
         c.AbortWithStatus(http.StatusNoContent)
      }

      c.Next()
   }
}


func main() {
  r := gin.Default()
  r.Use(Cors()) //开启中间件 允许使用跨域请求
  // 其他路由设置
  r.run()
}
*/
/*
func (cors *Cors) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    if origin := r.Header.Get("Origin"); origin == "" {
        cors.corsNotValid(w, r)
        return
    } else if r.Method != "OPTIONS" {
        //actual request.
        cors.actualRequest(w, r)
        return
    } else if acrm := r.Header.Get("Access-Control-Request-Method"); acrm == "" {
        //actual request.
        cors.actualRequest(w, r)
        return
    } else {
        //preflight request.
        cors.preflightRequest(w, r)
        return
    }
}
//*/
func respApplyCORS(w *http.ResponseWriter) {
    fmt.Println("respApplyCORS(), begin...")
	header := (*w).Header();
	header.Set("Access-Control-Allow-Credentials", "false")
	header.Set("Access-Control-Max-Age", "1024")//表示100秒内有效
	// 
	header.Set("Access-Control-Allow-Origin", "*")
    header.Set("Vary", "Origin")
    header.Set("Vary", "Access-Control-Request-Method")
    header.Set("Vary", "Access-Control-Request-Headers")
	header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	header.Set("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Cache-Control, Content-Language, Content-Type")
	header.Set("Access-Control-Allow-Headers", "Range, Accept, Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Requested-With, token")
    fmt.Println("respApplyCORS(), end...")
}
var currHTTPHandle http.Handler;
func showReqInfo(r *http.Request) {
    fmt.Println("showReqInfo(), begin...")
	r.ParseForm()// parse some parameters, the default parsing process do not exec
    fmt.Println(r.Form) // print the client req info
    fmt.Println("path", r.URL.Path)
    fmt.Println("scheme", r.URL.Scheme)
	fmt.Println("        ## showReqInfo s1")
    fmt.Println(r.Form["url_long"])
    for k, v := range r.Form {
        fmt.Println("r.Form key:", k)
        fmt.Println("r.Form val:", strings.Join(v, ""))
    }
	fmt.Println("        ## showReqInfo s2")
	for k, v := range r.Header {
        fmt.Println("r.Header key:", k)
        fmt.Println("r.Header val:", strings.Join(v, ""))
    }
    fmt.Println("a client requested: ", r.URL.Path)
    fmt.Println("showReqInfo(), end...")
}
func handleRequest(w http.ResponseWriter, r *http.Request) {
	fmt.Println("########### receive a new req...")
	fmt.Println("########### ......")
	fmt.Println("########### ...")
	showReqInfo( r );
	
	respApplyCORS(&w);
	fmt.Println("        ## r.Method: ", r.Method)
	fmt.Println("        ## r.Header.get(range): ", r.Header.Get("range"))
	fmt.Println("        ## handleRequest s1")
	if r.Method == "OPTIONS" {
		fmt.Println("        ## handleRequest s1 0")
		//Content-Type: text/html; charset=utf-8
    	w.Header().Set("Content-Type", "text/html; charset=utf-8")
		// fmt.Fprintf(w, errorTemplate);
		// fmt.Fprintf(w, "*");
		fmt.Println("        ## handleRequest s1 1")
		// currHTTPHandle.ServeHTTP(w, r)
		// w.WriteHeader(http.StatusOK)
		w.WriteHeader(200)
		fmt.Println("        ## handleRequest s1 2")
		return;
	}
	fmt.Println("        ## handleRequest s2")


	pathStr := r.URL.Path
	// commonResponse(&w, &pathStr);
	gzipResponse(&w, &pathStr)

}
func main() {

	var portStr string = "9090";
	argsLen := len(os.Args)
	if argsLen > 1 {
		portStr = "" + os.Args[1];
		fmt.Println("init current port: ", portStr)
	}
    handler := http.HandlerFunc(handleRequest)
	currHTTPHandle = handler;
    http.Handle("/static/", handler)

    fmt.Println("Server started at port: ", portStr)
    err := http.ListenAndServe(":"+portStr, nil)
	if err != nil {
		
		fmt.Println("Server start up unsuccessfully, the " + portStr+ " port is illegal.")
	}
}