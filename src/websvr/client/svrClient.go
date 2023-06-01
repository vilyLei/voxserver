package client

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"voxwebsvr.com/webfs"
)

// go mod init voxwebsvr.com/client

var unixEpochTime = time.Unix(0, 0)

func isZeroTime(t time.Time) bool {
	return t.IsZero() || t.Equal(unixEpochTime)
}
func setLastModified(w http.ResponseWriter, modtime time.Time) {
	if !isZeroTime(modtime) {
		w.Header().Set("Last-Modified", modtime.UTC().Format(http.TimeFormat))
	}
}

func sendBytesToClient(w *http.ResponseWriter, siPtr *webfs.SendBufInfo) bool {

	wr := (*w)
	if siPtr.Success {

		if siPtr.FiPtr != nil {
			setLastModified(wr, (*siPtr.FiPtr).ModTime())
		}
		header := wr.Header()

		header.Set("Content-Type", siPtr.ContentType)
		header.Set("Server", "golang")
		header.Set("Accept-Ranges", "bytes")
		header.Set("Content-Length", strconv.Itoa(siPtr.Size))

		// log.Print("Content-Length", strconv.Itoa(siPtr.Size))

		if siPtr.GzipEnabled {
			header.Set("Accept-Encoding", "gzip,deflate")
			header.Set("Vary", "Accept-Encoding")
			header.Set("Content-encoding", "gzip")
		}

		wr.WriteHeader(http.StatusOK)
		wr.Write((*(siPtr.BufPtr)))
		return true
	} else {
		return false
	}
}
func rangeFileResponse(w *http.ResponseWriter, pathStr *string, bytesPosList []int) bool {

	// fmt.Println("rangeFileResponse(), pathStr", *pathStr)
	siPtr := webfs.ReadFileBySteps(pathStr, bytesPosList[0], bytesPosList[1])
	return sendBytesToClient(w, siPtr)
}

func fileResponse(w *http.ResponseWriter, pathStr *string) bool {

	// fmt.Println("fileResponse(), pathStr", *pathStr)
	siPtr := webfs.FileReader(pathStr)
	webfs.GzipSendBuf(siPtr)
	// fmt.Println("fileResponse(),contentType: ", siPtr.ContentType, "siPtr.GzipEnabled: ", siPtr.GzipEnabled)
	return sendBytesToClient(w, siPtr)
}
func ReceiveRequest(w *http.ResponseWriter, r *http.Request, pathStrPtr *string) bool {
	var rHeader = r.Header
	var rangeList []string
	rangeListSize := 0
	if _, v := rHeader["Range"]; v {
		rangeList = rHeader["Range"]
		rangeListSize = len(rangeList)
	}

	if rangeListSize > 0 {
		var bytesPosList []int
		for _, value := range rangeList {
			posList := strings.Split(value, "=")
			if posList[0] == "bytes" && len(posList) == 2 {
				posList := strings.Split(posList[1], "-")
				if len(posList) == 2 {
					num0, _ := strconv.Atoi(posList[0])
					num1, _ := strconv.Atoi(posList[1])
					bytesPosList = append(bytesPosList, num0, num1)
					break
				}
			}
		}
		return rangeFileResponse(w, pathStrPtr, bytesPosList)
	} else {
		return fileResponse(w, pathStrPtr)
	}
}
