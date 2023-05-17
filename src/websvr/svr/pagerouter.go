package svr

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/database"
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

	router.GET("/updatePageInsStatus", UpdatePageInsStatusInfo)

	router.GET("/renderCase", RenderCasePage)
}
func InitTemplate(router *gin.Engine) {
	router.LoadHTMLGlob("webdyndata/templates/**/*")
}
func IndexPage(g *gin.Context) {
	ns := "website"
	// g.String(http.StatusOK, fmt.Sprintf("It is a new web page here."))
	// viewsTotalStr := strconv.Itoa(database.GetHomePageViewCount() + 1)
	// defer func() {
	// 	// db_start := time.Now()
	// 	database.UpdateHomePageViewCountPlusOne()
	// 	// db_elapsed := time.Since(db_start)
	// 	// fmt.Println("req IndexPage info ...database.GetHomePageViewCount() : ", database.GetHomePageViewCount())
	// 	// fmt.Println("db_elapsed: ", db_elapsed)
	// 	// fmt.Println("req IndexPage() defer func call end...")
	// }()
	viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	allViewsTotStr := strconv.Itoa(database.GetPageViewsTotal())
	defer func() {
		database.IncreasePageViewCountByName(ns)
	}()

	fmt.Println("req HomePage info ...viewsTotalStr: ", viewsTotalStr)
	g.HTML(http.StatusOK, "home/index.tmpl", gin.H{
		"title":         "Rendering & Art",
		"viewsTotal":    viewsTotalStr,
		"allViewsTotal": allViewsTotStr,
	})
}
func EnginePage(g *gin.Context) {
	ns := "website-engine"
	viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	defer func() {
		database.IncreasePageViewCountByName(ns)
	}()
	fmt.Println("req EnginePage info ...viewsTotalStr: ", viewsTotalStr)
	g.HTML(http.StatusOK, "engine/index.tmpl", gin.H{
		"title":      "vox 3d engine",
		"viewsTotal": viewsTotalStr,
	})
}
func ToolPage(g *gin.Context) {
	ns := "website-tool"
	viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	defer func() {
		database.IncreasePageViewCountByName(ns)
	}()
	g.HTML(http.StatusOK, "tools/index.tmpl", gin.H{
		"title":      "vox tools",
		"viewsTotal": viewsTotalStr,
	})
}
func GamePage(g *gin.Context) {
	ns := "website-game"
	viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	defer func() {
		database.IncreasePageViewCountByName(ns)
	}()
	g.HTML(http.StatusOK, "games/index.tmpl", gin.H{
		"title":      "vox games",
		"viewsTotal": viewsTotalStr,
	})
}
func CoursePage(g *gin.Context) {
	ns := "website-course"
	viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	defer func() {
		database.IncreasePageViewCountByName(ns)
	}()
	g.HTML(http.StatusOK, "courses/index.tmpl", gin.H{
		"title":      "vox games",
		"viewsTotal": viewsTotalStr,
	})
}
func RenderCasePage(g *gin.Context) {
	ns := "website-renderCase"

	sample := g.DefaultQuery("sample", "demoLoader")
	demo := g.DefaultQuery("demo", "non-demo")
	demoName := "demo-ins-" + demo
	// fmt.Println("RenderCasePage(), demoName: ", demoName)
	viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	insViewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(demoName) + 1)

	defer func() {
		database.IncreasePageViewCountByName(ns, 0)
		database.IncreasePageViewCountByName(demoName)
	}()

	g.HTML(http.StatusOK, "renderCases/index.tmpl", gin.H{
		"title":         "Rendering & Art",
		"sample":        sample,
		"viewsTotal":    viewsTotalStr,
		"insViewsTotal": insViewsTotalStr,
	})
}
func UpdatePageInsStatusInfo(g *gin.Context) {
	database.UpdatePageInsStatusInfo()
	viewsTotStr := strconv.Itoa(database.GetPageViewsTotal())
	g.String(http.StatusOK, fmt.Sprintf("update some info,tks. views total: "+viewsTotStr+"."))
}

// func GetWebSiteStatus(g *gin.Context) {
// 	// database.UpdatePageInsStatusInfo()
// 	g.String(http.StatusOK, fmt.Sprintf("update some info,tks."))
// }
