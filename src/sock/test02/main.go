package main

import (
	"fmt"
	"test02/sockHandle"

	"github.com/gin-gonic/gin"
)

// go mod edit -replace test02/sockHandle=./sockHandle
func main() {
	fmt.Println("sock init !!!")
	r := gin.Default()
	r.GET("/ws", sockHandle.WebSocketBase)
	err := r.Run(":8080")
	if err != nil {
		return
	}
	fmt.Println("sock end !!!")
}
