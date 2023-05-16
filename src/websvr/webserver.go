package main

import (
	"os"
	"runtime"

	"fmt"

	"github.com/gin-gonic/gin"
	"voxwebsvr.com/database"
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
// go mod edit -replace voxwebsvr.com/database=./database
// go mod tidy

func main() {
	// thanks: https://gin-gonic.com/docs/examples/serving-static-files/
	// router.Static("/static", "./static")
	// router.StaticFS("/more_static", http.Dir("common_file_system"))
	// router.StaticFile("/favicon.ico", "./resources/favicon.ico")
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

	fmt.Println("init database sys ...")
	dbErr := database.InitWebPageStatusDB()
	if dbErr != nil {
		fmt.Printf("database sys init failed,err%v\n", err)
	}
	fmt.Println("init database sys success !!!")
	database.QuerySitePageReqCountByID(1)
	// database.UpdateSitePageReqCountByID(1, 1)

	router := gin.Default()
	svr.InitPages(router)
	svr.ApplyStaticFileService(router, "./static")
	// router.StaticFile("/favicon.ico", "./static/favicon.ico")

	router.Run(":" + portStr)

}
