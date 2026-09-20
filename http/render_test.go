package http

import (
	"bytes"
	"html/template"
	"strings"
	"testing"

	"github.com/3n3a/home/v2/assets"
)

// TestTemplatesRender parses every template the server parses and renders each
// page template, so a broken action or a missing partial fails the build.
func TestTemplatesRender(t *testing.T) {
	templ := template.Must(template.New("").ParseFS(assets.Templates, "templates/*.tmpl"))

	site := newSite()
	pages := map[string]Page{
		"index.tmpl": {
			Path:    "/",
			Title:   "Home",
			Heading: site.Name,
			Intro:   site.Description,
			Body:    template.HTML("<p>From the CMS</p>"),
			Articles: []Article{
				{Title: "The Planet Earth", URL: "/posts/earth", Author: "Jane Smith", Summary: "Blue and green."},
			},
		},
		"styleguide.tmpl": {Path: "/styleguide", Title: "Styleguide"},
	}

	for name, page := range pages {
		var buf bytes.Buffer
		if err := templ.ExecuteTemplate(&buf, name, site.data(page)); err != nil {
			t.Fatalf("%s: %v", name, err)
		}

		out := buf.String()
		for _, unwanted := range []string{"{{", "<no value>", "%!"} {
			if strings.Contains(out, unwanted) {
				t.Errorf("%s: output contains %q", name, unwanted)
			}
		}
		for _, wanted := range []string{"<!DOCTYPE html>", `class="site-header`, `id="main"`, "site-footer"} {
			if !strings.Contains(out, wanted) {
				t.Errorf("%s: output missing %q", name, wanted)
			}
		}
	}
}

func TestAbsURL(t *testing.T) {
	s := Site{BaseURL: "https://3n3a.ch/"}

	cases := map[string]string{
		"":                    "",
		"/about":              "https://3n3a.ch/about",
		"about":               "https://3n3a.ch/about",
		"https://example.org": "https://example.org",
	}

	for in, want := range cases {
		if got := s.absURL(in); got != want {
			t.Errorf("absURL(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestNavForMarksCurrent(t *testing.T) {
	s := Site{Nav: []NavItem{{URL: "/"}, {URL: "/styleguide"}}}

	nav := s.navFor("/styleguide")
	if nav[0].Current || !nav[1].Current {
		t.Errorf("wrong entry marked current: %+v", nav)
	}
	if s.Nav[1].Current {
		t.Error("navFor mutated Site.Nav")
	}
}
