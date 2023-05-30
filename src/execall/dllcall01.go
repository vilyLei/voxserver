package main

import (
	"fmt"
	"syscall"
	"unsafe"
)

var (
	TestMathDLL = syscall.NewLazyDLL("./math/TestMathDLL.dll")
	//int getVersion()
	getDllVersion     = TestMathDLL.NewProc("getVersion")
	fibonacci_init    = TestMathDLL.NewProc("fibonacci_init")
	fibonacci_index   = TestMathDLL.NewProc("fibonacci_index")
	fibonacci_current = TestMathDLL.NewProc("fibonacci_current")
	fibonacci_next    = TestMathDLL.NewProc("fibonacci_next")
)

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
	var ver uintptr
	var err error
	ver, _, err = getDllVersion.Call()
	fmt.Printf("getDllVersion(), version: %d\n", ver)
	if err != nil {
		// fmt.Println("has error ...")
	}
	fmt.Println(err)
	fibonacci_init.Call(1, 1)

	var index uintptr
	for i := 0; i < 5; i++ {
		index, _, err = fibonacci_index.Call()
		fmt.Printf("fibonacci_index(), index: %d\n", index)
		index, _, err = fibonacci_current.Call()
		fmt.Printf("fibonacci_current(), index: %d\n", index)
		fibonacci_next.Call()
	}
	// path := "D:\\dev\\licker"
	// _, _, err = Licker.Call(strPtr(path), lenPtr(path))
	// fmt.Println(err)
	fmt.Println("sys end ...")
}
