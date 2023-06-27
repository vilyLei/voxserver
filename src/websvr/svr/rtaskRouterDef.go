package svr

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
)

type UploadReqDef struct {
	TaskID    int64  `json:"taskid,int64"`
	FilePath  string `json:"filepath"`
	TaskName  string `json:"taskname"`
	Success   bool   `json:"success,bool"`
	Status    int    `json:"status,int"`
	DrcsTotal int    `json:"drcsTotal,int"`
	FileName  string `json:"fileName"`
	UUID      string `json:"-"` //忽略输出
}

type RTaskInfoNode struct {
	Id               int64       `json:"id"`
	Name             string      `json:"name"`
	ResUrl           string      `json:"resUrl"`
	ResDir           string      `json:"resDir"`
	Resolution       [2]int      `json:"resolution"`
	BGTransparent    int         `json:"bgTransparent"`
	Camdvs           [16]float64 `json:"camdvs"`
	Phase            string      `json:"phase"`
	Action           string      `json:"action"`
	AutoFitModelSize string      `json:"autoFitModelSize"`
	Progress         int
	RerenderingTimes int
	ModelDrcsTotal   int
}

func (self *RTaskInfoNode) Reset() {

	self.Action = "new"
	self.Phase = "new"
	self.Progress = 0
	self.RerenderingTimes = 0
	self.ModelDrcsTotal = 0
}
func (self *RTaskInfoNode) SetCamdvsWithStr(camdvsStr string) {

	// self.Action = "new"
	// self.Phase = "new"
	// self.Progress = 0
	// self.RerenderingTimes = 0
	fmt.Println("SetCamdvsWithStr() ### len(camdvsStr): ", len(camdvsStr))
	var dvs [16]float64
	if len(camdvsStr) > 16 {
		camdvsStr = camdvsStr[1 : len(camdvsStr)-1]
		parts := strings.Split(camdvsStr, ",")
		fmt.Println("SetCamdvsWithStr() ### camdvsStr: ", camdvsStr)
		fmt.Println("SetCamdvsWithStr() ### len(parts): ", len(parts))
		// s := fmt.Sprintf("%f", 678.3567)
		// for i, substr := range parts {
		for i := 0; i < len(parts); i++ {
			if value, err := strconv.ParseFloat(parts[i], 64); err == nil {
				// fmt.Println(s) // 3.14159265
				dvs[i] = value
			}
		}

		fmt.Println("SetCamdvsWithStr() ### dvs: ", dvs)
	}
	self.Camdvs = dvs
}

func (self *RTaskInfoNode) SetParamsWithStr(sizesStr string, camdvs string, bgTransparent string) {
	parts := strings.Split(sizesStr, ",")
	iw, _ := strconv.Atoi(parts[0])
	ih, _ := strconv.Atoi(parts[1])
	self.Resolution = [2]int{iw, ih}
	iflag, _ := strconv.Atoi(bgTransparent)
	self.BGTransparent = iflag
	self.SetCamdvsWithStr(camdvs)
}

func (self *RTaskInfoNode) GetViewStatusInfo(teamIndex int, teamLength int) string {
	infoStr := `{"phase":"` + self.Phase + `","progress":` + strconv.Itoa(self.Progress)
	infoStr += `,"taskid":` + strconv.FormatInt(self.Id, 10) + `,"status":22`
	infoStr += `,"drcsTotal":` + strconv.Itoa(self.ModelDrcsTotal)
	switch self.Phase {
	case "new":
		infoStr += `, "teamIndex":` + strconv.Itoa(teamIndex) + `, "teamLength": ` + strconv.Itoa(teamLength)
	case "finish":
		infoStr += `, "sizes":[` + strconv.Itoa(self.Resolution[0]) + `,` + strconv.Itoa(self.Resolution[1]) + `]`
		infoStr += `, "bgTransparent":` + strconv.Itoa(self.BGTransparent)
	}
	infoStr += `}`
	fmt.Println("GetViewStatusInfo() ### infoStr: ", infoStr)
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
