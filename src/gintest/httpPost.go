package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)

func main() {
	urlValues := url.Values{}
	urlValues.Add("name", "zhaofan")
	urlValues.Add("age", "22")
	resp, _ := http.PostForm("http://www.ftt.org/post", urlValues)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(body))
}
