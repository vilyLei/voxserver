package main

import (
	"fmt"
	"regexp"
	"strings"
)

var nonLetterAndNumber = regexp.MustCompile(`[^a-zA-Z0-9 ]+`)

func getFirstKeyStr(str string) string {
	keyWords := strings.Fields(str)
	fmt.Println("keyWords: ", keyWords)
	if len(keyWords) > 0 && len(keyWords[0]) > 0 {
		keyWord := strings.ToLower(keyWords[0])
		fmt.Println("keyWord A: ", keyWord)

		keyWord = nonLetterAndNumber.ReplaceAllString(keyWord, "")
		fmt.Println("keyWord B: ", keyWord)
		return keyWord
	}
	return ""
}
func main() {
	fmt.Println("sys init ...")
	url := "/toolS"
	keyWords := strings.Fields(url)
	fmt.Println("keyWords: ", keyWords)
	if len(keyWords) > 0 && len(keyWords[0]) > 0 {
		keyWord := strings.ToLower(keyWords[0])
		fmt.Println("keyWord A: ", keyWord)

		keyWord = nonLetterAndNumber.ReplaceAllString(keyWord, "")
		fmt.Println("keyWord B: ", keyWord)
	}

	fmt.Println("sys end ...")
}
