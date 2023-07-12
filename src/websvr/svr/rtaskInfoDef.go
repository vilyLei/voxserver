package svr

import (
	"encoding/json"
	"fmt"
	"time"
)

type RAliveTaskInfoNode struct {
	TaskID           int64  `json:"taskid,int64"`
	TaskName         string `json:"taskname"`
	Phase            string `json:"phase"`
	FilePath         string `json:"filepath"`
	DrcsTotal        int    `json:"drcsTotal,int"`
	Progress         int    `json:"progress,int"`
	RerenderingTimes int    `json:"rerenderingTimes"`
	Version          int64  `json:"version"`
}

func (self *RAliveTaskInfoNode) CopyFromRTaskInfoNode(v *RTaskInfoNode) {
	if v.RActive {
		self.TaskID = v.Id
		self.TaskName = v.Name
		self.Phase = v.Phase
		self.FilePath = v.ResUrl
		self.Progress = v.Progress
		self.DrcsTotal = v.ModelDrcsTotal
		self.RerenderingTimes = v.RerenderingTimes
		self.Version = v.Version
	}
}

func (self *RAliveTaskInfoNode) GetJsonStr() string {
	jsonBytes, err := json.Marshal(self)
	if err != nil {
		fmt.Println("error:", err)
	}
	return string(jsonBytes)
}

type RAliveTasksInfoNode struct {
	Success bool                  `json:"success,bool"`
	Status  int                   `json:"status,int"`
	Total   int                   `json:"total,int"`
	Time    int64                 `json:"time"`
	Tasks   []*RAliveTaskInfoNode `json:"tasks"`
}

func (self *RAliveTasksInfoNode) UpdateTime() {
	t := time.Now()
	self.Time = t.UnixMilli()
}

func (self *RAliveTasksInfoNode) CopyFromRTaskInfoNodeMap(rtnMap *map[int64]*RTaskInfoNode) {
	var tasks = make([]*RAliveTaskInfoNode, 0)
	for _, v := range *rtnMap {
		if v.RActive {
			var task RAliveTaskInfoNode
			task.CopyFromRTaskInfoNode(v)
			tasks = append(tasks, &task)
		}
	}
	self.UpdateTime()
	self.Tasks = tasks
	self.Total = len(tasks)
	self.Success = true
	self.Status = 22
}

func (self *RAliveTasksInfoNode) GetJsonStr() string {
	jsonBytes, err := json.Marshal(self)
	if err != nil {
		fmt.Println("error:", err)
	}
	return string(jsonBytes)
}
