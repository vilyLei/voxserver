package svr

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/client"
)

// go mod init voxwebsvr.com/svr

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

var fsRootDir = "."

func handleRequest(w http.ResponseWriter, r *http.Request) {

	if testCORS(&w, r) {

		pathStr := fsRootDir + r.URL.Path
		flag := client.ReceiveRequest(&w, r, &pathStr)
		if !flag {
			defer updateErrorResStatus()
			w.WriteHeader(http.StatusOK)
			fmt.Fprintf(w, errorTemplate)
		}
	}
}
func useStaticFile(g *gin.Context) {
	handleRequest(g.Writer, g.Request)
}
func ApplyStaticFileService(router *gin.Engine, dirName string) {
	urlPattern := path.Join(dirName, "/*filepath")
	router.GET(urlPattern, useStaticFile)
}
