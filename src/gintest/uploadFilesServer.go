package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type ReqDef struct {
	Success  bool   `json:"success,string"`
	Status   int16  `json:"status,string"`
	FileName string `json:"fileName"`
	UUID     string `json:"-"` //忽略输出
}

// thanks: https://codevoweb.com/how-to-upload-single-and-multiple-files-in-golang/
// thanks: https://freshman.tech/file-upload-golang/
func uploadSingleFileTest(ctx *gin.Context) {
	file, header, err := ctx.Request.FormFile("image")
	if err != nil {
		ctx.String(http.StatusBadRequest, fmt.Sprintf("file err : %s", err.Error()))
		return
	}

	fileExt := filepath.Ext(header.Filename)
	originalFileName := strings.TrimSuffix(filepath.Base(header.Filename), filepath.Ext(header.Filename))
	now := time.Now()
	filename := strings.ReplaceAll(strings.ToLower(originalFileName), " ", "-") + "-" + fmt.Sprintf("%v", now.Unix()) + fileExt
	filePath := "http://localhost:8000/images/single/" + filename

	out, err := os.Create("public/single/" + filename)
	if err != nil {
		log.Fatal(err)
	}
	defer out.Close()
	_, err = io.Copy(out, file)
	if err != nil {
		log.Fatal(err)
	}
	ctx.JSON(http.StatusOK, gin.H{"filepath": filePath})
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

		for fileKey := range form.File {
			fmt.Println("upload File fileKey:", fileKey)
		}
		files := form.File["files"]

		log.Println("files.length: ", len(files))
		for _, file := range files {
			log.Println(file.Filename)
			// fmt.Printf("upload a file: %s", file.Filename)
			dst := "./server/upload/" + file.Filename
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
	router.Run(":9091")
}
