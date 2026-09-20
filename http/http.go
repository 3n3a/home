package http

import (
	"fmt"
	"html/template"
	"io/fs"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"

	"github.com/3n3a/home/v2/assets"
)

// rootFiles are served from the site root even though they live under public/,
// because user agents look for them at fixed, well-known paths.
var rootFiles = map[string]struct {
	path        string
	contentType string
}{
	"/favicon.ico":      {"public/icons/favicon.ico", "image/x-icon"},
	"/site.webmanifest": {"public/site.webmanifest", "application/manifest+json"},
	"/robots.txt":       {"public/robots.txt", "text/plain; charset=utf-8"},
}

func Serve(address string, port int) {
	public, err := fs.Sub(assets.Assets, "public")
	if err != nil {
		panic(err)
	}

	templ := template.Must(template.New("").ParseFS(assets.Templates, "templates/*.tmpl"))

	router := gin.Default()
	router.SetHTMLTemplate(templ)
	router.StaticFS("/public", http.FS(public))

	site := newSite()

	for route, file := range rootFiles {
		router.GET(route, serveEmbedded(file.path, file.contentType))
	}

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl", site.data(Page{
			Path:    "/",
			Title:   "Home",
			Heading: site.Name,
			Intro:   site.Description,
		}))
	})

	router.GET("/styleguide", func(c *gin.Context) {
		c.HTML(http.StatusOK, "styleguide.tmpl", site.data(Page{
			Path:        "/styleguide",
			Title:       "Styleguide",
			Heading:     "Styleguide",
			Intro:       "Every element home.css is expected to handle, on one page.",
			Description: "Reference rendering of every styled HTML element.",
		}))
	})

	addr := fmt.Sprintf("%s:%d", address, port)
	if err := router.Run(addr); err != nil {
		panic(err)
	}
}

// newSite reads the site-wide settings, falling back to sensible defaults so the
// server runs without any configuration.
func newSite() Site {
	viper.SetDefault("site_name", "3n3a")
	viper.SetDefault("site_author", "3n3a")
	viper.SetDefault("site_base_url", "https://3n3a.ch")
	viper.SetDefault("site_lang", "en")
	viper.SetDefault("site_description", "Personal website of 3n3a.")
	viper.SetDefault("site_theme_color", "#1a1a18")

	nav := []NavItem{
		{Label: "Home", URL: "/"},
		{Label: "Styleguide", URL: "/styleguide"},
	}

	return Site{
		Name:        viper.GetString("site_name"),
		Author:      viper.GetString("site_author"),
		BaseURL:     viper.GetString("site_base_url"),
		Lang:        viper.GetString("site_lang"),
		Description: viper.GetString("site_description"),
		ThemeColor:  viper.GetString("site_theme_color"),
		OGImage:     "/public/images/sample.svg",
		Nav:         nav,
		FooterNav:   nav,
	}
}

// serveEmbedded returns a handler that writes one embedded asset, or 404s if the
// file has not been added to assets/public yet.
func serveEmbedded(path, contentType string) gin.HandlerFunc {
	return func(c *gin.Context) {
		file, err := assets.Assets.ReadFile(path)
		if err != nil {
			c.Status(http.StatusNotFound)
			return
		}

		c.Data(http.StatusOK, contentType, file)
	}
}
