package svr

// import (
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strconv"
// 	"strings"
//
//
//
//
//
//
//

// 	"github.com/gin-gonic/gin"
// 	"voxwebsvr.com/webfs"
// )

type UploadReqDef struct {
	TaskID   int64  `json:"taskid,int64"`
	FilePath string `json:"filepath"`
	TaskName string `json:"taskname"`
	Success  bool   `json:"success,bool"`
	Status   int    `json:"status,int"`
	FileName string `json:"fileName"`
	UUID     string `json:"-"` //忽略输出
}

type RTaskInfoNode struct {
	Id               int64  `json:"id"`
	Name             string `json:"name"`
	ResUrl           string `json:"resUrl"`
	Resolution       [2]int `json:"resolution"`
	Phase            string `json:"phase"`
	Action           string `json:"action"`
	Progress         int
	RerenderingTimes int
}

var rtTaskID int64 = 2001
var rtTaskVer string = "v1"
var rtWaitTaskNodes []*RTaskInfoNode

var tempRTNode RTaskInfoNode

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
