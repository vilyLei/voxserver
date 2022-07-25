package main

import (
	"fmt"
	"sync"
)

func main() {
	var (
		slc = []int{}
		n   = 1000
		wg  sync.WaitGroup
	)

	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			slc = append(slc, i)
			wg.Done()
		}()
	}
	wg.Wait()

	fmt.Println("len:", len(slc))
	fmt.Println("done")
}
