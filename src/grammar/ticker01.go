package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("sys init ...")
	for range time.Tick(1 * time.Second) {
		// do_some_thing()
		fmt.Println("tick does...")
	}
	fmt.Println("sys sleep ...")
	time.Sleep(1 * time.Second)
	fmt.Println("sys end ...")
}
