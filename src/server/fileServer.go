package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"voxserver.com/fileMod"
)

// go mod init voxserver.com/fileMod

// go build ../src/server/fileserver.go
// go run ../src/server/fileserver.go
// go build -o ../../bin/ fileserver.go

// go mod init voxserver.com/main
// go mod edit -replace voxserver.com/fileMod=./fileMod
/*
var orig = http.StripPrefix("/static/", http.FileServer(http.Dir(".")))
var wrapped = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.Header.Set("Access-Control-Allow-Origin", "*")
    // …

    orig.ServeHTTP(w, r)
})

http.Handle("/static/", wrapped)
*/
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
func main() {

	// fs1 := http.FileServer(http.Dir("./static"))
	fs := fileMod.FileServer(fileMod.Dir("./static"))
	originHandle := http.StripPrefix("/static/", fs)
	var handleWrapper = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		flag := corsTest(&w, r)
		if flag {
			log.Println("file server handleWrapper call ServeHTTP().")
			originHandle.ServeHTTP(w, r)
		}
	})
	http.Handle("/static/", handleWrapper)

	// fs := http.FileServer(http.Dir("./static"))
	// http.Handle("/static/", http.StripPrefix("/static/", fs))

	// http.HandleFunc("/", serveTemplate)
	var portStr string = "9090"
	argsLen := len(os.Args)
	if argsLen > 1 {
		portStr = "" + os.Args[1]
	}
	log.Println("init file server ver 0.1.1")
	log.Println("file server init current port: ", portStr)
	err := http.ListenAndServe(":"+portStr, nil)
	if err != nil {
		log.Fatal(err)
	}
}

func serveTemplate(w http.ResponseWriter, r *http.Request) {
	lp := filepath.Join("templates", "layout.html")
	fp := filepath.Join("templates", filepath.Clean(r.URL.Path))

	// Return a 404 if the template doesn't exist
	info, err := os.Stat(fp)
	if err != nil {
		if os.IsNotExist(err) {
			http.NotFound(w, r)
			return
		}
	}

	// Return a 404 if the request is for a directory
	if info.IsDir() {
		http.NotFound(w, r)
		return
	}

	tmpl, err := template.ParseFiles(lp, fp)
	if err != nil {
		// Log the detailed error
		log.Print(err.Error())
		// Return a generic "Internal Server Error" message
		http.Error(w, http.StatusText(500), 500)
		return
	}

	err = tmpl.ExecuteTemplate(w, "layout", nil)
	if err != nil {
		log.Print(err.Error())
		http.Error(w, http.StatusText(500), 500)
	}
}
