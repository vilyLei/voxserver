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
	"math"
	"net/http"
)

// go mod init voxwebserver.com/main
// go build -o .\ ..\src\server\server.go
// go build -o ./bin ./src/server/server.go
// go build ../src/server/server.go
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

var Math_LN2 float64 = 0.6931471805599453

func calcCeilPowerOfTwo(value float64) float64 {
	return math.Pow(2, math.Ceil(math.Log(value)/math.Ln2))
}
func calcInBufIndex(po2 float64) float64 {
	return math.Log(po2) / math.Ln2
}

// var segSize int64 = 4096
var emptyBuf []byte

// var in_4096_buf []byte = make([]byte, 4096)
var in_bufs [32]*[]byte

func rangeFileResponse(w *http.ResponseWriter, pathStr *string, bytesPosList []int) {

	wr := (*w)

	// fmt.Println("rangeFileResponse(), pathStr", *pathStr)
	beginPos := bytesPosList[0]
	endPos := bytesPosList[1]
	bytesTotalSize := endPos - beginPos

	header := wr.Header()
	header.Set("Content-Type", "application/octet-stream")
	header.Set("Server", "golang")
	if bytesTotalSize > 0 {
		file, err := os.Open("." + (*pathStr))
		if err == nil {

			bufSizef64 := calcCeilPowerOfTwo(float64(bytesTotalSize))
			readInBufIndex := int32(calcInBufIndex(bufSizef64))
			var bufIntSize int64 = int64(bufSizef64)
			bufPtr := in_bufs[readInBufIndex]
			if bufPtr == nil {
				tempBuf := make([]byte, bufIntSize)
				bufPtr = &tempBuf
				in_bufs[readInBufIndex] = bufPtr
				fmt.Println("create new read in buf(", bufIntSize, "bytes)")
			}
			// else {
			// 	fmt.Println("use old read in buf ")
			// }
			segSize := bufIntSize
			readInBuf := *bufPtr

			// readInBuf := make([]byte, bufIntSize)

			// fi, _ := file.Stat()
			// fileBytesTotal := fi.Size()
			// fmt.Println("rangeFileResponse(),file bytes total: ", fileBytesTotal, " read bytes total: ", bytesTotalSize, bufIntSize, ",index:", readInBufIndex)
			defer file.Close()

			rbytesSize := 0

			pos := int64(bytesPosList[0])
			// TODO(VILY): 需要优化，不能每次调用都创建这样一个内存块。但是这里要考虑并行或并发的问题。目前这样用无法解决并行问题。
			//readBuf := readInBuf

			var buf []byte
			for {
				count, err := file.ReadAt(readInBuf, pos)
				if err == io.EOF {
					break
				}
				size := count + rbytesSize
				if size > bytesTotalSize {
					count -= (size - bytesTotalSize)
				}
				rbytesSize += count
				// 这样的内存处理过程消耗也不小
				currBytes := readInBuf[:count]
				buf = append(buf, currBytes...)
				if rbytesSize >= bytesTotalSize {
					break
				}
				pos += segSize
			}
			if len(buf) != bytesTotalSize {
				fmt.Println("read in range bytes error.")
			}
			wr.Write(buf)
			return
		}
	}
	wr.Write(emptyBuf)
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
		// fmt.Println("rHeader has bytes Range data")
		for _, value := range rangeList {
			posList := strings.Split(value, "=")
			if posList[0] == "bytes" && len(posList) == 2 {
				posList := strings.Split(posList[1], "-")
				// fmt.Println("rHeader posList: ", posList)
				if len(posList) == 2 {
					num0, _ := strconv.Atoi(posList[0])
					num1, _ := strconv.Atoi(posList[1])
					bytesPosList = append(bytesPosList, num0, num1)
					// fmt.Println("rHeader Range data: ", index, ":", value, ",num0, num1: ", num0, num1)
					break
				}
			}
		}
		// fmt.Println("rHeader bytesPosList: ", bytesPosList)
		rangeFileResponse(&w, &pathStr, bytesPosList)
	} else {
		if hasRange {
			wholeFileResponse(&w, &pathStr)
		} else {
			gzipResponse(&w, &pathStr)
		}
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
