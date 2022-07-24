package main

import (
	"fmt"
	"time"

	"voxcocurrent.com/pipeline"
)

// go mod edit -replace voxcocurrent.com/pipeline=./pipeline
func main() {
	sourceChan := pipeline.ArraySource(1, 4, 8, 2, 19, 5)

	for {
		if data, ok := <-sourceChan; ok {
			fmt.Println("main get data:", data)
		} else {
			break
		}
	}

	// t := runtime.NumCPU()

	time.Sleep(time.Second * 3)
}
