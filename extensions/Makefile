TSC ?= tsc
TSC_FLAGS ?= --target ES2018 --module none --lib ES2018,DOM --skipLibCheck --pretty false --removeComments --noEmitOnError
TERSER ?= terser
TERSER_FLAGS ?= --ecma 2018
TERSER_COMPRESS_FLAGS ?= toplevel=true
TERSER_MANGLE_FLAGS ?= toplevel=true,reserved=[SYNURA,SITE]
MINIFY ?= 1
SIZE_WARNING_BYTES ?= 131072

ROOT_EXTENSION_TARGETS = youtube
ROOT_OUTPUTS = $(addsuffix .js,$(ROOT_EXTENSION_TARGETS))

COMMUNITY_COMMON_TS = community_common.ts
KO_KR_EXTENSION_TARGETS = arca clien damoang dcinside fmkorea geeknews instiz inven mlbpark pann ppomppu ruliweb theqoo todayhumor
KO_KR_TARGETS = $(addprefix ko_KR/,$(KO_KR_EXTENSION_TARGETS))
KO_KR_OUTPUTS = $(addsuffix .js,$(KO_KR_TARGETS))

EN_US_EXTENSION_TARGETS = hackernews
EN_US_TARGETS = $(addprefix en_US/,$(EN_US_EXTENSION_TARGETS))
EN_US_OUTPUTS = $(addsuffix .js,$(EN_US_TARGETS))

LOCAL_COMMUNITY_DIRS = ar_SA bn_BD de_DE en_US es_419 es_ES fa_IR fr_FR he_IL hi_IN id_ID it_IT ja_JP pl_PL pt_BR pt_PT ru_RU th_TH tr_TR vi_VN zh_CN zh_TW
LOCAL_COMMUNITY_TS = $(filter-out en_US/hackernews.ts,$(foreach dir,$(LOCAL_COMMUNITY_DIRS),$(wildcard $(dir)/*.ts)))
LOCAL_COMMUNITY_TARGETS = $(basename $(LOCAL_COMMUNITY_TS))
LOCAL_COMMUNITY_OUTPUTS = $(addsuffix .js,$(LOCAL_COMMUNITY_TARGETS))

OUTPUTS = $(ROOT_OUTPUTS) $(KO_KR_OUTPUTS) $(EN_US_OUTPUTS) $(LOCAL_COMMUNITY_OUTPUTS)
COMMUNITY_LOCALES = ar_SA bn_BD de_DE en_US es_419 es_ES fa_IR fr_FR he_IL hi_IN id_ID it_IT ja_JP ko_KR pl_PL pt_BR pt_PT ru_RU th_TH tr_TR vi_VN zh_CN zh_TW
COMMUNITY_LANGUAGE_ALIASES = ar bn de en es fa fr he hi id it ja ko pl pt ru th tr vi zh
COMMUNITY_LOCALE_BUILD_TARGETS = $(addprefix build_,$(addsuffix _community_extensions,$(COMMUNITY_LOCALES)))
COMMUNITY_LANGUAGE_ALIAS_TARGETS = $(addprefix build_,$(addsuffix _community_extensions,$(COMMUNITY_LANGUAGE_ALIASES)))
COMMUNITY_LOCALE_COMMON_TS = $(addprefix community_common_,$(addsuffix .ts,$(COMMUNITY_LOCALES)))

community_locale_outputs = $(addsuffix .js,$(basename $(wildcard $(1)/*.ts)))

.PHONY: all build check clean build_ko_community_extensions build_local_community_extensions build_all_country_community_extensions \
	$(COMMUNITY_LOCALE_BUILD_TARGETS) \
	$(COMMUNITY_LANGUAGE_ALIAS_TARGETS) \
	$(ROOT_EXTENSION_TARGETS) \
	$(KO_KR_EXTENSION_TARGETS) \
	$(KO_KR_TARGETS) \
	$(EN_US_EXTENSION_TARGETS) \
	$(EN_US_TARGETS) \
	$(LOCAL_COMMUNITY_TARGETS)

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

define community_locale_target
build_$(1)_community_extensions: $(call community_locale_outputs,$(1))
	@echo "Built $(words $(call community_locale_outputs,$(1))) $(1) extension outputs:"
	@for file in $(call community_locale_outputs,$(1)); do \
		size=$$$$(wc -c < "$$$$file"); \
		echo " - $$$$file ($$$$size bytes)"; \
		if [ $$$$size -gt $(SIZE_WARNING_BYTES) ]; then \
			echo "   Warning: $$$$file exceeds $(SIZE_WARNING_BYTES) bytes"; \
		fi; \
	done
endef

$(foreach locale,$(COMMUNITY_LOCALES),$(eval $(call community_locale_target,$(locale))))

build_ar_community_extensions: build_ar_SA_community_extensions
build_bn_community_extensions: build_bn_BD_community_extensions
build_de_community_extensions: build_de_DE_community_extensions
build_en_community_extensions: build_en_US_community_extensions
build_es_community_extensions: build_es_419_community_extensions build_es_ES_community_extensions
build_fa_community_extensions: build_fa_IR_community_extensions
build_fr_community_extensions: build_fr_FR_community_extensions
build_he_community_extensions: build_he_IL_community_extensions
build_hi_community_extensions: build_hi_IN_community_extensions
build_id_community_extensions: build_id_ID_community_extensions
build_it_community_extensions: build_it_IT_community_extensions
build_ja_community_extensions: build_ja_JP_community_extensions
build_ko_community_extensions: build_ko_KR_community_extensions
build_pl_community_extensions: build_pl_PL_community_extensions
build_pt_community_extensions: build_pt_BR_community_extensions build_pt_PT_community_extensions
build_ru_community_extensions: build_ru_RU_community_extensions
build_th_community_extensions: build_th_TH_community_extensions
build_tr_community_extensions: build_tr_TR_community_extensions
build_vi_community_extensions: build_vi_VN_community_extensions
build_zh_community_extensions: build_zh_CN_community_extensions build_zh_TW_community_extensions

build_local_community_extensions build_all_country_community_extensions: $(KO_KR_OUTPUTS) $(EN_US_OUTPUTS) $(LOCAL_COMMUNITY_OUTPUTS)
	@echo "Built $(words $(KO_KR_OUTPUTS) $(EN_US_OUTPUTS) $(LOCAL_COMMUNITY_OUTPUTS)) community extension outputs:"
	@for file in $(KO_KR_OUTPUTS) $(EN_US_OUTPUTS) $(LOCAL_COMMUNITY_OUTPUTS); do \
		size=$$(wc -c < "$$file"); \
		echo " - $$file ($$size bytes)"; \
		if [ $$size -gt $(SIZE_WARNING_BYTES) ]; then \
			echo "   Warning: $$file exceeds $(SIZE_WARNING_BYTES) bytes"; \
		fi; \
	done

$(ROOT_EXTENSION_TARGETS): %: %.js

$(KO_KR_EXTENSION_TARGETS): %: ko_KR/%.js

$(EN_US_EXTENSION_TARGETS): %: en_US/%.js

$(KO_KR_TARGETS): %: %.js

$(EN_US_TARGETS): %: %.js

$(LOCAL_COMMUNITY_TARGETS): %: %.js

ko_KR/geeknews.js: ko_KR/geeknews.ts
	$(compile_js)

en_US/hackernews.js: en_US/hackernews.ts community_common_en_US.ts $(COMMUNITY_COMMON_TS)
	$(compile_js)

define community_locale_compile_rule
$(1)/%.js: $(1)/%.ts community_common_$(1).ts $(COMMUNITY_COMMON_TS)
	$$(compile_js)
endef

$(foreach locale,$(COMMUNITY_LOCALES),$(eval $(call community_locale_compile_rule,$(locale))))

define compile_js
	$(TSC) $(TSC_FLAGS) --outFile $@ $^
	@awk '{gsub(/^[[:space:]]+|[[:space:]]+$$/,""); if ($$0 != "" && $$0 != "\"use strict\";" && $$0 !~ /^\/\/# sourceMappingURL=/) print}' $@ > $@.tmp
	@mv $@.tmp $@
	@if [ "$(MINIFY)" = "1" ]; then \
		if command -v "$(TERSER)" >/dev/null 2>&1; then \
			"$(TERSER)" "$@" $(TERSER_FLAGS) --compress "$(TERSER_COMPRESS_FLAGS)" --mangle "$(TERSER_MANGLE_FLAGS)" -o "$@.tmp"; \
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

%.js: %.ts
	$(compile_js)

clean:
	rm -f $(OUTPUTS)
