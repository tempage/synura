package main

import (
	"fmt"
	"os"

	"golang.org/x/term"
)

// ANSI escape sequences for terminal colors.
var (
	colorEnabled bool

	cReset     = "\033[0m"
	cBold      = "\033[1m"
	cDim       = "\033[2m"
	cItalic    = "\033[3m"
	cUnderline = "\033[4m"

	// Foreground colors (standard).
	cRed     = "\033[31m"
	cGreen   = "\033[32m"
	cYellow  = "\033[33m"
	cBlue    = "\033[34m"
	cMagenta = "\033[35m"
	cCyan    = "\033[36m"
	cWhite   = "\033[37m"

	// Bright foreground colors.
	cBrightBlack   = "\033[90m"
	cBrightRed     = "\033[91m"
	cBrightGreen   = "\033[92m"
	cBrightYellow  = "\033[93m"
	cBrightBlue    = "\033[94m"
	cBrightMagenta = "\033[95m"
	cBrightCyan    = "\033[96m"
	cBrightWhite   = "\033[97m"
)

func init() {
	colorEnabled = term.IsTerminal(int(os.Stdout.Fd()))
}

func c(text string, codes ...string) string {
	if !colorEnabled || len(codes) == 0 {
		return text
	}
	prefix := ""
	for _, code := range codes {
		prefix += code
	}
	return prefix + text + cReset
}

func bold(text string) string      { return c(text, cBold) }
func dim(text string) string       { return c(text, cDim) }
func italic(text string) string    { return c(text, cItalic) }
func underline(text string) string { return c(text, cUnderline) }

// tag renders a bracketed label like [OPEN] with a color.
func tag(label string, codes ...string) string {
	return c("["+label+"]", codes...)
}

// fmtIndex formats a 1-based index like " 1." with color.
func fmtIndex(n, width int) string {
	s := fmt.Sprintf("%*d.", width, n)
	return c(s, cBrightBlack)
}

// indexWidth returns the character width needed for the largest index.
func indexWidth(count int) int {
	w := 1
	for n := count; n >= 10; n /= 10 {
		w++
	}
	return w
}
