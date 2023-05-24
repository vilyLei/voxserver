package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

type ModelInfoNode struct {
	Id  string `json:"id"`
	Url string `json:"url"`
}
type ModelInfo struct {
	Models []ModelInfoNode `json:"models"`
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

		// total := 0
		models := modelInfo.Models
		modelsTotal := len(models)
		fmt.Println("modelsTotal: ", modelsTotal)
		for i := 0; i < modelsTotal; i++ {
			model := models[i]
			fmt.Println("model.Url: ", model.Url)
		}
	}
	imgUrl := "http://www.artvily.com/static/assets/color_02.jpg"

	// Get the data
	resp, loadErr := http.Get(imgUrl)
	if loadErr != nil {
		fmt.Printf("load a file failed, loadErr: %v\n", loadErr)
		panic(loadErr)
	}
	defer resp.Body.Close()

	data, wErr := ioutil.ReadAll(resp.Body)
	if wErr != nil {
		fmt.Printf("write a file failed,wErr: %v\n", wErr)
		panic(wErr)
	}
	ioutil.WriteFile("color_02.jpg", data, 0777)
	fmt.Println("sys end ...")

}
