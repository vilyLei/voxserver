package webfs

import (
	"os"

	// "path"

	"fmt"
	"io"
	"io/fs"

	//"log"

	"math"
)

// go mod init voxwebsvr.com/webfs

func calcCeilPowerOfTwo(value float64) float64 {
	return math.Pow(2, math.Ceil(math.Log(value)/math.Ln2))
}
func calcInBufIndex(po2 float64) float64 {
	return math.Log(po2) / math.Ln2
}

var emptyBuf []byte
var bytesContentType = "application/octet-stream"

// 每次 for 循环最多读取 128 kb bytes
var maxSegBufSize float64 = 1024 * 128

var maxBytesSize int = 1024 * 1024 * 128

var bufFlags [32]int
var in_bufs [32]*[]byte
var out_bufs [32]*[]byte

func ReadFileBySteps(pathStr *string, beginPos int, endPos int) *SendBufInfo {

	// fmt.Println("ReadFileBySteps(), pathStr", *pathStr)

	if beginPos < 0 {
		beginPos = 0
	}
	bytesTotalSize := endPos - beginPos

	fmt.Println("ReadFileBySteps(), XXXX beginPos: ", beginPos, ", endPos: ", endPos, ",bytesTotalSize: ", bytesTotalSize)
	sendBuf := emptyBuf
	sendSize := 0
	var fiPtr *fs.FileInfo = nil
	success := true
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
				si := SendBufInfo{&emptyBuf, sendSize, fiPtr, bytesContentType, false, false}
				return &si
			}
			// fmt.Println("ReadFileBySteps(), beginPos:", beginPos, ", endPos", endPos, ",fileBytesTotal: ", fileBytesTotal, ",bytesTotalSize: ", bytesTotalSize)

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
			bufFlags[readInBufIndex] += 1
			if bufFlags[readInBufIndex] > 1 {
				fmt.Println("ReadFileBySteps(), bufFlags[", readInBufIndex, "]: ", bufFlags[readInBufIndex])
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
			sendSize = bytesTotalSize
			// fmt.Println("ReadFileBySteps(), beginPos:", beginPos, ", endPos", endPos, ",sendSize: ", sendSize, ", len(sendBuf): ", len(sendBuf))
			bufFlags[readInBufIndex] -= 1
		} else {
			fmt.Println("read in file error.")
			success = false
		}
	} else {
		fmt.Println("bytes range error.")
		success = false
	}
	// return &sendBuf, sendSize, fiPtr, &bytesContentType
	si := SendBufInfo{&sendBuf, sendSize, fiPtr, bytesContentType, false, success}
	return &si
}
