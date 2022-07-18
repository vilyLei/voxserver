package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

/*
var orig = http.StripPrefix("/static/", http.FileServer(http.Dir(".")))
var wrapped = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.Header.Set("Access-Control-Allow-Origin", "*")
    // …

    orig.ServeHTTP(w, r)
})

http.Handle("/static/", wrapped)
*/
func respApplyCORS(w *http.ResponseWriter) {
	header := (*w).Header()
	header.Set("Access-Control-Allow-Origin", "*")
	// header.Set("Access-Control-Allow-Credentials", "true")
	//header.Set("Access-Control-Allow-Headers", "Range, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	header.Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT")
}
func main() {

	fs := http.FileServer(http.Dir("./static"))
	originHandle := http.StripPrefix("/static/", fs)
	var handleWrapper = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		respApplyCORS(&w)
		originHandle.ServeHTTP(w, r)
	})
	http.Handle("/static/", handleWrapper)

	// fs := http.FileServer(http.Dir("./static"))
	// http.Handle("/static/", http.StripPrefix("/static/", fs))

	// http.HandleFunc("/", serveTemplate)

	log.Print("Listening on :9091...")
	err := http.ListenAndServe(":9091", nil)
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
