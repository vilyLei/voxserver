package svr

import (
	"encoding/json"
	"fmt"
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

func (self *RTaskInfoNode) GetViewStatusInfo(teamIndex int, teamLength int) string {
	infoStr := `{"phase":"` + self.Phase + `","progress":` + strconv.Itoa(self.Progress) + `,"taskid":` + strconv.FormatInt(self.Id, 10) + `,"status":22`
	switch self.Phase {
	case "new":
		infoStr += `, "teamIndex":` + strconv.Itoa(teamIndex) + `, "teamLength": ` + strconv.Itoa(teamLength)
	case "finish":
		infoStr += `, "sizes":[` + strconv.Itoa(self.Resolution[0]) + `,` + strconv.Itoa(self.Resolution[1]) + `]`
	}
	infoStr += `}`
	return infoStr
}
func (self *RTaskInfoNode) GetTaskJsonStr() string {
	jsonBytes, err := json.Marshal(self)
	if err != nil {
		fmt.Println("error:", err)
	}
	jsonStr := string(jsonBytes)
	// fmt.Println("RenderingTask(), jsonStr: ", jsonStr)
	jsonStr = `{"phase":"` + self.Phase + `", "task":` + jsonStr + `,"status":22}`
	return jsonStr
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
