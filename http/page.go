package http

import (
	"html/template"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// NavItem is a single entry in the main or footer navigation.
type NavItem struct {
	Label   string
	URL     string
	Current bool
}

// Article is a post teaser as rendered in a post list.
type Article struct {
	Title       string
	URL         string
	Author      string
	Summary     string
	PublishedAt time.Time
}

// Site holds the values that are the same on every page.
type Site struct {
	Name        string
	Author      string
	BaseURL     string
	Lang        string
	Description string
	ThemeColor  string
	OGImage     string
	Nav         []NavItem
	FooterNav   []NavItem
}

// Page holds the values that differ from page to page. Zero values fall back to
// the site defaults, so a handler only sets what it actually cares about.
type Page struct {
	Path        string        // Request path, used for the canonical URL and nav state.
	Title       string        // <title>, without the site name suffix.
	Heading     string        // <h1>; defaults to Title.
	Intro       string        // Lead paragraph below the heading.
	Description string        // Meta description; defaults to Site.Description.
	Body        template.HTML // Pre-rendered rich text, e.g. from the CMS.
	OGType      string        // og:type; defaults to "website".
	Markdown    string        // Path of the text/markdown alternate, if any.
	Articles    []Article
}

// data flattens site and page into the map the templates consume. Scalars use
// snake_case keys, collections carry exported struct fields.
func (s Site) data(p Page) gin.H {
	description := p.Description
	if description == "" {
		description = s.Description
	}

	heading := p.Heading
	if heading == "" {
		heading = p.Title
	}

	return gin.H{
		"lang":             s.Lang,
		"site_name":        s.Name,
		"author":           s.Author,
		"title":            p.Title,
		"heading":          heading,
		"intro":            p.Intro,
		"body":             p.Body,
		"articles":         p.Articles,
		"nav":              s.navFor(p.Path),
		"footer_nav":       s.FooterNav,
		"year":             time.Now().Year(),
		"canonical":        s.absURL(p.Path),
		"markdown":         s.absURL(p.Markdown),
		"meta_description": description,
		"meta_og_image":    s.absURL(s.OGImage),
		"meta_theme_color": s.ThemeColor,
		"og_type":          p.OGType,
	}
}

// navFor returns the navigation with the entry matching path marked current.
func (s Site) navFor(path string) []NavItem {
	nav := make([]NavItem, len(s.Nav))
	copy(nav, s.Nav)

	for i := range nav {
		nav[i].Current = nav[i].URL == path
	}

	return nav
}

// absURL turns a site-relative path into an absolute URL. Empty paths and paths
// that are already absolute are returned unchanged.
func (s Site) absURL(path string) string {
	if path == "" || strings.Contains(path, "://") {
		return path
	}

	return strings.TrimSuffix(s.BaseURL, "/") + "/" + strings.TrimPrefix(path, "/")
}
