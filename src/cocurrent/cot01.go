package main

import (
	"fmt"
	"time"
)

// go mod init voxcocurrent.com/main
var countValue int = 0
var intList []int

func countInt() {
	countValue++
	intList = append(intList, countValue)
	fmt.Println("countInt(), countValue: ", countValue)
	time.Sleep(time.Millisecond * 8)
}

func sample02() {
	//for i := 0; i < 10; i++ {
	for i := 0; i < 60; i++ {
		go countInt()
	}
	time.Sleep(time.Millisecond * 20)
}
func main() {

	fmt.Println("init main...")
	sample02()

	fmt.Println("main intList: ", intList)
	fmt.Println("main countValue: ", countValue)
	fmt.Println("main run end...")
	// sample01()
}
func sample01() {
	ch := make(chan string)
	for i := 0; i < 10; i++ {
		go hello(i, ch)
	}

	duration_500ms := time.Millisecond * 500
	for {
		time.Sleep(duration_500ms)
		str := <-ch
		fmt.Println(str)

	}

	time.Sleep(time.Millisecond)
}
func hello(i int, ch chan string) {
	for {
		ch <- fmt.Sprintf("hello world, %d", i)
	}
}
