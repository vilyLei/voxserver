package main

import (
	"fmt"
	"os"
)

func main() {

	// using the function
	mydir, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(mydir)
}
