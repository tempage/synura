TSC ?= tsc
TSC_FLAGS ?= --target ES2018 --module none --lib ES2018,DOM --skipLibCheck --pretty false --removeComments --noEmitOnError
TERSER ?= terser
TERSER_FLAGS ?= -c -m --ecma 2018
MINIFY ?= 1
SIZE_WARNING_BYTES ?= 131072

ROOT_EXTENSION_TARGETS = youtube
ROOT_OUTPUTS = $(addsuffix .js,$(ROOT_EXTENSION_TARGETS))

KO_KR_COMMON_TS = ko_KR/community_common.ts
KO_KR_EXTENSION_TARGETS = arca clien damoang dcinside fmkorea inven mlbpark pann ppomppu ruliweb theqoo
KO_KR_TARGETS = $(addprefix ko_KR/,$(KO_KR_EXTENSION_TARGETS))
KO_KR_OUTPUTS = $(addsuffix .js,$(KO_KR_TARGETS))

OUTPUTS = $(ROOT_OUTPUTS) $(KO_KR_OUTPUTS)

.PHONY: all build check clean \
	$(ROOT_EXTENSION_TARGETS) \
	$(KO_KR_EXTENSION_TARGETS) \
	$(KO_KR_TARGETS)

all: build

build: $(OUTPUTS)
	@echo "Built $(words $(OUTPUTS)) extension outputs:"
	@for file in $(OUTPUTS); do \
		size=$$(wc -c < "$$file"); \
		echo " - $$file ($$size bytes)"; \
		if [ $$size -gt $(SIZE_WARNING_BYTES) ]; then \
			echo "   Warning: $$file exceeds $(SIZE_WARNING_BYTES) bytes"; \
		fi; \
	done

check: build

$(ROOT_EXTENSION_TARGETS): %: %.js

$(KO_KR_EXTENSION_TARGETS): %: ko_KR/%.js

$(KO_KR_TARGETS): %: %.js

define compile_js
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
endef

ko_KR/%.js: ko_KR/%.ts $(KO_KR_COMMON_TS)
	$(compile_js)

%.js: %.ts
	$(compile_js)

clean:
	rm -f $(OUTPUTS)
