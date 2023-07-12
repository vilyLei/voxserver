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
	// slice := []int{1, 2, 3, 4, 5}
	// copyTest()
	// return
	slice := []int{1}
	fmt.Println("A slice: ", slice)
	first := slice[0]
	slice = append(slice[:0], slice[1:]...)
	fmt.Println("B slice: ", slice)
	fmt.Println("C first: ", first)
}
func copyTest() {
	int_a_Arr := [2]int{11, 12}
	int_b_Arr := [2]int{13, 14}
	fmt.Println("A int_a_Arr: ", int_a_Arr)
	fmt.Println("A int_b_Arr: ", int_b_Arr)
	fmt.Println("--------- copy -----------")
	int_b_Arr = int_a_Arr
	int_a_Arr[0] = 15
	int_a_Arr[1] = 16
	fmt.Println("B int_a_Arr: ", int_a_Arr)
	fmt.Println("B int_b_Arr: ", int_b_Arr)
}
func main1() {

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
