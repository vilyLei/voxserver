package svr

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/database"
)

// go mod init voxwebsvr.com/svr
type STDBChannelData struct {
	stName string
	stType int
	flag   int
}

var stDBChannel chan STDBChannelData

func appendSTDBData(name string, flags ...int) {
	var st STDBChannelData
	st.stName = name
	st.stType = 1
	st.flag = 0
	fn := len(flags)
	if fn > 0 {
		st.stType = flags[0]
		if fn > 1 {
			st.flag = flags[1]
		}
	}
	stDBChannel <- st
}
func updateSTDataToDB(in <-chan STDBChannelData) {
	var total = 0
	var ls [128]STDBChannelData
	// var nsList [128]string
	nsList := make([]string, 128)
	for data := range in {
		len := len(in)
		// fmt.Printf("长度 len=%v cap=%v\n", len(in), cap(in))
		// fmt.Println("updateSTDataToDB() data.stName: ", data.stName, ", stType: ", data.stType)
		if data.flag < 1 {
			ls[total] = data
			total++
			// 先直接更新内存数据而不是数据库数据
			database.IncreaseLogicPageViewCountByName(data.stName, data.stType)
		}
		// if len == 0 || total > 31 {
		if data.flag > 0 || total > 15 {
			// fmt.Println("updateSTDataToDB() for total: ", total, len)
			// for i := 0; i < total; i++ {
			// 	// fmt.Println("updateSTDataToDB() for data.stName: ", ls[i].stName, ", stType: ", ls[i].stType)
			// 	database.IncreasePageViewCountByName(ls[i].stName, ls[i].stType)
			// }
			if total > 0 {
				// 整体一起修改数据库, 做合并操作，提升性能
				// if total > 1 {
				for i := 0; i < total; i++ {
					nsList[i] = ls[i].stName
					// fmt.Println("updateSTDataToDB() for ls[i].stName: ", ls[i].stName, ", stType: ", ls[i].stType)
					// database.IncreaseLogicPageViewCountByName(ls[i].stName, ls[i].stType)
				}
				database.IncreaseLogicPageViewCountToDBByNames(nsList, total)
				// } else {
				// 	database.IncreasePageViewCountByName(ls[0].stName, ls[0].stType)
				// }
			}
			total = len
			total = 0
		}
	}
}
func startupSTDataToDBTicker(out chan<- STDBChannelData) {

	for range time.Tick(15 * time.Second) {
		// fmt.Println("tick does...")
		var st STDBChannelData
		st.stName = "ticker_sender_data"
		st.stType = 0
		st.flag = 1
		out <- st
	}
}
func InitPages(router *gin.Engine) {
	InitTemplate(router)

	router.NoRoute(NoRoute)

	router.GET("/", IndexPage)

	router.GET("/engine", EnginePage)

	router.GET("/tool", ToolPage)

	router.GET("/game", GamePage)

	router.GET("/course", CoursePage)

	router.GET("/renderCase", RenderCasePage)

	router.GET("/updatePageInsStatus", UpdatePageInsStatusInfo)

	stDBChannel = make(chan STDBChannelData, 128)
	go updateSTDataToDB(stDBChannel)
	go startupSTDataToDBTicker(stDBChannel)
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
		IndexPage(g)
	}
	// g.String(http.StatusOK, fmt.Sprintf("404 page not found here."))
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
	// viewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
	// insViewsTotalStr := strconv.Itoa(database.GetPageViewCountByName(demoName) + 1)
	viewsTotalStr := getPageViewCountStrByName(ns)
	insViewsTotalStr := getPageViewCountStrByName(demoName)

	defer func() {
		// database.IncreasePageViewCountByName(ns, 0)
		// database.IncreasePageViewCountByName(demoName)

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

func increasePageViewCountByName(pns string, flags ...int) {
	// fmt.Println("increasePageViewCountByName(), pns: ", pns)
	appendSTDBData(pns, flags...)
	// database.IncreasePageViewCountByName(pns, flags...)
}

func getPageViewCountStrByName(ns string) string {
	return strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
}

// func GetWebSiteStatus(g *gin.Context) {
// 	// database.UpdatePageInsStatusInfo()
// 	g.String(http.StatusOK, fmt.Sprintf("update some info,tks."))
// }
