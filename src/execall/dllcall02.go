package main

import (
	"fmt"
	"syscall"
	"unsafe"
)

// var (
// 	TestMathDLL = syscall.NewLazyDLL("./math/TestMathDLL.dll")
// 	//int getVersion()
// 	getDllVersion     = TestMathDLL.NewProc("getVersion")
// 	fibonacci_init    = TestMathDLL.NewProc("fibonacci_init")
// 	fibonacci_index   = TestMathDLL.NewProc("fibonacci_index")
// 	fibonacci_current = TestMathDLL.NewProc("fibonacci_current")
// 	fibonacci_next    = TestMathDLL.NewProc("fibonacci_next")
// )

// 获取字符串的长度指针
func lenPtr(s string) uintptr {
	return uintptr(len(s))
}

// 获取数字的指针
func intPtr(n int) uintptr {
	return uintptr(n)
}

// 获取字符串的指针
func strPtr(s string) uintptr {
	return uintptr(unsafe.Pointer(syscall.StringBytePtr(s)))
}

func main() {
	fmt.Println("sys init ...")
	h, err := syscall.LoadLibrary("./math/TestMathDLL.dll")
	if err != nil {
		fmt.Printf("LoadLibrary failed, err: %v", err)
	} else {
		fmt.Println("LoadLibrary success ...")

		proc, err := syscall.GetProcAddress(h, "getVersion")
		if err != nil {
			fmt.Printf("GetProcAddress failed, err: %v", err)
		} else {
			// 没有足够的参数，用0补齐，当前的版本总共需要5个参数
			r, _, _ := syscall.Syscall(uintptr(proc), 0, 0, 0, 0)
			fmt.Printf("getVersion(), r: %d\n", r)
		}
		//r, _, _ := syscall.Syscall(uintptr(proc),1, uintptr(unsafe.Pointer(cmsg)), uintptr(unsafe.Pointer(&cmsgres)), 0)
		defer syscall.FreeLibrary(h)
	}
	fmt.Println("sys end ...")
}
func main2() {
	// fmt.Println("sys init ...")
	// var ver uintptr
	// var err error
	// ver, _, err = getDllVersion.Call()
	// fmt.Printf("getDllVersion(), version: %d\n", ver)
	// if err != nil {
	// 	// fmt.Println("has error ...")
	// }
	// fmt.Println(err)
	// fibonacci_init.Call(1, 1)

	// var index uintptr
	// for i := 0; i < 5; i++ {
	// 	index, _, err = fibonacci_index.Call()
	// 	fmt.Printf("fibonacci_index(), index: %d\n", index)
	// 	index, _, err = fibonacci_current.Call()
	// 	fmt.Printf("fibonacci_current(), index: %d\n", index)
	// 	fibonacci_next.Call()
	// }
	// // path := "D:\\dev\\licker"
	// // _, _, err = Licker.Call(strPtr(path), lenPtr(path))
	// // fmt.Println(err)
	// fmt.Println("sys end ...")
}
