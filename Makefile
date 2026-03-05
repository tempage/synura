# Synura Public Makefile
#
# Usage:
#   make server      - Start the mock server on port 8080
#   make fetch       - Run curl-like fetch client (ARGS="...")
#   make synurart    - Run Synura runtime shell (EXT=path/to/extension.js)
#   make test        - Run all Go tests
#   make reverse     - Setup ADB reverse for Android testing
#   make android     - Setup ADB and start server (for Android testing)
#   make clean       - Clean build artifacts

.PHONY: server fetch synurart test reverse android clean help generate_extensions build

# Default target
help:
	@echo "Synura Public Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make server              - Start the mock server on port 8080"
	@echo "  make fetch ARGS=\"...\"   - Run fetch client (curl-like)"
	@echo "  make synurart EXT=...    - Run Synura CLI runtime shell"
	@echo "  make test                - Run all Go tests"
	@echo "  make reverse             - Setup ADB reverse for Android testing"
	@echo "  make android             - Setup ADB and start server"
	@echo "  make generate_extensions - Generate extensions.json from extensions directory"
	@echo "  make clean               - Clean build artifacts"
	@echo ""
	@echo "Endpoints available at http://localhost:8080:"
	@echo "  GET  /login          - Set session cookie (10s expiry)"
	@echo "  GET  /logout         - Clear session cookie"
	@echo "  GET  /ua             - Echo User-Agent"
	@echo "  GET  /headers        - Echo all headers"
	@echo "  GET  /get            - Echo request details"
	@echo "  POST /post           - Echo body"
	@echo "  POST /upload         - File upload"
	@echo "  GET  /login/get      - Authenticated GET"
	@echo "  POST /login/post     - Authenticated POST"
	@echo "  POST /login/upload   - Authenticated upload"
	@echo "  GET  /synura.js      - Test extension script"
	@echo "  GET  /api/hello      - Echo request details"
	@echo "  GET  /examples/*     - Serve example extensions"
	@echo "  GET  /ext/*          - Serve extensions from PATH (optional)"

# Start the mock server
# Usage: make server [EXTDIR=path/to/extension/directory]
server:
	@echo "Starting mock server on :8080..."
ifdef EXTDIR
	go run ./cmd/mock_server -path $(EXTDIR)
else
	go run ./cmd/mock_server
endif

# Run curl-like fetch helper
fetch:
	go run ./cmd/fetch $(ARGS)

# Run runtime shell for extension development
synurart:
ifdef EXT
	go run ./cmd/synurart -ext $(EXT)
else
	go run ./cmd/synurart
endif

# Run tests
test:
	@echo "Running tests..."
	go test -v ./...

# Setup ADB reverse for Android testing
reverse:
	@echo "Setting up ADB reverse tcp:8080 -> tcp:8080..."
	adb reverse tcp:8080 tcp:8080
	@echo "ADB reverse setup complete."
	@echo "Android device can now access http://localhost:8080"

# Android testing: setup ADB and start server
android: reverse server

# Clean build artifacts
clean:
	@echo "Cleaning..."
	rm -rf bin
	go clean ./...
	@echo "Clean complete."

# Build the server binary
build:
	@echo "Building mock_server..."
	mkdir -p bin
	go build -o bin/mock_server ./cmd/mock_server
	go build -o bin/fetch ./cmd/fetch
	go build -o bin/synurart ./cmd/synurart
	@echo "Build complete: bin/mock_server, bin/fetch, bin/synurart"

# Generate extensions.json
generate_extensions:
	@echo "Generating extensions.json..."
	python extensions/generate_extensions_json.py
	@echo "Done."
