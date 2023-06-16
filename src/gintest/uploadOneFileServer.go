package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type ReqDef struct {
	Success  bool   `json:"success,string"`
	Status   int16  `json:"status,string"`
	FileName string `json:"fileName"`
	UUID     string `json:"-"` //忽略输出
}

func main() {
	rootDir, errOGT := os.Getwd()
	if errOGT != nil {
		fmt.Println("os.Getwd(), errOGT: %v", errOGT)
	}
	fmt.Println("rootDir: ", rootDir)

	argsLen := len(os.Args)
	// fmt.Println("argsLen: ", argsLen)
	var portStr = "9090"
	if argsLen > 1 {
		portStr = "" + os.Args[1]
		fmt.Println("portStr: ", portStr)
	}
	// var reqd1 ReqDef
	// reqd1.success = true
	// reqd1.fileName = "jj.jpg"
	reqd1 := ReqDef{
		true,
		12,
		"ll.jpg",
		"001",
	}
	jsonBytes, err := json.Marshal(reqd1)
	if err != nil {
		fmt.Println("error:", err)
	}
	jsonStr := string(jsonBytes)
	fmt.Println("jsonStr: \n", jsonStr)
	fmt.Println("server init...")
	router := gin.Default()
	router.Static("/static", "./static")
	// 为 multipart forms 设置较低的内存限制 (默认是 32 MiB)
	router.MaxMultipartMemory = 8 << 20 // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// 单文件
		file, _ := c.FormFile("file")
		log.Println(file.Filename)

		dst := "./uploadFiles/" + file.Filename
		// 上传文件至指定的完整文件路径
		c.SaveUploadedFile(file, dst)

		var reqd ReqDef
		reqd.Success = true
		reqd.FileName = file.Filename
		reqd.Status = 22
		jsonBytes, err := json.Marshal(reqd)
		if err != nil {
			fmt.Println("error:", err)
		}
		jsonStr := string(jsonBytes)
		// c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
		c.String(http.StatusOK, fmt.Sprintf("%s", jsonStr))
	})
	router.Run(":" + portStr)
}
