# Synura Public Makefile
#
# Usage:
#   make server    - Start the mock server on port 8080
#   make test      - Run mock server tests
#   make reverse   - Setup ADB reverse for Android testing
#   make android   - Setup ADB and start server (for Android testing)
#   make clean     - Clean build artifacts

.PHONY: server test reverse android clean help generate_extensions

# Default target
help:
	@echo "Synura Public Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make server              - Start the mock server on port 8080"
	@echo "  make test                - Run mock server tests"
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
	go run mock_server/main.go -path $(EXTDIR)
else
	go run mock_server/main.go
endif

# Run tests
test:
	@echo "Running tests..."
	cd mock_server && go test -v ./...

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
	rm -f mock_server/mock_server
	rm -f mock_server/mock_server.exe
	cd mock_server && go clean
	@echo "Clean complete."

# Build the server binary
build:
	@echo "Building mock_server..."
	cd mock_server && go build -o mock_server main.go
	@echo "Build complete: mock_server/mock_server"

# Generate extensions.json
generate_extensions:
	@echo "Generating extensions.json..."
	python extensions/generate_extensions_json.py
	@echo "Done."
