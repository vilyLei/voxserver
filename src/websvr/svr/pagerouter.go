package svr

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/database"
	"voxwebsvr.com/webfs"
)

type UploadReqDef struct {
	TaskID   int64  `json:"taskid,int64"`
	FilePath string `json:"filepath"`
	TaskName string `json:"taskname"`
	Success  bool   `json:"success,bool"`
	Status   int    `json:"status,int"`
	FileName string `json:"fileName"`
	UUID     string `json:"-"` //忽略输出
}

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
	router.POST("/uploadRTData", UploadRenderingTaskData)

	router.GET("/errorRes", ErrorRes)

	router.GET("/getPageStatus", GetPageStatusInfoJson)

	rtTaskNodeMap = make(map[int64]*RTaskInfoNode)
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
	fmt.Println("NoRoute(), keyStr: ", keyStr)
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
		switch url {
		case "/favicon.ico":
			ReqFavicon(g)
		default:
			keyStr = ""
		}
		// IndexPage(g)
		CanNotFindContent(g)
	}
	// g.String(http.StatusOK, fmt.Sprintf("404 page not found here."))
}
func InitTemplate(router *gin.Engine) {
	router.LoadHTMLGlob("webdyndata/templates/**/*")
}
func IndexPage(g *gin.Context) {
	// host := g.Request.Host
	// fmt.Println("req HomePage info ...host: ", host)
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

type RTaskInfoNode struct {
	Id       int64  `json:"id"`
	Name     string `json:"name"`
	ResUrl   string `json:"resUrl"`
	Phase    string
	Progress int
}

var rtTaskID int64 = 2001
var rtWaitTaskNodes []*RTaskInfoNode

// rendering task map
var rtTaskNodeMap map[int64]*RTaskInfoNode

func HasRTTaskNodeByID(id int64) bool {
	_, hasKey := rtTaskNodeMap[id]
	return hasKey
}
func GetRTTaskProgressByID(id int64) int {
	node, hasKey := rtTaskNodeMap[id]
	if hasKey {
		return node.Progress
	}
	return 0
}
func RenderingTask(g *gin.Context) {
	phase := g.DefaultQuery("phase", "none")
	progress := g.DefaultQuery("progress", "0")
	taskid := g.DefaultQuery("taskid", "0")
	taskname := g.DefaultQuery("taskname", "none")

	fmt.Println("RenderingTask, phase: ", phase, ", progress: ", progress, ", taskid: ", taskid, ", taskname: ", taskname)
	infoStr := `{"phase":"` + phase + `","status":22}`
	hasTaskFlag := false
	tid, errInt64 := strconv.ParseInt(taskid, 10, 64)
	if errInt64 == nil {
		hasTaskFlag = HasRTTaskNodeByID(tid)
	}

	switch phase {
	case "running":
		fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
		if hasTaskFlag {
			tnode := rtTaskNodeMap[tid]
			tnode.Phase = phase
			tnode.Progress, _ = strconv.Atoi(progress)
			fmt.Println("rTask tnode.Progress: ", tnode.Progress)
		}
		g.String(http.StatusOK, fmt.Sprintf(infoStr))
	case "finish":
		fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
		if hasTaskFlag {
			tnode := rtTaskNodeMap[tid]
			tnode.Phase = phase
			tnode.Progress, _ = strconv.Atoi(progress)
		}
		g.String(http.StatusOK, fmt.Sprintf(infoStr))
	case "rtaskerror":
		fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
		if hasTaskFlag {
			tnode := rtTaskNodeMap[tid]
			tnode.Phase = phase
		}
		g.String(http.StatusOK, fmt.Sprintf(infoStr))
	case "rtaskreadydata":
		if hasTaskFlag {
			rtNode := rtTaskNodeMap[tid]
			rtNode.Phase = "task_rendering_parse_data"
		}
		fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
		g.String(http.StatusOK, fmt.Sprintf(infoStr))
	case "reqanewrtask":
		fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
		total := len(rtWaitTaskNodes)
		if total > 0 {
			rtNode := rtWaitTaskNodes[0]
			rtNode.Phase = "task_rendering_enter"
			rtWaitTaskNodes = append(rtWaitTaskNodes[:0], rtWaitTaskNodes[1:]...)
			jsonBytes, err := json.Marshal(rtNode)
			if err != nil {
				fmt.Println("error:", err)
			}
			jsonStr := string(jsonBytes)
			fmt.Println("RenderingTask(), jsonStr: ", jsonStr)
			infoStr = `{"phase":"` + phase + `", "task":` + jsonStr + `,"status":22}`
		}
		g.String(http.StatusOK, fmt.Sprintf(infoStr))
	case "queryataskrst":
		fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
		if hasTaskFlag {
			tnode := rtTaskNodeMap[tid]
			infoStr = `{"phase":"` + tnode.Phase + `","progress":` + strconv.Itoa(tnode.Progress) + `,"taskid":` + taskid + `,"status":22}`
			g.String(http.StatusOK, fmt.Sprintf(infoStr))
		} else {
			infoStr = `{"phase":"undefined","status":0}`
			g.String(http.StatusOK, fmt.Sprintf(infoStr))
		}
	default:
		infoStr = `{
			"tasks":[
				{
					"id":1001,
					"name":"modelTask01",
					"resUrl":"http://www.artvily.com/static/assets/obj/base.obj"
				},
				{
					"id":1002,
					"name":"modelTask02",
					"resUrl":"http://www.artvily.com/static/assets/obj/apple_01.obj"
				}
			]
		}`
		g.String(http.StatusOK, fmt.Sprintf(infoStr))
	}
}

func UploadRenderingTaskData(g *gin.Context) {
	// infoStr := ``
	// g.String(http.StatusOK, fmt.Sprintf(infoStr))
	phase := g.DefaultQuery("phase", "none")
	taskid := g.DefaultQuery("taskid", "0")
	taskname := g.DefaultQuery("taskname", "none")

	fmt.Println("UploadRenderingTaskData, phase: ", phase, ", taskid: ", taskid, ", taskname: ", taskname)
	// single file uploading receive
	filename := "none"
	var status = 0
	file, _ := g.FormFile("file")
	filePath := ""
	if file != nil {

		status = 22
		filename = file.Filename
		switch phase {
		case "newrtask":
			taskid = strconv.FormatInt(rtTaskID, 10)
			taskname = "modelRTask" + taskid
			fileDir := "./static/rtUploadFiles/" + taskname + "/"

			var rtNode RTaskInfoNode
			rtNode.Id = rtTaskID
			rtNode.Name = taskname
			rtNode.ResUrl = fileDir + filename
			rtNode.Phase = "new"
			rtNode.Progress = 0
			rtWaitTaskNodes = append(rtWaitTaskNodes, &rtNode)
			rtTaskNodeMap[rtTaskID] = &rtNode

			// jsonBytes, err := json.Marshal(rtNode)
			// if err != nil {
			// 	fmt.Println("error:", err)
			// }
			// jsonStr := string(jsonBytes)
			// fmt.Println("UploadRenderingTaskData(), jsonStr: ", jsonStr)

			rtTaskID += 1

			fmt.Println("UploadRenderingTaskData(), taskname: ", taskname)
			fmt.Println("UploadRenderingTaskData(), len(rtWaitTaskNodes): ", len(rtWaitTaskNodes))
			fmt.Println("UploadRenderingTaskData(), upload receive a new rendering task file name: ", filename)

			filePath = rtNode.ResUrl
			g.SaveUploadedFile(file, filePath)

		case "finish":

			fileDir := "./static/rtUploadFiles/" + taskname + "/"
			filePath = fileDir + filename
			fmt.Println("upload receive a rendering outpu pic file name: ", filename)

			g.SaveUploadedFile(file, filePath)

			webfs.ResizeImgAndSave(fileDir, filename, 128, 128)
		default:

		}
	}

	tid, _ := strconv.ParseInt(taskid, 10, 64)

	var reqd UploadReqDef
	reqd.Success = true
	reqd.FileName = filename
	reqd.TaskID = tid
	reqd.TaskName = taskname
	reqd.Status = status
	reqd.FilePath = filePath
	jsonBytes, err := json.Marshal(reqd)
	if err != nil {
		fmt.Println("error:", err)
	}
	jsonStr := string(jsonBytes)
	// c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	g.String(http.StatusOK, fmt.Sprintf("%s", jsonStr))
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
	url := g.Request.URL.Path
	fmt.Println("CanNotFindContent(), url: ", url)
	database.AppendErrorPageInfo("non-page", url)
	ns := "websit-contentnotfind"
	// viewsTotalStr := getPageViewCountStrByName(ns)
	defer func() {
		increasePageViewCountByName(ns)
	}()
	w := g.Writer
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, errorTemplate)
}

func ReqFavicon(g *gin.Context) {
	StaticFileRequest(g.Writer, g.Request, "/static/favicon.ico")
}
func increasePageViewCountByName(pns string, flags ...int) {
	database.AppendSTDBData(pns, flags...)
}

func getPageViewCountStrByName(ns string) string {
	return strconv.Itoa(database.GetPageViewCountByName(ns) + 1)
}
