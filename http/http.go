package http

import (
	"fmt"
	"net/http"
	"html/template"

	"github.com/gin-gonic/gin"

	"github.com/3n3a/home/v2/assets"
)

func Serve(address string, port int) {
	f := &assets.Assets

	addr := fmt.Sprintf("%s:%d", address, port)

	templ := template.Must(template.New("").ParseFS(f, "templates/*.tmpl"))


	router := gin.Default()
	router.SetHTMLTemplate(templ)
	router.StaticFS("/public", http.FS(f))

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl", gin.H{
			"title": "3n3a | Home",
			"author": "3n3a",
		})
	})

	router.GET("favicon.ico", func(c *gin.Context) {
		file, err := f.ReadFile("public/favicon.ico")
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "favicon was not found"})
		}
		c.Data(http.StatusOK, "image/x-icon", file)
	})

	_ = router.Run(addr)
}
