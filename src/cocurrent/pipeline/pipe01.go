package pipeline

import "fmt"

// go mod init voxcocurrent.com/pipeline

func ArraySource(arr ...int) chan int {

	out := make(chan int)
	go func() {
		fmt.Println("ArraySource() go func() begin.")
		for a := range arr {

			fmt.Println("ArraySource() saveData, a: ", a)
			out <- a
		}

		close(out)
		fmt.Println("ArraySource() go func() end.")
	}()
	return out
}
