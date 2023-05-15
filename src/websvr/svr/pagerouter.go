package svr

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// go mod init voxwebsvr.com/svr

func InitPages(router *gin.Engine) {
	InitTemplate(router)
	router.GET("/", IndexPage)
}
func InitTemplate(router *gin.Engine) {
	router.LoadHTMLGlob("webdyndata/templates/**/*")
}
func IndexPage(g *gin.Context) {
	// g.String(http.StatusOK, fmt.Sprintf("It is a new web page here."))
	fmt.Println("req IndexPage info ...")
	g.HTML(http.StatusOK, "home/index.tmpl", gin.H{
		"title": "Rendering & Art",
	})
}
