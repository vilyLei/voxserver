package main

import (
	"encoding/binary"
	"fmt"
	"math/rand"
	"sync"
	"time"
)

var lock sync.Mutex

func main() {

	fmt.Println("random .................. begin ...")
	a := rand.Int()
	b := rand.Intn(100) //生成0-99之间的随机数
	fmt.Println(a)
	fmt.Println(b)

	// 将时间戳设置成种子数
	rand.Seed(time.Now().UnixNano())
	// 生成10个0-99之间的随机数
	for i := 0; i < 10; i++ {
		fmt.Println(rand.Intn(100), ", ", rand.Float32())

	}
	fmt.Println("random .................. end ...")

	fmt.Println("bytes to Uint32 .................. begin ...")
	var mySlice = []byte{0, 0, 1, 244}
	data := binary.BigEndian.Uint32(mySlice)
	fmt.Println(data)
	fmt.Println("bytes to Uint32 .................. end ...")

	slc := make([]int, 0, 1000)
	var wg sync.WaitGroup
	// var lock sync.Mutex

	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func(a int) {
			defer wg.Done()

			// lock.Lock()
			// defer lock.Unlock()
			// slc = append(slc, a)

			lock.Lock()
			slc = append(slc, a)
			lock.Unlock()
		}(i)

	}
	wg.Wait()
	fmt.Println(len(slc))
}
