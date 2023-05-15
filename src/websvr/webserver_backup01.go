package main

import (
	"os"
	"path"
	"runtime"

	// "path"

	"fmt"

	//"log"

	"net/http"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/client"
)

// strconv.Itoa
// nohup ./webserver &
// export PATH=$PATH:/usr/local/go/bin
// go build -o .\ ..\src\websvr\webserver.go
// go build -o ../../bin/ webserver.go
// go build ../src/websvr/webserver.go
// go run ../src/websvr/webserver.go
// go build -o ../../bin/ webserver.go

// go mod init voxwebsvr.com/main
// go mod edit -replace voxwebsvr.com/webfs=./webfs
// go mod edit -replace voxwebsvr.com/client=./client
// go mod tidy

func SetRWriterStatus(w *http.ResponseWriter, code int) {
	(*w).WriteHeader(code)
}
func testCORS(w *http.ResponseWriter, r *http.Request) bool {
	header := (*w).Header()
	header.Set("Access-Control-Allow-Origin", "*")
	// header.Set("Access-Control-Allow-Credentials", "true")
	//header.Set("Access-Control-Allow-Headers", "Range, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	header.Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT")
	if r.Method == "OPTIONS" {
		(*w).WriteHeader(http.StatusNoContent)
		return false
	}
	return true
}

var svrRootPath = "."

func handleRequest(w http.ResponseWriter, r *http.Request) {

	if testCORS(&w, r) {

		pathStr := svrRootPath + r.URL.Path
		fmt.Println("handleRequest(),pathStr: ", pathStr)
		client.ReceiveRequest(&w, r, &pathStr)
	}
}
func main2() {

	// for i ,v := range os.Args {
	// 	fmt.Println(i, v)
	// }
	rootPath, err := os.Getwd()
	if err == nil {
		//svrRootPath = rootPath
		fmt.Println("rootPath: ", rootPath)
	}
	var portStr string = "9090"
	argsLen := len(os.Args)
	// fmt.Println("argsLen: ", argsLen)
	if argsLen > 1 {
		portStr = "" + os.Args[1]
		fmt.Println("init current port: ", portStr)
	}
	handler := http.HandlerFunc(handleRequest)

	http.Handle("/static/", handler)

	fmt.Println("cpus number: ", runtime.NumCPU())
	fmt.Println("Web Server version 1.0.12")
	fmt.Println("Web Server started at port: ", portStr)
	http.ListenAndServe(":"+portStr, nil)
}

func IndexPage(g *gin.Context) {
	g.String(http.StatusOK, fmt.Sprintf("It is a web page here."))
}
func UseStaticFile(g *gin.Context) {
	// g.String(http.StatusOK, fmt.Sprintf("It is a web page here."))
	fmt.Println("UseStaticFile(), ###")
	handleRequest(g.Writer, g.Request)
}

// func (router *gin.Engine) ApplyStaticFileService(dirName string) {
func ApplyStaticFileService(router *gin.Engine, dirName string) {
	urlPattern := path.Join(dirName, "/*filepath")
	router.GET(urlPattern, UseStaticFile)
}
func main() {

	// for i ,v := range os.Args {
	// 	fmt.Println(i, v)
	// }
	rootPath, err := os.Getwd()
	if err == nil {
		//svrRootPath = rootPath
		fmt.Println("rootPath: ", rootPath)
	}
	var portStr string = "9090"

	argsLen := len(os.Args)
	fmt.Println("apply gin argsLen: ", argsLen)
	if argsLen > 1 {
		portStr = "" + os.Args[1]
		fmt.Println("init current port: ", portStr)
	}

	// fmt.Println("cpus number: ", runtime.NumCPU())
	// fmt.Println("Web Server version 1.0.12")
	// fmt.Println("Web Server started at port: ", portStr)
	// http.ListenAndServe(":"+portStr, nil)

	router := gin.Default()
	router.GET("/", IndexPage)
	ApplyStaticFileService(router, "./static")
	// urlPattern := path.Join("./static", "/*filepath")
	// router.GET(urlPattern, UseStaticFile)

	// thanks: https://gin-gonic.com/docs/examples/serving-static-files/
	// router.Static("/static", "./static")
	// router.Use(gzip.Gzip(gzip.DefaultCompression, gzip.WithExcludedExtensions([]string{".pdf", ".mp4", ".jpg", ".jpeg", ".png", ".draco", ".drc"})))
	// router.StaticFS("/more_static", http.Dir("common_file_system"))
	// router.StaticFile("/favicon.ico", "./resources/favicon.ico")

	// handler := http.HandlerFunc(handleRequest)
	// http.Handle("/static/", handler)

	router.Run(":9090")
}
