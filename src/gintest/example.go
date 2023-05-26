package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("init...")
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run(":9091")
}

//go build -buildmode=c-shared -o example.dll example.go
