package main

import "os/exec"

// build a sys service with golang
// https://medium.com/swlh/create-go-service-the-easy-way-de827d7f07cf
func main() {
	exec.Command("firefox", "google.com/search?q=golang").Start()
}
