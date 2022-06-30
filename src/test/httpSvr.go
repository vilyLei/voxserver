package main

import (
    "net/http"
)

func main() {
    http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Welcome to my website!")
    })
    http.HandleFunc("/message", func (w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "You get a message!")
    })

    fs := http.FileServer(http.Dir("static/"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))

    http.ListenAndServe(":9090", nil)

	// // http.ListenAndServe(":9090", http.FileServer(http.Dir("/static")))
	// http.Handle("/tmpfiles/", http.StripPrefix("/tmpfiles/", http.FileServer(http.Dir("/tmp"))))
	// http.ListenAndServe(":9090", nil)
}