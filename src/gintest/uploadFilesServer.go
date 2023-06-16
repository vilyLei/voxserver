package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ReqDef struct {
	Success  bool   `json:"success,string"`
	Status   int16  `json:"status,string"`
	FileName string `json:"fileName"`
	UUID     string `json:"-"` //忽略输出
}

func main() {

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

	// router := gin.Default()
	router := gin.New()
	router.Static("/static", "./static")
	// 为 multipart forms 设置较低的内存限制 (默认是 32 MiB)
	router.MaxMultipartMemory = 8 << 20 // 8 MiB
	router.POST("/upload", func(c *gin.Context) {

		// Multipart form
		form, _ := c.MultipartForm()
		files := form.File["files"]

		log.Println("files.length: ", len(files))
		for _, file := range files {
			log.Println(file.Filename)
			// fmt.Printf("upload a file: %s", file.Filename)
			dst := "./" + file.Filename
			// 上传文件至指定目录
			c.SaveUploadedFile(file, dst)
		}

		var reqd ReqDef
		reqd.Success = true
		reqd.FileName = "file.name"
		reqd.Status = 22
		jsonBytes, err := json.Marshal(reqd)
		if err != nil {
			fmt.Println("error:", err)
		}
		jsonStr := string(jsonBytes)
		c.String(http.StatusOK, fmt.Sprintf("%s", jsonStr))
	})
	router.Run(":9090")
}
