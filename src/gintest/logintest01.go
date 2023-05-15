package main

import (
	"fmt"
	"log"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

// server error 500
func errorIs500Http(g *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			// //打印错误堆栈信息
			log.Printf("panic: %v\n", r)
			debug.PrintStack()
			// //封装通用json返回
			// c.HTML(200, "500.html", gin.H{
			//     "title": "500",
			// })
			g.String(http.StatusOK, fmt.Sprintf("svr error code is 500."))
		}
	}()
	g.Next()
}

// 404 error
func NoRoute(g *gin.Context) {
	g.String(http.StatusOK, fmt.Sprintf("It is a web page here. welcome back."))
}
func IndexPage(g *gin.Context) {
	g.String(http.StatusOK, fmt.Sprintf("It is a web page here."))
}
func Login(g *gin.Context) {
	g.HTML(200, "loginInput.html", nil)
}

func DoLogin(g *gin.Context) {
	username := g.PostForm("username")
	password := g.PostForm("password")

	g.HTML(200, "loginWelcome.html", gin.H{
		"username": username,
		"password": password,
	})
}

func main() {
	fmt.Println("sys init ...")
	e := gin.Default()

	e.LoadHTMLGlob("loginTemplate/*")
	// 404
	e.NoRoute(NoRoute)
	e.GET("/", IndexPage)
	e.GET("/login", Login)
	e.POST("/login", DoLogin)
	e.Use(errorIs500Http)
	e.Run(":9090")
}
