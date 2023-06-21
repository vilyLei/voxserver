package svr

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/webfs"
)

func RenderingTask(g *gin.Context) {

	phase := g.DefaultQuery("phase", "none")
	progress := g.DefaultQuery("progress", "0")
	taskid := g.DefaultQuery("taskid", "0")
	taskname := g.DefaultQuery("taskname", "none")
	srcType := g.DefaultQuery("srcType", "none")

	fmt.Println("RenderingTask, rTask("+taskid+"):"+phase, ", progress: ", progress, "%, taskname: ", taskname, " srcType: ", srcType)
	infoStr := `{"phase":"` + phase + `","status":22}`
	hasTaskFlag := false
	tid, errInt64 := strconv.ParseInt(taskid, 10, 64)
	if errInt64 == nil {
		hasTaskFlag = HasRTTaskNodeByID(tid)
	}
	var rtNode *RTaskInfoNode = &tempRTNode
	if hasTaskFlag {
		rtNode = rtTaskNodeMap[tid]
		switch phase {
		case "reqanewrtask", "rtaskreadydata", "queryataskrst", "query-re-rendering-task":
			tempRTNode.Phase = phase
		default:
			rtNode.Progress, _ = strconv.Atoi(progress)
			rtNode.Phase = phase
			// fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
			g.String(http.StatusOK, fmt.Sprintf(infoStr))
			return
		}
	}
	switch phase {
	case "query-re-rendering-task":
		fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
		// failureFlag := true
		if hasTaskFlag {
			if rtNode.Phase == "finish" {
				imgSizes := g.DefaultQuery("sizes", "512,512")
				fmt.Println("rTask("+taskid+"):"+phase+", ready re-rendering, imgSizes: ", imgSizes)
				rtNode.Action = phase
				rtNode.Phase = "new"
				rtNode.Progress = 0
				rtNode.RerenderingTimes++
				parts := strings.Split(imgSizes, ",")
				iw, _ := strconv.Atoi(parts[0])
				ih, _ := strconv.Atoi(parts[1])
				rtNode.Resolution = [2]int{iw, ih}
				rtWaitTaskNodes = append(rtWaitTaskNodes, rtNode)

			} else {
				infoStr = `{"phase":"` + phase + `","status":11}`
			}
		} else {
			infoStr = `{"phase":"` + phase + `","status":0}`
		}
		g.String(http.StatusOK, fmt.Sprintf(infoStr))
	case "rtaskreadydata":
		// if hasTaskFlag {
		// 	rtNode := rtTaskNodeMap[tid]
		// 	rtNode.Phase = "task_rendering_parse_data"
		// }
		rtNode.Phase = "task_rendering_parse_data"
		fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
		g.String(http.StatusOK, fmt.Sprintf(infoStr))
	case "reqanewrtask":
		fmt.Println("rTask("+taskid+"):"+phase+", progress: ", progress+"%")
		total := len(rtWaitTaskNodes)
		if total > 0 {
			rtNode = rtWaitTaskNodes[0]
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
			teamIndex := 0
			teamLen := 0
			if rtNode.Phase == "new" {
				teamLen = len(rtWaitTaskNodes)
				for i := 0; i < teamLen; i++ {
					if rtWaitTaskNodes[i].Id == tid {
						teamIndex = i + 1
						break
					}
				}
			}
			infoStr = `{"phase":"` + rtNode.Phase + `","progress":` + strconv.Itoa(rtNode.Progress) + `,"taskid":` + taskid + `,"status":22, "teamIndex":` + strconv.Itoa(teamIndex) + `, "teamLength": ` + strconv.Itoa(teamLen) + `}`
		} else {
			infoStr = `{"phase":"undefined","status":0}`
		}
		g.String(http.StatusOK, fmt.Sprintf(infoStr))
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
	srcType := g.DefaultQuery("srcType", "none")

	fmt.Println("UploadRenderingTaskData, phase: ", phase, ", taskid: ", taskid, ", taskname: ", taskname, " srcType: ", srcType)
	// single file uploading receive
	filename := "none"
	var status = 0
	file, _ := g.FormFile("file")
	filePath := ""
	if file != nil {

		uploadDir := "./static/uploadFiles/rtTask/"

		filename = file.Filename
		switch phase {
		case "newrtask":
			imgSizes := g.DefaultQuery("sizes", "512,512")
			status = 22
			// check file name suffix correctness
			suffix := webfs.GetFileNameSuffix(filename)
			if file.Size > 16 {

				switch suffix {
				case "obj", "fbx", "glb", "usdz", "usdc", ".blend":

					fmt.Println("UploadRenderingTaskData(), upload receive file.Size: ", file.Size, "bytes")

					taskid = strconv.FormatInt(rtTaskID, 10)
					taskname = rtTaskVer + "ModelRTask" + taskid
					fileDir := uploadDir + taskname + "/"

					var rtNode RTaskInfoNode
					// rtNode.Action = "new"
					// rtNode.Phase = "new"
					// rtNode.Progress = 0
					// rtNode.RerenderingTimes = 0
					rtNode.Reset()

					// parts := strings.Split(imgSizes, ",")
					// iw, _ := strconv.Atoi(parts[0])
					// ih, _ := strconv.Atoi(parts[1])
					// rtNode.Resolution = [2]int{iw, ih}

					rtNode.SetResolutionWithSizeStr(imgSizes)

					rtNode.Id = rtTaskID
					rtNode.Name = taskname
					rtNode.ResUrl = fileDir + filename
					rtTaskNodeMap[rtTaskID] = &rtNode

					rtWaitTaskNodes = append(rtWaitTaskNodes, &rtNode)

					// jsonBytes, err := json.Marshal(rtNode)
					// if err != nil {
					// 	fmt.Println("error:", err)
					// }
					// jsonStr := string(jsonBytes)
					// fmt.Println("UploadRenderingTaskData(), jsonStr: ", jsonStr)

					rtTaskID += 1

					fmt.Println("UploadRenderingTaskData(), taskname: ", taskname, ", rtNode.Resolution: ", rtNode.Resolution)
					fmt.Println("UploadRenderingTaskData(), len(rtWaitTaskNodes): ", len(rtWaitTaskNodes))
					fmt.Println("UploadRenderingTaskData(), upload receive a new rendering task file name: ", filename)

					filePath = rtNode.ResUrl
					g.SaveUploadedFile(file, filePath)
				default:
				}
			}

		case "finish":
			status = 22
			fileDir := uploadDir + taskname + "/"
			filePath = fileDir + filename
			fmt.Println("upload receive a rendering outpu pic file name: ", filename)

			g.SaveUploadedFile(file, filePath)

			webfs.ResizeImgAndSave(fileDir, filename, 128, 128)
		default:

		}
	}

	tid, _ := strconv.ParseInt(taskid, 10, 64)

	var reqd UploadReqDef
	reqd.Success = status == 22
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
