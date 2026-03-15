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
//    queryless board URL, and update the grouped `RULIWEB_PRELOADED_BOARD_ROWS` data below.
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

function ruliwebExpandPreloadedBoardBlocks(blocks) {
  var rows = [];
  for (var i = 0; i < (blocks || []).length; i++) {
    var block = blocks[i] || [];
    var groupPrefix = block[0] ? String(block[0]).trim() : "";
    var blockRows = Array.isArray(block[1]) ? block[1] : [];
    for (var j = 0; j < blockRows.length; j++) {
      var row = blockRows[j] || [];
      var subgroup = row[0] ? String(row[0]).trim() : "";
      rows.push([
        subgroup ? (groupPrefix ? (groupPrefix + " / " + subgroup) : subgroup) : groupPrefix,
        row[1],
        row[2],
        row[3]
      ]);
    }
  }
  return rows;
}

function ruliwebPreloadedFamilyRow(subgroup, familyId, boardId, title) {
  var family = String(familyId == null ? "" : familyId).trim();
  var board = String(boardId == null ? "" : boardId).trim();
  return [
    subgroup,
    "family_" + family + "_" + board,
    title,
    "/family/" + encodeURIComponent(family) + "/board/" + encodeURIComponent(board)
  ];
}

var RULIWEB_PRELOADED_BOARD_ROWS = ruliwebExpandPreloadedBoardBlocks([
  ["LIVE", [
    ["개설 신청", "userboard_700220", "지금 듣는 노래 게시판", "/userboard/board/700220"],
  ]],
  ["LOL 루리웹", [
    ruliwebPreloadedFamilyRow("LOL 게시판", 4526, 300585, "매칭/모집"),
    ruliwebPreloadedFamilyRow("기타", 4526, 300064, "웹툰 갤러리"),
    ruliwebPreloadedFamilyRow("뉴스/정보", 4526, 300007, "뉴스 게시판"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4526, 300143, "유머 게시판"),
    ruliwebPreloadedFamilyRow("포지션 게시판", 4526, 300586, "TOP 포지션"),
  ]],
  ["PC", [
    ["H/W 게시판", "pc_320019", "조립/견적", "/pc/board/320019"],
    ["게임 게시판", "pc_300058", "EPIC/스팀/패키지", "/pc/board/300058"],
  ]],
  ["PC / 스샷", [
    ["영상", "pc_300535", "패키지게임 스샷", "/pc/board/300535"],
  ]],
  ["PC", [
    ["정보 게시판", "pc_300006", "PC 정보", "/pc/board/300006"],
  ]],
  ["PS4/5", [
    ["게임 게시판", "ps_300421", "게임 이야기", "/ps/board/300421"],
    ["리뷰 게시판", "ps_300577", "게임 소감/비평", "/ps/board/300577"],
  ]],
  ["PS4/5 / 스샷", [
    ["영상", "ps_300496", "스크린샷", "/ps/board/300496"],
  ]],
  ["PS4/5", [
    ["자료실", "ps_300432", "질문/요청", "/ps/board/300432"],
    ["정보 게시판", "ps_300001", "유저 정보", "/ps/board/300001"],
  ]],
  ["SWITCH", [
    ["게임 게시판", "nin_300051", "게임 이야기", "/nin/board/300051"],
    ["리뷰 게시판", "nin_300577", "게임 소감/비평", "/nin/board/300577"],
  ]],
  ["SWITCH / 스샷", [
    ["영상", "nin_300496", "스크린샷", "/nin/board/300496"],
  ]],
  ["SWITCH", [
    ["정보 게시판", "nin_300004", "유저 정보", "/nin/board/300004"],
  ]],
  ["VR", [
    ruliwebPreloadedFamilyRow("메타 퀘스트", 5342, 300777, "메타퀘스트3/3S"),
    ["버튜버", "userboard_700037", "버튜버 게시판", "/userboard/board/700037"],
    ruliwebPreloadedFamilyRow("정보 게시판", 5342, 300700, "버튜버 정보"),
  ]],
  ["XBO/SX", [
    ["게임 게시판", "xbox_300047", "게임 이야기", "/xbox/board/300047"],
    ["리뷰 게시판", "xbox_300577", "게임 소감/비평", "/xbox/board/300577"],
  ]],
  ["XBO/SX / 스샷", [
    ["영상", "xbox_300496", "스크린샷", "/xbox/board/300496"],
  ]],
  ["XBO/SX", [
    ["정보 게시판", "xbox_300003", "유저 정보", "/xbox/board/300003"],
  ]],
  ["검은사막 루리웹", [
    ruliwebPreloadedFamilyRow("검은사막", 4653, 180450, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("검은사막 M", 4653, 184563, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("검은사막 콘솔", 4653, 185160, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("직업 게시판", 4653, 300600, "워리어"),
    ruliwebPreloadedFamilyRow("커뮤/자료실", 4653, 300143, "유머 게시판"),
  ]],
  ["고전/아케이드", [
    ruliwebPreloadedFamilyRow("PSV/PSP", 249, 300002, "유저 정보"),
    ruliwebPreloadedFamilyRow("기타", 249, 300139, "네오지오"),
    ruliwebPreloadedFamilyRow("닌텐도", 249, 300127, "패미컴"),
    ruliwebPreloadedFamilyRow("닌텐도 3DS", 249, 300005, "유저 정보"),
    ruliwebPreloadedFamilyRow("세가", 249, 300121, "잡담 게시판"),
    ruliwebPreloadedFamilyRow("커뮤니티", 249, 300119, "고전 게임"),
  ]],
  ["그란 투리스모", [
    ruliwebPreloadedFamilyRow("", 500, 100585, "그란 투리스모"),
    ruliwebPreloadedFamilyRow("정보 게시판", 500, 1001, "유저 뉴스"),
    ruliwebPreloadedFamilyRow("커뮤니티", 500, 320044, "자동차 갤러리"),
  ]],
  ["뉴스/겜툰", [
    ["비디오게임", "news_524", "PS4 / PS5", "/news/524"],
    ["유저 동영상", "news_300537", "콘솔 영상", "/news/board/300537"],
    ["유저 스크린샷", "news_300496", "콘솔 스샷", "/news/board/300496"],
    ["유저정보", "news_1001", "콘솔", "/news/board/1001"],
  ]],
  ["던전 앤 파이터 루리웹", [
    ruliwebPreloadedFamilyRow("던전앤파이터", 496, 102230, "던전앤파이터"),
    ruliwebPreloadedFamilyRow("던파 듀얼", 496, 186024, "던파 듀얼"),
    ruliwebPreloadedFamilyRow("던파 모바일", 496, 108216, "던파 모바일"),
    ruliwebPreloadedFamilyRow("커뮤니티", 496, 300143, "유머 게시판"),
  ]],
  ["데스티니 가디언즈 루리웹", [
    ruliwebPreloadedFamilyRow("데스티니", 4383, 181510, "게임 이야기"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4383, 300143, "유머 게시판"),
  ]],
  ["동물의 숲 패밀리", [
    ruliwebPreloadedFamilyRow("놀러가요", 503, 100403, "놀러가요"),
    ruliwebPreloadedFamilyRow("놀러오세요", 503, 100090, "놀러오세요"),
    ruliwebPreloadedFamilyRow("모바일/ETC", 503, 183669, "해피 홈"),
    ruliwebPreloadedFamilyRow("모여봐요", 503, 185109, "게임 이야기"),
    ruliwebPreloadedFamilyRow("통신 게시판", 503, 300517, "3DS"),
    ruliwebPreloadedFamilyRow("튀어나와요", 503, 180519, "튀어나와요"),
  ]],
  ["드래곤 볼", [
    ruliwebPreloadedFamilyRow("드래곤볼", 504, 102332, "드래곤볼"),
  ]],
  ["디비전 루리웹", [
    ruliwebPreloadedFamilyRow("디비전", 492, 181224, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("디비전2", 492, 184778, "디비전2"),
  ]],
  ["디아블로 루리웹", [
    ruliwebPreloadedFamilyRow("디아블로4", 2086, 185248, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("이모탈", 2086, 185621, "이야기 게시판"),
  ]],
  ["라스트에포크 루리웹", [
    ruliwebPreloadedFamilyRow("라스트에포크", 5482, 186432, "전체 게시판"),
  ]],
  ["락스타 게임즈 루리웹", [
    ruliwebPreloadedFamilyRow("GTA 시리즈", 4948, 100446, "GTA 시리즈"),
    ruliwebPreloadedFamilyRow("그 외", 4948, 100890, "레드데드리뎀션"),
    ruliwebPreloadedFamilyRow("레데리 2", 4948, 184900, "레데리 2"),
  ]],
  ["러브 라이브", [
    ruliwebPreloadedFamilyRow("", 3094, 181035, "러브 라이브"),
    ruliwebPreloadedFamilyRow("커뮤니티", 3094, 300552, "자유 게시판"),
    ruliwebPreloadedFamilyRow("콘솔/AC", 3094, 182317, "콘솔/AC"),
  ]],
  ["로스트아크 루리웹", [
    ruliwebPreloadedFamilyRow("로아 게시판", 4659, 182721, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4659, 300143, "유머 게시판"),
  ]],
  ["마영전 루리웹", [
    ruliwebPreloadedFamilyRow("뉴스/정보", 4853, 300007, "뉴스 게시판"),
    ruliwebPreloadedFamilyRow("마비노기 시리즈", 4853, 186573, "빈딕투스: 디파잉 페이트"),
    ruliwebPreloadedFamilyRow("마영전", 4853, 101236, "이야기 게시판"),
  ]],
  ["만화", [
    ruliwebPreloadedFamilyRow("이야기 게시판", 212, 300142, "질문 게시판"),
    ruliwebPreloadedFamilyRow("정보 게시판", 212, 300277, "유저 정보"),
  ]],
  ["메이플스토리 루리웹", [
    ruliwebPreloadedFamilyRow("그 외", 4773, 183984, "메이플 월드"),
    ruliwebPreloadedFamilyRow("메이플", 4773, 182199, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("메이플 2", 4773, 102937, "이야기 게시판"),
  ]],
  ["메탈 기어 솔리드", [
    ruliwebPreloadedFamilyRow("MGS 외전", 507, 102459, "MGS 외전"),
    ruliwebPreloadedFamilyRow("MGS 정규", 507, 102113, "MGS 정규"),
  ]],
  ["모바일", [
    ["게임 게시판", "mobile_300059", "게임 이야기", "/mobile/board/300059"],
    ["정보 게시판", "mobile_300008", "애플 정보", "/mobile/board/300008"],
  ]],
  ["몬스터 헌터 루리웹", [
    ruliwebPreloadedFamilyRow("몬헌 와일즈", 4442, 300352, "헌터서클집회"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4442, 300143, "유머 게시판"),
  ]],
  ["무쌍 시리즈", [
    ruliwebPreloadedFamilyRow("외전", 510, 186861, "무쌍: 어비스"),
    ruliwebPreloadedFamilyRow("정규", 510, 186830, "오리진"),
  ]],
  ["배틀그라운드", [
    ruliwebPreloadedFamilyRow("PC 게시판", 4384, 320019, "PC 견적 문의"),
    ruliwebPreloadedFamilyRow("배그 게시판", 4384, 184318, "배그 게시판"),
    ruliwebPreloadedFamilyRow("배그 모바일", 4384, 184746, "이야기 게시판"),
  ]],
  ["배틀필드 루리웹", [
    ruliwebPreloadedFamilyRow("배틀필드", 5595, 100219, "배틀필드"),
  ]],
  ["붉은사막 루리웹", [
    ruliwebPreloadedFamilyRow("붉은사막", 5614, 185595, "붉은사막"),
  ]],
  ["사이버펑크2077 패밀리", [
    ruliwebPreloadedFamilyRow("이야기 게시판", 5214, 184786, "이야기 게시판"),
  ]],
  ["소녀전선", [
    ruliwebPreloadedFamilyRow("소녀전선 시리즈", 4382, 186571, "역붕괴"),
    ruliwebPreloadedFamilyRow("소전 게시판", 4382, 184404, "소전 게시판"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4382, 300143, "유머 게시판"),
  ]],
  ["소울워커 루리웹", [
    ruliwebPreloadedFamilyRow("소울워커", 493, 179945, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("커뮤니티", 493, 300143, "유머 게시판"),
  ]],
  ["슈퍼로봇대전", [
    ruliwebPreloadedFamilyRow("SRW 커뮤니티", 511, 300366, "아수라장"),
    ruliwebPreloadedFamilyRow("슈로대 모바일", 511, 183793, "슈로대 모바일"),
  ]],
  ["아이돌 마스터", [
    ruliwebPreloadedFamilyRow("모바일 아이마스", 3518, 183740, "모바일 아이마스"),
    ruliwebPreloadedFamilyRow("커뮤니티", 3518, 300548, "자유 게시판"),
    ruliwebPreloadedFamilyRow("콘솔 아이마스", 3518, 101568, "콘솔 아이마스"),
  ]],
  ["아이온 루리웹", [
    ruliwebPreloadedFamilyRow("아이온", 5605, 101668, "아이온"),
    ruliwebPreloadedFamilyRow("아이온 2", 5605, 187107, "아이온 2"),
  ]],
  ["애니/만화책", [
    ruliwebPreloadedFamilyRow("관련 게시판", 211, 300557, "타입문"),
    ruliwebPreloadedFamilyRow("만화책/도서", 211, 300067, "만화책 / 웹툰"),
    ruliwebPreloadedFamilyRow("애니메이션", 211, 300073, "잡담 게시판"),
    ruliwebPreloadedFamilyRow("정보 게시판", 211, 300015, "애니 정보"),
  ]],
  ["에이펙스 레전드 루리웹", [
    ruliwebPreloadedFamilyRow("에이펙스 레전드", 5042, 184999, "에이펙스 레전드"),
    ruliwebPreloadedFamilyRow("정보", 5042, 300007, "뉴스"),
  ]],
  ["오버워치 루리웹", [
    ruliwebPreloadedFamilyRow("오버워치", 1476, 184032, "토론/이슈"),
    ruliwebPreloadedFamilyRow("커뮤니티", 1476, 300143, "유머 게시판"),
  ]],
  ["우마무스메 패밀리", [
    ruliwebPreloadedFamilyRow("우마무스메", 5268, 184773, "우마무스메"),
    ruliwebPreloadedFamilyRow("우마무스메 콘솔", 5268, 186546, "대감사제!"),
  ]],
  ["월드 오브 워쉽 루리웹", [
    ruliwebPreloadedFamilyRow("병과 게시판", 4804, 300673, "구축함"),
    ruliwebPreloadedFamilyRow("자료실", 4804, 300671, "워쉽 자료실"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4804, 181269, "이야기 게시판"),
  ]],
  ["월드 오브 워크래프트 루리웹", [
    ruliwebPreloadedFamilyRow("WOW 게시판", 4454, 100159, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("던전/PVP", 4454, 300581, "레이드"),
    ruliwebPreloadedFamilyRow("블리자드 게임", 4454, 101296, "스타크래프트"),
    ruliwebPreloadedFamilyRow("서버 게시판", 4454, 300701, "아즈샤라"),
    ruliwebPreloadedFamilyRow("자료실", 4454, 300593, "애드온 자료실"),
    ruliwebPreloadedFamilyRow("직업 게시판", 4454, 300625, "전사"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4454, 300143, "유머 게시판"),
  ]],
  ["월드 오브 탱크 루리웹", [
    ruliwebPreloadedFamilyRow("자료실", 4805, 300672, "월탱 자료실"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4805, 178322, "이야기 게시판"),
  ]],
  ["취미갤", [
    ["PC 갤러리", "hobby_320019", "PC조립 부품", "/hobby/board/320019"],
    ["게임", "hobby_300577", "리뷰&스토리", "/hobby/board/300577"],
  ]],
  ["취미갤 / 교통", [
    ["자전거", "hobby_320109", "정보 게시판", "/hobby/board/320109"],
  ]],
  ["취미갤", [
    ["레고/프라/피규어", "hobby_300118", "레고/옥스포드", "/hobby/board/300118"],
    ["방사진/음식/패션", "hobby_300116", "방사진/사무실", "/hobby/board/300116"],
  ]],
  ["취미갤 / 휴대폰", [
    ["AV", "hobby_300098", "디카 기기", "/hobby/board/300098"],
  ]],
  ["칼리스토 프로토콜 패밀리", [
    ruliwebPreloadedFamilyRow("[리댁티드]", 5428, 186767, "[리댁티드]"),
    ruliwebPreloadedFamilyRow("칼리스토 프로토콜", 5428, 186203, "칼리스토 프로토콜"),
  ]],
  ["캡콤 게임 루리웹", [
    ruliwebPreloadedFamilyRow("격투게임", 508, 182821, "스트리트파이터"),
    ruliwebPreloadedFamilyRow("바이오하자드", 508, 187029, "바하 레퀴엠"),
    ruliwebPreloadedFamilyRow("액션게임", 508, 100261, "록맨"),
  ]],
  ["커뮤니티", [
    ["정보 게시판", "community_300018", "사정게", "/community/board/300018"],
  ]],
  ["콜 오브 듀티 루리웹", [
    ruliwebPreloadedFamilyRow("COD 워존", 4916, 185340, "COD 워존"),
    ruliwebPreloadedFamilyRow("콜 오브 듀티", 4916, 100370, "콘솔 게시판"),
  ]],
  ["테일즈 시리즈", [
    ruliwebPreloadedFamilyRow("시리즈 게시판", 516, 185755, "어라이즈"),
  ]],
  ["팀 닌자 루리웹", [
    ruliwebPreloadedFamilyRow("로닌/와룡/인왕", 5455, 186534, "로닌"),
    ruliwebPreloadedFamilyRow("인왕 3", 5455, 186940, "인왕 3"),
    ruliwebPreloadedFamilyRow("팀 닌자", 5455, 101777, "DOA"),
  ]],
  ["파이널 판타지 루리웹", [
    ruliwebPreloadedFamilyRow("외전", 514, 186412, "에버크라이시스"),
    ruliwebPreloadedFamilyRow("정규", 514, 185327, "파판 7 RE"),
  ]],
  ["패스 오브 엑자일 루리웹", [
    ruliwebPreloadedFamilyRow("POE", 5076, 181745, "POE"),
    ruliwebPreloadedFamilyRow("POE 2", 5076, 186769, "POE 2"),
  ]],
  ["포켓몬스터 루리웹", [
    ruliwebPreloadedFamilyRow("WIFI 통신", 515, 300390, "통신 게시판"),
    ruliwebPreloadedFamilyRow("레전드 Z-A", 515, 185923, "레전드 Z-A"),
    ruliwebPreloadedFamilyRow("스칼렛/바이올렛", 515, 184030, "스칼렛/바이올렛"),
    ruliwebPreloadedFamilyRow("커뮤니티", 515, 300389, "자유 게시판"),
    ruliwebPreloadedFamilyRow("포켓몬 외전", 515, 187190, "포코피아"),
  ]],
  ["폴아웃 루리웹", [
    ruliwebPreloadedFamilyRow("커뮤니티", 4979, 300143, "유머 게시판"),
    ruliwebPreloadedFamilyRow("폴아웃 게시판", 4979, 184906, "이야기 게시판"),
  ]],
  ["프라모델", [
    ruliwebPreloadedFamilyRow("", 232, 300079, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("정보 게시판", 232, 300016, "유저 정보"),
  ]],
  ["프롬 소프트웨어 루리웹", [
    ruliwebPreloadedFamilyRow("블러드 본", 4892, 182048, "블러드 본"),
    ruliwebPreloadedFamilyRow("세키로", 4892, 184765, "세키로"),
    ruliwebPreloadedFamilyRow("소울 시리즈", 4892, 183787, "다크 소울 3"),
    ruliwebPreloadedFamilyRow("아머드 코어", 4892, 101995, "아머드 코어"),
    ruliwebPreloadedFamilyRow("엘든 링", 4892, 185738, "엘든 링"),
  ]],
  ["피규어", [
    ruliwebPreloadedFamilyRow("관련 갤러리", 242, 300118, "레고/옥스포드"),
    ruliwebPreloadedFamilyRow("정보 게시판", 242, 300017, "유저 정보"),
    ruliwebPreloadedFamilyRow("피규어 게시판", 242, 300085, "이야기 게시판"),
  ]],
  ["피파온라인 루리웹", [
    ruliwebPreloadedFamilyRow("모바일 게임", 4749, 186552, "FC 모바일"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4749, 101249, "이야기 게시판"),
    ruliwebPreloadedFamilyRow("콘솔게임", 4749, 186425, "FC 게시판"),
  ]],
  ["하스스톤 루리웹", [
    ruliwebPreloadedFamilyRow("커뮤니티", 3110, 300143, "유머 게시판"),
    ruliwebPreloadedFamilyRow("하스스톤", 3110, 180930, "이야기 게시판"),
  ]],
  ["히오스 루리웹", [
    ruliwebPreloadedFamilyRow("뉴스/정보", 4527, 300007, "뉴스 게시판"),
    ruliwebPreloadedFamilyRow("커뮤니티", 4527, 300143, "유머 게시판"),
    ruliwebPreloadedFamilyRow("히오스 게시판", 4527, 181429, "이야기 게시판"),
  ]],
]);

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
  "hasFullBoardCatalog": true,
  "supportsBoardCatalogSync": true,
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
function ruliwebParseComments(doc, postUrl) {
    var rows = allNodes(doc, SITE.selectors.commentRows);
    var comments = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var contentRoot = firstNode(row, SITE.selectors.commentContent);
        var content = parseDetails(contentRoot, postUrl);
        if (!content || content.length === 0) {
            var rawText = firstText(row, SITE.selectors.commentContent);
            if (rawText) content = [{ type: "text", value: rawText }];
        }
        if (!content || content.length === 0) continue;

        var likeCount = hideZeroCount(parseCount(firstText(row, SITE.selectors.commentLikeCount)));
        comments.push({
            link: postUrl + "#comment-" + (i + 1),
            author: firstAuthorText(row, SITE.selectors.commentAuthor),
            avatar: imageUrlFromNode(firstNode(row, SITE.selectors.commentAvatar || SITE.selectors.commentAuthor), postUrl),
            content: content,
            date: firstText(row, SITE.selectors.commentDate),
            likeCount: likeCount,
            dislikeCount: "",
            level: detectCommentLevel(row),
            menus: [],
            hotCount: toInt(likeCount, 0),
            coldCount: toInt(likeCount, 0)
        });
    }
    return comments;
}
SITE.parseComments = function (doc, postUrl) {
    return ruliwebParseComments(doc, postUrl);
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
    description: "Unofficial Ruliweb extension",
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
    var linkSelectors = selectorList("listLink", LIST_LINK_SELECTORS);
    var titleSelectors = selectorList("listTitle", LIST_TITLE_SELECTORS);
    var commentCountSelectors = selectorList("listCommentCount", LIST_COMMENT_COUNT_SELECTORS);
    var authorSelectors = selectorList("listAuthor", LIST_AUTHOR_SELECTORS);
    var likeCountSelectors = selectorList("listLikeCount", LIST_LIKE_COUNT_SELECTORS);
    var viewCountSelectors = selectorList("listViewCount", LIST_VIEW_COUNT_SELECTORS);
    var dateSelectors = selectorList("listDate", LIST_DATE_SELECTORS);
    var categorySelectors = selectorList("listCategory", LIST_CATEGORY_SELECTORS);
    var items = [];
    var seen = {};
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var subjectCell = firstNode(row, [".subject"]);
        var linkNode = firstNode(row, linkSelectors);
        var link = ensureAbsoluteUrl(attrOf(linkNode, "href"), baseUrl);
        if (!isAllowedListLink(link, LIST_LINK_ALLOW_PATTERNS)) continue;
        var titleNode = firstNode(row, titleSelectors);
        var title = firstNonEmpty([
            textOfNodeWithoutSelectors(titleNode, commentCountSelectors),
            textOfNodeWithoutSelectors(linkNode, commentCountSelectors),
            textOf(subjectCell)
        ]);
        if (!title) continue;
        var commentNode = firstNode(row, commentCountSelectors);
        var authorCell = firstNode(row, authorSelectors);
        var likeCell = firstNode(row, likeCountSelectors);
        var viewCell = firstNode(row, viewCountSelectors);
        var dateCell = firstNode(row, dateSelectors);
        var categoryCell = firstNode(row, categorySelectors);
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
    var linkSelectors = selectorList("listLink", LIST_LINK_SELECTORS);
    var titleSelectors = selectorList("listTitle", LIST_TITLE_SELECTORS);
    var commentCountSelectors = selectorList("listCommentCount", LIST_COMMENT_COUNT_SELECTORS);
    var viewCountSelectors = selectorList("listViewCount", LIST_VIEW_COUNT_SELECTORS);
    var likeCountSelectors = selectorList("listLikeCount", LIST_LIKE_COUNT_SELECTORS);
    var authorSelectors = selectorList("listAuthor", LIST_AUTHOR_SELECTORS);
    var avatarSelectors = selectorList("listAvatar", LIST_AVATAR_SELECTORS);
    var imageSelectors = selectorList("listImage", LIST_IMAGE_SELECTORS);
    var categorySelectors = selectorList("listCategory", LIST_CATEGORY_SELECTORS);
    var dateSelectors = selectorList("listDate", LIST_DATE_SELECTORS);
    var linkNode = firstNode(row, linkSelectors);
    var titleNode = firstNode(row, titleSelectors);
    var tableRowItem = extractTableRowItem(row, baseUrl);
    if (tableRowItem) return tableRowItem;
    var link = extractListLink(row, baseUrl, linkSelectors, LIST_LINK_ALLOW_PATTERNS);
    if (!link) return null;

    var title = firstNonEmpty([
        textOfNodeWithoutSelectors(titleNode, commentCountSelectors),
        textOf(linkNode),
        textOf(row)
    ]);
    if (!title) return null;

    var commentCount = hideZeroCount(parseCount(firstText(row, commentCountSelectors)));
    var viewCount = parseCount(firstText(row, viewCountSelectors));
    var likeCount = hideZeroCount(parseCount(firstText(row, likeCountSelectors)));
    var author = firstAuthorText(row, authorSelectors);
    var category = firstText(row, categorySelectors);
    var avatarSourceSelectors = avatarSelectors.length > 0 ? avatarSelectors : authorSelectors;
    var avatar = imageUrlFromNode(firstNode(row, avatarSourceSelectors), baseUrl);
    var mediaUrl = imageUrlFromNode(firstNode(row, imageSelectors), baseUrl);
    var types = [];
    if (mediaUrl) types.push("image");

    return {
        link: normalizeUrl(link) || link,
        title: title,
        author: author,
        avatar: avatar,
        date: firstText(row, dateSelectors),
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
