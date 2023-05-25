package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/timeout"
	"github.com/gin-gonic/gin"
)

func testResponse(c *gin.Context) {
	c.JSON(http.StatusGatewayTimeout, gin.H{
		"code": http.StatusGatewayTimeout,
		"msg":  "timeout",
	})
}

func timeoutMiddleware() gin.HandlerFunc {
	return timeout.New(
		// timeout.WithTimeout(3000*time.Millisecond),
		timeout.WithTimeout(3*time.Second),
		timeout.WithHandler(func(c *gin.Context) {
			fmt.Println("timeoutMiddleware() ...")
			c.Next()
		}),
		timeout.WithResponse(testResponse),
	)
}

func main() {
	r := gin.New()
	r.Use(timeoutMiddleware())
	r.GET("/slow", func(c *gin.Context) {
		// time.Sleep(5000 * time.Millisecond)
		time.Sleep(5 * time.Second)
		// c.Status(http.StatusOK)

		fmt.Println("slow handle() ...")
		c.String(http.StatusOK, fmt.Sprintf("web page rendering."))
	})
	if err := r.Run(":9090"); err != nil {
		log.Fatal(err)
	}
}
