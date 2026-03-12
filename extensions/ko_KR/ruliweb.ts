// @ts-nocheck

// To refresh the preloaded Ruliweb board list:
// 1. Fetch current family seeds. `get_family_list` only returns family entry points,
//    so the real board list still has to be collected from the live seed pages.
//    curl -sS -L 'https://api.ruliweb.com/get_family_list' \
//      -H 'Referer: https://bbs.ruliweb.com/' \
//      -H 'Origin: https://bbs.ruliweb.com' \
//      -H 'X-Requested-With: XMLHttpRequest' \
//      -H 'Accept: application/json, text/javascript, */*; q=0.01' \
//      > /tmp/ruliweb_family_api.json
// 2. Fetch each fixed section seed (for example `https://bbs.ruliweb.com/community`)
//    and each `/family/{id}` returned by the API with `curl -sS -L '<seed-url>'`.
// 3. Parse `.menu_wrapper` and `.snb_family .list_menu`, normalize board URLs to the
//    queryless board URL, and update `RULIWEB_PRELOADED_BOARD_ROWS` below.
// 4. Keep `RULIWEB_DEFAULT_VISIBLE_BOARD_IDS` small so cold starts do not expose every board.

var RULIWEB_DEFAULT_VISIBLE_BOARD_IDS = [
  "best_humor_only",
  "best_humor",
  "best_political",
  "best_hobby",
  "best_cartoon",
  "best_community",
  "best_userinfo",
  "best_game",
  "best_anime",
  "community_300143",
  "news_1001"
];

var RULIWEB_HOME_BOARDS = [
  {
    "id": "best_humor_only",
    "title": "베스트 유머",
    "url": "/best/humor_only"
  },
  {
    "id": "best_humor",
    "title": "유게 베스트",
    "url": "/best/humor",
    "description": "유머 게시판 베스트"
  },
  {
    "id": "best_political",
    "title": "정치유머 베스트",
    "url": "/best/political"
  },
  {
    "id": "best_hobby",
    "title": "취미 베스트",
    "url": "/best/hobby"
  },
  {
    "id": "best_cartoon",
    "title": "그림/만화 베스트",
    "url": "/best/cartoon"
  },
  {
    "id": "best_community",
    "title": "커뮤니티 베스트",
    "url": "/best/community"
  },
  {
    "id": "best_userinfo",
    "title": "정보 베스트",
    "url": "/best/userinfo"
  },
  {
    "id": "best_game",
    "title": "게임 베스트",
    "url": "/best/game"
  },
  {
    "id": "best_anime",
    "title": "애니/책 베스트",
    "url": "/best/anime"
  },
  {
    "id": "community_300143",
    "title": "유머 게시판",
    "url": "/community/board/300143",
    "description": "커뮤니티 유머"
  },
  {
    "id": "news_1001",
    "title": "게임 뉴스",
    "url": "/news/board/1001"
  }
];

var RULIWEB_PRELOADED_BOARD_ROWS = [
  ["LIVE / 개설 신청", "userboard_700220", "지금 듣는 노래 게시판", "/userboard/board/700220"],
  ["LOL 루리웹 / LOL 게시판", "family_4526_300585", "매칭/모집", "/family/4526/board/300585"],
  ["LOL 루리웹 / 기타", "family_4526_300064", "웹툰 갤러리", "/family/4526/board/300064"],
  ["LOL 루리웹 / 뉴스/정보", "family_4526_300007", "뉴스 게시판", "/family/4526/board/300007"],
  ["LOL 루리웹 / 커뮤니티", "family_4526_300143", "유머 게시판", "/family/4526/board/300143"],
  ["LOL 루리웹 / 포지션 게시판", "family_4526_300586", "TOP 포지션", "/family/4526/board/300586"],
  ["PC / H/W 게시판", "pc_320019", "조립/견적", "/pc/board/320019"],
  ["PC / 게임 게시판", "pc_300058", "EPIC/스팀/패키지", "/pc/board/300058"],
  ["PC / 스샷 / 영상", "pc_300535", "패키지게임 스샷", "/pc/board/300535"],
  ["PC / 정보 게시판", "pc_300006", "PC 정보", "/pc/board/300006"],
  ["PS4/5 / 게임 게시판", "ps_300421", "게임 이야기", "/ps/board/300421"],
  ["PS4/5 / 리뷰 게시판", "ps_300577", "게임 소감/비평", "/ps/board/300577"],
  ["PS4/5 / 스샷 / 영상", "ps_300496", "스크린샷", "/ps/board/300496"],
  ["PS4/5 / 자료실", "ps_300432", "질문/요청", "/ps/board/300432"],
  ["PS4/5 / 정보 게시판", "ps_300001", "유저 정보", "/ps/board/300001"],
  ["SWITCH / 게임 게시판", "nin_300051", "게임 이야기", "/nin/board/300051"],
  ["SWITCH / 리뷰 게시판", "nin_300577", "게임 소감/비평", "/nin/board/300577"],
  ["SWITCH / 스샷 / 영상", "nin_300496", "스크린샷", "/nin/board/300496"],
  ["SWITCH / 정보 게시판", "nin_300004", "유저 정보", "/nin/board/300004"],
  ["VR / 메타 퀘스트", "family_5342_300777", "메타퀘스트3/3S", "/family/5342/board/300777"],
  ["VR / 버튜버", "userboard_700037", "버튜버 게시판", "/userboard/board/700037"],
  ["VR / 정보 게시판", "family_5342_300700", "버튜버 정보", "/family/5342/board/300700"],
  ["XBO/SX / 게임 게시판", "xbox_300047", "게임 이야기", "/xbox/board/300047"],
  ["XBO/SX / 리뷰 게시판", "xbox_300577", "게임 소감/비평", "/xbox/board/300577"],
  ["XBO/SX / 스샷 / 영상", "xbox_300496", "스크린샷", "/xbox/board/300496"],
  ["XBO/SX / 정보 게시판", "xbox_300003", "유저 정보", "/xbox/board/300003"],
  ["검은사막 루리웹 / 검은사막", "family_4653_180450", "이야기 게시판", "/family/4653/board/180450"],
  ["검은사막 루리웹 / 검은사막 M", "family_4653_184563", "이야기 게시판", "/family/4653/board/184563"],
  ["검은사막 루리웹 / 검은사막 콘솔", "family_4653_185160", "이야기 게시판", "/family/4653/board/185160"],
  ["검은사막 루리웹 / 직업 게시판", "family_4653_300600", "워리어", "/family/4653/board/300600"],
  ["검은사막 루리웹 / 커뮤/자료실", "family_4653_300143", "유머 게시판", "/family/4653/board/300143"],
  ["고전/아케이드 / PSV/PSP", "family_249_300002", "유저 정보", "/family/249/board/300002"],
  ["고전/아케이드 / 기타", "family_249_300139", "네오지오", "/family/249/board/300139"],
  ["고전/아케이드 / 닌텐도", "family_249_300127", "패미컴", "/family/249/board/300127"],
  ["고전/아케이드 / 닌텐도 3DS", "family_249_300005", "유저 정보", "/family/249/board/300005"],
  ["고전/아케이드 / 세가", "family_249_300121", "잡담 게시판", "/family/249/board/300121"],
  ["고전/아케이드 / 커뮤니티", "family_249_300119", "고전 게임", "/family/249/board/300119"],
  ["그란 투리스모", "family_500_100585", "그란 투리스모", "/family/500/board/100585"],
  ["그란 투리스모 / 정보 게시판", "family_500_1001", "유저 뉴스", "/family/500/board/1001"],
  ["그란 투리스모 / 커뮤니티", "family_500_320044", "자동차 갤러리", "/family/500/board/320044"],
  ["뉴스/겜툰 / 비디오게임", "news_524", "PS4 / PS5", "/news/524"],
  ["뉴스/겜툰 / 유저 동영상", "news_300537", "콘솔 영상", "/news/board/300537"],
  ["뉴스/겜툰 / 유저 스크린샷", "news_300496", "콘솔 스샷", "/news/board/300496"],
  ["뉴스/겜툰 / 유저정보", "news_1001", "콘솔", "/news/board/1001"],
  ["던전 앤 파이터 루리웹 / 던전앤파이터", "family_496_102230", "던전앤파이터", "/family/496/board/102230"],
  ["던전 앤 파이터 루리웹 / 던파 듀얼", "family_496_186024", "던파 듀얼", "/family/496/board/186024"],
  ["던전 앤 파이터 루리웹 / 던파 모바일", "family_496_108216", "던파 모바일", "/family/496/board/108216"],
  ["던전 앤 파이터 루리웹 / 커뮤니티", "family_496_300143", "유머 게시판", "/family/496/board/300143"],
  ["데스티니 가디언즈 루리웹 / 데스티니", "family_4383_181510", "게임 이야기", "/family/4383/board/181510"],
  ["데스티니 가디언즈 루리웹 / 커뮤니티", "family_4383_300143", "유머 게시판", "/family/4383/board/300143"],
  ["동물의 숲 패밀리 / 놀러가요", "family_503_100403", "놀러가요", "/family/503/board/100403"],
  ["동물의 숲 패밀리 / 놀러오세요", "family_503_100090", "놀러오세요", "/family/503/board/100090"],
  ["동물의 숲 패밀리 / 모바일/ETC", "family_503_183669", "해피 홈", "/family/503/board/183669"],
  ["동물의 숲 패밀리 / 모여봐요", "family_503_185109", "게임 이야기", "/family/503/board/185109"],
  ["동물의 숲 패밀리 / 통신 게시판", "family_503_300517", "3DS", "/family/503/board/300517"],
  ["동물의 숲 패밀리 / 튀어나와요", "family_503_180519", "튀어나와요", "/family/503/board/180519"],
  ["드래곤 볼 / 드래곤볼", "family_504_102332", "드래곤볼", "/family/504/board/102332"],
  ["디비전 루리웹 / 디비전", "family_492_181224", "이야기 게시판", "/family/492/board/181224"],
  ["디비전 루리웹 / 디비전2", "family_492_184778", "디비전2", "/family/492/board/184778"],
  ["디아블로 루리웹 / 디아블로4", "family_2086_185248", "이야기 게시판", "/family/2086/board/185248"],
  ["디아블로 루리웹 / 이모탈", "family_2086_185621", "이야기 게시판", "/family/2086/board/185621"],
  ["라스트에포크 루리웹 / 라스트에포크", "family_5482_186432", "전체 게시판", "/family/5482/board/186432"],
  ["락스타 게임즈 루리웹 / GTA 시리즈", "family_4948_100446", "GTA 시리즈", "/family/4948/board/100446"],
  ["락스타 게임즈 루리웹 / 그 외", "family_4948_100890", "레드데드리뎀션", "/family/4948/board/100890"],
  ["락스타 게임즈 루리웹 / 레데리 2", "family_4948_184900", "레데리 2", "/family/4948/board/184900"],
  ["러브 라이브", "family_3094_181035", "러브 라이브", "/family/3094/board/181035"],
  ["러브 라이브 / 커뮤니티", "family_3094_300552", "자유 게시판", "/family/3094/board/300552"],
  ["러브 라이브 / 콘솔/AC", "family_3094_182317", "콘솔/AC", "/family/3094/board/182317"],
  ["로스트아크 루리웹 / 로아 게시판", "family_4659_182721", "이야기 게시판", "/family/4659/board/182721"],
  ["로스트아크 루리웹 / 커뮤니티", "family_4659_300143", "유머 게시판", "/family/4659/board/300143"],
  ["마영전 루리웹 / 뉴스/정보", "family_4853_300007", "뉴스 게시판", "/family/4853/board/300007"],
  ["마영전 루리웹 / 마비노기 시리즈", "family_4853_186573", "빈딕투스: 디파잉 페이트", "/family/4853/board/186573"],
  ["마영전 루리웹 / 마영전", "family_4853_101236", "이야기 게시판", "/family/4853/board/101236"],
  ["만화 / 이야기 게시판", "family_212_300142", "질문 게시판", "/family/212/board/300142"],
  ["만화 / 정보 게시판", "family_212_300277", "유저 정보", "/family/212/board/300277"],
  ["메이플스토리 루리웹 / 그 외", "family_4773_183984", "메이플 월드", "/family/4773/board/183984"],
  ["메이플스토리 루리웹 / 메이플", "family_4773_182199", "이야기 게시판", "/family/4773/board/182199"],
  ["메이플스토리 루리웹 / 메이플 2", "family_4773_102937", "이야기 게시판", "/family/4773/board/102937"],
  ["메탈 기어 솔리드 / MGS 외전", "family_507_102459", "MGS 외전", "/family/507/board/102459"],
  ["메탈 기어 솔리드 / MGS 정규", "family_507_102113", "MGS 정규", "/family/507/board/102113"],
  ["모바일 / 게임 게시판", "mobile_300059", "게임 이야기", "/mobile/board/300059"],
  ["모바일 / 정보 게시판", "mobile_300008", "애플 정보", "/mobile/board/300008"],
  ["몬스터 헌터 루리웹 / 몬헌 와일즈", "family_4442_300352", "헌터서클집회", "/family/4442/board/300352"],
  ["몬스터 헌터 루리웹 / 커뮤니티", "family_4442_300143", "유머 게시판", "/family/4442/board/300143"],
  ["무쌍 시리즈 / 외전", "family_510_186861", "무쌍: 어비스", "/family/510/board/186861"],
  ["무쌍 시리즈 / 정규", "family_510_186830", "오리진", "/family/510/board/186830"],
  ["배틀그라운드 / PC 게시판", "family_4384_320019", "PC 견적 문의", "/family/4384/board/320019"],
  ["배틀그라운드 / 배그 게시판", "family_4384_184318", "배그 게시판", "/family/4384/board/184318"],
  ["배틀그라운드 / 배그 모바일", "family_4384_184746", "이야기 게시판", "/family/4384/board/184746"],
  ["배틀필드 루리웹 / 배틀필드", "family_5595_100219", "배틀필드", "/family/5595/board/100219"],
  ["붉은사막 루리웹 / 붉은사막", "family_5614_185595", "붉은사막", "/family/5614/board/185595"],
  ["사이버펑크2077 패밀리 / 이야기 게시판", "family_5214_184786", "이야기 게시판", "/family/5214/board/184786"],
  ["소녀전선 / 소녀전선 시리즈", "family_4382_186571", "역붕괴", "/family/4382/board/186571"],
  ["소녀전선 / 소전 게시판", "family_4382_184404", "소전 게시판", "/family/4382/board/184404"],
  ["소녀전선 / 커뮤니티", "family_4382_300143", "유머 게시판", "/family/4382/board/300143"],
  ["소울워커 루리웹 / 소울워커", "family_493_179945", "이야기 게시판", "/family/493/board/179945"],
  ["소울워커 루리웹 / 커뮤니티", "family_493_300143", "유머 게시판", "/family/493/board/300143"],
  ["슈퍼로봇대전 / SRW 커뮤니티", "family_511_300366", "아수라장", "/family/511/board/300366"],
  ["슈퍼로봇대전 / 슈로대 모바일", "family_511_183793", "슈로대 모바일", "/family/511/board/183793"],
  ["아이돌 마스터 / 모바일 아이마스", "family_3518_183740", "모바일 아이마스", "/family/3518/board/183740"],
  ["아이돌 마스터 / 커뮤니티", "family_3518_300548", "자유 게시판", "/family/3518/board/300548"],
  ["아이돌 마스터 / 콘솔 아이마스", "family_3518_101568", "콘솔 아이마스", "/family/3518/board/101568"],
  ["아이온 루리웹 / 아이온", "family_5605_101668", "아이온", "/family/5605/board/101668"],
  ["아이온 루리웹 / 아이온 2", "family_5605_187107", "아이온 2", "/family/5605/board/187107"],
  ["애니/만화책 / 관련 게시판", "family_211_300557", "타입문", "/family/211/board/300557"],
  ["애니/만화책 / 만화책/도서", "family_211_300067", "만화책 / 웹툰", "/family/211/board/300067"],
  ["애니/만화책 / 애니메이션", "family_211_300073", "잡담 게시판", "/family/211/board/300073"],
  ["애니/만화책 / 정보 게시판", "family_211_300015", "애니 정보", "/family/211/board/300015"],
  ["에이펙스 레전드 루리웹 / 에이펙스 레전드", "family_5042_184999", "에이펙스 레전드", "/family/5042/board/184999"],
  ["에이펙스 레전드 루리웹 / 정보", "family_5042_300007", "뉴스", "/family/5042/board/300007"],
  ["오버워치 루리웹 / 오버워치", "family_1476_184032", "토론/이슈", "/family/1476/board/184032"],
  ["오버워치 루리웹 / 커뮤니티", "family_1476_300143", "유머 게시판", "/family/1476/board/300143"],
  ["우마무스메 패밀리 / 우마무스메", "family_5268_184773", "우마무스메", "/family/5268/board/184773"],
  ["우마무스메 패밀리 / 우마무스메 콘솔", "family_5268_186546", "대감사제!", "/family/5268/board/186546"],
  ["월드 오브 워쉽 루리웹 / 병과 게시판", "family_4804_300673", "구축함", "/family/4804/board/300673"],
  ["월드 오브 워쉽 루리웹 / 자료실", "family_4804_300671", "워쉽 자료실", "/family/4804/board/300671"],
  ["월드 오브 워쉽 루리웹 / 커뮤니티", "family_4804_181269", "이야기 게시판", "/family/4804/board/181269"],
  ["월드 오브 워크래프트 루리웹 / WOW 게시판", "family_4454_100159", "이야기 게시판", "/family/4454/board/100159"],
  ["월드 오브 워크래프트 루리웹 / 던전/PVP", "family_4454_300581", "레이드", "/family/4454/board/300581"],
  ["월드 오브 워크래프트 루리웹 / 블리자드 게임", "family_4454_101296", "스타크래프트", "/family/4454/board/101296"],
  ["월드 오브 워크래프트 루리웹 / 서버 게시판", "family_4454_300701", "아즈샤라", "/family/4454/board/300701"],
  ["월드 오브 워크래프트 루리웹 / 자료실", "family_4454_300593", "애드온 자료실", "/family/4454/board/300593"],
  ["월드 오브 워크래프트 루리웹 / 직업 게시판", "family_4454_300625", "전사", "/family/4454/board/300625"],
  ["월드 오브 워크래프트 루리웹 / 커뮤니티", "family_4454_300143", "유머 게시판", "/family/4454/board/300143"],
  ["월드 오브 탱크 루리웹 / 자료실", "family_4805_300672", "월탱 자료실", "/family/4805/board/300672"],
  ["월드 오브 탱크 루리웹 / 커뮤니티", "family_4805_178322", "이야기 게시판", "/family/4805/board/178322"],
  ["취미갤 / PC 갤러리", "hobby_320019", "PC조립 부품", "/hobby/board/320019"],
  ["취미갤 / 게임", "hobby_300577", "리뷰&스토리", "/hobby/board/300577"],
  ["취미갤 / 교통 / 자전거", "hobby_320109", "정보 게시판", "/hobby/board/320109"],
  ["취미갤 / 레고/프라/피규어", "hobby_300118", "레고/옥스포드", "/hobby/board/300118"],
  ["취미갤 / 방사진/음식/패션", "hobby_300116", "방사진/사무실", "/hobby/board/300116"],
  ["취미갤 / 휴대폰 / AV", "hobby_300098", "디카 기기", "/hobby/board/300098"],
  ["칼리스토 프로토콜 패밀리 / [리댁티드]", "family_5428_186767", "[리댁티드]", "/family/5428/board/186767"],
  ["칼리스토 프로토콜 패밀리 / 칼리스토 프로토콜", "family_5428_186203", "칼리스토 프로토콜", "/family/5428/board/186203"],
  ["캡콤 게임 루리웹 / 격투게임", "family_508_182821", "스트리트파이터", "/family/508/board/182821"],
  ["캡콤 게임 루리웹 / 바이오하자드", "family_508_187029", "바하 레퀴엠", "/family/508/board/187029"],
  ["캡콤 게임 루리웹 / 액션게임", "family_508_100261", "록맨", "/family/508/board/100261"],
  ["커뮤니티 / 정보 게시판", "community_300018", "사정게", "/community/board/300018"],
  ["콜 오브 듀티 루리웹 / COD 워존", "family_4916_185340", "COD 워존", "/family/4916/board/185340"],
  ["콜 오브 듀티 루리웹 / 콜 오브 듀티", "family_4916_100370", "콘솔 게시판", "/family/4916/board/100370"],
  ["테일즈 시리즈 / 시리즈 게시판", "family_516_185755", "어라이즈", "/family/516/board/185755"],
  ["팀 닌자 루리웹 / 로닌/와룡/인왕", "family_5455_186534", "로닌", "/family/5455/board/186534"],
  ["팀 닌자 루리웹 / 인왕 3", "family_5455_186940", "인왕 3", "/family/5455/board/186940"],
  ["팀 닌자 루리웹 / 팀 닌자", "family_5455_101777", "DOA", "/family/5455/board/101777"],
  ["파이널 판타지 루리웹 / 외전", "family_514_186412", "에버크라이시스", "/family/514/board/186412"],
  ["파이널 판타지 루리웹 / 정규", "family_514_185327", "파판 7 RE", "/family/514/board/185327"],
  ["패스 오브 엑자일 루리웹 / POE", "family_5076_181745", "POE", "/family/5076/board/181745"],
  ["패스 오브 엑자일 루리웹 / POE 2", "family_5076_186769", "POE 2", "/family/5076/board/186769"],
  ["포켓몬스터 루리웹 / WIFI 통신", "family_515_300390", "통신 게시판", "/family/515/board/300390"],
  ["포켓몬스터 루리웹 / 레전드 Z-A", "family_515_185923", "레전드 Z-A", "/family/515/board/185923"],
  ["포켓몬스터 루리웹 / 스칼렛/바이올렛", "family_515_184030", "스칼렛/바이올렛", "/family/515/board/184030"],
  ["포켓몬스터 루리웹 / 커뮤니티", "family_515_300389", "자유 게시판", "/family/515/board/300389"],
  ["포켓몬스터 루리웹 / 포켓몬 외전", "family_515_187190", "포코피아", "/family/515/board/187190"],
  ["폴아웃 루리웹 / 커뮤니티", "family_4979_300143", "유머 게시판", "/family/4979/board/300143"],
  ["폴아웃 루리웹 / 폴아웃 게시판", "family_4979_184906", "이야기 게시판", "/family/4979/board/184906"],
  ["프라모델", "family_232_300079", "이야기 게시판", "/family/232/board/300079"],
  ["프라모델 / 정보 게시판", "family_232_300016", "유저 정보", "/family/232/board/300016"],
  ["프롬 소프트웨어 루리웹 / 블러드 본", "family_4892_182048", "블러드 본", "/family/4892/board/182048"],
  ["프롬 소프트웨어 루리웹 / 세키로", "family_4892_184765", "세키로", "/family/4892/board/184765"],
  ["프롬 소프트웨어 루리웹 / 소울 시리즈", "family_4892_183787", "다크 소울 3", "/family/4892/board/183787"],
  ["프롬 소프트웨어 루리웹 / 아머드 코어", "family_4892_101995", "아머드 코어", "/family/4892/board/101995"],
  ["프롬 소프트웨어 루리웹 / 엘든 링", "family_4892_185738", "엘든 링", "/family/4892/board/185738"],
  ["피규어 / 관련 갤러리", "family_242_300118", "레고/옥스포드", "/family/242/board/300118"],
  ["피규어 / 정보 게시판", "family_242_300017", "유저 정보", "/family/242/board/300017"],
  ["피규어 / 피규어 게시판", "family_242_300085", "이야기 게시판", "/family/242/board/300085"],
  ["피파온라인 루리웹 / 모바일 게임", "family_4749_186552", "FC 모바일", "/family/4749/board/186552"],
  ["피파온라인 루리웹 / 커뮤니티", "family_4749_101249", "이야기 게시판", "/family/4749/board/101249"],
  ["피파온라인 루리웹 / 콘솔게임", "family_4749_186425", "FC 게시판", "/family/4749/board/186425"],
  ["하스스톤 루리웹 / 커뮤니티", "family_3110_300143", "유머 게시판", "/family/3110/board/300143"],
  ["하스스톤 루리웹 / 하스스톤", "family_3110_180930", "이야기 게시판", "/family/3110/board/180930"],
  ["히오스 루리웹 / 뉴스/정보", "family_4527_300007", "뉴스 게시판", "/family/4527/board/300007"],
  ["히오스 루리웹 / 커뮤니티", "family_4527_300143", "유머 게시판", "/family/4527/board/300143"],
  ["히오스 루리웹 / 히오스 게시판", "family_4527_181429", "이야기 게시판", "/family/4527/board/181429"]
];

function ruliwebBuildPreloadedBoards(rows) {
  var items = [];
  var seen = {};
  for (var i = 0; i < (rows || []).length; i++) {
    var entry = rows[i] || [];
    var group = entry[0] ? String(entry[0]).trim() : "";
    var id = entry[1] ? String(entry[1]).trim() : "";
    var title = entry[2] ? String(entry[2]).trim() : "";
    var url = entry[3] ? String(entry[3]).trim() : "";
    if (!id || !title || !url || seen[id]) continue;
    seen[id] = true;
    items.push({
      "id": id,
      "title": title,
      "url": url,
      "description": title,
      "group": group
    });
  }
  return items;
}

var RULIWEB_PRELOADED_BOARDS = ruliwebBuildPreloadedBoards(RULIWEB_PRELOADED_BOARD_ROWS);

var SITE = {
  "siteKey": "ruliweb",
  "displayName": "루리웹",
  "browserHomeUrl": "https://m.ruliweb.com/best/humor_only",
  "browserCookieAuth": false,
  "minimumHomeBoards": 10,
  "defaultCacheTtlMs": 300000,
  "showCacheSnackbarByDefault": true,
  "enableCacheSettings": true,
  "enableBoardReorder": true,
  "enableBoardDelete": true,
  "boardSettingsMenuLabel": "게시판 설정",
  "boardSettingsTitle": "게시판 설정",
  "boardSettingsLargeThreshold": 256,
  "boardSettingsPageSize": 96,
  "boardAddMode": "url_title",
  "defaultVisibleBoardIds": RULIWEB_DEFAULT_VISIBLE_BOARD_IDS,
  "hostAliases": [
    "m.ruliweb.com",
    "ruliweb.com",
    "bbs.ruliweb.com"
  ],
  "challengeMarkers": [],
  "titleSuffixes": [
    " - 루리웹",
    " : 루리웹"
  ],
  "linkAllowPatterns": [
    "^https://bbs[.]ruliweb[.]com/(?:(?:family/[0-9]+/board/[0-9]+)|(?:[^/]+/board/[0-9]+)|(?:(?!best(?:/|$)|family(?:/|$))[^/]+/[0-9]+))/read/[0-9]+",
    "^https://m[.]ruliweb[.]com/(?:(?:family/[0-9]+/board/[0-9]+)|(?:[^/]+/board/[0-9]+)|(?:(?!best(?:/|$)|family(?:/|$))[^/]+/[0-9]+))/read/[0-9]+"
  ],
  "listBoardQueryParam": "",
  "boards": RULIWEB_HOME_BOARDS.concat(RULIWEB_PRELOADED_BOARDS),
  "selectors": {
    "boardTitle": [
      "a#board_name",
      ".board_title",
      ".board_name",
      "title"
    ],
    "listRows": [
      "#board_list .table_body",
      ".board_list_table .table_body",
      ".board_list_table li"
    ],
    "listLink": [
      ".subject.deco.text_over.blocktarget",
      ".subject_link.deco",
      "a[href*='/read/']"
    ],
    "listTitle": [
      ".subject.deco.text_over.blocktarget",
      ".subject_link.deco",
      ".subject"
    ],
    "listAuthor": [
      ".writer",
      ".nick",
      ".author"
    ],
    "listDate": [
      ".time",
      ".regdate",
      ".date"
    ],
    "listCommentCount": [
      ".num_reply",
      ".reply_count",
      ".reply"
    ],
    "listViewCount": [
      ".hit",
      ".view"
    ],
    "listLikeCount": [
      ".recomd",
      ".recom",
      ".recommend"
    ],
    "listCategory": [
      ".divsn",
      ".board_name",
      ".category"
    ],
    "listImage": [
      "img"
    ],
    "postTitle": [
      ".subject_inner_text",
      "h1",
      "title"
    ],
    "postAuthor": [
      ".view_info .nick",
      ".writer .nick",
      ".nick",
      ".writer"
    ],
    "postDate": [
      ".regdate",
      ".view_info .time",
      ".date",
      "time"
    ],
    "postViewCount": [
      ".view_info .hit",
      ".hit",
      ".view"
    ],
    "postLikeCount": [
      ".like",
      ".recomd",
      ".view_info .recom",
      ".recom",
      ".recommend"
    ],
    "postCategory": [
      ".category_text",
      ".board_name",
      ".cate"
    ],
    "postContent": [
      ".view_content.autolink",
      ".view_content"
    ],
    "commentRows": [
      "#cmt .comment_element",
      "#cmt li",
      ".comment_list li"
    ],
    "commentAuthor": [
      ".nick",
      ".name",
      ".writer"
    ],
    "commentContent": [
      ".text_wrapper",
      ".comment_view",
      ".text",
      ".comment_text"
    ],
    "commentDate": [
      ".time",
      ".date"
    ],
    "commentLikeCount": [
      ".btn_like .num",
      ".recom",
      ".recommend"
    ],
    "commentLevel": []
  },
  "commentLevelAttrs": [],
  "boardGroupMap": {
    "best_humor_only": "베스트",
    "best_humor": "베스트",
    "best_political": "베스트",
    "best_hobby": "베스트",
    "best_cartoon": "베스트",
    "best_community": "베스트",
    "best_userinfo": "베스트",
    "best_game": "베스트",
    "best_anime": "베스트",
    "community_300143": "커뮤니티",
    "news_1001": "뉴스"
  }
};
function ruliwebBoardUrl(section, boardId) {
    return "https://" + SYNURA.domain + "/" + encodeURIComponent(section) + "/" + encodeURIComponent(boardId);
}
function ruliwebBoardPathUrl(section, boardId) {
    return "https://" + SYNURA.domain + "/" + encodeURIComponent(section) + "/board/" + encodeURIComponent(boardId);
}
function ruliwebFamilyBoardUrl(familyId, boardId) {
    return "https://" + SYNURA.domain + "/family/" + encodeURIComponent(familyId) + "/board/" + encodeURIComponent(boardId);
}
function ruliwebIsNumeric(value) {
    return /^\d+$/.test(String(value || ""));
}
SITE.matchBoard = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length === 2 && parts[0] === "best") {
        return {
            board: ensureBoard("best_" + parts[1], ruliwebBoardUrl("best", parts[1]), parts[1]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    if (parts.length === 3 && parts[0] === "best" && parts[1] === "board") {
        return {
            board: ensureBoard("best_board_" + parts[2], ruliwebBoardPathUrl("best", parts[2]), parts[2]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    if (parts.length === 4 && parts[0] === "family" && ruliwebIsNumeric(parts[1]) && parts[2] === "board" && ruliwebIsNumeric(parts[3])) {
        return {
            board: ensureBoard("family_" + parts[1] + "_" + parts[3], ruliwebFamilyBoardUrl(parts[1], parts[3]), parts[3]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    if (parts.length === 3 && (parts[0] === "community" || parts[0] === "news") && parts[1] === "board") {
        return {
            board: ensureBoard(parts[0] + "_" + parts[2], ruliwebBoardPathUrl(parts[0], parts[2]), parts[2]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    if (parts.length === 3 && parts[1] === "board" && ruliwebIsNumeric(parts[2])) {
        return {
            board: ensureBoard(parts[0] + "_" + parts[2], ruliwebBoardPathUrl(parts[0], parts[2]), parts[2]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    if (parts.length === 2 && parts[0] !== "best" && parts[0] !== "family" && ruliwebIsNumeric(parts[1])) {
        return {
            board: ensureBoard(parts[0] + "_" + parts[1], ruliwebBoardUrl(parts[0], parts[1]), parts[1]),
            page: queryInt(urlInfo.query, "page", 1)
        };
    }
    return null;
};
SITE.matchPost = function (urlInfo) {
    var parts = pathSegments(urlInfo.path);
    if (parts.length >= 4 && parts[0] === "best" && parts[2] === "read" && ruliwebIsNumeric(parts[3])) {
        return {
            board: ensureBoard("best_" + parts[1], ruliwebBoardUrl("best", parts[1]), parts[1]),
            postId: parts[3]
        };
    }
    if (parts.length >= 5 && parts[0] === "best" && parts[1] === "board" && parts[3] === "read" && ruliwebIsNumeric(parts[4])) {
        return {
            board: ensureBoard("best_board_" + parts[2], ruliwebBoardPathUrl("best", parts[2]), parts[2]),
            postId: parts[4]
        };
    }
    if (parts.length >= 6 && parts[0] === "family" && ruliwebIsNumeric(parts[1]) && parts[2] === "board" && ruliwebIsNumeric(parts[3]) && parts[4] === "read" && ruliwebIsNumeric(parts[5])) {
        return {
            board: ensureBoard("family_" + parts[1] + "_" + parts[3], ruliwebFamilyBoardUrl(parts[1], parts[3]), parts[3]),
            postId: parts[5]
        };
    }
    if (parts.length >= 5 && (parts[0] === "community" || parts[0] === "news") && parts[1] === "board" && parts[3] === "read" && ruliwebIsNumeric(parts[4])) {
        return {
            board: ensureBoard(parts[0] + "_" + parts[2], ruliwebBoardPathUrl(parts[0], parts[2]), parts[2]),
            postId: parts[4]
        };
    }
    if (parts.length >= 5 && parts[1] === "board" && parts[3] === "read" && ruliwebIsNumeric(parts[4])) {
        return {
            board: ensureBoard(parts[0] + "_" + parts[2], ruliwebBoardPathUrl(parts[0], parts[2]), parts[2]),
            postId: parts[4]
        };
    }
    if (parts.length >= 4 && parts[0] !== "best" && parts[0] !== "family" && ruliwebIsNumeric(parts[1]) && parts[2] === "read" && ruliwebIsNumeric(parts[3])) {
        return {
            board: ensureBoard(parts[0] + "_" + parts[1], ruliwebBoardUrl(parts[0], parts[1]), parts[1]),
            postId: parts[3]
        };
    }
    return null;
};
SITE.buildNextPageUrl = function (match, currentUrl, nextPage) {
    return setPageParam(currentUrl, "page", nextPage);
};
SITE.buildPostFetchUrls = function (match, currentUrl) {
    return [currentUrl];
};
SITE.buildBoardUrlFromId = function (boardId) {
    return "";
};
function ruliwebGroupSegment(value) {
    return cleanBoardGroupText(value).replace(/\s*\/\s*/g, "·");
}
function ruliwebGroupPath(rootLabel, groupTitle) {
    var parts = [];
    var root = ruliwebGroupSegment(rootLabel);
    var group = ruliwebGroupSegment(groupTitle);
    if (root) parts.push(root);
    if (group && group !== root) parts.push(group);
    return parts.join(" / ");
}
function ruliwebMatchBoardUrl(url) {
    var normalized = normalizeUrl(url) || ensureAbsoluteUrl(url, SITE.browserHomeUrl);
    if (!normalized) return null;
    var info = parseAbsoluteUrl(normalized);
    if (!info || !isKnownHost(info.host)) return null;
    var match = SITE.matchBoard(info);
    if (!match || !match.board || !match.board.id) return null;
    return {
        url: normalized,
        board: match.board
    };
}
function ruliwebPushDynamicBoard(items, seen, title, url, group) {
    var matched = ruliwebMatchBoardUrl(url);
    if (!matched || !matched.board) return;
    var boardId = normalizeWhitespace(matched.board.id);
    if (!boardId || seen[boardId]) return;
    var board = normalizeBoardRecord({
        id: boardId,
        title: normalizeWhitespace(firstNonEmpty([
            title,
            matched.board.title,
            boardId
        ])),
        url: matched.url,
        description: normalizeWhitespace(firstNonEmpty([
            title,
            matched.board.title,
            matched.url
        ])),
        group: normalizeWhitespace(group),
        dynamic: true
    }, { dynamic: true });
    if (!board) return;
    seen[board.id] = true;
    items.push(board);
}
function ruliwebShouldSyncSeedUrl(url) {
    var normalized = normalizeUrl(url) || ensureAbsoluteUrl(url, SITE.browserHomeUrl);
    if (!normalized) return false;
    var info = parseAbsoluteUrl(normalized);
    if (!info || !isKnownHost(info.host)) return false;
    var parts = pathSegments(info.path);
    if (parts.length === 1) {
        return parts[0] === "community" ||
            parts[0] === "news" ||
            parts[0] === "ps" ||
            parts[0] === "nin" ||
            parts[0] === "xbox" ||
            parts[0] === "pc" ||
            parts[0] === "vr" ||
            parts[0] === "mobile" ||
            parts[0] === "hobby" ||
            parts[0] === "userboard";
    }
    return parts.length === 2 && parts[0] === "family" && ruliwebIsNumeric(parts[1]);
}
function ruliwebCollectPrimarySeeds(doc, items, seenBoards) {
    var seeds = [];
    var seenUrls = {};
    var links = allNodes(doc, [".gnb_menu a.col_12[href]"]);
    for (var i = 0; i < links.length; i++) {
        var href = normalizeUrl(attrOf(links[i], "href")) || ensureAbsoluteUrl(attrOf(links[i], "href"), SITE.browserHomeUrl);
        var title = normalizeWhitespace(firstNonEmpty([
            firstText(links[i], [".inline_block"]),
            firstText(links[i], ["h3.screen_out"]),
            textOf(links[i])
        ]));
        if (!href) continue;
        if (ruliwebShouldSyncSeedUrl(href)) {
            if (!seenUrls[href]) {
                seenUrls[href] = true;
                seeds.push({
                    url: href,
                    label: title
                });
            }
            continue;
        }
        ruliwebPushDynamicBoard(items, seenBoards, title, href, "바로가기");
    }
    return seeds;
}
function ruliwebCollectFamilySeeds(doc) {
    var seeds = [];
    var seenUrls = {};
    var parents = allNodes(doc, ["a.sub_parent"]);
    for (var i = 0; i < parents.length; i++) {
        var parent = parents[i];
        if (normalizeWhitespace(textOf(parent)).indexOf("패밀리사이트") < 0) continue;
        var wrapper = parent.nextElementSibling;
        if (!wrapper) continue;
        var links = allNodes(wrapper, ["a[href*='/family/']"]);
        for (var j = 0; j < links.length; j++) {
            var href = normalizeUrl(attrOf(links[j], "href")) || ensureAbsoluteUrl(attrOf(links[j], "href"), SITE.browserHomeUrl);
            var title = normalizeWhitespace(textOf(links[j]));
            if (!href || !title || !ruliwebShouldSyncSeedUrl(href) || seenUrls[href]) continue;
            seenUrls[href] = true;
            seeds.push({
                url: href,
                label: title
            });
        }
        break;
    }
    return seeds;
}
function ruliwebCollectBoardsFromMenuDoc(doc, rootLabel, items, seenBoards) {
    var nav = firstNode(doc, ["ul.nav_list.row"]);
    if (!nav) return;
    var entries = allNodes(nav, ["li.menu"]);
    var currentGroup = ruliwebGroupSegment(rootLabel);
    for (var i = 0; i < entries.length; i++) {
        var item = entries[i];
        if (!item) continue;
        if (firstNode(item, ["a.sub_parent"])) continue;
        var depth1 = firstNode(item, ["h4.list_item.depth1"]);
        if (depth1) {
            var groupTitle = normalizeWhitespace(textOf(depth1));
            var anchor = firstNode(item, ["a[href]"]);
            var className = String(attrOf(item, "class") || "");
            var isExpandable = /\bexpand\b/.test(className) || /\bstyle_open_list\b/.test(className);
            if (isExpandable) {
                currentGroup = ruliwebGroupPath(rootLabel, groupTitle);
            } else {
                ruliwebPushDynamicBoard(items, seenBoards, groupTitle, attrOf(anchor, "href"), ruliwebGroupSegment(rootLabel));
                currentGroup = ruliwebGroupSegment(rootLabel);
            }
            continue;
        }
        var anchor = firstNode(item, ["a[href]"]);
        var depth2 = firstNode(item, ["h4.list_item.depth2"]);
        if (!anchor || !depth2) continue;
        ruliwebPushDynamicBoard(items, seenBoards, normalizeWhitespace(textOf(depth2)), attrOf(anchor, "href"), currentGroup || ruliwebGroupSegment(rootLabel));
    }
}
SITE.loadDynamicBoards = function (options) {
    var allowNetwork = !(options && options.allowNetwork === false);
    var force = !!(options && options.force);
    var cacheKey = CACHE_PREFIX + "dynamic:ruliweb:v1";
    var cacheTsKey = cacheKey + ":ts";
    var cached = readStoredJson(cacheKey, []);
    var cachedTs = parseInt(String(localStorage.getItem(cacheTsKey) || "0"), 10) || 0;
    if (!force && Array.isArray(cached) && cached.length > 0 && (Date.now() - cachedTs) < 86400000) {
        return cached;
    }
    if (!allowNetwork) return Array.isArray(cached) ? cached : [];
    var items = [];
    var seenBoards = {};
    try {
        var communityUrl = "https://" + SYNURA.domain + "/community";
        var communityDoc = fetchDocument(communityUrl);
        ruliwebCollectBoardsFromMenuDoc(communityDoc, "커뮤니티", items, seenBoards);
        var seeds = ruliwebCollectPrimarySeeds(communityDoc, items, seenBoards).concat(ruliwebCollectFamilySeeds(communityDoc));
        var seenSeedUrls = {};
        for (var i = 0; i < seeds.length; i++) {
            var seed = seeds[i];
            var seedUrl = normalizeUrl(seed && seed.url);
            var seedLabel = normalizeWhitespace(seed && seed.label);
            if (!seedUrl || !seedLabel || seenSeedUrls[seedUrl] || seedUrl === communityUrl) continue;
            seenSeedUrls[seedUrl] = true;
            try {
                ruliwebCollectBoardsFromMenuDoc(fetchDocument(seedUrl), seedLabel, items, seenBoards);
            } catch (e) {
            }
        }
        if (items.length > 0) {
            writeStoredJson(cacheKey, items);
            localStorage.setItem(cacheTsKey, String(Date.now()));
            return items;
        }
    } catch (e) {
    }
    return Array.isArray(cached) ? cached : [];
};
SITE.prepareBoardContext = function (context, items, match, url) {
    return context;
};
SITE.filterAppendItems = function (items, state, routeContext) {
    return items || [];
};
SITE.updateAppendState = function (state, items, routeContext) {
    return state;
};
SITE.buildHomeMenus = function (menus, isReorderable) {
    return menus;
};
SITE.buildBoardSettingsRootMenus = function (menus, state) {
    return menus;
};
SITE.buildBoardMenus = function (menus, state) {
    return menus;
};
SITE.buildPostMenus = function (menus, state) {
    return menus;
};
SITE.routeBoardCustom = function (url, urlInfo, match, force) {
    return null;
};
SITE.routePostCustom = function (url, urlInfo, match, force) {
    return null;
};
SITE.parseComments = function (doc, postUrl) {
    return parseGenericComments(doc, postUrl);
};
SITE.fetchPostComments = function (match, url, doc, page, comments) {
    return comments;
};
SITE.handleViewEvent = function (viewId, event, state, context) {
    return false;
};
SITE.handleBoardSettingsRootEvent = function (viewId, event, state) {
    return false;
};

var SYNURA = {
    domain: "m.ruliweb.com",
    name: "ruliweb",
    description: "Unofficial Synura extension for Ruliweb mobile boards.",
    version: 0.1,
    api: 0,
    license: "Apache-2.0",
    bypass: "chrome/android",
    locale: "ko_KR",
    deeplink: true,
    icon: "https://m.ruliweb.com/favicon.ico",
    main: null
};

var LIST_LINK_ALLOW_PATTERNS = SITE.linkAllowPatterns || [];
var LIST_LINK_SELECTORS = SITE.selectors && SITE.selectors.listLink ? SITE.selectors.listLink : [".subject.deco.text_over.blocktarget",".subject_link.deco","a[href*='/read/']"];
var LIST_TITLE_SELECTORS = SITE.selectors && SITE.selectors.listTitle ? SITE.selectors.listTitle : [".subject.deco.text_over.blocktarget",".subject_link.deco",".subject"];
var LIST_AUTHOR_SELECTORS = SITE.selectors && SITE.selectors.listAuthor ? SITE.selectors.listAuthor : [".writer",".nick",".author"];
var LIST_AVATAR_SELECTORS = [];
var LIST_DATE_SELECTORS = SITE.selectors && SITE.selectors.listDate ? SITE.selectors.listDate : [".time",".regdate",".date"];
var LIST_COMMENT_COUNT_SELECTORS = SITE.selectors && SITE.selectors.listCommentCount ? SITE.selectors.listCommentCount : [".num_reply",".reply_count",".reply"];
var LIST_VIEW_COUNT_SELECTORS = SITE.selectors && SITE.selectors.listViewCount ? SITE.selectors.listViewCount : [".hit",".view"];
var LIST_LIKE_COUNT_SELECTORS = SITE.selectors && SITE.selectors.listLikeCount ? SITE.selectors.listLikeCount : [".recomd",".recom",".recommend"];
var LIST_CATEGORY_SELECTORS = SITE.selectors && SITE.selectors.listCategory ? SITE.selectors.listCategory : [".board_name",".category"];
var LIST_IMAGE_SELECTORS = SITE.selectors && SITE.selectors.listImage ? SITE.selectors.listImage : ["img"];
function escapeRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function firstMatchGroup(text, pattern) {
    var match = String(text || "").match(pattern);
    return match && match[1] ? match[1] : "";
}
function htmlFragmentText(fragment) {
    var raw = String(fragment || "");
    if (!raw) return "";
    var parser = new DOMParser();
    var doc = parser.parseFromString("<div id='synura-html-fragment'>" + raw + "</div>", "text/html");
    return textOf(firstNode(doc, ["#synura-html-fragment"]));
}
function extractCellHtmlByClasses(rowHtml, classNames) {
    rowHtml = String(rowHtml || "");
    for (var i = 0; i < classNames.length; i++) {
        var className = classNames[i];
        if (!className) continue;
        var pattern = new RegExp("<td[^>]*class=[\"'][^\"']*\\b" + escapeRegExp(className) + "\\b[^\"']*[\"'][^>]*>([\\s\\S]*?)</td>", "i");
        var match = rowHtml.match(pattern);
        if (match && match[1]) return match[1];
    }
    return "";
}
function parseRuliwebBoardItemsFromHtml(html, baseUrl) {
    var boardTableHtml = firstMatchGroup(String(html || ""), /<table[^>]*class=["'][^"']*\bboard_list_table\b[^"']*["'][^>]*>([\s\S]*?)<\/table>/i);
    if (!boardTableHtml) return [];
    var rowMatches = boardTableHtml.match(/<tr[^>]*class=["'][^"']*\btable_body\b[^"']*["'][^>]*>[\s\S]*?<\/tr>/gi) || [];
    var items = [];
    var seen = {};
    for (var i = 0; i < rowMatches.length; i++) {
        var rowHtml = rowMatches[i];
        var subjectHtml = extractCellHtmlByClasses(rowHtml, ["subject"]);
        if (!subjectHtml) continue;
        var link = ensureAbsoluteUrl(firstMatchGroup(subjectHtml, /<a[^>]*href=["']([^"']*\/read\/\d+[^"']*)["'][^>]*>/i), baseUrl);
        if (!isAllowedListLink(link, LIST_LINK_ALLOW_PATTERNS) || seen[link]) continue;
        var anchorHtml = firstMatchGroup(subjectHtml, /<a[^>]*href=["'][^"']*\/read\/\d+[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
        if (!anchorHtml) anchorHtml = firstMatchGroup(subjectHtml, /<a[^>]*class=["'][^"']*\bsubject_link\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
        var titleHtml = String(anchorHtml || "")
            .replace(/<(?:a|span)[^>]*class=["'][^"']*\b(?:num_reply|replycount|inline_block)\b[^"']*["'][^>]*>[\s\S]*?<\/(?:a|span)>/gi, "")
            .replace(/<i[^>]*class=["'][^"']*\bicon-[^"']*["'][^>]*>[\s\S]*?<\/i>/gi, "")
            .replace(/<span[^>]*style=["'][^"']*display\s*:\s*inline-block[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, "");
        var title = normalizeWhitespace(htmlFragmentText(titleHtml).replace(/^\d+\s+/, ""));
        if (!title) continue;
        var commentText = firstMatchGroup(anchorHtml, /class=["'][^"']*\bnum\b[^"']*["'][^>]*>\s*(\d+)/i);
        if (!commentText) commentText = firstMatchGroup(subjectHtml, /class=["'][^"']*\bnum_reply\b[^"']*["'][^>]*>\s*[\[(]?\s*(\d+)/i);
        var authorHtml = extractCellHtmlByClasses(rowHtml, ["writer", "nick", "author"]);
        if (!authorHtml) authorHtml = firstMatchGroup(subjectHtml, /<span[^>]*class=["'][^"']*\bwriter\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
        var likeHtml = extractCellHtmlByClasses(rowHtml, ["recomd", "recom", "recommend"]);
        if (!likeHtml) likeHtml = firstMatchGroup(subjectHtml, /<span[^>]*class=["'][^"']*\brecomd\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
        var viewHtml = extractCellHtmlByClasses(rowHtml, ["hit", "view"]);
        if (!viewHtml) viewHtml = firstMatchGroup(subjectHtml, /<span[^>]*class=["'][^"']*\bhit\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
        var dateHtml = extractCellHtmlByClasses(rowHtml, ["time", "regdate", "date"]);
        if (!dateHtml) dateHtml = firstMatchGroup(subjectHtml, /<span[^>]*class=["'][^"']*\btime\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
        var categoryHtml = extractCellHtmlByClasses(rowHtml, ["divsn", "board_name", "category"]);
        if (!categoryHtml) categoryHtml = firstMatchGroup(subjectHtml, /<a[^>]*href=["'][^"']*(?:\?|&)cate=\d+[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
        var authorText = htmlFragmentText(authorHtml);
        var likeText = htmlFragmentText(likeHtml);
        var viewText = htmlFragmentText(viewHtml);
        var dateText = htmlFragmentText(dateHtml);
        var categoryText = htmlFragmentText(categoryHtml);
        var likeCount = hideZeroCount(parseCount(likeText));
        var viewCount = parseCount(viewText);
        var commentCount = hideZeroCount(parseCount(commentText));
        seen[link] = true;
        items.push({
            link: normalizeUrl(link) || link,
            title: title,
            author: authorText,
            avatar: "",
            date: dateText,
            category: categoryText,
            commentCount: commentCount,
            viewCount: viewCount,
            likeCount: likeCount,
            mediaUrl: "",
            mediaType: "",
            types: [],
            menus: [],
            hotCount: toInt(likeText || viewText || commentText, 0),
            coldCount: toInt(viewText || likeText || commentText, 0)
        });
    }
    return items;
}
function elementChildren(node) {
    var out = [];
    var children = node && node.childNodes ? node.childNodes : [];
    for (var i = 0; i < children.length; i++) {
        if (children[i] && children[i].nodeType === 1) out.push(children[i]);
    }
    return out;
}
function hasClassName(node, className) {
    var classes = " " + normalizeWhitespace(node && node.className ? node.className : "") + " ";
    return classes.indexOf(" " + className + " ") >= 0;
}
function firstChildByClass(node, classNames) {
    var children = elementChildren(node);
    for (var i = 0; i < children.length; i++) {
        for (var j = 0; j < classNames.length; j++) {
            if (hasClassName(children[i], classNames[j])) return children[i];
        }
    }
    return null;
}
function findDescendant(node, predicate) {
    var children = elementChildren(node);
    for (var i = 0; i < children.length; i++) {
        if (predicate(children[i])) return children[i];
        var nested = findDescendant(children[i], predicate);
        if (nested) return nested;
    }
    return null;
}
function extractTableRowItem(row, baseUrl) {
    if (!row || String(row.tagName || "").toUpperCase() !== "TR") return null;
    var subjectCell = firstChildByClass(row, ["subject"]);
    if (!subjectCell) return null;

    var linkNode = findDescendant(subjectCell, function (node) {
        return String(node && node.tagName || "").toUpperCase() === "A" && !!attrOf(node, "href");
    });
    var link = ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl);
    if (!isAllowedListLink(link, LIST_LINK_ALLOW_PATTERNS)) return null;

    var titleNode = findDescendant(subjectCell, function (node) {
        return hasClassName(node, "text_over") && !hasClassName(node, "num_reply");
    });
    var commentNode = findDescendant(subjectCell, function (node) {
        return hasClassName(node, "num_reply") || hasClassName(node, "reply_count") || hasClassName(node, "reply");
    });
    var authorCell = firstChildByClass(row, ["writer", "nick", "author"]);
    var likeCell = firstChildByClass(row, ["recomd", "recom", "recommend"]);
    var viewCell = firstChildByClass(row, ["hit", "view"]);
    var dateCell = firstChildByClass(row, ["time", "regdate", "date"]);
    var categoryCell = firstChildByClass(row, ["board_name", "category"]);
    var mediaUrl = imageUrlFromNode(subjectCell, baseUrl);
    var types = [];
    if (mediaUrl) types.push("image");

    return {
        link: normalizeUrl(link) || link,
        title: firstNonEmpty([textOf(titleNode), textOf(linkNode), textOf(subjectCell)]),
        author: textOf(authorCell),
        avatar: imageUrlFromNode(authorCell, baseUrl),
        date: textOf(dateCell),
        category: textOf(categoryCell),
        commentCount: hideZeroCount(parseCount(textOf(commentNode))),
        viewCount: parseCount(textOf(viewCell)),
        likeCount: hideZeroCount(parseCount(textOf(likeCell))),
        mediaUrl: mediaUrl,
        mediaType: mediaUrl ? "image" : "",
        types: types,
        menus: [],
        hotCount: toInt(textOf(likeCell) || textOf(viewCell) || textOf(commentNode), 0),
        coldCount: toInt(textOf(viewCell) || textOf(likeCell) || textOf(commentNode), 0)
    };
}
function parseRuliwebBoardItems(doc, baseUrl) {
    var rows = allNodes(doc, SITE.selectors.listRows);
    if (!rows || rows.length === 0) return [];
    var items = [];
    var seen = {};
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var subjectCell = firstNode(row, [".subject"]);
        var linkNode = firstNode(row, ["td.subject a[href]", ".subject_link.deco", "a[href*='/read/']"]);
        var link = ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl);
        if (!isAllowedListLink(link, LIST_LINK_ALLOW_PATTERNS)) continue;
        var titleNode = firstNode(row, [
            "td.subject strong.text_over",
            "td.subject span.text_over",
            "td.subject .subject.text_over",
            "td.subject .text_over",
            ".subject_link.deco strong",
            ".subject_link.deco span.text_over",
            ".subject_link.deco"
        ]);
        var title = firstNonEmpty([
            textOfNodeWithoutSelectors(titleNode, LIST_COMMENT_COUNT_SELECTORS),
            textOfNodeWithoutSelectors(linkNode, LIST_COMMENT_COUNT_SELECTORS),
            textOf(subjectCell)
        ]);
        if (!title) continue;
        var commentNode = firstNode(row, LIST_COMMENT_COUNT_SELECTORS);
        var authorCell = firstNode(row, LIST_AUTHOR_SELECTORS);
        var likeCell = firstNode(row, LIST_LIKE_COUNT_SELECTORS);
        var viewCell = firstNode(row, LIST_VIEW_COUNT_SELECTORS);
        var dateCell = firstNode(row, LIST_DATE_SELECTORS);
        var categoryCell = firstNode(row, LIST_CATEGORY_SELECTORS);
        var mediaUrl = imageUrlFromNode(subjectCell, baseUrl);
        var types = [];
        if (mediaUrl) types.push("image");
        var item = {
            link: normalizeUrl(link) || link,
            title: title,
            author: textOf(authorCell),
            avatar: imageUrlFromNode(authorCell, baseUrl),
            date: textOf(dateCell),
            category: textOf(categoryCell),
            commentCount: hideZeroCount(parseCount(textOf(commentNode))),
            viewCount: parseCount(textOf(viewCell)),
            likeCount: hideZeroCount(parseCount(textOf(likeCell))),
            mediaUrl: mediaUrl,
            mediaType: mediaUrl ? "image" : "",
            types: types,
            menus: [],
            hotCount: toInt(textOf(likeCell) || textOf(viewCell) || textOf(commentNode), 0),
            coldCount: toInt(textOf(viewCell) || textOf(likeCell) || textOf(commentNode), 0)
        };
        if (!item.link || seen[item.link]) continue;
        seen[item.link] = true;
        items.push(item);
    }
    return items;
}

function extractListItem(row, baseUrl) {
    var linkNode = firstNode(row, LIST_LINK_SELECTORS);
    var titleNode = firstNode(row, LIST_TITLE_SELECTORS);
    var tableRowItem = extractTableRowItem(row, baseUrl);
    if (tableRowItem) return tableRowItem;
    var link = extractListLink(row, baseUrl, LIST_LINK_SELECTORS, LIST_LINK_ALLOW_PATTERNS);
    if (!link) return null;

    var title = firstNonEmpty([
        textOfNodeWithoutSelectors(titleNode, LIST_COMMENT_COUNT_SELECTORS),
        textOf(linkNode),
        textOf(row)
    ]);
    if (!title) return null;

    var commentCount = hideZeroCount(parseCount(firstText(row, LIST_COMMENT_COUNT_SELECTORS)));
    var viewCount = parseCount(firstText(row, LIST_VIEW_COUNT_SELECTORS));
    var likeCount = hideZeroCount(parseCount(firstText(row, LIST_LIKE_COUNT_SELECTORS)));
    var author = firstAuthorText(row, LIST_AUTHOR_SELECTORS);
    var category = firstText(row, LIST_CATEGORY_SELECTORS);
    var avatarSourceSelectors = LIST_AVATAR_SELECTORS.length > 0 ? LIST_AVATAR_SELECTORS : LIST_AUTHOR_SELECTORS;
    var avatar = imageUrlFromNode(firstNode(row, avatarSourceSelectors), baseUrl);
    var mediaUrl = imageUrlFromNode(firstNode(row, LIST_IMAGE_SELECTORS), baseUrl);
    var types = [];
    if (mediaUrl) types.push("image");

    return {
        link: normalizeUrl(link) || link,
        title: title,
        author: author,
        avatar: avatar,
        date: firstText(row, LIST_DATE_SELECTORS),
        category: category,
        commentCount: commentCount,
        viewCount: viewCount,
        likeCount: likeCount,
        mediaUrl: mediaUrl,
        mediaType: mediaUrl ? "image" : "",
        types: types,
        menus: [],
        hotCount: toInt(likeCount || viewCount || commentCount, 0),
        coldCount: toInt(viewCount || likeCount || commentCount, 0)
    };
}

SITE.parseBoardItemsCustom = parseRuliwebBoardItems;
SITE.parseBoardItemsFromHtml = parseRuliwebBoardItemsFromHtml;
