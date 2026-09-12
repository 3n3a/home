/*
Copyright © 2026 3n3a <46775561+3n3a@users.noreply.github.com>

*/
package cmd

import (
	"github.com/spf13/cobra"

	http "github.com/3n3a/home/v2/http"
)

var httpAddress string
var httpPort int

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Starts http server and serves website",
	Long: `Starts an http server with net/http and listens on a specified address serving files from a specified public directory and combining with api endpoints.`,
	Run: func(cmd *cobra.Command, args []string) {
		http.Serve(httpAddress, httpPort);
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)

	serveCmd.PersistentFlags().StringVar(&httpAddress, "address", "127.0.0.1", "Address where the webserver listens")
	serveCmd.PersistentFlags().IntVar(&httpPort, "port", 7777, "Port where webserver listens")
}
