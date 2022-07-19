package main

import (
	"fmt"

	"modDemo.com/subMod"
)

// go mod init modDemo.com/main
// go mod edit -replace modDemo.com/subMod=./subMod
// go run modMain.go

func main() {

	fmt.Println("main() init...")
	subMod.ShowVer()
	ia := subMod.InfoShower{Info: "info 01", Version: "0.2.3"}
	subMod.UseShower(ia)

	fa := subMod.HTTPFileShower{"http file 01", "1.3.20", 102}
	subMod.UseShower(fa)
}
