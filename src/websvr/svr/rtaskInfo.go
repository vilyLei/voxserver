package svr

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetRTaskInfo(g *gin.Context) {

	phase := g.DefaultQuery("phase", "none")
	taskid := g.DefaultQuery("taskid", "0")
	taskname := g.DefaultQuery("taskname", "none")
	srcType := g.DefaultQuery("srcType", "none")

	hasTaskFlag := false
	tid, errInt64 := strconv.ParseInt(taskid, 10, 64)
	if errInt64 == nil {
		hasTaskFlag = HasRTTaskNodeByID(tid)
	}
	fmt.Println("GetRTaskInfo, phase: ", phase, ", taskid: ", taskid, ", taskname: ", taskname, " srcType: ", srcType, " hasTaskFlag: ", hasTaskFlag)
	var rtNode *RTaskInfoNode = &tempRTNode
	if hasTaskFlag {
		rtNode = rtTaskNodeMap[tid]
	}
	switch phase {
	case "modelToDrc":
		if hasTaskFlag {
			var reqd UploadReqDef
			reqd.FilePath = rtNode.ResDir + "draco/"
			reqd.DrcsTotal = rtNode.ModelDrcsTotal
			reqd.TaskID = tid
			reqd.TaskName = taskname
			reqd.Status = 22
			reqd.Success = true
			reqd.UpdateTime()

			// jsonBytes, err := json.Marshal(reqd)
			// if err != nil {
			// 	fmt.Println("error:", err)
			// }
			// jsonStr := string(jsonBytes)
			// c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
			g.String(http.StatusOK, fmt.Sprintf("%s", reqd.GetJsonStr()))
			return
		}
	case "syncAnAliveTask":
		if hasTaskFlag {
			var rtiNode RAliveTaskInfoNode
			rtiNode.CopyFromRTaskInfoNode(rtNode)
			fmt.Println("GetRTaskInfo, syncAnAliveTask, taskid: ", taskid, ", taskname: ", taskname, " srcType: ", srcType)
			g.String(http.StatusOK, fmt.Sprintf("%s", rtiNode.GetJsonStr()))
		}
	case "syncAnAliveTaskInfo":
		if hasTaskFlag {
			// var rtiNode RAliveTaskInfoNode
			// rtiNode.CopyFromRTaskInfoNode(rtNode)
			fmt.Println("GetRTaskInfo, syncAnAliveTask, taskid: ", taskid, ", taskname: ", taskname, " srcType: ", srcType)
			g.String(http.StatusOK, fmt.Sprintf("%s", rtNode.GetTaskJsonStr()))
		}

	case "syncAliveTasks":
		var rtsiNode RAliveTasksInfoNode
		rtsiNode.CopyFromRTaskInfoNodeMap(&rtTaskNodeMap)
		g.String(http.StatusOK, fmt.Sprintf("%s", rtsiNode.GetJsonStr()))
	default:
		var failure_reqd UploadReqDef
		failure_reqd.Success = false
		failure_reqd.Status = 0
		failure_reqd.DrcsTotal = 0
		failure_reqd.UpdateTime()
		g.String(http.StatusOK, fmt.Sprintf("%s", failure_reqd.GetJsonStr()))
	}
}
