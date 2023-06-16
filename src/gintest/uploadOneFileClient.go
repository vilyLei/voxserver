package main

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
)

func postFileToResSvr(filename string, targetUrl string) error {
	bodyBuf := &bytes.Buffer{}
	bodyWriter := multipart.NewWriter(bodyBuf)

	// this step is very important
	fileWriter, err := bodyWriter.CreateFormFile("file", filename)
	if err != nil {
		fmt.Println("error writing to buffer")
		return err
	}

	// open file handle
	fh, err := os.Open(filename)
	if err != nil {
		fmt.Println("error opening file")
		return err
	}
	defer fh.Close()

	//iocopy
	_, err = io.Copy(fileWriter, fh)
	if err != nil {
		return err
	}

	contentType := bodyWriter.FormDataContentType()
	bodyWriter.Close()

	resp, err := http.Post(targetUrl, contentType, bodyBuf)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	resp_body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	fmt.Println("resp.Status: ", resp.Status)
	fmt.Println("string(resp_body): ", string(resp_body))
	return nil
}

// sample usage
func main() {
	target_url := "http://localhost:9090/upload"
	target_url = "http://localhost:9093/upload"

	filename := "./assets/config.json"
	filename = "./assets/wa01.jpg"
	postFileToResSvr(filename, target_url)
}

/*
package main

import (
	"bytes"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
)

func main() {
	fmt.Println("uploadFileClient init ...")
	filePath := "assets/config.json"
	file, err := os.Open(filePath)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// 创建一个 multipart 编写器
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	// 添加文件
	part, err := writer.CreateFormFile("file", filePath)
	if err != nil {
		panic(err)
	}
	_, err = io.Copy(part, file)
	if err != nil {
		panic(err)
	}

	// 关闭编写器
	writer.Close()

	// 创建一个 POST 请求
	req, err := http.NewRequest("POST", "<http://localhost:9090/upload>", &requestBody)
	if err != nil {
		panic(err)
	}

	// 设置请求头
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// 发送请求
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	// 打印响应结果
	fmt.Println(resp.Status)
	fmt.Println("uploadFileClient end ...")
}
//*/
