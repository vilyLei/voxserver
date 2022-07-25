package main

import (
	"fmt"
)

func test01() {

	var vstat [3]int
	vstat[0] = 1
	vstat[1] = 2
	vstat[2] = 3
	var vauto *[3]int = new([3]int)
	*vauto = vstat
	slice := vauto[:]

	fmt.Println("test01(), slice vauto: ", &vauto[0])
	fmt.Println("test01(), slice  addr: ", &slice[0])
	fmt.Println("test01(), slice vstat: ", &vstat[0])

	fmt.Println("\n###")
	vstat[0] = 21

	fmt.Println("test01(), A vauto: ", vauto)
	fmt.Println("test01(), A  addr: ", slice)
	fmt.Println("test01(), A vstat: ", vstat)

	fmt.Println("\n###")
	vauto[0] = 23

	fmt.Println("test01(), B vauto: ", vauto)
	fmt.Println("test01(), B  addr: ", slice)
	fmt.Println("test01(), B vstat: ", vstat)
}
func main() {

	fmt.Println("main() init ...")
	test01()
	fmt.Println("main() end ...")
}
