package main

import "time"

func main() {
	println("sys init ...")
	defer println("in main")
	go func() {
		defer println("in goroutine")
		// for i := 0; i < 3; i++ {
		// 	println("time point: ", i)
		// 	panic("")
		// 	time.Sleep(time.Second)
		// }
		panic("")
	}()

	time.Sleep(1 * time.Second)
}
