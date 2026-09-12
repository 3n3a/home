package http

import (
	"io/fs"
	"fmt"
	"net/http"
	"html/template"

	"github.com/gin-gonic/gin"

	"github.com/3n3a/home/v2/assets"
)

func Serve(address string, port int) {
	a := &assets.Assets
	p, err := fs.Sub(a, "public")
	if err != nil {
		panic(err)
	}

	t := &assets.Templates

	addr := fmt.Sprintf("%s:%d", address, port)

	templ := template.Must(template.New("").ParseFS(t, "templates/*.tmpl"))

	router := gin.Default()
	router.SetHTMLTemplate(templ)
	router.StaticFS("/public", http.FS(p))

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl", gin.H{
			"title": "3n3a | Home",
			"author": "3n3a",
		})
	})

	router.GET("favicon.ico", func(c *gin.Context) {
		file, err := a.ReadFile("favicon.ico")
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "favicon was not found"})
			return;
		}
		c.Data(http.StatusOK, "image/x-icon", file)
	})

	_ = router.Run(addr)
}
