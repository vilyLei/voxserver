package main

import (
	"os"
	"strconv"

	// "path"
	"compress/gzip"
	"fmt"
	"io"
	"io/fs"
	"io/ioutil"
	"strings"

	//"log"
	"bytes"
	"math"
	"net/http"
	"path/filepath"
	"time"
)

// strconv.Itoa
// nohup ./webserver &
// export PATH=$PATH:/usr/local/go/bin
// go mod init voxwebserver.com/main
// go build -o .\ ..\src\server\webserver.go
// go build -o ./bin ./src/server/webserver.go
// go build ../src/server/webserver.go
// go run ../src/server/webserver.go

func SetRWriterStatus(w *http.ResponseWriter, code int) {
	(*w).WriteHeader(code)
}
func testCORS(w *http.ResponseWriter, r *http.Request) bool {
	header := (*w).Header()
	header.Set("Access-Control-Allow-Origin", "*")
	// header.Set("Access-Control-Allow-Credentials", "true")
	//header.Set("Access-Control-Allow-Headers", "Range, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	header.Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT")
	if r.Method == "OPTIONS" {
		(*w).WriteHeader(http.StatusNoContent)
		return false
	}
	return true
}

var unixEpochTime = time.Unix(0, 0)

func isZeroTime(t time.Time) bool {
	return t.IsZero() || t.Equal(unixEpochTime)
}
func setLastModified(w http.ResponseWriter, modtime time.Time) {
	if !isZeroTime(modtime) {
		w.Header().Set("Last-Modified", modtime.UTC().Format(http.TimeFormat))
	}
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

var emptyBuf []byte

var svrRootPath = "."

// 每次 for 循环最多读取 128 kb bytes
var maxSegBufSize float64 = 1024 * 128

var maxBytesSize int = 1024 * 1024 * 128

var in_bufs [32]*[]byte
var out_bufs [32]*[]byte

func readFileBySteps(pathStr *string, beginPos int, endPos int) (*[]byte, int, *fs.FileInfo) {

	// fmt.Println("readFileBySteps(), pathStr", *pathStr)

	if beginPos < 0 {
		beginPos = 0
	}
	bytesTotalSize := endPos - beginPos

	sendBuf := emptyBuf
	sendSize := 0
	var fiPtr *fs.FileInfo = nil
	if bytesTotalSize > 0 {
		file, err := os.Open((*pathStr))
		if err == nil {

			fi, _ := file.Stat()
			fiPtr = &fi
			fileBytesTotal := int(fi.Size())
			if endPos > fileBytesTotal {
				endPos = fileBytesTotal
				bytesTotalSize = endPos - beginPos
			}
			if bytesTotalSize < 0 {
				return &emptyBuf, sendSize, fiPtr
			}
			// fmt.Println("readFileBySteps(), beginPos:", beginPos, ", endPos", endPos, ",fileBytesTotal: ", fileBytesTotal, ",bytesTotalSize: ", bytesTotalSize)

			bufSizef64 := calcCeilPowerOfTwo(float64(bytesTotalSize))
			segBufSize := bufSizef64
			if segBufSize > maxSegBufSize {
				segBufSize = maxSegBufSize
			}
			readInBufIndex := int32(calcInBufIndex(segBufSize))
			var bufIntSize int64 = int64(segBufSize)
			bufPtr := in_bufs[readInBufIndex]
			if bufPtr == nil {
				tempBuf := make([]byte, bufIntSize)
				bufPtr = &tempBuf
				in_bufs[readInBufIndex] = bufPtr
				// fmt.Println("read in -> create new buf(", bufIntSize, "bytes)")
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
				// fmt.Println("write out -> create new  buf(", bufIntSize, "bytes)")
			}
			writeOutBuf := *outBufPtr

			defer file.Close()

			rbytesSize := 0

			pos := int64(beginPos)

			var outPos int = 0
			var segSizeInt = int(segSize)
			for {
				count, err := file.ReadAt(readInBuf, pos)
				size := count + rbytesSize
				if size > bytesTotalSize {
					count -= (size - bytesTotalSize)
				}
				dst := writeOutBuf[outPos : outPos+count]
				src := readInBuf[:count]
				copy(dst, src)
				if err == io.EOF {
					fmt.Println("read in EOF error.")
					break
				}
				rbytesSize += count
				if rbytesSize >= bytesTotalSize {
					break
				}
				pos += segSize
				outPos += segSizeInt
			}
			sendBuf = writeOutBuf[:bytesTotalSize]
			sendSize = len(sendBuf)
		} else {
			fmt.Println("read in file error.")
		}
	} else {
		fmt.Println("bytes range error.")
	}
	return &sendBuf, sendSize, fiPtr

}

func rangeFileResponse(w *http.ResponseWriter, pathStr *string, bytesPosList []int) {

	// fmt.Println("rangeFileResponse(), pathStr", *pathStr)
	beginPos := bytesPosList[0]
	endPos := bytesPosList[1]

	// endPos = maxBytesSize

	bufPtr, bufSize, fiPtr := readFileBySteps(pathStr, beginPos, endPos)
	sendBytesBuf(w, bufPtr, bufSize, fiPtr)
}
func sendBytesBuf(w *http.ResponseWriter, sendBuf *[]byte, sendSize int, fiPtr *fs.FileInfo) {

	wr := (*w)
	if fiPtr != nil {
		setLastModified(wr, (*fiPtr).ModTime())
	}
	header := wr.Header()
	header.Set("Content-Type", "application/octet-stream")
	header.Set("Server", "golang")
	header.Set("Accept-Ranges", "bytes")
	header.Set("Content-Length", strconv.Itoa(sendSize))

	wr.WriteHeader(http.StatusOK)
	wr.Write((*sendBuf))
}
func gzipResponse(w *http.ResponseWriter, pathStr *string) {

	wr := (*w)
	// fmt.Println("gzipResponse(), pathStr", *pathStr)
	buf, err := ioutil.ReadFile((*pathStr))
	if err != nil {
		fmt.Println("Error: ", err)
		fmt.Fprintf(wr, errorTemplate)
	} else {
		fi, err := os.Stat(*pathStr)
		if err == nil {
			setLastModified(wr, fi.ModTime())
		}
		sendSize := len(buf)
		// fmt.Println("gzipResponse(), file sendSize: ", sendSize)
		contentType := http.DetectContentType(buf)
		header := wr.Header()
		// if strings.Contains(contentType, "text/plain") {
		// 	contentType = "application/json"
		// }

		header.Set("Content-Type", contentType)
		header.Set("Server", "golang")

		var sendBuf []byte = buf
		fmt.Println("gzipResponse(),contentType: ", contentType)

		switch contentType {
		case "image/jpeg", "image/png", "image/gif", "application/octet-stream", "image/x-icon":
			// fmt.Println("gzipResponse(), skip gzip, sendSize: ", sendSize)
			if header.Get("Content-Encoding") == "" {
				header.Set("Content-Length", strconv.Itoa(sendSize))
			}
		default:
			var zBuf bytes.Buffer
			zw := gzip.NewWriter(&zBuf)

			if _, err = zw.Write(buf); err != nil {
				fmt.Println("gzip is faild,err:", err)
				header.Set("Content-Length", strconv.Itoa(sendSize))
				zw.Close()
			} else {
				zw.Close()
				sendBuf = zBuf.Bytes()
				sendSize = len(sendBuf)

				fmt.Println("gzipResponse(), does gzip, sendSize: ", len(sendBuf))

				header.Set("Accept-Encoding", "gzip,deflate")
				header.Set("Vary", "Accept-Encoding")
				header.Set("Content-encoding", "gzip")

				header.Set("Content-Length", strconv.Itoa(sendSize))

				// for k, v := range header {
				// 	fmt.Println("	header[", k, "]: ", v)
				// }
			}
		}

		wr.WriteHeader(http.StatusOK)
		wr.Write(sendBuf)
	}
}
func handleRequest(w http.ResponseWriter, r *http.Request) {
	if !testCORS(&w, r) {
		return
	}
	pathStr := svrRootPath + r.URL.Path
	// fmt.Println("handleRequest pathStr: ", pathStr)
	var rHeader = r.Header
	var rangeList []string
	rangeListSize := 0
	if _, v := rHeader["Range"]; v {
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
		gzipResponse(&w, &pathStr)
	}

}
func main() {

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
