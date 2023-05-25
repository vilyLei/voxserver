package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"
)

type ModelInfoNode struct {
	Id  string `json:"id"`
	Url string `json:"url"`
}
type ModelInfo struct {
	Models []ModelInfoNode `json:"models"`
}

// loader_channel := make(chan int, 2)
var loader_channel chan int

func loadAFileWithURL(out chan<- int) bool {
	imgUrl := "http://www.artvily.com/static/assets/color_023.jpg"

	// Get the data
	resp, loadErr := http.Get(imgUrl)
	if loadErr != nil {
		fmt.Printf("load a file failed, loadErr: %v\n", loadErr)
		// panic(loadErr)

		out <- 0
		return false
	}
	defer resp.Body.Close()

	data, wErr := ioutil.ReadAll(resp.Body)
	if wErr != nil {
		fmt.Printf("write a file failed,wErr: %v\n", wErr)

		out <- 0
		// panic(wErr)
		return false
	}
	if len(data) < 300 {
		fmt.Println("data: ", data)
		fmt.Println("data len: ", len(data))
		str := string(data)
		fmt.Println("data to str: ", str)
		strI := strings.Index(str, "Error:")
		fmt.Println("strI: ", strI)
		if strI > 0 {
			out <- 0
			panic("load error")
			return false
		}
	}
	ioutil.WriteFile("color_023.jpg", data, 0777)

	fmt.Println("load a remote file success !!!")
	out <- 1
	return true
}

// loadFileFromJson01
func main() {
	fmt.Println("sys init ...")

	pathStr := "./modelData1.json"
	jsonFile, err := os.OpenFile(pathStr, os.O_RDONLY, os.ModeDevice)
	if err == nil {
		defer jsonFile.Close()
		fi, _ := jsonFile.Stat()
		fileBytesTotal := int(fi.Size())
		fmt.Println("fileBytesTotal: ", fileBytesTotal)

		jsonValue, _ := ioutil.ReadAll(jsonFile)

		var modelInfo ModelInfo
		json.Unmarshal([]byte(jsonValue), &modelInfo)

		models := modelInfo.Models
		modelsTotal := len(models)
		fmt.Println("modelsTotal: ", modelsTotal)
		for i := 0; i < modelsTotal; i++ {
			model := models[i]
			fmt.Println("model.Url: ", model.Url)
		}
	}
	loader_channel = make(chan int, 2)

	go loadAFileWithURL(loader_channel)

	for flag := range loader_channel {
		len := len(loader_channel)
		if len == 0 {
			fmt.Println("loader_channel flag: ", flag)
			close(loader_channel)
		}
	}

	fmt.Println("loading finish ...")
	time.Sleep(1 * time.Second)
	fmt.Println("sys end ...")

}
