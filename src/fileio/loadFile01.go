package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	fmt.Println("sys init ...")
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
