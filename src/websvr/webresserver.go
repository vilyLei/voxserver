package main

import (
	"io/ioutil"
	"os"
	"runtime"
	// "path"
	"fmt"
	//"log"
	"net/http"

	"voxwebsvr.com/client"
)

// nohup ./webresserver &
// export PATH=$PATH:/usr/local/go/bin
// go build -o .\ ..\src\websvr\webresserver.go
// go build -o ../../bin/ webresserver.go

// go build -o ../../bin/ webresserver.go

// nohup ./webresserver 9090 &

// go build ../src/websvr/webresserver.go
// go run ../src/websvr/webresserver.go

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

var errorTemplate string = `
<!DOCTYPE html>
<html lang="en"><head></head>
<body><p align="center">Error: illegal request !!!</p></body>
`

func readErrorHtmlFile(filePath string) (string, error) {
	file, err := os.OpenFile(filePath, os.O_RDONLY, os.ModeDevice)
	if err == nil {
		defer file.Close()
		content, _ := ioutil.ReadAll(file)
		return string(content), nil
	} else {
		fmt.Printf("readRenderingStatusJson() failed, err: %v\n", err)
	}
	return "", err
}
func initFS() {
	fcontent, err := readErrorHtmlFile("./webdyndata/common/html/canNotFindContent.html")
	if err == nil {
		fmt.Println("fcontent bytes: \n", len(fcontent))
		errorTemplate = fcontent
	} else {
		fmt.Printf("readErrorHtmlFile() failed, err: %v", err)
	}
}
func errorResReq() {
	url := "http://localhost:80/errorRes"
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("errorResReq() get url failed, err: %v\n", err)
	} else {
		defer resp.Body.Close()
	}
}
func handleRequest(w http.ResponseWriter, r *http.Request) {

	if testCORS(&w, r) {

		pathStr := svrRootPath + r.URL.Path

		flag := client.ReceiveRequest(&w, r, &pathStr)
		if !flag {
			go errorResReq()

			w.WriteHeader(http.StatusOK)
			fmt.Fprintf(w, errorTemplate)
		}
	}
}
func main() {

	// for i ,v := range os.Args {
	// 	fmt.Println(i, v)
	// }
	rootPath, err := os.Getwd()
	if err == nil {
		fmt.Println("rootPath: ", rootPath)
	}
	initFS()

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
