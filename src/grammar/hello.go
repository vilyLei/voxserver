package main

import (
	"fmt"
)

type DataLoadNode struct {
	id   string
	desc string
}

func (self *DataLoadNode) Reset() *DataLoadNode {
	self.id = "init-id"
	self.desc = "a DataLoadNode instance."
	return self
}
func (self *DataLoadNode) ShowInfo() *DataLoadNode {
	fmt.Printf("DataLoadNode ins, id: %s\n", self.id)
	fmt.Printf("DataLoadNode ins, desc: %s\n", self.desc)
	return self
}
func testMap() {
	fmt.Println("\n---------- test map begin ------------")
	m0 := make(map[string]int)
	m0["age"] = 18
	fmt.Println("m0.age: ", m0["age"])
	fmt.Println("---------- test map end  --------------")
}

func main() {
	fmt.Println("hello young man !")
	var num int = 10
	num++
	fmt.Println("num: ", num)
	node := new(DataLoadNode)
	node.Reset().ShowInfo()
	var node1 *DataLoadNode = new(DataLoadNode)
	node1.id = "node1"
	node1.desc = "node1_desc"
	node1.ShowInfo()

	var pNode DataLoadNode
	pNode.id = "json"
	fmt.Println("pNode.id", pNode.id) // 输出 pNode.id json
	pd := &pNode
	fmt.Println("pd.id", pd.id) // 输出 pNode.id json
	// ppd := &pd
	// fmt.Println("ppd.id", ppd.id) // 输出 ppd.id json
	testMap()
}
