package assets

import "embed"

//go:embed public/* templates/*
var Assets embed.FS
