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

	router.GET("/engine", EnginePage)
	router.GET("/Engine", EnginePage)
	router.GET("/ENGINE", EnginePage)

	router.GET("/tool", ToolPage)
	router.GET("/tools", ToolPage)
	router.GET("/Tool", ToolPage)
	router.GET("/Tools", ToolPage)

	router.GET("/game", GamePage)
	router.GET("/Game", GamePage)
	router.GET("/games", GamePage)
	router.GET("/Games", GamePage)

	router.GET("/course", CoursePage)
	router.GET("/Course", CoursePage)
	router.GET("/courses", CoursePage)
	router.GET("/Courses", CoursePage)
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
func EnginePage(g *gin.Context) {
	g.HTML(http.StatusOK, "engine/index.tmpl", gin.H{
		"title": "vox 3d engine",
	})
}
func ToolPage(g *gin.Context) {
	g.HTML(http.StatusOK, "tools/index.tmpl", gin.H{
		"title": "vox tools",
	})
}
func GamePage(g *gin.Context) {
	g.HTML(http.StatusOK, "games/index.tmpl", gin.H{
		"title": "vox games",
	})
}
func CoursePage(g *gin.Context) {
	g.HTML(http.StatusOK, "courses/index.tmpl", gin.H{
		"title": "vox games",
	})
}
