package main

import (
	"fmt"
	"io"
	"math"
	"net/http"
	"os"
	"strconv"
	"strings"
)

var fileTotalBytes uint64 = 1

// "github.com/dustin/go-humanize"
// WriteCounter counts the number of bytes written to it. It implements to the io.Writer interface
// and we can pass this into io.TeeReader() which will report progress on each write cycle.
type WriteCounter struct {
	Total uint64
}

func (wc *WriteCounter) Write(p []byte) (int, error) {
	n := len(p)
	wc.Total += uint64(n)
	wc.PrintProgress()
	return n, nil
}

func (wc WriteCounter) PrintProgress() {
	// Clear the line by using a character return to go back to the start and remove
	// the remaining characters by filling it with spaces
	fmt.Printf("\r%s", strings.Repeat(" ", 35))

	// Return again and print current status of download
	// We use the humanize package to print the bytes in a meaningful way (e.g. 10 MB)
	// fmt.Printf("\rDownloading... %s complete", humanize.Bytes(wc.Total))
	pf := float64(wc.Total) / float64(fileTotalBytes)
	// pro := int(math.Round(pf * 100.0))
	pro := int(math.Floor(pf * 100.0))
	fmt.Println("\rDownloading: ", wc.Total, "bytes, pro: ", strconv.Itoa(pro)+"%")
	/*
			f := 3.14159265358979323846
		    s := strconv.FormatFloat(f, 'f', 6, 64)
		    fmt.Printf("f = %f, s = %s\\n", f, s)
	*/
}

func main() {
	fmt.Println("Download Started")

	fileUrl := "http://www.artvily.com/static/assets/fbx/Samba_Dancing.fbx"
	err := DownloadFile("download_file.fbx", fileUrl)
	if err != nil {
		panic(err)
	}

	fmt.Println("Download Finished")
}

// DownloadFile will download a url to a local file. It's efficient because it will
// write as it downloads and not load the whole file into memory. We pass an io.TeeReader
// into Copy() to report progress on the download.
func DownloadFile(filepath string, url string) error {

	// Create the file, but give it a tmp file extension, this means we won't overwrite a
	// file until it's downloaded, but we'll remove the tmp extension once downloaded.
	out, err := os.Create(filepath + ".tmp")
	if err != nil {
		return err
	}

	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		out.Close()
		return err
	}
	if resp.ContentLength > 0 {
		fileTotalBytes = uint64(resp.ContentLength)
	}
	fmt.Println("download fileTotalBytes: ", fileTotalBytes)
	defer resp.Body.Close()

	// Create our progress reporter and pass it to be used alongside our writer
	counter := &WriteCounter{}
	if _, err = io.Copy(out, io.TeeReader(resp.Body, counter)); err != nil {
		out.Close()
		return err
	}

	// The progress use the same line so print a new line once it's finished downloading
	fmt.Print("\n")

	// Close the file without defer so it can happen before Rename()
	out.Close()

	if err = os.Rename(filepath+".tmp", filepath); err != nil {
		return err
	}
	return nil
}

/*
package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	url := "<https://example.com/file.zip>"
	filename := "file.zip"

	// 创建文件
	out, err := os.Create(filename)
	if err != nil {
		panic(err)
	}
	defer out.Close()

	// 发送请求
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	// 获取文件大小
	size := resp.ContentLength

	// 创建下载进度条
	done := make(chan int64)
	go func() {
		var downloaded int64
		for {
			select {
			case <-done:
				return
			default:
				if size > 0 {
					fmt.Printf("\\rDownloading... %d%%", downloaded*100/size)
				} else {
					fmt.Printf("\\rDownloading... %d bytes downloaded", downloaded)
				}
			}
		}
	}()

	// 复制文件内容并显示下载进度
	_, err = io.Copy(out, io.TeeReader(resp.Body, &progressReader{callback: func(downloaded int64) {
		done <- downloaded
	}}))
	if err != nil {
		panic(err)
	}

	fmt.Println("\\nDownload complete!")
}

type progressReader struct {
	callback func(downloaded int64)
}

func (pr *progressReader) Read(p []byte) (int, error) {
	n, err := os.Stdout.Write(p)
	if err != nil {
		return n, err
	}
	pr.callback(int64(n))
	return n, nil
}
//*/
