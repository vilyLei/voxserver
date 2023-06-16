package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

func getAllFilesInDirAndSubDir(dir string) {

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			fmt.Println(path)
		}
		return nil
	})
	if err != nil {
		// panic(err)
	}
}
func getAllFilesInCurrDir(dir string) {

	files, err := ioutil.ReadDir(dir)
	if err != nil {
		panic(err)
	}
	for _, file := range files {
		if !file.IsDir() {
			fmt.Println(file.Name())
		}
	}
}
func GetAllFilesNamesInCurrDir(dir string) []string {

	// names := make([]string, 0)
	var names []string
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return names
	}
	for _, file := range files {
		if !file.IsDir() {
			// fmt.Println(file.Name())
			names = append(names, file.Name())
		}
	}
	return names
}
func HasPicFileInCurrDir(dir string) (bool, []string) {
	// names := make([]string, 0)
	var names []string = GetAllFilesNamesInCurrDir(dir)
	flag := false
	var picNames []string

	for _, ns := range names {
		parts := strings.Split(ns, ".")
		pns := parts[len(parts)-1]
		pns = strings.ToLower(pns)
		fmt.Println("pns: ", pns)
		switch pns {
		case "jpg", "jpeg", "png":
			picNames = append(picNames, ns)
			flag = true
		}
	}
	return flag, picNames
}
func main() {
	fmt.Println("init ...")
	rootDir, errOGT := os.Getwd()
	if errOGT != nil {
		fmt.Println("os.Getwd(), errOGT: %v", errOGT)
	}
	fmt.Println("rootDir: ", rootDir)
	// getAllFilesInDirAndSubDir(rootDir)
	// getAllFilesInCurrDir(rootDir)
	// fnames := GetAllFilesNamesInCurrDir(rootDir)
	flag, picNames := HasPicFileInCurrDir(rootDir)
	fmt.Println("flag: ", flag)
	fmt.Println("picNames: ", picNames)

	fmt.Println("end ...")
}
