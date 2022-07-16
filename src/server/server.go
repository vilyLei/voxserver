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
func rangeFileResponse(w *http.ResponseWriter, pathStr *string, bytesPosList []int) {

	wr := (*w)

	fmt.Println("rangeFileResponse(), pathStr", *pathStr)
	bytesTotalSize := bytesPosList[1] - bytesPosList[0]
	header := wr.Header()
	header.Set("Content-Type", "application/octet-stream")
	header.Set("Server", "golang")
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
		/*
			gzipFlag := true
			if gzipFlag {

				header.Set("Content-encoding", "gzip")
				header.Set("Vary", "Accept-Encoding")
				fmt.Println("rangeFileResponse(), gzip yes.")
				var zBuf bytes.Buffer
				zw := gzip.NewWriter(&zBuf)
				if _, gzerr := zw.Write(buf); gzerr != nil {
					fmt.Println("gzip is faild,err:", gzerr)
				}
				zw.Close()
				wr.Write(zBuf.Bytes())
			} else {
				fmt.Println("rangeFileResponse(), gzip no.")
				wr.Write(buf)
			}
			//*/
	} else {
		var buf []byte
		wr.Write(buf)
	}
}

func wholeFileResponse(w *http.ResponseWriter, pathStr *string) {

	wr := (*w)

	fmt.Println("wholeFileResponse(), pathStr", *pathStr)
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
		header.Set("Server", "golang")

		wr.Write(buf)
	}
}
func gzipResponse(w *http.ResponseWriter, pathStr *string) {

	wr := (*w)
	fmt.Println("gzipResponse(), pathStr", *pathStr)
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
		header.Set("Server", "golang")

		fmt.Println("gzipResponse(),contentType: ", contentType)

		switch contentType {
		case "image/jpeg":
		case "image/png":
		case "image/gif":
		case "application/octet-stream":
			fmt.Println("gzipResponse(), skip gzip.")
			wr.Write(buf)
			return
		default:
			fmt.Println("gzipResponse(), does gzip.")
			break
		}
		// header.Set("Accept-Encoding", "gzip,deflate")
		header.Set("Content-encoding", "gzip")
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
		w.WriteHeader(http.StatusNoContent)
		return
	}

	pathStr := r.URL.Path

	var rHeader = r.Header
	hasRange := false
	var rangeList []string
	rangeListSize := 0
	if _, v := rHeader["Range"]; v {
		hasRange = true
		rangeList = rHeader["Range"]
		rangeListSize = len(rangeList)
	}

	var bytesPosList []int
	if rangeListSize > 0 {
		fmt.Println("rHeader has bytes Range data")
		for index, value := range rangeList {
			posList := strings.Split(value, "=")
			if posList[0] == "bytes" && len(posList) == 2 {
				posList := strings.Split(posList[1], "-")
				fmt.Println("rHeader posList: ", posList)
				if len(posList) == 2 {
					num0, _ := strconv.Atoi(posList[0])
					num1, _ := strconv.Atoi(posList[1])
					bytesPosList = append(bytesPosList, num0, num1)
					fmt.Println("rHeader Range data: ", index, ":", value, ",num0, num1: ", num0, num1)
					break
				}
			}
		}
		fmt.Println("rHeader bytesPosList: ", bytesPosList)
		rangeFileResponse(&w, &pathStr, bytesPosList)
		return
	}

	if hasRange {
		wholeFileResponse(&w, &pathStr)
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
