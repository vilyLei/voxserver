package main

import (
	"fmt"
	"sync"
	"time"
)

var mux sync.Mutex

func input(cs chan int, count int) {
	for i := 1; i <= count; i++ {
		cs <- i
	}
}
func output(cs chan int) {
	for s := range cs {
		fmt.Println(s)
	}
}
func input2(cs chan int, count int) {
	for i := 1; i <= count; i++ {
		cs <- i
	}
	defer close(cs)
}
func main() {
	fmt.Println("sys init ...")
	cs := make(chan int)
	go input2(cs, 5)
	output(cs)
	// time.Sleep(3 * 1e9)
	fmt.Println("sys end ...")
}

func main5() {
	fmt.Println("sys init ...")
	cs := make(chan int)
	go input(cs, 5)
	go output(cs)
	time.Sleep(3 * 1e9)
	fmt.Println("sys end ...")
}

func printOne(cs chan int) {
	fmt.Println(1)
	cs <- 1
}
func printTwo(cs chan int) {
	<-cs
	fmt.Println(2)
	defer close(cs)
}
func main4() {
	fmt.Println("sys init ...")
	cs := make(chan int)
	go printOne(cs)
	<-cs
	close(cs)
	_, isRunning2 := <-cs
	fmt.Println("sys end ..., isRunning2: ", isRunning2)
}
func main3() {
	cs := make(chan int)
	go printOne(cs)
	go printTwo(cs)
	time.Sleep(5)
}

func main2() {

	fmt.Println("sys init ...")
	c := make(chan int)
	defer close(c)
	go func() { c <- 3 + 4 }()
	i := <-c
	fmt.Println(i)
	fmt.Println("sys end ...")
}
