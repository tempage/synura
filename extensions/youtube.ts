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
  tags: [ "video", "streaming", "search", "media" ],
  get main() {
    return handler;
  }
}, DEFAULT_QUERY = "technology", DEFAULT_HL = "en", DEFAULT_GL = "US", DEFAULT_CLIENT_NAME = "MWEB", DEFAULT_CLIENT_VERSION = "2.20260304.01.00", DEFAULT_API_KEY = "", YT_ORIGIN = "https://" + SYNURA.domain, QUICK_QUERIES = [ {
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
}, SEARCH_MENU_OPEN = "menu_open_youtube", POST_MENU_OPEN = "menu_open_browser", POST_MENU_RELATED = "menu_open_related", POST_MENU_CHANNEL = "menu_open_channel", MENU_SETTINGS = "menu_settings", HOME_MENU_CHANNEL_LIST = "menu_channel_list", CHANNEL_MENU_BOOKMARK = "menu_bookmark_channel", CHANNEL_MENU_UNBOOKMARK = "menu_remove_bookmark", CHANNEL_MENU_OPEN_BROWSER = "menu_open_channel_browser", CHANNEL_MENU_ENABLE_VIDEOS = "menu_enable_videos", CHANNEL_MENU_ENABLE_STREAMS = "menu_enable_streams", ITEM_MENU_OPEN_BROWSER = "menu_open_browser", ITEM_MENU_OPEN_VIDEO = "menu_open_video", ITEM_MENU_OPEN_CHANNEL = "menu_open_channel", ITEM_MENU_REMOVE_BOOKMARK = "menu_remove_bookmark", BUTTON_SAVE = "button_save", BUTTON_CLEAR = "button_clear", BUTTON_CANCEL = "button_cancel", STARRED_CHANNELS_KEY = "youtube_starred_channels_v1", API_KEY_OVERRIDE_STORAGE_KEY = "youtube_api_key_override_v1", LANGUAGE_OVERRIDE_STORAGE_KEY = "youtube_language_override_v1", CHANNEL_LIST_CHUNK_SIZE_STORAGE_KEY = "youtube_channel_list_chunk_size_v1", INNERTUBE_CONFIG_CACHE_KEY = "youtube_innertube_config_v1", CHANNEL_PAGE_CACHE_TTL_MS = 3e5, CHANNEL_PAGE_CACHE_LIMIT = 24, DEFAULT_CHANNEL_LIST_CHUNK_SIZE = 16, CHANNEL_HOME_PREVIEW_MIN_ITEMS = 16, CHANNEL_HOME_PREVIEW_MAX_ITEMS = 32, CHANNEL_HOME_PREVIEW_MULTIPLIER = 1, innertubeConfigCache = null, channelPageCache = {}, channelPageCacheOrder = [], YOUTUBE_LANGUAGES = [ {
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
} ], UI_STRING_KEYS = [ "quick_query_trending", "quick_query_music", "quick_query_gaming", "quick_query_news", "quick_query_coding", "menu_open_youtube", "menu_open_browser", "menu_open_related", "menu_open_channel", "menu_settings", "menu_channel_list", "menu_bookmark_channel", "menu_remove_bookmark", "menu_open_channel_browser", "menu_enable_videos", "menu_enable_streams", "menu_open_video", "button_save", "button_clear", "button_cancel", "title_starred_channels", "title_youtube", "title_related_videos", "title_channel", "title_browser", "title_search_results", "appbar_search_youtube", "appbar_search_videos_hint", "appbar_search_channel", "appbar_search_in_channel_hint", "loading_starred_channels", "loading_videos", "loading_channel_items", "label_loading", "label_youtube_user", "label_untitled", "label_live_stream", "label_saved_on", "label_bookmarked", "prompt_type_search_query", "snackbar_no_related_videos", "snackbar_removed_bookmark", "snackbar_bookmark_not_found", "snackbar_channel_bookmarked", "snackbar_channel_already_bookmarked", "snackbar_bookmark_removed", "snackbar_settings_saved", "snackbar_settings_cleared", "snackbar_channel_list_saved", "snackbar_no_starred_channels", "snackbar_all_channels_disabled", "snackbar_no_starred_channels_yet", "snackbar_no_results_in_channel", "snackbar_no_videos_or_streams_found", "snackbar_no_videos_found", "snackbar_no_live_streams_found", "snackbar_videos_and_streams_disabled", "snackbar_no_more_channel_items", "snackbar_no_more_results", "snackbar_no_more_related_videos", "snackbar_no_more_comments", "dialog_settings_message", "dialog_channel_list_message", "field_api_key", "field_language", "field_initial_channel_items", "fallback_channel_number", "error_could_not_open_channel", "error_could_not_find_channel", "error_could_not_find_video_id", "error_invalid_language_selection", "error_invalid_channel_items", "error_could_not_save_api_key", "error_could_not_clear_api_key", "error_could_not_save_channel_list_limit", "error_could_not_save_language", "error_could_not_clear_settings", "error_could_not_open_settings", "error_could_not_save_channel_list", "error_could_not_open_channel_list", "error_channel_load_failed", "error_could_not_load_full_channel_list", "error_could_not_load_more_channel_items", "error_search_failed", "error_could_not_load_more_videos", "error_could_not_load_related_videos", "error_failed_to_load_video", "error_could_not_load_more_comments" ], UI_STRINGS = {
  en: [ "Trending", "Music", "Gaming", "News", "Coding", "Open YouTube", "Open in Browser", "Open Related", "Open Channel", "Settings", "Channel List", "Bookmark Channel", "Remove Bookmark", "Open Channel in Browser", "Show Videos", "Show Live Streams", "Open Video", "Save", "Clear", "Cancel", "Starred Channels", "YouTube", "Related Videos", "Channel", "Browser", "YouTube - {query}", "Search YouTube", "Search videos", "Search {channel}", "Search in this channel", "Loading starred channels...", "Loading videos...", "Loading channel videos and live streams...", "Loading...", "YouTube User", "Untitled", "Live stream", "Saved {date}", "Bookmarked", "Type a search query.", "No related videos available.", "Removed bookmark.", "Bookmark not found.", "Channel bookmarked.", "Channel already bookmarked.", "Bookmark removed.", "Settings saved. Pull to refresh.", "Settings cleared. Pull to refresh.", "Channel list saved.", "No starred channels.", "All channels are disabled. Open Channel List.", "No starred channels yet.", "No results in this channel for \"{query}\".", "No videos or live streams found.", "No videos found.", "No live streams found.", "Videos and live streams are disabled.", "No more channel items.", "No more results.", "No more related videos.", "No more comments.", "Update YouTube API key, language, and initial channel list limit.", "Enable or disable starred channels.", "API Key", "Language", "Initial Channel Items", "Channel {index}", "Could not open channel.", "Could not find channel.", "Could not find video id.", "Invalid language selection.", "Initial channel items must be 1 or higher.", "Could not save API key.", "Could not clear API key.", "Could not save channel list limit.", "Could not save language.", "Could not clear settings.", "Could not open settings.", "Could not save channel list.", "Could not open channel list.", "Channel load failed: {error}", "Could not load full channel list: {error}", "Could not load more channel items: {error}", "Search failed: {error}", "Could not load more videos: {error}", "Could not load related videos: {error}", "Failed to load video: {error}", "Could not load more comments: {error}" ],
  ko: [ "인기", "음악", "게임", "뉴스", "코딩", "YouTube 열기", "브라우저에서 열기", "관련 영상 열기", "채널 열기", "설정", "채널 목록", "채널 북마크", "북마크 제거", "브라우저에서 채널 열기", "동영상 보기", "라이브 보기", "영상 열기", "저장", "초기화", "취소", "북마크한 채널", "YouTube", "관련 영상", "채널", "브라우저", "YouTube - {query}", "YouTube 검색", "영상 검색", "{channel} 검색", "이 채널에서 검색", "북마크한 채널을 불러오는 중...", "영상을 불러오는 중...", "채널 영상과 라이브를 불러오는 중...", "불러오는 중...", "YouTube 사용자", "제목 없음", "라이브", "저장일 {date}", "북마크", "검색어를 입력하세요.", "관련 영상이 없습니다.", "북마크를 제거했습니다.", "북마크를 찾을 수 없습니다.", "채널을 북마크했습니다.", "이미 북마크한 채널입니다.", "북마크를 제거했습니다.", "설정을 저장했습니다. 새로고침하세요.", "설정을 초기화했습니다. 새로고침하세요.", "채널 목록을 저장했습니다.", "북마크한 채널이 없습니다.", "모든 채널이 비활성화되어 있습니다. 채널 목록을 여세요.", "아직 북마크한 채널이 없습니다.", "\"{query}\"에 대한 채널 내 결과가 없습니다.", "동영상이나 라이브를 찾을 수 없습니다.", "동영상을 찾을 수 없습니다.", "라이브를 찾을 수 없습니다.", "동영상과 라이브가 모두 비활성화되어 있습니다.", "채널 항목이 더 없습니다.", "더 이상 결과가 없습니다.", "더 이상 관련 영상이 없습니다.", "더 이상 댓글이 없습니다.", "YouTube API 키, 언어, 초기 채널 항목 수를 설정합니다.", "북마크한 채널의 사용 여부를 설정합니다.", "API 키", "언어", "초기 채널 항목 수", "채널 {index}", "채널을 열 수 없습니다.", "채널을 찾을 수 없습니다.", "영상 ID를 찾을 수 없습니다.", "언어 선택이 올바르지 않습니다.", "초기 채널 항목 수는 1 이상이어야 합니다.", "API 키를 저장할 수 없습니다.", "API 키를 지울 수 없습니다.", "채널 목록 개수를 저장할 수 없습니다.", "언어를 저장할 수 없습니다.", "설정을 초기화할 수 없습니다.", "설정을 열 수 없습니다.", "채널 목록을 저장할 수 없습니다.", "채널 목록을 열 수 없습니다.", "채널 로드 실패: {error}", "전체 채널 목록을 불러올 수 없습니다: {error}", "채널 항목을 더 불러올 수 없습니다: {error}", "검색 실패: {error}", "영상을 더 불러올 수 없습니다: {error}", "관련 영상을 불러올 수 없습니다: {error}", "영상을 불러오지 못했습니다: {error}", "댓글을 더 불러올 수 없습니다: {error}" ],
  es: [ "Tendencias", "Música", "Juegos", "Noticias", "Programación", "Abrir YouTube", "Abrir en el navegador", "Abrir relacionados", "Abrir canal", "Ajustes", "Lista de canales", "Guardar canal", "Quitar marcador", "Abrir canal en el navegador", "Mostrar videos", "Mostrar directos", "Abrir video", "Guardar", "Borrar", "Cancelar", "Canales guardados", "YouTube", "Videos relacionados", "Canal", "Navegador", "YouTube - {query}", "Buscar en YouTube", "Buscar videos", "Buscar en {channel}", "Buscar en este canal", "Cargando canales guardados...", "Cargando videos...", "Cargando videos y directos del canal...", "Cargando...", "Usuario de YouTube", "Sin título", "Directo", "Guardado {date}", "Guardado", "Escribe una búsqueda.", "No hay videos relacionados.", "Marcador eliminado.", "No se encontró el marcador.", "Canal guardado.", "El canal ya estaba guardado.", "Marcador eliminado.", "Ajustes guardados. Desliza para refrescar.", "Ajustes borrados. Desliza para refrescar.", "Lista de canales guardada.", "No hay canales guardados.", "Todos los canales están desactivados. Abre la Lista de canales.", "Todavía no hay canales guardados.", "No hay resultados en este canal para \"{query}\".", "No se encontraron videos ni directos.", "No se encontraron videos.", "No se encontraron directos.", "Los videos y directos están desactivados.", "No hay más elementos del canal.", "No hay más resultados.", "No hay más videos relacionados.", "No hay más comentarios.", "Actualiza la clave de la API de YouTube, el idioma y el límite inicial de elementos del canal.", "Activa o desactiva los canales guardados.", "Clave API", "Idioma", "Elementos iniciales del canal", "Canal {index}", "No se pudo abrir el canal.", "No se pudo encontrar el canal.", "No se pudo encontrar el id del video.", "Selección de idioma no válida.", "Los elementos iniciales del canal deben ser 1 o más.", "No se pudo guardar la clave API.", "No se pudo borrar la clave API.", "No se pudo guardar el límite de la lista de canales.", "No se pudo guardar el idioma.", "No se pudieron borrar los ajustes.", "No se pudieron abrir los ajustes.", "No se pudo guardar la lista de canales.", "No se pudo abrir la lista de canales.", "Error al cargar el canal: {error}", "No se pudo cargar la lista completa del canal: {error}", "No se pudieron cargar más elementos del canal: {error}", "Búsqueda fallida: {error}", "No se pudieron cargar más videos: {error}", "No se pudieron cargar los videos relacionados: {error}", "No se pudo cargar el video: {error}", "No se pudieron cargar más comentarios: {error}" ],
  pt: [ "Em alta", "Música", "Jogos", "Notícias", "Programação", "Abrir YouTube", "Abrir no navegador", "Abrir relacionados", "Abrir canal", "Configurações", "Lista de canais", "Salvar canal", "Remover favorito", "Abrir canal no navegador", "Mostrar vídeos", "Mostrar transmissões", "Abrir vídeo", "Salvar", "Limpar", "Cancelar", "Canais salvos", "YouTube", "Vídeos relacionados", "Canal", "Navegador", "YouTube - {query}", "Pesquisar no YouTube", "Pesquisar vídeos", "Pesquisar em {channel}", "Pesquisar neste canal", "Carregando canais salvos...", "Carregando vídeos...", "Carregando vídeos e transmissões do canal...", "Carregando...", "Usuário do YouTube", "Sem título", "Transmissão ao vivo", "Salvo em {date}", "Salvo", "Digite uma busca.", "Nenhum vídeo relacionado disponível.", "Favorito removido.", "Favorito não encontrado.", "Canal salvo.", "O canal já estava salvo.", "Favorito removido.", "Configurações salvas. Puxe para atualizar.", "Configurações limpas. Puxe para atualizar.", "Lista de canais salva.", "Nenhum canal salvo.", "Todos os canais estão desativados. Abra a Lista de canais.", "Ainda não há canais salvos.", "Nenhum resultado neste canal para \"{query}\".", "Nenhum vídeo ou transmissão encontrado.", "Nenhum vídeo encontrado.", "Nenhuma transmissão encontrada.", "Vídeos e transmissões estão desativados.", "Não há mais itens do canal.", "Não há mais resultados.", "Não há mais vídeos relacionados.", "Não há mais comentários.", "Atualize a chave da API do YouTube, o idioma e o limite inicial de itens do canal.", "Ative ou desative os canais salvos.", "Chave da API", "Idioma", "Itens iniciais do canal", "Canal {index}", "Não foi possível abrir o canal.", "Não foi possível encontrar o canal.", "Não foi possível encontrar o id do vídeo.", "Seleção de idioma inválida.", "Os itens iniciais do canal devem ser 1 ou mais.", "Não foi possível salvar a chave da API.", "Não foi possível limpar a chave da API.", "Não foi possível salvar o limite da lista de canais.", "Não foi possível salvar o idioma.", "Não foi possível limpar as configurações.", "Não foi possível abrir as configurações.", "Não foi possível salvar a lista de canais.", "Não foi possível abrir a lista de canais.", "Falha ao carregar o canal: {error}", "Não foi possível carregar a lista completa do canal: {error}", "Não foi possível carregar mais itens do canal: {error}", "Falha na busca: {error}", "Não foi possível carregar mais vídeos: {error}", "Não foi possível carregar vídeos relacionados: {error}", "Não foi possível carregar o vídeo: {error}", "Não foi possível carregar mais comentários: {error}" ],
  ja: [ "急上昇", "音楽", "ゲーム", "ニュース", "コーディング", "YouTubeを開く", "ブラウザで開く", "関連動画を開く", "チャンネルを開く", "設定", "チャンネル一覧", "チャンネルを保存", "ブックマークを削除", "ブラウザでチャンネルを開く", "動画を表示", "ライブ配信を表示", "動画を開く", "保存", "クリア", "キャンセル", "保存したチャンネル", "YouTube", "関連動画", "チャンネル", "ブラウザ", "YouTube - {query}", "YouTubeを検索", "動画を検索", "{channel} を検索", "このチャンネル内を検索", "保存したチャンネルを読み込み中...", "動画を読み込み中...", "チャンネルの動画とライブ配信を読み込み中...", "読み込み中...", "YouTubeユーザー", "無題", "ライブ配信", "{date} に保存", "保存済み", "検索語を入力してください。", "関連動画はありません。", "ブックマークを削除しました。", "ブックマークが見つかりません。", "チャンネルを保存しました。", "このチャンネルは既に保存されています。", "ブックマークを削除しました。", "設定を保存しました。引っ張って更新してください。", "設定をクリアしました。引っ張って更新してください。", "チャンネル一覧を保存しました。", "保存したチャンネルはありません。", "すべてのチャンネルが無効です。チャンネル一覧を開いてください。", "まだ保存したチャンネルはありません。", "このチャンネルで \"{query}\" の結果はありません。", "動画またはライブ配信が見つかりません。", "動画が見つかりません。", "ライブ配信が見つかりません。", "動画とライブ配信は無効です。", "これ以上チャンネル項目はありません。", "これ以上結果はありません。", "これ以上関連動画はありません。", "これ以上コメントはありません。", "YouTube APIキー、言語、初期チャンネル項目数を更新します。", "保存したチャンネルを有効または無効にします。", "APIキー", "言語", "初期チャンネル項目数", "チャンネル {index}", "チャンネルを開けませんでした。", "チャンネルが見つかりませんでした。", "動画IDが見つかりませんでした。", "無効な言語選択です。", "初期チャンネル項目数は1以上である必要があります。", "APIキーを保存できませんでした。", "APIキーをクリアできませんでした。", "チャンネル一覧の上限を保存できませんでした。", "言語を保存できませんでした。", "設定をクリアできませんでした。", "設定を開けませんでした。", "チャンネル一覧を保存できませんでした。", "チャンネル一覧を開けませんでした。", "チャンネルの読み込みに失敗しました: {error}", "チャンネル一覧全体を読み込めませんでした: {error}", "チャンネル項目をさらに読み込めませんでした: {error}", "検索に失敗しました: {error}", "動画をさらに読み込めませんでした: {error}", "関連動画を読み込めませんでした: {error}", "動画を読み込めませんでした: {error}", "コメントをさらに読み込めませんでした: {error}" ],
  "zh-CN": [ "趋势", "音乐", "游戏", "新闻", "编程", "打开 YouTube", "在浏览器中打开", "打开相关视频", "打开频道", "设置", "频道列表", "收藏频道", "移除收藏", "在浏览器中打开频道", "显示视频", "显示直播", "打开视频", "保存", "清除", "取消", "已收藏频道", "YouTube", "相关视频", "频道", "浏览器", "YouTube - {query}", "搜索 YouTube", "搜索视频", "搜索 {channel}", "在此频道中搜索", "正在加载已收藏频道...", "正在加载视频...", "正在加载频道视频和直播...", "加载中...", "YouTube 用户", "无标题", "直播", "保存于 {date}", "已收藏", "请输入搜索内容。", "没有相关视频。", "已移除收藏。", "未找到收藏。", "已收藏频道。", "该频道已收藏。", "已移除收藏。", "设置已保存。请下拉刷新。", "设置已清除。请下拉刷新。", "频道列表已保存。", "没有已收藏频道。", "所有频道均已禁用。请打开频道列表。", "尚未收藏任何频道。", "此频道中没有 \"{query}\" 的结果。", "未找到视频或直播。", "未找到视频。", "未找到直播。", "视频和直播均已禁用。", "没有更多频道内容。", "没有更多结果。", "没有更多相关视频。", "没有更多评论。", "更新 YouTube API 密钥、语言和频道初始项目数。", "启用或禁用已收藏频道。", "API 密钥", "语言", "频道初始项目数", "频道 {index}", "无法打开频道。", "找不到频道。", "找不到视频 ID。", "语言选择无效。", "频道初始项目数必须大于等于 1。", "无法保存 API 密钥。", "无法清除 API 密钥。", "无法保存频道列表限制。", "无法保存语言。", "无法清除设置。", "无法打开设置。", "无法保存频道列表。", "无法打开频道列表。", "频道加载失败: {error}", "无法加载完整频道列表: {error}", "无法加载更多频道内容: {error}", "搜索失败: {error}", "无法加载更多视频: {error}", "无法加载相关视频: {error}", "无法加载视频: {error}", "无法加载更多评论: {error}" ],
  de: [ "Trends", "Musik", "Gaming", "Nachrichten", "Programmierung", "YouTube öffnen", "Im Browser öffnen", "Ähnliche öffnen", "Kanal öffnen", "Einstellungen", "Kanalliste", "Kanal speichern", "Lesezeichen entfernen", "Kanal im Browser öffnen", "Videos anzeigen", "Livestreams anzeigen", "Video öffnen", "Speichern", "Zurücksetzen", "Abbrechen", "Gespeicherte Kanäle", "YouTube", "Ähnliche Videos", "Kanal", "Browser", "YouTube - {query}", "YouTube durchsuchen", "Videos suchen", "{channel} durchsuchen", "In diesem Kanal suchen", "Gespeicherte Kanäle werden geladen...", "Videos werden geladen...", "Kanalvideos und Livestreams werden geladen...", "Wird geladen...", "YouTube-Nutzer", "Ohne Titel", "Livestream", "Gespeichert am {date}", "Gespeichert", "Suchbegriff eingeben.", "Keine ähnlichen Videos verfügbar.", "Lesezeichen entfernt.", "Lesezeichen nicht gefunden.", "Kanal gespeichert.", "Kanal war bereits gespeichert.", "Lesezeichen entfernt.", "Einstellungen gespeichert. Zum Aktualisieren herunterziehen.", "Einstellungen zurückgesetzt. Zum Aktualisieren herunterziehen.", "Kanalliste gespeichert.", "Keine gespeicherten Kanäle.", "Alle Kanäle sind deaktiviert. Öffne die Kanalliste.", "Noch keine gespeicherten Kanäle.", "Keine Ergebnisse in diesem Kanal für \"{query}\".", "Keine Videos oder Livestreams gefunden.", "Keine Videos gefunden.", "Keine Livestreams gefunden.", "Videos und Livestreams sind deaktiviert.", "Keine weiteren Kanalinhalte.", "Keine weiteren Ergebnisse.", "Keine weiteren ähnlichen Videos.", "Keine weiteren Kommentare.", "YouTube-API-Schlüssel, Sprache und anfängliches Kanallimit aktualisieren.", "Gespeicherte Kanäle aktivieren oder deaktivieren.", "API-Schlüssel", "Sprache", "Anfängliche Kanalinhalte", "Kanal {index}", "Kanal konnte nicht geöffnet werden.", "Kanal konnte nicht gefunden werden.", "Video-ID konnte nicht gefunden werden.", "Ungültige Sprachauswahl.", "Anfängliche Kanalinhalte müssen 1 oder höher sein.", "API-Schlüssel konnte nicht gespeichert werden.", "API-Schlüssel konnte nicht gelöscht werden.", "Kanallistenlimit konnte nicht gespeichert werden.", "Sprache konnte nicht gespeichert werden.", "Einstellungen konnten nicht gelöscht werden.", "Einstellungen konnten nicht geöffnet werden.", "Kanalliste konnte nicht gespeichert werden.", "Kanalliste konnte nicht geöffnet werden.", "Kanal konnte nicht geladen werden: {error}", "Vollständige Kanalliste konnte nicht geladen werden: {error}", "Weitere Kanalinhalte konnten nicht geladen werden: {error}", "Suche fehlgeschlagen: {error}", "Weitere Videos konnten nicht geladen werden: {error}", "Ähnliche Videos konnten nicht geladen werden: {error}", "Video konnte nicht geladen werden: {error}", "Weitere Kommentare konnten nicht geladen werden: {error}" ],
  hi: [ "ट्रेंडिंग", "संगीत", "गेमिंग", "समाचार", "कोडिंग", "YouTube खोलें", "ब्राउज़र में खोलें", "संबंधित खोलें", "चैनल खोलें", "सेटिंग्स", "चैनल सूची", "चैनल सहेजें", "बुकमार्क हटाएं", "ब्राउज़र में चैनल खोलें", "वीडियो दिखाएं", "लाइव स्ट्रीम दिखाएं", "वीडियो खोलें", "सहेजें", "साफ करें", "रद्द करें", "सहेजे गए चैनल", "YouTube", "संबंधित वीडियो", "चैनल", "ब्राउज़र", "YouTube - {query}", "YouTube खोजें", "वीडियो खोजें", "{channel} में खोजें", "इस चैनल में खोजें", "सहेजे गए चैनल लोड हो रहे हैं...", "वीडियो लोड हो रहे हैं...", "चैनल के वीडियो और लाइव स्ट्रीम लोड हो रहे हैं...", "लोड हो रहा है...", "YouTube उपयोगकर्ता", "बिना शीर्षक", "लाइव स्ट्रीम", "{date} को सहेजा गया", "सहेजा गया", "खोज लिखें।", "कोई संबंधित वीडियो उपलब्ध नहीं है।", "बुकमार्क हटा दिया गया।", "बुकमार्क नहीं मिला।", "चैनल सहेज लिया गया।", "चैनल पहले से सहेजा गया है।", "बुकमार्क हटा दिया गया।", "सेटिंग्स सहेज ली गईं। रीफ्रेश करने के लिए नीचे खींचें।", "सेटिंग्स साफ कर दी गईं। रीफ्रेश करने के लिए नीचे खींचें।", "चैनल सूची सहेज ली गई।", "कोई सहेजा गया चैनल नहीं है।", "सभी चैनल अक्षम हैं। चैनल सूची खोलें।", "अभी तक कोई चैनल सहेजा नहीं गया है।", "इस चैनल में \"{query}\" के लिए कोई परिणाम नहीं है।", "कोई वीडियो या लाइव स्ट्रीम नहीं मिली।", "कोई वीडियो नहीं मिला।", "कोई लाइव स्ट्रीम नहीं मिली।", "वीडियो और लाइव स्ट्रीम अक्षम हैं।", "और चैनल आइटम नहीं हैं।", "और परिणाम नहीं हैं।", "और संबंधित वीडियो नहीं हैं।", "और टिप्पणियां नहीं हैं।", "YouTube API कुंजी, भाषा और प्रारंभिक चैनल आइटम सीमा अपडेट करें।", "सहेजे गए चैनलों को सक्षम या अक्षम करें।", "API कुंजी", "भाषा", "प्रारंभिक चैनल आइटम", "चैनल {index}", "चैनल नहीं खोला जा सका।", "चैनल नहीं मिला।", "वीडियो आईडी नहीं मिली।", "अमान्य भाषा चयन।", "प्रारंभिक चैनल आइटम 1 या अधिक होने चाहिए।", "API कुंजी सहेजी नहीं जा सकी।", "API कुंजी साफ नहीं की जा सकी।", "चैनल सूची सीमा सहेजी नहीं जा सकी।", "भाषा सहेजी नहीं जा सकी।", "सेटिंग्स साफ नहीं की जा सकीं।", "सेटिंग्स नहीं खुल सकीं।", "चैनल सूची सहेजी नहीं जा सकी।", "चैनल सूची नहीं खुल सकी।", "चैनल लोड नहीं हो सका: {error}", "पूरी चैनल सूची लोड नहीं की जा सकी: {error}", "और चैनल आइटम लोड नहीं किए जा सके: {error}", "खोज विफल रही: {error}", "और वीडियो लोड नहीं किए जा सके: {error}", "संबंधित वीडियो लोड नहीं किए जा सके: {error}", "वीडियो लोड नहीं किया जा सका: {error}", "और टिप्पणियां लोड नहीं की जा सकीं: {error}" ],
  ar: [ "الرائج", "الموسيقى", "الألعاب", "الأخبار", "البرمجة", "فتح YouTube", "فتح في المتصفح", "فتح المقاطع ذات الصلة", "فتح القناة", "الإعدادات", "قائمة القنوات", "حفظ القناة", "إزالة الإشارة المرجعية", "فتح القناة في المتصفح", "إظهار الفيديوهات", "إظهار البث المباشر", "فتح الفيديو", "حفظ", "مسح", "إلغاء", "القنوات المحفوظة", "YouTube", "الفيديوهات ذات الصلة", "القناة", "المتصفح", "YouTube - {query}", "البحث في YouTube", "البحث عن فيديوهات", "البحث في {channel}", "البحث في هذه القناة", "جارٍ تحميل القنوات المحفوظة...", "جارٍ تحميل الفيديوهات...", "جارٍ تحميل فيديوهات القناة والبث المباشر...", "جارٍ التحميل...", "مستخدم YouTube", "بدون عنوان", "بث مباشر", "تم الحفظ في {date}", "محفوظ", "اكتب عبارة البحث.", "لا توجد فيديوهات ذات صلة.", "تمت إزالة الإشارة المرجعية.", "لم يتم العثور على الإشارة المرجعية.", "تم حفظ القناة.", "القناة محفوظة بالفعل.", "تمت إزالة الإشارة المرجعية.", "تم حفظ الإعدادات. اسحب للتحديث.", "تم مسح الإعدادات. اسحب للتحديث.", "تم حفظ قائمة القنوات.", "لا توجد قنوات محفوظة.", "جميع القنوات معطلة. افتح قائمة القنوات.", "لا توجد قنوات محفوظة بعد.", "لا توجد نتائج في هذه القناة لـ \"{query}\".", "لم يتم العثور على فيديوهات أو بث مباشر.", "لم يتم العثور على فيديوهات.", "لم يتم العثور على بث مباشر.", "الفيديوهات والبث المباشر معطلة.", "لا توجد عناصر قناة أخرى.", "لا توجد نتائج أخرى.", "لا توجد فيديوهات ذات صلة أخرى.", "لا توجد تعليقات أخرى.", "حدّث مفتاح API لـ YouTube واللغة وحد العناصر الأولية للقناة.", "فعّل أو عطّل القنوات المحفوظة.", "مفتاح API", "اللغة", "عناصر القناة الأولية", "القناة {index}", "تعذر فتح القناة.", "تعذر العثور على القناة.", "تعذر العثور على معرّف الفيديو.", "اختيار لغة غير صالح.", "يجب أن تكون عناصر القناة الأولية 1 أو أكثر.", "تعذر حفظ مفتاح API.", "تعذر مسح مفتاح API.", "تعذر حفظ حد قائمة القنوات.", "تعذر حفظ اللغة.", "تعذر مسح الإعدادات.", "تعذر فتح الإعدادات.", "تعذر حفظ قائمة القنوات.", "تعذر فتح قائمة القنوات.", "فشل تحميل القناة: {error}", "تعذر تحميل قائمة القنوات الكاملة: {error}", "تعذر تحميل المزيد من عناصر القناة: {error}", "فشل البحث: {error}", "تعذر تحميل المزيد من الفيديوهات: {error}", "تعذر تحميل الفيديوهات ذات الصلة: {error}", "تعذر تحميل الفيديو: {error}", "تعذر تحميل المزيد من التعليقات: {error}" ],
  id: [ "Trending", "Musik", "Game", "Berita", "Pemrograman", "Buka YouTube", "Buka di Browser", "Buka Terkait", "Buka Channel", "Setelan", "Daftar Channel", "Simpan Channel", "Hapus Bookmark", "Buka Channel di Browser", "Tampilkan Video", "Tampilkan Siaran Langsung", "Buka Video", "Simpan", "Bersihkan", "Batal", "Channel Tersimpan", "YouTube", "Video Terkait", "Channel", "Browser", "YouTube - {query}", "Cari di YouTube", "Cari video", "Cari di {channel}", "Cari di channel ini", "Memuat channel tersimpan...", "Memuat video...", "Memuat video dan siaran langsung channel...", "Memuat...", "Pengguna YouTube", "Tanpa Judul", "Siaran langsung", "Disimpan pada {date}", "Tersimpan", "Ketik kata kunci.", "Tidak ada video terkait.", "Bookmark dihapus.", "Bookmark tidak ditemukan.", "Channel disimpan.", "Channel sudah disimpan.", "Bookmark dihapus.", "Setelan disimpan. Tarik untuk memuat ulang.", "Setelan dibersihkan. Tarik untuk memuat ulang.", "Daftar channel disimpan.", "Tidak ada channel tersimpan.", "Semua channel dinonaktifkan. Buka Daftar Channel.", "Belum ada channel tersimpan.", "Tidak ada hasil di channel ini untuk \"{query}\".", "Tidak ditemukan video atau siaran langsung.", "Tidak ditemukan video.", "Tidak ditemukan siaran langsung.", "Video dan siaran langsung dinonaktifkan.", "Tidak ada item channel lagi.", "Tidak ada hasil lagi.", "Tidak ada video terkait lagi.", "Tidak ada komentar lagi.", "Perbarui kunci API YouTube, bahasa, dan batas item awal channel.", "Aktifkan atau nonaktifkan channel tersimpan.", "Kunci API", "Bahasa", "Item Awal Channel", "Channel {index}", "Tidak dapat membuka channel.", "Tidak dapat menemukan channel.", "Tidak dapat menemukan id video.", "Pilihan bahasa tidak valid.", "Item awal channel harus 1 atau lebih.", "Tidak dapat menyimpan kunci API.", "Tidak dapat menghapus kunci API.", "Tidak dapat menyimpan batas daftar channel.", "Tidak dapat menyimpan bahasa.", "Tidak dapat membersihkan setelan.", "Tidak dapat membuka setelan.", "Tidak dapat menyimpan daftar channel.", "Tidak dapat membuka daftar channel.", "Gagal memuat channel: {error}", "Tidak dapat memuat daftar channel lengkap: {error}", "Tidak dapat memuat item channel tambahan: {error}", "Pencarian gagal: {error}", "Tidak dapat memuat lebih banyak video: {error}", "Tidak dapat memuat video terkait: {error}", "Gagal memuat video: {error}", "Tidak dapat memuat lebih banyak komentar: {error}" ],
  fr: [ "Tendances", "Musique", "Jeux", "Actualités", "Programmation", "Ouvrir YouTube", "Ouvrir dans le navigateur", "Ouvrir les vidéos liées", "Ouvrir la chaîne", "Paramètres", "Liste des chaînes", "Enregistrer la chaîne", "Supprimer le favori", "Ouvrir la chaîne dans le navigateur", "Afficher les vidéos", "Afficher les directs", "Ouvrir la vidéo", "Enregistrer", "Effacer", "Annuler", "Chaînes enregistrées", "YouTube", "Vidéos liées", "Chaîne", "Navigateur", "YouTube - {query}", "Rechercher sur YouTube", "Rechercher des vidéos", "Rechercher dans {channel}", "Rechercher dans cette chaîne", "Chargement des chaînes enregistrées...", "Chargement des vidéos...", "Chargement des vidéos et directs de la chaîne...", "Chargement...", "Utilisateur YouTube", "Sans titre", "Direct", "Enregistré le {date}", "Enregistré", "Saisissez une recherche.", "Aucune vidéo liée.", "Favori supprimé.", "Favori introuvable.", "Chaîne enregistrée.", "Cette chaîne est déjà enregistrée.", "Favori supprimé.", "Paramètres enregistrés. Tirez pour actualiser.", "Paramètres effacés. Tirez pour actualiser.", "Liste des chaînes enregistrée.", "Aucune chaîne enregistrée.", "Toutes les chaînes sont désactivées. Ouvrez la liste des chaînes.", "Aucune chaîne enregistrée pour le moment.", "Aucun résultat dans cette chaîne pour \"{query}\".", "Aucune vidéo ou direct trouvé.", "Aucune vidéo trouvée.", "Aucun direct trouvé.", "Les vidéos et les directs sont désactivés.", "Aucun autre élément de la chaîne.", "Aucun autre résultat.", "Aucune autre vidéo liée.", "Aucun autre commentaire.", "Mettez à jour la clé API YouTube, la langue et la limite initiale d'éléments de chaîne.", "Activez ou désactivez les chaînes enregistrées.", "Clé API", "Langue", "Éléments initiaux de la chaîne", "Chaîne {index}", "Impossible d'ouvrir la chaîne.", "Impossible de trouver la chaîne.", "Impossible de trouver l'identifiant de la vidéo.", "Sélection de langue invalide.", "Les éléments initiaux de la chaîne doivent être supérieurs ou égaux à 1.", "Impossible d'enregistrer la clé API.", "Impossible d'effacer la clé API.", "Impossible d'enregistrer la limite de la liste des chaînes.", "Impossible d'enregistrer la langue.", "Impossible d'effacer les paramètres.", "Impossible d'ouvrir les paramètres.", "Impossible d'enregistrer la liste des chaînes.", "Impossible d'ouvrir la liste des chaînes.", "Échec du chargement de la chaîne : {error}", "Impossible de charger la liste complète des chaînes : {error}", "Impossible de charger plus d'éléments de la chaîne : {error}", "Échec de la recherche : {error}", "Impossible de charger plus de vidéos : {error}", "Impossible de charger les vidéos liées : {error}", "Échec du chargement de la vidéo : {error}", "Impossible de charger plus de commentaires : {error}" ],
  ru: [ "В тренде", "Музыка", "Игры", "Новости", "Программирование", "Открыть YouTube", "Открыть в браузере", "Открыть похожие", "Открыть канал", "Настройки", "Список каналов", "Сохранить канал", "Удалить закладку", "Открыть канал в браузере", "Показывать видео", "Показывать прямые эфиры", "Открыть видео", "Сохранить", "Очистить", "Отмена", "Сохраненные каналы", "YouTube", "Похожие видео", "Канал", "Браузер", "YouTube - {query}", "Поиск в YouTube", "Искать видео", "Искать в {channel}", "Искать в этом канале", "Загрузка сохраненных каналов...", "Загрузка видео...", "Загрузка видео и прямых эфиров канала...", "Загрузка...", "Пользователь YouTube", "Без названия", "Прямой эфир", "Сохранено {date}", "Сохранено", "Введите поисковый запрос.", "Нет похожих видео.", "Закладка удалена.", "Закладка не найдена.", "Канал сохранен.", "Канал уже сохранен.", "Закладка удалена.", "Настройки сохранены. Потяните для обновления.", "Настройки очищены. Потяните для обновления.", "Список каналов сохранен.", "Нет сохраненных каналов.", "Все каналы отключены. Откройте список каналов.", "Пока нет сохраненных каналов.", "В этом канале нет результатов по запросу \"{query}\".", "Видео или прямые эфиры не найдены.", "Видео не найдены.", "Прямые эфиры не найдены.", "Видео и прямые эфиры отключены.", "Больше нет элементов канала.", "Больше нет результатов.", "Больше нет похожих видео.", "Больше нет комментариев.", "Обновите ключ API YouTube, язык и начальный лимит элементов канала.", "Включайте или отключайте сохраненные каналы.", "Ключ API", "Язык", "Начальные элементы канала", "Канал {index}", "Не удалось открыть канал.", "Не удалось найти канал.", "Не удалось найти идентификатор видео.", "Недопустимый выбор языка.", "Начальные элементы канала должны быть не меньше 1.", "Не удалось сохранить ключ API.", "Не удалось очистить ключ API.", "Не удалось сохранить лимит списка каналов.", "Не удалось сохранить язык.", "Не удалось очистить настройки.", "Не удалось открыть настройки.", "Не удалось сохранить список каналов.", "Не удалось открыть список каналов.", "Не удалось загрузить канал: {error}", "Не удалось загрузить полный список каналов: {error}", "Не удалось загрузить дополнительные элементы канала: {error}", "Ошибка поиска: {error}", "Не удалось загрузить больше видео: {error}", "Не удалось загрузить похожие видео: {error}", "Не удалось загрузить видео: {error}", "Не удалось загрузить больше комментариев: {error}" ],
  th: [ "มาแรง", "เพลง", "เกม", "ข่าว", "การเขียนโค้ด", "เปิด YouTube", "เปิดในเบราว์เซอร์", "เปิดรายการที่เกี่ยวข้อง", "เปิดช่อง", "การตั้งค่า", "รายการช่อง", "บันทึกช่อง", "ลบบุ๊กมาร์ก", "เปิดช่องในเบราว์เซอร์", "แสดงวิดีโอ", "แสดงไลฟ์สด", "เปิดวิดีโอ", "บันทึก", "ล้าง", "ยกเลิก", "ช่องที่บันทึกไว้", "YouTube", "วิดีโอที่เกี่ยวข้อง", "ช่อง", "เบราว์เซอร์", "YouTube - {query}", "ค้นหาใน YouTube", "ค้นหาวิดีโอ", "ค้นหาใน {channel}", "ค้นหาในช่องนี้", "กำลังโหลดช่องที่บันทึกไว้...", "กำลังโหลดวิดีโอ...", "กำลังโหลดวิดีโอและไลฟ์สดของช่อง...", "กำลังโหลด...", "ผู้ใช้ YouTube", "ไม่มีชื่อ", "ไลฟ์สด", "บันทึกเมื่อ {date}", "บันทึกแล้ว", "พิมพ์คำค้นหา", "ไม่มีวิดีโอที่เกี่ยวข้อง", "ลบบุ๊กมาร์กแล้ว", "ไม่พบบุ๊กมาร์ก", "บันทึกช่องแล้ว", "ช่องนี้ถูกบันทึกไว้แล้ว", "ลบบุ๊กมาร์กแล้ว", "บันทึกการตั้งค่าแล้ว ดึงเพื่อรีเฟรช", "ล้างการตั้งค่าแล้ว ดึงเพื่อรีเฟรช", "บันทึกรายการช่องแล้ว", "ไม่มีช่องที่บันทึกไว้", "ปิดใช้งานทุกช่องอยู่ เปิดรายการช่อง", "ยังไม่มีช่องที่บันทึกไว้", "ไม่พบผลลัพธ์ในช่องนี้สำหรับ \"{query}\"", "ไม่พบวิดีโอหรือไลฟ์สด", "ไม่พบวิดีโอ", "ไม่พบไลฟ์สด", "วิดีโอและไลฟ์สดถูกปิดใช้งาน", "ไม่มีรายการช่องเพิ่มเติม", "ไม่มีผลลัพธ์เพิ่มเติม", "ไม่มีวิดีโอที่เกี่ยวข้องเพิ่มเติม", "ไม่มีความคิดเห็นเพิ่มเติม", "อัปเดตคีย์ API ของ YouTube ภาษา และจำนวนรายการช่องเริ่มต้น", "เปิดหรือปิดใช้งานช่องที่บันทึกไว้", "คีย์ API", "ภาษา", "รายการช่องเริ่มต้น", "ช่อง {index}", "ไม่สามารถเปิดช่องได้", "ไม่พบช่อง", "ไม่พบรหัสวิดีโอ", "การเลือกภาษาไม่ถูกต้อง", "รายการช่องเริ่มต้นต้องมีค่าอย่างน้อย 1", "ไม่สามารถบันทึกคีย์ API ได้", "ไม่สามารถล้างคีย์ API ได้", "ไม่สามารถบันทึกขีดจำกัดรายการช่องได้", "ไม่สามารถบันทึกภาษาได้", "ไม่สามารถล้างการตั้งค่าได้", "ไม่สามารถเปิดการตั้งค่าได้", "ไม่สามารถบันทึกรายการช่องได้", "ไม่สามารถเปิดรายการช่องได้", "โหลดช่องไม่สำเร็จ: {error}", "ไม่สามารถโหลดรายการช่องทั้งหมดได้: {error}", "ไม่สามารถโหลดรายการช่องเพิ่มเติมได้: {error}", "การค้นหาล้มเหลว: {error}", "ไม่สามารถโหลดวิดีโอเพิ่มเติมได้: {error}", "ไม่สามารถโหลดวิดีโอที่เกี่ยวข้องได้: {error}", "โหลดวิดีโอไม่สำเร็จ: {error}", "ไม่สามารถโหลดความคิดเห็นเพิ่มเติมได้: {error}" ],
}, UI_STRING_INDEX = function(keys) {
  for (var map = {}, i = 0; i < keys.length; i++) map[keys[i]] = i;
  return map;
}(UI_STRING_KEYS), listViewState = {}, postViewState = {}, handler = {
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
          return homeQuery ? void openSearchView(homeQuery) : void showSnackbar(viewId, t("prompt_type_search_query"));
        }
        if ("channel" === state.mode) return state.channelQuery = cleanQuery(event.data && event.data.query), 
        void loadChannelFirstPage(viewId, !1);
        if ("search" !== state.mode) return;
        var query = cleanQuery(event.data && event.data.query) || DEFAULT_QUERY;
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
          } else if (matchesUIString(itemMenu, ITEM_MENU_OPEN_VIDEO)) {
            var targetVideoId = parseVideoId(itemLink);
            targetVideoId && openVideoView(targetVideoId, getString(event.data && event.data.title) || t("title_youtube"), buildVideoOpenData(state, event.data));
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
        return matchesUIString(menuName, MENU_SETTINGS) ? void openSettingsDialog(viewId, state) : matchesUIString(menuName, POST_MENU_OPEN) ? void openBrowser(localizedURL(watchURL(state.videoId)), t("title_youtube")) : matchesUIString(menuName, POST_MENU_RELATED) ? void openRelatedFromPost(viewId) : matchesUIString(menuName, POST_MENU_CHANNEL) ? void openChannelFromPostState(viewId) : void 0;
      }
      "AUTHOR_CLICK" === event.eventId && openChannelFromPostState(viewId);
    } else {
      var menu = getString(event.data && event.data.menu), link = getString(event.data && event.data.link);
      if (matchesUIString(menu, ITEM_MENU_OPEN_VIDEO)) {
        var targetVideoId = parseVideoId(link);
        targetVideoId && openVideoView(targetVideoId, getString(event.data && event.data.title) || t("title_youtube"), event.data);
      } else matchesUIString(menu, ITEM_MENU_OPEN_BROWSER) && link && openBrowser(localizedURL(link), t("title_youtube"));
    } else {
      var button = getString(event.data && event.data.button);
      matchesUIString(button, POST_MENU_OPEN) ? openBrowser(localizedURL(watchURL(state.videoId)), t("title_youtube")) : matchesUIString(button, POST_MENU_RELATED) && openRelatedFromPost(viewId);
    } else loadMoreComments(viewId); else loadWatchPost(viewId);
  }
}, openHomeView = function() {
  var hasStarredChannels = loadStarredChannels().length > 0, result = synura.open({
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
      enableVideos: !0,
      enableStreams: !0,
      continuationSource: "",
      pendingItems: existing.pendingItems || [],
      channelTabFallbackPending: !!existing.channelTabFallbackPending,
      homeFeedMode: existing.homeFeedMode || "",
      homeQuery: existing.homeQuery || ""
    };
  }
}, openSearchView = function(query) {
  var menuLabels = QUICK_QUERIES.map(function(item) {
    return getQuickQueryLabel(item);
  });
  menuLabels.push(t(SEARCH_MENU_OPEN)), menuLabels.push(t(MENU_SETTINGS));
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
      menus: menuLabels,
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
      enableVideos: !0,
      enableStreams: !0,
      continuationSource: "",
      pendingItems: [],
      channelTabFallbackPending: !1
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
    menus: [ t(POST_MENU_OPEN), t(MENU_SETTINGS) ],
    buttons: [ t(POST_MENU_OPEN) ]
  };
  return seed.memo && (models.memo = seed.memo), seed.avatar && (models.avatar = seed.avatar), 
  seed.date && (models.date = seed.date), seed.viewCount && (models.viewCount = seed.viewCount), 
  seed.likeCount && (models.likeCount = seed.likeCount), seed.dislikeCount && (models.dislikeCount = seed.dislikeCount), 
  (seed.channelUrl || seed.channelId) && (models.menus = [ t(POST_MENU_OPEN), t(POST_MENU_CHANNEL), t(MENU_SETTINGS) ]),
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
      contents: items || [],
      menus: [ t(POST_MENU_OPEN), t(MENU_SETTINGS) ],
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
      apiCfg: existing.apiCfg || cloneObject(apiCfg || defaultConfig()),
      channelUrl: "",
      channelId: "",
      channelTitle: "",
      channelAvatar: "",
      channelMemo: "",
      starred: !1,
      enableVideos: !0,
      enableStreams: !0,
      continuationSource: "",
      pendingItems: []
    };
  }
}, openRelatedFromPost = function(viewId) {
  var state = postViewState[String(viewId)];
  state && openRelatedList(state.videoId, t("title_related_videos"), state.relatedItems || [], state.relatedContinuation || "", state.apiCfg || defaultConfig());
}, openChannelList = function(channelUrl, channelTitle, channelId, channelAvatar, channelMemo) {
  var normalizedUrl = normalizeChannelUrl(channelUrl);
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
    enableVideos: !0,
    enableStreams: !0
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
        starred: starred
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
    enableVideos: void 0 === existing.enableVideos || normalizeEnabledFlag(existing.enableVideos),
    enableStreams: void 0 === existing.enableStreams || normalizeEnabledFlag(existing.enableStreams),
    continuationSource: existing.continuationSource || "",
    pendingItems: existing.pendingItems || [],
    channelTabFallbackPending: void 0 !== existing.channelTabFallbackPending && !!existing.channelTabFallbackPending
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
}, buildChannelMenus = function(state) {
  var menus = [];
  return state.channelUrl && menus.push(t(CHANNEL_MENU_OPEN_BROWSER)), menus.push({
    label: t(CHANNEL_MENU_ENABLE_VIDEOS),
    checked: normalizeEnabledFlag(state && state.enableVideos)
  }), menus.push({
    label: t(CHANNEL_MENU_ENABLE_STREAMS),
    checked: normalizeEnabledFlag(state && state.enableStreams)
  }), menus.push(t(state.starred ? CHANNEL_MENU_UNBOOKMARK : CHANNEL_MENU_BOOKMARK)),
  menus.push(t(MENU_SETTINGS)), menus;
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
  if (menu) if (!matchesUIString(menu, MENU_SETTINGS)) if ("home" !== state.mode || !matchesUIString(menu, HOME_MENU_CHANNEL_LIST)) {
    if ("channel" === state.mode) return matchesUIString(menu, CHANNEL_MENU_OPEN_BROWSER) && state.channelUrl ? void openBrowser(localizedURL(state.channelUrl), state.channelTitle || t("title_channel")) : isMenuMatch(menu, CHANNEL_MENU_ENABLE_VIDEOS) ? (state.enableVideos = !normalizeEnabledFlag(state.enableVideos),
    void loadChannelFirstPage(viewId, !1)) : isMenuMatch(menu, CHANNEL_MENU_ENABLE_STREAMS) ? (state.enableStreams = !normalizeEnabledFlag(state.enableStreams), 
    void loadChannelFirstPage(viewId, !1)) : matchesUIString(menu, CHANNEL_MENU_BOOKMARK) ? void setChannelBookmark(viewId, state, !0) : matchesUIString(menu, CHANNEL_MENU_UNBOOKMARK) ? void setChannelBookmark(viewId, state, !1) : void 0;
    if (!matchesUIString(menu, SEARCH_MENU_OPEN)) if (!matchesUIString(menu, POST_MENU_OPEN) || "related" !== state.mode) {
      if ("search" === state.mode) for (var i = 0; i < QUICK_QUERIES.length; i++) if (matchesUIString(menu, QUICK_QUERIES[i].labelKey)) return state.query = QUICK_QUERIES[i].query,
      void loadSearchFirstPage(viewId, state.query);
    } else openBrowser(localizedURL(watchURL(state.parentVideoId)), t("title_youtube")); else openBrowser(localizedURL(YT_ORIGIN + "/"), t("title_youtube"));
  } else openChannelListManager(viewId); else openSettingsDialog(viewId, state);
}, ensureListState = function(viewId, context) {
  var key = String(viewId);
  if (!listViewState[key]) {
    var mode = getString(context && context.kind);
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
      enableVideos: normalizeEnabledFlag(context && context.enableVideos),
      enableStreams: normalizeEnabledFlag(context && context.enableStreams),
      continuationSource: getString(context && context.continuationSource),
      pendingItems: [],
      channelTabFallbackPending: !1,
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
}, renderRelatedList = function(viewId, state) {
  state.loaded = !0, synura.update(viewId, {
    styles: {
      title: state.title || t("title_related_videos")
    },
    models: {
      contents: state.items || [],
      menus: [ t(POST_MENU_OPEN), t(MENU_SETTINGS) ],
      snackbar: (state.items || []).length ? "" : t("snackbar_no_related_videos")
    }
  });
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
}, loadHomeFallbackList = function(viewId, state) {
  if (state && !state.loading) {
    var keepItems = isHomeTrendingState(state), homeLabel = getHomeFallbackLabel(), homeQuery = getHomeFallbackSearchQuery();
    state.loading = !0, state.mode = "home", state.homeFeedMode = "trending", state.homeQuery = homeLabel, 
    state.query = homeQuery, state.pendingItems = [], state.continuation = "", keepItems || (state.items = []), 
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
        contents: state.items || [],
        menus: [ t(HOME_MENU_CHANNEL_LIST), t(MENU_SETTINGS) ],
        snackbar: t("loading_videos")
      }
    });
    try {
      var page = fetchSearchPage(homeQuery);
      state.items = page.items, state.continuation = page.continuation, state.apiCfg = page.apiCfg, 
      state.loaded = !0, synura.update(viewId, {
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
          contents: page.items,
          menus: [ t(HOME_MENU_CHANNEL_LIST), t(MENU_SETTINGS) ],
          snackbar: page.items.length ? "" : t("snackbar_no_videos_found")
        }
      });
    } catch (e) {
      state.items = [], state.loaded = !0, showSnackbar(viewId, t("error_search_failed", {
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
      menus: [ t(HOME_MENU_CHANNEL_LIST), t(MENU_SETTINGS) ],
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
  var videosEnabled = normalizeEnabledFlag(state && state.enableVideos), streamsEnabled = normalizeEnabledFlag(state && state.enableStreams);
  return videosEnabled || streamsEnabled ? videosEnabled && streamsEnabled ? t("snackbar_no_videos_or_streams_found") : videosEnabled ? t("snackbar_no_videos_found") : t("snackbar_no_live_streams_found") : t("snackbar_videos_and_streams_disabled");
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
}, renderChannelList = function(viewId, state) {
  synura.update(viewId, {
    styles: {
      title: state.channelTitle || t("title_channel"),
      appbar: buildChannelAppbar(state)
    },
    models: {
      contents: state.items || [],
      menus: buildChannelMenus(state),
      snackbar: buildChannelSnackbar(state)
    }
  });
}, loadChannelFirstPage = function(viewId, forceRefresh) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading) if (state.channelUrl || state.channelId) {
    if (!normalizeEnabledFlag(state.enableVideos) && !normalizeEnabledFlag(state.enableStreams)) return state.items = [], 
    state.pendingItems = [], state.continuation = "", state.continuationSource = "", 
    state.channelTabFallbackPending = !1, state.loaded = !0, void renderChannelList(viewId, state);
    state.loading = !0;
    try {
      var options = {
        query: cleanQuery(state.channelQuery),
        videos: normalizeEnabledFlag(state.enableVideos),
        streams: normalizeEnabledFlag(state.enableStreams)
      }, page = forceRefresh ? null : getCachedChannelPage(state.channelUrl, state.channelId, options);
      page || (page = fetchChannelPage(state.channelUrl, state.channelId, options), saveCachedChannelPage(state.channelUrl, state.channelId, options, page));
      var split = splitBufferedItems(page.items, loadChannelListChunkSize());
      state.mode = "channel", state.items = split.visible, state.pendingItems = split.pending, 
      state.continuation = page.continuation, state.continuationSource = page.continuationSource || "", 
      state.apiCfg = page.apiCfg, state.channelTabFallbackPending = !!page.channelTabFallbackPending, 
      state.loaded = !0, page.channel && (state.channelUrl = normalizeChannelUrl(page.channel.channelUrl || state.channelUrl), 
      state.channelId = page.channel.channelId || state.channelId, state.channelTitle = page.channel.channelTitle || state.channelTitle, 
      state.channelAvatar = page.channel.channelAvatar || state.channelAvatar, state.channelMemo = page.channel.channelMemo || state.channelMemo), 
      !state.channelUrl && state.channelId && (state.channelUrl = normalizeChannelUrl("/channel/" + state.channelId)), 
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
    var pendingAppend = drainPendingItems(state, loadChannelListChunkSize());
    if (pendingAppend.length) return state.items = state.items.concat(pendingAppend), 
    synura.update(viewId, {
      models: {
        append: pendingAppend,
        snackbar: ""
      }
    }), void (state.pendingItems.length || state.continuation || state.channelTabFallbackPending || showSnackbar(viewId, t("snackbar_no_more_channel_items")));
    if (state.continuation || state.channelTabFallbackPending) {
      state.loading = !0;
      try {
        var page = null, loadingDeferredTabs = !1;
        !state.continuation && state.channelTabFallbackPending ? (page = fetchChannelPageFromTabs(state.channelUrl, state.channelId, {
          query: "",
          videos: normalizeEnabledFlag(state.enableVideos),
          streams: normalizeEnabledFlag(state.enableStreams)
        }), state.channelTabFallbackPending = !1, state.continuation = page.continuation, 
        state.continuationSource = page.continuationSource || "", state.apiCfg = page.apiCfg || state.apiCfg, 
        loadingDeferredTabs = !0, page.channel && (state.channelUrl = normalizeChannelUrl(page.channel.channelUrl || state.channelUrl), 
        state.channelId = page.channel.channelId || state.channelId, state.channelTitle = page.channel.channelTitle || state.channelTitle, 
        state.channelAvatar = page.channel.channelAvatar || state.channelAvatar, state.channelMemo = page.channel.channelMemo || state.channelMemo), 
        !state.channelUrl && state.channelId && (state.channelUrl = normalizeChannelUrl("/channel/" + state.channelId))) : (page = fetchChannelContinuation(state.continuation, state.apiCfg, state.continuationSource), 
        state.continuation = page.continuation);
        for (var known = {}, i = 0; i < state.items.length; i++) known[getString(state.items[i] && state.items[i].videoId)] = !0;
        for (var i2 = 0; i2 < state.pendingItems.length; i2++) known[getString(state.pendingItems[i2] && state.pendingItems[i2].videoId)] = !0;
        for (var pageItems = hydrateChannelItems(page.items, {
          channelUrl: state.channelUrl,
          channelId: state.channelId,
          channelTitle: state.channelTitle,
          channelAvatar: state.channelAvatar,
          channelMemo: state.channelMemo
        }), freshItems = [], j = 0; j < pageItems.length; j++) {
          var id = getString(pageItems[j] && pageItems[j].videoId);
          id && !known[id] && (known[id] = !0, freshItems.push(pageItems[j]));
        }
        var split = splitBufferedItems(freshItems, loadChannelListChunkSize()), appended = split.visible;
        state.pendingItems = split.pending, appended.length && (state.items = state.items.concat(appended)), 
        synura.update(viewId, {
          models: {
            append: appended,
            snackbar: appended.length ? "" : t("snackbar_no_more_channel_items")
          }
        }), (appended.length || state.pendingItems.length || state.continuation || state.channelTabFallbackPending) && (state.continuation || state.pendingItems.length || state.channelTabFallbackPending) || showSnackbar(viewId, t("snackbar_no_more_channel_items"));
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
      state.mode = "search", state.query = query, state.items = page.items, state.continuation = page.continuation, 
      state.apiCfg = page.apiCfg, state.loaded = !0;
      var title = t("title_search_results", {
        query: query
      });
      synura.update(viewId, {
        styles: {
          title: title
        },
        models: {
          contents: page.items,
          snackbar: page.items.length ? "" : t("snackbar_no_videos_found")
        }
      });
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
      var page = fetchSearchContinuation(state.continuation, state.apiCfg);
      state.continuation = page.continuation, state.items = state.items.concat(page.items), 
      synura.update(viewId, {
        models: {
          append: page.items,
          snackbar: page.items.length ? "" : t("snackbar_no_more_results")
        }
      }), page.items.length && state.continuation || showSnackbar(viewId, t("snackbar_no_more_results"));
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
      var page = fetchSearchContinuation(state.continuation, state.apiCfg);
      state.continuation = page.continuation, state.items = state.items.concat(page.items), 
      synura.update(viewId, {
        models: {
          append: page.items,
          snackbar: page.items.length ? "" : t("snackbar_no_more_results")
        }
      }), page.items.length && state.continuation || showSnackbar(viewId, t("snackbar_no_more_results"));
    } catch (e) {
      showSnackbar(viewId, t("error_could_not_load_more_videos", {
        error: e.toString()
      }));
    }
    state.loading = !1;
  }
}, refreshRelatedList = function(viewId) {
  var state = listViewState[String(viewId)];
  state && synura.update(viewId, {
    models: {
      contents: state.items || [],
      snackbar: ""
    }
  });
}, loadMoreRelated = function(viewId) {
  var state = listViewState[String(viewId)];
  if (state && !state.loading && state.continuation) {
    state.loading = !0;
    try {
      var page = fetchRelatedContinuation(state.continuation, state.apiCfg);
      state.continuation = page.continuation, state.items = state.items.concat(page.items), 
      synura.update(viewId, {
        models: {
          append: page.items,
          snackbar: page.items.length ? "" : t("snackbar_no_more_related_videos")
        }
      }), page.items.length && state.continuation || showSnackbar(viewId, t("snackbar_no_more_related_videos"));
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
  (state.channelUrl || state.channelId) && menus.push(t(POST_MENU_CHANNEL)), menus.push(t(MENU_SETTINGS)),
  menus;
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
}, fetchChannelTabPage = function(normalizedChannelUrl, channelId, tabName, optional) {
  var url = toChannelTabURL(normalizedChannelUrl, tabName);
  if (!url) {
    if (optional) return null;
    throw new Error("Missing channel URL.");
  }
  var html = "";
  try {
    html = fetchText(localizedURL(url));
  } catch (e) {
    if (optional) return null;
    throw e;
  }
  var initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) {
    if (optional) return null;
    throw new Error("Could not parse ytInitialData from channel page.");
  }
  var apiCfg = extractInnertubeConfig(html), videos = normalizeVideoItems(collectVideos(initialData), "");
  if ("streams" === tabName) for (var i = 0; i < videos.length; i++) {
    var item = videos[i] || {}, types = Array.isArray(item.types) ? item.types.slice() : [];
    types.indexOf("stream") < 0 && types.push("stream"), item.types = types, item.memo || (item.memo = t("label_live_stream")),
    videos[i] = item;
  }
  var channel = parseChannelMetadata(initialData, normalizedChannelUrl, channelId);
  return videos = hydrateChannelItems(videos, channel), {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(initialData),
    apiCfg: apiCfg,
    channel: channel
  };
}, fetchChannelSearchPage = function(normalizedChannelUrl, channelId, query) {
  var url = toChannelSearchURL(normalizedChannelUrl, query);
  if (!url) throw new Error("Missing channel URL.");
  var html = fetchText(localizedURL(url)), initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from channel search page.");
  var channel = parseChannelMetadata(initialData, normalizedChannelUrl, channelId), apiCfg = extractInnertubeConfig(html), videos = hydrateChannelItems(normalizeVideoItems(collectVideos(initialData), query), channel);
  return {
    items: dedupeByVideoId(videos),
    continuation: extractContinuationToken(initialData),
    apiCfg: apiCfg,
    channel: channel
  };
}, fetchChannelHomePage = function(normalizedChannelUrl, channelId, options) {
  var url = stripChannelTabSuffix(normalizedChannelUrl) || normalizedChannelUrl;
  if (!url) throw new Error("Missing channel URL.");
  var html = fetchText(localizedURL(url)), apiCfg = extractInnertubeConfig(html), fastPage = extractChannelHomePageFromHTML(html, normalizedChannelUrl, channelId, options, apiCfg);
  if (fastPage) return fastPage;
  var initialData = extractJSONVar(html, "ytInitialData");
  if (!initialData) throw new Error("Could not parse ytInitialData from channel home page.");
  var preview = extractChannelHomePreview(initialData, options), channel = parseChannelMetadata(initialData, normalizedChannelUrl, channelId);
  return {
    items: dedupeByVideoId(hydrateChannelItems(preview.items, channel)),
    continuation: "",
    continuationSource: "",
    apiCfg: apiCfg,
    channel: channel,
    channelTabFallbackPending: preview.channelTabFallbackPending
  };
}, extractChannelHomePreview = function(initialData, options) {
  var wantVideos = normalizeEnabledFlag(options && options.videos), wantStreams = normalizeEnabledFlag(options && options.streams), root = findSelectedChannelTabContent(initialData) || initialData;
  return extractChannelHomePreviewFromContent(root, {
    videos: wantVideos,
    streams: wantStreams
  }, loadChannelHomePreviewLimit());
}, findSelectedChannelTabContent = function(initialData) {
  var tabs = getIn(initialData, [ "contents", "singleColumnBrowseResultsRenderer", "tabs" ], null);
  if (Array.isArray(tabs) && tabs.length || (tabs = getIn(initialData, [ "contents", "twoColumnBrowseResultsRenderer", "tabs" ], [])), 
  Array.isArray(tabs) && tabs.length) return findSelectedChannelTabContentFromTabs(tabs);
  var foundTabs = [];
  collectRendererInstances(initialData, "tabRenderer", foundTabs);
  for (var i = 0; i < foundTabs.length; i++) if (foundTabs[i] && foundTabs[i].selected) return foundTabs[i].content || foundTabs[i];
  var expandableTabs = [];
  collectRendererInstances(initialData, "expandableTabRenderer", expandableTabs);
  for (var j = 0; j < expandableTabs.length; j++) if (expandableTabs[j] && expandableTabs[j].selected) return expandableTabs[j].content || expandableTabs[j];
  return null;
}, collectChannelHomePreviewSections = function(node) {
  var sections = collectChannelHomePreviewSectionsDirect(node);
  if (sections.length) return sections;
  var fallbackSections = [];
  return collectRendererInstances(node, "shelfRenderer", fallbackSections), collectRendererInstances(node, "richShelfRenderer", fallbackSections), 
  fallbackSections;
}, detectChannelHomeSectionKind = function(section) {
  var url = findChannelHomeSectionTabURL(section);
  return /\/streams(?:[/?]|$)/i.test(url) ? "streams" : /\/videos(?:[/?]|$)/i.test(url) ? "videos" : "";
}, findChannelHomeSectionTabURL = function(node) {
  if (!node) return "";
  var directURL = getString(getIn(node, [ "endpoint", "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(node, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(node, [ "commandMetadata", "webCommandMetadata", "url" ], "")) || getString(getIn(node, [ "browseEndpoint", "canonicalBaseUrl" ], ""));
  if (/\/(videos|streams)(?:[/?]|$)/i.test(directURL)) return directURL;
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var listURL = findChannelHomeSectionTabURL(node[i]);
      if (listURL) return listURL;
    }
    return "";
  }
  if ("object" != typeof node) return "";
  for (var urls = [ getString(getIn(node, [ "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(node, [ "navigationEndpoint", "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(node, [ "endpoint", "commandMetadata", "webCommandMetadata", "url" ], "")), getString(getIn(node, [ "browseEndpoint", "canonicalBaseUrl" ], "")) ], j = 0; j < urls.length; j++) if (/\/(videos|streams)(?:[/?]|$)/i.test(urls[j])) return urls[j];
  for (var key in node) if (Object.prototype.hasOwnProperty.call(node, key)) {
    var nestedURL = findChannelHomeSectionTabURL(node[key]);
    if (nestedURL) return nestedURL;
  }
  return "";
}, fetchChannelPage = function(channelUrl, channelId, options) {
  var normalized = normalizeChannelUrl(channelUrl);
  if (!normalized && channelId && (normalized = normalizeChannelUrl("/channel/" + channelId)), 
  !normalized) throw new Error("Missing channel URL.");
  var channelQuery = cleanQuery(options && options.query), wantVideos = normalizeEnabledFlag(options && options.videos), wantStreams = normalizeEnabledFlag(options && options.streams);
  if (channelQuery) {
    var searchPage = fetchChannelSearchPage(normalized, channelId, channelQuery);
    return {
      items: searchPage.items,
      continuation: searchPage.continuation,
      continuationSource: "search",
      apiCfg: searchPage.apiCfg,
      channel: searchPage.channel || {
        channelUrl: normalized,
        channelId: getString(channelId),
        channelTitle: "",
        channelAvatar: "",
        channelMemo: ""
      }
    };
  }
  if (!wantVideos && !wantStreams) return {
    items: [],
    continuation: "",
    continuationSource: "",
    apiCfg: defaultConfig(),
    channel: {
      channelUrl: normalized,
      channelId: getString(channelId),
      channelTitle: "",
      channelAvatar: "",
      channelMemo: ""
    },
    channelTabFallbackPending: !1
  };
  try {
    var homePage = fetchChannelHomePage(normalized, channelId, options);
    if (homePage && homePage.items.length) return homePage;
  } catch (e) {}
  return fetchChannelPageFromTabs(normalized, channelId, options);
}, fetchChannelPageFromTabs = function(normalized, channelId, options) {
  var wantVideos = normalizeEnabledFlag(options && options.videos), wantStreams = normalizeEnabledFlag(options && options.streams), videosPage = wantVideos ? fetchChannelTabPage(normalized, channelId, "videos", wantStreams) : null, streamsPage = wantStreams ? fetchChannelTabPage(normalized, channelId, "streams", !0) : null, mergedItems = [];
  streamsPage && streamsPage.items.length && (mergedItems = mergedItems.concat(streamsPage.items)), 
  videosPage && videosPage.items.length && (mergedItems = mergedItems.concat(videosPage.items));
  var continuation = "", continuationSource = "";
  videosPage && videosPage.continuation ? (continuation = videosPage.continuation, 
  continuationSource = "videos") : streamsPage && streamsPage.continuation && (continuation = streamsPage.continuation, 
  continuationSource = "streams");
  var fallbackChannel = {
    channelUrl: normalized,
    channelId: getString(channelId),
    channelTitle: "",
    channelAvatar: "",
    channelMemo: ""
  };
  return {
    items: dedupeByVideoId(mergedItems),
    continuation: continuation,
    continuationSource: continuationSource,
    apiCfg: videosPage && videosPage.apiCfg || streamsPage && streamsPage.apiCfg || defaultConfig(),
    channel: videosPage && videosPage.channel || streamsPage && streamsPage.channel || fallbackChannel,
    channelTabFallbackPending: !1
  };
}, fetchChannelContinuation = function(token, apiCfg, source) {
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
  var items = extractContinuationItems(response || {}), videos = normalizeVideoItems(collectVideos(items), "");
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
    out.title = title || out.title, out.metadataLine = subtitle;
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
}, parseChannelMetadata = function(initialData, fallbackUrl, fallbackChannelId) {
  var meta = getIn(initialData, [ "metadata", "channelMetadataRenderer" ], null) || findRenderer(initialData, "channelMetadataRenderer"), header = getIn(initialData, [ "header", "c4TabbedHeaderRenderer" ], null) || findRenderer(initialData, "c4TabbedHeaderRenderer");
  return buildChannelMetadata(meta, header, fallbackUrl, fallbackChannelId);
}, buildChannelMetadata = function(meta, header, fallbackUrl, fallbackChannelId) {
  var out = {
    channelUrl: normalizeChannelUrl(fallbackUrl),
    channelId: getString(fallbackChannelId),
    channelTitle: "",
    channelAvatar: "",
    channelMemo: ""
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
}, extractChannelHomePageFromHTML = function(html, normalizedChannelUrl, channelId, options, apiCfg) {
  var root = extractSelectedChannelTabContentFromHTML(html);
  if (!root) {
    var tabs = extractJSONFragmentArray(html, '"singleColumnBrowseResultsRenderer":{"tabs":');
    if (tabs && tabs.length || (tabs = extractJSONFragmentArray(html, '"twoColumnBrowseResultsRenderer":{"tabs":')), 
    !tabs || !tabs.length) return null;
    root = findSelectedChannelTabContentFromTabs(tabs);
  }
  if (!root) return null;
  var preview = extractChannelHomePreviewFromContent(root, options, loadChannelHomePreviewLimit());
  if (!preview.items.length) return null;
  var meta = extractJSONFragmentObject(html, '"channelMetadataRenderer":'), header = extractJSONFragmentObject(html, '"c4TabbedHeaderRenderer":'), channel = buildChannelMetadata(meta, header, normalizedChannelUrl, channelId);
  return {
    items: dedupeByVideoId(hydrateChannelItems(preview.items, channel)),
    continuation: "",
    continuationSource: "",
    apiCfg: apiCfg,
    channel: channel,
    channelTabFallbackPending: preview.channelTabFallbackPending
  };
}, extractSelectedChannelTabContentFromHTML = function(html) {
  return extractJSONFragmentObject(html, '"selected":true,"content":');
}, extractChannelHomePreviewFromContent = function(root, options, limit) {
  var wantVideos = normalizeEnabledFlag(options && options.videos), wantStreams = normalizeEnabledFlag(options && options.streams), targetLimit = Math.floor(getNumber(limit));
  targetLimit < 1 && (targetLimit = loadChannelHomePreviewLimit());
  for (var sections = collectChannelHomePreviewSections(root), seen = {}, items = [], i = 0; i < sections.length && items.length < targetLimit; i++) {
    var section = sections[i], renderers = collectChannelHomeSectionVideoRenderers(section, targetLimit - items.length);
    if (renderers.length) {
      var sectionItems = normalizeVideoItems(renderers, "");
      if (sectionItems.length) "streams" === detectChannelHomeSectionKind(section) && (sectionItems = markItemsAsStream(sectionItems)), 
      appendUniqueChannelItems(items, filterChannelItemsForOptions(sectionItems, wantVideos, wantStreams), seen, targetLimit);
    }
  }
  return items.length || appendUniqueChannelItems(items, filterChannelItemsForOptions(normalizeVideoItems(collectVideos(root), ""), wantVideos, wantStreams), seen, targetLimit), 
  {
    items: items,
    channelTabFallbackPending: items.length > 0
  };
}, findSelectedChannelTabContentFromTabs = function(tabs) {
  for (var list = Array.isArray(tabs) ? tabs : [], i = 0; i < list.length; i++) {
    var tab = getIn(list, [ i, "tabRenderer" ], null);
    if (tab && tab.selected) return tab.content || tab;
  }
  for (var j = 0; j < list.length; j++) {
    var expandable = getIn(list, [ j, "expandableTabRenderer" ], null);
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
  if (node && "object" == typeof node && !(limit && out.length >= limit || (node.videoWithContextRenderer ? out.push(node.videoWithContextRenderer) : node.compactVideoRenderer ? out.push(node.compactVideoRenderer) : node.gridVideoRenderer ? out.push(node.gridVideoRenderer) : node.videoRenderer ? out.push(node.videoRenderer) : node.endScreenVideoRenderer && out.push(node.endScreenVideoRenderer), 
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
  var parts = text.split("·").map(function(item) {
    return item.trim();
  }).filter(function(item) {
    return item.length > 0;
  });
  return 0 === parts.length ? {
    viewCount: "",
    date: ""
  } : 1 === parts.length ? {
    viewCount: parts[0],
    date: ""
  } : {
    viewCount: parts[0],
    date: parts[1]
  };
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
}, normalizeVideoItems = function(renderers, query) {
  for (var items = [], i = 0; i < renderers.length; i++) {
    var item = toVideoItem(renderers[i], query);
    item && item.videoId && items.push(item);
  }
  return dedupeByVideoId(items);
}, toVideoItem = function(renderer) {
  var videoId = getString(renderer.videoId) || getIn(renderer, [ "navigationEndpoint", "watchEndpoint", "videoId" ], "");
  if (!videoId) return null;
  var channel = extractChannelInfoFromVideoRenderer(renderer), title = textOf(renderer.title) || textOf(renderer.headline) || t("label_untitled"), author = textOf(renderer.shortBylineText) || textOf(renderer.longBylineText) || textOf(renderer.ownerText) || channel.channelTitle, viewCount = textOf(renderer.viewCountText) || textOf(renderer.shortViewCountText), likeCount = textOf(renderer.voteCount), date = textOf(renderer.publishedTimeText), duration = textOf(renderer.lengthText), metaParts = [];
  duration && metaParts.push(duration), viewCount && metaParts.push(viewCount), date && metaParts.push(date);
  var item = {
    link: watchURL(videoId),
    videoId: videoId,
    title: title,
    author: author,
    memo: metaParts.join(" - "),
    date: date,
    viewCount: viewCount,
    mediaUrl: thumbnailFrom(renderer.thumbnail) || thumbnailFromVideoId(videoId),
    mediaType: "image",
    types: detectVideoItemTypes(renderer),
    menus: [ t(ITEM_MENU_OPEN_BROWSER), t(ITEM_MENU_OPEN_VIDEO), t(ITEM_MENU_OPEN_CHANNEL) ],
    channelUrl: channel.channelUrl,
    channelId: channel.channelId,
    channelTitle: channel.channelTitle || author,
    channelAvatar: channel.channelAvatar,
    channelMemo: channel.channelMemo
  };
  return likeCount && (item.likeCount = likeCount), item;
}, detectVideoItemTypes = function(renderer) {
  var types = [ "video" ];
  return isLikelyStreamRenderer(renderer) && types.push("stream"), types;
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
    var item = cloneObject(items[i] || {}), types = Array.isArray(item.types) ? item.types.slice() : [ "video" ];
    types.indexOf("stream") < 0 && types.push("stream"), item.types = types, item.memo || (item.memo = t("label_live_stream")),
    out.push(item);
  }
  return out;
}, filterChannelItemsForOptions = function(items, wantVideos, wantStreams) {
  for (var out = [], i = 0; i < items.length; i++) {
    var item = items[i] || {}, isStream = Array.isArray(item.types) && item.types.indexOf("stream") >= 0;
    (wantVideos && wantStreams || wantStreams && isStream || wantVideos && !isStream) && out.push(item);
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
  collectRendererInstances(node, "endScreenVideoRenderer", renderers), 
  renderers;
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
  if (innertubeConfigCache && innertubeConfigCache.apiKey) return (innertubeConfigCache = normalizeInnertubeConfig(innertubeConfigCache) || null) ? cloneObject(innertubeConfigCache) : null;
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
  return normalized && normalized.apiKey ? (innertubeConfigCache = cloneObject(normalized), 
  cloneObject(normalized)) : null;
}, saveInnertubeConfigCache = function(cfg) {
  var normalized = normalizeInnertubeConfig(cfg);
  if (!normalized || !normalized.apiKey) return normalized;
  if (innertubeConfigCache = cloneObject(normalized), "undefined" != typeof sessionStorage && sessionStorage && "function" == typeof sessionStorage.setItem) try {
    sessionStorage.setItem(INNERTUBE_CONFIG_CACHE_KEY, JSON.stringify(innertubeConfigCache));
  } catch (e) {}
  return cloneObject(normalized);
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
  return [ normalizedUrl || "", getString(channelId) || extractChannelIdFromUrl(normalizedUrl) || "", cleanQuery(options && options.query) || "", normalizeEnabledFlag(options && options.videos) ? "1" : "0", normalizeEnabledFlag(options && options.streams) ? "1" : "0" ].join("|");
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
  null) : (touchChannelPageCacheKey(cacheKey), cloneObject(entry.page)) : null;
}, saveCachedChannelPage = function(channelUrl, channelId, options, page) {
  var cacheKey = makeChannelPageCacheKey(channelUrl, channelId, options);
  if (cacheKey && page && "object" == typeof page) for (channelPageCache[cacheKey] = {
    savedAt: Date.now(),
    page: cloneObject(page)
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
  var id = getString(key), index = Object.prototype.hasOwnProperty.call(UI_STRING_INDEX, id) ? UI_STRING_INDEX[id] : -1, out = [], seen = {};
  if (!id) return out;
  for (var locale in UI_STRINGS) if (Object.prototype.hasOwnProperty.call(UI_STRINGS, locale)) {
    var value = getString(UI_STRINGS[locale] && UI_STRINGS[locale][index]);
    value && !seen[value] && (seen[value] = !0, out.push(value));
  }
  return out.length || (out.push(id), seen[id] = !0), out;
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
}, cloneObject = function(obj) {
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
}, getString = function(value) {
  return null == value ? "" : String(value);
}, getNumber = function(value) {
  var n = Number(value);
  return isNaN(n) ? 0 : n;
};
