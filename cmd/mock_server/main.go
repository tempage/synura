package main

import (
	"flag"
	"log"

	"github.com/ivere27/synura/internal/mockserver"
)

func main() {
	var cfg mockserver.Config
	flag.StringVar(&cfg.Addr, "addr", ":8080", "server listen address")
	flag.StringVar(&cfg.AdditionalScriptPath, "path", "", "optional directory to serve at /ext/")
	flag.StringVar(&cfg.SynuraScriptPath, "synura", "testdata/mock_server/synura.js", "path to synura.js to serve")
	flag.StringVar(&cfg.ExtensionsDir, "examples", "extensions", "directory served under /examples/")
	flag.Parse()

	if cfg.AdditionalScriptPath == "" && flag.NArg() > 0 {
		cfg.AdditionalScriptPath = flag.Arg(0)
	}

	s, err := mockserver.New(cfg)
	if err != nil {
		log.Fatal(err)
	}
	if err := s.Run(); err != nil {
		log.Fatal(err)
	}
}
