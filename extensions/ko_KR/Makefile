TSC ?= tsc
TSC_FLAGS = --target ES2018 --module none --lib ES2018,DOM --skipLibCheck --pretty false --removeComments
TERSER ?= terser
TERSER_FLAGS ?= -c -m --ecma 2018
MINIFY ?= 1
SIZE_WARNING_BYTES ?= 131072

COMMON_TS = community_common.ts
SHARED_SITES = arca clien damoang fmkorea inven mlbpark pann ppomppu ruliweb theqoo
SHARED_OUTPUTS = $(addsuffix .js,$(SHARED_SITES))
EXTENSION_TARGETS = $(SHARED_SITES) dcinside
STANDALONE_OUTPUTS = dcinside.js
OUTPUTS = $(SHARED_OUTPUTS) $(STANDALONE_OUTPUTS)

.PHONY: all build clean check $(EXTENSION_TARGETS)

all: build

build: $(OUTPUTS)
	@echo "Built $(words $(OUTPUTS)) community extensions:"
	@for file in $(OUTPUTS); do \
		size=$$(wc -c < "$$file"); \
		echo " - $$file ($$size bytes)"; \
		if [ $$size -gt $(SIZE_WARNING_BYTES) ]; then \
			echo "   Warning: $$file exceeds 128 KB ($$size bytes)"; \
		fi; \
	done

check: build

$(EXTENSION_TARGETS): %: %.js

dcinside.js: dcinside.ts
	$(TSC) $(TSC_FLAGS) --outFile $@ $<
	@awk '{gsub(/^[[:space:]]+|[[:space:]]+$$/,""); if ($$0 != "" && $$0 != "\"use strict\";" && $$0 !~ /^\/\/# sourceMappingURL=/) print}' $@ > $@.tmp
	@mv $@.tmp $@
	@if [ "$(MINIFY)" = "1" ]; then \
		if command -v "$(TERSER)" >/dev/null 2>&1; then \
			"$(TERSER)" $(TERSER_FLAGS) "$@" -o "$@.tmp"; \
		else \
			echo "Error: MINIFY=1 but terser is not installed. Install terser or run make MINIFY=0." >&2; \
			exit 1; \
		fi; \
		mv "$@.tmp" "$@"; \
	fi
	@size=$$(wc -c < "$@"); \
	if [ $$size -gt $(SIZE_WARNING_BYTES) ]; then \
		echo "Warning: $@ is $$size bytes and exceeds $(SIZE_WARNING_BYTES) bytes"; \
	fi

%.js: %.ts $(COMMON_TS)
	$(TSC) $(TSC_FLAGS) --outFile $@ $^
	@awk '{gsub(/^[[:space:]]+|[[:space:]]+$$/,""); if ($$0 != "" && $$0 != "\"use strict\";" && $$0 !~ /^\/\/# sourceMappingURL=/) print}' $@ > $@.tmp
	@mv $@.tmp $@
	@if [ "$(MINIFY)" = "1" ]; then \
		if command -v "$(TERSER)" >/dev/null 2>&1; then \
			"$(TERSER)" $(TERSER_FLAGS) "$@" -o "$@.tmp"; \
		else \
			echo "Error: MINIFY=1 but terser is not installed. Install terser or run make MINIFY=0." >&2; \
			exit 1; \
		fi; \
		mv "$@.tmp" "$@"; \
	fi
	@size=$$(wc -c < "$@"); \
	if [ $$size -gt $(SIZE_WARNING_BYTES) ]; then \
		echo "Warning: $@ is $$size bytes and exceeds $(SIZE_WARNING_BYTES) bytes"; \
	fi

clean:
	rm -f $(OUTPUTS)
