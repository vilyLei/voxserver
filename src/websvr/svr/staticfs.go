package svr

import (
	"path"

	"net/http"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/client"
)

// go mod init voxwebsvr.com/svr

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
		client.ReceiveRequest(&w, r, &pathStr)
	}
}
func useStaticFile(g *gin.Context) {
	handleRequest(g.Writer, g.Request)
}
func ApplyStaticFileService(router *gin.Engine, dirName string) {
	urlPattern := path.Join(dirName, "/*filepath")
	router.GET(urlPattern, useStaticFile)
}
