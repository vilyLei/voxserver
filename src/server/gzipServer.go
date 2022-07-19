package main

import (
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"sync"

	"voxserver.com/fileMod"
)

var gzPool = sync.Pool{
	New: func() interface{} {
		w := gzip.NewWriter(ioutil.Discard)
		gzip.NewWriterLevel(w, gzip.BestCompression)
		return w
	},
}

type gzipResponseWriter struct {
	io.Writer
	http.ResponseWriter
}

func (w *gzipResponseWriter) WriteHeader(status int) {
	w.Header().Del("Content-Length")
	w.ResponseWriter.WriteHeader(status)
}

func (w *gzipResponseWriter) Write(b []byte) (int, error) {
	return w.Writer.Write(b)
}

func corsTest(w *http.ResponseWriter, r *http.Request) bool {
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

// Gzip func handler
func Gzip(next http.Handler) http.HandlerFunc {
	hFunc := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			next.ServeHTTP(w, r)
			return
		}

		w.Header().Set("Content-Encoding", "gzip")

		gz := gzPool.Get().(*gzip.Writer)
		defer gzPool.Put(gz)

		gz.Reset(w)
		defer gz.Close()

		next.ServeHTTP(&gzipResponseWriter{ResponseWriter: w, Writer: gz}, r)
	})
	// http.Handle("/static/", hFunc)
	return hFunc
}
func main() {
	// http.ListenAndServe(":9090", Gzip(http.FileServer(http.Dir("./static"))))
	fsHandle := fileMod.FileServer(fileMod.Dir("./static"))
	fsHandle = http.StripPrefix("/static/", fsHandle)
	gzipHandler := Gzip(fsHandle)
	// originHandle := http.StripPrefix("/static/", fs)
	var handleWrapper = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		flag := corsTest(&w, r)
		if flag {
			fmt.Println("file server handleWrapper call ServeHTTP().")
			gzipHandler.ServeHTTP(w, r)
		}
	})

	http.Handle("/static/", handleWrapper)

	var portStr string = "9090"
	argsLen := len(os.Args)
	// fmt.Println("argsLen: ", argsLen)
	if argsLen > 1 {
		portStr = "" + os.Args[1]
		fmt.Println("init current port: ", portStr)
	}
	fmt.Println("Web gzipServer started at port: ", portStr)
	http.ListenAndServe(":"+portStr, nil)
}
