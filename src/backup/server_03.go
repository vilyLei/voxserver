package main

import (
	"os"
	"strconv"

	// "path"
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"strings"

	//"log"
	"path/filepath"
	// "time"
	"bytes"
	"net/http"
)

// go build -o .\ ..\src\server\server.go
// go build -o ./bin ./src/server/server.go
func SetRWriterStatus(w *http.ResponseWriter, code int) {
	(*w).WriteHeader(code)
}
func respApplyCORS(w *http.ResponseWriter) {
	header := (*w).Header()
	header.Set("Access-Control-Allow-Origin", "*")
	// header.Set("Access-Control-Allow-Credentials", "true")
	//header.Set("Access-Control-Allow-Headers", "Range, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	header.Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT")
	/*
		header.Set("Access-Control-Allow-Origin", "*")
		header.Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	*/
	/*
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
	*/
}

var errorTemplate string = `
<!DOCTYPE html>
<html lang="en"><head></head>
<body><p align="center">Error: illegal request !!!</p></body>
`

func gzipit(source, target string) error {
	reader, err := os.Open(source)
	if err != nil {
		return err
	}

	filename := filepath.Base(source)
	target = filepath.Join(target, fmt.Sprintf("%s.gz", filename))
	writer, err := os.Create(target)
	if err != nil {
		return err
	}
	defer writer.Close()

	archiver := gzip.NewWriter(writer)
	archiver.Name = filename
	defer archiver.Close()

	_, err = io.Copy(archiver, reader)
	return err
}
func commonResponse(w *http.ResponseWriter, pathStr *string, bytesPosList []int) {

	wr := (*w)
	fmt.Println("commonResponse() pathStr", *pathStr)
	fmt.Println("commonResponse() bytesPosList", bytesPosList)

	if len(bytesPosList) > 0 {

		fmt.Println("commonResponse() read file some bytes.")
		/*
			buf, err := ioutil.ReadFile("." + (*pathStr))
			if err != nil {
				// log.Fatal(err)
				fmt.Println("Error: ", err)
				// fmt.Fprintf(w, "Error: illegal request !!!");
				fmt.Fprintf(wr, errorTemplate)
			} else {

				contentType := http.DetectContentType(buf)
				header := wr.Header()
				header.Set("Content-Type", contentType)
				wr.Write(buf)
			}
		//*/
		bytesTotalSize := bytesPosList[1] - bytesPosList[0]
		header := wr.Header()
		header.Set("Content-Type", "application/octet-stream")
		if bytesTotalSize > 0 {
			file, _ := os.Open("." + (*pathStr))
			defer file.Close()
			rbytesSize := 0
			var segSize int64 = 1024
			var pos int64
			pos = int64(bytesPosList[0])
			// 字节切片缓存 存放每次读取的字节
			readBuf := make([]byte, segSize)
			// 该字节切片用于存放文件所有字节
			var buf []byte
			for {
				count, err := file.ReadAt(readBuf, pos)
				if err == io.EOF {
					break
				}
				size := count + rbytesSize
				if size > bytesTotalSize {
					count -= (size - bytesTotalSize)
				}
				rbytesSize += count
				currBytes := readBuf[:count]
				buf = append(buf, currBytes...)
				if rbytesSize >= bytesTotalSize {
					break
				}
				pos += segSize
			}
			wr.Write(buf)
		} else {
			var buf []byte
			wr.Write(buf)
		}
		/*
			file, _ := os.Open("." + (*pathStr))
			header := wr.Header()
			header.Set("Content-Type", "application/octet-stream")
			defer file.Close()
			// 字节切片缓存 存放每次读取的字节
			readBuf := make([]byte, 1024)
			// 该字节切片用于存放文件所有字节
			var buf []byte
			for {
				count, err := file.Read(readBuf)
				if err == io.EOF {
					break
				}
				currBytes := readBuf[:count]
				buf = append(buf, currBytes...)
				break
			}
			wr.Write(buf)
			//*/
	} else {

		fmt.Println("commonResponse() read file all bytes.")
		buf, err := ioutil.ReadFile("." + (*pathStr))
		if err != nil {
			// log.Fatal(err)
			fmt.Println("Error: ", err)
			// fmt.Fprintf(w, "Error: illegal request !!!");
			fmt.Fprintf(wr, errorTemplate)
		} else {

			contentType := http.DetectContentType(buf)
			header := wr.Header()
			header.Set("Content-Type", contentType)
			wr.Write(buf)
		}
	}
}
func gzipResponse(w *http.ResponseWriter, pathStr *string) {

	wr := (*w)
	fmt.Println("pathStr", *pathStr)
	buf, err := ioutil.ReadFile("." + (*pathStr))
	if err != nil {
		// log.Fatal(err)
		fmt.Println("Error: ", err)
		// fmt.Fprintf(w, "Error: illegal request !!!");
		fmt.Fprintf(wr, errorTemplate)
	} else {
		contentType := http.DetectContentType(buf)
		// fmt.Println("contentType: ", contentType)
		header := wr.Header()
		header.Set("Content-Type", contentType)

		// header.Set("Accept-Encoding", "gzip,deflate")
		header.Set("Content-encoding", "gzip")
		header.Set("Server", "golang")
		header.Set("Vary", "Accept-Encoding")
		var zBuf bytes.Buffer
		zw := gzip.NewWriter(&zBuf)
		if _, err = zw.Write(buf); err != nil {
			fmt.Println("gzip is faild,err:", err)
		}
		zw.Close()
		wr.Write(zBuf.Bytes())
	}
}
func handleRequest(w http.ResponseWriter, r *http.Request) {

	respApplyCORS(&w)
	if r.Method == "OPTIONS" {
		// fmt.Fprintf(w, errorTemplate)
		fmt.Println("exec CORS OPTIONS Method, http.StatusNoContent: ", http.StatusNoContent)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	var rHeader = r.Header
	for k := range rHeader {
		fmt.Println("rHeader[", k, "]: ", rHeader[k])
	}
	// if k, v := rHeader["key1"]; v {
	// if _, v := rHeader["key1"]; v {
	// var k [4]int
	// var s1 = [2]string{"hello", "world"}
	hasRange := false
	var rangeList []string

	if _, v := rHeader["Range"]; v {
		hasRange = true
		fmt.Println("rHeader[Range]: ", rHeader["Range"], len(rHeader["Range"]))
		rangeList = rHeader["Range"]
		fmt.Println("rHeader has Range key")
	} else {
		// rangeList = []string{}
		hasRange = false
		fmt.Println("rHeader has not Range")
	}
	var bytesPosList []int
	rangeListSize := len(rangeList)
	if rangeListSize > 0 {
		fmt.Println("rHeader has bytes Range data")
		for index, value := range rangeList {
			// bytesPosList = append(bytesPosList, index)
			posList := strings.Split(value, "=")
			if posList[0] == "bytes" && len(posList) == 2 {
				posList := strings.Split(posList[1], "-")
				fmt.Println("rHeader posList: ", posList)
				if len(posList) == 2 {
					num0, _ := strconv.Atoi(posList[0])
					num1, _ := strconv.Atoi(posList[1])
					bytesPosList = append(bytesPosList, num0, num1)
					// bytesPosList = append(bytesPosList, num1)
					fmt.Println("rHeader Range data: ", index, ":", value, ",num0, num1: ", num0, num1)
					break
				}
			}
		}
		fmt.Println("rHeader bytesPosList: ", bytesPosList)
	}
	r.ParseForm()       // parse some parameters, the default parsing process do not exec
	fmt.Println(r.Form) // print the client req info
	fmt.Println("handleRequest() req path", r.URL.Path)
	fmt.Println("scheme", r.URL.Scheme)
	fmt.Println(r.Form["url_long"])
	for k, v := range r.Form {
		fmt.Println("key:", k)
		fmt.Println("val:", strings.Join(v, ""))
	}
	pathStr := r.URL.Path
	if hasRange {
		commonResponse(&w, &pathStr, bytesPosList)
	} else {
		gzipResponse(&w, &pathStr)
	}

}
func main() {

	// for i ,v := range os.Args {
	// 	fmt.Println(i, v)
	// }
	var portStr string = "9090"
	argsLen := len(os.Args)
	// fmt.Println("argsLen: ", argsLen)
	if argsLen > 1 {
		portStr = "" + os.Args[1]
		fmt.Println("init current port: ", portStr)
	}
	handler := http.HandlerFunc(handleRequest)

	http.Handle("/static/", handler)

	fmt.Println("Web Server started at port: ", portStr)
	http.ListenAndServe(":"+portStr, nil)
}
