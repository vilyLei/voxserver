package subMod

import (
	"fmt"
)

// go mod init modDemo.com/subMod

type Shower interface {
	Show()
}
type FileShower interface {
	Show()
	SetFileSize() uint32
}
type InfoShower struct {
	Info    string
	Version string
}

type HTTPFileShower struct {
	Info     string
	Version  string
	FileSize int32
}

func (i InfoShower) Show() {
	fmt.Println("InfoShower::info", i.Info, ", ver: ", i.Version)
}
func (f HTTPFileShower) Show() {
	fmt.Println("HTTPFileShower::info", f.Info, ", ver: ", f.Version, ", fileSize: ", f.FileSize)
}

func UseShower(s Shower) {
	s.Show()
}
func ShowVer() {
	fmt.Println("Sub Ver is 0.02.")
}
