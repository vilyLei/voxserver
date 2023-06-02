package svr

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/database"
)

// go mod init voxwebsvr.com/svr

func InitPages(router *gin.Engine) {

	initFS()

	InitTemplate(router)

	router.NoRoute(NoRoute)

	router.GET("/", IndexPage)

	router.GET("/engine", EnginePage)

	router.GET("/tool", ToolPage)

	router.GET("/game", GamePage)

	router.GET("/course", CoursePage)

	router.GET("/renderCase", RenderCasePage)

	router.GET("/updatePageInsStatus", UpdatePageInsStatusInfo)

	router.GET("/renderingTask", RenderingTask)

	router.GET("/errorRes", ErrorRes)

	router.GET("/getPageStatus", GetPageStatusInfoJson)
}

var nonLetterAndNumber = regexp.MustCompile(`[^a-zA-Z0-9 ]+`)

func getFirstKeyStr(str string) string {
	keyWords := strings.Fields(str)
	if len(keyWords) > 0 && len(keyWords[0]) > 0 {
		keyWord := strings.ToLower(keyWords[0])
		keyWord = nonLetterAndNumber.ReplaceAllString(keyWord, "")
		return keyWord
	}
	return ""
}

// 404 error
func NoRoute(g *gin.Context) {
	r := g.Request
	url := r.URL.Path
	fmt.Println("NoRoute(), Warn: 404 page not found here, url: ", url)
	keyStr := getFirstKeyStr(url)
	// fmt.Println("NoRoute(), keyStr: ", keyStr)
	switch keyStr {
	case "engine", "engines":
		EnginePage(g)
	case "tool", "tools":
		ToolPage(g)
	case "course", "courses":
		CoursePage(g)
	case "game", "games":
		GamePage(g)
	default:
		// IndexPage(g)
		CanNotFindContent(g)
	}
	// g.String(http.StatusOK, fmt.Sprintf("404 page not found here."))
}
func InitTemplate(router *gin.Engine) {
	router.LoadHTMLGlob("webdyndata/templates/**/*")
}
func IndexPage(g *gin.Context) {
	host := g.Request.Host
	fmt.Println("req HomePage info ...host: ", host)
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
	viewsTotalStr := getPageViewCountStrByName(ns)
	allViewsTotStr := strconv.Itoa(database.GetPageViewsTotal() + 1)
	defer func() {
		increasePageViewCountByName(ns)
	}()

	// fmt.Println("req HomePage info ...viewsTotalStr: ", viewsTotalStr)
	g.HTML(http.StatusOK, "home/index.tmpl", gin.H{
		"title":         "Rendering & Art",
		"viewsTotal":    viewsTotalStr,
		"allViewsTotal": allViewsTotStr,
	})
}
func EnginePage(g *gin.Context) {
	ns := "website-engine"
	// viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	viewsTotalStr := getPageViewCountStrByName(ns)
	defer func() {
		increasePageViewCountByName(ns)
	}()
	fmt.Println("req EnginePage info ...viewsTotalStr: ", viewsTotalStr)
	g.HTML(http.StatusOK, "engine/index.tmpl", gin.H{
		"title":      "vox 3d engine",
		"viewsTotal": viewsTotalStr,
	})
}
func ToolPage(g *gin.Context) {
	ns := "website-tool"
	// viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	viewsTotalStr := getPageViewCountStrByName(ns)
	defer func() {
		increasePageViewCountByName(ns)
	}()
	g.HTML(http.StatusOK, "tools/index.tmpl", gin.H{
		"title":      "vox tools",
		"viewsTotal": viewsTotalStr,
	})
}
func GamePage(g *gin.Context) {
	ns := "website-game"
	// viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	viewsTotalStr := getPageViewCountStrByName(ns)
	defer func() {
		increasePageViewCountByName(ns)
	}()
	g.HTML(http.StatusOK, "games/index.tmpl", gin.H{
		"title":      "vox games",
		"viewsTotal": viewsTotalStr,
	})
}
func CoursePage(g *gin.Context) {
	ns := "website-course"
	// viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	viewsTotalStr := getPageViewCountStrByName(ns)
	defer func() {
		increasePageViewCountByName(ns)
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
	viewsTotalStr := getPageViewCountStrByName(ns)
	insViewsTotalStr := getPageViewCountStrByName(demoName)

	defer func() {
		increasePageViewCountByName(ns, 0)
		increasePageViewCountByName(demoName)
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

func GetPageStatusInfoJson(g *gin.Context) {
	// infoJson := database.GetPageStJsonFromDB()
	// g.String(http.StatusOK, fmt.Sprintf(infoJson))
	infoObj := database.GetPageStObjFromDB()
	// g.JSON(http.StatusOK, gin.H{"message": "hello world"})
	g.JSON(http.StatusOK, infoObj)
}

func RenderingTask(g *gin.Context) {
	infoStr := `{
		"tasks":[
			{
				"name":"modelTask01",
				"resUrl":"http://www.artvily.com/static/assets/obj/base.obj"
			},
			{
				"name":"modelTask02",
				"resUrl":"http://www.artvily.com/static/assets/obj/apple_01.obj"
			}
		]
	}`
	g.String(http.StatusOK, fmt.Sprintf(infoStr))
}
func updateErrorResStatus() {
	ns := "websit-errorres"
	defer func() {
		increasePageViewCountByName(ns)
	}()
}
func ErrorRes(g *gin.Context) {
	// fmt.Println("ErrorRes call .")
	updateErrorResStatus()
	infoStr := `{
		"status":0
	}`
	g.String(http.StatusOK, fmt.Sprintf(infoStr))
}
func CanNotFindContent(g *gin.Context) {
	ns := "websit-contentnotfind"
	// viewsTotalStr := getPageViewCountStrByName(ns)
	defer func() {
		increasePageViewCountByName(ns)
	}()
	w := g.Writer
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, errorTemplate)
}

func increasePageViewCountByName(pns string, flags ...int) {
	database.AppendSTDBData(pns, flags...)
}

func getPageViewCountStrByName(ns string) string {
	return strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
}
