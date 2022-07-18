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

// nohup ./server &
// export PATH=$PATH:/usr/local/go/bin
// go mod init voxwebserver.com/main
// go build -o .\ ..\src\server\server.go
// go build -o ./bin ./src/server/server.go
// go build ../src/server/server.go
// go run ../src/server/server.go
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

var svrRootPath = "."

// var in_4096_buf []byte = make([]byte, 4096)
// 每次 for  循环最多读取 32kb
var maxBufBytesSize float64 = 1024 * 32
var in_bufs [32]*[]byte
var out_bufs [32]*[]byte

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
		file, err := os.Open((*pathStr))
		if err == nil {

			bufSizef64 := calcCeilPowerOfTwo(float64(bytesTotalSize))
			segBufSize := bufSizef64
			if segBufSize > maxBufBytesSize {
				segBufSize = maxBufBytesSize
			}
			readInBufIndex := int32(calcInBufIndex(segBufSize))
			var bufIntSize int64 = int64(segBufSize)
			bufPtr := in_bufs[readInBufIndex]
			if bufPtr == nil {
				tempBuf := make([]byte, bufIntSize)
				bufPtr = &tempBuf
				in_bufs[readInBufIndex] = bufPtr
				fmt.Println("read in -> create new buf(", bufIntSize, "bytes)")
			}

			segSize := bufIntSize
			readInBuf := *bufPtr

			// 存放读取结果
			bufIntSize = int64(bufSizef64)
			readInBufIndex = int32(calcInBufIndex(bufSizef64))
			outBufPtr := out_bufs[readInBufIndex]
			if outBufPtr == nil {
				tempBuf := make([]byte, bufIntSize)
				outBufPtr = &tempBuf
				out_bufs[readInBufIndex] = outBufPtr
				fmt.Println("write out -> create new  buf(", bufIntSize, "bytes)")
			}
			writeOutBuf := *outBufPtr

			// fi, _ := file.Stat()
			// fileBytesTotal := fi.Size()
			defer file.Close()

			rbytesSize := 0

			pos := int64(bytesPosList[0])
			//var buf []byte
			var outPos int = 0
			var segSizeInt = int(segSize)
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
				/*
					// 这样的内存处理过程消耗也不小
					currBytes := readInBuf[:count]
					buf = append(buf, currBytes...)
					//*/
				dst := writeOutBuf[outPos : outPos+count]
				src := readInBuf[:count]
				copy(dst, src)
				if rbytesSize >= bytesTotalSize {
					break
				}
				pos += segSize
				outPos += segSizeInt
			}
			buf := writeOutBuf[:bytesTotalSize]
			wr.Write(buf)
		} else {
			fmt.Println("read in file error.")
			wr.Write(emptyBuf)
		}
	} else {
		fmt.Println("bytes range error.")
		wr.Write(emptyBuf)
	}
}

func wholeFileResponse(w *http.ResponseWriter, pathStr *string) {

	wr := (*w)

	fmt.Println("wholeFileResponse(), pathStr", *pathStr)
	buf, err := ioutil.ReadFile((*pathStr))
	if err != nil {
		fmt.Println("Error: ", err)
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
	buf, err := ioutil.ReadFile((*pathStr))
	if err != nil {
		fmt.Println("Error: ", err)
		fmt.Fprintf(wr, errorTemplate)
	} else {
		contentType := http.DetectContentType(buf)
		header := wr.Header()
		wr.WriteHeader(http.StatusOK)
		header.Set("Content-Type", contentType)
		header.Set("Server", "golang")

		// fmt.Println("gzipResponse(),contentType: ", contentType)

		switch contentType {
		case "image/jpeg":
		case "image/png":
		case "image/gif":
		case "application/octet-stream":
		case "image/x-icon":
			fmt.Println("gzipResponse(), skip gzip.")

			//setContentLength
			header.Set("ContentLength", "10")
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

	pathStr := svrRootPath + r.URL.Path
	fmt.Println("handleRequest pathStr: ", pathStr)
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
func testArray() {
	arr := [5]int{0, 1, 2, 3, 4}
	fmt.Println("arr: ", arr)
	fmt.Println("arr[0]: ", arr[0])
	subArr := arr[:3]
	var refArr = arr[:2]
	fmt.Println("subArr: ", subArr)
	subArr[0] = 11
	fmt.Printf("T01 &arr       : %p\n", &arr)
	fmt.Printf("T01 &subArr    : %p\n", &subArr)
	fmt.Printf("T01 &refArr    : %p\n", &refArr)
	fmt.Printf("T01b &arr[0]   : %p\n", &arr[0])
	fmt.Printf("T01b &subArr[0]: %p\n", &subArr[0])
	fmt.Println("T01 arr: ", arr)
	fmt.Println("T01 subArr: ", subArr)
	arr[0] = 21
	arr[1] = 22
	fmt.Println("T02 arr: ", arr)
	fmt.Println("T02 subArr: ", subArr)
	fmt.Println("T02 refArr: ", refArr)

	var bigArr [10]int

	fmt.Println("bigArr: ", bigArr)
	srcIntArr := []int{1, 2, 3, 4, 5}
	dstIntArr := make([]int, 5)

	fmt.Println("#### ##### ##### ##### ##### ####")
	numberOfElementsCopied := copy(dstIntArr, srcIntArr)
	fmt.Println("numberOfElementsCopied: ", numberOfElementsCopied)
	fmt.Println("A srcIntArr: ", srcIntArr)
	fmt.Println("A dstIntArr: ", dstIntArr)
	srcIntArr[0] = 30
	fmt.Println("B srcIntArr: ", srcIntArr)
	fmt.Println("B dstIntArr: ", dstIntArr)
	src1 := arr[:2]
	dst1 := dstIntArr[:2]
	numberOfElementsCopied = copy(dst1, src1)
	fmt.Println("numberOfElementsCopied: ", numberOfElementsCopied)
	fmt.Println("C srcIntArr: ", srcIntArr)
	fmt.Println("C dstIntArr: ", dstIntArr)

	// copy()
}
func main() {

	// testArray()
	// for i ,v := range os.Args {
	// 	fmt.Println(i, v)
	// }
	rootPath, err := os.Getwd()
	if err == nil {
		//svrRootPath = rootPath
		fmt.Println("rootPath: ", rootPath)
	}
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
