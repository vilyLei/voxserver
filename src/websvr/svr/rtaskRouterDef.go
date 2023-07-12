package svr

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"
)

type UploadReqDef struct {
	TaskID    int64  `json:"taskid,int64"`
	Version   int64  `json:"version,int64"`
	FilePath  string `json:"filepath"`
	TaskName  string `json:"taskname"`
	Success   bool   `json:"success,bool"`
	Status    int    `json:"status,int"`
	DrcsTotal int    `json:"drcsTotal,int"`
	FileName  string `json:"fileName"`
	Time      int64  `json:"time"`
	UUID      string `json:"-"` //忽略输出
}

func (self *UploadReqDef) UpdateTime() {
	t := time.Now()
	self.Time = t.UnixMilli()
}
func (self *UploadReqDef) GetJsonStr() string {
	jsonBytes, err := json.Marshal(self)
	if err != nil {
		fmt.Println("error:", err)
	}
	return string(jsonBytes)
}

type RTMaterialNode struct {
	ModelName      string     `json:"modelName"`
	UVScales       [2]float64 `json:"uvScales"`
	Type           string     `json:"type"`
	Color          uint       `json:"color"`
	Specular       float64    `json:"specular"`
	Metallic       float64    `json:"metallic"`
	Roughness      float64    `json:"roughness"`
	NormalStrength float64    `json:"normalStrength"`
	Act            string     `json:"act"` // its values: add, del, update
}

func (self *RTMaterialNode) copyFrom(srcNode *RTMaterialNode) {
	if self != srcNode {
		if srcNode.ModelName != "" && (self.ModelName == "" || self.ModelName == srcNode.ModelName) {
			self.ModelName = srcNode.ModelName
			self.UVScales = srcNode.UVScales
			self.Type = srcNode.Type
			self.Color = srcNode.Color
			self.Specular = srcNode.Specular
			self.Metallic = srcNode.Metallic
			self.Roughness = srcNode.Roughness
			self.NormalStrength = srcNode.NormalStrength
			self.Act = srcNode.Act
			fmt.Println("RTMaterialNode::copyFrom(), ModelName: ", self.ModelName)
		}
	}
}

type RTEnvNode struct {
	Path       string  `json:"path"`
	Type       string  `json:"type"`
	Brightness float64 `json:"brightness"`
	AO         float64 `json:"ao"`
	Rotation   float64 `json:"rotation"`
}

func (self *RTEnvNode) copyFrom(srcNode *RTEnvNode) {
	if self != srcNode {
		// if srcNode.Name != "" && (self.Name == "" || self.Name == srcNode.Name) {
		self.Path = srcNode.Path
		self.Type = srcNode.Type
		self.Brightness = srcNode.Brightness
		self.AO = srcNode.AO
		self.Rotation = srcNode.Rotation
		// }
	}
}

type RTOutputNode struct {
	Path          string `json:"path"`
	OutputType    string `json:"outputType"`
	Resolution    [2]int `json:"resolution"`
	BGTransparent int    `json:"bgTransparent"`
	BGColor       uint   `json:"bgColor"`
}

func (self *RTOutputNode) copyFrom(srcNode *RTOutputNode) {
	if self != srcNode {
		// if srcNode.Name != "" && (self.Name == "" || self.Name == srcNode.Name) {
		self.Path = srcNode.Path
		self.OutputType = srcNode.OutputType
		self.Resolution = srcNode.Resolution
		self.BGTransparent = srcNode.BGTransparent
		self.BGColor = srcNode.BGColor
		// }
	}
}

type RTRCameraNode struct {
	Type      string      `json:"type"`
	ViewAngle float64     `json:"viewAngle"`
	Near      float64     `json:"near"`
	Far       float64     `json:"far"`
	Matrix    [16]float64 `json:"matrix"`
}

func (self *RTRCameraNode) copyFrom(srcNode *RTRCameraNode) {
	if self != srcNode {
		// if srcNode.Name != "" && (self.Name == "" || self.Name == srcNode.Name) {
		self.Type = srcNode.Type
		self.ViewAngle = srcNode.ViewAngle
		self.Far = srcNode.Far
		self.Near = srcNode.Near
		self.Matrix = srcNode.Matrix
		// }
	}
}

type RTRenderingNode struct {
	Name    string `json:"name"`
	Unit    string `json:"unit"`
	Version int64  `json:"version"`

	Camera    RTRCameraNode    `json:"camera"`
	Output    RTOutputNode     `json:"output"`
	Env       RTEnvNode        `json:"env"`
	Materials []RTMaterialNode `json:"materials"`
}

func (self *RTRenderingNode) setFromJson(rnodeJsonStr string) {
	err := json.Unmarshal([]byte(rnodeJsonStr), self)
	if err != nil {
		fmt.Printf("RTRenderingNode::setFromJson() Unmarshal failed, err: %v\n", err)
	}
	fmt.Println("RTRenderingNode::setFromJson(), self: ", self)
}
func (self *RTRenderingNode) copyFrom(srcNode *RTRenderingNode) {

	if self != srcNode {
		if (srcNode.Name != "") && (self.Name == "" || self.Name == srcNode.Name) {

			self.Name = srcNode.Name
			self.Unit = srcNode.Unit
			self.Camera.copyFrom(&srcNode.Camera)
			self.Output.copyFrom(&srcNode.Output)
			self.Env.copyFrom(&srcNode.Env)

			if srcNode.Materials != nil {
				src_total := len(srcNode.Materials)
				if src_total > 0 {
					for i := 0; i < src_total; i++ {
						srcM := &srcNode.Materials[i]
						flag := true
						dst_total := len(self.Materials)
						for j := 0; j < dst_total; j++ {
							if self.Materials[j].ModelName == srcM.ModelName {
								flag = false
								self.Materials[j].copyFrom(srcM)
								break
							}
						}
						if flag {
							fmt.Println("RTRenderingNode::copyFrom(), add a new material ModelName: ", srcM.ModelName)
							self.Materials = append(self.Materials, *srcM)
							// self.Materials = append(self.Materials, srcNode.Materials[i])
						}
					}
					var ms []RTMaterialNode
					srcNode.Materials = ms
				}
			}
		}
	}
}

type RTaskInfoNode struct {
	Id               int64  `json:"id"`
	Name             string `json:"name"`
	ResUrl           string `json:"resUrl"`
	ResDir           string `json:"resDir"`
	Phase            string `json:"phase"`
	Action           string `json:"action"`
	Time             int64  `json:"time"`
	Version          int64  `json:"version"`
	AutoFitModelSize string `json:"autoFitModelSize"`
	Progress         int
	RerenderingTimes int
	ModelDrcsTotal   int
	RActive          bool
	RNode            *RTRenderingNode `json:"rnode"`
	ImgsTotal        int
}

func (self *RTaskInfoNode) UpdateTime() {
	t := time.Now()
	self.Time = t.UnixMilli()
}
func (self *RTaskInfoNode) Reset() {

	self.Action = "new"
	self.Phase = "new"
	self.Progress = 0
	self.RerenderingTimes = 0
	self.ModelDrcsTotal = 0
	self.Version = 0
	self.RActive = false
	self.RNode = nil
	self.ImgsTotal = 0
}

// func (self *RTaskInfoNode) SetCamdvsWithStr(camdvsStr string) {
// 	fmt.Println("SetCamdvsWithStr() ### len(camdvsStr): ", len(camdvsStr))
// 	var dvs [16]float64
// 	if len(camdvsStr) > 16 {
// 		camdvsStr = camdvsStr[1 : len(camdvsStr)-1]
// 		parts := strings.Split(camdvsStr, ",")
// 		fmt.Println("SetCamdvsWithStr() ### camdvsStr: ", camdvsStr)
// 		fmt.Println("SetCamdvsWithStr() ### len(parts): ", len(parts))
// 		// s := fmt.Sprintf("%f", 678.3567)
// 		// for i, substr := range parts {
// 		for i := 0; i < len(parts); i++ {
// 			if value, err := strconv.ParseFloat(parts[i], 64); err == nil {
// 				// fmt.Println(s) // 3.14159265
// 				dvs[i] = value
// 			}
// 		}

// 		fmt.Println("SetCamdvsWithStr() ### dvs: ", dvs)
// 	}
// 	self.Camdvs = dvs
// }

// func (self *RTaskInfoNode) SetParamsWithStr(sizesStr string, camdvs string, bgTransparent string) {
// 	parts := strings.Split(sizesStr, ",")
// 	iw, _ := strconv.Atoi(parts[0])
// 	ih, _ := strconv.Atoi(parts[1])
// 	self.Resolution = [2]int{iw, ih}
// 	iflag, _ := strconv.Atoi(bgTransparent)
// 	self.BGTransparent = iflag
// 	self.SetCamdvsWithStr(camdvs)
// }

func (self *RTaskInfoNode) GetViewStatusInfo(teamIndex int, teamLength int) string {
	self.UpdateTime()
	infoStr := `{"phase":"` + self.Phase + `","progress":` + strconv.Itoa(self.Progress)
	infoStr += `,"taskid":` + strconv.FormatInt(self.Id, 10) + `,"status":22, "time":` + strconv.FormatInt(self.Time, 10)
	infoStr += `,"drcsTotal":` + strconv.Itoa(self.ModelDrcsTotal)
	infoStr += `,"version":` + strconv.FormatInt(self.Version, 10)

	rnode := self.RNode
	output := rnode.Output
	switch self.Phase {
	case "new":
		infoStr += `, "teamIndex":` + strconv.Itoa(teamIndex) + `, "teamLength": ` + strconv.Itoa(teamLength)
	case "finish":
		sizes := output.Resolution
		infoStr += `, "sizes":[` + strconv.Itoa(sizes[0]) + `,` + strconv.Itoa(sizes[1]) + `]`
		infoStr += `, "bgTransparent":` + strconv.Itoa(output.BGTransparent)
		infoStr += `, "imgsTotal":` + strconv.Itoa(self.ImgsTotal)
	}
	infoStr += `}`
	// fmt.Println("GetViewStatusInfo() ### infoStr: ", infoStr)
	return infoStr
}
func (self *RTaskInfoNode) GetTaskJsonStr() string {
	self.UpdateTime()
	jsonBytes, err := json.Marshal(self)
	if err != nil {
		fmt.Println("error:", err)
	}
	jsonStr := string(jsonBytes)
	jsonStr = `{"phase":"` + self.Phase + `", "task":` + jsonStr + `,"status":22}`
	return jsonStr
}

var rtTaskID int64 = 2001
var rtTaskVer string = "v1"
var rtWaitTaskNodes []*RTaskInfoNode

var tempRTNode RTaskInfoNode
var currRTRNode RTRenderingNode

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
