package main

import (
	"os"
	"runtime"

	"fmt"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/svr"
)

// strconv.Itoa
// nohup ./webserver &
// export PATH=$PATH:/usr/local/go/bin
// go build -o .\ ..\src\websvr\webserver.go

// go build -o ../../bin/ webserver.go

// go build ../src/websvr/webserver.go
// go run webserver.go

// go run ../src/websvr/webserver.go
// go build -o ../../bin/ webserver.go

// go mod init voxwebsvr.com/main
// go mod edit -replace voxwebsvr.com/webfs=./webfs
// go mod edit -replace voxwebsvr.com/client=./client
// go mod edit -replace voxwebsvr.com/svr=./svr
// go mod tidy

func main() {

	// for i ,v := range os.Args {
	// 	fmt.Println(i, v)
	// }
	rootPath, err := os.Getwd()
	if err == nil {
		fmt.Println("rootPath: ", rootPath)
	}
	var portStr string = "9090"

	argsLen := len(os.Args)
	fmt.Println("apply gin argsLen: ", argsLen)
	if argsLen > 1 {
		portStr = "" + os.Args[1]
		fmt.Println("init current port: ", portStr)
	}

	fmt.Println("cpus number: ", runtime.NumCPU())
	fmt.Println("Web Server version 1.0.13")
	fmt.Println("Web Server started at port: ", portStr)

	router := gin.Default()
	svr.InitPages(router)
	svr.ApplyStaticFileService(router, "./static")

	router.Run(":" + portStr)
}
