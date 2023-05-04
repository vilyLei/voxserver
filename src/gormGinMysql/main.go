/*
thanks:

	https://github.com/canopas/gorm-gin-with-mysql
	https://blog.canopas.com/golang-gorm-with-mysql-and-gin-ab876f406244
*/
package main

import (
	"gorm-test/controllers"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := setupRouter()
	_ = r.Run(":9080")
}

func setupRouter() *gin.Engine {
	r := gin.Default()
	// thanks: https://gin-gonic.com/docs/examples/serving-static-files/
	r.Static("/static", "./static")
	// router.StaticFS("/more_static", http.Dir("common_file_system"))
	// router.StaticFile("/favicon.ico", "./resources/favicon.ico")

	r.GET("ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, "pong")
	})

	userRepo := controllers.New()
	r.POST("/users", userRepo.CreateUser)
	r.GET("/users", userRepo.GetUsers)
	r.GET("/users/:id", userRepo.GetUser)
	r.PUT("/users/:id", userRepo.UpdateUser)
	r.DELETE("/users/:id", userRepo.DeleteUser)

	return r
}
