package main

import (
	"html/template"
	"net/http"

	"github.com/gin-gonic/gin"
)

var htmlPage = template.Must(template.New("http").Parse(`
<html>
<head>
  <title>load orther svr res</title>
</head>
<body>
  <h1 style="color:red;">load orther svr res, waiting now ...</h1>
</body>
</html>
`))

func main() {
	router := gin.Default()
	router.SetHTMLTemplate(htmlPage)
	router.GET("/pic", func(c *gin.Context) {
		response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
		if err != nil || response.StatusCode != http.StatusOK {
			c.Status(http.StatusServiceUnavailable)
			return
		}

		// c.HTML(200, "http", gin.H{
		// 	"status": "success",
		// })
		reader := response.Body
		contentLength := response.ContentLength
		contentType := response.Header.Get("Content-Type")

		extraHeaders := map[string]string{
			"Content-Disposition": `attachment; filename="gopher.png"`,
		}

		c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
	})
	router.Run(":9090")
}
