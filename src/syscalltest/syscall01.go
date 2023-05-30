package main

import (
	"fmt"
	"syscall"
)

func main() {
	pid, _, _ := syscall.Syscall(39, 0, 0, 0, 0) // 用不到的就补上 0
	fmt.Println("Process id: ", pid)
}

// // work in linux
// func main2() {
// 	buf := make([]byte, 256)
// 	n, err := syscall.Getcwd(buf)
// 	if err != nil {
// 		panic(err)
// 	}
// 	fmt.Println(string(buf[:n]))
// }
