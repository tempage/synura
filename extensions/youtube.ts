// @ts-nocheck
var SYNURA = {
  domain: "m.youtube.com",
  name: "test_youtube",
  author: "Synura Team",
  description: "Unofficial YouTube extension with search, comments, and related videos.",
  version: .1,
  api: 0,
  license: "Apache-2.0",
  locale: "",
  bypass: "chrome/android",
  deeplink: !0,
  tags: [ "video", "streaming", "search" ],
  get main() {
    return handler;
  }
}, DEFAULT_QUERY = "technology", DEFAULT_HL = "en", DEFAULT_GL = "US", DEFAULT_CLIENT_NAME = "MWEB", DEFAULT_CLIENT_VERSION = "2.20260304.01.00", DEFAULT_API_KEY = "", HOME_FALLBACK_CLIENT_NAME = "WEB", HOME_FALLBACK_CLIENT_VERSION = "2.20260312.08.00", HOME_FALLBACK_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8", YT_ORIGIN = "https://" + SYNURA.domain, QUICK_QUERIES = [ {
  labelKey: "quick_query_trending",
  query: "trending videos"
}, {
  labelKey: "quick_query_music",
  query: "latest music videos"
}, {
  labelKey: "quick_query_gaming",
  query: "gaming highlights"
}, {
  labelKey: "quick_query_news",
  query: "world news live"
}, {
  labelKey: "quick_query_coding",
  query: "software engineering"
} ], HOME_TRENDING_SEARCH_QUERIES = {
  ar: "الفيديوهات الرائجة",
  bn: "জনপ্রিয় ভিডিও",
  "zh-CN": "热门 视频",
  "zh-TW": "熱門 影片",
  en: "trending videos",
  fr: "videos tendance",
  de: "trend videos",
  hi: "ट्रेंडिंग वीडियो",
  it: "video di tendenza",
  id: "video trending",
  ja: "人気 動画",
  ko: "한국 인기 동영상",
  pl: "popularne filmy",
  pt: "videos em alta",
  ru: "популярные видео",
  es: "videos en tendencia",
  th: "วิดีโอยอดนิยม",
  tr: "trend videolar",
  vi: "video thịnh hành",
  ur: "ٹرینڈنگ ویڈیوز"
}, SEARCH_MENU_OPEN = "menu_open_youtube", POST_MENU_OPEN = "menu_open_browser", POST_MENU_RELATED = "menu_open_related", POST_MENU_CHANNEL = "menu_open_channel", MENU_SETTINGS = "menu_settings", HOME_MENU_CHANNEL_LIST = "menu_channel_list", CHANNEL_MENU_BOOKMARK = "menu_bookmark_channel", CHANNEL_MENU_UNBOOKMARK = "menu_remove_bookmark", CHANNEL_MENU_OPEN_BROWSER = "menu_open_channel_browser", CHANNEL_MENU_ENABLE_VIDEOS = "menu_enable_videos", CHANNEL_MENU_ENABLE_STREAMS = "menu_enable_streams", MENU_ENABLE_SHORTS = "menu_enable_shorts", ITEM_MENU_OPEN_BROWSER = "menu_open_browser", ITEM_MENU_OPEN_VIDEO = "menu_open_video", ITEM_MENU_OPEN_CHANNEL = "menu_open_channel", ITEM_MENU_REMOVE_BOOKMARK = "menu_remove_bookmark", BUTTON_SAVE = "button_save", BUTTON_CLEAR = "button_clear", BUTTON_CANCEL = "button_cancel", VIDEO_SORT_DATE = "date", VIDEO_SORT_VIEWS = "views", VIDEO_SORT_STARRED = "starred", VIDEO_SORT_IDS = [ VIDEO_SORT_DATE, VIDEO_SORT_VIEWS, VIDEO_SORT_STARRED ], VIDEO_SORT_LABELS = {
  date: {
    ar: "الأحدث",
    bn: "সর্বশেষ",
    "zh-CN": "最新",
    "zh-TW": "最新",
    en: "Latest",
    fr: "Plus récentes",
    de: "Neueste",
    hi: "नवीनतम",
    it: "Più recenti",
    id: "Terbaru",
    ja: "新しい順",
    ko: "최신순",
    pl: "Najnowsze",
    pt: "Mais recentes",
    ru: "Новые",
    es: "Más recientes",
    th: "ล่าสุด",
    tr: "En yeni",
    vi: "Mới nhất",
    ur: "تازہ ترین"
  },
  views: {
    ar: "الشائع",
    bn: "জনপ্রিয়",
    "zh-CN": "热门",
    "zh-TW": "熱門",
    en: "Popular",
    fr: "Populaires",
    de: "Beliebt",
    hi: "लोकप्रिय",
    it: "Popolari",
    id: "Populer",
    ja: "人気順",
    ko: "인기순",
    pl: "Popularne",
    pt: "Populares",
    ru: "Популярные",
    es: "Populares",
    th: "ยอดนิยม",
    tr: "Popüler",
    vi: "Phổ biến",
    ur: "مقبول"
  },
  starred: {
    ar: "القنوات المشترَك فيها أولاً",
    bn: "সাবস্ক্রাইব করা চ্যানেল আগে",
    "zh-CN": "已订阅频道优先",
    "zh-TW": "已訂閱頻道優先",
    en: "Subscribed Channels First",
    fr: "Chaînes abonnées d'abord",
    de: "Abonnierte Kanäle zuerst",
    hi: "सदस्यता वाले चैनल पहले",
    it: "Canali iscritti prima",
    id: "Channel langganan lebih dulu",
    ja: "登録チャンネルを優先",
    ko: "구독 채널 우선",
    pl: "Najpierw subskrybowane kanały",
    pt: "Canais inscritos primeiro",
    ru: "Сначала подписки",
    es: "Canales suscritos primero",
    th: "ช่องที่ติดตามก่อน",
    tr: "Abone olunan kanallar önce",
    vi: "Ưu tiên kênh đã đăng ký",
    ur: "سبسکرائب شدہ چینلز پہلے"
  }
}, STARRED_CHANNELS_KEY = "youtube_starred_channels_v1", API_KEY_OVERRIDE_STORAGE_KEY = "youtube_api_key_override_v1", LANGUAGE_OVERRIDE_STORAGE_KEY = "youtube_language_override_v1", CHANNEL_LIST_CHUNK_SIZE_STORAGE_KEY = "youtube_channel_list_chunk_size_v1", VIDEO_LIST_FILTERS_STORAGE_KEY = "youtube_video_list_filters_v1", INNERTUBE_CONFIG_CACHE_KEY = "youtube_innertube_config_v1", CHANNEL_PAGE_CACHE_TTL_MS = 3e5, CHANNEL_PAGE_CACHE_LIMIT = 24, DEFAULT_CHANNEL_LIST_CHUNK_SIZE = 16, CHANNEL_HOME_PREVIEW_MIN_ITEMS = 16, CHANNEL_HOME_PREVIEW_MAX_ITEMS = 32, CHANNEL_HOME_PREVIEW_MULTIPLIER = 1, innertubeConfigCache = null, channelPageCache = {}, channelPageCacheOrder = [], YOUTUBE_LANGUAGES = [ {
  code: "ar",
  label: "العربية",
  hl: "ar",
  gl: "SA",
  acceptLanguage: "ar-SA,ar;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "bn",
  label: "বাংলা",
  hl: "bn",
  gl: "BD",
  acceptLanguage: "bn-BD,bn;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "zh-CN",
  label: "中文（简体）",
  hl: "zh-CN",
  gl: "CN",
  acceptLanguage: "zh-CN,zh;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "zh-TW",
  label: "中文（繁體）",
  hl: "zh-TW",
  gl: "TW",
  acceptLanguage: "zh-TW,zh;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "en",
  label: "English",
  hl: "en",
  gl: "US",
  acceptLanguage: "en-US,en;q=0.9"
}, {
  code: "fr",
  label: "Français",
  hl: "fr",
  gl: "FR",
  acceptLanguage: "fr-FR,fr;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "de",
  label: "Deutsch",
  hl: "de",
  gl: "DE",
  acceptLanguage: "de-DE,de;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "hi",
  label: "हिन्दी",
  hl: "hi",
  gl: "IN",
  acceptLanguage: "hi-IN,hi;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "it",
  label: "Italiano",
  hl: "it",
  gl: "IT",
  acceptLanguage: "it-IT,it;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "id",
  label: "Bahasa Indonesia",
  hl: "id",
  gl: "ID",
  acceptLanguage: "id-ID,id;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "ja",
  label: "日本語",
  hl: "ja",
  gl: "JP",
  acceptLanguage: "ja-JP,ja;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "ko",
  label: "한국어",
  hl: "ko",
  gl: "KR",
  acceptLanguage: "ko-KR,ko;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "pl",
  label: "Polski",
  hl: "pl",
  gl: "PL",
  acceptLanguage: "pl-PL,pl;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "pt",
  label: "Português",
  hl: "pt",
  gl: "BR",
  acceptLanguage: "pt-BR,pt;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "ru",
  label: "Русский",
  hl: "ru",
  gl: "RU",
  acceptLanguage: "ru-RU,ru;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "es",
  label: "Español",
  hl: "es",
  gl: "ES",
  acceptLanguage: "es-ES,es;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "th",
  label: "ไทย",
  hl: "th",
  gl: "TH",
  acceptLanguage: "th-TH,th;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "tr",
  label: "Türkçe",
  hl: "tr",
  gl: "TR",
  acceptLanguage: "tr-TR,tr;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "vi",
  label: "Tiếng Việt",
  hl: "vi",
  gl: "VN",
  acceptLanguage: "vi-VN,vi;q=0.9,en-US;q=0.6,en;q=0.5"
}, {
  code: "ur",
  label: "اردو",
  hl: "ur",
  gl: "PK",
  acceptLanguage: "ur-PK,ur;q=0.9,en-US;q=0.6,en;q=0.5"
} ], UI_STRING_KEYS = [ "quick_query_trending", "quick_query_music", "quick_query_gaming", "quick_query_news", "quick_query_coding", "menu_open_youtube", "menu_open_browser", "menu_open_related", "menu_open_channel", "menu_settings", "menu_channel_list", "menu_bookmark_channel", "menu_remove_bookmark", "menu_open_channel_browser", "menu_enable_videos", "menu_enable_streams", "menu_enable_shorts", "menu_open_video", "button_save", "button_clear", "button_cancel", "title_starred_channels", "title_youtube", "title_related_videos", "title_channel", "title_browser", "title_search_results", "appbar_search_youtube", "appbar_search_videos_hint", "appbar_search_channel", "appbar_search_in_channel_hint", "loading_starred_channels", "loading_videos", "loading_channel_items", "label_loading", "label_youtube_user", "label_untitled", "label_live_stream", "label_saved_on", "label_bookmarked", "prompt_type_search_query", "snackbar_no_related_videos", "snackbar_removed_bookmark", "snackbar_bookmark_not_found", "snackbar_channel_bookmarked", "snackbar_channel_already_bookmarked", "snackbar_bookmark_removed", "snackbar_settings_saved", "snackbar_settings_cleared", "snackbar_channel_list_saved", "snackbar_no_starred_channels", "snackbar_all_channels_disabled", "snackbar_no_starred_channels_yet", "snackbar_no_results_in_channel", "snackbar_no_videos_or_streams_found", "snackbar_no_videos_found", "snackbar_no_live_streams_found", "snackbar_videos_and_streams_disabled", "snackbar_no_more_channel_items", "snackbar_no_more_results", "snackbar_no_more_related_videos", "snackbar_no_more_comments", "dialog_settings_message", "dialog_channel_list_message", "field_api_key", "field_language", "field_initial_channel_items", "fallback_channel_number", "error_could_not_open_channel", "error_could_not_find_channel", "error_could_not_find_video_id", "error_invalid_language_selection", "error_invalid_channel_items", "error_could_not_save_api_key", "error_could_not_clear_api_key", "error_could_not_save_channel_list_limit", "error_could_not_save_language", "error_could_not_clear_settings", "error_could_not_open_settings", "error_could_not_save_channel_list", "error_could_not_open_channel_list", "error_channel_load_failed", "error_could_not_load_full_channel_list", "error_could_not_load_more_channel_items", "error_search_failed", "error_could_not_load_more_videos", "error_could_not_load_related_videos", "error_failed_to_load_video", "error_could_not_load_more_comments" ], UI_STRINGS = {
  en: [ "Trending", "Music", "Gaming", "News", "Coding", "Open YouTube", "Open in Browser", "Open Related", "Open Channel", "Settings", "Subscriptions", "Subscribe", "Unsubscribe", "Open Channel in Browser", "Show Videos", "Show Live Streams", "Show Shorts", "Open Video", "Save", "Clear", "Cancel", "Subscriptions", "YouTube", "Related Videos", "Channel", "Browser", "YouTube - {query}", "Search YouTube", "Search videos", "Search {channel}", "Search in this channel", "Loading subscriptions...", "Loading videos...", "Loading channel videos and live streams...", "Loading...", "YouTube User", "Untitled", "Live stream", "Subscribed on {date}", "Subscribed", "Type a search query.", "No related videos available.", "Unsubscribed.", "Subscription not found.", "Subscribed to channel.", "Already subscribed to channel.", "Unsubscribed.", "Settings saved. Pull to refresh.", "Settings cleared. Pull to refresh.", "Channel list saved.", "No subscriptions.", "All subscriptions are disabled. Open Subscriptions.", "No subscriptions yet.", "No results in this channel for \"{query}\".", "No videos or live streams found.", "No videos found.", "No live streams found.", "Videos and live streams are disabled.", "No more channel items.", "No more results.", "No more related videos.", "No more comments.", "Update YouTube API key, language, and initial channel list limit.", "Enable or disable subscriptions.", "API Key", "Language", "Initial Channel Items", "Channel {index}", "Could not open channel.", "Could not find channel.", "Could not find video id.", "Invalid language selection.", "Initial channel items must be 1 or higher.", "Could not save API key.", "Could not clear API key.", "Could not save channel list limit.", "Could not save language.", "Could not clear settings.", "Could not open settings.", "Could not save channel list.", "Could not open channel list.", "Channel load failed: {error}", "Could not load full channel list: {error}", "Could not load more channel items: {error}", "Search failed: {error}", "Could not load more videos: {error}", "Could not load related videos: {error}", "Failed to load video: {error}", "Could not load more comments: {error}" ],
  ko: [ "인기", "음악", "게임", "뉴스", "코딩", "YouTube 열기", "브라우저에서 열기", "관련 영상 열기", "채널 열기", "설정", "구독", "구독", "구독 취소", "브라우저에서 채널 열기", "동영상 보기", "라이브 보기", "쇼츠 보기", "영상 열기", "저장", "초기화", "취소", "구독", "YouTube", "관련 영상", "채널", "브라우저", "YouTube - {query}", "YouTube 검색", "영상 검색", "{channel} 검색", "이 채널에서 검색", "구독 채널을 불러오는 중...", "영상을 불러오는 중...", "채널 영상과 라이브를 불러오는 중...", "불러오는 중...", "YouTube 사용자", "제목 없음", "라이브", "구독일 {date}", "구독 중", "검색어를 입력하세요.", "관련 영상이 없습니다.", "구독을 취소했습니다.", "구독 정보를 찾을 수 없습니다.", "채널을 구독했습니다.", "이미 구독한 채널입니다.", "구독을 취소했습니다.", "설정을 저장했습니다. 새로고침하세요.", "설정을 초기화했습니다. 새로고침하세요.", "채널 목록을 저장했습니다.", "구독한 채널이 없습니다.", "모든 구독 채널이 비활성화되어 있습니다. 구독을 여세요.", "아직 구독한 채널이 없습니다.", "\"{query}\"에 대한 채널 내 결과가 없습니다.", "동영상이나 라이브를 찾을 수 없습니다.", "동영상을 찾을 수 없습니다.", "라이브를 찾을 수 없습니다.", "동영상과 라이브가 모두 비활성화되어 있습니다.", "채널 항목이 더 없습니다.", "더 이상 결과가 없습니다.", "더 이상 관련 영상이 없습니다.", "더 이상 댓글이 없습니다.", "YouTube API 키, 언어, 초기 채널 항목 수를 설정합니다.", "구독 채널의 사용 여부를 설정합니다.", "API 키", "언어", "초기 채널 항목 수", "채널 {index}", "채널을 열 수 없습니다.", "채널을 찾을 수 없습니다.", "영상 ID를 찾을 수 없습니다.", "언어 선택이 올바르지 않습니다.", "초기 채널 항목 수는 1 이상이어야 합니다.", "API 키를 저장할 수 없습니다.", "API 키를 지울 수 없습니다.", "채널 목록 개수를 저장할 수 없습니다.", "언어를 저장할 수 없습니다.", "설정을 초기화할 수 없습니다.", "설정을 열 수 없습니다.", "채널 목록을 저장할 수 없습니다.", "채널 목록을 열 수 없습니다.", "채널 로드 실패: {error}", "전체 채널 목록을 불러올 수 없습니다: {error}", "채널 항목을 더 불러올 수 없습니다: {error}", "검색 실패: {error}", "영상을 더 불러올 수 없습니다: {error}", "관련 영상을 불러올 수 없습니다: {error}", "영상을 불러오지 못했습니다: {error}", "댓글을 더 불러올 수 없습니다: {error}" ],
  es: [ "Tendencias", "Música", "Juegos", "Noticias", "Programación", "Abrir YouTube", "Abrir en el navegador", "Abrir relacionados", "Abrir canal", "Ajustes", "Suscripciones", "Suscribirse", "Cancelar suscripción", "Abrir canal en el navegador", "Mostrar videos", "Mostrar directos", "Show Shorts", "Abrir video", "Guardar", "Borrar", "Cancelar", "Suscripciones", "YouTube", "Videos relacionados", "Canal", "Navegador", "YouTube - {query}", "Buscar en YouTube", "Buscar videos", "Buscar en {channel}", "Buscar en este canal", "Cargando suscripciones...", "Cargando videos...", "Cargando videos y directos del canal...", "Cargando...", "Usuario de YouTube", "Sin título", "Directo", "Suscrito el {date}", "Suscrito", "Escribe una búsqueda.", "No hay videos relacionados.", "Suscripción cancelada.", "No se encontró la suscripción.", "Canal suscrito.", "Ya estás suscrito a este canal.", "Suscripción cancelada.", "Ajustes guardados. Desliza para refrescar.", "Ajustes borrados. Desliza para refrescar.", "Lista de canales guardada.", "No hay suscripciones.", "Todas las suscripciones están desactivadas. Abre Suscripciones.", "Todavía no hay suscripciones.", "No hay resultados en este canal para \"{query}\".", "No se encontraron videos ni directos.", "No se encontraron videos.", "No se encontraron directos.", "Los videos y directos están desactivados.", "No hay más elementos del canal.", "No hay más resultados.", "No hay más videos relacionados.", "No hay más comentarios.", "Actualiza la clave de la API de YouTube, el idioma y el límite inicial de elementos del canal.", "Activa o desactiva las suscripciones.", "Clave API", "Idioma", "Elementos iniciales del canal", "Canal {index}", "No se pudo abrir el canal.", "No se pudo encontrar el canal.", "No se pudo encontrar el id del video.", "Selección de idioma no válida.", "Los elementos iniciales del canal deben ser 1 o más.", "No se pudo guardar la clave API.", "No se pudo borrar la clave API.", "No se pudo guardar el límite de la lista de canales.", "No se pudo guardar el idioma.", "No se pudieron borrar los ajustes.", "No se pudieron abrir los ajustes.", "No se pudo guardar la lista de canales.", "No se pudo abrir la lista de canales.", "Error al cargar el canal: {error}", "No se pudo cargar la lista completa del canal: {error}", "No se pudieron cargar más elementos del canal: {error}", "Búsqueda fallida: {error}", "No se pudieron cargar más videos: {error}", "No se pudieron cargar los videos relacionados: {error}", "No se pudo cargar el video: {error}", "No se pudieron cargar más comentarios: {error}" ],
  pt: [ "Em alta", "Música", "Jogos", "Notícias", "Programação", "Abrir YouTube", "Abrir no navegador", "Abrir relacionados", "Abrir canal", "Configurações", "Inscrições", "Inscrever-se", "Cancelar inscrição", "Abrir canal no navegador", "Mostrar vídeos", "Mostrar transmissões", "Show Shorts", "Abrir vídeo", "Salvar", "Limpar", "Cancelar", "Inscrições", "YouTube", "Vídeos relacionados", "Canal", "Navegador", "YouTube - {query}", "Pesquisar no YouTube", "Pesquisar vídeos", "Pesquisar em {channel}", "Pesquisar neste canal", "Carregando inscrições...", "Carregando vídeos...", "Carregando vídeos e transmissões do canal...", "Carregando...", "Usuário do YouTube", "Sem título", "Transmissão ao vivo", "Inscrito em {date}", "Inscrito", "Digite uma busca.", "Nenhum vídeo relacionado disponível.", "Inscrição cancelada.", "Inscrição não encontrada.", "Canal inscrito.", "Você já está inscrito neste canal.", "Inscrição cancelada.", "Configurações salvas. Puxe para atualizar.", "Configurações limpas. Puxe para atualizar.", "Lista de canais salva.", "Nenhuma inscrição.", "Todas as inscrições estão desativadas. Abra Inscrições.", "Ainda não há inscrições.", "Nenhum resultado neste canal para \"{query}\".", "Nenhum vídeo ou transmissão encontrado.", "Nenhum vídeo encontrado.", "Nenhuma transmissão encontrada.", "Vídeos e transmissões estão desativados.", "Não há mais itens do canal.", "Não há mais resultados.", "Não há mais vídeos relacionados.", "Não há mais comentários.", "Atualize a chave da API do YouTube, o idioma e o limite inicial de itens do canal.", "Ative ou desative as inscrições.", "Chave da API", "Idioma", "Itens iniciais do canal", "Canal {index}", "Não foi possível abrir o canal.", "Não foi possível encontrar o canal.", "Não foi possível encontrar o id do vídeo.", "Seleção de idioma inválida.", "Os itens iniciais do canal devem ser 1 ou mais.", "Não foi possível salvar a chave da API.", "Não foi possível limpar a chave da API.", "Não foi possível salvar o limite da lista de canais.", "Não foi possível salvar o idioma.", "Não foi possível limpar as configurações.", "Não foi possível abrir as configurações.", "Não foi possível salvar a lista de canais.", "Não foi possível abrir a lista de canais.", "Falha ao carregar o canal: {error}", "Não foi possível carregar a lista completa do canal: {error}", "Não foi possível carregar mais itens do canal: {error}", "Falha na busca: {error}", "Não foi possível carregar mais vídeos: {error}", "Não foi possível carregar vídeos relacionados: {error}", "Não foi possível carregar o vídeo: {error}", "Não foi possível carregar mais comentários: {error}" ],
  ja: [ "急上昇", "音楽", "ゲーム", "ニュース", "コーディング", "YouTubeを開く", "ブラウザで開く", "関連動画を開く", "チャンネルを開く", "設定", "登録チャンネル", "チャンネル登録", "登録解除", "ブラウザでチャンネルを開く", "動画を表示", "ライブ配信を表示", "Show Shorts", "動画を開く", "保存", "クリア", "キャンセル", "登録チャンネル", "YouTube", "関連動画", "チャンネル", "ブラウザ", "YouTube - {query}", "YouTubeを検索", "動画を検索", "{channel} を検索", "このチャンネル内を検索", "登録チャンネルを読み込み中...", "動画を読み込み中...", "チャンネルの動画とライブ配信を読み込み中...", "読み込み中...", "YouTubeユーザー", "無題", "ライブ配信", "{date} に登録", "登録済み", "検索語を入力してください。", "関連動画はありません。", "登録を解除しました。", "登録情報が見つかりません。", "チャンネル登録しました。", "このチャンネルは既に登録済みです。", "登録を解除しました。", "設定を保存しました。引っ張って更新してください。", "設定をクリアしました。引っ張って更新してください。", "チャンネル一覧を保存しました。", "登録チャンネルはありません。", "すべての登録チャンネルが無効です。登録チャンネルを開いてください。", "まだ登録チャンネルはありません。", "このチャンネルで \"{query}\" の結果はありません。", "動画またはライブ配信が見つかりません。", "動画が見つかりません。", "ライブ配信が見つかりません。", "動画とライブ配信は無効です。", "これ以上チャンネル項目はありません。", "これ以上結果はありません。", "これ以上関連動画はありません。", "これ以上コメントはありません。", "YouTube APIキー、言語、初期チャンネル項目数を更新します。", "登録チャンネルを有効または無効にします。", "APIキー", "言語", "初期チャンネル項目数", "チャンネル {index}", "チャンネルを開けませんでした。", "チャンネルが見つかりませんでした。", "動画IDが見つかりませんでした。", "無効な言語選択です。", "初期チャンネル項目数は1以上である必要があります。", "APIキーを保存できませんでした。", "APIキーをクリアできませんでした。", "チャンネル一覧の上限を保存できませんでした。", "言語を保存できませんでした。", "設定をクリアできませんでした。", "設定を開けませんでした。", "チャンネル一覧を保存できませんでした。", "チャンネル一覧を開けませんでした。", "チャンネルの読み込みに失敗しました: {error}", "チャンネル一覧全体を読み込めませんでした: {error}", "チャンネル項目をさらに読み込めませんでした: {error}", "検索に失敗しました: {error}", "動画をさらに読み込めませんでした: {error}", "関連動画を読み込めませんでした: {error}", "動画を読み込めませんでした: {error}", "コメントをさらに読み込めませんでした: {error}" ],
  "zh-CN": [ "趋势", "音乐", "游戏", "新闻", "编程", "打开 YouTube", "在浏览器中打开", "打开相关视频", "打开频道", "设置", "订阅", "订阅", "取消订阅", "在浏览器中打开频道", "显示视频", "显示直播", "Show Shorts", "打开视频", "保存", "清除", "取消", "订阅", "YouTube", "相关视频", "频道", "浏览器", "YouTube - {query}", "搜索 YouTube", "搜索视频", "搜索 {channel}", "在此频道中搜索", "正在加载订阅...", "正在加载视频...", "正在加载频道视频和直播...", "加载中...", "YouTube 用户", "无标题", "直播", "订阅于 {date}", "已订阅", "请输入搜索内容。", "没有相关视频。", "已取消订阅。", "未找到订阅。", "已订阅频道。", "该频道已订阅。", "已取消订阅。", "设置已保存。请下拉刷新。", "设置已清除。请下拉刷新。", "频道列表已保存。", "没有订阅。", "所有订阅均已禁用。请打开订阅。", "尚未订阅任何频道。", "此频道中没有 \"{query}\" 的结果。", "未找到视频或直播。", "未找到视频。", "未找到直播。", "视频和直播均已禁用。", "没有更多频道内容。", "没有更多结果。", "没有更多相关视频。", "没有更多评论。", "更新 YouTube API 密钥、语言和频道初始项目数。", "启用或禁用订阅。", "API 密钥", "语言", "频道初始项目数", "频道 {index}", "无法打开频道。", "找不到频道。", "找不到视频 ID。", "语言选择无效。", "频道初始项目数必须大于等于 1。", "无法保存 API 密钥。", "无法清除 API 密钥。", "无法保存频道列表限制。", "无法保存语言。", "无法清除设置。", "无法打开设置。", "无法保存频道列表。", "无法打开频道列表。", "频道加载失败: {error}", "无法加载完整频道列表: {error}", "无法加载更多频道内容: {error}", "搜索失败: {error}", "无法加载更多视频: {error}", "无法加载相关视频: {error}", "无法加载视频: {error}", "无法加载更多评论: {error}" ],
  de: [ "Trends", "Musik", "Gaming", "Nachrichten", "Programmierung", "YouTube öffnen", "Im Browser öffnen", "Ähnliche öffnen", "Kanal öffnen", "Einstellungen", "Abos", "Kanal abonnieren", "Abo beenden", "Kanal im Browser öffnen", "Videos anzeigen", "Livestreams anzeigen", "Show Shorts", "Video öffnen", "Speichern", "Zurücksetzen", "Abbrechen", "Abos", "YouTube", "Ähnliche Videos", "Kanal", "Browser", "YouTube - {query}", "YouTube durchsuchen", "Videos suchen", "{channel} durchsuchen", "In diesem Kanal suchen", "Abos werden geladen...", "Videos werden geladen...", "Kanalvideos und Livestreams werden geladen...", "Wird geladen...", "YouTube-Nutzer", "Ohne Titel", "Livestream", "Abonniert am {date}", "Abonniert", "Suchbegriff eingeben.", "Keine ähnlichen Videos verfügbar.", "Abo beendet.", "Abo nicht gefunden.", "Kanal abonniert.", "Kanal ist bereits abonniert.", "Abo beendet.", "Einstellungen gespeichert. Zum Aktualisieren herunterziehen.", "Einstellungen zurückgesetzt. Zum Aktualisieren herunterziehen.", "Kanalliste gespeichert.", "Keine Abos.", "Alle Abos sind deaktiviert. Öffne Abos.", "Noch keine Abos.", "Keine Ergebnisse in diesem Kanal für \"{query}\".", "Keine Videos oder Livestreams gefunden.", "Keine Videos gefunden.", "Keine Livestreams gefunden.", "Videos und Livestreams sind deaktiviert.", "Keine weiteren Kanalinhalte.", "Keine weiteren Ergebnisse.", "Keine weiteren ähnlichen Videos.", "Keine weiteren Kommentare.", "YouTube-API-Schlüssel, Sprache und anfängliches Kanallimit aktualisieren.", "Abos aktivieren oder deaktivieren.", "API-Schlüssel", "Sprache", "Anfängliche Kanalinhalte", "Kanal {index}", "Kanal konnte nicht geöffnet werden.", "Kanal konnte nicht gefunden werden.", "Video-ID konnte nicht gefunden werden.", "Ungültige Sprachauswahl.", "Anfängliche Kanalinhalte müssen 1 oder höher sein.", "API-Schlüssel konnte nicht gespeichert werden.", "API-Schlüssel konnte nicht gelöscht werden.", "Kanallistenlimit konnte nicht gespeichert werden.", "Sprache konnte nicht gespeichert werden.", "Einstellungen konnten nicht gelöscht werden.", "Einstellungen konnten nicht geöffnet werden.", "Kanalliste konnte nicht gespeichert werden.", "Kanalliste konnte nicht geöffnet werden.", "Kanal konnte nicht geladen werden: {error}", "Vollständige Kanalliste konnte nicht geladen werden: {error}", "Weitere Kanalinhalte konnten nicht geladen werden: {error}", "Suche fehlgeschlagen: {error}", "Weitere Videos konnten nicht geladen werden: {error}", "Ähnliche Videos konnten nicht geladen werden: {error}", "Video konnte nicht geladen werden: {error}", "Weitere Kommentare konnten nicht geladen werden: {error}" ],
  hi: [ "ट्रेंडिंग", "संगीत", "गेमिंग", "समाचार", "कोडिंग", "YouTube खोलें", "ब्राउज़र में खोलें", "संबंधित खोलें", "चैनल खोलें", "सेटिंग्स", "सदस्यताएं", "सदस्यता लें", "सदस्यता खत्म करें", "ब्राउज़र में चैनल खोलें", "वीडियो दिखाएं", "लाइव स्ट्रीम दिखाएं", "Show Shorts", "वीडियो खोलें", "सहेजें", "साफ करें", "रद्द करें", "सदस्यताएं", "YouTube", "संबंधित वीडियो", "चैनल", "ब्राउज़र", "YouTube - {query}", "YouTube खोजें", "वीडियो खोजें", "{channel} में खोजें", "इस चैनल में खोजें", "सदस्यताएं लोड हो रही हैं...", "वीडियो लोड हो रहे हैं...", "चैनल के वीडियो और लाइव स्ट्रीम लोड हो रहे हैं...", "लोड हो रहा है...", "YouTube उपयोगकर्ता", "बिना शीर्षक", "लाइव स्ट्रीम", "{date} को सदस्यता ली", "सदस्य", "खोज लिखें।", "कोई संबंधित वीडियो उपलब्ध नहीं है।", "सदस्यता खत्म कर दी गई।", "सदस्यता नहीं मिली।", "चैनल की सदस्यता ली गई।", "इस चैनल की सदस्यता पहले से ली गई है।", "सदस्यता खत्म कर दी गई।", "सेटिंग्स सहेज ली गईं। रीफ्रेश करने के लिए नीचे खींचें।", "सेटिंग्स साफ कर दी गईं। रीफ्रेश करने के लिए नीचे खींचें।", "चैनल सूची सहेज ली गई।", "कोई सदस्यता नहीं है।", "सभी सदस्यताएं अक्षम हैं। सदस्यताएं खोलें।", "अभी तक कोई सदस्यता नहीं है।", "इस चैनल में \"{query}\" के लिए कोई परिणाम नहीं है।", "कोई वीडियो या लाइव स्ट्रीम नहीं मिली।", "कोई वीडियो नहीं मिला।", "कोई लाइव स्ट्रीम नहीं मिली।", "वीडियो और लाइव स्ट्रीम अक्षम हैं।", "और चैनल आइटम नहीं हैं।", "और परिणाम नहीं हैं।", "और संबंधित वीडियो नहीं हैं।", "और टिप्पणियां नहीं हैं।", "YouTube API कुंजी, भाषा और प्रारंभिक चैनल आइटम सीमा अपडेट करें।", "सदस्यताओं को सक्षम या अक्षम करें।", "API कुंजी", "भाषा", "प्रारंभिक चैनल आइटम", "चैनल {index}", "चैनल नहीं खोला जा सका।", "चैनल नहीं मिला।", "वीडियो आईडी नहीं मिली।", "अमान्य भाषा चयन।", "प्रारंभिक चैनल आइटम 1 या अधिक होने चाहिए।", "API कुंजी सहेजी नहीं जा सकी।", "API कुंजी साफ नहीं की जा सकी।", "चैनल सूची सीमा सहेजी नहीं जा सकी।", "भाषा सहेजी नहीं जा सकी।", "सेटिंग्स साफ नहीं की जा सकीं।", "सेटिंग्स नहीं खुल सकीं।", "चैनल सूची सहेजी नहीं जा सकी।", "चैनल सूची नहीं खुल सकी।", "चैनल लोड नहीं हो सका: {error}", "पूरी चैनल सूची लोड नहीं की जा सकी: {error}", "और चैनल आइटम लोड नहीं किए जा सके: {error}", "खोज विफल रही: {error}", "और वीडियो लोड नहीं किए जा सके: {error}", "संबंधित वीडियो लोड नहीं किए जा सके: {error}", "वीडियो लोड नहीं किया जा सका: {error}", "और टिप्पणियां लोड नहीं की जा सकीं: {error}" ],
  ar: [ "الرائج", "الموسيقى", "الألعاب", "الأخبار", "البرمجة", "فتح YouTube", "فتح في المتصفح", "فتح المقاطع ذات الصلة", "فتح القناة", "الإعدادات", "الاشتراكات", "اشتراك", "إلغاء الاشتراك", "فتح القناة في المتصفح", "إظهار الفيديوهات", "إظهار البث المباشر", "Show Shorts", "فتح الفيديو", "حفظ", "مسح", "إلغاء", "الاشتراكات", "YouTube", "الفيديوهات ذات الصلة", "القناة", "المتصفح", "YouTube - {query}", "البحث في YouTube", "البحث عن فيديوهات", "البحث في {channel}", "البحث في هذه القناة", "جارٍ تحميل الاشتراكات...", "جارٍ تحميل الفيديوهات...", "جارٍ تحميل فيديوهات القناة والبث المباشر...", "جارٍ التحميل...", "مستخدم YouTube", "بدون عنوان", "بث مباشر", "تم الاشتراك في {date}", "مشترك", "اكتب عبارة البحث.", "لا توجد فيديوهات ذات صلة.", "تم إلغاء الاشتراك.", "لم يتم العثور على الاشتراك.", "تم الاشتراك في القناة.", "أنت مشترك في هذه القناة بالفعل.", "تم إلغاء الاشتراك.", "تم حفظ الإعدادات. اسحب للتحديث.", "تم مسح الإعدادات. اسحب للتحديث.", "تم حفظ قائمة القنوات.", "لا توجد اشتراكات.", "جميع الاشتراكات معطلة. افتح الاشتراكات.", "لا توجد اشتراكات بعد.", "لا توجد نتائج في هذه القناة لـ \"{query}\".", "لم يتم العثور على فيديوهات أو بث مباشر.", "لم يتم العثور على فيديوهات.", "لم يتم العثور على بث مباشر.", "الفيديوهات والبث المباشر معطلة.", "لا توجد عناصر قناة أخرى.", "لا توجد نتائج أخرى.", "لا توجد فيديوهات ذات صلة أخرى.", "لا توجد تعليقات أخرى.", "حدّث مفتاح API لـ YouTube واللغة وحد العناصر الأولية للقناة.", "فعّل أو عطّل الاشتراكات.", "مفتاح API", "اللغة", "عناصر القناة الأولية", "القناة {index}", "تعذر فتح القناة.", "تعذر العثور على القناة.", "تعذر العثور على معرّف الفيديو.", "اختيار لغة غير صالح.", "يجب أن تكون عناصر القناة الأولية 1 أو أكثر.", "تعذر حفظ مفتاح API.", "تعذر مسح مفتاح API.", "تعذر حفظ حد قائمة القنوات.", "تعذر حفظ اللغة.", "تعذر مسح الإعدادات.", "تعذر فتح الإعدادات.", "تعذر حفظ قائمة القنوات.", "تعذر فتح قائمة القنوات.", "فشل تحميل القناة: {error}", "تعذر تحميل قائمة القنوات الكاملة: {error}", "تعذر تحميل المزيد من عناصر القناة: {error}", "فشل البحث: {error}", "تعذر تحميل المزيد من الفيديوهات: {error}", "تعذر تحميل الفيديوهات ذات الصلة: {error}", "تعذر تحميل الفيديو: {error}", "تعذر تحميل المزيد من التعليقات: {error}" ],
  id: [ "Trending", "Musik", "Game", "Berita", "Pemrograman", "Buka YouTube", "Buka di Browser", "Buka Terkait", "Buka Channel", "Setelan", "Langganan", "Langganan", "Berhenti Berlangganan", "Buka Channel di Browser", "Tampilkan Video", "Tampilkan Siaran Langsung", "Show Shorts", "Buka Video", "Simpan", "Bersihkan", "Batal", "Langganan", "YouTube", "Video Terkait", "Channel", "Browser", "YouTube - {query}", "Cari di YouTube", "Cari video", "Cari di {channel}", "Cari di channel ini", "Memuat langganan...", "Memuat video...", "Memuat video dan siaran langsung channel...", "Memuat...", "Pengguna YouTube", "Tanpa Judul", "Siaran langsung", "Berlangganan pada {date}", "Berlangganan", "Ketik kata kunci.", "Tidak ada video terkait.", "Berhenti berlangganan.", "Langganan tidak ditemukan.", "Berhasil berlangganan channel.", "Channel ini sudah dilanggan.", "Berhenti berlangganan.", "Setelan disimpan. Tarik untuk memuat ulang.", "Setelan dibersihkan. Tarik untuk memuat ulang.", "Daftar channel disimpan.", "Tidak ada langganan.", "Semua langganan dinonaktifkan. Buka Langganan.", "Belum ada langganan.", "Tidak ada hasil di channel ini untuk \"{query}\".", "Tidak ditemukan video atau siaran langsung.", "Tidak ditemukan video.", "Tidak ditemukan siaran langsung.", "Video dan siaran langsung dinonaktifkan.", "Tidak ada item channel lagi.", "Tidak ada hasil lagi.", "Tidak ada video terkait lagi.", "Tidak ada komentar lagi.", "Perbarui kunci API YouTube, bahasa, dan batas item awal channel.", "Aktifkan atau nonaktifkan langganan.", "Kunci API", "Bahasa", "Item Awal Channel", "Channel {index}", "Tidak dapat membuka channel.", "Tidak dapat menemukan channel.", "Tidak dapat menemukan id video.", "Pilihan bahasa tidak valid.", "Item awal channel harus 1 atau lebih.", "Tidak dapat menyimpan kunci API.", "Tidak dapat menghapus kunci API.", "Tidak dapat menyimpan batas daftar channel.", "Tidak dapat menyimpan bahasa.", "Tidak dapat membersihkan setelan.", "Tidak dapat membuka setelan.", "Tidak dapat menyimpan daftar channel.", "Tidak dapat membuka daftar channel.", "Gagal memuat channel: {error}", "Tidak dapat memuat daftar channel lengkap: {error}", "Tidak dapat memuat item channel tambahan: {error}", "Pencarian gagal: {error}", "Tidak dapat memuat lebih banyak video: {error}", "Tidak dapat memuat video terkait: {error}", "Gagal memuat video: {error}", "Tidak dapat memuat lebih banyak komentar: {error}" ],
  fr: [ "Tendances", "Musique", "Jeux", "Actualités", "Programmation", "Ouvrir YouTube", "Ouvrir dans le navigateur", "Ouvrir les vidéos liées", "Ouvrir la chaîne", "Paramètres", "Abonnements", "S'abonner", "Se désabonner", "Ouvrir la chaîne dans le navigateur", "Afficher les vidéos", "Afficher les directs", "Show Shorts", "Ouvrir la vidéo", "Enregistrer", "Effacer", "Annuler", "Abonnements", "YouTube", "Vidéos liées", "Chaîne", "Navigateur", "YouTube - {query}", "Rechercher sur YouTube", "Rechercher des vidéos", "Rechercher dans {channel}", "Rechercher dans cette chaîne", "Chargement des abonnements...", "Chargement des vidéos...", "Chargement des vidéos et directs de la chaîne...", "Chargement...", "Utilisateur YouTube", "Sans titre", "Direct", "Abonné le {date}", "Abonné", "Saisissez une recherche.", "Aucune vidéo liée.", "Désabonnement effectué.", "Abonnement introuvable.", "Abonnement à la chaîne effectué.", "Vous êtes déjà abonné à cette chaîne.", "Désabonnement effectué.", "Paramètres enregistrés. Tirez pour actualiser.", "Paramètres effacés. Tirez pour actualiser.", "Liste des chaînes enregistrée.", "Aucun abonnement.", "Tous les abonnements sont désactivés. Ouvrez Abonnements.", "Aucun abonnement pour le moment.", "Aucun résultat dans cette chaîne pour \"{query}\".", "Aucune vidéo ou direct trouvé.", "Aucune vidéo trouvée.", "Aucun direct trouvé.", "Les vidéos et les directs sont désactivés.", "Aucun autre élément de la chaîne.", "Aucun autre résultat.", "Aucune autre vidéo liée.", "Aucun autre commentaire.", "Mettez à jour la clé API YouTube, la langue et la limite initiale d'éléments de chaîne.", "Activez ou désactivez les abonnements.", "Clé API", "Langue", "Éléments initiaux de la chaîne", "Chaîne {index}", "Impossible d'ouvrir la chaîne.", "Impossible de trouver la chaîne.", "Impossible de trouver l'identifiant de la vidéo.", "Sélection de langue invalide.", "Les éléments initiaux de la chaîne doivent être supérieurs ou égaux à 1.", "Impossible d'enregistrer la clé API.", "Impossible d'effacer la clé API.", "Impossible d'enregistrer la limite de la liste des chaînes.", "Impossible d'enregistrer la langue.", "Impossible d'effacer les paramètres.", "Impossible d'ouvrir les paramètres.", "Impossible d'enregistrer la liste des chaînes.", "Impossible d'ouvrir la liste des chaînes.", "Échec du chargement de la chaîne : {error}", "Impossible de charger la liste complète des chaînes : {error}", "Impossible de charger plus d'éléments de la chaîne : {error}", "Échec de la recherche : {error}", "Impossible de charger plus de vidéos : {error}", "Impossible de charger les vidéos liées : {error}", "Échec du chargement de la vidéo : {error}", "Impossible de charger plus de commentaires : {error}" ],
  ru: [ "В тренде", "Музыка", "Игры", "Новости", "Программирование", "Открыть YouTube", "Открыть в браузере", "Открыть похожие", "Открыть канал", "Настройки", "Подписки", "Подписаться", "Отписаться", "Открыть канал в браузере", "Показывать видео", "Показывать прямые эфиры", "Show Shorts", "Открыть видео", "Сохранить", "Очистить", "Отмена", "Подписки", "YouTube", "Похожие видео", "Канал", "Браузер", "YouTube - {query}", "Поиск в YouTube", "Искать видео", "Искать в {channel}", "Искать в этом канале", "Загрузка подписок...", "Загрузка видео...", "Загрузка видео и прямых эфиров канала...", "Загрузка...", "Пользователь YouTube", "Без названия", "Прямой эфир", "Подписка с {date}", "Подписка", "Введите поисковый запрос.", "Нет похожих видео.", "Подписка отменена.", "Подписка не найдена.", "Вы подписались на канал.", "Вы уже подписаны на этот канал.", "Подписка отменена.", "Настройки сохранены. Потяните для обновления.", "Настройки очищены. Потяните для обновления.", "Список каналов сохранен.", "Нет подписок.", "Все подписки отключены. Откройте Подписки.", "Подписок пока нет.", "В этом канале нет результатов по запросу \"{query}\".", "Видео или прямые эфиры не найдены.", "Видео не найдены.", "Прямые эфиры не найдены.", "Видео и прямые эфиры отключены.", "Больше нет элементов канала.", "Больше нет результатов.", "Больше нет похожих видео.", "Больше нет комментариев.", "Обновите ключ API YouTube, язык и начальный лимит элементов канала.", "Включайте или отключайте подписки.", "Ключ API", "Язык", "Начальные элементы канала", "Канал {index}", "Не удалось открыть канал.", "Не удалось найти канал.", "Не удалось найти идентификатор видео.", "Недопустимый выбор языка.", "Начальные элементы канала должны быть не меньше 1.", "Не удалось сохранить ключ API.", "Не удалось очистить ключ API.", "Не удалось сохранить лимит списка каналов.", "Не удалось сохранить язык.", "Не удалось очистить настройки.", "Не удалось открыть настройки.", "Не удалось сохранить список каналов.", "Не удалось открыть список каналов.", "Не удалось загрузить канал: {error}", "Не удалось загрузить полный список каналов: {error}", "Не удалось загрузить дополнительные элементы канала: {error}", "Ошибка поиска: {error}", "Не удалось загрузить больше видео: {error}", "Не удалось загрузить похожие видео: {error}", "Не удалось загрузить видео: {error}", "Не удалось загрузить больше комментариев: {error}" ],
  th: [ "มาแรง", "เพลง", "เกม", "ข่าว", "การเขียนโค้ด", "เปิด YouTube", "เปิดในเบราว์เซอร์", "เปิดรายการที่เกี่ยวข้อง", "เปิดช่อง", "การตั้งค่า", "การติดตาม", "ติดตาม", "เลิกติดตาม", "เปิดช่องในเบราว์เซอร์", "แสดงวิดีโอ", "แสดงไลฟ์สด", "Show Shorts", "เปิดวิดีโอ", "บันทึก", "ล้าง", "ยกเลิก", "การติดตาม", "YouTube", "วิดีโอที่เกี่ยวข้อง", "ช่อง", "เบราว์เซอร์", "YouTube - {query}", "ค้นหาใน YouTube", "ค้นหาวิดีโอ", "ค้นหาใน {channel}", "ค้นหาในช่องนี้", "กำลังโหลดการติดตาม...", "กำลังโหลดวิดีโอ...", "กำลังโหลดวิดีโอและไลฟ์สดของช่อง...", "กำลังโหลด...", "ผู้ใช้ YouTube", "ไม่มีชื่อ", "ไลฟ์สด", "ติดตามเมื่อ {date}", "ติดตามแล้ว", "พิมพ์คำค้นหา", "ไม่มีวิดีโอที่เกี่ยวข้อง", "เลิกติดตามแล้ว", "ไม่พบการติดตาม", "ติดตามช่องแล้ว", "ติดตามช่องนี้อยู่แล้ว", "เลิกติดตามแล้ว", "บันทึกการตั้งค่าแล้ว ดึงเพื่อรีเฟรช", "ล้างการตั้งค่าแล้ว ดึงเพื่อรีเฟรช", "บันทึกรายการช่องแล้ว", "ไม่มีการติดตาม", "ปิดใช้งานการติดตามทั้งหมดอยู่ เปิดการติดตาม", "ยังไม่มีการติดตาม", "ไม่พบผลลัพธ์ในช่องนี้สำหรับ \"{query}\"", "ไม่พบวิดีโอหรือไลฟ์สด", "ไม่พบวิดีโอ", "ไม่พบไลฟ์สด", "วิดีโอและไลฟ์สดถูกปิดใช้งาน", "ไม่มีรายการช่องเพิ่มเติม", "ไม่มีผลลัพธ์เพิ่มเติม", "ไม่มีวิดีโอที่เกี่ยวข้องเพิ่มเติม", "ไม่มีความคิดเห็นเพิ่มเติม", "อัปเดตคีย์ API ของ YouTube ภาษา และจำนวนรายการช่องเริ่มต้น", "เปิดหรือปิดใช้งานการติดตาม", "คีย์ API", "ภาษา", "รายการช่องเริ่มต้น", "ช่อง {index}", "ไม่สามารถเปิดช่องได้", "ไม่พบช่อง", "ไม่พบรหัสวิดีโอ", "การเลือกภาษาไม่ถูกต้อง", "รายการช่องเริ่มต้นต้องมีค่าอย่างน้อย 1", "ไม่สามารถบันทึกคีย์ API ได้", "ไม่สามารถล้างคีย์ API ได้", "ไม่สามารถบันทึกขีดจำกัดรายการช่องได้", "ไม่สามารถบันทึกภาษาได้", "ไม่สามารถล้างการตั้งค่าได้", "ไม่สามารถเปิดการตั้งค่าได้", "ไม่สามารถบันทึกรายการช่องได้", "ไม่สามารถเปิดรายการช่องได้", "โหลดช่องไม่สำเร็จ: {error}", "ไม่สามารถโหลดรายการช่องทั้งหมดได้: {error}", "ไม่สามารถโหลดรายการช่องเพิ่มเติมได้: {error}", "การค้นหาล้มเหลว: {error}", "ไม่สามารถโหลดวิดีโอเพิ่มเติมได้: {error}", "ไม่สามารถโหลดวิดีโอที่เกี่ยวข้องได้: {error}", "โหลดวิดีโอไม่สำเร็จ: {error}", "ไม่สามารถโหลดความคิดเห็นเพิ่มเติมได้: {error}" ],
}, UI_STRING_INDEX = function(keys) {
  for (var map = {}, i = 0; i < keys.length; i++) map[keys[i]] = i;
  return map;
}(UI_STRING_KEYS), uiStringVariantsCache = {}, listViewState = {}, postViewState = {}, handler = {
  home: function() {
    openHomeView();
  },
  deeplink: function(url) {
    var videoId = parseVideoId(url);
    return !!videoId && (openVideoView(videoId, t("title_youtube")), !0);
  },
  resume: function(viewId, context) {
    if ("watch" === getString(context && context.kind)) return ensurePostState(viewId, context || {}), 
    void synura.connect(viewId, context || {}, handler.onPostEvent);
    ensureListState(viewId, context || {}), synura.connect(viewId, context || {}, handler.onListEvent);
  },
  onListEvent: function(event) {
    var viewId = event.viewId, state = ensureListState(viewId, event.context || {});
    if ("LOAD" === event.eventId) return "related" === state.mode ? void renderRelatedList(viewId, state) : "home" === state.mode ? void renderHomeList(viewId, state) : "channel" === state.mode ? void (state.loaded ? renderChannelList(viewId, state) : loadChannelFirstPage(viewId, !1)) : void (state.loaded || loadSearchFirstPage(viewId, state.query || DEFAULT_QUERY));
    if ("REFRESH" !== event.eventId) {
      if ("QUERY" === event.eventId) {
        if ("home" === state.mode) {
          var homeQuery = cleanQuery(event.data && event.data.query);
          return void openSearchView(homeQuery || getHomeFallbackSearchQuery());
        }
        if ("channel" === state.mode) return state.channelQuery = cleanQuery(event.data && event.data.query), 
        void loadChannelFirstPage(viewId, !1);
        if ("search" !== state.mode) return;
        var query = cleanQuery(event.data && event.data.query) || getHomeFallbackSearchQuery();
        return state.query = query, void loadSearchFirstPage(viewId, query);
      }
      if ("SCROLL_TO_END" !== event.eventId) {
        if ("CLICK" === event.eventId) {
          if ("home" === state.mode) {
            if (isHomeTrendingState(state)) {
              var homeVideoId = getString(event.data && event.data.videoId);
              return homeVideoId || (homeVideoId = parseVideoId(getString(event.data && event.data.link))), 
              homeVideoId ? void openVideoView(homeVideoId, getString(event.data && event.data.title) || t("title_youtube"), buildVideoOpenData(state, event.data)) : void showSnackbar(viewId, t("error_could_not_find_video_id"));
            }
            return void (openChannelFromEventData(state, event.data) || showSnackbar(viewId, t("error_could_not_find_channel")));
          }
          var videoId = getString(event.data && event.data.videoId);
          return videoId || (videoId = parseVideoId(getString(event.data && event.data.link))), 
          videoId ? void openVideoView(videoId, getString(event.data && event.data.title) || t("title_youtube"), buildVideoOpenData(state, event.data)) : void showSnackbar(viewId, t("error_could_not_find_video_id"));
        }
        if ("ITEM_MENU_CLICK" !== event.eventId) "MENU_CLICK" !== event.eventId ? "AUTHOR_CLICK" === event.eventId && (openChannelFromEventData(state, event.data) || showSnackbar(viewId, t("error_could_not_find_channel"))) : handleListMenu(viewId, state, getString(event.data && event.data.menu)); else {
          var itemMenu = getString(event.data && event.data.menu), itemLink = getString(event.data && event.data.link);
          if (matchesUIString(itemMenu, ITEM_MENU_OPEN_CHANNEL)) return void (openChannelFromEventData(state, event.data) || showSnackbar(viewId, t("error_could_not_find_channel")));
          if (matchesUIString(itemMenu, ITEM_MENU_REMOVE_BOOKMARK) && "home" === state.mode) {
            var homeChannel = resolveChannelFromListEvent(state, event.data), removed = removeStarredChannel(homeChannel.channelUrl, homeChannel.channelId);
            return refreshHomeList(viewId), void showSnackbar(viewId, removed ? t("snackbar_removed_bookmark") : t("snackbar_bookmark_not_found"));
          }
          if (matchesUIString(itemMenu, ITEM_MENU_OPEN_BROWSER) && itemLink) {
            var browserTitle = "channel" === state.mode || "home" === state.mode && !isHomeTrendingState(state) ? getString(event.data && event.data.title) || t("title_channel") : t("title_youtube");
            openBrowser(localizedURL(itemLink), browserTitle);
          }
        }
      } else "related" === state.mode ? loadMoreRelated(viewId) : "home" === state.mode && isHomeTrendingState(state) ? loadMoreTrending(viewId) : "channel" === state.mode ? loadMoreChannel(viewId) : loadMoreSearch(viewId);
    } else "related" === state.mode ? refreshRelatedList(viewId) : "home" === state.mode ? refreshHomeList(viewId) : "channel" === state.mode ? loadChannelFirstPage(viewId, !0) : loadSearchFirstPage(viewId, state.query || DEFAULT_QUERY);
  },
  onPostEvent: function(event) {
    var viewId = event.viewId, state = ensurePostState(viewId, event.context || {});
    if ("LOAD" !== event.eventId && "REFRESH" !== event.eventId) if ("SCROLL_TO_END" !== event.eventId) if ("SUBMIT" !== event.eventId) if ("ITEM_MENU_CLICK" !== event.eventId) {
      if ("MENU_CLICK" === event.eventId) {
        var menuName = getString(event.data && event.data.menu);
        return matchesUIString(menuName, POST_MENU_OPEN) ? void openBrowser(localizedURL(watchURL(state.videoId)), t("title_youtube")) : matchesUIString(menuName, POST_MENU_RELATED) ? void openRelatedFromPost(viewId) : matchesUIString(menuName, POST_MENU_CHANNEL) ? void openChannelFromPostState(viewId) : void 0;
      }
      "AUTHOR_CLICK" === event.eventId && openChannelFromPostState(viewId);
    } else {
      var menu = getString(event.data && event.data.menu), link = getString(event.data && event.data.link);
      matchesUIString(menu, ITEM_MENU_OPEN_BROWSER) && link && openBrowser(localizedURL(link), t("title_youtube"));
    } else {
      var button = getString(event.data && event.data.button);
      matchesUIString(button, POST_MENU_OPEN) ? openBrowser(localizedURL(watchURL(state.videoId)), t("title_youtube")) : matchesUIString(button, POST_MENU_RELATED) && openRelatedFromPost(viewId);
    } else loadMoreComments(viewId); else loadWatchPost(viewId);
  }
}, openHomeView = function() {
  var savedFilters = loadVideoListFilters(), hasStarredChannels = loadStarredChannels().length > 0, result = synura.open({
    view: "/views/list",
    styles: {
      title: hasStarredChannels ? t("title_starred_channels") : getHomeFallbackTitle(),
      appbar: buildHomeSearchAppbar(),
      layout: "card",
      pagination: !hasStarredChannels,
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !hasStarredChannels
    },
    models: {
      contents: [],
      menus: [ t(HOME_MENU_CHANNEL_LIST), t(MENU_SETTINGS) ],
      snackbar: hasStarredChannels ? t("loading_starred_channels") : t("loading_videos")
    }
  }, {
    kind: "home"
  }, handler.onListEvent);
  if (result.success) {
    var key = String(result.viewId), existing = listViewState[key] || {};
    listViewState[key] = {
      mode: "home",
      title: t("title_starred_channels"),
      loaded: !!existing.loaded,
      loading: !!existing.loading,
      continuation: existing.continuation || "",
      items: existing.items || [],
      apiCfg: existing.apiCfg || defaultConfig(),
      channelUrl: "",
      channelId: "",
      channelTitle: "",
      channelAvatar: "",
      channelMemo: "",
      starred: !1,
      enableVideos: void 0 === existing.enableVideos ? savedFilters.enableVideos : normalizeEnabledFlag(existing.enableVideos),
      enableStreams: void 0 === existing.enableStreams ? savedFilters.enableStreams : normalizeEnabledFlag(existing.enableStreams),
      enableShorts: void 0 === existing.enableShorts ? savedFilters.enableShorts : normalizeEnabledFlag(existing.enableShorts),
      videoSort: normalizeVideoSort(existing.videoSort),
      continuationSource: "",
      pendingItems: existing.pendingItems || [],
      channelTabFallbackPending: !!existing.channelTabFallbackPending,
      allItems: existing.allItems || [],
      homeFeedMode: existing.homeFeedMode || "",
      homeQuery: existing.homeQuery || ""
    };
  }
}, openSearchView = function(query) {
  var savedFilters = loadVideoListFilters();
  var result = synura.open({
    view: "/views/list",
    styles: {
      title: t("title_youtube"),
      appbar: buildHomeSearchAppbar(),
      layout: "card",
      pagination: !0,
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !0
    },
    models: {
      contents: [],
      menus: buildSearchMenus({
        enableShorts: savedFilters.enableShorts
      }),
      snackbar: t("loading_videos")
    }
  }, {
    kind: "search",
    query: cleanQuery(query) || DEFAULT_QUERY
  }, handler.onListEvent);
  if (result.success) {
    var key = String(result.viewId), existing = listViewState[key] || {};
    listViewState[key] = {
      mode: "search",
      query: cleanQuery(query) || DEFAULT_QUERY,
      loaded: !!existing.loaded,
      loading: !!existing.loading,
      continuation: existing.continuation || "",
      items: existing.items || [],
      apiCfg: existing.apiCfg || defaultConfig(),
      channelUrl: "",
      channelId: "",
      channelTitle: "",
      channelAvatar: "",
      channelMemo: "",
      starred: !1,
      enableVideos: void 0 === existing.enableVideos ? savedFilters.enableVideos : normalizeEnabledFlag(existing.enableVideos),
      enableStreams: void 0 === existing.enableStreams ? savedFilters.enableStreams : normalizeEnabledFlag(existing.enableStreams),
      enableShorts: void 0 === existing.enableShorts ? savedFilters.enableShorts : normalizeEnabledFlag(existing.enableShorts),
      videoSort: normalizeVideoSort(existing.videoSort),
      continuationSource: "",
      pendingItems: [],
      channelTabFallbackPending: !1,
      allItems: existing.allItems || []
    };
  }
}, buildPostSeed = function(videoId, titleHint, data) {
  var seed = {
    videoId: getString(videoId),
    title: getString(titleHint) || getString(data && data.title) || t("title_youtube"),
    author: getString(data && data.author),
    memo: getString(data && data.channelMemo) || getString(data && data.memo),
    avatar: getString(data && data.avatar) || getString(data && data.channelAvatar),
    date: getString(data && data.date),
    viewCount: getString(data && data.viewCount),
    likeCount: getString(data && data.likeCount),
    dislikeCount: getString(data && data.dislikeCount),
    channelUrl: normalizeChannelUrl(getString(data && data.channelUrl)),
    channelId: getString(data && data.channelId),
    channelTitle: getString(data && data.channelTitle) || getString(data && data.author),
    channelAvatar: getString(data && data.channelAvatar) || getString(data && data.avatar),
    channelMemo: getString(data && data.channelMemo)
  };
  return !seed.channelUrl && seed.channelId && (seed.channelUrl = normalizeChannelUrl("/channel/" + seed.channelId)), 
  seed.channelTitle || (seed.channelTitle = seed.author), seed;
}, buildInitialPostModels = function(videoURL, seed) {
  var models = {
    link: videoURL,
    author: seed.author || t("label_loading"),
    content: [ {
      type: "link",
      value: videoURL,
      href: videoURL,
      link: videoURL
    } ],
    comments: [],
    menus: [ t(POST_MENU_OPEN) ],
    buttons: [ t(POST_MENU_OPEN) ]
  };
  return seed.memo && (models.memo = seed.memo), seed.avatar && (models.avatar = seed.avatar), 
  seed.date && (models.date = seed.date), seed.viewCount && (models.viewCount = seed.viewCount), 
  seed.likeCount && (models.likeCount = seed.likeCount), seed.dislikeCount && (models.dislikeCount = seed.dislikeCount), 
  (seed.channelUrl || seed.channelId) && (models.menus = [ t(POST_MENU_OPEN), t(POST_MENU_CHANNEL) ]),
  models;
}, openVideoView = function(videoId, titleHint, data) {
  var seed = buildPostSeed(videoId, titleHint, data), videoURL = localizedURL(watchURL(videoId)), result = synura.open({
    view: "/views/post",
    styles: {
      title: seed.title || t("title_youtube"),
      menu: !0,
      authorClickable: !0
    },
    models: buildInitialPostModels(videoURL, seed)
  }, {
    kind: "watch",
    videoId: videoId,
    channelUrl: seed.channelUrl,
    channelId: seed.channelId,
    channelTitle: seed.channelTitle,
    channelAvatar: seed.channelAvatar,
    channelMemo: seed.channelMemo,
    author: seed.author,
    memo: seed.memo,
    avatar: seed.avatar,
    date: seed.date,
    viewCount: seed.viewCount,
    likeCount: seed.likeCount,
    dislikeCount: seed.dislikeCount
  }, handler.onPostEvent);
  if (result.success) {
    var key = String(result.viewId), existing = postViewState[key] || {};
    postViewState[key] = {
      videoId: existing.videoId || videoId,
      loaded: !!existing.loaded,
      loading: !!existing.loading,
      comments: existing.comments || [],
      commentsContinuation: existing.commentsContinuation || "",
      relatedItems: existing.relatedItems || [],
      relatedContinuation: existing.relatedContinuation || "",
      channelUrl: existing.channelUrl || seed.channelUrl || "",
      channelId: existing.channelId || seed.channelId || "",
      channelTitle: existing.channelTitle || seed.channelTitle || "",
      channelAvatar: existing.channelAvatar || seed.channelAvatar || "",
      channelMemo: existing.channelMemo || seed.channelMemo || "",
      apiCfg: existing.apiCfg || defaultConfig()
    };
  }
}, openRelatedList = function(parentVideoId, title, items, continuation, apiCfg) {
  var savedFilters = loadVideoListFilters();
  var result = synura.open({
    view: "/views/list",
    styles: {
      title: title || t("title_related_videos"),
      layout: "card",
      pagination: !0,
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !0
    },
    models: {
      contents: prepareVideoListContents(items || []),
      menus: buildRelatedMenus({
        enableShorts: savedFilters.enableShorts
      }),
      snackbar: items && items.length ? "" : t("snackbar_no_related_videos")
    }
  }, {
    kind: "related",
    videoId: parentVideoId
  }, handler.onListEvent);
  if (result.success) {
    var key = String(result.viewId), existing = listViewState[key] || {};
    listViewState[key] = {
      mode: "related",
      parentVideoId: parentVideoId,
      title: title || t("title_related_videos"),
      loaded: !!existing.loaded,
      loading: !!existing.loading,
      continuation: existing.continuation || continuation || "",
      items: existing.items || items || [],
      apiCfg: existing.apiCfg || copyObject(apiCfg || defaultConfig()),
      channelUrl: "",
      channelId: "",
      channelTitle: "",
      channelAvatar: "",
      channelMemo: "",
      starred: !1,
      enableVideos: void 0 === existing.enableVideos ? savedFilters.enableVideos : normalizeEnabledFlag(existing.enableVideos),
      enableStreams: void 0 === existing.enableStreams ? savedFilters.enableStreams : normalizeEnabledFlag(existing.enableStreams),
      enableShorts: void 0 === existing.enableShorts ? savedFilters.enableShorts : normalizeEnabledFlag(existing.enableShorts),
      videoSort: normalizeVideoSort(existing.videoSort),
      continuationSource: "",
      pendingItems: [],
      allItems: existing.allItems || items || []
    };
  }
}, openRelatedFromPost = function(viewId) {
  var state = postViewState[String(viewId)];
  state && openRelatedList(state.videoId, t("title_related_videos"), state.relatedItems || [], state.relatedContinuation || "", state.apiCfg || defaultConfig());
}, openChannelList = function(channelUrl, channelTitle, channelId, channelAvatar, channelMemo) {
  var savedFilters = loadVideoListFilters(), normalizedUrl = normalizeChannelUrl(channelUrl);
  if (!normalizedUrl && channelId && (normalizedUrl = normalizeChannelUrl("/channel/" + channelId)), 
  !normalizedUrl) return !1;
  var starred = isStarredChannel(normalizedUrl, channelId), context = {
    kind: "channel",
    channelUrl: normalizedUrl,
    channelId: getString(channelId),
    channelTitle: getString(channelTitle),
    channelAvatar: getString(channelAvatar),
    channelMemo: getString(channelMemo),
    channelQuery: "",
    enableVideos: savedFilters.enableVideos,
    enableStreams: savedFilters.enableStreams,
    enableShorts: savedFilters.enableShorts
  }, result = synura.open({
    view: "/views/list",
    styles: {
      title: context.channelTitle || t("title_channel"),
      appbar: buildChannelAppbar({
        channelTitle: context.channelTitle || t("title_channel"),
        channelQuery: ""
      }),
      layout: "card",
      pagination: !0,
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !0
    },
    models: {
      contents: [],
      menus: buildChannelMenus({
        channelUrl: normalizedUrl,
        starred: starred,
        videoSort: VIDEO_SORT_DATE,
        enableVideos: savedFilters.enableVideos,
        enableStreams: savedFilters.enableStreams,
        enableShorts: savedFilters.enableShorts
      }),
      snackbar: t("loading_channel_items")
    }
  }, context, handler.onListEvent);
  if (!result.success) return !1;
  var key = String(result.viewId), existing = listViewState[key] || {};
  return listViewState[key] = {
    mode: "channel",
    title: context.channelTitle || t("title_channel"),
    loaded: !!existing.loaded,
    loading: !!existing.loading,
    continuation: existing.continuation || "",
    items: existing.items || [],
    apiCfg: existing.apiCfg || defaultConfig(),
    channelUrl: normalizedUrl,
    channelId: context.channelId,
    channelTitle: existing.channelTitle || context.channelTitle,
    channelAvatar: existing.channelAvatar || context.channelAvatar,
    channelMemo: existing.channelMemo || context.channelMemo,
    channelQuery: existing.channelQuery || "",
    starred: void 0 === existing.starred ? starred : !!existing.starred,
    enableVideos: void 0 === existing.enableVideos ? savedFilters.enableVideos : normalizeEnabledFlag(existing.enableVideos),
    enableStreams: void 0 === existing.enableStreams ? savedFilters.enableStreams : normalizeEnabledFlag(existing.enableStreams),
    enableShorts: void 0 === existing.enableShorts ? savedFilters.enableShorts : normalizeEnabledFlag(existing.enableShorts),
    videoSort: normalizeVideoSort(existing.videoSort),
    continuationSource: existing.continuationSource || "",
    pendingItems: existing.pendingItems || [],
    channelTabFallbackPending: void 0 !== existing.channelTabFallbackPending && !!existing.channelTabFallbackPending,
    channelTabEndpoints: mergeChannelTabEndpoints(null, existing.channelTabEndpoints)
  }, !0;
}, openChannelFromPostState = function(viewId) {
  var state = postViewState[String(viewId)];
  state && (state.channelUrl || state.channelId) ? openChannelList(state.channelUrl, state.channelTitle || t("title_channel"), state.channelId, state.channelAvatar, state.channelMemo) || showSnackbar(viewId, t("error_could_not_open_channel")) : showSnackbar(viewId, t("error_could_not_find_channel"));
}, openChannelFromEventData = function(state, data) {
  var channel = resolveChannelFromListEvent(state, data);
  return !(!channel.channelUrl && !channel.channelId) && openChannelList(channel.channelUrl, channel.channelTitle || channel.author || channel.title || t("title_channel"), channel.channelId, channel.channelAvatar || channel.avatar, channel.channelMemo || channel.memo);
}, buildVideoOpenData = function(state, data) {
  var out = {};
  if (data && "object" == typeof data) for (var key in data) Object.prototype.hasOwnProperty.call(data, key) && (out[key] = data[key]);
  var channel = resolveChannelFromListEvent(state, out);
  return getString(out.author) || (out.author = channel.author || channel.channelTitle || getString(state && state.channelTitle)), 
  !getString(out.channelUrl) && channel.channelUrl && (out.channelUrl = channel.channelUrl), 
  !getString(out.channelId) && channel.channelId && (out.channelId = channel.channelId), 
  getString(out.channelTitle) || (out.channelTitle = channel.channelTitle || out.author || getString(state && state.channelTitle)), 
  getString(out.channelAvatar) || (out.channelAvatar = channel.channelAvatar || channel.avatar || getString(state && state.channelAvatar)), 
  getString(out.channelMemo) || (out.channelMemo = channel.channelMemo || channel.memo || getString(state && state.channelMemo)), 
  !getString(out.avatar) && getString(out.channelAvatar) && (out.avatar = out.channelAvatar), 
  !getString(out.memo) && getString(out.channelMemo) && (out.memo = out.channelMemo), 
  out;
}, resolveChannelFromListEvent = function(state, data) {
  var out = {
    channelUrl: normalizeChannelUrl(getString(data && data.channelUrl)),
    channelId: getString(data && data.channelId),
    channelTitle: getString(data && data.channelTitle),
    channelAvatar: getString(data && data.channelAvatar),
    channelMemo: getString(data && data.channelMemo),
    author: getString(data && data.author),
    title: getString(data && data.title),
    avatar: getString(data && data.avatar),
    memo: getString(data && data.memo)
  };
  !out.channelUrl && out.channelId && (out.channelUrl = normalizeChannelUrl("/channel/" + out.channelId));
  var link = getString(data && data.link);
  if (!out.channelUrl && state && "home" === state.mode && !isHomeTrendingState(state) && (out.channelUrl = normalizeChannelUrl(link)), 
  (!out.channelUrl || !out.channelId || !out.channelTitle) && state && Array.isArray(state.items)) for (var i = 0; i < state.items.length; i++) {
    var item = state.items[i] || {};
    if (getString(item.link) === link && (!out.author || !getString(item.author) || getString(item.author) === out.author)) {
      out.channelUrl = out.channelUrl || normalizeChannelUrl(item.channelUrl), out.channelId = out.channelId || getString(item.channelId), 
      out.channelTitle = out.channelTitle || getString(item.channelTitle) || getString(item.author), 
      out.channelAvatar = out.channelAvatar || getString(item.channelAvatar) || getString(item.avatar), 
      out.channelMemo = out.channelMemo || getString(item.channelMemo);
      break;
    }
  }
  return state && "channel" === state.mode && (out.channelUrl = out.channelUrl || normalizeChannelUrl(state.channelUrl), 
  out.channelId = out.channelId || getString(state.channelId), out.channelTitle = out.channelTitle || getString(state.channelTitle), 
  out.channelAvatar = out.channelAvatar || getString(state.channelAvatar), out.channelMemo = out.channelMemo || getString(state.channelMemo)), 
  !out.channelTitle && state && "home" === state.mode && !isHomeTrendingState(state) && (out.channelTitle = getString(data && data.title)), 
  out;
}, toChannelSeed = function(state) {
  return {
    channelUrl: state.channelUrl,
    channelId: state.channelId,
    channelTitle: state.channelTitle,
    channelAvatar: state.channelAvatar,
    channelMemo: state.channelMemo
  };
}, applyChannel = function(state, channel) {
  channel && (state.channelUrl = normalizeChannelUrl(channel.channelUrl || state.channelUrl), 
  state.channelId = channel.channelId || state.channelId, state.channelTitle = channel.channelTitle || state.channelTitle, 
  state.channelAvatar = channel.channelAvatar || state.channelAvatar, state.channelMemo = channel.channelMemo || state.channelMemo), 
  !state.channelUrl && state.channelId && (state.channelUrl = normalizeChannelUrl("/channel/" + state.channelId));
}, buildChannelMenus = function(state) {
  var menus = [];
  return state.channelUrl && menus.push(t(CHANNEL_MENU_OPEN_BROWSER)), menus = menus.concat(buildVideoSortMenus(state && state.videoSort)), menus.push({
    label: t(CHANNEL_MENU_ENABLE_VIDEOS),
    checked: normalizeEnabledFlag(state && state.enableVideos)
  }), menus.push({
    label: t(CHANNEL_MENU_ENABLE_STREAMS),
    checked: normalizeEnabledFlag(state && state.enableStreams)
  }), menus.push(buildShortsToggleMenu(state)), menus.push(t(state.starred ? CHANNEL_MENU_UNBOOKMARK : CHANNEL_MENU_BOOKMARK)), 
  menus;
}, setChannelBookmark = function(viewId, state, shouldStar) {
  if (state && (state.channelUrl || state.channelId)) {
    var changed = !1;
    changed = shouldStar ? upsertStarredChannel({
      channelUrl: state.channelUrl,
      channelId: state.channelId,
      channelTitle: state.channelTitle,
      channelAvatar: state.channelAvatar,
      channelMemo: state.channelMemo,
      enabled: !0
    }) : removeStarredChannel(state.channelUrl, state.channelId), state.starred = isStarredChannel(state.channelUrl, state.channelId), 
    synura.update(viewId, {
      models: {
        menus: buildChannelMenus(state),
        snackbar: shouldStar ? changed ? t("snackbar_channel_bookmarked") : t("snackbar_channel_already_bookmarked") : changed ? t("snackbar_bookmark_removed") : t("snackbar_bookmark_not_found")
      }
    }), refreshAllHomeLists();
  } else showSnackbar(viewId, t("error_could_not_find_channel"));
}, openSettingsDialog = function(parentViewId, targetState) {
  var currentApiKey = loadApiKeyOverride(), currentLanguage = getCurrentLanguageSetting(), currentChannelChunkSize = loadChannelListChunkSize(), languageOptions = getLanguageOptions(), dialogViewId = 0, result = synura.open({
    view: "/dialogs/input",
    styles: {
      title: t(MENU_SETTINGS),
      message: t("dialog_settings_message"),
      close: !0
    },
    models: {
      body: [ {
        type: "string",
        name: "apiKey",
        label: t("field_api_key"),
        value: currentApiKey
      }, {
        type: "select",
        name: "language",
        label: t("field_language"),
        value: currentLanguage.label,
        options: languageOptions
      }, {
        type: "number",
        name: "channelChunkSize",
        label: t("field_initial_channel_items"),
        value: currentChannelChunkSize
      } ],
      buttons: [ t(BUTTON_SAVE), t(BUTTON_CLEAR), t(BUTTON_CANCEL) ]
    }
  }, function(event) {
    if ("SUBMIT" === event.eventId) {
      var button = getString(event.data && event.data.button);
      if (matchesUIString(button, BUTTON_SAVE)) {
        var key = sanitizeApiKey(event.data && event.data.apiKey), languageCode = languageCodeFromOption(event.data && event.data.language), channelChunkSize = normalizeChannelListChunkSize(event.data && event.data.channelChunkSize, 0);
        if (!languageCode) return void showSnackbar(parentViewId, t("error_invalid_language_selection"));
        if (!channelChunkSize) return void showSnackbar(parentViewId, t("error_invalid_channel_items"));
        if (key) {
          if (!saveApiKeyOverride(key)) return void showSnackbar(parentViewId, t("error_could_not_save_api_key"));
        } else if (!clearApiKeyOverride()) return void showSnackbar(parentViewId, t("error_could_not_clear_api_key"));
        return saveLanguageOverride(languageCode) ? saveChannelListChunkSize(channelChunkSize) ? (applySettingsToState(targetState), 
        showSnackbar(parentViewId, t("snackbar_settings_saved")), void synura.close(dialogViewId)) : void showSnackbar(parentViewId, t("error_could_not_save_channel_list_limit")) : void showSnackbar(parentViewId, t("error_could_not_save_language"));
      }
      return matchesUIString(button, BUTTON_CLEAR) ? clearApiKeyOverride() && clearLanguageOverride() && clearChannelListChunkSize() ? (applySettingsToState(targetState),
      showSnackbar(parentViewId, t("snackbar_settings_cleared")), void synura.close(dialogViewId)) : void showSnackbar(parentViewId, t("error_could_not_clear_settings")) : void synura.close(dialogViewId);
    }
    "CLOSE" === event.eventId && synura.close(dialogViewId);
  });
  result.success ? dialogViewId = result.viewId : showSnackbar(parentViewId, t("error_could_not_open_settings"));
}, applySettingsToState = function(state) {
  state && state.apiCfg && (state.apiCfg.apiKey = resolveApiKey(state.apiCfg.apiKey), 
  applyLocaleToConfig(state.apiCfg));
}, buildChannelManagerFields = function(channels) {
  for (var fields = [], i = 0; i < channels.length; i++) {
    var channel = channels[i] || {}, title = getString(channel.channelTitle) || getString(channel.channelUrl) || t("fallback_channel_number", {
      index: i + 1
    }), memo = getString(channel.channelMemo);
    memo && (title = trimTo(title + " - " + memo, 120)), fields.push({
      type: "boolean",
      name: "enabled_" + i,
      label: title,
      value: !1 !== channel.enabled
    });
  }
  return fields;
}, applyChannelManagerValues = function(channels, data) {
  for (var i = 0; i < channels.length; i++) {
    var name = "enabled_" + i;
    channels[i].enabled = data && !0 === data[name];
  }
}, openChannelListManager = function(parentViewId) {
  var channels = loadStarredChannels();
  if (channels.length) {
    var managerViewId = 0, managerButtons = [ t(BUTTON_SAVE), t(BUTTON_CANCEL) ], result = synura.open({
      view: "/views/settings",
      styles: {
        title: t(HOME_MENU_CHANNEL_LIST),
        message: t("dialog_channel_list_message")
      },
      models: {
        body: buildChannelManagerFields(channels),
        buttons: managerButtons
      }
    }, function(event) {
      if ("SUBMIT" === event.eventId) {
        var button = getString(event.data && event.data.button);
        if (matchesUIString(button, BUTTON_SAVE)) return applyChannelManagerValues(channels, event.data), saveStarredChannels(channels) ? (refreshHomeList(parentViewId),
        showSnackbar(parentViewId, t("snackbar_channel_list_saved")), void synura.close(managerViewId)) : void showSnackbar(managerViewId, t("error_could_not_save_channel_list"));
        synura.close(managerViewId);
      }
    });
    result.success ? managerViewId = result.viewId : showSnackbar(parentViewId, t("error_could_not_open_channel_list"));
  } else showSnackbar(parentViewId, t("snackbar_no_starred_channels"));
}, isMenuMatch = function(menu, label) {
  return matchesUIString(menu, label);
}, handleListMenu = function(viewId, state, menu) {
  if (menu) {
    if ("home" === state.mode && matchesUIString(menu, MENU_SETTINGS)) return void openSettingsDialog(viewId, state);
    if ("home" === state.mode && matchesUIString(menu, HOME_MENU_CHANNEL_LIST)) return void openChannelListManager(viewId);
    var selectedVideoSort = getVideoSortFromMenu(menu);
    if (selectedVideoSort && isSortableVideoListState(state)) return state.videoSort = selectedVideoSort, 
    void applyVideoSortSelection(viewId, state);
    if ("channel" === state.mode) return matchesUIString(menu, CHANNEL_MENU_OPEN_BROWSER) && state.channelUrl ? void openBrowser(localizedURL(state.channelUrl), state.channelTitle || t("title_channel")) : isMenuMatch(menu, CHANNEL_MENU_ENABLE_VIDEOS) ? (state.enableVideos = !normalizeEnabledFlag(state.enableVideos),
    updateVideoListFilters({
      enableVideos: state.enableVideos
    }), void loadChannelFirstPage(viewId, !1)) : isMenuMatch(menu, CHANNEL_MENU_ENABLE_STREAMS) ? (state.enableStreams = !normalizeEnabledFlag(state.enableStreams), 
    updateVideoListFilters({
      enableStreams: state.enableStreams
    }), void loadChannelFirstPage(viewId, !1)) : isMenuMatch(menu, MENU_ENABLE_SHORTS) ? (state.enableShorts = !normalizeEnabledFlag(state.enableShorts), 
    updateVideoListFilters({
      enableShorts: state.enableShorts
    }), void loadChannelFirstPage(viewId, !1)) : matchesUIString(menu, CHANNEL_MENU_BOOKMARK) ? void setChannelBookmark(viewId, state, !0) : matchesUIString(menu, CHANNEL_MENU_UNBOOKMARK) ? void setChannelBookmark(viewId, state, !1) : void 0;
    if (isMenuMatch(menu, MENU_ENABLE_SHORTS) && ("search" === state.mode || "related" === state.mode || isHomeTrendingState(state))) return state.enableShorts = !normalizeEnabledFlag(state.enableShorts), 
    updateVideoListFilters({
      enableShorts: state.enableShorts
    }), 
    void ("related" === state.mode ? renderRelatedList(viewId, state) : "search" === state.mode ? renderSearchList(viewId, state) : renderHomeTrendingList(viewId, state));
    if (!matchesUIString(menu, SEARCH_MENU_OPEN)) if (!matchesUIString(menu, POST_MENU_OPEN) || "related" !== state.mode) {
      if ("search" === state.mode) for (var i = 0; i < QUICK_QUERIES.length; i++) if (matchesUIString(menu, QUICK_QUERIES[i].labelKey)) return state.query = QUICK_QUERIES[i].query,
      void loadSearchFirstPage(viewId, state.query);
    } else openBrowser(localizedURL(watchURL(state.parentVideoId)), t("title_youtube")); else openBrowser(localizedURL(YT_ORIGIN + "/"), t("title_youtube"));
  }
}, ensureListState = function(viewId, context) {
  var key = String(viewId);
  if (!listViewState[key]) {
    var savedFilters = loadVideoListFilters(), mode = getString(context && context.kind);
    "related" !== mode && "search" !== mode && "home" !== mode && "channel" !== mode && (mode = "search");
    var channelUrl = normalizeChannelUrl(getString(context && context.channelUrl)), channelId = getString(context && context.channelId);
    !channelUrl && channelId && (channelUrl = normalizeChannelUrl("/channel/" + channelId)), 
    listViewState[key] = {
      mode: mode,
      parentVideoId: getString(context && context.videoId),
      title: getString(context && context.title) || ("related" === mode ? t("title_related_videos") : "home" === mode ? t("title_starred_channels") : "channel" === mode ? t("title_channel") : t("title_youtube")),
      query: getString(context && context.query) || DEFAULT_QUERY,
      loaded: !1,
      loading: !1,
      continuation: "",
      items: [],
      apiCfg: defaultConfig(),
      channelUrl: channelUrl,
      channelId: channelId,
      channelTitle: getString(context && context.channelTitle),
      channelAvatar: getString(context && context.channelAvatar),
      channelMemo: getString(context && context.channelMemo),
      channelQuery: cleanQuery(context && context.channelQuery),
      starred: isStarredChannel(channelUrl, channelId),
      enableVideos: savedFilters.enableVideos,
      enableStreams: savedFilters.enableStreams,
      enableShorts: savedFilters.enableShorts,
      videoSort: normalizeVideoSort(context && context.videoSort),
      continuationSource: getString(context && context.continuationSource),
      pendingItems: [],
      allItems: Array.isArray(context && context.allItems) ? context.allItems.slice() : [],
      channelTabFallbackPending: !1,
      channelTabEndpoints: mergeChannelTabEndpoints(null, context && context.channelTabEndpoints),
      homeFeedMode: getString(context && context.homeFeedMode),
      homeQuery: cleanQuery(context && context.homeQuery)
    }, "home" === mode && (listViewState[key].items = starredChannelsToListItems(loadStarredChannels()), 
    listViewState[key].loaded = !0, listViewState[key].homeFeedMode = "channels");
  }
  return listViewState[key];
}, ensurePostState = function(viewId, context) {
  var key = String(viewId);
  if (!postViewState[key]) {
    var channelUrl = normalizeChannelUrl(getString(context && context.channelUrl)), channelId = getString(context && context.channelId);
    !channelUrl && channelId && (channelUrl = normalizeChannelUrl("/channel/" + channelId)), 
    postViewState[key] = {
      videoId: getString(context && context.videoId),
      loaded: !1,
      loading: !1,
      comments: [],
      commentsContinuation: "",
      relatedItems: [],
      relatedContinuation: "",
      channelUrl: channelUrl,
      channelId: channelId,
      channelTitle: getString(context && context.channelTitle) || getString(context && context.author),
      channelAvatar: getString(context && context.channelAvatar) || getString(context && context.avatar),
      channelMemo: getString(context && context.channelMemo) || getString(context && context.memo),
      apiCfg: defaultConfig()
    };
  }
  return postViewState[key];
}, buildVideoListDisplayTypes = function(item) {
  var sourceTypes = Array.isArray(item && item.types) ? item.types : [];
  return sourceTypes.indexOf("stream") >= 0 ? [ "video" ] : [];
}, prepareVideoListContents = function(items) {
  for (var list = Array.isArray(items) ? items : [], out = [], i = 0; i < list.length; i++) {
    var item = copyObject(list[i] || {});
    item.types = buildVideoListDisplayTypes(item), out.push(item);
  }
  return out;
}, prepareChannelListContents = function(items) {
  for (var list = Array.isArray(items) ? items : [], openBrowserMenus = [ t(ITEM_MENU_OPEN_BROWSER) ], out = [], i = 0; i < list.length; i++) {
    var source = list[i] || {}, displayTypes = buildVideoListDisplayTypes(source), item = {
      link: getString(source.link),
      title: getString(source.title),
      memo: getString(source.memo),
      mediaUrl: getString(source.mediaUrl),
      mediaType: getString(source.mediaType),
      menus: openBrowserMenus
    };
    source.date && (item.date = getString(source.date)), source.viewCount && (item.viewCount = getString(source.viewCount)), 
    displayTypes.length && (item.types = displayTypes), source.likeCount && (item.likeCount = getString(source.likeCount)), 
    out.push(item);
  }
  return out;
}, getListAppendIdentity = function(item) {
  return getString(item && item.videoId) || getString(item && item.link) || getString(item && item.title);
}, renderedListExtendsExisting = function(previousItems, nextItems) {
  var previous = Array.isArray(previousItems) ? previousItems : [], next = Array.isArray(nextItems) ? nextItems : [];
  if (!previous.length || previous.length > next.length) return !1;
  for (var i = 0; i < previous.length; i++) if (getListAppendIdentity(previous[i]) !== getListAppendIdentity(next[i])) return !1;
  return !0;
}, appendListViewContents = function(viewId, appendedItems, updateData) {
  var styles = updateData && updateData.styles, models = copyObject(updateData && updateData.models || {});
  appendedItems && appendedItems.length && (models.append = appendedItems);
  var data = {
    models: models
  };
  void 0 !== styles && (data.styles = styles), synura.update(viewId, data);
}, updateListViewContents = function(viewId, renderedItems, updateData, previousRenderedItems) {
  var styles = updateData && updateData.styles, models = copyObject(updateData && updateData.models || {});
  if (renderedListExtendsExisting(previousRenderedItems, renderedItems)) {
    var appendedItems = renderedItems.slice(previousRenderedItems.length);
    return void appendListViewContents(viewId, appendedItems, updateData);
  }
  models.contents = renderedItems;
  var data = {
    models: models
  };
  void 0 !== styles && (data.styles = styles), synura.update(viewId, data);
}, buildShortsToggleMenu = function(state) {
  return {
    label: t(MENU_ENABLE_SHORTS),
    checked: normalizeEnabledFlag(state && state.enableShorts)
  };
}, getVideoListSourceItems = function(state) {
  var allItems = Array.isArray(state && state.allItems) ? state.allItems : null, visibleItems = Array.isArray(state && state.items) ? state.items : [];
  return allItems && (allItems.length || !visibleItems.length) ? allItems.slice() : visibleItems.slice();
}, isShortVideoItem = function(item) {
  var types = Array.isArray(item && item.types) ? item.types : [];
  return types.indexOf("shorts") >= 0;
}, filterVideoItemsForState = function(state, items) {
  if (normalizeEnabledFlag(state && state.enableShorts)) return Array.isArray(items) ? items.slice() : [];
  for (var list = Array.isArray(items) ? items : [], out = [], i = 0; i < list.length; i++) isShortVideoItem(list[i]) || out.push(list[i]);
  return out;
}, getVideoListRenderItems = function(state, preserveOrder) {
  var list = getVideoListSourceItems(state);
  return preserveOrder || (list = sortVideoItemsForState(state, list), state && (state.allItems = list.slice())), 
  filterVideoItemsForState(state, list);
}, hasVideoListPagination = function(state) {
  return !!(state && state.continuation);
}, renderSearchList = function(viewId, state, snackbar, previousItems, preserveOrder) {
  var items = getVideoListRenderItems(state, preserveOrder), title = t("title_search_results", {
    query: state.query || getHomeFallbackSearchQuery()
  });
  if (state.items = items, state.loaded = !0, Array.isArray(previousItems) && renderedListExtendsExisting(previousItems, items)) return void appendListViewContents(viewId, prepareVideoListContents(items.slice(previousItems.length)), {
    styles: {
      title: title,
      pagination: hasVideoListPagination(state)
    },
    models: {
      menus: buildSearchMenus(state),
      snackbar: void 0 === snackbar ? items.length ? "" : t("snackbar_no_videos_found") : snackbar
    }
  });
  var renderedItems = prepareVideoListContents(items), previousRenderedItems = Array.isArray(previousItems) ? prepareVideoListContents(previousItems) : null;
  updateListViewContents(viewId, renderedItems, {
    styles: {
      title: title,
      pagination: hasVideoListPagination(state)
    },
    models: {
      menus: buildSearchMenus(state),
      snackbar: void 0 === snackbar ? items.length ? "" : t("snackbar_no_videos_found") : snackbar
    }
  }, previousRenderedItems);
}, renderRelatedList = function(viewId, state, snackbar, previousItems, preserveOrder) {
  var items = getVideoListRenderItems(state, preserveOrder);
  if (state.items = items, state.loaded = !0, Array.isArray(previousItems) && renderedListExtendsExisting(previousItems, items)) return void appendListViewContents(viewId, prepareVideoListContents(items.slice(previousItems.length)), {
    styles: {
      title: state.title || t("title_related_videos"),
      pagination: hasVideoListPagination(state)
    },
    models: {
      menus: buildRelatedMenus(state),
      snackbar: void 0 === snackbar ? items.length ? "" : t("snackbar_no_related_videos") : snackbar
    }
  });
  var renderedItems = prepareVideoListContents(items), previousRenderedItems = Array.isArray(previousItems) ? prepareVideoListContents(previousItems) : null;
  updateListViewContents(viewId, renderedItems, {
    styles: {
      title: state.title || t("title_related_videos"),
      pagination: hasVideoListPagination(state)
    },
    models: {
      menus: buildRelatedMenus(state),
      snackbar: void 0 === snackbar ? items.length ? "" : t("snackbar_no_related_videos") : snackbar
    }
  }, previousRenderedItems);
}, buildHomeSnackbar = function(allChannels, visibleItems) {
  return visibleItems && visibleItems.length ? "" : allChannels && allChannels.length ? t("snackbar_all_channels_disabled") : t("snackbar_no_starred_channels_yet");
}, getHomeFallbackLabel = function() {
  return QUICK_QUERIES.length && QUICK_QUERIES[0] ? getQuickQueryLabel(QUICK_QUERIES[0]) : t("quick_query_trending");
}, getHomeFallbackSearchQuery = function() {
  var code = getCurrentUILanguageCode(), exact = getString(HOME_TRENDING_SEARCH_QUERIES[code]), primary = code.split("-")[0], fallback = getString(HOME_TRENDING_SEARCH_QUERIES[primary]), label = cleanQuery(getHomeFallbackLabel());
  return cleanQuery(exact || fallback || label || QUICK_QUERIES.length && QUICK_QUERIES[0] && QUICK_QUERIES[0].query || DEFAULT_QUERY) || DEFAULT_QUERY;
}, getHomeFallbackTitle = function() {
  return t("title_search_results", {
    query: getHomeFallbackLabel()
  });
}, isHomeTrendingState = function(state) {
  return !!state && "home" === state.mode && "trending" === getString(state.homeFeedMode);
}, renderHomeTrendingList = function(viewId, state, snackbar, previousItems, preserveOrder) {
  var items = getVideoListRenderItems(state, preserveOrder);
  if (state.items = items, state.loaded = !0, Array.isArray(previousItems) && renderedListExtendsExisting(previousItems, items)) return void appendListViewContents(viewId, prepareVideoListContents(items.slice(previousItems.length)), {
    styles: {
      title: getHomeFallbackTitle(),
      appbar: buildHomeSearchAppbar(),
      layout: "card",
      pagination: hasVideoListPagination(state),
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !0
    },
    models: {
      menus: buildHomeMenus(state),
      snackbar: void 0 === snackbar ? items.length ? "" : t("snackbar_no_videos_found") : snackbar
    }
  });
  var renderedItems = prepareVideoListContents(items), previousRenderedItems = Array.isArray(previousItems) ? prepareVideoListContents(previousItems) : null;
  updateListViewContents(viewId, renderedItems, {
    styles: {
      title: getHomeFallbackTitle(),
      appbar: buildHomeSearchAppbar(),
      layout: "card",
      pagination: hasVideoListPagination(state),
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !0
    },
    models: {
      menus: buildHomeMenus(state),
      snackbar: void 0 === snackbar ? items.length ? "" : t("snackbar_no_videos_found") : snackbar
    }
  }, previousRenderedItems);
}, loadHomeFallbackList = function(viewId, state) {
  if (state && !state.loading) {
    var keepItems = isHomeTrendingState(state), homeLabel = getHomeFallbackLabel(), homeQuery = getHomeFallbackSearchQuery();
    state.loading = !0, state.mode = "home", state.homeFeedMode = "trending", state.homeQuery = homeLabel, 
    state.query = homeQuery, state.pendingItems = [], state.continuation = "", state.continuationSource = "", 
    keepItems || (state.items = []), 
    keepItems || (state.allItems = []), 
    synura.update(viewId, {
      styles: {
        title: getHomeFallbackTitle(),
        appbar: buildHomeSearchAppbar(),
        layout: "card",
        pagination: !0,
        menu: !0,
        media: !0,
      history: !0,
      authorClickable: !0
    },
    models: {
      contents: prepareVideoListContents(state.items || []),
      menus: buildHomeMenus(state),
      snackbar: t("loading_videos")
    }
    });
    try {
      var page = fetchHomeFallbackDesktopSearchPage(homeQuery);
      state.allItems = page.items, state.items = page.items, state.continuation = page.continuation, 
      state.continuationSource = page.continuationSource || "", state.apiCfg = page.apiCfg, 
      renderHomeTrendingList(viewId, state, page.items.length ? "" : t("snackbar_no_videos_found"));
    } catch (e) {
      state.allItems = [], state.items = [], state.loaded = !0, showSnackbar(viewId, t("error_search_failed", {
        error: e.toString()
      }));
    }
    state.loading = !1;
  }
}, renderHomeList = function(viewId, state) {
  var allChannels = loadStarredChannels();
  if (!allChannels.length) return void loadHomeFallbackList(viewId, state);
  state.items = starredChannelsToListItems(allChannels), state.loaded = !0, state.mode = "home", 
  state.homeFeedMode = "channels", state.homeQuery = "", state.continuation = "", state.pendingItems = [], 
  state.allItems = [], 
  synura.update(viewId, {
    styles: {
      title: t("title_starred_channels"),
      appbar: buildHomeSearchAppbar(),
      layout: "card",
      pagination: !1,
      menu: !0,
      media: !0,
      history: !0,
      authorClickable: !1
    },
    models: {
      contents: state.items,
      menus: buildHomeMenus(state),
      snackbar: buildHomeSnackbar(allChannels, state.items)
    }
  });
}, refreshHomeList = function(viewId) {
  var state = listViewState[String(viewId)];
  state && renderHomeList(viewId, state);
}, refreshAllHomeLists = function() {
  for (var key in listViewState) if (Object.prototype.hasOwnProperty.call(listViewState, key)) {
    var state = listViewState[key];
    if (state && "home" === state.mode) {
      var viewId = parseInt(key, 10);
      viewId && renderHomeList(viewId, state);
    }
  }
}, buildChannelAppbar = function(state) {
  return {
    type: "query",
    label: t("appbar_search_channel", {
      channel: getString(state && state.channelTitle) || t("title_channel")
    }),
    hint: cleanQuery(state && state.channelQuery) || t("appbar_search_in_channel_hint")
  };
}, buildChannelSnackbar = function(state) {
  if (state.items && state.items.length) return "";
  var channelQuery = cleanQuery(state && state.channelQuery);
  if (channelQuery) return t("snackbar_no_results_in_channel", {
    query: channelQuery
  });
  var videosEnabled = normalizeEnabledFlag(state && state.enableVideos), streamsEnabled = normalizeEnabledFlag(state && state.enableStreams), shortsEnabled = normalizeEnabledFlag(state && state.enableShorts);
  return videosEnabled || streamsEnabled || shortsEnabled ? videosEnabled && !streamsEnabled && !shortsEnabled ? t("snackbar_no_videos_found") : !videosEnabled && streamsEnabled && !shortsEnabled ? t("snackbar_no_live_streams_found") : t("snackbar_no_videos_or_streams_found") : t("snackbar_videos_and_streams_disabled");
}, splitBufferedItems = function(items, chunkSize) {
  var list = Array.isArray(items) ? items.slice() : [], size = Math.floor(getNumber(chunkSize));
  return size < 1 && (size = loadChannelListChunkSize()), {
    visible: list.slice(0, size),
    pending: list.slice(size)
  };
}, drainPendingItems = function(state, chunkSize) {
  if (!state) return [];
  var pending = Array.isArray(state.pendingItems) ? state.pendingItems.slice() : [];
  if (!pending.length) return state.pendingItems = [], [];
  var split = splitBufferedItems(pending, chunkSize);
  return state.pendingItems = split.pending, split.visible;
}, renderChannelList = function(v, st, prev) {
  var items = st.items || [], s = {
    title: st.channelTitle || t("title_channel"),
    appbar: buildChannelAppbar(st),
    pagination: !!(st.pendingItems.length || st.continuation || st.channelTabFallbackPending)
  }, m = {
    menus: buildChannelMenus(st),
    snackbar: buildChannelSnackbar(st)
  };
  if (prev && renderedListExtendsExisting(prev, items)) return void appendListViewContents(v, prepareChannelListContents(items.slice(prev.length)), {
    styles: s,
    models: m
  });
  var r = prepareChannelListContents(items), p = prev ? prepareChannelListContents(prev) : null;
  updateListViewContents(v, r, {
    styles: s,
    models: m
  }, p);
}, loadChannelFirstPage = function(viewId, forceRefresh) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading) if (state.channelUrl || state.channelId) {
    if (!normalizeEnabledFlag(state.enableVideos) && !normalizeEnabledFlag(state.enableStreams) && !normalizeEnabledFlag(state.enableShorts)) return state.items = [], 
    state.pendingItems = [], state.continuation = "", state.continuationSource = "", 
    state.channelTabFallbackPending = !1, state.loaded = !0, void renderChannelList(viewId, state);
    state.loading = !0;
    try {
      var options = {
        query: cleanQuery(state.channelQuery),
        videos: normalizeEnabledFlag(state.enableVideos),
        streams: normalizeEnabledFlag(state.enableStreams),
        shorts: normalizeEnabledFlag(state.enableShorts)
      }, channelSeed = toChannelSeed(state), page = forceRefresh ? null : getCachedChannelPage(state.channelUrl, state.channelId, options);
      page || (page = fetchChannelPage(state.channelUrl, state.channelId, options, channelSeed), 
      saveCachedChannelPage(state.channelUrl, state.channelId, options, page));
      var sortedItems = sortVideoItemsForState(state, page.items), split = splitBufferedItems(sortedItems, loadChannelListChunkSize());
      state.mode = "channel", state.items = split.visible, state.pendingItems = split.pending, 
      state.continuation = page.continuation, state.continuationSource = page.continuationSource || "", 
      state.apiCfg = page.apiCfg, state.channelTabFallbackPending = !!page.channelTabFallbackPending, 
      state.channelTabEndpoints = mergeChannelTabEndpoints(state.channelTabEndpoints, page.channelTabEndpoints), 
      state.loaded = !0, applyChannel(state, page.channel), 
      state.starred = isStarredChannel(state.channelUrl, state.channelId), renderChannelList(viewId, state);
    } catch (e) {
      showSnackbar(viewId, t("error_channel_load_failed", {
        error: e.toString()
      }));
    }
    state.loading = !1;
  } else showSnackbar(viewId, t("error_could_not_find_channel"));
}, loadMoreChannel = function(viewId) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading) {
    var previousVisibleItems = (state.items || []).slice(), appendedBufferedItems = drainPendingItems(state, loadChannelListChunkSize());
    if (appendedBufferedItems.length) return state.items = previousVisibleItems.concat(appendedBufferedItems), 
    renderChannelList(viewId, state, previousVisibleItems), void (state.pendingItems.length || state.continuation || state.channelTabFallbackPending || showSnackbar(viewId, t("snackbar_no_more_channel_items")));
    if (state.continuation || state.channelTabFallbackPending) {
      state.loading = !0;
      try {
        var page = null, loadingDeferredTabs = !1, channelSeed = toChannelSeed(state);
        !state.continuation && state.channelTabFallbackPending ? (page = fetchChannelPageFromTabs(state.channelUrl, state.channelId, {
          query: "",
          videos: normalizeEnabledFlag(state.enableVideos),
          streams: normalizeEnabledFlag(state.enableStreams),
          shorts: normalizeEnabledFlag(state.enableShorts)
        }, state.channelTabEndpoints, state.apiCfg, channelSeed), state.channelTabFallbackPending = !1, state.continuation = page.continuation, 
        state.continuationSource = page.continuationSource || "", state.apiCfg = page.apiCfg || state.apiCfg, 
        state.channelTabEndpoints = mergeChannelTabEndpoints(state.channelTabEndpoints, page.channelTabEndpoints), 
        loadingDeferredTabs = !0) : (page = fetchChannelContinuation(state.continuation, state.apiCfg, state.continuationSource, channelSeed), 
        state.continuation = page.continuation);
        applyChannel(state, page.channel), channelSeed = toChannelSeed(state);
        for (var known = {}, i = 0; i < state.items.length; i++) known[getString(state.items[i] && state.items[i].videoId)] = !0;
        for (var i2 = 0; i2 < state.pendingItems.length; i2++) known[getString(state.pendingItems[i2] && state.pendingItems[i2].videoId)] = !0;
        for (var pageItems = hydrateChannelItems(page.items, channelSeed), pageItems = filterChannelItemsForOptions(pageItems, normalizeEnabledFlag(state.enableVideos), normalizeEnabledFlag(state.enableStreams), normalizeEnabledFlag(state.enableShorts)), freshItems = [], j = 0; j < pageItems.length; j++) {
          var id = getString(pageItems[j] && pageItems[j].videoId);
          id && !known[id] && (known[id] = !0, freshItems.push(pageItems[j]));
        }
        freshItems = sortVideoItemsForState(state, freshItems), state.pendingItems = (state.pendingItems || []).concat(freshItems);
        var nextVisibleItems = drainPendingItems(state, loadChannelListChunkSize());
        nextVisibleItems.length && (state.items = previousVisibleItems.concat(nextVisibleItems)), 
        renderChannelList(viewId, state, previousVisibleItems), (freshItems.length || state.pendingItems.length || state.continuation || state.channelTabFallbackPending) && (state.continuation || state.pendingItems.length || state.channelTabFallbackPending) || showSnackbar(viewId, t("snackbar_no_more_channel_items"));
      } catch (e) {
        showSnackbar(viewId, loadingDeferredTabs ? t("error_could_not_load_full_channel_list", {
          error: e.toString()
        }) : t("error_could_not_load_more_channel_items", {
          error: e.toString()
        }));
      }
      state.loading = !1;
    }
  }
}, loadSearchFirstPage = function(viewId, query) {
  var state = ensureListState(viewId, {
    kind: "search"
  });
  if (!state.loading) {
    state.loading = !0;
    try {
      var page = fetchSearchPage(query);
      state.mode = "search", state.query = query, state.allItems = page.items, state.items = page.items, state.continuation = page.continuation, 
      state.apiCfg = page.apiCfg, renderSearchList(viewId, state, page.items.length ? "" : t("snackbar_no_videos_found"));
    } catch (e) {
      showSnackbar(viewId, t("error_search_failed", {
        error: e.toString()
      }));
    }
    state.loading = !1;
  }
}, loadMoreTrending = function(viewId) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading && state.continuation) {
    state.loading = !0;
    try {
      var previousItems = (state.items || []).slice(), sourceItems = getVideoListSourceItems(state), page = fetchSearchContinuation(state.continuation, state.apiCfg), pageItems = sortVideoItemsForState(state, page.items);
      state.continuation = page.continuation, state.allItems = sourceItems.concat(pageItems), 
      renderHomeTrendingList(viewId, state, page.items.length ? "" : t("snackbar_no_more_results"), previousItems, !0), 
      page.items.length && state.continuation || showSnackbar(viewId, t("snackbar_no_more_results"));
    } catch (e) {
      showSnackbar(viewId, t("error_could_not_load_more_videos", {
        error: e.toString()
      }));
    }
    state.loading = !1;
  } else state && state.loaded && showSnackbar(viewId, t("snackbar_no_more_results"));
}, loadMoreSearch = function(viewId) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading && state.continuation) {
    state.loading = !0;
    try {
      var previousItems = (state.items || []).slice(), sourceItems = getVideoListSourceItems(state), page = fetchSearchContinuation(state.continuation, state.apiCfg), pageItems = sortVideoItemsForState(state, page.items);
      state.continuation = page.continuation, state.allItems = sourceItems.concat(pageItems), 
      renderSearchList(viewId, state, page.items.length ? "" : t("snackbar_no_more_results"), previousItems, !0), 
      page.items.length && state.continuation || showSnackbar(viewId, t("snackbar_no_more_results"));
    } catch (e) {
      showSnackbar(viewId, t("error_could_not_load_more_videos", {
        error: e.toString()
      }));
    }
    state.loading = !1;
  }
}, refreshRelatedList = function(viewId) {
  var state = listViewState[String(viewId)];
  state && renderRelatedList(viewId, state, "");
}, loadMoreRelated = function(viewId) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading && state.continuation) {
    state.loading = !0;
    try {
      var previousItems = (state.items || []).slice(), sourceItems = getVideoListSourceItems(state), page = fetchRelatedContinuation(state.continuation, state.apiCfg), pageItems = sortVideoItemsForState(state, page.items);
      state.continuation = page.continuation, state.allItems = sourceItems.concat(pageItems), 
      renderRelatedList(viewId, state, page.items.length ? "" : t("snackbar_no_more_related_videos"), previousItems, !0), 
      page.items.length && state.continuation || showSnackbar(viewId, t("snackbar_no_more_related_videos"));
    } catch (e) {
      showSnackbar(viewId, t("error_could_not_load_related_videos", {
        error: e.toString()
      }));
    }
    state.loading = !1;
  }
}, loadWatchPost = function(viewId) {
  var state = postViewState[String(viewId)];
  if (state && !state.loading && state.videoId) {
    state.loading = !0;
    try {
      var payload = fetchWatchPayload(state.videoId);
      state.apiCfg = payload.apiCfg, state.channelUrl = payload.channelUrl || state.channelUrl, 
      state.channelId = payload.channelId || state.channelId, state.channelTitle = payload.channelTitle || payload.author || state.channelTitle, 
      state.channelAvatar = payload.channelAvatar || state.channelAvatar, state.channelMemo = payload.channelMemo || state.channelMemo, 
      state.relatedItems = payload.relatedItems, state.relatedContinuation = payload.relatedContinuation, 
      state.comments = [], state.commentsContinuation = payload.commentsContinuation || "", 
      state.loaded = !0, synura.update(viewId, {
        styles: {
          title: payload.title || t("title_youtube")
        },
        models: buildPostModels(payload, state)
      });
    } catch (e) {
      showSnackbar(viewId, t("error_failed_to_load_video", {
        error: e.toString()
      }));
    }
    state.loading = !1;
  }
}, loadMoreComments = function(viewId) {
  var state = postViewState[String(viewId)];
  if (state && !state.loading && state.commentsContinuation) {
    state.loading = !0;
    try {
      var page = fetchCommentsContinuation(state.commentsContinuation, state.apiCfg);
      state.commentsContinuation = page.continuation, state.comments = state.comments.concat(page.comments), 
      synura.update(viewId, {
        models: {
          comments: state.comments,
          menus: buildPostMenus(state),
          snackbar: page.comments.length ? "" : t("snackbar_no_more_comments")
        }
      }), page.comments.length && state.commentsContinuation || showSnackbar(viewId, t("snackbar_no_more_comments"));
    } catch (e) {
      showSnackbar(viewId, t("error_could_not_load_more_comments", {
        error: e.toString()
      }));
    }
    state.loading = !1;
  } else state && state.loaded && showSnackbar(viewId, t("snackbar_no_more_comments"));
}, buildPostModels = function(payload, state) {
  var content = [];
  content.push({
    type: "link",
    value: payload.link,
    href: payload.link,
    link: payload.link
  }), payload.metadataLine && content.push({
    type: "text",
    value: payload.metadataLine
  }), payload.description && content.push({
    type: "text",
    value: payload.description
  });
  var models = {
    link: payload.link,
    author: payload.author,
    content: content,
    comments: state.comments,
    menus: buildPostMenus(state),
    buttons: [ t(POST_MENU_OPEN), t(POST_MENU_RELATED) ]
  };
  return payload.channelMemo && (models.memo = payload.channelMemo), payload.channelAvatar && (models.avatar = payload.channelAvatar), 
  payload.date && (models.date = payload.date), payload.viewCount && (models.viewCount = payload.viewCount), 
  payload.likeCount && (models.likeCount = payload.likeCount), payload.dislikeCount && (models.dislikeCount = payload.dislikeCount), 
  models;
}, buildPostMenus = function(state) {
  var menus = [ t(POST_MENU_OPEN) ];
  return (state.relatedItems && state.relatedItems.length || state.relatedContinuation) && menus.push(t(POST_MENU_RELATED)),
  (state.channelUrl || state.channelId) && menus.push(t(POST_MENU_CHANNEL)), menus;
}, buildSearchMenus = function(state) {
  for (var menuLabels = QUICK_QUERIES.map(function(item) {
    return getQuickQueryLabel(item);
  }), i = 0, sortMenus = buildVideoSortMenus(state && state.videoSort); i < sortMenus.length; i++) menuLabels.push(sortMenus[i]);
  return menuLabels.push(buildShortsToggleMenu(state)), menuLabels.push(t(SEARCH_MENU_OPEN)), menuLabels;
}, buildRelatedMenus = function(state) {
  for (var menus = [ t(POST_MENU_OPEN) ], sortMenus = buildVideoSortMenus(state && state.videoSort), i = 0; i < sortMenus.length; i++) menus.push(sortMenus[i]);
  return menus.push(buildShortsToggleMenu(state)), menus;
}, buildHomeMenus = function(state) {
  for (var menus = [ t(HOME_MENU_CHANNEL_LIST), t(MENU_SETTINGS) ], sortMenus = isHomeTrendingState(state) ? buildVideoSortMenus(state && state.videoSort) : [], i = 0; i < sortMenus.length; i++) menus.push(sortMenus[i]);
  return isHomeTrendingState(state) && menus.push(buildShortsToggleMenu(state)), menus;
}, fetchSearchPage = function(query) {
  var normalizedQuery = cleanQuery(query) || DEFAULT_QUERY, cachedCfg = loadInnertubeConfigCache();
  if (cachedCfg && cachedCfg.apiKey) try {
    return fetchSearchPageInnertube(normalizedQuery, cachedCfg);
  } catch (e) {}
  var url = localizedURL(YT_ORIGIN + "/results?search_query=" + encodeURIComponent(normalizedQuery)), html = fetchText(url), initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from search page.");
  var apiCfg = extractInnertubeConfig(html), sectionContents = getIn(initialData, [ "contents", "sectionListRenderer", "contents" ], []);
  return {
    items: normalizeVideoItems(collectVideos(sectionContents), normalizedQuery),
    continuation: extractContinuationToken(sectionContents),
    apiCfg: apiCfg
  };
}, fetchSearchPageInnertube = function(query, apiCfg) {
  var cfg = resolveInnertubeConfig(apiCfg);
  if (!cfg || !cfg.apiKey) throw new Error("Missing Innertube API key.");
  var payload = {
    context: buildInnertubeContext(cfg),
    query: cleanQuery(query) || DEFAULT_QUERY
  }, response = callInnertube("/youtubei/v1/search", payload, cfg), videos = normalizeVideoItems(collectVideos(response), query), continuation = extractContinuationToken(response);
  if (!videos.length && !continuation) throw new Error("Could not parse search response.");
  return {
    items: videos,
    continuation: continuation,
    apiCfg: cfg
  };
}, fetchSearchContinuation = function(token, apiCfg) {
  var payload = {
    context: buildInnertubeContext(apiCfg),
    continuation: token
  }, response = callInnertube("/youtubei/v1/search", payload, apiCfg), items = extractContinuationItems(response);
  return {
    items: normalizeVideoItems(collectVideos(items), ""),
    continuation: extractContinuationToken(items)
  };
}, fetchHomeFallbackDesktopSearchPage = function(query) {
  var normalizedQuery = cleanQuery(query) || DEFAULT_QUERY, apiCfg = applyLocaleToConfig({
    apiKey: HOME_FALLBACK_API_KEY,
    clientName: HOME_FALLBACK_CLIENT_NAME,
    clientVersion: HOME_FALLBACK_CLIENT_VERSION
  }), payload = {
    context: {
      client: {
        hl: apiCfg.hl || DEFAULT_HL,
        gl: apiCfg.gl || DEFAULT_GL,
        clientName: apiCfg.clientName || HOME_FALLBACK_CLIENT_NAME,
        clientVersion: apiCfg.clientVersion || HOME_FALLBACK_CLIENT_VERSION,
        platform: "DESKTOP"
      }
    },
    query: normalizedQuery
  }, url = YT_ORIGIN + "/youtubei/v1/search?key=" + encodeURIComponent(apiCfg.apiKey), response = fetch(url, {
    method: "POST",
    bypass: SYNURA.bypass,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": resolveAcceptLanguage(apiCfg)
    },
    body: JSON.stringify(payload)
  });
  if (!response || !response.ok) throw new Error("HTTP " + getNumber(response && response.status) + " from home fallback search.");
  var result = response.json() || {}, videos = normalizeVideoItems(collectVideos(result), normalizedQuery), continuation = extractContinuationToken(result);
  if (!videos.length && !continuation) throw new Error("Could not parse home fallback search response.");
  return {
    items: videos,
    continuation: continuation,
    continuationSource: "search",
    apiCfg: apiCfg
  };
}, fetchChannelTabPageHTML = function(u, id, tab, opt, seed) {
  var url = toChannelTabURL(u, tab);
  if (!url) {
    if (opt) return null;
    throw new Error("Missing channel URL.");
  }
  var html = "";
  try {
    html = fetchText(localizedURL(url));
  } catch (e) {
    if (opt) return null;
    throw e;
  }
  var initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) {
    if (opt) return null;
    throw new Error("Could not parse ytInitialData from channel page.");
  }
  var apiCfg = extractInnertubeConfig(html), channel = parseChannelMetadata(initialData, u, id, seed), videos = normalizeVideoItems(collectVideos(initialData), "", channel);
  "streams" === tab && (videos = markItemsAsStream(videos));
  var tabs = extractChannelTabEndpointsFromHTML(html);
  return videos = hydrateChannelItems(videos, channel), {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(initialData),
    apiCfg: apiCfg,
    channel: channel,
    channelTabEndpoints: tabs
  };
}, fetchChannelTabPageBrowse = function(u, id, tab, opt, tabs, cfg, seed) {
  var key = getString(tab).toLowerCase(), endpoint = getIn(tabs, [ key ], null), browseId = getString(endpoint && endpoint.browseId) || getString(id) || extractChannelIdFromUrl(u), params = getString(endpoint && endpoint.params);
  if (!browseId || !params) {
    if (opt) return null;
    throw new Error("Missing channel tab endpoint.");
  }
  var api = resolveInnertubeConfig(cfg), payload = {
    context: buildInnertubeContext(api),
    browseId: browseId,
    params: params
  }, response = null;
  try {
    response = callInnertube("/youtubei/v1/browse", payload, api);
  } catch (e) {
    if (opt) return null;
    throw e;
  }
  var channel = parseChannelMetadata(response, u, browseId, seed), videos = normalizeVideoItems(collectVideos(response), "", channel);
  "streams" === key && (videos = markItemsAsStream(videos));
  return videos = hydrateChannelItems(videos, channel), {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(response),
    apiCfg: api,
    channel: channel
  };
}, fetchChannelTabPage = function(u, id, tab, opt, tabs, cfg, seed) {
  var endpoints = mergeChannelTabEndpoints(null, tabs), key = getString(tab).toLowerCase();
  if (endpoints[key]) try {
    return fetchChannelTabPageBrowse(u, id, tab, opt, endpoints, cfg, seed);
  } catch (e) {}
  if (opt && (endpoints.videos || endpoints.streams || endpoints.shorts)) return null;
  return fetchChannelTabPageHTML(u, id, tab, opt, seed);
}, fetchChannelSearchPage = function(u, id, q, seed) {
  var url = toChannelSearchURL(u, q);
  if (!url) throw new Error("Missing channel URL.");
  var html = fetchText(localizedURL(url)), initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from channel search page.");
  var root = findSelectedChannelTabContent(initialData) || initialData, channel = parseChannelMetadata(initialData, u, id, seed), apiCfg = extractInnertubeConfig(html), videos = dedupeByVideoId(hydrateChannelItems(normalizeVideoItems(collectVideos(root), q, channel), channel));
  return {
    items: videos,
    continuation: videos.length ? extractContinuationToken(root) : "",
    apiCfg: apiCfg,
    channel: channel
  };
}, fetchChannelHomePage = function(u, id, o, seed) {
  var url = stripChannelTabSuffix(u) || u;
  if (!url) throw new Error("Missing channel URL.");
  var html = fetchText(localizedURL(url)), apiCfg = extractInnertubeConfig(html), fastPage = extractChannelHomePageFromHTML(html, u, id, o, apiCfg, seed);
  if (fastPage) return fastPage;
  var initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from channel home page.");
  var channel = parseChannelMetadata(initialData, u, id, seed), preview = extractChannelHomePreview(initialData, o, channel), tabs = extractChannelTabEndpoints(initialData);
  return {
    items: hydrateChannelItems(preview.items, channel),
    continuation: "",
    continuationSource: "",
    apiCfg: apiCfg,
    channel: channel,
    channelTabFallbackPending: preview.channelTabFallbackPending,
    channelTabEndpoints: tabs
  };
}, extractChannelHomePreview = function(initialData, o, channel) {
  var wantVideos = normalizeEnabledFlag(o && o.videos), wantStreams = normalizeEnabledFlag(o && o.streams), wantShorts = normalizeEnabledFlag(o && o.shorts), root = findSelectedChannelTabContent(initialData) || initialData;
  return extractChannelHomePreviewFromContent(root, {
    videos: wantVideos,
    streams: wantStreams,
    shorts: wantShorts
  }, loadChannelHomePreviewLimit(), channel);
}, getChannelBrowseTabs = function(initialData) {
  var tabs = getIn(initialData, [ "contents", "singleColumnBrowseResultsRenderer", "tabs" ], null);
  if (Array.isArray(tabs) && tabs.length || (tabs = getIn(initialData, [ "contents", "twoColumnBrowseResultsRenderer", "tabs" ], [])), 
  Array.isArray(tabs) && tabs.length) return tabs;
  var foundTabs = [];
  collectRendererInstances(initialData, "tabRenderer", foundTabs);
  var expandableTabs = [];
  return collectRendererInstances(initialData, "expandableTabRenderer", expandableTabs), foundTabs.concat(expandableTabs);
}, getChannelTabRenderer = function(tabEntry) {
  return getIn(tabEntry, [ "tabRenderer" ], null) || getIn(tabEntry, [ "expandableTabRenderer" ], null) || (tabEntry && "object" == typeof tabEntry ? tabEntry : null);
}, extractChannelTabsFromHTML = function(html) {
  var tabs = extractJSONFragmentArray(html, '"singleColumnBrowseResultsRenderer":{"tabs":');
  return tabs && tabs.length || (tabs = extractJSONFragmentArray(html, '"twoColumnBrowseResultsRenderer":{"tabs":')), 
  Array.isArray(tabs) && tabs.length ? tabs : [];
}, extractJSONQuotedValueAt = function(input, start) {
  if (!input || start < 0 || start >= input.length) return "";
  var quote = input[start];
  if ('"' !== quote && "'" !== quote) return "";
  var decoded = decodeQuotedStringLiteral(input, start);
  return decoded ? getString(decoded.value) : "";
}, detectChannelTabKindFromURL = function(url) {
  return /\/streams(?:[/?]|$)/i.test(url) ? "streams" : /\/shorts(?:[/?]|$)/i.test(url) ? "shorts" : /\/videos(?:[/?]|$)/i.test(url) ? "videos" : "";
}, normalizeChannelTabEndpoint = function(endpoint) {
  if (!endpoint || "object" != typeof endpoint) return null;
  var out = {
    browseId: getString(endpoint.browseId),
    params: getString(endpoint.params),
    channelUrl: normalizeChannelUrl(endpoint.channelUrl)
  };
  return out.browseId || out.params || out.channelUrl ? out : null;
}, mergeChannelTabEndpoints = function(base, extra) {
  for (var out = {}, sources = [ base, extra ], keys = [ "videos", "streams", "shorts" ], i = 0; i < keys.length; i++) for (var key = keys[i], j = 0; j < sources.length; j++) {
    var endpoint = normalizeChannelTabEndpoint(getIn(sources, [ j, key ], null));
    endpoint && (out[key] = endpoint);
  }
  return out;
}, extractChannelTabEndpointsFromTabs = function(tabs) {
  for (var out = {}, list = Array.isArray(tabs) ? tabs : [], i = 0; i < list.length; i++) {
    var renderer = getChannelTabRenderer(list[i]), endpoint = getIn(renderer, [ "endpoint", "browseEndpoint" ], null), tabUrl = getString(getIn(renderer, [ "endpoint", "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(renderer, [ "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(endpoint, [ "canonicalBaseUrl" ], "")), tabKey = detectChannelTabKindFromURL(tabUrl);
    if (tabKey) {
      var nextEndpoint = normalizeChannelTabEndpoint({
        browseId: getString(getIn(endpoint, [ "browseId" ], "")),
        params: getString(getIn(endpoint, [ "params" ], "")),
        channelUrl: tabUrl
      });
      nextEndpoint && (out[tabKey] = nextEndpoint);
    }
  }
  return out;
}, extractChannelTabEndpointsFromHTML = function(html) {
  for (var out = {}, tabKinds = [ "videos", "streams", "shorts" ], i = 0; i < tabKinds.length; i++) {
    var tabKey = tabKinds[i], marker = "/" + tabKey + '","webPageType":"WEB_PAGE_TYPE_CHANNEL"', markerIndex = html.indexOf(marker);
    if (markerIndex >= 0) {
      var urlLabel = '"url":"', urlQuoteIndex = html.lastIndexOf(urlLabel, markerIndex);
      if (urlQuoteIndex >= 0) {
        var urlValue = extractJSONQuotedValueAt(html, urlQuoteIndex + urlLabel.length - 1), browseLabel = '"browseEndpoint":{"browseId":"', browseIndex = html.indexOf(browseLabel, markerIndex);
        if (browseIndex >= 0) {
          var browseValue = extractJSONQuotedValueAt(html, browseIndex + browseLabel.length - 1), paramsLabel = '"params":"', paramsIndex = html.indexOf(paramsLabel, browseIndex);
          if (paramsIndex >= 0) {
            var paramsValue = extractJSONQuotedValueAt(html, paramsIndex + paramsLabel.length - 1), endpoint = normalizeChannelTabEndpoint({
              browseId: browseValue,
              params: paramsValue,
              channelUrl: urlValue
            });
            endpoint && (out[tabKey] = endpoint);
          }
        }
      }
    }
  }
  return out;
}, extractChannelTabEndpoints = function(initialData) {
  return extractChannelTabEndpointsFromTabs(getChannelBrowseTabs(initialData));
}, findSelectedChannelTabContent = function(initialData) {
  var tabs = getChannelBrowseTabs(initialData);
  return tabs.length ? findSelectedChannelTabContentFromTabs(tabs) : null;
}, collectChannelHomePreviewSections = function(node) {
  var sections = collectChannelHomePreviewSectionsDirect(node);
  if (sections.length) return sections;
  var fallbackSections = [];
  return collectRendererInstances(node, "shelfRenderer", fallbackSections), collectRendererInstances(node, "richShelfRenderer", fallbackSections), 
  fallbackSections;
}, detectChannelHomeSectionKind = function(section) {
  var url = findChannelHomeSectionTabURL(section);
  return detectChannelTabKindFromURL(url);
}, findChannelHomeSectionTabURL = function(node) {
  if (!node) return "";
  var directURL = getString(getIn(node, [ "endpoint", "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(node, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(node, [ "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(node, [ "browseEndpoint", "canonicalBaseUrl" ], ""));
  if (detectChannelTabKindFromURL(directURL)) return directURL;
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var listURL = findChannelHomeSectionTabURL(node[i]);
      if (listURL) return listURL;
    }
    return "";
  }
  if ("object" != typeof node) return "";
  for (var urls = [ getString(getIn(node, [ "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(node, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(node, [ "endpoint", "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(node, [ "browseEndpoint", "canonicalBaseUrl" ], "")) ], j = 0; j < urls.length; j++) if (detectChannelTabKindFromURL(urls[j])) return urls[j];
  for (var key in node) if (Object.prototype.hasOwnProperty.call(node, key)) {
    var nestedURL = findChannelHomeSectionTabURL(node[key]);
    if (nestedURL) return nestedURL;
  }
  return "";
}, fetchChannelPage = function(u, id, o, seed) {
  var normalized = normalizeChannelUrl(u);
  if (!normalized && id && (normalized = normalizeChannelUrl("/channel/" + id)), 
  !normalized) throw new Error("Missing channel URL.");
  var q = cleanQuery(o && o.query), wantVideos = normalizeEnabledFlag(o && o.videos), wantStreams = normalizeEnabledFlag(o && o.streams), wantShorts = normalizeEnabledFlag(o && o.shorts);
  if (q) {
    var search = fetchChannelSearchPage(normalized, id, q, seed);
    return {
      items: filterChannelItemsForOptions(search.items, wantVideos, wantStreams, wantShorts),
      continuation: search.continuation,
      continuationSource: "search",
      apiCfg: search.apiCfg,
      channel: search.channel || buildChannelMetadata(null, null, normalized, id, seed)
    };
  }
  if (!wantVideos && !wantStreams && !wantShorts) return {
    items: [],
    continuation: "",
    continuationSource: "",
    apiCfg: defaultConfig(),
    channel: buildChannelMetadata(null, null, normalized, id, seed),
    channelTabFallbackPending: !1
  };
  var home = null;
  try {
    home = fetchChannelHomePage(normalized, id, o, seed);
    if (home && home.items.length) {
      if (home.channelTabFallbackPending && !home.continuation && home.items.length < 9) try {
        var resolved = fetchChannelPageFromTabs(normalized, id, o, home.channelTabEndpoints, home.apiCfg, home.channel || seed);
        resolved.items.length && (home.items = resolved.items), home.continuation = resolved.continuation, 
        home.continuationSource = resolved.continuationSource || "", home.apiCfg = resolved.apiCfg || home.apiCfg, 
        home.channel = resolved.channel || home.channel, home.channelTabFallbackPending = !1, 
        home.channelTabEndpoints = mergeChannelTabEndpoints(home.channelTabEndpoints, resolved.channelTabEndpoints);
      } catch (e) {}
      return home;
    }
  } catch (e) {}
  return fetchChannelPageFromTabs(normalized, id, o, home && home.channelTabEndpoints, home && home.apiCfg, seed);
}, fetchChannelPageFromTabs = function(u, id, o, tabs, cfg, seed) {
  var wantVideos = normalizeEnabledFlag(o && o.videos), wantStreams = normalizeEnabledFlag(o && o.streams), wantShorts = normalizeEnabledFlag(o && o.shorts), mergedTabs = mergeChannelTabEndpoints(null, tabs), videos = wantVideos ? fetchChannelTabPage(u, id, "videos", wantStreams || wantShorts, mergedTabs, cfg, seed) : null, streams = wantStreams ? fetchChannelTabPage(u, id, "streams", !0, mergedTabs, cfg, seed) : null, shorts = wantShorts ? fetchChannelTabPage(u, id, "shorts", !0, mergedTabs, cfg, seed) : null, items = [];
  mergedTabs = mergeChannelTabEndpoints(mergedTabs, videos && videos.channelTabEndpoints), 
  mergedTabs = mergeChannelTabEndpoints(mergedTabs, streams && streams.channelTabEndpoints), 
  mergedTabs = mergeChannelTabEndpoints(mergedTabs, shorts && shorts.channelTabEndpoints), 
  streams && streams.items.length && (items = items.concat(streams.items)), shorts && shorts.items.length && (items = items.concat(shorts.items)), 
  videos && videos.items.length && (items = items.concat(videos.items));
  var continuation = "", source = "";
  videos && videos.continuation ? (continuation = videos.continuation, source = "videos") : shorts && shorts.continuation ? (continuation = shorts.continuation, 
  source = "shorts") : streams && streams.continuation && (continuation = streams.continuation, 
  source = "streams");
  var channel = buildChannelMetadata(null, null, u, id, seed);
  return {
    items: dedupeByVideoId(items),
    continuation: continuation,
    continuationSource: source,
    apiCfg: videos && videos.apiCfg || shorts && shorts.apiCfg || streams && streams.apiCfg || defaultConfig(),
    channel: videos && videos.channel || shorts && shorts.channel || streams && streams.channel || channel,
    channelTabFallbackPending: !1,
    channelTabEndpoints: mergedTabs
  };
}, fetchChannelContinuation = function(token, apiCfg, source, channel) {
  var payload = {
    context: buildInnertubeContext(apiCfg),
    continuation: token
  }, endpoint = "search" === source ? "/youtubei/v1/search" : "/youtubei/v1/browse", response = null;
  try {
    response = callInnertube(endpoint, payload, apiCfg);
  } catch (e) {
    if ("/youtubei/v1/search" !== endpoint) throw e;
    response = callInnertube("/youtubei/v1/browse", payload, apiCfg);
  }
  var items = extractContinuationItems(response || {}), videos = normalizeVideoItems(collectVideos(items), "", channel);
  return {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(items)
  };
}, fetchWatchPayload = function(videoId) {
  var url = localizedURL(watchURL(videoId)), html = fetchText(url), initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from watch page.");
  var apiCfg = extractInnertubeConfig(html), resultsContents = getIn(initialData, [ "contents", "singleColumnWatchNextResults", "results", "results", "contents" ], []), metadata = parseWatchMetadata(initialData, videoId), relatedRaw = collectVideos(resultsContents), related = normalizeVideoItems(relatedRaw, "").filter(function(item) {
    return item.videoId && item.videoId !== videoId;
  }), relatedContinuation = extractContinuationToken(resultsContents), commentsContinuation = extractCommentsContinuation(initialData);
  return {
    link: localizedURL(watchURL(videoId), apiCfg),
    videoId: videoId,
    title: metadata.title,
    author: metadata.author,
    date: metadata.date,
    viewCount: metadata.viewCount,
    thumbnail: metadata.thumbnail,
    description: metadata.description,
    metadataLine: metadata.metadataLine,
    channelMemo: metadata.channelMemo,
    channelUrl: metadata.channelUrl,
    channelId: metadata.channelId,
    channelAvatar: metadata.channelAvatar,
    channelTitle: metadata.channelTitle || metadata.author,
    commentsContinuation: commentsContinuation,
    relatedItems: dedupeByVideoId(related),
    relatedContinuation: relatedContinuation,
    apiCfg: apiCfg
  };
}, fetchRelatedContinuation = function(token, apiCfg) {
  var payload = {
    context: buildInnertubeContext(apiCfg),
    continuation: token
  }, response = callInnertube("/youtubei/v1/next", payload, apiCfg), items = extractContinuationItems(response), videos = normalizeVideoItems(collectVideos(items), "");
  return {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(items)
  };
}, fetchCommentsContinuation = function(token, apiCfg) {
  var payload = {
    context: buildInnertubeContext(apiCfg),
    continuation: token
  }, response = callInnertube("/youtubei/v1/next", payload, apiCfg), items = extractContinuationItems(response);
  return {
    comments: parseComments(items),
    continuation: extractContinuationToken(items)
  };
}, callInnertube = function(path, body, apiCfg) {
  var cfg = resolveInnertubeConfig(apiCfg), url = YT_ORIGIN + path + "?key=" + encodeURIComponent(cfg.apiKey || DEFAULT_API_KEY), response = fetch(url, {
    method: "POST",
    bypass: SYNURA.bypass,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": resolveAcceptLanguage(cfg)
    },
    body: JSON.stringify(body || {})
  });
  if (!response || !response.ok) throw new Error("HTTP " + getNumber(response && response.status) + " from " + path);
  return response.json() || {};
}, fetchText = function(url) {
  for (var current = getString(url), localeCfg = defaultConfig(), response = null, i = 0; i <= 4 && (response = fetch(current, {
    method: "GET",
    bypass: SYNURA.bypass,
    redirect: "follow",
    headers: {
      "Accept-Language": resolveAcceptLanguage(localeCfg)
    }
  })); i++) {
    var status = getNumber(response.status);
    if (status < 300 || status >= 400) break;
    var location = getHeaderValue(response.headers, "location");
    if (!location) break;
    current = resolveURL(current, location);
  }
  if (!response || !response.ok) throw new Error("HTTP " + getNumber(response && response.status) + " from " + url);
  return response.text();
}, parseWatchMetadata = function(initialData, fallbackVideoId) {
  var out = {
    title: t("title_youtube"),
    author: "",
    date: "",
    viewCount: "",
    description: "",
    metadataLine: "",
    channelMemo: "",
    channelUrl: "",
    channelId: "",
    channelTitle: "",
    channelAvatar: "",
    thumbnail: thumbnailFromVideoId(fallbackVideoId)
  }, results = getIn(initialData, [ "contents", "singleColumnWatchNextResults", "results", "results", "contents" ], []), slimMeta = findRenderer(results, "slimVideoMetadataSectionRenderer");
  if (slimMeta) {
    var info = getIn(slimMeta, [ "contents", 0, "slimVideoInformationRenderer" ], {}), owner = getIn(slimMeta, [ "contents", 1, "slimOwnerRenderer" ], {}), title = textOf(info.title), subtitle = textOf(info.expandedSubtitle) || textOf(info.collapsedSubtitle);
    out.title = title || out.title, out.metadataLine = normalizeVideoMetadataLine(subtitle);
    var channel = textOf(owner.title) || textOf(owner.channelName), channelMemo = textOf(owner.expandedSubtitle) || textOf(owner.collapsedSubtitle);
    out.author = channel, out.channelTitle = channel, out.channelMemo = channelMemo, 
    out.channelAvatar = thumbnailFrom(owner.thumbnail);
    var channelId = getIn(owner, [ "navigationEndpoint", "browseEndpoint", "browseId" ], "");
    channelId && (out.channelId = getString(channelId));
    var channelURLPath = getIn(owner, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], "");
    out.channelUrl = channelURLPath ? toAbsoluteURL(channelURLPath) : getString(owner.channelUrl), 
    !out.channelUrl && out.channelId && (out.channelUrl = toAbsoluteURL("/channel/" + out.channelId));
    var videoId = getString(slimMeta.videoId) || fallbackVideoId;
    out.thumbnail = thumbnailFromVideoId(videoId);
    var parsed = splitMetadataLine(subtitle);
    out.viewCount = parsed.viewCount, out.date = parsed.date;
  }
  var descriptionPanel = findDescriptionPanel(initialData);
  return descriptionPanel && (out.description = descriptionPanel), out;
}, parseChannelMetadata = function(initialData, fallbackUrl, fallbackChannelId, channelSeed) {
  var meta = getIn(initialData, [ "metadata", "channelMetadataRenderer" ], null) || findRenderer(initialData, "channelMetadataRenderer"), header = getIn(initialData, [ "header", "c4TabbedHeaderRenderer" ], null) || findRenderer(initialData, "c4TabbedHeaderRenderer");
  return buildChannelMetadata(meta, header, fallbackUrl, fallbackChannelId, channelSeed);
}, buildChannelMetadata = function(meta, header, fallbackUrl, fallbackChannelId, channelSeed) {
  var seed = normalizeKnownChannelInfo(channelSeed);
  var out = {
    channelUrl: seed.channelUrl || normalizeChannelUrl(fallbackUrl),
    channelId: seed.channelId || getString(fallbackChannelId),
    channelTitle: seed.channelTitle,
    channelAvatar: seed.channelAvatar,
    channelMemo: seed.channelMemo
  };
  if (meta && (out.channelTitle = textOf(meta.title) || out.channelTitle, out.channelId = getString(meta.externalId) || out.channelId, 
  out.channelAvatar = thumbnailFrom(meta.avatar) || out.channelAvatar, meta.vanityChannelUrl && (out.channelUrl = normalizeChannelUrl(meta.vanityChannelUrl))), 
  header) {
    out.channelTitle = textOf(header.title) || out.channelTitle, out.channelId = getString(header.channelId) || out.channelId, 
    out.channelAvatar = thumbnailFrom(header.avatar) || out.channelAvatar, out.channelMemo = textOf(header.subscriberCountText) || out.channelMemo;
    var channelPath = getString(getIn(header, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], ""));
    if (channelPath || (channelPath = getString(getIn(header, [ "navigationEndpoint", "browseEndpoint", "canonicalBaseUrl" ], ""))), 
    !channelPath) {
      var handle = textOf(header.channelHandleText);
      handle && "@" === handle[0] && (channelPath = "/" + handle);
    }
    channelPath && (out.channelUrl = normalizeChannelUrl(channelPath));
  }
  return !out.channelUrl && out.channelId && (out.channelUrl = normalizeChannelUrl("/channel/" + out.channelId)), 
  out.channelTitle = out.channelTitle || t("title_channel"), out;
}, extractChannelHomePageFromHTML = function(html, normalizedChannelUrl, channelId, options, apiCfg, channelSeed) {
  var root = extractSelectedChannelTabContentFromHTML(html), tabs = null;
  if (!root) {
    tabs = extractChannelTabsFromHTML(html);
    if (!tabs || !tabs.length) return null;
    root = findSelectedChannelTabContentFromTabs(tabs);
  }
  if (!root) return null;
  var meta = extractJSONFragmentObject(html, '"channelMetadataRenderer":'), header = extractJSONFragmentObject(html, '"c4TabbedHeaderRenderer":'), channel = buildChannelMetadata(meta, header, normalizedChannelUrl, channelId, channelSeed), preview = extractChannelHomePreviewFromContent(root, options, loadChannelHomePreviewLimit(), channel);
  if (!preview.items.length) return null;
  var channelTabEndpoints = extractChannelTabEndpointsFromHTML(html);
  return {
    items: hydrateChannelItems(preview.items, channel),
    continuation: "",
    continuationSource: "",
    apiCfg: apiCfg,
    channel: channel,
    channelTabFallbackPending: preview.channelTabFallbackPending,
    channelTabEndpoints: channelTabEndpoints
  };
}, extractSelectedChannelTabContentFromHTML = function(html) {
  return extractJSONFragmentObject(html, '"selected":true,"content":');
}, extractChannelHomePreviewFromContent = function(root, options, limit, channel) {
  var wantVideos = normalizeEnabledFlag(options && options.videos), wantStreams = normalizeEnabledFlag(options && options.streams), wantShorts = normalizeEnabledFlag(options && options.shorts), targetLimit = Math.floor(getNumber(limit));
  targetLimit < 1 && (targetLimit = loadChannelHomePreviewLimit());
  for (var sections = collectChannelHomePreviewSections(root), seen = {}, items = [], i = 0; i < sections.length && items.length < targetLimit; i++) {
    var section = sections[i], renderers = collectChannelHomeSectionVideoRenderers(section, targetLimit - items.length);
    if (renderers.length) {
      var sectionItems = normalizeVideoItems(renderers, "", channel);
      if (sectionItems.length) "streams" === detectChannelHomeSectionKind(section) && (sectionItems = markItemsAsStream(sectionItems)), 
      appendUniqueChannelItems(items, filterChannelItemsForOptions(sectionItems, wantVideos, wantStreams, wantShorts), seen, targetLimit);
    }
  }
  return items.length || appendUniqueChannelItems(items, filterChannelItemsForOptions(normalizeVideoItems(collectVideoPreviewRenderers(root, targetLimit), "", channel), wantVideos, wantStreams, wantShorts), seen, targetLimit), 
  {
    items: items,
    channelTabFallbackPending: items.length > 0
  };
}, findSelectedChannelTabContentFromTabs = function(tabs) {
  for (var list = Array.isArray(tabs) ? tabs : [], i = 0; i < list.length; i++) {
    var tab = getChannelTabRenderer(list[i]);
    if (tab && tab.selected) return tab.content || tab;
  }
  for (var j = 0; j < list.length; j++) {
    var expandable = getChannelTabRenderer(list[j]);
    if (expandable && expandable.selected) return expandable.content || expandable;
  }
  return null;
}, collectChannelHomePreviewSectionsDirect = function(node) {
  for (var sectionList = getIn(node, [ "sectionListRenderer", "contents" ], []), sections = [], i = 0; i < sectionList.length; i++) {
    var entry = sectionList[i] || {};
    entry.shelfRenderer && sections.push(entry.shelfRenderer), entry.richShelfRenderer && sections.push(entry.richShelfRenderer);
    for (var contents = getIn(entry, [ "itemSectionRenderer", "contents" ], []), j = 0; j < contents.length; j++) contents[j] && contents[j].shelfRenderer && sections.push(contents[j].shelfRenderer), 
    contents[j] && contents[j].richShelfRenderer && sections.push(contents[j].richShelfRenderer);
  }
  return sections;
}, collectChannelHomeSectionVideoRenderers = function(section, limit) {
  for (var directLists = [ getIn(section, [ "content", "horizontalListRenderer", "items" ], []), getIn(section, [ "content", "gridRenderer", "items" ], []), getIn(section, [ "content", "expandedShelfContentsRenderer", "items" ], []), getIn(section, [ "contents" ], []) ], maxItems = Math.floor(getNumber(limit)), out = [], i = 0; i < directLists.length && (!maxItems || out.length < maxItems); i++) for (var list = Array.isArray(directLists[i]) ? directLists[i] : [], j = 0; j < list.length && (!maxItems || out.length < maxItems); j++) pushImmediateVideoRenderers(list[j], out, maxItems);
  if (out.length) return out;
  var fallback = collectVideos(section);
  return !maxItems || fallback.length <= maxItems ? fallback : fallback.slice(0, maxItems);
}, pushImmediateVideoRenderers = function(node, out, limit) {
  if (node && "object" == typeof node && !(limit && out.length >= limit || (node.videoWithContextRenderer ? out.push(node.videoWithContextRenderer) : node.compactVideoRenderer ? out.push(node.compactVideoRenderer) : node.gridVideoRenderer ? out.push(node.gridVideoRenderer) : node.videoRenderer ? out.push(node.videoRenderer) : node.endScreenVideoRenderer ? out.push(node.endScreenVideoRenderer) : node.channelVideoPlayerRenderer ? out.push(node.channelVideoPlayerRenderer) : node.reelItemRenderer && out.push(node.reelItemRenderer), 
  limit && out.length >= limit))) {
    var richContent = getIn(node, [ "richItemRenderer", "content" ], null);
    richContent && pushImmediateVideoRenderers(richContent, out, limit);
  }
}, appendUniqueChannelItems = function(items, additions, seen, limit) {
  for (var list = Array.isArray(additions) ? additions : [], i = 0; i < list.length; i++) {
    if (limit && items.length >= limit) return;
    var item = list[i] || {}, id = getString(item.videoId);
    id && !seen[id] && (seen[id] = !0, items.push(item));
  }
}, loadChannelHomePreviewLimit = function() {
  var limit = loadChannelListChunkSize() * CHANNEL_HOME_PREVIEW_MULTIPLIER;
  return limit < CHANNEL_HOME_PREVIEW_MIN_ITEMS && (limit = CHANNEL_HOME_PREVIEW_MIN_ITEMS), 
  limit > CHANNEL_HOME_PREVIEW_MAX_ITEMS && (limit = CHANNEL_HOME_PREVIEW_MAX_ITEMS), 
  limit;
}, findDescriptionPanel = function(initialData) {
  for (var panels = getIn(initialData, [ "engagementPanels" ], []), i = 0; i < panels.length; i++) {
    var panel = getIn(panels, [ i, "engagementPanelSectionListRenderer" ], {});
    if ("video-description-ep-identifier" === panel.panelIdentifier) for (var items = getIn(panel, [ "content", "structuredDescriptionContentRenderer", "items" ], []), j = 0; j < items.length; j++) {
      var body = getIn(items, [ j, "expandableVideoDescriptionBodyRenderer" ], {}), text = textOf(body.attributedDescriptionBodyText) || textOf(body.descriptionBodyText);
      if (text = trimTo(text, 2e3)) return text;
    }
  }
  return "";
}, splitMetadataLine = function(line) {
  var text = getString(line);
  if (!text) return {
    viewCount: "",
    date: ""
  };
  var parts = text.split(/[·•]/).map(function(item) {
    return item.trim();
  }).filter(function(item) {
    return item.length > 0;
  });
  return 0 === parts.length ? {
    viewCount: "",
    date: ""
  } : 1 === parts.length ? {
    viewCount: parseRelativeDateValue(parts[0]) > 0 || isLiveLikeText(parts[0]) ? "" : normalizeViewCountText(parts[0]),
    date: parseRelativeDateValue(parts[0]) > 0 || isLiveLikeText(parts[0]) ? normalizeDateText(parts[0]) : ""
  } : {
    viewCount: normalizeViewCountText(parts[0]),
    date: normalizeDateText(parts[1])
  };
}, sameLooseText = function(left, right) {
  return getString(left).replace(/\s+/g, " ").trim().toLowerCase() === getString(right).replace(/\s+/g, " ").trim().toLowerCase();
}, looksLikeDurationText = function(text) {
  var value = getString(text).replace(/\u00a0/g, " ").trim().toLowerCase();
  if (!value) return !1;
  if (/^\d+(?::\d+){1,2}$/.test(value)) return !0;
  if (/(?:ago|today|yesterday|전|어제|오늘|昨天|今天|昨日|今日|hace|vor|fa|il y a|önce|temu|yang lalu|назад|ก่อน|trước|پہلے|منذ)/i.test(value)) return !1;
  return /^(\d+(?:[.,]\d+)?\s*(?:hours?|hrs?|minutes?|mins?|seconds?|secs?|시간|분|초|時|分|秒|分鐘|分钟|小時|小时|heures?|minutes?|secondes?|ore|minuti|secondi|horas?|minutos?|segundos?|jam|menit|detik|saat|dakika|saniye|giờ|phút|giây))(?:\s+\d+(?:[.,]\d+)?\s*(?:hours?|hrs?|minutes?|mins?|seconds?|secs?|시간|분|초|時|分|秒|分鐘|分钟|小時|小时|heures?|minutes?|secondes?|ore|minuti|secondi|horas?|minutos?|segundos?|jam|menit|detik|saat|dakika|saniye|giờ|phút|giây))*$/i.test(value);
}, looksLikeDateText = function(text) {
  var value = normalizeDateText(text);
  return !!value && (!looksLikeDurationText(value) && parseRelativeDateValue(value) > 0 || !isNaN(Date.parse(value)));
}, extractDateFromCompositeText = function(text, durationText) {
  for (var value = getString(text).replace(/\s+/g, " ").trim(), segments = value.split(/[·•,|]/).map(function(item) {
    return item.trim();
  }).filter(function(item) {
    return item.length > 0;
  }), i = 0; i < segments.length; i++) {
    var segment = normalizeDateText(segments[i]);
    if (segment && !sameLooseText(segment, durationText) && !looksLikeDurationText(segment) && looksLikeDateText(segment)) return segment;
  }
  var normalized = normalizeDateText(value);
  return normalized && !sameLooseText(normalized, durationText) && !looksLikeDurationText(normalized) && looksLikeDateText(normalized) ? normalized : "";
}, extractCommentsContinuation = function(initialData) {
  for (var panels = getIn(initialData, [ "engagementPanels" ], []), i = 0; i < panels.length; i++) {
    var panel = getIn(panels, [ i, "engagementPanelSectionListRenderer" ], {});
    if ("engagement-panel-comments-section" === panel.panelIdentifier) {
      var contents = getIn(panel, [ "content", "sectionListRenderer", "contents" ], []), token = extractContinuationToken(contents);
      if (token) return token;
    }
  }
  return "";
}, parseComments = function(items) {
  var threads = [];
  collectRendererInstances(items, "commentThreadRenderer", threads);
  for (var out = [], i = 0; i < threads.length; i++) {
    var root = getIn(threads, [ i, "comment", "commentRenderer" ], null);
    root && out.push(toCommentItem(root, 0));
    var replies = getIn(threads, [ i, "replies", "commentRepliesRenderer", "contents" ], []), replyRenderers = [];
    collectRendererInstances(replies, "commentRenderer", replyRenderers);
    for (var j = 0; j < replyRenderers.length; j++) out.push(toCommentItem(replyRenderers[j], 1));
  }
  return out;
}, toCommentItem = function(renderer, level) {
  return {
    link: "https://www.youtube.com/comment/" + getString(renderer.commentId),
    author: textOf(renderer.authorText) || t("label_youtube_user"),
    avatar: thumbnailFrom(renderer.authorThumbnail),
    date: textOf(renderer.publishedTimeText),
    likeCount: textOf(renderer.voteCount),
    content: trimTo(textOf(renderer.contentText), 1200),
    level: level || 0
  };
}, normalizeKnownChannelInfo = function(channel) {
  var info = channel || {}, out = {
    channelUrl: normalizeChannelUrl(getString(info.channelUrl)),
    channelId: getString(info.channelId),
    channelTitle: getString(info.channelTitle),
    channelAvatar: getString(info.channelAvatar),
    channelMemo: getString(info.channelMemo)
  };
  return !out.channelUrl && out.channelId && (out.channelUrl = normalizeChannelUrl("/channel/" + out.channelId)), 
  out;
}, hasKnownChannelInfo = function(channel) {
  var info = normalizeKnownChannelInfo(channel);
  return !!(getString(info.channelTitle) && (getString(info.channelUrl) || getString(info.channelId)));
}, normalizeVideoItems = function(renderers, query, channel) {
  var knownChannel = hasKnownChannelInfo(channel) ? normalizeKnownChannelInfo(channel) : null;
  for (var items = [], i = 0; i < renderers.length; i++) {
    var item = toVideoItem(renderers[i], query, knownChannel);
    item && item.videoId && items.push(item);
  }
  return dedupeByVideoId(items);
}, normalizeUpcomingStartTime = function(value) {
  var timestamp = getNumber(value);
  return timestamp > 0 ? timestamp < 1e12 ? 1e3 * timestamp : timestamp : 0;
}, extractVideoDateSortValue = function(renderer, dateText) {
  var parsedDate = parseRelativeDateValue(dateText);
  if (parsedDate > 0) return parsedDate;
  var upcomingStartTime = normalizeUpcomingStartTime(getIn(renderer, [ "upcomingEventData", "startTime" ], 0));
  return upcomingStartTime > 0 ? upcomingStartTime : isLikelyStreamRenderer(renderer) ? Date.now() : 0;
}, extractVideoNavigationPath = function(renderer) {
  for (var paths = [ getString(getIn(renderer, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(renderer, [ "onTap", "innertubeCommand", "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(renderer, [ "navigationEndpoint", "watchEndpoint", "canonicalBaseUrl" ], "")), getString(getIn(renderer, [ "navigationEndpoint", "browseEndpoint", "canonicalBaseUrl" ], "")) ], i = 0; i < paths.length; i++) if (paths[i]) return paths[i];
  return "";
}, extractRendererNavigationInfo = function(renderer) {
  var navigationPath = extractVideoNavigationPath(renderer), videoId = "";
  for (var candidates = [ getString(renderer && renderer.videoId), getString(getIn(renderer, [ "navigationEndpoint", "watchEndpoint", "videoId" ], "")), getString(getIn(renderer, [ "navigationEndpoint", "reelWatchEndpoint", "videoId" ], "")), getString(getIn(renderer, [ "onTap", "innertubeCommand", "watchEndpoint", "videoId" ], "")), getString(getIn(renderer, [ "onTap", "innertubeCommand", "reelWatchEndpoint", "videoId" ], "")), parseVideoId(navigationPath) ], i = 0; i < candidates.length; i++) if (candidates[i]) {
    videoId = candidates[i];
    break;
  }
  return {
    videoId: videoId,
    navigationPath: navigationPath
  };
}, extractRendererVideoId = function(renderer) {
  return extractRendererNavigationInfo(renderer).videoId;
}, applyVideoMetadataCandidate = function(fields, candidate, durationText, wantViewCount, wantDate, seen) {
  if (!candidate || !fields || !wantViewCount && !wantDate) return !1;
  var text = getString(textOf(candidate)).replace(/\s+/g, " ").trim();
  if (!text || seen[text]) return !1;
  seen[text] = !0;
  var parsed = splitMetadataLine(text);
  return wantViewCount && !fields.viewCount && parsed.viewCount && !sameLooseText(parsed.viewCount, durationText) && (fields.viewCount = parsed.viewCount), 
  wantDate && !fields.date && (fields.date = parsed.date || extractDateFromCompositeText(text, durationText)), 
  !!(fields.viewCount && fields.date);
}, extractVideoMetadataFields = function(renderer, durationText, wantViewCount, wantDate) {
  var needViewCount = !1 !== wantViewCount, needDate = !1 !== wantDate;
  if (!needViewCount && !needDate) return {
    viewCount: "",
    date: ""
  };
  for (var fields = {
    viewCount: "",
    date: ""
  }, seen = {}, snippets = getIn(renderer, [ "detailedMetadataSnippets" ], []), i = 0; i < 4; i++) {
    var candidate = 0 === i ? getIn(renderer, [ "metadataText" ], "") : 1 === i ? getIn(renderer, [ "videoInfo" ], "") : 2 === i ? getIn(renderer, [ "subtitle" ], "") : getIn(renderer, [ "descriptionSnippet" ], "");
    if (applyVideoMetadataCandidate(fields, candidate, durationText, needViewCount, needDate, seen)) return fields;
  }
  for (var j = 0; j < snippets.length; j++) if (applyVideoMetadataCandidate(fields, getIn(snippets, [ j, "snippetText" ], ""), durationText, needViewCount, needDate, seen)) return fields;
  return applyVideoMetadataCandidate(fields, getIn(renderer, [ "title", "accessibility", "accessibilityData", "label" ], ""), durationText, needViewCount, needDate, seen), 
  fields.viewCount && fields.date || applyVideoMetadataCandidate(fields, getIn(renderer, [ "headline", "accessibility", "accessibilityData", "label" ], ""), durationText, needViewCount, needDate, seen), 
  fields.viewCount && fields.date || applyVideoMetadataCandidate(fields, getIn(renderer, [ "accessibility", "accessibilityData", "label" ], ""), durationText, needViewCount, needDate, seen), 
  fields;
}, isShortsRenderer = function(renderer, navigationPath) {
  var path = getString(navigationPath) || extractVideoNavigationPath(renderer);
  return !!(getString(getIn(renderer, [ "navigationEndpoint", "reelWatchEndpoint", "videoId" ], "")) || getString(getIn(renderer, [ "onTap", "innertubeCommand", "reelWatchEndpoint", "videoId" ], "")) || /\/shorts(?:[/?]|$)/i.test(path));
}, toVideoItem = function(renderer, query, knownChannel) {
  var navigation = extractRendererNavigationInfo(renderer), videoId = navigation.videoId;
  if (!videoId) return null;
  var channel = knownChannel || extractChannelInfoFromVideoRenderer(renderer), title = textOf(renderer.title) || textOf(renderer.headline) || t("label_untitled"), author = textOf(renderer.shortBylineText) || textOf(renderer.longBylineText) || textOf(renderer.ownerText) || channel.channelTitle, duration = textOf(renderer.lengthText), directViewCount = normalizeViewCountText(textOf(renderer.viewCountText) || textOf(renderer.shortViewCountText)), directDate = normalizeDateText(textOf(renderer.publishedTimeText)), parsedMetadata = !directViewCount || !directDate ? extractVideoMetadataFields(renderer, duration, !directViewCount, !directDate) : null, viewCount = directViewCount || normalizeViewCountText(parsedMetadata && parsedMetadata.viewCount), likeCount = textOf(renderer.voteCount), date = directDate || normalizeDateText(parsedMetadata && parsedMetadata.date), dateSortValue = extractVideoDateSortValue(renderer, date), navigationPath = navigation.navigationPath, memoDate = formatVideoListDateForMemo(date, dateSortValue), metaParts = [];
  duration && metaParts.push(duration), viewCount && metaParts.push(viewCount), memoDate && metaParts.push(memoDate);
  var item = {
    link: /\/shorts(?:[/?]|$)/i.test(navigationPath) ? toAbsoluteURL(navigationPath) : watchURL(videoId),
    videoId: videoId,
    title: title,
    author: author,
    memo: metaParts.join(" "),
    date: date,
    dateSortValue: dateSortValue,
    viewCount: viewCount,
    mediaUrl: thumbnailFrom(renderer.thumbnail) || thumbnailFromVideoId(videoId),
    mediaType: "image",
    types: detectVideoItemTypes(renderer, navigationPath),
    menus: [ t(ITEM_MENU_OPEN_BROWSER), t(ITEM_MENU_OPEN_CHANNEL) ],
    channelUrl: channel.channelUrl,
    channelId: channel.channelId,
    channelTitle: channel.channelTitle || author,
    channelAvatar: channel.channelAvatar,
    channelMemo: channel.channelMemo
  };
  return likeCount && (item.likeCount = likeCount), item;
}, detectVideoItemTypes = function(renderer, navigationPath) {
  var types = [ "video" ];
  return isShortsRenderer(renderer, navigationPath) && types.push("shorts"), isLikelyStreamRenderer(renderer) && types.push("stream"), 
  types;
}, isLikelyStreamRenderer = function(renderer) {
  if (!renderer || "object" != typeof renderer) return !1;
  if (getString(getIn(renderer, [ "upcomingEventData", "startTime" ], ""))) return !0;
  for (var overlays = getIn(renderer, [ "thumbnailOverlays" ], []), i = 0; i < overlays.length; i++) {
    var status = getIn(overlays, [ i, "thumbnailOverlayTimeStatusRenderer" ], null);
    if (status) {
      var style = getString(status.style).toUpperCase();
      if (style.indexOf("LIVE") >= 0 || style.indexOf("UPCOMING") >= 0) return !0;
      if (isLiveLikeText(textOf(status.text)) || isLiveLikeText(textOf(getIn(status, [ "accessibility", "accessibilityData", "label" ], "")))) return !0;
    }
  }
  for (var badges = getIn(renderer, [ "badges" ], []), j = 0; j < badges.length; j++) {
    var badge = getIn(badges, [ j, "metadataBadgeRenderer" ], null);
    if (badge && (isLiveLikeText(getString(badge.style)) || isLiveLikeText(textOf(badge.label)) || isLiveLikeText(textOf(badge.tooltip)))) return !0;
  }
  return isLiveLikeText(textOf(renderer.publishedTimeText));
}, isLiveLikeText = function(text) {
  var value = getString(text).toLowerCase();
  return !!value && (value.indexOf("live") >= 0 || value.indexOf("stream") >= 0 || value.indexOf("upcoming") >= 0);
}, markItemsAsStream = function(items) {
  for (var out = [], i = 0; i < items.length; i++) {
    var item = copyObject(items[i] || {}), types = Array.isArray(item.types) ? item.types.slice() : [ "video" ];
    types.indexOf("stream") < 0 && types.push("stream"), item.types = types, item.memo || (item.memo = t("label_live_stream")),
    out.push(item);
  }
  return out;
}, filterChannelItemsForOptions = function(items, wantVideos, wantStreams, wantShorts) {
  for (var out = [], i = 0; i < items.length; i++) {
    var item = items[i] || {}, isStream = Array.isArray(item.types) && item.types.indexOf("stream") >= 0, isShorts = isShortVideoItem(item);
    isShorts ? wantShorts && out.push(item) : isStream ? wantStreams && out.push(item) : wantVideos && out.push(item);
  }
  return out;
}, hydrateChannelItems = function(items, channel) {
  for (var list = Array.isArray(items) ? items : [], info = channel || {}, i = 0; i < list.length; i++) {
    var item = list[i];
    item && "object" == typeof item && (item.channelUrl = getString(item.channelUrl) || getString(info.channelUrl), 
    item.channelId = getString(item.channelId) || getString(info.channelId), item.channelTitle = getString(item.channelTitle) || getString(info.channelTitle), 
    item.channelAvatar = getString(item.channelAvatar) || getString(info.channelAvatar), 
    item.channelMemo = getString(item.channelMemo) || getString(info.channelMemo), getString(item.author) || (item.author = item.channelTitle || getString(info.channelTitle)));
  }
  return list;
}, extractChannelInfoFromVideoRenderer = function(renderer) {
  var nav = getIn(renderer, [ "shortBylineText", "runs", 0, "navigationEndpoint" ], null);
  nav || (nav = getIn(renderer, [ "longBylineText", "runs", 0, "navigationEndpoint" ], null)), 
  nav || (nav = getIn(renderer, [ "ownerText", "runs", 0, "navigationEndpoint" ], null));
  var channelId = getString(getIn(nav, [ "browseEndpoint", "browseId" ], "")), channelPath = getString(getIn(nav, [ "commandMetadata", "webCommandMetadata", "url" ], ""));
  channelPath || (channelPath = getString(getIn(nav, [ "browseEndpoint", "canonicalBaseUrl" ], ""))), 
  !channelPath && channelId && (channelPath = "/channel/" + channelId);
  var channelTitle = textOf(renderer.shortBylineText) || textOf(renderer.longBylineText) || textOf(renderer.ownerText), channelAvatar = thumbnailFrom(getIn(renderer, [ "channelThumbnailSupportedRenderers", "channelThumbnailWithLinkRenderer", "thumbnail" ], {})) || thumbnailFrom(getIn(renderer, [ "channelThumbnail" ], {}));
  return {
    channelUrl: normalizeChannelUrl(channelPath),
    channelId: channelId,
    channelTitle: channelTitle,
    channelAvatar: channelAvatar,
    channelMemo: ""
  };
}, collectVideos = function(node) {
  var renderers = [];
  return collectRendererInstances(node, "videoWithContextRenderer", renderers), collectRendererInstances(node, "compactVideoRenderer", renderers), 
  collectRendererInstances(node, "gridVideoRenderer", renderers), collectRendererInstances(node, "videoRenderer", renderers), 
  collectRendererInstances(node, "endScreenVideoRenderer", renderers), collectRendererInstances(node, "channelVideoPlayerRenderer", renderers), 
  collectRendererInstances(node, "reelItemRenderer", renderers), 
  renderers;
}, VIDEO_PREVIEW_RENDERER_KEYS = [ "videoWithContextRenderer", "compactVideoRenderer", "gridVideoRenderer", "videoRenderer", "endScreenVideoRenderer", "channelVideoPlayerRenderer", "reelItemRenderer" ], collectVideoPreviewRenderers = function(node, limit) {
  var maxItems = Math.floor(getNumber(limit)), out = [];
  return maxItems < 1 && (maxItems = loadChannelHomePreviewLimit()), collectVideoPreviewRenderersRecursive(node, out, maxItems), 
  out;
}, collectVideoPreviewRenderersRecursive = function(node, out, limit) {
  if (!(limit && out.length >= limit || !node)) if (Array.isArray(node)) for (var i = 0; i < node.length && (!limit || out.length < limit); i++) collectVideoPreviewRenderersRecursive(node[i], out, limit); else if ("object" == typeof node) {
    for (var j = 0; j < VIDEO_PREVIEW_RENDERER_KEYS.length; j++) {
      var renderer = node[VIDEO_PREVIEW_RENDERER_KEYS[j]];
      if (renderer) {
        out.push(renderer);
        return;
      }
    }
    if (!limit || out.length < limit) for (var key in node) if (Object.prototype.hasOwnProperty.call(node, key) && (collectVideoPreviewRenderersRecursive(node[key], out, limit), 
    limit && out.length >= limit)) break;
  }
}, collectRendererInstances = function(node, rendererName, out) {
  if (node) if (Array.isArray(node)) for (var i = 0; i < node.length; i++) collectRendererInstances(node[i], rendererName, out); else if ("object" == typeof node) for (var key in node[rendererName] && out.push(node[rendererName]), 
  node) Object.prototype.hasOwnProperty.call(node, key) && collectRendererInstances(node[key], rendererName, out);
}, extractContinuationItems = function(response) {
  var out = [], buckets = [];
  Array.isArray(response.onResponseReceivedCommands) && (buckets = buckets.concat(response.onResponseReceivedCommands)), 
  Array.isArray(response.onResponseReceivedActions) && (buckets = buckets.concat(response.onResponseReceivedActions)), 
  Array.isArray(response.onResponseReceivedEndpoints) && (buckets = buckets.concat(response.onResponseReceivedEndpoints));
  for (var i = 0; i < buckets.length; i++) {
    var item = buckets[i] || {}, append = getIn(item, [ "appendContinuationItemsAction", "continuationItems" ], null), reload = getIn(item, [ "reloadContinuationItemsCommand", "continuationItems" ], null);
    Array.isArray(append) && (out = out.concat(append)), Array.isArray(reload) && (out = out.concat(reload));
  }
  return out;
}, extractContinuationToken = function(node) {
  var continuations = [];
  collectRendererInstances(node, "continuationItemRenderer", continuations);
  for (var i = 0; i < continuations.length; i++) {
    var token = getIn(continuations, [ i, "continuationEndpoint", "continuationCommand", "token" ], "");
    if (token) return token;
  }
  return "";
}, findRenderer = function(node, rendererName) {
  var list = [];
  return collectRendererInstances(node, rendererName, list), list.length ? list[0] : null;
}, extractInnertubeConfig = function(html) {
  var extractedApiKey = extractQuotedConfig(html, "INNERTUBE_API_KEY"), cfg = {
    apiKey: resolveApiKey(extractedApiKey),
    clientName: extractQuotedConfig(html, "INNERTUBE_CLIENT_NAME") || DEFAULT_CLIENT_NAME,
    clientVersion: extractQuotedConfig(html, "INNERTUBE_CLIENT_VERSION") || DEFAULT_CLIENT_VERSION,
    hl: extractQuotedConfig(html, "HL") || DEFAULT_HL,
    gl: extractQuotedConfig(html, "GL") || DEFAULT_GL
  };
  return applyLocaleToConfig(cfg), saveInnertubeConfigCache(cfg) || cfg;
}, extractQuotedConfig = function(html, key) {
  if (!html || !key) return "";
  var pattern = new RegExp('"' + key + '":"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"'), match = html.match(pattern);
  return match && match[1] ? decodeCommonEscapes(match[1]) : "";
}, defaultConfig = function() {
  var cfg = {
    apiKey: resolveApiKey(""),
    clientName: DEFAULT_CLIENT_NAME,
    clientVersion: DEFAULT_CLIENT_VERSION,
    hl: DEFAULT_HL,
    gl: DEFAULT_GL
  };
  return applyLocaleToConfig(cfg), cfg;
}, normalizeInnertubeConfig = function(cfg) {
  if (!cfg || "object" != typeof cfg) return null;
  var out = {
    apiKey: resolveApiKey(cfg.apiKey),
    clientName: getString(cfg.clientName) || DEFAULT_CLIENT_NAME,
    clientVersion: getString(cfg.clientVersion) || DEFAULT_CLIENT_VERSION,
    hl: getString(cfg.hl) || DEFAULT_HL,
    gl: getString(cfg.gl) || DEFAULT_GL,
    acceptLanguage: getString(cfg.acceptLanguage)
  };
  return applyLocaleToConfig(out), out;
}, loadInnertubeConfigCache = function() {
  if (innertubeConfigCache && innertubeConfigCache.apiKey) return (innertubeConfigCache = normalizeInnertubeConfig(innertubeConfigCache) || null) ? copyObject(innertubeConfigCache) : null;
  if ("undefined" == typeof sessionStorage || !sessionStorage || "function" != typeof sessionStorage.getItem) return null;
  var raw = null;
  try {
    raw = sessionStorage.getItem(INNERTUBE_CONFIG_CACHE_KEY);
  } catch (e) {
    raw = null;
  }
  if (!raw) return null;
  var parsed = raw;
  if ("string" == typeof raw) try {
    parsed = JSON.parse(raw);
  } catch (e2) {
    return null;
  }
  var normalized = normalizeInnertubeConfig(parsed);
  return normalized && normalized.apiKey ? (innertubeConfigCache = copyObject(normalized), 
  copyObject(normalized)) : null;
}, saveInnertubeConfigCache = function(cfg) {
  var normalized = normalizeInnertubeConfig(cfg);
  if (!normalized || !normalized.apiKey) return normalized;
  if (innertubeConfigCache = copyObject(normalized), "undefined" != typeof sessionStorage && sessionStorage && "function" == typeof sessionStorage.setItem) try {
    sessionStorage.setItem(INNERTUBE_CONFIG_CACHE_KEY, JSON.stringify(innertubeConfigCache));
  } catch (e) {}
  return copyObject(normalized);
}, resolveInnertubeConfig = function(apiCfg) {
  var provided = normalizeInnertubeConfig(apiCfg);
  if (provided && provided.apiKey) return saveInnertubeConfigCache(provided) || provided;
  var cached = loadInnertubeConfigCache();
  return cached && cached.apiKey ? cached : provided || defaultConfig();
}, buildInnertubeContext = function(apiCfg) {
  var cfg = resolveInnertubeConfig(apiCfg);
  return {
    client: {
      hl: cfg.hl || DEFAULT_HL,
      gl: cfg.gl || DEFAULT_GL,
      clientName: cfg.clientName || DEFAULT_CLIENT_NAME,
      clientVersion: cfg.clientVersion || DEFAULT_CLIENT_VERSION,
      platform: "MOBILE"
    }
  };
}, extractJSONVar = function(html, varName) {
  var marker = "var " + varName + " = ", start = html.indexOf(marker);
  if (start < 0) return null;
  for (start += marker.length; start < html.length && isSpaceChar(html.charCodeAt(start)); ) start++;
  if ("'" === html[start]) {
    var str = decodeQuotedStringLiteral(html, start);
    if (!str) return null;
    try {
      return JSON.parse(str.value);
    } catch (e) {
      try {
        return JSON.parse(latin1ToUtf8(str.value));
      } catch (e2) {
        return null;
      }
    }
  }
  if ("{" === html[start]) {
    var end = findMatchingJSONEnd(html, start);
    if (end > start) {
      var jsonText = html.slice(start, end + 1);
      try {
        return JSON.parse(jsonText);
      } catch (e3) {
        return null;
      }
    }
  }
  return null;
}, extractJSONFragmentObject = function(html, marker) {
  return extractJSONFragmentWithMarker(html, marker, "{");
}, extractJSONFragmentArray = function(html, marker) {
  return extractJSONFragmentWithMarker(html, marker, "[");
}, extractJSONFragmentWithMarker = function(html, marker, startChar) {
  if (!html || !marker || !startChar) return null;
  var start = html.indexOf(marker);
  if (start < 0) return null;
  for (start += marker.length; start < html.length && isSpaceChar(html.charCodeAt(start)); ) start++;
  if (html[start] !== startChar) return null;
  var end = findMatchingJSONEnd(html, start);
  if (end <= start) return null;
  try {
    return JSON.parse(html.slice(start, end + 1));
  } catch (e) {
    return null;
  }
}, decodeQuotedStringLiteral = function(input, quoteIndex) {
  var quote = input[quoteIndex];
  if ("'" !== quote && '"' !== quote) return null;
  for (var i = quoteIndex + 1, len = input.length, nextQuote = input.indexOf(quote, i); i < len; ) {
    var nextEscape = input.indexOf("\\", i);
    if (nextQuote < i && (nextQuote = input.indexOf(quote, i)), nextQuote >= 0 && nextQuote < (nextEscape >= 0 ? nextEscape : len)) {
      var literal = input.slice(quoteIndex, nextQuote + 1);
      try {
        return {
          value: new Function("return " + literal)(),
          endIndex: nextQuote
        };
      } catch (e) {
        return null;
      }
    }
    if (nextEscape < 0) break;
    i = nextEscape + 2;
  }
  return null;
}, decodeCommonEscapes = function(input) {
  for (var out = [], i = 0; i < input.length; i++) {
    var ch = input[i];
    if ("\\" === ch) {
      if (i + 1 >= input.length) break;
      var next = input[++i];
      if ("x" !== next) if ("u" !== next) "n" !== next ? "r" !== next ? "t" !== next ? "b" !== next ? "f" !== next ? "v" !== next ? "\\" !== next ? '"' !== next ? "'" !== next ? "/" !== next ? out.push(next) : out.push("/") : out.push("'") : out.push('"') : out.push("\\") : out.push("\v") : out.push("\f") : out.push("\b") : out.push("\t") : out.push("\r") : out.push("\n"); else {
        var hex4 = input.slice(i + 1, i + 5);
        /^[0-9a-fA-F]{4}$/.test(hex4) ? (out.push(String.fromCharCode(parseInt(hex4, 16))), 
        i += 4) : out.push("u");
      } else {
        var hex2 = input.slice(i + 1, i + 3);
        /^[0-9a-fA-F]{2}$/.test(hex2) ? (out.push(String.fromCharCode(parseInt(hex2, 16))), 
        i += 2) : out.push("x");
      }
    } else out.push(ch);
  }
  return out.join("");
}, latin1ToUtf8 = function(input) {
  for (var bytes = [], i = 0; i < input.length; i++) {
    var code = input.charCodeAt(i);
    code <= 255 ? bytes.push(code) : code <= 2047 ? (bytes.push(192 | code >> 6), bytes.push(128 | 63 & code)) : (bytes.push(224 | code >> 12), 
    bytes.push(128 | code >> 6 & 63), bytes.push(128 | 63 & code));
  }
  return utf8BytesToString(bytes);
}, utf8BytesToString = function(bytes) {
  for (var out = [], i = 0; i < bytes.length; ) {
    var b0 = bytes[i];
    if (b0 < 128) out.push(String.fromCharCode(b0)), i++; else if (192 == (224 & b0) && i + 1 < bytes.length) {
      var cp2 = (31 & b0) << 6 | 63 & bytes[i + 1];
      out.push(String.fromCharCode(cp2)), i += 2;
    } else if (224 == (240 & b0) && i + 2 < bytes.length) {
      var cp3 = (15 & b0) << 12 | (63 & bytes[i + 1]) << 6 | 63 & bytes[i + 2];
      out.push(String.fromCharCode(cp3)), i += 3;
    } else if (240 == (248 & b0) && i + 3 < bytes.length) {
      var cp4 = (7 & b0) << 18 | (63 & bytes[i + 1]) << 12 | (63 & bytes[i + 2]) << 6 | 63 & bytes[i + 3];
      cp4 -= 65536, out.push(String.fromCharCode(55296 + (cp4 >> 10 & 1023))), out.push(String.fromCharCode(56320 + (1023 & cp4))), 
      i += 4;
    } else out.push(String.fromCharCode(b0)), i++;
  }
  return out.join("");
}, findMatchingJSONEnd = function(text, start) {
  var openChar = text[start], closeChar = "{" === openChar ? "}" : "[" === openChar ? "]" : "";
  if (!closeChar) return -1;
  for (var depth = 0, inString = !1, quote = "", escaped = !1, i = start; i < text.length; i++) {
    var ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = !1;
        continue;
      }
      if ("\\" === ch) {
        escaped = !0;
        continue;
      }
      ch === quote && (inString = !1);
    } else if ('"' !== ch && "'" !== ch) if (ch !== openChar) {
      if (ch === closeChar && 0 === --depth) return i;
    } else depth++; else inString = !0, quote = ch;
  }
  return -1;
}, findMatchingBrace = function(text, start) {
  return findMatchingJSONEnd(text, start);
}, isSpaceChar = function(code) {
  return 9 === code || 10 === code || 13 === code || 32 === code;
}, dedupeByVideoId = function(items) {
  for (var seen = {}, out = [], i = 0; i < items.length; i++) {
    var id = getString(items[i] && items[i].videoId);
    id && !seen[id] && (seen[id] = !0, out.push(items[i]));
  }
  return out;
}, textOf = function(node) {
  if (null == node) return "";
  if ("string" == typeof node) return node;
  if ("number" == typeof node) return String(node);
  if (Array.isArray(node)) {
    for (var arr = [], i = 0; i < node.length; i++) {
      var part = textOf(node[i]);
      part && arr.push(part);
    }
    return arr.join("");
  }
  if ("object" == typeof node) {
    if ("string" == typeof node.simpleText) return node.simpleText;
    if ("string" == typeof node.content) return node.content;
    if (Array.isArray(node.runs)) {
      for (var runParts = [], j = 0; j < node.runs.length; j++) {
        var text = textOf(node.runs[j]);
        text && runParts.push(text);
      }
      return runParts.join("");
    }
    if ("string" == typeof node.text) return node.text;
    var acc = getIn(node, [ "accessibility", "accessibilityData", "label" ], "");
    if (acc) return acc;
  }
  return "";
}, thumbnailFrom = function(node) {
  var thumbs = getIn(node, [ "thumbnails" ], []);
  if (!Array.isArray(thumbs) || !thumbs.length) return "";
  var best = thumbs[thumbs.length - 1] || thumbs[0] || {}, url = getString(best.url);
  return 0 === url.indexOf("//") ? "https:" + url : url;
}, thumbnailFromVideoId = function(videoId) {
  return videoId ? "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg" : "";
}, parseVideoId = function(url) {
  var input = getString(url);
  if (!input) return "";
  var direct = input.match(/^[a-zA-Z0-9_-]{11}$/);
  if (direct) return direct[0];
  var watchMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];
  var shortMatch = input.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) return shortMatch[1];
  var youtuMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  return youtuMatch && youtuMatch[1] ? youtuMatch[1] : "";
}, watchURL = function(videoId) {
  return YT_ORIGIN + "/watch?v=" + encodeURIComponent(videoId);
}, appendQueryParam = function(url, key, value) {
  var out = getString(url);
  if (!out || !key) return out;
  var encodedValue = getString(value);
  if (!encodedValue) return out;
  var separator = out.indexOf("?") >= 0 ? "&" : "?";
  return out + separator + encodeURIComponent(key) + "=" + encodeURIComponent(encodedValue);
}, localizedURL = function(url, cfg) {
  var target = getString(url);
  if (!target) return target;
  var locale = cfg || defaultConfig();
  return target = appendQueryParam(target, "hl", locale.hl || DEFAULT_HL), target = appendQueryParam(target, "gl", locale.gl || DEFAULT_GL), 
  target = appendQueryParam(target, "persist_hl", "1"), target = appendQueryParam(target, "persist_gl", "1");
}, normalizeChannelUrl = function(channelUrl) {
  var absolute = toAbsoluteURL(channelUrl);
  if (!absolute) return "";
  var clean = absolute.split("#")[0].split("?")[0];
  for (clean = clean.replace(/^https?:\/\/(?:www\.)?youtube\.com/i, YT_ORIGIN).replace(/^https?:\/\/m\.youtube\.com/i, YT_ORIGIN); clean.length > YT_ORIGIN.length + 1 && "/" === clean[clean.length - 1]; ) clean = clean.slice(0, -1);
  return clean;
}, stripChannelTabSuffix = function(channelUrl) {
  var normalized = normalizeChannelUrl(channelUrl);
  return normalized ? normalized.replace(/\/(videos|streams|shorts|live)$/i, "") : "";
}, toChannelTabURL = function(channelUrl, tabName) {
  var base = stripChannelTabSuffix(channelUrl), tab = getString(tabName).toLowerCase();
  return base ? tab ? base + "/" + tab : base : "";
}, toChannelSearchURL = function(channelUrl, query) {
  var base = stripChannelTabSuffix(channelUrl), q = cleanQuery(query);
  return base ? q ? base + "/search?query=" + encodeURIComponent(q) : base : "";
}, makeChannelPageCacheKey = function(channelUrl, channelId, options) {
  var normalizedUrl = normalizeChannelUrl(channelUrl);
  return [ normalizedUrl || "", getString(channelId) || extractChannelIdFromUrl(normalizedUrl) || "", cleanQuery(options && options.query) || "", normalizeEnabledFlag(options && options.videos) ? "1" : "0", normalizeEnabledFlag(options && options.streams) ? "1" : "0", normalizeEnabledFlag(options && options.shorts) ? "1" : "0" ].join("|");
}, touchChannelPageCacheKey = function(cacheKey) {
  if (cacheKey) {
    for (var nextOrder = [], i = 0; i < channelPageCacheOrder.length; i++) channelPageCacheOrder[i] !== cacheKey && nextOrder.push(channelPageCacheOrder[i]);
    nextOrder.push(cacheKey), channelPageCacheOrder = nextOrder;
  }
}, getCachedChannelPage = function(channelUrl, channelId, options) {
  var cacheKey = makeChannelPageCacheKey(channelUrl, channelId, options);
  if (!cacheKey) return null;
  var entry = channelPageCache[cacheKey];
  return entry ? Date.now() - getNumber(entry.savedAt) > CHANNEL_PAGE_CACHE_TTL_MS ? (delete channelPageCache[cacheKey], 
  null) : (touchChannelPageCacheKey(cacheKey), deepCloneObject(entry.page)) : null;
}, saveCachedChannelPage = function(channelUrl, channelId, options, page) {
  var cacheKey = makeChannelPageCacheKey(channelUrl, channelId, options);
  if (cacheKey && page && "object" == typeof page) for (channelPageCache[cacheKey] = {
    savedAt: Date.now(),
    page: deepCloneObject(page)
  }, touchChannelPageCacheKey(cacheKey); channelPageCacheOrder.length > CHANNEL_PAGE_CACHE_LIMIT; ) {
    var oldest = channelPageCacheOrder.shift();
    if (!oldest) break;
    delete channelPageCache[oldest];
  }
}, toAbsoluteURL = function(pathOrURL) {
  var value = getString(pathOrURL);
  return value ? 0 === value.indexOf("http://") || 0 === value.indexOf("https://") ? value : 0 === value.indexOf("//") ? "https:" + value : ("/" !== value[0] && (value = "/" + value), 
  YT_ORIGIN + value) : "";
}, getHeaderValue = function(headers, name) {
  if (!headers || !name) return "";
  var key = getString(name).toLowerCase();
  try {
    if ("function" == typeof headers.get) return getString(headers.get(name) || headers.get(key));
  } catch (e) {}
  return getString(headers[name] || headers[key]);
}, resolveURL = function(baseURL, location) {
  var base = getString(baseURL), target = getString(location);
  if (!target) return base;
  if (0 === target.indexOf("http://") || 0 === target.indexOf("https://")) return target;
  if (0 === target.indexOf("//")) return "https:" + target;
  if ("/" === target[0]) {
    var origin = YT_ORIGIN, hostMatch = base.match(/^https?:\/\/[^/]+/);
    return hostMatch && hostMatch[0] && (origin = hostMatch[0].replace(/^http:/, "https:")), 
    origin + target;
  }
  var idx = base.lastIndexOf("/");
  return idx < 0 ? YT_ORIGIN + "/" + target : base.slice(0, idx + 1) + target;
}, getIn = function(obj, path, fallback) {
  for (var cur = obj, i = 0; i < path.length; i++) {
    if (null == cur) return fallback;
    cur = cur[path[i]];
  }
  return void 0 === cur ? fallback : cur;
}, trimTo = function(value, maxLen) {
  var text = getString(value);
  return text.length <= maxLen ? text : text.slice(0, maxLen - 3) + "...";
}, getLocalizedTextPatterns = function(map) {
  var code = getCurrentUILanguageCode(), primary = code.split("-")[0];
  return map[code] || map[primary] || map.en || [];
}, stripLocalizedEdgePatterns = function(value, patterns) {
  for (var text = getString(value).replace(/\u00a0/g, " ").trim(), list = Array.isArray(patterns) ? patterns : [], i = 0; i < list.length; i++) text = text.replace(new RegExp("^\\s*(?:" + list[i] + ")\\s*", "i"), "").trim(), 
  text = text.replace(new RegExp("\\s*(?:" + list[i] + ")\\s*$", "i"), "").trim();
  return text.replace(/\s{2,}/g, " ").trim();
}, stripLocalizedAnywherePatterns = function(value, patterns) {
  for (var text = getString(value).replace(/\u00a0/g, " ").trim(), list = Array.isArray(patterns) ? patterns : [], i = 0; i < list.length; i++) text = text.replace(new RegExp("\\s*(?:" + list[i] + ")\\s*", "ig"), " ").trim();
  return text.replace(/\s{2,}/g, " ").trim();
}, normalizeViewCountText = function(value) {
  return stripLocalizedEdgePatterns(value, getLocalizedTextPatterns({
    ar: [ "مشاهدات?" ],
    bn: [ "বার দেখা হয়েছে", "বার দেখা", "ভিউ" ],
    "zh-CN": [ "观看次数", "次观看" ],
    "zh-TW": [ "觀看次數", "次觀看" ],
    en: [ "views?" ],
    fr: [ "vues?" ],
    de: [ "aufrufe?" ],
    hi: [ "बार देखा गया", "बार देखा" ],
    it: [ "visualizzazioni" ],
    id: [ "ditonton" ],
    ja: [ "回視聴" ],
    ko: [ "조회수", "회" ],
    pl: [ "wyświetle(?:nia|ń)" ],
    pt: [ "visualiza(?:ções|ção|coes|cao)" ],
    ru: [ "просмотр(?:ов|а)?" ],
    es: [ "vistas?" ],
    th: [ "ครั้งในการรับชม", "ครั้ง" ],
    tr: [ "görüntüleme" ],
    vi: [ "lượt xem" ],
    ur: [ "مرتبہ دیکھا گیا" ]
  }));
}, stripLeadingDateLabel = function(value) {
  var text = getString(value).trim(), colonIndex = text.search(/[:：]/);
  if (!text || colonIndex <= 0 || colonIndex > 32) return text;
  var prefix = text.slice(0, colonIndex).trim();
  return !prefix || /\d/.test(prefix) || /[/.?#]/.test(prefix) ? text : text.slice(colonIndex + 1).trim();
}, normalizeDateText = function(value) {
  var text = stripLeadingDateLabel(value).replace(/\u00a0/g, " ").trim(), cleaned = stripLocalizedAnywherePatterns(text, getLocalizedTextPatterns({
    ar: [ "تم البث مباشرة", "بث مباشرًا?", "بث" ],
    bn: [ "স্ট্রিম করা হয়েছে", "লাইভ স্ট্রিম করা হয়েছে", "স্ট্রিম" ],
    "zh-CN": [ "直播过", "直播", "串流播放" ],
    "zh-TW": [ "直播過", "直播", "串流播放" ],
    en: [ "started streaming", "streamed live", "streamed", "streaming" ],
    fr: [ "diffusé en direct", "diffusé", "diffusion" ],
    de: [ "im livestream", "live gestreamt", "gestreamt" ],
    hi: [ "लाइव स्ट्रीम किया गया", "स्ट्रीम किया गया", "स्ट्रीम" ],
    it: [ "trasmesso in streaming", "in streaming", "trasmesso", "streaming" ],
    id: [ "ditayangkan secara streaming", "ditayangkan", "streaming" ],
    ja: [ "ライブ配信", "配信済み", "配信" ],
    ko: [ "라이브 스트리밍됨", "스트리밍됨", "스트리밍" ],
    pl: [ "transmitowano na żywo", "transmitowano", "streamowano" ],
    pt: [ "transmitido ao vivo", "transmitido", "transmitida", "streaming" ],
    ru: [ "в эфире", "в трансляции", "трансляция", "транслировалось" ],
    es: [ "transmitido en directo", "se transmitió", "transmitido", "emitido" ],
    th: [ "สตรีมสด", "สตรีมแล้ว", "สตรีม" ],
    tr: [ "canlı yayınlandı", "yayınlandı", "aktarıldı" ],
    vi: [ "đã phát trực tiếp", "đã phát trực tuyến", "phát trực tuyến" ],
    ur: [ "براہ راست اسٹریم کیا گیا", "سٹریم کیا گیا", "سٹریم" ]
  }));
  return cleaned || text;
}, formatNumericDateParts = function(year, month, day, includeYear, order, separator) {
  var parts = [], values = {
    year: String(year),
    month: String(month),
    day: String(day)
  };
  return includeYear || (order = order.filter(function(part) {
    return "year" !== part;
  })), order.forEach(function(part) {
    parts.push(values[part]);
  }), parts.join(separator || "/");
}, formatVideoListDateForMemo = function(dateText, dateSortValue) {
  var timestamp = getNumber(dateSortValue) || parseRelativeDateValue(dateText);
  if (!(timestamp > 0)) return "";
  var date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";
  var now = new Date(), includeYear = date.getFullYear() !== now.getFullYear(), year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), code = getCurrentUILanguageCode(), primary = code.split("-")[0];
  return "zh-CN" === code || "zh-TW" === code || "ja" === primary ? formatNumericDateParts(year, month, day, includeYear, [ "year", "month", "day" ], "/") : "ko" === primary ? formatNumericDateParts(year, month, day, includeYear, [ "year", "month", "day" ], ". ") : "de" === primary || "pl" === primary || "ru" === primary || "tr" === primary ? formatNumericDateParts(year, month, day, includeYear, [ "day", "month", "year" ], ".") : "en" === primary ? formatNumericDateParts(year, month, day, includeYear, [ "month", "day", "year" ], "/") : formatNumericDateParts(year, month, day, includeYear, [ "day", "month", "year" ], "/");
}, normalizeVideoMetadataLine = function(value) {
  for (var parts = getString(value).split("·"), out = [], i = 0; i < parts.length; i++) {
    var part = normalizeDateText(normalizeViewCountText(parts[i])).trim();
    part && out.push(part);
  }
  return out.join(" · ");
}, cleanQuery = function(value) {
  return getString(value).replace(/\s+/g, " ").trim();
}, showSnackbar = function(viewId, message) {
  synura.update(viewId, {
    models: {
      snackbar: message
    }
  });
}, openBrowser = function(url, title) {
  synura.open({
    view: "/views/browser",
    styles: {
      title: title || t("title_browser")
    },
    models: {
      url: url
    }
  });
}, makeStarredChannelKey = function(channelUrl, channelId) {
  var id = getString(channelId) || extractChannelIdFromUrl(channelUrl);
  if (id) return "id:" + id;
  var url = normalizeChannelUrl(channelUrl);
  return url ? "url:" + url.toLowerCase() : "";
}, extractChannelIdFromUrl = function(channelUrl) {
  var normalized = normalizeChannelUrl(channelUrl);
  if (!normalized) return "";
  var match = normalized.match(/\/channel\/([A-Za-z0-9_-]+)/i);
  return match && match[1] ? getString(match[1]) : "";
}, normalizeStarredIdentity = function(channelUrl, channelId) {
  var normalizedUrl = normalizeChannelUrl(channelUrl), normalizedId = getString(channelId) || extractChannelIdFromUrl(normalizedUrl);
  return !normalizedUrl && normalizedId && (normalizedUrl = normalizeChannelUrl("/channel/" + normalizedId)), 
  {
    channelUrl: normalizedUrl,
    channelId: normalizedId
  };
}, channelsEquivalent = function(leftUrl, leftId, rightUrl, rightId) {
  var left = normalizeStarredIdentity(leftUrl, leftId), right = normalizeStarredIdentity(rightUrl, rightId);
  return !(!left.channelId || !right.channelId || left.channelId !== right.channelId) || !(!left.channelUrl || !right.channelUrl || left.channelUrl.toLowerCase() !== right.channelUrl.toLowerCase());
}, normalizeChannelTitleKey = function(value) {
  return getString(value).replace(/\s+/g, " ").trim().toLowerCase();
}, normalizeChannelAvatarKey = function(value) {
  var avatar = getString(value).trim();
  return avatar ? avatar.split("?")[0].toLowerCase() : "";
}, channelsLikelySame = function(left, right) {
  var l = left || {}, r = right || {};
  if (channelsEquivalent(l.channelUrl, l.channelId, r.channelUrl, r.channelId)) return !0;
  var leftTitle = normalizeChannelTitleKey(l.channelTitle), rightTitle = normalizeChannelTitleKey(r.channelTitle);
  if (!leftTitle || !rightTitle || leftTitle !== rightTitle) return !1;
  var leftAvatar = normalizeChannelAvatarKey(l.channelAvatar), rightAvatar = normalizeChannelAvatarKey(r.channelAvatar);
  return !(!leftAvatar || !rightAvatar || leftAvatar !== rightAvatar);
}, normalizeLanguageCode = function(value) {
  var raw = getString(value).replace(/_/g, "-").trim();
  if (!raw) return "";
  var lower = raw.toLowerCase();
  if ("zh-hans" === lower || "zh-cn" === lower) return "zh-CN";
  if ("zh-hant" === lower || "zh-tw" === lower) return "zh-TW";
  for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) {
    var item = YOUTUBE_LANGUAGES[i] || {}, code = getString(item.code), hl = getString(item.hl);
    if (code.toLowerCase() === lower || hl.toLowerCase() === lower) return code;
  }
  var dash = lower.indexOf("-");
  if (dash > 0) for (var primary = lower.slice(0, dash), j = 0; j < YOUTUBE_LANGUAGES.length; j++) {
    var fallbackCode = getString(YOUTUBE_LANGUAGES[j] && YOUTUBE_LANGUAGES[j].code);
    if (fallbackCode.toLowerCase() === primary) return fallbackCode;
  }
  return "";
}, findLanguageByCode = function(value) {
  var normalized = normalizeLanguageCode(value);
  if (!normalized) return null;
  for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) if (getString(YOUTUBE_LANGUAGES[i] && YOUTUBE_LANGUAGES[i].code) === normalized) return YOUTUBE_LANGUAGES[i];
  return null;
}, findLanguageByLabel = function(value) {
  var label = getString(value);
  if (!label) return null;
  for (var i = 0; i < YOUTUBE_LANGUAGES.length; i++) if (getString(YOUTUBE_LANGUAGES[i] && YOUTUBE_LANGUAGES[i].label) === label) return YOUTUBE_LANGUAGES[i];
  return null;
}, loadRuntimeLanguageCode = function() {
  if ("undefined" == typeof navigator || !navigator) return "";
  return normalizeLanguageCode(navigator.language);
}, getCurrentLanguageSetting = function() {
  var selected = findLanguageByCode(loadLanguageOverride()) || findLanguageByCode(loadRuntimeLanguageCode());
  return selected || (findLanguageByCode(DEFAULT_HL) || YOUTUBE_LANGUAGES[0]);
}, getCurrentUILanguageCode = function() {
  var current = getCurrentLanguageSetting(), code = normalizeLanguageCode(current && current.code);
  return code || DEFAULT_HL;
}, getUIStrings = function () {
  var code = getCurrentUILanguageCode(), primary = code.split("-")[0];
  return UI_STRINGS[code] || UI_STRINGS[primary] || UI_STRINGS.en || [];
}, t = function (key, params) {
  var id = getString(key), index = Object.prototype.hasOwnProperty.call(UI_STRING_INDEX, id) ? UI_STRING_INDEX[id] : -1, strings = getUIStrings(), base = UI_STRINGS.en || [], template = getString(strings && strings[index]) || getString(base[index]) || id;
  return params && "object" == typeof params ? template.replace(/\{([a-zA-Z0-9_]+)\}/g, function (match, name) {
    return getString(params[name]);
  }) : template;
}, getUIStringVariants = function (key) {
  var id = getString(key), index = Object.prototype.hasOwnProperty.call(UI_STRING_INDEX, id) ? UI_STRING_INDEX[id] : -1, cached = uiStringVariantsCache[id], out = [], seen = {};
  if (!id) return out;
  if (cached) return cached;
  for (var locale in UI_STRINGS) if (Object.prototype.hasOwnProperty.call(UI_STRINGS, locale)) {
    var value = getString(UI_STRINGS[locale] && UI_STRINGS[locale][index]);
    value && !seen[value] && (seen[value] = !0, out.push(value));
  }
  return out.length || (out.push(id), seen[id] = !0), uiStringVariantsCache[id] = out, out;
}, matchesUIString = function(value, key) {
  var text = getString(value);
  if (!text) return !1;
  for (var variants = getUIStringVariants(key), i = 0; i < variants.length; i++) if (text === variants[i] || text.indexOf(variants[i]) >= 0) return !0;
  return !1;
}, getQuickQueryLabel = function(item) {
  return t(getString(item && item.labelKey));
}, buildHomeSearchAppbar = function() {
  return {
    type: "query",
    label: t("appbar_search_youtube"),
    hint: t("appbar_search_videos_hint")
  };
}, getLanguageOptions = function() {
  for (var options = [], i = 0; i < YOUTUBE_LANGUAGES.length; i++) options.push(getString(YOUTUBE_LANGUAGES[i] && YOUTUBE_LANGUAGES[i].label));
  return options;
}, languageCodeFromOption = function(value) {
  var byLabel = findLanguageByLabel(value);
  if (byLabel) return getString(byLabel.code);
  var byCode = findLanguageByCode(value);
  return byCode ? getString(byCode.code) : "";
}, sanitizeApiKey = function(value) {
  return getString(value).replace(/\s+/g, "").trim();
}, loadApiKeyOverride = function() {
  return "undefined" != typeof localStorage && localStorage && "function" == typeof localStorage.getItem ? sanitizeApiKey(localStorage.getItem(API_KEY_OVERRIDE_STORAGE_KEY)) : "";
}, saveApiKeyOverride = function(apiKey) {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.setItem) return !1;
  var key = sanitizeApiKey(apiKey);
  if (!key) return !1;
  try {
    return localStorage.setItem(API_KEY_OVERRIDE_STORAGE_KEY, key), !0;
  } catch (e) {
    return !1;
  }
}, clearApiKeyOverride = function() {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.removeItem) return !1;
  try {
    return localStorage.removeItem(API_KEY_OVERRIDE_STORAGE_KEY), !0;
  } catch (e) {
    return !1;
  }
}, loadLanguageOverride = function() {
  return "undefined" != typeof localStorage && localStorage && "function" == typeof localStorage.getItem ? normalizeLanguageCode(localStorage.getItem(LANGUAGE_OVERRIDE_STORAGE_KEY)) : "";
}, saveLanguageOverride = function(languageCode) {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.setItem) return !1;
  var normalized = normalizeLanguageCode(languageCode);
  if (!normalized) return !1;
  try {
    return localStorage.setItem(LANGUAGE_OVERRIDE_STORAGE_KEY, normalized), !0;
  } catch (e) {
    return !1;
  }
}, clearLanguageOverride = function() {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.removeItem) return !1;
  try {
    return localStorage.removeItem(LANGUAGE_OVERRIDE_STORAGE_KEY), !0;
  } catch (e) {
    return !1;
  }
}, normalizeChannelListChunkSize = function(value, fallback) {
  var parsed = Math.floor(getNumber(value));
  if (parsed > 0) return parsed;
  var fallbackValue = Math.floor(getNumber(fallback));
  return fallbackValue > 0 ? fallbackValue : 0;
}, loadChannelListChunkSize = function() {
  return "undefined" != typeof localStorage && localStorage && "function" == typeof localStorage.getItem ? normalizeChannelListChunkSize(localStorage.getItem(CHANNEL_LIST_CHUNK_SIZE_STORAGE_KEY), DEFAULT_CHANNEL_LIST_CHUNK_SIZE) : DEFAULT_CHANNEL_LIST_CHUNK_SIZE;
}, saveChannelListChunkSize = function(value) {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.setItem) return !1;
  var normalized = normalizeChannelListChunkSize(value, 0);
  if (!normalized) return !1;
  try {
    return localStorage.setItem(CHANNEL_LIST_CHUNK_SIZE_STORAGE_KEY, String(normalized)), 
    !0;
  } catch (e) {
    return !1;
  }
}, clearChannelListChunkSize = function() {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.removeItem) return !1;
  try {
    return localStorage.removeItem(CHANNEL_LIST_CHUNK_SIZE_STORAGE_KEY), !0;
  } catch (e) {
    return !1;
  }
}, normalizeVideoListFilters = function(value) {
  var source = value && "object" == typeof value ? value : {};
  return {
    enableVideos: void 0 === source.enableVideos || normalizeEnabledFlag(source.enableVideos),
    enableStreams: void 0 === source.enableStreams || normalizeEnabledFlag(source.enableStreams),
    enableShorts: void 0 !== source.enableShorts && normalizeEnabledFlag(source.enableShorts)
  };
}, loadVideoListFilters = function() {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.getItem) return normalizeVideoListFilters();
  var raw = localStorage.getItem(VIDEO_LIST_FILTERS_STORAGE_KEY);
  if (!raw) return normalizeVideoListFilters();
  try {
    return normalizeVideoListFilters(JSON.parse(raw));
  } catch (e) {
    return normalizeVideoListFilters();
  }
}, saveVideoListFilters = function(value) {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.setItem) return !1;
  try {
    return localStorage.setItem(VIDEO_LIST_FILTERS_STORAGE_KEY, JSON.stringify(normalizeVideoListFilters(value))), 
    !0;
  } catch (e) {
    return !1;
  }
}, updateVideoListFilters = function(partial) {
  var current = loadVideoListFilters(), next = {
    enableVideos: void 0 === partial.enableVideos ? current.enableVideos : partial.enableVideos,
    enableStreams: void 0 === partial.enableStreams ? current.enableStreams : partial.enableStreams,
    enableShorts: void 0 === partial.enableShorts ? current.enableShorts : partial.enableShorts
  };
  return saveVideoListFilters(next);
}, applyLocaleToConfig = function(cfg) {
  var out = cfg || {}, language = getCurrentLanguageSetting();
  return out.hl = getString(language && language.hl) || DEFAULT_HL, out.gl = getString(language && language.gl) || DEFAULT_GL, 
  out.acceptLanguage = getString(language && language.acceptLanguage) || "en-US,en;q=0.9", 
  out;
}, resolveAcceptLanguage = function(cfg) {
  var value = getString(cfg && cfg.acceptLanguage);
  if (value) return value;
  var language = getCurrentLanguageSetting();
  return (value = getString(language && language.acceptLanguage)) || "en-US,en;q=0.9";
}, resolveApiKey = function(candidate) {
  var override = loadApiKeyOverride();
  if (override) return override;
  var parsed = sanitizeApiKey(candidate);
  return parsed || DEFAULT_API_KEY;
}, normalizeEnabledFlag = function(value) {
  return !1 !== value && 0 !== value && "0" !== value && "false" !== value;
}, loadStarredChannels = function() {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.getItem) return [];
  var raw = localStorage.getItem(STARRED_CHANNELS_KEY);
  if (!raw) return [];
  var parsed = [];
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  for (var out = [], deduped = !1, i = 0; i < parsed.length; i++) {
    var item = parsed[i] || {}, identity = normalizeStarredIdentity(item.channelUrl || item.link || item.url, item.channelId);
    if (identity.channelUrl || identity.channelId) {
      for (var duplicateIndex = -1, j = 0; j < out.length; j++) if (channelsLikelySame({
        channelUrl: identity.channelUrl,
        channelId: identity.channelId,
        channelTitle: getString(item.channelTitle || item.title),
        channelAvatar: getString(item.channelAvatar || item.avatar)
      }, out[j])) {
        duplicateIndex = j;
        break;
      }
      var next = {
        channelUrl: identity.channelUrl,
        channelId: identity.channelId,
        channelTitle: getString(item.channelTitle || item.title),
        channelAvatar: getString(item.channelAvatar || item.avatar),
        channelMemo: getString(item.channelMemo || item.memo),
        savedAt: getNumber(item.savedAt) || 0,
        enabled: normalizeEnabledFlag(item.enabled)
      };
      if (duplicateIndex < 0) out.push(next); else {
        deduped = !0;
        var prev = out[duplicateIndex] || {}, useNext = getNumber(next.savedAt) >= getNumber(prev.savedAt), newer = useNext ? next : prev, older = useNext ? prev : next;
        out[duplicateIndex] = {
          channelUrl: newer.channelUrl || older.channelUrl,
          channelId: newer.channelId || older.channelId,
          channelTitle: newer.channelTitle || older.channelTitle,
          channelAvatar: newer.channelAvatar || older.channelAvatar,
          channelMemo: newer.channelMemo || older.channelMemo,
          savedAt: Math.max(getNumber(prev.savedAt), getNumber(next.savedAt)),
          enabled: normalizeEnabledFlag(newer.enabled)
        };
      }
    }
  }
  return deduped && saveStarredChannels(out), out;
}, saveStarredChannels = function(channels) {
  if ("undefined" == typeof localStorage || !localStorage || "function" != typeof localStorage.setItem) return !1;
  try {
    return localStorage.setItem(STARRED_CHANNELS_KEY, JSON.stringify(channels || [])), 
    !0;
  } catch (e) {
    return !1;
  }
}, isStarredChannel = function(channelUrl, channelId, channelTitle, channelAvatar) {
  var identity = normalizeStarredIdentity(channelUrl, channelId);
  if (!identity.channelUrl && !identity.channelId) return !1;
  for (var probe = {
    channelUrl: identity.channelUrl,
    channelId: identity.channelId,
    channelTitle: getString(channelTitle),
    channelAvatar: getString(channelAvatar)
  }, channels = loadStarredChannels(), i = 0; i < channels.length; i++) if (channelsLikelySame(probe, channels[i])) return !0;
  return !1;
}, upsertStarredChannel = function(channel) {
  var identity = normalizeStarredIdentity(channel && channel.channelUrl, channel && channel.channelId), normalizedUrl = identity.channelUrl, channelId = identity.channelId, hasEnabledInput = !(!channel || void 0 === channel.enabled), requestedEnabled = normalizeEnabledFlag(channel && channel.enabled);
  if (!normalizedUrl && !channelId) return !1;
  for (var channels = loadStarredChannels(), index = -1, i = 0; i < channels.length; i++) if (channelsLikelySame({
    channelUrl: normalizedUrl,
    channelId: channelId,
    channelTitle: getString(channel && channel.channelTitle),
    channelAvatar: getString(channel && channel.channelAvatar)
  }, channels[i])) {
    index = i;
    break;
  }
  var now = Date.now(), next = {
    channelUrl: normalizedUrl,
    channelId: channelId,
    channelTitle: getString(channel && channel.channelTitle),
    channelAvatar: getString(channel && channel.channelAvatar),
    channelMemo: getString(channel && channel.channelMemo),
    savedAt: now,
    enabled: !hasEnabledInput || requestedEnabled
  };
  if (index < 0) return channels.unshift(next), saveStarredChannels(channels), !0;
  var prev = channels[index] || {}, changed = getString(prev.channelTitle) !== next.channelTitle || getString(prev.channelAvatar) !== next.channelAvatar || getString(prev.channelMemo) !== next.channelMemo || getString(prev.channelUrl) !== next.channelUrl || getString(prev.channelId) !== next.channelId || normalizeEnabledFlag(prev.enabled) !== (hasEnabledInput ? requestedEnabled : normalizeEnabledFlag(prev.enabled));
  return channels[index] = {
    channelUrl: next.channelUrl,
    channelId: next.channelId,
    channelTitle: next.channelTitle || prev.channelTitle,
    channelAvatar: next.channelAvatar || prev.channelAvatar,
    channelMemo: next.channelMemo || prev.channelMemo,
    savedAt: getNumber(prev.savedAt) || now,
    enabled: hasEnabledInput ? requestedEnabled : normalizeEnabledFlag(prev.enabled)
  }, changed && saveStarredChannels(channels), changed;
}, removeStarredChannel = function(channelUrl, channelId, channelTitle, channelAvatar) {
  var identity = normalizeStarredIdentity(channelUrl, channelId);
  if (!identity.channelUrl && !identity.channelId) return !1;
  for (var probe = {
    channelUrl: identity.channelUrl,
    channelId: identity.channelId,
    channelTitle: getString(channelTitle),
    channelAvatar: getString(channelAvatar)
  }, channels = loadStarredChannels(), filtered = [], removed = !1, i = 0; i < channels.length; i++) channelsLikelySame(probe, channels[i]) ? removed = !0 : filtered.push(channels[i]);
  return removed && saveStarredChannels(filtered), removed;
}, extractChannelHandleFromUrl = function(channelUrl) {
  var normalized = stripChannelTabSuffix(channelUrl);
  if (!normalized) return "";
  var match = normalized.match(/\/(@[A-Za-z0-9._-]+)/);
  return match && match[1] ? getString(match[1]) : "";
}, formatSavedChannelDate = function(savedAt) {
  var timestamp = getNumber(savedAt);
  if (!timestamp) return "";
  var date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";
  var year = String(date.getFullYear()), month = String(date.getMonth() + 1), day = String(date.getDate());
  return month.length < 2 && (month = "0" + month), day.length < 2 && (day = "0" + day), 
  t("label_saved_on", {
    date: year + "-" + month + "-" + day
  });
}, buildSavedChannelAuthor = function(channel) {
  var handle = extractChannelHandleFromUrl(channel && channel.channelUrl);
  if (handle) return handle;
  var channelId = getString(channel && channel.channelId);
  return channelId || t("label_bookmarked");
}, buildSavedChannelMemo = function(channel) {
  var parts = [], memo = getString(channel && channel.channelMemo), savedText = formatSavedChannelDate(channel && channel.savedAt);
  return memo && parts.push(memo), savedText && parts.push(savedText), parts.join(" - ");
}, starredChannelsToListItems = function(channels) {
  var list = Array.isArray(channels) ? channels.slice() : [];
  list.sort(function(a, b) {
    return getNumber(b && b.savedAt) - getNumber(a && a.savedAt);
  });
  for (var items = [], i = 0; i < list.length; i++) {
    var channel = list[i] || {}, channelUrl = normalizeChannelUrl(channel.channelUrl);
    !channelUrl && channel.channelId && (channelUrl = normalizeChannelUrl("/channel/" + channel.channelId)), 
    channelUrl && (!1 !== normalizeEnabledFlag(channel.enabled) && items.push({
      link: channelUrl,
      channelUrl: channelUrl,
      channelId: getString(channel.channelId),
      channelTitle: getString(channel.channelTitle),
      channelAvatar: getString(channel.channelAvatar),
      channelMemo: getString(channel.channelMemo),
      title: getString(channel.channelTitle) || channelUrl,
      author: buildSavedChannelAuthor(channel),
      memo: buildSavedChannelMemo(channel),
      mediaUrl: getString(channel.channelAvatar),
      mediaType: "image",
      menus: [ t(ITEM_MENU_OPEN_BROWSER), t(ITEM_MENU_REMOVE_BOOKMARK) ]
    }));
  }
  return items;
}, deepCloneObject = function(obj) {
  if (!obj || "object" != typeof obj) return {};
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return {
      apiKey: obj.apiKey,
      clientName: obj.clientName,
      clientVersion: obj.clientVersion,
      hl: obj.hl,
      gl: obj.gl
    };
  }
}, copyObject = function(obj) {
  if (!obj || "object" != typeof obj) return {};
  var out = {}, key = "";
  for (key in obj) Object.prototype.hasOwnProperty.call(obj, key) && (out[key] = obj[key]);
  return out;
}, getString = function(value) {
  return null == value ? "" : String(value);
}, getNumber = function(value) {
  var n = Number(value);
  return isNaN(n) ? 0 : n;
}, normalizeVideoSort = function(sortId) {
  for (var selected = getString(sortId), i = 0; i < VIDEO_SORT_IDS.length; i++) if (VIDEO_SORT_IDS[i] === selected) return selected;
  return VIDEO_SORT_DATE;
}, getVideoSortLabel = function(sortId) {
  var code = getCurrentUILanguageCode(), primary = code.split("-")[0], labels = VIDEO_SORT_LABELS[normalizeVideoSort(sortId)] || {};
  return getString(labels[code] || labels[primary] || labels.en || sortId);
}, getVideoSortFromMenu = function(menu) {
  var text = getString(menu);
  if (!text) return "";
  for (var i = 0; i < VIDEO_SORT_IDS.length; i++) {
    var sortId = VIDEO_SORT_IDS[i];
    if (text === getVideoSortLabel(sortId)) return sortId;
  }
  return "";
}, buildVideoSortMenus = function(currentSort) {
  for (var menus = [], selected = normalizeVideoSort(currentSort), i = 0; i < VIDEO_SORT_IDS.length; i++) {
    var sortId = VIDEO_SORT_IDS[i];
    menus.push({
      label: getVideoSortLabel(sortId),
      checked: sortId === selected
    });
  }
  return menus;
}, parseCompactNumericValue = function(text) {
  var value = getString(text).toLowerCase().replace(/\s+/g, "");
  if (!value) return 0;
  var compactMatch = value.match(/(\d+(?:[.,]\d+)?)\s*(k|m|b|천|만|억|万|億|亿)/i);
  if (compactMatch) {
    var numericText = compactMatch[1], suffix = getString(compactMatch[2]).toLowerCase(), multiplier = 1;
    numericText = numericText.indexOf(",") >= 0 && numericText.indexOf(".") < 0 ? numericText.replace(",", ".") : numericText.replace(/,/g, "");
    if ("k" === suffix || "천" === suffix) multiplier = 1e3; else if ("m" === suffix) multiplier = 1e6; else if ("b" === suffix) multiplier = 1e9; else if ("만" === suffix || "万" === suffix) multiplier = 1e4; else if ("억" === suffix || "億" === suffix || "亿" === suffix) multiplier = 1e8;
    var numericValue = parseFloat(numericText);
    return isNaN(numericValue) ? 0 : numericValue * multiplier;
  }
  var digitsOnly = value.replace(/[^\d]/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
}, parseRelativeDateValue = function(text) {
  var value = getString(text).toLowerCase();
  if (!value) return 0;
  if (isLiveLikeText(value) || /(?:today|오늘|今日|今天)/i.test(value)) return Date.now();
  if (/(?:yesterday|어제|昨日|昨天)/i.test(value)) return Date.now() - 864e5;
  var absoluteValue = Date.parse(getString(text));
  if (!isNaN(absoluteValue)) return absoluteValue;
  for (var units = [ {
    regex: /(\d+(?:[.,]\d+)?)\s*(?:years?|yrs?|년|年)/i,
    multiplier: 31536e6
  }, {
    regex: /(\d+(?:[.,]\d+)?)\s*(?:months?|mos?|개월|달|월|か月|ヶ月|個月|个月)/i,
    multiplier: 2592e6
  }, {
    regex: /(\d+(?:[.,]\d+)?)\s*(?:weeks?|wks?|주|週|周)/i,
    multiplier: 6048e5
  }, {
    regex: /(\d+(?:[.,]\d+)?)\s*(?:days?|일|日|天)/i,
    multiplier: 864e5
  }, {
    regex: /(\d+(?:[.,]\d+)?)\s*(?:hours?|hrs?|시간|時|小時|小时)/i,
    multiplier: 36e5
  }, {
    regex: /(\d+(?:[.,]\d+)?)\s*(?:minutes?|mins?|분|分鐘|分钟)/i,
    multiplier: 6e4
  }, {
    regex: /(\d+(?:[.,]\d+)?)\s*(?:seconds?|secs?|초|秒)/i,
    multiplier: 1e3
  } ], i = 0; i < units.length; i++) {
    var match = value.match(units[i].regex);
    if (match && match[1]) {
      var amount = match[1].indexOf(",") >= 0 && match[1].indexOf(".") < 0 ? match[1].replace(",", ".") : match[1].replace(/,/g, ""), count = parseFloat(amount);
      if (!isNaN(count)) return Date.now() - count * units[i].multiplier;
    }
  }
  return 0;
}, getVideoSortScore = function(item, sortId) {
  return VIDEO_SORT_VIEWS === sortId ? parseCompactNumericValue(item && item.viewCount) : VIDEO_SORT_DATE === sortId ? getNumber(item && item.dateSortValue) || parseRelativeDateValue(item && item.date) : VIDEO_SORT_STARRED === sortId ? isStarredChannel(item && item.channelUrl, item && item.channelId, item && item.channelTitle, item && item.channelAvatar) ? 1 : 0 : 0;
}, sortVideoItems = function(items, sortId) {
  var list = Array.isArray(items) ? items.slice() : [], selected = normalizeVideoSort(sortId);
  for (var decorated = [], i = 0; i < list.length; i++) decorated.push({
    item: list[i],
    index: i,
    score: getVideoSortScore(list[i], selected)
  });
  decorated.sort(function(left, right) {
    var delta = right.score - left.score;
    return delta || left.index - right.index;
  });
  for (var out = [], j = 0; j < decorated.length; j++) out.push(decorated[j].item);
  return out;
}, sortVideoItemsForState = function(state, items) {
  return sortVideoItems(items, state && state.videoSort);
}, rebuildChannelVisibleItems = function(state, targetVisibleCount) {
  if (state) {
    var allItems = sortVideoItemsForState(state, (state.items || []).concat(state.pendingItems || [])), visibleCount = Math.floor(getNumber(targetVisibleCount));
    visibleCount < 0 && (visibleCount = 0), visibleCount > allItems.length && (visibleCount = allItems.length), 
    state.items = allItems.slice(0, visibleCount), state.pendingItems = allItems.slice(visibleCount);
  }
}, isSortableVideoListState = function(state) {
  return !!state && ("search" === state.mode || "related" === state.mode || "channel" === state.mode || isHomeTrendingState(state));
}, applyVideoSortSelection = function(viewId, state) {
  if (state) {
    var snackbar = getVideoSortLabel(state.videoSort);
    "channel" === state.mode ? (rebuildChannelVisibleItems(state, state.items.length), renderChannelList(viewId, state), 
    showSnackbar(viewId, snackbar)) : "related" === state.mode ? renderRelatedList(viewId, state, snackbar) : "search" === state.mode ? renderSearchList(viewId, state, snackbar) : isHomeTrendingState(state) && renderHomeTrendingList(viewId, state, snackbar);
  }
};
