package svr

import (
	"strconv"
	"strings"
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

type RTaskInfoNode struct {
	Id               int64  `json:"id"`
	Name             string `json:"name"`
	ResUrl           string `json:"resUrl"`
	Resolution       [2]int `json:"resolution"`
	Phase            string `json:"phase"`
	Action           string `json:"action"`
	AutoFitModelSize string `json:"autoFitModelSize"`
	Progress         int
	RerenderingTimes int
}

func (self *RTaskInfoNode) Reset() {

	self.Action = "new"
	self.Phase = "new"
	self.Progress = 0
	self.RerenderingTimes = 0
}
func (self *RTaskInfoNode) SetResolutionWithSizeStr(sizesStr string) {
	parts := strings.Split(sizesStr, ",")
	iw, _ := strconv.Atoi(parts[0])
	ih, _ := strconv.Atoi(parts[1])
	self.Resolution = [2]int{iw, ih}
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
