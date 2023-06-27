package main

import (
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
)

func Entry(filesPath string, svrUrl string) {
	err := uploadFiles(filesPath, svrUrl)
	if err != nil {
		log.Fatalln(err)
	}
}

func uploadFiles(filePath string, svrUrl string) error {
	sanitizedPath := strings.ReplaceAll(filePath, " ", "")
	paths := strings.Split(sanitizedPath, ",")

	r, w := io.Pipe()
	m := multipart.NewWriter(w)

	go func() {
		defer func() {
			// m.Close() is important so the requset knows the boundary
			m.Close()
			w.Close()
		}()
		for i, path := range paths {
			f, err := os.Open(path)
			if err != nil {
				fmt.Println(err)
				return
			}
			defer f.Close()
			fileKey := fmt.Sprintf("file%d", i)
			if fw, err := m.CreateFormFile(fileKey, f.Name()); err != nil {
				return
			} else {
				if _, err = io.Copy(fw, f); err != nil {
					return
				}
			}
		}
	}()

	// url := fmt.Sprintf("http://%s/upload", svrHostAddr)
	req, _ := http.NewRequest("POST", svrUrl, r)
	req.Header.Add("Content-Type", m.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	resp.Body.Close()
	fmt.Printf("Successfully uploaded %d file(s)!\n", len(paths))
	return nil
}
func main() {
	fmt.Println("init...")
	svrRootUrl := "http://localhost:9095/upload"
	Entry("./client/files/wood_01.jpg, ./client/files/wood_02.jpg", svrRootUrl)
}
