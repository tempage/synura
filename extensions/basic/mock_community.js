// @ts-nocheck
/**
 * Mock Community Extension for Clean Screenshots & Store Listings
 * Realistic human-written community posts across 21 global languages without any real personal data or brand names.
 */

const SYNURA = {
  name: "Community Hub",
  version: 1.0,
  api: 0,
  icon: "emoji:💬",
  description: "Clean reader mode for online forums and communities without clutter.",
  license: "Apache-2.0",
  get main() {
    return handler;
  }
};

const LANG_OPTIONS = [
  "English",
  "한국어",
  "日本語",
  "繁體中文",
  "简体中文",
  "Deutsch",
  "Français",
  "Español",
  "Italiano",
  "Português",
  "Русский",
  "Polski",
  "Türkçe",
  "ไทย",
  "Tiếng Việt",
  "Bahasa Indonesia",
  "हिन्दी",
  "বাংলা",
  "العربية",
  "فارسی",
  "עברית"
];

const NAME_TO_LOCALE = {
  "English": "en",
  "한국어": "ko",
  "日本語": "ja",
  "繁體中文": "zh_TW",
  "简体中文": "zh_CN",
  "Deutsch": "de",
  "Français": "fr",
  "Español": "es",
  "Italiano": "it",
  "Português": "pt",
  "Русский": "ru",
  "Polski": "pl",
  "Türkçe": "tr",
  "ไทย": "th",
  "Tiếng Việt": "vi",
  "Bahasa Indonesia": "id",
  "हिन्दी": "hi",
  "বাংলা": "bn",
  "العربية": "ar",
  "فارسی": "fa",
  "עברית": "he"
};

const LOCALE_ALIASES = {
  "en_US": "en",
  "ko_KR": "ko",
  "ja_JP": "ja",
  "zh_CN": "zh_CN",
  "zh_TW": "zh_TW",
  "de_DE": "de",
  "fr_FR": "fr",
  "es_ES": "es",
  "es_419": "es",
  "it_IT": "it",
  "pt_BR": "pt",
  "pt_PT": "pt",
  "ru_RU": "ru",
  "pl_PL": "pl",
  "tr_TR": "tr",
  "th_TH": "th",
  "vi_VN": "vi",
  "id_ID": "id",
  "hi_IN": "hi",
  "bn_BD": "bn",
  "ar_SA": "ar",
  "fa_IR": "fa",
  "he_IL": "he"
};

const I18N = {
  "en": {
    "boardTitle": "General Community",
    "menuGallery": "Photo Gallery",
    "galleryTitle": "Photo Gallery",
    "menuMainBoard": "General Board",
    "menuSettings": "Settings",
    "settingsTitle": "Settings",
    "settingsMessage": "Configure community preferences and display language",
    "langLabel": "Language (언어 선택)",
    "btnSave": "Save",
    "btnCancel": "Cancel",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "RV",
        "memo": "OLED Gear",
        "author": "DeskNomad",
        "title": "Honest 1-week review of this 14\" portable OLED monitor (Photos)",
        "content": [
          {
            "type": "text",
            "value": "Picked up one of those budget 14-inch portable OLED monitors during the seasonal sale. It took about two weeks to arrive, and I've been daily-driving it as a secondary display for a week now."
          },
          {
            "type": "text",
            "value": "Honestly, I didn't expect much given the price tag—just wanted an extra screen for travel that I wouldn't baby too much.\nOpening the box, though, build quality caught me off guard. CNC aluminum chassis, nice rigid hinges, feels surprisingly solid."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Panel & Picture Quality\nThe OLED panel is the real deal. Deep inky blacks, vibrant contrast, and side-by-side with my laptop, text is razor crisp without color fringing. Great for dark-mode code editors and late-night streaming."
          },
          {
            "type": "text",
            "value": "2. Portability & Single-cable Setup\nWeighs just under 600g and slips right into my backpack's sleeve.\nSingle Type-C cable handling both video pass-through and power is a game changer. Super convenient when working out of cafes or hotel desks without juggling bulky wall adapters."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. The Gripes\nIt's a glossy panel, so if there's an overhead light directly behind you, reflections can get pretty annoying. Thinking about slapping on a matte anti-glare film.\nAlso, the built-in speakers are essentially tin cans. Keep your headphones handy haha."
          },
          {
            "type": "text",
            "value": "Bottom line: for anyone looking for a sleek, lightweight secondary display on the go, this is an easy recommendation."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "LaptopFan",
            "content": "Nice writeup! Does it power directly off laptop USB-C without flickering when brightness is pushed all the way up?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "DeskNomad",
            "content": "Yep, tested at 100% brightness over a standard C-to-C cable and zero flickering or cutouts. Steady as a rock."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "AudioPhile99",
            "content": "Glossy screens in bright cafes are tough, but at that price for OLED, hard to complain."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "CleanDesk",
            "content": "That desk mat in the second photo looks super clean. Mind sharing where you got it?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "DeskNomad",
            "content": "Just a generic dark gray felt desk pad from an online shop, cost around $12!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "HandheldGamer",
            "content": "Can you hook up a handheld gaming console directly without a dock?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "DeskNomad",
            "content": "Needs external power plugged into the monitor's second port for handhelds, the console alone doesn't push enough juice."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "OP",
        "memo": "Mini PC",
        "author": "MinimalSetup",
        "title": "One month after ditching my bulky desktop tower for a mini PC"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "QA",
        "memo": "Home Cafe",
        "author": "EspressoShot",
        "title": "Manual coffee grinder recommendations for everyday home brewing?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "GD",
        "memo": "Battery Life",
        "author": "VoltCraft",
        "title": "Common everyday habits that quietly ruin your device battery health"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "PH",
        "memo": "Weekend Ride",
        "author": "TwoWheels",
        "title": "Weekend riverside bike ride, the autumn weather was incredible"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "TL",
        "memo": "Markdown",
        "author": "SyntaxHighlight",
        "title": "Lightweight open-source markdown editors for developers & writers"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "QA",
        "memo": "65W GaN",
        "author": "CableTidy",
        "title": "Looking for a grounded 3-port 65W GaN wall charger with good thermals"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "KB",
        "memo": "Silent Switch",
        "author": "KeyClack",
        "title": "Switched from tactile mechanical switches to silent linears, night and day difference lol"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "DK",
        "memo": "Monitor Arms",
        "author": "WorkspaceCraft",
        "title": "Mounted monitor arms over the weekend and freed up so much desk space"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "FD",
        "memo": "One-Pan Pasta",
        "author": "PanCook",
        "title": "Quick 15-minute one-pan garlic butter pasta for lazy weekend lunches"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "TP",
        "memo": "CLI Tips",
        "author": "ShellCraft",
        "title": "Everyday CLI terminal shortcuts and aliases that boost my productivity",
        "content": [
          {
            "type": "text",
            "value": "Spending hours in the terminal every day has led me to optimize my workflow with a few essential shortcuts and aliases."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Reverse history search\n2. ctrl + a / ctrl + e: Move to beginning/end of line\n3. alias gs=\"git status\", ga=\"git add\"\n\nWhat are your favorite daily productivity shortcuts?"
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "BashMaster",
            "date": "11/09 10:22",
            "content": "ctrl + w to delete word backward is an absolute lifesaver.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "DevOpsLife",
            "date": "11/09 10:45",
            "content": "Highly recommend zsh-autosuggestions if you use zsh!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "PH",
        "memo": "Autumn Walk",
        "author": "MapleLeaves",
        "title": "Morning autumn walk around the local lake park, crisp fresh air (Photos)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Took a brisk morning walk around the lake park today. The rising mist over the water paired with the autumn colors was breathtaking."
          },
          {
            "type": "text",
            "value": "Shot this on my phone with zero filters. Starting the day with fresh mountain air always sets the right tone."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "MorningWalker",
            "date": "11/09 08:52",
            "content": "That morning mist gives it such a serene atmosphere!",
            "likeCount": 15,
            "types": []
          },
          {
            "id": "c-12-2",
            "author": "NatureLens",
            "date": "11/09 09:10",
            "content": "Stunning shot, love the peaceful composition.",
            "likeCount": 8,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Golden sunset over calm ocean waves",
        "author": "OceanBreeze",
        "category": "Nature"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Sunlit minimal Scandinavian living space",
        "author": "NordicLiving",
        "category": "Interior"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Weekend pour-over coffee with close friends",
        "author": "BeanRoaster",
        "category": "Coffee"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Rainy afternoon reflections and warm bokeh",
        "author": "RainyMood",
        "category": "Mood"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Artisan handcrafted ceramic plate collection",
        "author": "ClayCraft",
        "category": "Craft"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Misty river dawn nestled in granite valley",
        "author": "AlpineWander",
        "category": "Landscape"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Blue hour twilight across metropolitan avenue",
        "author": "UrbanShutter",
        "category": "City"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Lush Monstera leaf unfurling in sunlight",
        "author": "PlantLovers",
        "category": "Plant"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Cozy botanical cafe corner filled with greens",
        "author": "CafeStories",
        "category": "Cafe"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Majestic snow-capped alpine mountain range",
        "author": "SummitPeak",
        "category": "Summit"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Freshly baked rustic artisan sourdough loaves",
        "author": "ArtisanBaker",
        "category": "Baking"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Andromeda galaxy glowing in deep night sky",
        "author": "StarGazer",
        "category": "Astro"
      }
    ]
  },
  "ko": {
    "boardTitle": "자유게시판",
    "menuGallery": "사진 갤러리",
    "galleryTitle": "사진 갤러리",
    "menuMainBoard": "일반 게시판",
    "menuSettings": "설정",
    "settingsTitle": "환경설정",
    "settingsMessage": "커뮤니티 언어 및 표시 옵션을 설정합니다.",
    "langLabel": "언어 선택 (Language)",
    "btnSave": "저장",
    "btnCancel": "취소",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "후기",
        "memo": "OLED 디스플레이",
        "author": "닉네임뭐하지",
        "title": "직구 14인치 포터블 OLED 모니터 일주일 굴려본 솔직 후기 (사진)",
        "content": [
          {
            "type": "text",
            "value": "지난달 할인 세일 때 특가로 뜬 14인치 포터블 OLED 모니터 드디어 받아서 일주일 정도 써봤습니다."
          },
          {
            "type": "text",
            "value": "사실 저가형 직구 디스플레이라 큰 기대 안 하고 서브용으로 막 굴릴 생각이었거든요.\n근데 박스 까보고 첫인상은 어? 생각보다 마감이 꽤 괜찮네? 였습니다. 알루미늄 하우징에 힌지도 탄탄합니다."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. 패널 및 화질\nOLED 패널이라 그런지 노트북 옆에 나란히 둬도 암부 표현이나 색감이 전혀 안 꿀립니다.\n글자 가독성도 쨍하고 다크모드 코딩이나 영상 볼 때 확실히 체감이 크네요."
          },
          {
            "type": "text",
            "value": "2. 휴대성이랑 연결성\n무게가 600g 안 되는데 백팩 노트북 슬리브에 쏙 들어갑니다.\nC타입 케이블 하나로 화면 출력이랑 전원 공급이 동시에 되는 게 진짜 최고입니다.\n카페나 출장지에서 콘센트 찾느라 헤맬 필요 없이 바로 듀얼 모니터 세팅이 끝나요."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. 굳이 꼽는 단점\n글레어 패널이라 등 뒤에 형광등이나 햇빛이 있으면 반사가 좀 거슬립니다. 저반사 AR 필름 하나 사서 붙일까 고민 중입니다.\n그리고 내장 스피커는 그냥 소리가 난다 수준이라 기대는 접으시는 게 좋습니다 ㅋㅋㅋ"
          },
          {
            "type": "text",
            "value": "결론\n서브 모니터 필요하신 분들은 가볍게 휴대용으로 쓰기에 후회 안 할 듯합니다."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "노트북조아",
            "content": "오 저도 이거 장바구니에 넣어뒀는데 노트북 C타입 직결 잘 되나요? 화면 깜빡임 없어요?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "닉네임뭐하지",
            "content": "네네 번들 C to C 꽂아서 쓰는데 깜빡임 전혀 없습니다. 밝기 최대로 올려도 안정적이에요."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "지름신강림",
            "content": "글레어인 게 살짝 걸리긴 하네요 ㅠㅠ 그래도 OLED에 이 가격이면 무지성 탑승할 만하네요."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "미니멀라이프",
            "content": "데스크 셋업이 엄청 깔끔하시네요! 두 번째 사진에 밑에 깔린 펠트 패드 정보 알 수 있을까요?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "닉네임뭐하지",
            "content": "온라인 쇼핑몰에서 펠트 장패드 검색하면 나오는 1만원대 제품입니다 ㅎㅎ"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "게임매니아",
            "content": "혹시 휴대용 게임기 콘솔도 독 없이 바로 직결되나요?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "닉네임뭐하지",
            "content": "게임기는 전력 부족해서 보조배터리나 충전기를 모니터 두 번째 포트에 물려줘야 화면 나옵니다!"
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "잡담",
        "memo": "미니PC",
        "author": "코딩노예",
        "title": "데스크탑 처분하고 미니PC로 넘어온 지 한 달째 체감"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "질문",
        "memo": "홈카페",
        "author": "아메리카노",
        "title": "집에서 원두 갈아드시는 분들 그라인더 어떤 거 쓰시나요?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "정보",
        "memo": "배터리 수명",
        "author": "배터리장인",
        "title": "전자기기 리튬 배터리 수명 갉아먹는 대표적인 습관들"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "사진",
        "memo": "주말 라이딩",
        "author": "두바퀴",
        "title": "주말에 한강 자전거 라이딩 다녀왔는데 날씨 장난 아니었네요"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "추천",
        "memo": "마크다운",
        "author": "깃헙마스터",
        "title": "개발용으로 가볍게 쓰기 좋은 오픈소스 마크다운 툴 정리"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "질문",
        "memo": "65W GaN",
        "author": "찌릿찌릿",
        "title": "65W GaN 충전기 3포트짜리 중에 접지형 쓸만한 거 있을까요"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "후기",
        "memo": "저소음 스위치",
        "author": "타건러버",
        "title": "기계식 키보드 갈축 쓰다가 저소음 스위치로 바꿨는데 신세계네요 ㅋㅋㅋ"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "자랑",
        "memo": "모니터 암",
        "author": "방구석인테리어",
        "title": "방 구조 바꾸면서 모니터 암 달았는데 책상이 두 배는 넓어짐"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "요리",
        "memo": "원팬 파스타",
        "author": "자취9단",
        "title": "주말 점심에 간단하게 해먹기 좋은 원팬 파스타 레시피"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "팁",
        "memo": "터미널 꿀팁",
        "author": "쉘스크립터",
        "title": "매일 쓰는 CLI 터미널 생산성 높여주는 유용한 단축키 & alias 모음",
        "content": [
          {
            "type": "text",
            "value": "터미널 작업을 많이 하다 보니 손에 익어서 작업 속도를 몇 배로 올려준 alias 설정들과 단축키 몇 개 공유해 봅니다."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: 히스토리 역방향 검색\n2. ctrl + a / ctrl + e: 줄 맨 앞/뒤로 이동\n3. alias gs=\"git status\", ga=\"git add\"\n\n다들 자주 쓰시는 꿀팁 있으면 댓글로 공유해 주세요!"
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "터미널장인",
            "date": "11/09 10:22",
            "content": "ctrl + w 단어 단위 삭제도 손에 익으면 정말 편합니다 ㅎㅎ",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "리눅스조아",
            "date": "11/09 10:45",
            "content": "zsh 쓰시면 zsh-autosuggestions 플러그인 무조건 추천합니다!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "사진",
        "memo": "가을 산책",
        "author": "단풍놀이",
        "title": "아침 일찍 동네 호수공원 산책하면서 찍어본 단풍 사진입니다 (사진)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "주말 아침 쌀쌀한 공기 마시며 호수공원 한 바퀴 돌았는데 물안개랑 어우러진 풍경이 너무 멋지더라고요."
          },
          {
            "type": "text",
            "value": "스마트폰 기본 카메라로 찍었는데도 색감이 가을 느낌 물씬 나서 기분 좋게 하루 시작했습니다."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "산책매니아",
            "date": "11/09 08:52",
            "content": "물안개 피어오르는 게 운치 있네요! 힐링하고 갑니다.",
            "likeCount": 15,
            "types": []
          },
          {
            "id": "c-12-2",
            "author": "가을감성",
            "date": "11/09 09:10",
            "content": "사진 분위기가 너무 평화롭고 좋아요 ㅎㅎ",
            "likeCount": 8,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "황금빛 노을과 부서지는 잔잔한 파도",
        "author": "바다바람",
        "category": "자연"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "따스한 오후 햇살이 머무는 미니멀 거실",
        "author": "노르딕홈",
        "category": "인테리어"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "주말 브런치에 함께 마시는 핸드드립 커피",
        "author": "원두마스터",
        "category": "커피"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "비 내리는 창가의 몽환적인 보케 빛망울",
        "author": "비오는날",
        "category": "감성"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "손끝 정성으로 빚어낸 핸드메이드 도자기",
        "author": "흙과불",
        "category": "공예"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "물안개 짙게 피어오르는 고요한 아침 계곡",
        "author": "산길산책",
        "category": "풍경"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "도심 빌딩 숲에 내려앉은 푸른빛 황혼",
        "author": "도시여행자",
        "category": "도시"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "햇살 머금고 싱그럽게 돋아난 몬스테라 잎",
        "author": "초록이들",
        "category": "식물"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "초록 식물들로 가득한 아늑한 식물 카페",
        "author": "카페거리",
        "category": "카페"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "만년설로 뒤덮인 웅장한 알프스 산맥",
        "author": "설산등반",
        "category": "산악"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "오늘 아침 갓 구워낸 바삭한 천연발효빵",
        "author": "사워도우",
        "category": "베이킹"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "칠흑 같은 밤하늘을 수놓은 안드로메다 은하",
        "author": "별헤는밤",
        "category": "우주"
      }
    ]
  },
  "ja": {
    "boardTitle": "総合コミュニティ",
    "menuGallery": "写真ギャラリー",
    "galleryTitle": "写真ギャラリー",
    "menuMainBoard": "一般掲示板",
    "menuSettings": "設定",
    "settingsTitle": "設定",
    "settingsMessage": "コミュニティの言語と表示を設定します。",
    "langLabel": "言語設定 (Language)",
    "btnSave": "保存",
    "btnCancel": "キャンセル",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "レビュー",
        "memo": "OLEDモニター",
        "author": "デスクの旅人",
        "title": "14インチ有機ELモバイルモニターを1週間使ってみた本音レビュー（写真あり）",
        "content": [
          {
            "type": "text",
            "value": "先日のセールで手頃な14インチ有機EL（OLED）モバイルモニターを購入しました。注文から約2週間で手元に届き、サブモニターとして1週間ほど毎日使ってみました。"
          },
          {
            "type": "text",
            "value": "価格が手頃だったのでそこまで期待していなかったのですが、開封した瞬間に良い意味で裏切られました。アルミ削り出しのボディで剛性感があり、ヒンジもしっかりしています。"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. パネルと画質\nさすが有機EL、黒の沈み込みとコントラストが素晴らしいです。ノートPCの横に並べても文字がくっきりと見やすく、ダークモードのエディタや動画鑑賞に最適です。"
          },
          {
            "type": "text",
            "value": "2. 携帯性とケーブル1本での接続\n重さは約600gで、バックパックのPCスリーブにすっきり収まります。\nType-Cケーブル1本で映像出力と給電が同時にできるのが本当に快適。カフェや出張先でもすぐにデュアル画面環境が作れます。"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. 気になった点\nグレア（光沢）パネルなので、背後に照明や日光があると映り込みが気になります。低反射フィルムを貼るか検討中です。\nまた内蔵スピーカーはおまけ程度なので、イヤホン必須です（笑）。"
          },
          {
            "type": "text",
            "value": "総評\n手軽に持ち運べる高品質なサブモニターを探している方には自信を持っておすすめできます。"
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "ノートPC派",
            "content": "詳しいレビュー助かります！ノートPCからのType-C給電だけで輝度最大でもチラつき等ありませんか？"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "デスクの旅人",
            "content": "付属のC to Cケーブルで輝度100%にして試しましたが、チラつきや途切れは一切なく安定して動作しています！"
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "音響マニア",
            "content": "カフェでの映り込みは少し気になりそうですが、この価格でOLEDが買えるなら十分納得ですね。"
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "ミニマル部屋",
            "content": "デスク周りがとてもすっきりしていますね！2枚目の写真に写っているフェルトマットはどこの製品ですか？"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "デスクの旅人",
            "content": "通販サイトで1,500円程度で購入した汎用のダークグレーフェルトデスクマットです！"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "携帯ゲーム好き",
            "content": "ポータブルゲーム機をドックなしで直接繋ぐことも可能でしょうか？"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "デスクの旅人",
            "content": "ゲーム機本体からの給電だけだと電力が足りないので、モニター側の2つ目のポートに充電器を挿せば映りますよ！"
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "雑談",
        "memo": "ミニPC",
        "author": "コード職人",
        "title": "巨大なデスクトップPCを手放してミニPCに移行して1ヶ月の感想"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "質問",
        "memo": "おうちカフェ",
        "author": "珈琲タイム",
        "title": "自宅でハンドドリップコーヒーを淹れるのにおすすめのミルはありますか？"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "知識",
        "memo": "バッテリー寿命",
        "author": "充電マニア",
        "title": "リチウムイオン電池の寿命を急速に縮めてしまう代表的なNG習慣"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "写真",
        "memo": "週末ライド",
        "author": "二輪ライダー",
        "title": "週末に川沿いを自転車でサイクリング、秋晴れの最高の天気でした（写真）"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "紹介",
        "memo": "マークダウン",
        "author": "ギーク開発者",
        "title": "開発や執筆に軽く使えるおすすめのオープンソースMarkdownエディタまとめ"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "質問",
        "memo": "65W GaN",
        "author": "ケーブル整理人",
        "title": "3ポート搭載の65W GaN充電器でアース付きの使いやすい製品はありますか？"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "レビュー",
        "memo": "静音スイッチ",
        "author": "キー打鍵好き",
        "title": "メカニカルキーボードを茶軸から静音リニア軸に変えたら別世界だった件"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "自慢",
        "memo": "モニターアーム",
        "author": "デスクレイアウト",
        "title": "部屋の模様替えでモニターアームを取り付けたらデスクが倍広く使えるようになった"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "料理",
        "memo": "ワンパンパスタ",
        "author": "自炊男子",
        "title": "週末のランチに15分でパパッと作れるワンパンガーリックバターパスタ"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "技",
        "memo": "端末活用法",
        "author": "シェル職人",
        "title": "日々のCLIターミナル作業効率を上げる便利なエイリアス＆ショートカットまとめ",
        "content": [
          {
            "type": "text",
            "value": "ターミナルでの開発作業を快適にするために、普段重宝しているエイリアスとショートカットをまとめました。"
          },
          {
            "type": "text",
            "value": "1. ctrl + r: 履歴のインクリメンタル検索\n2. ctrl + a / ctrl + e: 行頭・行末へのジャンプ\n3. alias gs=\"git status\", ga=\"git add\"\n\n皆様のおすすめ設定があればぜひ教えてください！"
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "端末愛好家",
            "date": "11/09 10:22",
            "content": "ctrl + w の単語単位削除も慣れると手放せませんね。",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "ペンギン好き",
            "date": "11/09 10:45",
            "content": "zshならzsh-autosuggestionsが必須プラグインです！",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "写",
        "memo": "秋の散策",
        "author": "紅葉巡り",
        "title": "早朝の湖畔公園を散歩しながら撮影した鮮やかな紅葉（写真）",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "澄んだ朝の空気を吸いながら湖畔の公園を歩いてきました。水面に立ち込める朝霧と秋のコントラストがとても綺麗でした。"
          },
          {
            "type": "text",
            "value": "スマートフォンの標準カメラでの撮影ですが、秋の深まりを感じる素敵な景色に出会えました。"
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "朝活派",
            "date": "11/09 08:52",
            "content": "朝霧の幻想的な雰囲気が素晴らしいですね！",
            "likeCount": 15,
            "types": []
          },
          {
            "id": "c-12-2",
            "author": "フォト散歩",
            "date": "11/09 09:10",
            "content": "とても心が洗われる一枚ですね。癒やされます。",
            "likeCount": 8,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "黄金色の夕暮れと打ち寄せる穏やかな波",
        "author": "海風",
        "category": "自然"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "柔らかな日差しが差し込む北欧風リビング",
        "author": "北欧リビング",
        "category": "インテリア"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "週末のブランチに楽しむ淹れたてドリップ珈琲",
        "author": "豆焙煎士",
        "category": "珈琲"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "雨降る午後の窓辺にきらめく温かなボケ光",
        "author": "雨模様",
        "category": "風情"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "手仕事の温もりが伝わる作家ものの陶器皿",
        "author": "陶工房",
        "category": "陶芸"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "朝霧が立ち込める静寂の渓谷と清流",
        "author": "渓谷散策",
        "category": "風景"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "夕暮れの青に染まる大都市の高層ビル群",
        "author": "都会のスナップ",
        "category": "都市"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "光を浴びて瑞々しく開くモンステラの新葉",
        "author": "ボタニカル",
        "category": "植物"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "緑豊かな植物に囲まれた癒しのカフェ空間",
        "author": "純喫茶",
        "category": "カフェ"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "残雪をいただく壮大なアルプスの峰々",
        "author": "高嶺の風",
        "category": "山岳"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "今朝焼き上がった香ばしい薪窯サワードウ",
        "author": "天然酵母",
        "category": "製パン"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "澄み渡る深秋の夜空に輝くアンドロメダ銀河",
        "author": "星空案内人",
        "category": "天体"
      }
    ]
  },
  "zh_TW": {
    "boardTitle": "綜合討論區",
    "menuGallery": "照片藝廊",
    "galleryTitle": "照片藝廊",
    "menuMainBoard": "綜合看板",
    "menuSettings": "設定",
    "settingsTitle": "設定",
    "settingsMessage": "設定社群偏好與顯示語言。",
    "langLabel": "語言選擇 (Language)",
    "btnSave": "儲存",
    "btnCancel": "取消",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "評測",
        "memo": "OLED螢幕",
        "author": "桌搭遊民",
        "title": "直購 14 吋便攜 OLED 螢幕一週真實評測（附照片）",
        "content": [
          {
            "type": "text",
            "value": "趁著促銷特價入手了一台 14 吋便攜 OLED 螢幕。下單後大概兩週寄達，作為筆電外接副螢幕已經連續主力使用一週了。"
          },
          {
            "type": "text",
            "value": "老實說原本沒抱太高期望，想說外出移動時能多個螢幕看扣就好。\n結果開箱時做工完全出乎意料，CNC 鋁合金外殼、轉軸阻尼感扎實，整體質感相當優異。"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. 面板與畫質表現\nOLED 面板名不虛傳，純粹深邃的黑色與極高對比度，放在筆電旁邊文字顯示細緻銳利無毛邊，拿來寫程式開暗黑模式或睡前看劇都非常享受。"
          },
          {
            "type": "text",
            "value": "2. 便攜性與一線直連\n重量不到 600g，放進後背包筆電隔層毫無壓力。\n最方便的是一條 Type-C 傳輸線即可同時解決視訊傳輸與供電，在咖啡廳或飯店書桌工作完全不用帶一堆變壓器。"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. 幾點美中不足\n鏡面螢幕設計，背後若有強光或日光照射會有倒影反射，考慮買張霧面 AR 防眩膜貼上。\n另外自帶喇叭聲音偏薄，建議還是戴耳機聽（笑）。"
          },
          {
            "type": "text",
            "value": "總結\n對常在外面跑、需要輕巧高畫質副螢幕的人來說，這款非常值得入手。"
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "筆電狂人",
            "content": "感謝詳細分享！單靠筆電 Type-C 供電，亮度開到最大會閃爍或黑屏嗎？"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "桌搭遊民",
            "content": "完全不會喔，用隨附的 C-to-C 線測試開到 100% 亮度非常穩定，無任何斷訊或閃爍。"
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "耳機發燒友",
            "content": "咖啡廳鏡面反光確實是個小缺點，但這個價位能買到 OLED 真的很香了。"
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "極簡桌面",
            "content": "桌面佈置好有質感！第二張照片底下墊的深灰毛氈墊能分享哪裡買的嗎？"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "桌搭遊民",
            "content": "網購隨便找的通用款深灰毛氈大桌墊，大概三百多台幣而已！"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "掌機玩家",
            "content": "請問能不接 Dock 底座直接連掌上型遊戲主機嗎？"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "桌搭遊民",
            "content": "掌機自帶輸出供電不足，要在螢幕第二個 Type-C 孔插充電器供電才能順利點亮！"
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "閒聊",
        "memo": "迷你主機",
        "author": "極簡工程師",
        "title": "告別笨重桌機換成迷你主機一個月後的心得體驗"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "發問",
        "memo": "居家咖啡",
        "author": "手沖愛好者",
        "title": "大家手沖咖啡日常用哪款手搖磨豆機？求推薦"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "科普",
        "memo": "電池壽命",
        "author": "電氣達人",
        "title": "日常生活中悄悄損害鋰電池壽命的幾個常見壞習慣"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "攝影",
        "memo": "週末騎行",
        "author": "雙輪騎士",
        "title": "週末河濱自行車道騎行，秋高氣爽天氣太棒了（附照片）"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "推薦",
        "memo": "Markdown",
        "author": "開源碼農",
        "title": "適合工程師與寫作者的輕量級開源 Markdown 編輯器整理"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "發問",
        "memo": "65W GaN",
        "author": "理線狂魔",
        "title": "求推薦帶接地線的三孔 65W GaN 氮化鎵充電器，發熱控制好的"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "心得",
        "memo": "靜音軸體",
        "author": "客製鍵盤迷",
        "title": "機械鍵盤從茶軸換成靜音線性軸，手感安靜程度直接升天哈哈"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "分享",
        "memo": "螢幕支架",
        "author": "書房美學",
        "title": "週末花時間上了雙螢幕支架，整張書桌瞬間空出一大半空間"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "料理",
        "memo": "一鍋到底",
        "author": "單身煮夫",
        "title": "週末中午 15 分鐘搞定的大蒜奶油一鍋到底義大利麵"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "技巧",
        "memo": "終端機秘笈",
        "author": "終端旅人",
        "title": "每天都在用的終端機 CLI 實用快捷鍵與 alias 設定整理",
        "content": [
          {
            "type": "text",
            "value": "每天都要花很多時間在終端機裡，整理幾個大幅提升打字效率的快捷鍵與 alias 分享給大家。"
          },
          {
            "type": "text",
            "value": "1. ctrl + r: 歷史指令反向搜尋\n2. ctrl + a / ctrl + e: 游標快速移至行首/行末\n3. alias gs=\"git status\", ga=\"git add\"\n\n大家平常最常用哪些指令設定呢？歡迎交流！"
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "工程師小蔡",
            "date": "11/09 10:22",
            "content": "ctrl + w 刪除前一個單詞也非常順手，推一個！",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "終端達人",
            "date": "11/09 10:45",
            "content": "強力推薦 zsh 搭配 zsh-autosuggestions 外掛，打字省時超多。",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "照片",
        "memo": "秋日漫步",
        "author": "楓葉落盡",
        "title": "清晨漫步在湖畔公園隨手拍下的金黃秋景（照片）",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "趁著週末清晨涼爽的空氣去湖畔公園散步，湖面飄著一層薄薄的晨霧，景致十分怡人。"
          },
          {
            "type": "text",
            "value": "手機隨手一拍就很美，深秋的寧靜氛圍讓人身心放鬆。"
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "早起鳥兒",
            "date": "11/09 08:52",
            "content": "晨霧繚繞的感覺好有詩意，很棒的照片！",
            "likeCount": 15,
            "types": []
          },
          {
            "id": "c-12-2",
            "author": "攝影小品",
            "date": "11/09 09:10",
            "content": "構圖很乾淨舒服，感謝分享！",
            "likeCount": 8,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "黃昏落日餘暉與平靜拍岸的金黃浪花",
        "author": "海風漫步",
        "category": "自然"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "午後暖陽灑落的簡約北歐風客廳一隅",
        "author": "北歐日和",
        "category": "居家"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "週末早午餐手沖精品咖啡的溫馨時光",
        "author": "咖啡烘焙師",
        "category": "咖啡"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "雨天午後窗邊倒映的溫暖散景光斑",
        "author": "雨季隨筆",
        "category": "心境"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "職人純手工燒製的質樸陶器餐盤系列",
        "author": "陶手作",
        "category": "陶藝"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "晨霧繚繞中的幽靜山谷與清澈溪流",
        "author": "山林旅人",
        "category": "風景"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "暮色藍調時分璀璨的繁華都會大道",
        "author": "城市街拍",
        "category": "城市"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "在晨光中舒展翠綠新葉的龜背芋盆栽",
        "author": "植感日常",
        "category": "植栽"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "被滿室盎然綠植圍繞的靜謐植感咖啡館",
        "author": "角落咖啡",
        "category": "咖啡館"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "白雪皚皚聳立天際的壯麗高山群峰",
        "author": "登高望遠",
        "category": "群山"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "今晨剛出爐外脆內軟的天然手作酸種麵包",
        "author": "手作酸種",
        "category": "烘焙"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "深邃澄澈夜空中綻放光芒的仙女座大星系",
        "author": "仰望星空",
        "category": "天文"
      }
    ]
  },
  "zh_CN": {
    "boardTitle": "综合社区",
    "menuGallery": "照片画廊",
    "galleryTitle": "照片画廊",
    "menuMainBoard": "综合版块",
    "menuSettings": "设置",
    "settingsTitle": "设置",
    "settingsMessage": "配置社区偏好与显示语言。",
    "langLabel": "语言选择 (Language)",
    "btnSave": "保存",
    "btnCancel": "取消",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "测评",
        "memo": "OLED屏幕",
        "author": "桌搭玩家",
        "title": "海淘 14 英寸便携 OLED 显示屏使用一周真实体验（多图）",
        "content": [
          {
            "type": "text",
            "value": "趁着特价入手了一台 14 英寸便携 OLED 屏幕。下单两周左右寄到，作为笔记本的副屏已经重度使用了一周。"
          },
          {
            "type": "text",
            "value": "说实话原先没抱太大期待，想着外出图个多屏方便就行。\n结果拆箱的时候质感真惊艳到了，全铝合金 CNC 机身，转轴阻尼紧实，做工扎实。"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. 屏幕画质与色彩\nOLED 果然通透，纯黑深邃，对比度极高。放在笔记本旁边文字清晰锐利，代码编辑器开暗黑模式或者看片极其享受。"
          },
          {
            "type": "text",
            "value": "2. 便携与一线直连\n重量不到 600g，塞进双肩包的电脑隔层很轻松。\n最爽的是一根双头 Type-C 线同时搞定供电和画面输出，在咖啡厅或者出差酒店插上就能双屏办公，不用背笨重的电源头。"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. 挑几点不足\n镜面屏如果背后有强光反光略明显，打算贴张雾面 AR 防眩光膜。\n另外自带的外放扬声器听个响，建议还是戴耳机用哈哈。"
          },
          {
            "type": "text",
            "value": "总结\n对于经常移动办公需要高画质副屏的朋友，这款真心可以闭眼入。"
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "笔记本爱好者",
            "content": "测评很详细！请问单靠笔记本雷电/全功能 Type-C 供电开到最高亮度会闪屏断电吗？"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "桌搭玩家",
            "content": "完全不会，用附带的原装双 C 线测试 100% 亮度非常稳定，一点不闪。"
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "音频发烧友",
            "content": "镜面屏高光环境确实有点难受，不过这个价位能上 OLED 已经很值了。"
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "极简生活",
            "content": "桌面布置太整洁了！第二张图底下的毛毡桌垫求个关键词？"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "桌搭玩家",
            "content": "某宝直接搜深灰羊毛毡大号桌垫，三十多块钱搞定！"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "掌机党",
            "content": "这个能不用底座直接直连便携游戏掌机吗？"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "桌搭玩家",
            "content": "掌机供电带不动，显示器第二个 C 口必须插上快充头供电才可以正常显示！"
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "闲聊",
        "memo": "迷你主机",
        "author": "极简码农",
        "title": "把笨重的大机箱换成迷你主机一个月后的真实感受"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "问答",
        "memo": "居家咖啡",
        "author": "手冲常客",
        "title": "大家平时在家手冲咖啡都用什么手摇磨豆机？求推荐"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "科普",
        "memo": "电池健康",
        "author": "电池极客",
        "title": "日常生活中正在悄悄损坏电子设备电池寿命的几种坏习惯"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "摄影",
        "memo": "周末骑行",
        "author": "两轮漫游",
        "title": "周末沿着江边骑行，秋天的天气实在太舒服了（晒图）"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "推荐",
        "memo": "Markdown",
        "author": "语法高亮",
        "title": "适合开发者与写作的高颜值轻量开源 Markdown 笔记软件盘点"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "问答",
        "memo": "65W氮化镓",
        "author": "收纳达人",
        "title": "想找一款带接地的 3 口 65W 氮化镓充电头，发热控制好点的"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "心得",
        "memo": "静音轴体",
        "author": "客制化键盘",
        "title": "机械键盘从茶轴换成静音线性轴，敲击体验简直打开了新世界"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "晒单",
        "memo": "显示器支架",
        "author": "工位美学",
        "title": "周末重新理线并装上了显示器支架，桌面瞬间整洁多了一大半空间"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "美食",
        "memo": "一锅意面",
        "author": "独居厨房",
        "title": "周末午餐 15 分钟快手搞定的一锅到底蒜香黄油意面"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "技巧",
        "memo": "终端秘籍",
        "author": "终端旅人",
        "title": "每天都在用的终端 CLI 实用快捷键与 alias 配置整理",
        "content": [
          {
            "type": "text",
            "value": "每天都要花很多时间在终端里，整理几个大幅提升命令行效率的快捷键与 alias 分享给大家。"
          },
          {
            "type": "text",
            "value": "1. ctrl + r: 历史命令反向搜索\n2. ctrl + a / ctrl + e: 光标快速移至行首/行尾\n3. alias gs=\"git status\", ga=\"git add\"\n\n大家平常最常用哪些命令配置呢？欢迎在评论区交流！"
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "程序员小张",
            "date": "11/09 10:22",
            "content": "ctrl + w 删除前一个单词也非常顺手，怒赞！",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "终端达人",
            "date": "11/09 10:45",
            "content": "强烈推荐 zsh 搭配 zsh-autosuggestions 插件，敲代码省时极了。",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "照片",
        "memo": "秋日漫步",
        "author": "枫叶落尽",
        "title": "清晨漫步在湖畔公园随手拍下的金黄秋景（照片）",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "趁着周末清晨凉爽的空气去湖畔公园散步，湖面飘着一层薄薄的晨雾，景致十分怡人。"
          },
          {
            "type": "text",
            "value": "手机随手一拍就很美，深秋的宁静氛围让人身心放松。"
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "早起鸟儿",
            "date": "11/09 08:52",
            "content": "晨雾缭绕的感觉好有诗意，很棒的照片！",
            "likeCount": 15,
            "types": []
          },
          {
            "id": "c-12-2",
            "author": "摄影小品",
            "date": "11/09 09:10",
            "content": "构图很干净舒服，感谢分享！",
            "likeCount": 8,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "黄昏落日余晖与平缓拍岸的金黄浪花",
        "author": "海风漫步",
        "category": "自然"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "午后暖阳洒落在极简北欧风客厅一角",
        "author": "北欧日和",
        "category": "家居"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "周末早午餐手冲手作咖啡的惬意时光",
        "author": "咖啡烘焙师",
        "category": "咖啡"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "雨天午后窗边倒映的温暖散景光斑",
        "author": "雨季随笔",
        "category": "心境"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "匠人纯手工烧制的质朴陶器餐盘系列",
        "author": "陶手作",
        "category": "陶艺"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "晨雾缭绕中的幽静山谷与清澈溪流",
        "author": "山林旅人",
        "category": "风景"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "暮色蓝调时分璀璨的繁华都会大道",
        "author": "城市街拍",
        "category": "城市"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "在晨光中舒展翠绿新叶的龟背竹盆栽",
        "author": "植感日常",
        "category": "绿植"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "被满室盎然绿植围绕的静谧绿意咖啡馆",
        "author": "角落咖啡",
        "category": "咖啡馆"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "白雪皑皑耸立天际的壮丽高山群峰",
        "author": "登高望远",
        "category": "高山"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "今晨刚出炉外脆内软的天然手作酸种面包",
        "author": "手作酸种",
        "category": "烘焙"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "深邃澄澈夜空中绽放光芒的仙女座大星系",
        "author": "仰望星空",
        "category": "星空"
      }
    ]
  },
  "de": {
    "boardTitle": "Allgemeines Forum",
    "menuGallery": "Fotogalerie",
    "galleryTitle": "Fotogalerie",
    "menuMainBoard": "Hauptforum",
    "menuSettings": "Einstellungen",
    "settingsTitle": "Einstellungen",
    "settingsMessage": "Community- und Spracheinstellungen anpassen.",
    "langLabel": "Sprache auswählen (Language)",
    "btnSave": "Speichern",
    "btnCancel": "Abbrechen",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Test",
        "memo": "OLED-Display",
        "author": "DeskNomad",
        "title": "Ehrlicher 1-Wochen-Test des tragbaren 14\"-OLED-Monitors (Fotos)",
        "content": [
          {
            "type": "text",
            "value": "Habe mir im saisonalen Sale einen günstigen tragbaren 14-Zoll-OLED-Monitor zugelegt. Nach zwei Wochen Lieferzeit nutze ich ihn jetzt seit einer Woche täglich als Zweitbildschirm."
          },
          {
            "type": "text",
            "value": "Ehrlich gesagt habe ich bei dem Preis nicht viel erwartet – wollte nur einen robusten Reisebildschirm.\nBeim Auspacken war ich von der Verarbeitungsqualität echt überrascht: CNC-Aluminiumgehäuse, solide Scharniere, wirkt sehr wertig."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Panel & Bildqualität\nDas OLED-Panel ist fantastisch. Sattes Schwarz, toller Kontrast und gestochen scharfer Text neben dem Laptop. Perfekt für Dark-Mode-Code und Streaming."
          },
          {
            "type": "text",
            "value": "2. Portabilität & 1-Kabel-Lösung\nWiegt unter 600g und passt perfekt in die Laptoptasche.\nEin einziges USB-C-Kabel für Bild und Stromversorgung ist genial für Unterwegs, Cafés oder Hotels."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. Kritikpunkte\nDas Display ist spiegelnd (Glossy), bei direktem Deckenlicht stören Reflexionen. Eine matte AR-Folie könnte helfen.\nDie internen Lautsprecher klingen blechern – lieber Kopfhörer nutzen."
          },
          {
            "type": "text",
            "value": "Fazit\nFür alle, die einen leichten, hochwertigen Zweitbildschirm für unterwegs suchen, eine klare Empfehlung."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "LaptopFan",
            "content": "Super Bericht! Läuft er bei 100% Helligkeit stabil über den Laptop-Port ohne Flackern?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "DeskNomad",
            "content": "Ja, mit dem beiliegenden C-auf-C-Kabel bei voller Helligkeit absolut stabil und ohne Aussetzer."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "AudioPhile99",
            "content": "Glossy in hellen Cafés ist gewöhnungsbedürftig, aber für den OLED-Preis verschmerzbar."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "CleanDesk",
            "content": "Die Schreibtischunterlage auf Bild 2 sieht klasse aus! Woher hast du die?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "DeskNomad",
            "content": "Eine einfache dunkelgraue Filzmatte aus dem Online-Handel für rund 12 Euro!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "HandheldGamer",
            "content": "Kann man eine Gaming-Handheld-Konsole direkt ohne Dock anschließen?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "DeskNomad",
            "content": "Braucht externe Stromversorgung am zweiten Monitor-Port, der Handheld allein liefert nicht genug Strom."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Talk",
        "memo": "Mini-PC",
        "author": "CodeKompakt",
        "title": "Ein Monat nach dem Wechsel vom großen Desktop-Tower zum Mini-PC"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Frage",
        "memo": "Home-Café",
        "author": "KaffeeGenuss",
        "title": "Empfehlungen für manuelle Kaffeemühlen für täglichen Filterkaffee?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Wissen",
        "memo": "Akkupflege",
        "author": "AkkuExperte",
        "title": "Alltägliche Gewohnheiten, die heimlich den Geräteakku zerstören"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Radtour",
        "author": "ZweiRäder",
        "title": "Fahrradtour am Flussufer am Wochenende, traumhaftes Herbstwetter (Fotos)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Tipp",
        "memo": "Markdown",
        "author": "SyntaxPro",
        "title": "Schlanke Open-Source-Markdown-Editoren für Entwickler und Autoren"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Frage",
        "memo": "65W GaN",
        "author": "KabelOrdnung",
        "title": "Suche geerdetes 3-Port 65W GaN-Netzteil mit guter Wärmeableitung"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Review",
        "memo": "Silent-Switches",
        "author": "TastaturFreak",
        "title": "Von taktilen Schaltern auf leise lineare Switches gewechselt – ein Traum"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Setup",
        "memo": "Monitorarm",
        "author": "WorkspaceBau",
        "title": "Monitorarme montiert und plötzlich doppelt so viel Platz auf dem Schreibtisch"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Kochen",
        "memo": "One-Pan-Pasta",
        "author": "PfannenKoch",
        "title": "Schnelle 15-Minuten Knoblauch-Butter-Pasta aus einer Pfanne zum Mittag"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "Tipp",
        "memo": "CLI-Tricks",
        "author": "ShellDev",
        "title": "Praktische CLI-Terminal-Shortcuts und Aliase für den Entwickleralltag",
        "content": [
          {
            "type": "text",
            "value": "Ein paar Shortcuts und Aliase, die mir täglich im Terminal viele Tastenanschläge ersparen."
          },
          {
            "type": "text",
            "value": "1. Strg + r: Rückwärtssuche im Verlauf\n2. Strg + a / Strg + e: Zum Anfang/Ende der Zeile springen\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "LinuxFreund",
            "date": "11/09 10:22",
            "content": "Strg + w zum Wortlöschen ist auch unverzichtbar!",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "ZshFan",
            "date": "11/09 10:45",
            "content": "Unbedingt zsh-autosuggestions ausprobieren!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Herbstgang",
        "author": "Herbstlaub",
        "title": "Frühmorgendlicher Herbstspaziergang am Seeufer, goldene Laubfarben (Fotos)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Ein ruhiger Spaziergang am See heute früh. Der aufsteigende Morgennebel und das goldene Laub waren atemberaubend."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "Morgenmensch",
            "date": "11/09 08:52",
            "content": "Sehr stimmungsvolle Aufnahme!",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Goldener Sonnenuntergang über sanften Wellen",
        "author": "Meeresbrise",
        "category": "Natur"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Lichtdurchfluteter skandinavischer Wohnraum",
        "author": "NordicLiving",
        "category": "Wohnen"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Frisch aufgebrühter Wochenendkaffee mit Freunden",
        "author": "Röstmeister",
        "category": "Kaffee"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Regnerischer Nachmittag mit Bokeh-Spiegelungen",
        "author": "Regentag",
        "category": "Stimmung"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Handgefertigte Keramikteller aus Meisterhand",
        "author": "TonWerk",
        "category": "Handwerk"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Nebliger Sommermorgen im stillen Flusstal",
        "author": "Bergpfad",
        "category": "Landschaft"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Blaue Stunde über den Hochhäusern der Metropole",
        "author": "Stadtblick",
        "category": "Stadt"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Frisch entfaltetes Fensterblatt im Sonnenlicht",
        "author": "GrünDaumen",
        "category": "Pflanzen"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Gemütliche Café-Ecke umgeben von grünen Zimmerpflanzen",
        "author": "Kaffeezeit",
        "category": "Café"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Schneebedeckte Gipfel der majestätischen Alpen",
        "author": "Alpenglühn",
        "category": "Gipfel"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Frisch gebackenes knuspriges Holzofen-Sauerteigbrot",
        "author": "Sauerteig",
        "category": "Backen"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Andromeda-Galaxie am tiefdunklen Nachthimmel",
        "author": "Sternennacht",
        "category": "Astro"
      }
    ]
  },
  "fr": {
    "boardTitle": "Communauté générale",
    "menuGallery": "Galerie Photo",
    "galleryTitle": "Galerie Photo",
    "menuMainBoard": "Forum Principal",
    "menuSettings": "Paramètres",
    "settingsTitle": "Paramètres",
    "settingsMessage": "Configurer les préférences et la langue.",
    "langLabel": "Langue (Language)",
    "btnSave": "Enregistrer",
    "btnCancel": "Annuler",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Avis",
        "memo": "Écran OLED",
        "author": "DeskNomade",
        "title": "Avis honnête après 1 semaine sur ce moniteur portable OLED 14\" (Photos)",
        "content": [
          {
            "type": "text",
            "value": "J'ai profité des récentes promotions pour acheter ce moniteur portable OLED 14 pouces abordable. Reçu après 2 semaines, je l'utilise quotidiennement comme écran secondaire depuis 7 jours."
          },
          {
            "type": "text",
            "value": "Vu le prix, je n'en attendais pas grand-chose. Pourtant, à l'ouverture, la finition en aluminium CNC et la charnière bien ferme m'ont agréablement surpris."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Dalle et qualité d'image\nL'OLED fait toute la différence : noirs profonds, contraste éclatant et texte d'une netteté parfaite à côté du PC portable. Idéal pour coder en thème sombre."
          },
          {
            "type": "text",
            "value": "2. Mobilité et câble unique\nMoins de 600g, il se glisse sans problème dans la sacoche d'ordinateur. Le câble USB-C gérant à la fois la vidéo et l'alimentation évite de transporter de gros chargeurs."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. Les petits défauts\nLa dalle est brillante : avec une lumière directe dans le dos, les reflets sont gênants. Les haut-parleurs intégrés manquent de coffre, prévoyez un casque."
          },
          {
            "type": "text",
            "value": "Conclusion\nPour quiconque cherche un second écran nomade léger et qualitatif, c'est un achat les yeux fermés."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "FanDeLaptop",
            "content": "Super retour ! Pas de scintillement en l'alimentant uniquement via le PC à 100% de luminosité ?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "DeskNomade",
            "content": "Aucun souci, testé avec le câble C-vers-C fourni à pleine luminosité, c'est parfaitement stable."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "AudioPhile99",
            "content": "Le brillant en terrasse ou café peut gêner, mais de l'OLED à ce tarif, difficile de faire la fine bouche."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "BureauZen",
            "content": "Le sous-main en feutre gris sur la photo 2 est magnifique, tu l'as trouvé où ?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "DeskNomade",
            "content": "Un grand tapis en feutre classique commandé en ligne pour une douzaine d'euros !"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "GamerNomade",
            "content": "Est-ce qu'on peut brancher directement une console portable sans dock ?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "DeskNomade",
            "content": "Il faut brancher un chargeur sur le second port USB-C de l'écran car la console seule ne fournit pas assez d'énergie."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Bla",
        "memo": "Mini-PC",
        "author": "SetupMinimal",
        "title": "Un mois après avoir troqué ma grosse tour PC contre un mini-PC"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Aide",
        "memo": "Café Maison",
        "author": "EspressoAddict",
        "title": "Des recommandations de moulin à café manuel pour filtre au quotidien ?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Info",
        "memo": "Batterie",
        "author": "VoltTech",
        "title": "Les habitudes du quotidien qui détruisent en silence la batterie de vos appareils"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Photo",
        "memo": "Sortie Vélo",
        "author": "DeuxRoues",
        "title": "Balade à vélo au bord du fleuve ce week-end, météo d'automne parfaite (Photos)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Outil",
        "memo": "Markdown",
        "author": "SyntaxeDev",
        "title": "Éditeurs Markdown open-source légers pour développeurs et rédacteurs"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Aide",
        "memo": "GaN 65W",
        "author": "CâblesPropres",
        "title": "À la recherche d'un chargeur GaN 65W à 3 ports avec prise de terre"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Test",
        "memo": "Switch Silencieux",
        "author": "ClavierPassion",
        "title": "Passé des switches tactiles aux linéaires silencieux : le jour et la nuit !"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Setup",
        "memo": "Bras Écran",
        "author": "EspaceBureau",
        "title": "Installation de bras d'écran ce week-end : mon bureau est méconnaissable"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Miam",
        "memo": "Pâtes Express",
        "author": "CuisineFacile",
        "title": "Pâtes au beurre d'ail en 15 minutes à la poêle pour un déjeuner express"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "Astuce",
        "memo": "Astuces CLI",
        "author": "ShellArtisan",
        "title": "Raccourcis et alias indispensables pour booster sa productivité dans le terminal",
        "content": [
          {
            "type": "text",
            "value": "Quelques raccourcis et alias indispensables que j’utilise au quotidien pour gagner du temps."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Recherche dans l’historique\n2. ctrl + a / ctrl + e: Début/fin de ligne\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "DevUnix",
            "date": "11/09 10:22",
            "content": "ctrl + w pour effacer un mot en arrière est tellement pratique.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "AmoureuxBash",
            "date": "11/09 10:45",
            "content": "zsh-autosuggestions est un incontournable absolu !",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Photo",
        "memo": "Balade",
        "author": "FeuilleAutomne",
        "title": "Promenade matinale automnale au bord du lac, l'air frais et les couleurs dorées (Photos)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Petite balade matinale vivifiante autour du lac. La brume sur l'eau créait une atmosphère magique."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "Flâneur",
            "date": "11/09 08:52",
            "content": "Magnifique ambiance automnale !",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Coucher de soleil doré sur les vagues calmes",
        "author": "BriseMarine",
        "category": "Nature"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Salon scandinave épuré baigné de lumière",
        "author": "DesignNordique",
        "category": "Intérieur"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Café filtre partagé entre amis pour le brunch",
        "author": "MaitreTorrefacteur",
        "category": "Café"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Après-midi pluvieux aux reflets de bokeh chaleureux",
        "author": "GoutteDePluie",
        "category": "Ambiance"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Collection d’assiettes en céramique artisanale",
        "author": "AtelierArgile",
        "category": "Artisanat"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Aube brumeuse le long de la rivière de montagne",
        "author": "SentierAlpin",
        "category": "Paysage"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Heure bleue sur les gratte-ciels de la métropole",
        "author": "FlâneurUrbain",
        "category": "Ville"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Nouvelle feuille de Monstera éclatante au soleil",
        "author": "MainVerte",
        "category": "Plantes"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Coin café botanique chaleureux et verdoyant",
        "author": "PauseCafé",
        "category": "Bistrot"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Pics alpins enneigés dominant la vallée",
        "author": "HauteMontagne",
        "category": "Sommet"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Pains au levain rustiques croustillants sortis du four",
        "author": "PainAuLevain",
        "category": "Boulangerie"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Galaxie d’Andromède étincelante dans la nuit pure",
        "author": "NuitEtoilée",
        "category": "Astro"
      }
    ]
  },
  "es": {
    "boardTitle": "Comunidad General",
    "menuGallery": "Galería de Fotos",
    "galleryTitle": "Galería de Fotos",
    "menuMainBoard": "Foro Principal",
    "menuSettings": "Ajustes",
    "settingsTitle": "Ajustes",
    "settingsMessage": "Configura tus preferencias e idioma.",
    "langLabel": "Seleccionar idioma (Language)",
    "btnSave": "Guardar",
    "btnCancel": "Cancelar",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Test",
        "memo": "Pantalla OLED",
        "author": "NomadaDigital",
        "title": "Análisis sincero tras 1 semana con este monitor portátil OLED de 14\" (Fotos)",
        "content": [
          {
            "type": "text",
            "value": "Aproveché una oferta para comprar este monitor portátil OLED de 14 pulgadas. Tardó un par de semanas en llegar y lo he estado usando a diario como pantalla secundaria."
          },
          {
            "type": "text",
            "value": "Por el precio no esperaba maravillas, solo una pantalla de viaje práctica. Sin embargo, el chasis de aluminio CNC y las bisagras firmes me sorprendieron positivamente."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Panel y calidad de imagen\nEl panel OLED es sobresaliente: negros puros, gran contraste y texto nítido al lado del portátil. Ideal para programar en modo oscuro y ver series."
          },
          {
            "type": "text",
            "value": "2. Portabilidad y un solo cable\nPesa menos de 600 gramos y entra perfecto en la mochila. Que un solo cable USB-C transporte imagen y energía es comodísimo en cafeterías u hoteles."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. Puntos a mejorar\nEs acabado brillante, así que con luces directas detrás se notan los reflejos. Los altavoces integrados son básicos, mejor usar auriculares."
          },
          {
            "type": "text",
            "value": "Conclusión\nPara quien busque un monitor secundario ligero y de gran calidad en movilidad, muy recomendado."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "LaptopFan",
            "content": "¡Gran análisis! ¿Funciona al 100% de brillo con alimentación directa del portátil sin parpadeos?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "NomadaDigital",
            "content": "Sí, probado al 100% de brillo con el cable C a C incluido y cero cortes, va impecable."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "AudioPhile99",
            "content": "La pantalla brillante en sitios con mucha luz puede molestar, pero por este precio con OLED vale la pena."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "MesaLimpia",
            "content": "¡Muy limpio tu escritorio! ¿De dónde es el tapete de fieltro de la segunda foto?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "NomadaDigital",
            "content": "Es un tapete de fieltro gris oscuro genérico comprado por internet por unos 10 euros."
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "GamerPortatil",
            "content": "¿Se puede conectar una consola portátil directamente sin dock?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "NomadaDigital",
            "content": "Necesitas conectar el cargador al segundo puerto del monitor, la consola sola no da suficiente energía."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Charla",
        "memo": "Mini PC",
        "author": "MinimalSetup",
        "title": "Un mes después de cambiar mi enorme torre de PC por un mini PC"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Duda",
        "memo": "Café Casero",
        "author": "EspressoLover",
        "title": "¿Recomendaciones de molinillo de café manual para filtrado diario?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Guía",
        "memo": "Batería",
        "author": "VoltioTech",
        "title": "Hábitos cotidianos que degradan en silencio la batería de tus dispositivos"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Ruta Bici",
        "author": "DosRuedas",
        "title": "Paseo en bicicleta junto al río el fin de semana, clima otoñal increíble (Fotos)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Top",
        "memo": "Markdown",
        "author": "SintaxisDev",
        "title": "Editores Markdown de código abierto y ligeros para desarrolladores"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Duda",
        "memo": "GaN 65W",
        "author": "OrdenCables",
        "title": "Buscando un cargador GaN 65W de 3 puertos con toma de tierra fiable"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Review",
        "memo": "Switch Silencio",
        "author": "TecladoManiac",
        "title": "Cambié de switches mecánicos táctiles a lineales silenciosos: qué diferencia"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Setup",
        "memo": "Brazo Monitor",
        "author": "EspacioTrabajo",
        "title": "Monté brazos para los monitores y gané muchísimo espacio en el escritorio"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Cocina",
        "memo": "Pasta Rápida",
        "author": "ChefCasero",
        "title": "Pasta rápida con ajo y mantequilla en una sola sartén en 15 minutos"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "Tip",
        "memo": "Trucos CLI",
        "author": "ScriptMaster",
        "title": "Atajos de terminal y alias útiles que mejoran mi productividad diaria",
        "content": [
          {
            "type": "text",
            "value": "Comparto algunos atajos y alias que me ahorran muchísimo tiempo en la consola todos los días."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Búsqueda inversa en el historial\n2. ctrl + a / ctrl + e: Ir al inicio/final de la línea\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "Linuxero",
            "date": "11/09 10:22",
            "content": "ctrl + w para borrar la palabra anterior es genial.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "TerminalPro",
            "date": "11/09 10:45",
            "content": "¡Instalen zsh-autosuggestions si usan zsh!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Paseo Otoño",
        "author": "HojasDoradas",
        "title": "Paseo otoñal temprano por el parque del lago, colores dorados increíbles (Fotos)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Caminata matutina junto al lago con la niebla subiendo lentamente. Una estampa otoñal perfecta."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "Caminante",
            "date": "11/09 08:52",
            "content": "¡Qué serenidad transmite esa toma!",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Puesta de sol dorada sobre suaves olas del mar",
        "author": "BrisaMarina",
        "category": "Naturaleza"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Salón minimalista nórdico iluminado por la tarde",
        "author": "HogarNordico",
        "category": "Interior"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Café de especialidad compartido en fin de semana",
        "author": "BaristaPro",
        "category": "Café"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Tarde de lluvia con cálidos reflejos de bokeh",
        "author": "TardeLluviosa",
        "category": "Sensación"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Vajilla artesanal de cerámica hecha a mano",
        "author": "BarroYFuego",
        "category": "Artesanía"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Amanecer brumoso en el valle de un río sereno",
        "author": "PaseoAlpino",
        "category": "Paisaje"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Hora azul sobre la gran avenida metropolitana",
        "author": "RutasUrbanas",
        "category": "Ciudad"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Nueva hoja de monstera desplegada bajo el sol",
        "author": "VerdeNatural",
        "category": "Plantas"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Rincón acogedor de cafetería lleno de plantas",
        "author": "AromaCafe",
        "category": "Cafetería"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Majestuosa cordillera alpina cubierta de nieve",
        "author": "CumbresNevadas",
        "category": "Cumbre"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Panes rústicos de masa madre recién horneados",
        "author": "MasaMadre",
        "category": "Panadería"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Galaxia de Andrómeda brillando en el cielo nocturno",
        "author": "CieloEstrellado",
        "category": "Astro"
      }
    ]
  },
  "it": {
    "boardTitle": "Community Generale",
    "menuGallery": "Galleria Fotografica",
    "galleryTitle": "Galleria Fotografica",
    "menuMainBoard": "Bacheca Principale",
    "menuSettings": "Impostazioni",
    "settingsTitle": "Impostazioni",
    "settingsMessage": "Configura le preferenze della community e la lingua.",
    "langLabel": "Seleziona lingua (Language)",
    "btnSave": "Salva",
    "btnCancel": "Annulla",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Test",
        "memo": "Schermo OLED",
        "author": "NomadeDigitale",
        "title": "Recensione onesta dopo 1 settimana su questo monitor portatile OLED 14\" (Foto)",
        "content": [
          {
            "type": "text",
            "value": "Ho acquistato questo monitor portatile OLED da 14 pollici in sconto. Arrivato in due settimane, lo uso come schermo secondario ogni giorno da una settimana."
          },
          {
            "type": "text",
            "value": "Non mi aspettavo finiture eccezionali dato il prezzo, ma il telaio in alluminio CNC e le cerniere solide mi hanno davvero colpito."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Pannello e qualità visiva\nL'OLED è magnifico: neri assoluti, contrasto vibrante e testi nitidissimi accanto al portatile. Perfetto per il codice in tema scuro."
          },
          {
            "type": "text",
            "value": "2. Portabilità e cavo singolo\nPesa meno di 600g e scivola nello zaino. Il cavo Type-C unico per video e alimentazione evita di portare ingombranti alimentatori."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. I nei\nIl pannello lucido riflette se hai luci dirette alle spalle. Gli altoparlanti integrati sono deboli, meglio usare le cuffie."
          },
          {
            "type": "text",
            "value": "Conclusione\nPer chi cerca un display portatile compatto e di qualità per lavorare ovunque, consigliatissimo."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "TechLaptop",
            "content": "Ottima panoramica! Alimentato solo dal portatile al 100% di luminosità sfarfalla?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "NomadeDigitale",
            "content": "Nessuno sfarfallio, testato al 100% di luminosità col cavo C-to-C in dotazione ed è stabilissimo."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "Audiofilo99",
            "content": "I riflessi in caffetteria possono dare fastidio, ma l'OLED a questa cifra è un vero affare."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "ScrivaniaZen",
            "content": "Setup pulitissimo! Dove hai preso il sottomano in feltro della seconda foto?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "NomadeDigitale",
            "content": "Un sottomano generico in feltro grigio scuro preso online a circa 12 euro!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "GamerPortatile",
            "content": "Si può collegare una console portatile direttamente senza dock?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "NomadeDigitale",
            "content": "Serve collegare l'alimentatore alla seconda porta del monitor, la console da sola non eroga abbastanza potenza."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Chiacch",
        "memo": "Mini PC",
        "author": "SetupPulito",
        "title": "Un mese dopo aver sostituito il mio ingombrante PC fisso con un mini PC"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Aiuto",
        "memo": "Caffè Casa",
        "author": "AmanteEspresso",
        "title": "Consigli su un macinacaffè manuale per filtro da usare tutti i giorni?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Info",
        "memo": "Batteria",
        "author": "MondoVolt",
        "title": "Abitudini quotidiane che rovinano silenziosamente la batteria dei dispositivi"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Giro in Bici",
        "author": "DueRuote",
        "title": "Giro in bici lungo il fiume nel weekend, clima autunnale fantastico (Foto)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Top",
        "memo": "Markdown",
        "author": "SintassiDev",
        "title": "Editor Markdown open-source leggeri per programmatori e scrittori"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Aiuto",
        "memo": "GaN 65W",
        "author": "CaviInOrdine",
        "title": "Cerco un caricatore GaN 65W a 3 porte con messa a terra affidabile"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Review",
        "memo": "Switch Silenzio",
        "author": "TastieraFan",
        "title": "Passato dagli switch tattili a quelli lineari silenziosi: un altro pianeta!"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Setup",
        "memo": "Braccio Monitor",
        "author": "AngoloLavoro",
        "title": "Installati bracci per monitor nel weekend: la scrivania sembra raddoppiata"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Cucina",
        "memo": "Pasta Veloce",
        "author": "ChefInCasa",
        "title": "Pasta veloce burro e aglio in 15 minuti in un'unica padella"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "Tip",
        "memo": "Trucchi CLI",
        "author": "ShellCoder",
        "title": "Scorciatoie e alias per il terminale che aumentano la produttività quotidiana",
        "content": [
          {
            "type": "text",
            "value": "Ecco una selezione di scorciatoie e alias che velocizzano notevolmente il mio flusso di lavoro nel terminale."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Ricerca nella cronologia\n2. ctrl + a / ctrl + e: Salto a inizio/fine riga\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "DevItaliano",
            "date": "11/09 10:22",
            "content": "ctrl + w per cancellare una parola alla volta è fondamentale.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "PinguinoFan",
            "date": "11/09 10:45",
            "content": "Consiglio zsh-autosuggestions a tutti!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Autunno",
        "author": "FoglieDoro",
        "title": "Passeggiata mattutina autunnale intorno al parco del lago (Foto)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Passeggiata mattutina lungo il lago tra la nebbia e i caldi colori autunnali."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "Fotografo",
            "date": "11/09 08:52",
            "content": "Atmosfera davvero magica e rilassante.",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Tramonto dorato su onde calme e spumeggianti",
        "author": "BrezzaMarina",
        "category": "Natura"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Soggiorno scandinavo minimale inondato di luce",
        "author": "StileNordico",
        "category": "Interni"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Caffè filtro artigianale con amici nel fine settimana",
        "author": "MastroTostatore",
        "category": "Caffè"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Pomeriggio di pioggia con caldi riflessi di bokeh",
        "author": "PioggiaAutunnale",
        "category": "Atmosfera"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Collezione di piatti in ceramica fatti a mano",
        "author": "CeramicaViva",
        "category": "Artigianato"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Alba nebbiosa lungo il fiume nella valle alpina",
        "author": "SentieroAlpino",
        "category": "Paesaggio"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Ora blu che avvolge i grattacieli della metropoli",
        "author": "ScorciUrbani",
        "category": "Città"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Lussureggiante foglia di monstera baciata dal sole",
        "author": "PolliceVerde",
        "category": "Piante"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Angolo accogliente in una caffetteria botanica",
        "author": "CaffèPausa",
        "category": "Caffetteria"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Maestose vette alpine innevate sotto il cielo terso",
        "author": "CimeInnevate",
        "category": "Vetta"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Pagnotte rustiche a lievitazione naturale appena sfornate",
        "author": "LievitoMadre",
        "category": "Panificazione"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "La galassia di Andromeda che brilla nel cielo profondo",
        "author": "VoltaCeleste",
        "category": "Astro"
      }
    ]
  },
  "pt": {
    "boardTitle": "Comunidade Geral",
    "menuGallery": "Galeria de Fotos",
    "galleryTitle": "Galeria de Fotos",
    "menuMainBoard": "Fórum Geral",
    "menuSettings": "Configurações",
    "settingsTitle": "Configurações",
    "settingsMessage": "Configure as preferências e o idioma da comunidade.",
    "langLabel": "Idioma (Language)",
    "btnSave": "Salvar",
    "btnCancel": "Cancelar",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Review",
        "memo": "Tela OLED",
        "author": "TechNomade",
        "title": "Review sincera após 1 semana com este monitor portátil OLED 14\" (Fotos)",
        "content": [
          {
            "type": "text",
            "value": "Aproveitei uma promoção para comprar este monitor portátil OLED de 14 polegadas. Demorou cerca de duas semanas para chegar e estou usando diariamente como tela secundária."
          },
          {
            "type": "text",
            "value": "Pelo preço não esperava tanta qualidade, mas ao abrir a caixa o corpo em alumínio CNC e as dobradiças firmes me surpreenderam bastante."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Painel e qualidade de imagem\nO painel OLED é espetacular: pretos profundos, contraste vibrante e textos super nítidos ao lado do notebook. Excelente para código em modo escuro."
          },
          {
            "type": "text",
            "value": "2. Portabilidade e cabo único\nPesa menos de 600g e cabe facilmente na mochila. Usar apenas um cabo Type-C para vídeo e energia é maravilhoso para trabalhar em cafés ou viagens."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. Pontos fracos\nA tela é brilhante (glossy), então com luz forte atrás reflete bastante. Os alto-falantes embutidos são bem simples, use fones."
          },
          {
            "type": "text",
            "value": "Conclusão\nPara quem precisa de uma segunda tela portátil e de alta qualidade no dia a dia, recomendo de olhos fechados."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "FanDeNote",
            "content": "Ótimo review! Ligado direto no notebook com 100% de brilho dá alguma piscada?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "TechNomade",
            "content": "Zero piscadas, testei com o cabo C-to-C que veio na caixa em 100% de brilho e segurou firme."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "Audiofilo99",
            "content": "Reflexo em cafeteria ensolarada pode incomodar, mas ter OLED nessa faixa de preço compensa demais."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "MesaClean",
            "content": "Setup lindo demais! De onde é esse feltro cinza escuro embaixo do teclado na foto 2?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "TechNomade",
            "content": "É um desk pad genérico de feltro que comprei online por uns 60 reais!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "GamerPortatil",
            "content": "Dá para ligar console portátil diretamente sem dock nele?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "TechNomade",
            "content": "Precisa plugar o carregador na segunda porta Type-C do monitor, o console sozinho não manda energia suficiente."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Papo",
        "memo": "Mini PC",
        "author": "SetupClean",
        "title": "Um mês após trocar meu desktop gigante por um mini PC"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Dúvida",
        "memo": "Café em Casa",
        "author": "LoucoPorCafe",
        "title": "Recomendações de moedor manual de café para coados no dia a dia?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Dica",
        "memo": "Bateria",
        "author": "EngenheiroTech",
        "title": "Hábitos comuns que degradam silenciosamente a bateria dos aparelhos"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Pedal",
        "author": "DuasRodas",
        "title": "Pedal na beira do rio no fim de semana, clima de outono perfeito (Fotos)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Top",
        "memo": "Markdown",
        "author": "DevCodigo",
        "title": "Editores Markdown open-source leves para programadores e escritores"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Dúvida",
        "memo": "GaN 65W",
        "author": "CabosEmOrdem",
        "title": "Procurando carregador GaN 65W 3 portas com aterramento e boa refrigeração"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Review",
        "memo": "Switch Silencioso",
        "author": "ManiacoTeclado",
        "title": "Mudei de switches táteis para lineares silenciosos: que diferença absurda"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Setup",
        "memo": "Braço Monitor",
        "author": "CantinhoTech",
        "title": "Instalei braços articulados no fim de semana e a mesa ficou gigante"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Cozinha",
        "memo": "Macarrão 15min",
        "author": "CozinhaRapida",
        "title": "Macarrão de alho e manteiga de 15 minutos feito em uma panela só"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "Dica",
        "memo": "Dicas de CLI",
        "author": "DevTerminal",
        "title": "Atalhos de terminal e aliases práticos para aumentar a produtividade no dia a dia",
        "content": [
          {
            "type": "text",
            "value": "Reuni alguns atalhos e aliases essenciais que salvam muito tempo no fluxo diário de terminal."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Busca reversa no histórico\n2. ctrl + a / ctrl + e: Início e fim da linha\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "Codificador",
            "date": "11/09 10:22",
            "content": "ctrl + w para apagar a palavra inteira é perfeito.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "AmigoLinux",
            "date": "11/09 10:45",
            "content": "Uso zsh com zsh-autosuggestions e não vivo sem!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Passeio",
        "author": "OutonoLeve",
        "title": "Caminhada matinal de outono ao redor do lago, cores douradas incríveis (Fotos)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Manhã fresca passeando à beira do lago. A névoa suave deu um toque especial à paisagem."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "NaturezaViva",
            "date": "11/09 08:52",
            "content": "Cenário maravilhoso, transmite muita paz!",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Pôr do sol dourado sobre o mar tranquilo",
        "author": "BrisaMarinha",
        "category": "Natureza"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Sala minimalista escandinava banhada de sol",
        "author": "DesignNordico",
        "category": "Interior"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Café coado artesanal com amigos no fim de semana",
        "author": "BaristaArte",
        "category": "Café"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Tarde de chuva com reflexos quentes de bokeh",
        "author": "DiaDeChuva",
        "category": "Humor"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Coleção artesanal de pratos de cerâmica feitos à mão",
        "author": "CeramicaViva",
        "category": "Artesanato"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Amanhecer com neblina em um vale calmo de montanha",
        "author": "TrilhaAlpina",
        "category": "Paisagem"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Hora azul iluminando os prédios da metrópole",
        "author": "OlharUrbano",
        "category": "Cidade"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Nova folha de costela-de-adão brilhando ao sol",
        "author": "AmorVerde",
        "category": "Plantas"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Cantinho aconchegante de café repleto de plantas",
        "author": "CantinhoDoCafe",
        "category": "Cafeteria"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Majestosa cordilheira com picos nevados",
        "author": "PicosNevados",
        "category": "Montanha"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Pães artesanais de fermentação natural recém-saídos do forno",
        "author": "MassaMadre",
        "category": "Panificação"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Galáxia de Andrômeda reluzindo na noite escura",
        "author": "CeoEstrelado",
        "category": "Astro"
      }
    ]
  },
  "ru": {
    "boardTitle": "Общее сообщество",
    "menuGallery": "Фотогалерея",
    "galleryTitle": "Фотогалерея",
    "menuMainBoard": "Главный форум",
    "menuSettings": "Настройки",
    "settingsTitle": "Настройки",
    "settingsMessage": "Настройка языка и параметров сообщества.",
    "langLabel": "Выбор языка (Language)",
    "btnSave": "Сохранить",
    "btnCancel": "Отмена",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Обзор",
        "memo": "OLED-экран",
        "author": "СтолИТ",
        "title": "Честный отзыв за неделю о портативном 14\" OLED-мониторе (Фото)",
        "content": [
          {
            "type": "text",
            "value": "Купил на распродаже бюджетный 14-дюймовый портативный OLED-монитор. Доставка заняла две недели, и вот уже неделю он служит моим вторым экраном каждый день."
          },
          {
            "type": "text",
            "value": "За эту цену чудес не ждал, нужен был просто экран в поездки. Но корпус из фрезерованного алюминия и плотные петли приятно удивили качеством сборки."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Матрица и качество картинки\nOLED шикарен: глубокий черный цвет, отличный контраст и четкий текст рядом с ноутбуком. Для кода в темной теме — восторг."
          },
          {
            "type": "text",
            "value": "2. Портативность и подключение одним кабелем\nВесит меньше 600 грамм, легко помещается в рюкзак. Один кабель Type-C для видео и питания избавляет от громоздких адаптеров в поездках."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. Минусы\nЭкран глянцевый, при верхнем свете бликует. Встроенные динамики слабенькие, лучше пользоваться наушниками."
          },
          {
            "type": "text",
            "value": "Итог\nВсем, кто ищет легкий и качественный второй экран для работы на выезде — однозначно рекомендую."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "НоутФанат",
            "content": "Отличный обзор! При питании от ноутбука на 100% яркости не мерцает?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "СтолИТ",
            "content": "Никаких мерцаний, комплектный провод держит 100% яркости без сбоев."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "Аудиофил",
            "content": "Глянец на солнце может мешать, но OLED за такие деньги — это подарок."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "Минималист",
            "content": "Очень аккуратный стол! Подскажи, откуда коврик из фетра на втором фото?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "СтолИТ",
            "content": "Обычный темно-серый войлочный коврик с маркетплейса примерно за 1000 рублей!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "ГеймерПортатив",
            "content": "А портативную игровую консоль можно подключить напрямую без док-станции?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "СтолИТ",
            "content": "Консоли не хватает питания, нужно воткнуть зарядку во второй Type-C порт монитора."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Флуд",
        "memo": "Мини-ПК",
        "author": "КодКомпакт",
        "title": "Месяц после перехода с огромного системника на мини-ПК: впечатления"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Вопрос",
        "memo": "Домашний кофе",
        "author": "ЭспрессоГид",
        "title": "Посоветуйте ручную кофемолку для ежедневной варки фильтр-кофе"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Инфо",
        "memo": "Батарея",
        "author": "ТехноМастер",
        "title": "Привычки, которые незаметно и быстро убивают аккумулятор ваших гаджетов"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Фото",
        "memo": "Велопрогулка",
        "author": "ДваКолеса",
        "title": "Осенний велозаезд по набережной на выходных, погода была сказочная (Фото)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Софт",
        "memo": "Markdown",
        "author": "СинтаксисИТ",
        "title": "Легковесные open-source редакторы Markdown для разработчиков и авторов"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Вопрос",
        "memo": "65W GaN",
        "author": "ЧистыйКабель",
        "title": "Ищу 3-портовую зарядку 65W GaN с заземлением и хорошим охлаждением"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Отзыв",
        "memo": "Тихие свичи",
        "author": "Клавишник",
        "title": "Сменил коричневые переключатели на бесшумные линейные: небо и земля!"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Сетап",
        "memo": "Кронштейн",
        "author": "УютныйСтол",
        "title": "Поставил кронштейн для монитора на выходных: на столе куча свободного места"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Кухня",
        "memo": "Паста за 15м",
        "author": "ХолостякШеф",
        "title": "Быстрая паста с чесночным маслом за 15 минут в одной сковороде"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "Совет",
        "memo": "Советы CLI",
        "author": "Терминальщик",
        "title": "Полезные сочетания клавиш и алиасы терминала для ежедневной продуктивности",
        "content": [
          {
            "type": "text",
            "value": "Несколько проверенных временем алиасов и шорткатов, которые экономят кучу времени при работе в командной строке."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Поиск по истории\n2. ctrl + a / ctrl + e: В начало/конец строки\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "Линуксоид",
            "date": "11/09 10:22",
            "content": "ctrl + w для удаления слова назад тоже мастхэв.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "КонсольныйГуру",
            "date": "11/09 10:45",
            "content": "Рекомендую zsh-autosuggestions каждому пользователю zsh!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Фото",
        "memo": "Осень",
        "author": "Листопад",
        "title": "Утренняя осенняя прогулка по озерному парку и золотистые пейзажи (Фото)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Утренняя свежесть, туман над водой и тишина в парке у озера. Настоящая золотая осень."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "ОсеннийСтранник",
            "date": "11/09 08:52",
            "content": "Очень умиротворяющий кадр!",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Золотой закат над спокойными морскими волнами",
        "author": "МорскойБриз",
        "category": "Природа"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Залитая солнцем минималистичная гостиная",
        "author": "СкандиДом",
        "category": "Интерьер"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Утренний фильтр-кофе с друзьями на выходных",
        "author": "Кофеман",
        "category": "Кофе"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Дождливый день за окном с мягкими огнями боке",
        "author": "ДождливыйДень",
        "category": "Атмосфера"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Авторская керамическая посуда ручной работы",
        "author": "Гончар",
        "category": "Ремесло"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Туманный рассвет над тихой горной рекой",
        "author": "ГорнаяТропа",
        "category": "Пейзаж"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Синий час на улицах вечернего мегаполиса",
        "author": "ГородскойРитм",
        "category": "Город"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Свежий лист монстеры в лучах утреннего солнца",
        "author": "ЗеленыйУголок",
        "category": "Растения"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Уютный ботанический уголок в атмосферном кафе",
        "author": "УютноеКафе",
        "category": "Кафе"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Величественные заснеженные хребты альпийских гор",
        "author": "СнежныеПики",
        "category": "Вершины"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Свежеиспеченный ремесленный хлеб на закваске",
        "author": "Закваска",
        "category": "Выпечка"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Галактика Андромеды в глубине ясного ночного неба",
        "author": "Звездочет",
        "category": "Космос"
      }
    ]
  },
  "pl": {
    "boardTitle": "Społeczność ogólna",
    "menuGallery": "Galeria Zdjęć",
    "galleryTitle": "Galeria Zdjęć",
    "menuMainBoard": "Forum Główne",
    "menuSettings": "Ustawienia",
    "settingsTitle": "Ustawienia",
    "settingsMessage": "Dostosuj preferencje i język społeczności.",
    "langLabel": "Wybór języka (Language)",
    "btnSave": "Zapisz",
    "btnCancel": "Anuluj",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Opinia",
        "memo": "Ekran OLED",
        "author": "BiurkoTech",
        "title": "Szczera opinia po tygodniu z przenośnym monitorem OLED 14\" (Zdjęcia)",
        "content": [
          {
            "type": "text",
            "value": "Kupiłem na wyprzedaży budżetowy 14-calowy przenośny monitor OLED. Po dwóch tygodniach dostawy używam go codziennie jako dodatkowego ekranu od tygodnia."
          },
          {
            "type": "text",
            "value": "Nie oczekiwałem cudów za tę cenę, a obudowa z aluminium CNC i solidne zawiasy bardzo pozytywnie mnie zaskoczyły."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Matryca i jakość obrazu\nOLED robi ogromną różnicę: głęboka czerń, żywy kontrast i idealnie ostry tekst obok laptopa. Świetny do kodowania w trybie ciemnym."
          },
          {
            "type": "text",
            "value": "2. Mobilność i jeden kabel\nWaży poniżej 600g i bez problemu mieści się w plecaku. Jeden kabel Type-C do obrazu i zasilania to niesamowita wygoda w podróży i kawiarniach."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. Minusy\nBłyszcząca matryca odbija światło z góry. Wbudowane głośniczki są bardzo przeciętne, lepiej założyć słuchawki."
          },
          {
            "type": "text",
            "value": "Podsumowanie\nDla każdego szukającego mobilnego, lekkiego drugiego ekranu o wysokiej jakości – zdecydowanie polecam."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "Laptopowiec",
            "content": "Świetny test! Działa stabilnie na 100% jasności zasilany tylko z laptopa?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "BiurkoTech",
            "content": "Tak, dołączony kabel C-do-C radzi sobie bez problemu przy pełnej jasności."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "Audiofil99",
            "content": "Błyszczący ekran w jasnej kawiarni może przeszkadzać, ale OLED w tej cenie to rewelacja."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "CzysteBiurko",
            "content": "Piękny setup! Skąd jest ta filcowa podkładka na drugim zdjęciu?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "BiurkoTech",
            "content": "Zwykła ciemnoszara podkładka filcowa z sieci za jakieś 50 zł!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "GamerMobilny",
            "content": "Czy da się podłączyć konsolę przenośną bezpośrednio bez docka?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "BiurkoTech",
            "content": "Wymaga podłączenia ładowarki do drugiego portu w monitorze, konsola sama nie daje rady."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Dyskusja",
        "memo": "Mini PC",
        "author": "CichySetup",
        "title": "Miesiąc po zamianie wielkiego PC na mini PC: moje wrażenia"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Pytanie",
        "memo": "Kawa w domu",
        "author": "KawoszPoranny",
        "title": "Polecany ręczny młynek do kawy do codziennego przelewu?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Porady",
        "memo": "Bateria",
        "author": "VoltManiak",
        "title": "Codzienne nawyki, które po cichu niszczą baterię w smartfonie i laptopie"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Rower",
        "author": "DwaKola",
        "title": "Weekendowa trasa rowerowa wzdłuż rzeki, jesienna pogoda zachwycała (Zdjęcia)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Soft",
        "memo": "Markdown",
        "author": "ProgramistaPL",
        "title": "Lekkie edytory Markdown open-source dla programistów i twórców"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Pytanie",
        "memo": "GaN 65W",
        "author": "CzysteKable",
        "title": "Szukam 3-portowej ładowarki GaN 65W z uziemieniem i niską temperaturą"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Test",
        "memo": "Ciche switche",
        "author": "KlawiaturyMechaniczne",
        "title": "Zmieniłem brązowe switche na ciche liniowe – niebo a ziemia!"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Setup",
        "memo": "Ramię monitora",
        "author": "PrzestrzenBiurka",
        "title": "Zamontowałem ramię na monitor: biurko zyskało mnóstwo miejsca"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Kuchnia",
        "memo": "Makaron 15min",
        "author": "SzybkiObiad",
        "title": "Szybki 15-minutowy makaron czosnkowo-maślany z jednej patelni"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "Wsk",
        "memo": "Triki CLI",
        "author": "Skryptowiec",
        "title": "Przydatne skróty i aliasy w terminalu zwiększające codzienną produktywność",
        "content": [
          {
            "type": "text",
            "value": "Zbiór przydatnych skrótów klawiszowych i aliasów, które oszczędzają mi masę czasu każdego dnia."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Wyszukiwanie wstecz w historii\n2. ctrl + a / ctrl + e: Początek/koniec linii\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "ProgramistaPL",
            "date": "11/09 10:22",
            "content": "ctrl + w do usuwania całego słowa to rewelacja.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "LinuxManiak",
            "date": "11/09 10:45",
            "content": "Do zsh polecam wtyczkę zsh-autosuggestions!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Spacer",
        "author": "ZłoteLiście",
        "title": "Poranny jesienny spacer wokół parku nad jeziorem, złote liście (Zdjęcia)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Rześki poranek nad jeziorem i mgła unosząca się nad taflą wody w jesiennej scenerii."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "Wędrowiec",
            "date": "11/09 08:52",
            "content": "Piękne, nastrojowe zdjęcie!",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Złoty zachód słońca nad spokojnymi falami morza",
        "author": "BryzaMorska",
        "category": "Natura"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Minimalistyczny salon skąpany w popołudniowym świetle",
        "author": "SkandynawskiDom",
        "category": "Wnętrze"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Weekendowa kawa przelewowa z przyjaciółmi",
        "author": "KawaMaster",
        "category": "Kawa"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Deszczowe popołudnie z ciepłymi refleksami bokeh",
        "author": "DeszczowyDzień",
        "category": "Nastrój"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Ręcznie toczone autorskie talerze ceramiczne",
        "author": "PracowniaGliny",
        "category": "Rzemiosło"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Mglisty poranek nad cichą górską rzeką",
        "author": "GórskiSzlak",
        "category": "Krajobraz"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Błękitna godzina nad aleją wielkiego miasta",
        "author": "MiejskiKadr",
        "category": "Miasto"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Świeży liść monstery rozwijający się w promieniach słońca",
        "author": "ZielonyKącik",
        "category": "Rośliny"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Przytulny kawiarniany kącik pośród bujnej zieleni",
        "author": "KawiarnianyStyl",
        "category": "Kawiarnia"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Majestatyczne ośnieżone szczyty pasma górskiego",
        "author": "ŚnieżneSzczyty",
        "category": "Szczyty"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Świeżo upieczone bochenki chleba na naturalnym zakwasie",
        "author": "ChlebNaZakwasie",
        "category": "Wypieki"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Galaktyka Andromedy świecąca na bezchmurnym nocnym niebie",
        "author": "PatrzącWGwiazdy",
        "category": "Kosmos"
      }
    ]
  },
  "tr": {
    "boardTitle": "Genel Topluluk",
    "menuGallery": "Fotoğraf Galerisi",
    "galleryTitle": "Fotoğraf Galerisi",
    "menuMainBoard": "Ana Forum",
    "menuSettings": "Ayarlar",
    "settingsTitle": "Ayarlar",
    "settingsMessage": "Topluluk tercihlerini ve görüntüleme dilini yapılandırın.",
    "langLabel": "Dil seçimi (Language)",
    "btnSave": "Kaydet",
    "btnCancel": "İptal",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "İnceleme",
        "memo": "OLED Ekran",
        "author": "MasaBasi",
        "title": "14 inç taşınabilir OLED monitör ile 1 haftalık dürüst deneyimim (Fotoğraflı)",
        "content": [
          {
            "type": "text",
            "value": "İndirim döneminde uygun fiyatlı 14 inç taşınabilir OLED monitör aldım. 2 haftada geldi ve bir haftadır ikincil ekran olarak günlük kullanıyorum."
          },
          {
            "type": "text",
            "value": "Fiyatından dolayı çok bir şey beklemiyordum ama kutudan çıkan CNC alüminyum gövde ve menteşe kalitesi beni şaşırttı."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Panel ve Görüntü Kalitesi\nOLED farkı çok net: derin siyahlar, canlı renkler ve laptop yanında keskin metinler. Kod yazarken ve dizi izlerken çok keyifli."
          },
          {
            "type": "text",
            "value": "2. Taşınabilirlik ve Tek Kablo\n600 gramdan hafif ve çantaya rahat sığıyor. Tek bir Type-C kablosuyla hem görüntü hem güç aktarmak seyahatlerde büyük rahatlık."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. Eksileri\nParlak (glossy) ekran arkada ışık varken yansıma yapıyor. Dahili hoparlörler zayıf, kulaklık şart."
          },
          {
            "type": "text",
            "value": "Sonuç\nHafif ve kaliteli taşınabilir bir ikinci ekran arayanlara kesinlikle öneririm."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "LaptopKullanicisi",
            "content": "Detaylı inceleme için teşekkürler! Laptop gücüyle %100 parlaklıkta titreme yapıyor mu?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "MasaBasi",
            "content": "Kutudan çıkan C-to-C kabloyla %100 parlaklıkta denedim, hiçbir titreme veya kopma olmadı."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "SesMeraklisi",
            "content": "Aydınlık ortamda parlak cam yansıma yapabilir ama bu fiyata OLED gerçekten fırsat."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "DuzenliMasa",
            "content": "Masa düzeniniz çok şık! İkinci fotoğraftaki keçe masa matını nereden aldınız?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "MasaBasi",
            "content": "İnternetten 150 TL civarına aldığım standart gri keçe masa pedi!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "MobilOyuncu",
            "content": "El konsollarını dock olmadan doğrudan bağlayabiliyor muyuz?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "MasaBasi",
            "content": "Konsol tek başına yeterli güç veremiyor, monitörün ikinci girişine şarj aleti takmanız gerekiyor."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Sohbet",
        "memo": "Mini PC",
        "author": "KompaktKod",
        "title": "Büyük masaüstü kasasını bırakıp mini PC'ye geçeli 1 ay oldu: izlenimler"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Soru",
        "memo": "Evde Kahve",
        "author": "KahveSever",
        "title": "Günlük filtre kahve için manuel el değirmeni önerisi olan var mı?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Bilgi",
        "memo": "Pil Sağlığı",
        "author": "VoltUzmanı",
        "title": "Cihaz batarya ömrünü sessizce tüketen yaygın günlük alışkanlıklar"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Hafta Sonu",
        "author": "İkiTeker",
        "title": "Hafta sonu nehir kenarı bisiklet turu, sonbahar havası harikaydı (Fotoğraflı)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Öneri",
        "memo": "Markdown",
        "author": "GeliştiriciTR",
        "title": "Geliştiriciler ve yazarlar için hafif açık kaynaklı Markdown editörleri"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Soru",
        "memo": "65W GaN",
        "author": "KabloDuzen",
        "title": "Isınması az, topraklı 3 portlu 65W GaN şarj aleti önerisi"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Deneyim",
        "memo": "Sessiz Switch",
        "author": "KlavyeTutkunu",
        "title": "Mekanik klavyede tactile switchten sessiz lineere geçtim: çağ atladım resmen"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Paylaşım",
        "memo": "Monitör Kolu",
        "author": "MinimalCalisma",
        "title": "Monitör kolları taktıktan sonra masada devasa yer açıldı"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Yemek",
        "memo": "Tek Tava Pasta",
        "author": "PratikSef",
        "title": "Hafta sonu öğle yemeği için 15 dakikalık sarımsaklı tereyağlı tek tava makarna"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "İpucu",
        "memo": "CLI Tüyoları",
        "author": "TerminalUstası",
        "title": "Günlük terminal kullanımında verimliliği artıran kısayollar ve alias rehberi",
        "content": [
          {
            "type": "text",
            "value": "Geliştirme sürecinde komut satırında işleri hızlandıran en sevdiğim kısayolları ve aliasları derledim."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Geçmiş komutlarda arama\n2. ctrl + a / ctrl + e: Satır başına/sonuna gitme\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "LinuxSever",
            "date": "11/09 10:22",
            "content": "ctrl + w ile kelime kelime silmek de büyük kolaylık.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "Kodcu",
            "date": "11/09 10:45",
            "content": "zsh kullananlara zsh-autosuggestions eklentisini tavsiye ederim!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Sonbahar",
        "author": "GüzRüzgarı",
        "title": "Sabah erken saatlerde göl kenarında sonbahar yürüyüşü ve renkler (Fotoğraflar)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Göl kenarında sabah sisi eşliğinde sonbaharın huzur dolu sakin atmosferi."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "DoğaDostu",
            "date": "11/09 08:52",
            "content": "Harika bir manzara, eline sağlık!",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Sakin dalgalar üzerinde altın rengi gün batımı",
        "author": "DenizEsintisi",
        "category": "Doğa"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Güneş ışığı alan minimalist İskandinav oturma odası",
        "author": "NordikEv",
        "category": "İç Mekan"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Hafta sonu arkadaşlarla paylaşılan filtre kahve",
        "author": "KahveUzmanı",
        "category": "Kahve"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Sıcak bokeh ışıklarıyla yağmurlu bir öğleden sonra",
        "author": "YağmurluGün",
        "category": "Atmosfer"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "El emeğiyle şekillendirilmiş seramik tabaklar",
        "author": "ToprakSanatı",
        "category": "Zanaat"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Sessiz nehir vadisinde sisli bir sabah başlangıcı",
        "author": "DağPatikası",
        "category": "Manzara"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Mavi saatte metropol caddelerinin ışıltısı",
        "author": "ŞehirObjektifi",
        "category": "Şehir"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Güneş ışığıyla parıldayan yeni monstera yaprağı",
        "author": "YeşilDünya",
        "category": "Bitkiler"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Yeşilliklerle çevrili samimi ve huzurlu kafe köşesi",
        "author": "KafeKeyfi",
        "category": "Kafe"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Karlarla kaplı görkemli alp dağ silsilesi",
        "author": "KarlıZirveler",
        "category": "Zirve"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Fırından yeni çıkmış çıtır çıtır ekşi mayalı köy ekmeği",
        "author": "EkşiMaya",
        "category": "Fırıncılık"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Derin gece gökyüzünde parlayan Andromeda galaksisi",
        "author": "YıldızGözcüsü",
        "category": "Astro"
      }
    ]
  },
  "th": {
    "boardTitle": "ชุมชนทั่วไป",
    "menuGallery": "แกลเลอรีภาพถ่าย",
    "galleryTitle": "แกลเลอรีภาพถ่าย",
    "menuMainBoard": "บอร์ดทั่วไป",
    "menuSettings": "การตั้งค่า",
    "settingsTitle": "การตั้งค่า",
    "settingsMessage": "กำหนดค่าการตั้งค่าชุมชนและภาษาที่แสดง",
    "langLabel": "เลือกภาษา (Language)",
    "btnSave": "บันทึก",
    "btnCancel": "ยกเลิก",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "รีวิว",
        "memo": "จอ OLED",
        "author": "คนรักโต๊ะคอม",
        "title": "รีวิวตรงไปตรงมาหลังใช้จอพกพา OLED 14\" ครบ 1 สัปดาห์ (มีรูป)",
        "content": [
          {
            "type": "text",
            "value": "กดสั่งจอพกพา OLED ขนาด 14 นิ้วราคาประหยัดมาช่วงโปรโมชั่น รอของประมาณ 2 สัปดาห์ ตอนนี้ใช้งานเป็นจอที่สองมาได้ 1 สัปดาห์แล้วครับ"
          },
          {
            "type": "text",
            "value": "ตอนแรกคิดว่าราคาไม่แพงคงไม่ได้คาดหวังอะไรมาก แต่พอแกะกล่องออกมา งานประกอบอลูมิเนียม CNC กับบานพับแน่นหนาเกินราคามาก"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. พาเนลและคุณภาพของภาพ\nจอ OLED คือของจริง สีดำสนิท คอนทราสต์สูง วางเทียบข้างแล็ปท็อปตัวหนังสือคมกริบ เหมาะมากกับการเขียนโค้ดธีมมืดและดูหนัง"
          },
          {
            "type": "text",
            "value": "2. พกพาสะดวกและเชื่อมต่อสายเดียว\nน้ำหนักไม่ถึง 600 กรัม ใส่ช่องกระเป๋าแล็ปท็อปได้สบาย สาย Type-C เส้นเดียวจ่ายทั้งไฟและภาพ ทำงานนอกบ้านสะดวกมาก"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. ข้อสังเกต\nหน้าจอเป็นแบบจอกระจก ถ้ามีไฟส่องด้านหลังจะมีแสงสะท้อน ส่วนลำโพงในตัวเสียงค่อนข้างแบน แนะนำต่อหูฟังดีกว่าครับ"
          },
          {
            "type": "text",
            "value": "สรุป\nใครกำลังมองหาจอเสริมพกพาที่น้ำหนักเบาและภาพสวย แนะนำตัวนี้เลยครับ"
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "แฟนแล็ปท็อป",
            "content": "รีวิวละเอียดมากครับ! ต่อไฟตรงจากแล็ปท็อปเปิดความสว่าง 100% มีอาการจอกะพริบไหมครับ?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "คนรักโต๊ะคอม",
            "content": "ไม่มีอาการกะพริบเลยครับ ใช้สาย C to C ที่แถมมาเปิด 100% นิ่งสนิทไม่มีหลุด"
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "สายเครื่องเสียง",
            "content": "จอกระจกในร้านกาแฟอาจมีสะท้อนบ้าง แต่ได้ OLED ราคานี้ก็คุ้มเกินค่าตัวแล้วครับ"
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "โต๊ะมินิมอล",
            "content": "จัดโต๊ะสวยมากครับ! แผ่นรองสักหลาดสีเทาในรูปที่ 2 ซื้อจากไหนเหรอครับ?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "คนรักโต๊ะคอม",
            "content": "แผ่นสักหลาดรองโต๊ะทั่วไปสั่งจากแอพส้มประมาณสองร้อยกว่าบาทครับ"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "เกมเมอร์พกพา",
            "content": "สามารถต่อตรงกับเครื่องเล่นเกมพกพาโดยไม่ผ่านด็อกได้ไหมครับ?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "คนรักโต๊ะคอม",
            "content": "ต้องเสียบสายชาร์จเข้าพอร์ตที่สองของจอด้วยครับ ลำพังตัวเครื่องเกมจ่ายไฟไม่พอขับหน้าจอ"
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "พูดคุย",
        "memo": "Mini PC",
        "author": "สายโค้ด",
        "title": "ความรู้สึกหลังเปลี่ยนจากคอมเคสยักษ์มาใช้ Mini PC ครบ 1 เดือน"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "ถามตอบ",
        "memo": "โฮมคาเฟ่",
        "author": "คอกาแฟ",
        "title": "มีเครื่องบดกาแฟมือหมุนตัวไหนแนะนำสำหรับดริปดื่มทุกวันบ้างครับ?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "สาระ",
        "memo": "สุขภาพแบต",
        "author": "กูรูไอที",
        "title": "พฤติกรรมในชีวิตประจำวันที่กำลังทำลายสุขภาพแบตเตอรี่อุปกรณ์ของคุณ"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "รูปภาพ",
        "memo": "ปั่นจักรยาน",
        "author": "สองล้อชิล",
        "title": "ปั่นจักรยานเลียบแม่น้ำวันหยุด อากาศฤดูใบไม้ร่วงดีมาก (มีรูป)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "แนะนำ",
        "memo": "Markdown",
        "author": "นักพัฒนา",
        "title": "รวม Markdown Editor โอเพ่นซอร์สสายเบาสำหรับโปรแกรมเมอร์และนักเขียน"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "ถามตอบ",
        "memo": "GaN 65W",
        "author": "จัดสายไฟ",
        "title": "หาหัวชาร์จ GaN 65W 3 พอร์ต มีสายดินและระบายความร้อนดีๆ แนะนำทีครับ"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "รีวิว",
        "memo": "สวิตช์เงียบ",
        "author": "คนชอบคีย์บอร์ด",
        "title": "เปลี่ยนจากสวิตช์สัมผัสมาเป็น Linear แบบเงียบ โลกเปลี่ยนไปเลย ฟินมาก"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "อวดโต๊ะ",
        "memo": "แขนจับจอ",
        "author": "แต่งโต๊ะทำงาน",
        "title": "ติดแขนจับจอช่วงวันหยุด โต๊ะทำงานกว้างขึ้นเป็นเท่าตัวเลย"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "ทำอาหาร",
        "memo": "พาสต้ากระทะเดียว",
        "author": "เชฟกระทะด่วน",
        "title": "พาสต้าเนยกระเทียมกระทะเดียว 15 นาที สำหรับมื้อเที่ยงวันหยุดแสนสบาย"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "ทิป",
        "memo": "เคล็ดลับ CLI",
        "author": "คนชอบเขียนสคริปต์",
        "title": "คีย์ลัดและคำสั่ง alias ในเทอร์มินัลที่ช่วยเพิ่มความเร็วในการทำงานทุกวัน",
        "content": [
          {
            "type": "text",
            "value": "รวมคีย์ลัดและ alias ที่ใช้เป็นประจำใน terminal ช่วยให้พิมพ์คำสั่งได้ไวขึ้นมากครับ"
          },
          {
            "type": "text",
            "value": "1. ctrl + r: ค้นหาประวัติคำสั่งย้อนหลัง\n2. ctrl + a / ctrl + e: เลื่อนไปต้น/ท้ายบรรทัด\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "สายเดฟ",
            "date": "11/09 10:22",
            "content": "ctrl + w ลบทีละคำก็ใช้สะดวกมากๆ ครับ",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "โปรแกรมเมอร์",
            "date": "11/09 10:45",
            "content": "แนะนำปลั๊กอิน zsh-autosuggestions เลยครับ ชีวิตดีขึ้นเยอะ",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "รูป",
        "memo": "เดินเล่น",
        "author": "ใบไม้เปลี่ยนสี",
        "title": "เดินเล่นรับลมหนาวยามเช้าที่สวนสาธารณะริมทะเลสาบและใบไม้เปลี่ยนสี (รูปภาพ)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "เดินรับลมเช้าสดชื่นริมทะเลสาบ หมอกจางๆ กับสีสันของฤดูใบไม้ร่วงสวยงามมากครับ"
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "สายธรรมชาติ",
            "date": "11/09 08:52",
            "content": "บรรยากาศดีมากๆ เลยครับ สบายตามาก",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "แสงพระอาทิตย์ตกสีทองเหนือคลื่นทะเลสงบ",
        "author": "สายลมทะเล",
        "category": "ธรรมชาติ"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "ห้องนั่งเล่นสไตล์นอร์ดิกท่ามกลางแสงแดดยามบ่าย",
        "author": "บ้านนอร์ดิก",
        "category": "การตกแต่ง"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "กาแฟดริปยามบ่ายกับเพื่อนสนิทในวันหยุดสุดสัปดาห์",
        "author": "บาริสต้า",
        "category": "กาแฟ"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "บ่ายวันฝนตกกับแสงโบเก้อบอุ่นริมหน้าต่าง",
        "author": "วันฝนตก",
        "category": "อารมณ์"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "คอลเลกชันจานเซรามิกทำมือสุดประณีต",
        "author": "เครื่องปั้นดินเผา",
        "category": "งานฝีมือ"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "ยามเช้าหมอกลงริมลำธารในหุบเขาอันเงียบสงบ",
        "author": "นักเดินเขา",
        "category": "ทิวทัศน์"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "แสงทไวไลท์สีน้ำเงินเหนือตึกระฟ้าใจกลางเมือง",
        "author": "คนมองเมือง",
        "category": "เมือง"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "ใบมอนสเตอร่าที่กำลังผลิใบรับแสงแดดอุ่น",
        "author": "คนรักต้นไม้",
        "category": "ต้นไม้"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "มุมคาเฟ่บรรยากาศอบอุ่นท่ามกลางต้นไม้เขียวขจี",
        "author": "มุมกาแฟ",
        "category": "คาเฟ่"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "เทือกเขาแอลป์ที่ปกคลุมด้วยหิมะขาวโพลน",
        "author": "ยอดเขาหิมะ",
        "category": "ภูเขา"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "ขนมปังซาวเออร์โดว์อบสดใหม่ส่งกลิ่นหอมกรุ่น",
        "author": "ซาวเออร์โด",
        "category": "การอบขนม"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "กาแล็กซีแอนโดรเมดาเปล่งประกายในท้องฟ้ายามค่ำคืน",
        "author": "นักดูดาว",
        "category": "ดาราศาสตร์"
      }
    ]
  },
  "vi": {
    "boardTitle": "Cộng đồng chung",
    "menuGallery": "Bộ Sưu Tập Ảnh",
    "galleryTitle": "Bộ Sưu Tập Ảnh",
    "menuMainBoard": "Diễn Đàn Chung",
    "menuSettings": "Cài đặt",
    "settingsTitle": "Cài đặt",
    "settingsMessage": "Tùy chỉnh tùy chọn cộng đồng và ngôn ngữ hiển thị.",
    "langLabel": "Chọn ngôn ngữ (Language)",
    "btnSave": "Lưu",
    "btnCancel": "Hủy",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Đánh giá",
        "memo": "Màn OLED",
        "author": "GocLamViec",
        "title": "Đánh giá thật sau 1 tuần dùng màn hình di động OLED 14\" (Kèm ảnh)",
        "content": [
          {
            "type": "text",
            "value": "Săn được chiếc màn hình di động OLED 14 inch giá rẻ đợt sale. Mất 2 tuần vận chuyển và mình đã dùng liên tục 1 tuần làm màn phụ cho laptop."
          },
          {
            "type": "text",
            "value": "Giá rẻ nên ban đầu không kỳ vọng nhiều, chỉ cần thêm màn hình khi đi cà phê. Nhưng khi mở hộp, khung nhôm CNC và bản lề cứng cáp làm mình bất ngờ."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Tấm nền và chất lượng hiển thị\nOLED màu đen tuyệt đối, độ tương phản cao, chữ nét căng bên cạnh laptop. Code theme tối hoặc xem phim rất đã mắt."
          },
          {
            "type": "text",
            "value": "2. Độ cơ động và cắm 1 dây duy nhất\nNặng chưa tới 600g nhét vừa ngăn balo. Chỉ cần một sợi cáp Type-C là có cả nguồn và hình ảnh, đi công tác cực kỳ tiện lợi."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. Điểm chưa ưng\nMàn gương nên ngồi ngược sáng sẽ bị bóng. Loa ngoài chống điếc thôi, nên cắm tai nghe."
          },
          {
            "type": "text",
            "value": "Tổng kết\nAi cần màn hình phụ gọn nhẹ, hình ảnh đẹp để mang đi lại thì rất đáng cân nhắc."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "YeuLaptop",
            "content": "Bài viết chi tiết quá! Cắm thẳng laptop bật 100% độ sáng có bị chớp giật không bạn?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "GocLamViec",
            "content": "Không hề bị nhé, dùng dây C-to-C đi kèm mở 100% sáng vẫn rất ổn định."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "DanChoiTaiNghe",
            "content": "Màn gương ở quán cà phê hơi chói xíu nhưng giá này có OLED thì quá hời rồi."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "BanGheDep",
            "content": "Góc làm việc nhìn gọn quá! Tấm thảm nỉ xám ở ảnh 2 mua ở đâu thế bạn?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "GocLamViec",
            "content": "Thảm nỉ lót bàn phổ thông mình đặt online tầm hơn trăm nghìn thôi bạn!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "GamerCamTay",
            "content": "Màn này cắm trực tiếp máy chơi game cầm tay không qua dock được không?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "GocLamViec",
            "content": "Cần cắm thêm sạc vào cổng thứ hai của màn hình nhé, máy game không đủ nguồn kéo màn hình."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Tán gẫu",
        "memo": "Mini PC",
        "author": "LapTrinhVien",
        "title": "Trải nghiệm 1 tháng sau khi thanh lý case PC cồng kềnh sang Mini PC"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Hỏi đáp",
        "memo": "Cà phê tại nhà",
        "author": "TachCaPhe",
        "title": "Có cối xay cà phê cầm tay nào tốt cho pour-over hàng ngày không mọi người?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Mẹo hay",
        "memo": "Pin thiết bị",
        "author": "YeuCongNghe",
        "title": "Những thói quen phổ biến đang âm thầm làm chai pin thiết bị của bạn"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Ảnh đẹp",
        "memo": "Đạp xe",
        "author": "HaiBanh",
        "title": "Cuối tuần đạp xe ven sông, thời tiết mùa thu mát mẻ tuyệt vời (Kèm ảnh)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Chia sẻ",
        "memo": "Markdown",
        "author": "DanCode",
        "title": "Tổng hợp trình soạn thảo Markdown mã nguồn mở nhẹ nhàng cho lập trình viên"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Hỏi đáp",
        "memo": "GaN 65W",
        "author": "GocSetup",
        "title": "Tìm củ sạc GaN 65W 3 cổng có nối đất tản nhiệt tốt"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Review",
        "memo": "Switch êm",
        "author": "NghienPhim",
        "title": "Đổi từ switch cơ tactile sang linear silent: cảm giác gõ êm ái khác hẳn"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Khoe góc",
        "memo": "Tay nâng màn",
        "author": "DecorBanHoc",
        "title": "Lắp tay nâng màn hình cuối tuần: mặt bàn rộng thênh thang"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Ẩm thực",
        "memo": "Mỳ Ý một chảo",
        "author": "DauBepTaiGia",
        "title": "Món mỳ Ý bơ tỏi 15 phút nấu một chảo siêu nhanh cho bữa trưa"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "Mẹo",
        "memo": "Mẹo dòng lệnh",
        "author": "ThợLậpTrình",
        "title": "Tổng hợp phím tắt và alias hữu ích giúp tăng năng suất làm việc trên terminal",
        "content": [
          {
            "type": "text",
            "value": "Chia sẻ với mọi người một vài phím tắt và alias mà mình dùng hàng ngày để gõ lệnh nhanh hơn gấp bội."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Tìm kiếm lịch sử lệnh\n2. ctrl + a / ctrl + e: Về đầu / cuối dòng\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "DevChămChỉ",
            "date": "11/09 10:22",
            "content": "ctrl + w để xóa lùi từng từ cũng siêu tiện luôn.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "BạnLinux",
            "date": "11/09 10:45",
            "content": "Dùng zsh thì nhất định phải cài zsh-autosuggestions nhé!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Ảnh",
        "memo": "Dạo thu",
        "author": "MùaThuVàng",
        "title": "Đi dạo sáng sớm quanh công viên hồ, không khí mùa thu trong lành tuyệt đẹp (Ảnh)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Buổi sáng trong lành dạo bước bên hồ, làn sương mỏng giăng trên mặt nước thật yên bình."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "NgườiYêuThiênNhiên",
            "date": "11/09 08:52",
            "content": "Cảnh đẹp và thanh bình quá bạn ơi!",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Hoàng hôn dát vàng trên làn sóng biển êm ả",
        "author": "GióBiển",
        "category": "Tự nhiên"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Phòng khách tối giản tràn ngập ánh nắng ban chiều",
        "author": "NhàBắcÂu",
        "category": "Nội thất"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Tách cà phê thủ công cùng bạn bè ngày cuối tuần",
        "author": "ThợRangXay",
        "category": "Cà phê"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Chiều mưa bên cửa sổ với ánh đèn bokeh ấm áp",
        "author": "ChiềuMưa",
        "category": "Cảm xúc"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Bộ sưu tập đĩa gốm thủ công mộc mạc tinh tế",
        "author": "GốmMộc",
        "category": "Thủ công"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Bình minh sương giăng trên dòng suối thung lũng",
        "author": "LốiNhỏTrênNúi",
        "category": "Phong cảnh"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Giờ xanh huyền ảo bao trùm đại lộ đô thị",
        "author": "GócĐôThị",
        "category": "Đô thị"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Chiếc lá trầu bà non tươi tốt vươn mình đón nắng",
        "author": "YêuCây",
        "category": "Cây xanh"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Góc quán cà phê ngập tràn sắc xanh thanh bình",
        "author": "GócCàPhê",
        "category": "Quán cà phê"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Dãy núi phủ tuyết trắng hùng vĩ giữa trời xanh",
        "author": "ĐỉnhBăngTuyết",
        "category": "Đỉnh núi"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Bánh mì sourdough giòn rụm vừa mới ra lò",
        "author": "BánhMìMenTựNhiên",
        "category": "Làm bánh"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Thiên hà Andromeda lung linh giữa bầu trời đêm sâu thẳm",
        "author": "NgắmSaoĐêm",
        "category": "Thiên văn"
      }
    ]
  },
  "id": {
    "boardTitle": "Komunitas Umum",
    "menuGallery": "Galeri Foto",
    "galleryTitle": "Galeri Foto",
    "menuMainBoard": "Papan Diskusi",
    "menuSettings": "Pengaturan",
    "settingsTitle": "Pengaturan",
    "settingsMessage": "Konfigurasi preferensi komunitas dan bahasa tampilan.",
    "langLabel": "Pilih Bahasa (Language)",
    "btnSave": "Simpan",
    "btnCancel": "Batal",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Ulasan",
        "memo": "Layar OLED",
        "author": "MejaMinimalis",
        "title": "Ulasan jujur 1 minggu pakai monitor portabel OLED 14\" (Plus Foto)",
        "content": [
          {
            "type": "text",
            "value": "Beli monitor portabel OLED 14 inci murah saat promo. Pengiriman sekitar dua minggu dan sudah seminggu saya pakai setiap hari sebagai layar kedua."
          },
          {
            "type": "text",
            "value": "Awalnya tidak berharap muluk-muluk karena harganya murah. Namun bodi aluminium CNC dan engselnya yang kokoh bikin kagum."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. Kualitas Layar dan Warna\nPanel OLED tidak mengecewakan: warna hitam pekat, kontras tinggi, dan teks tajam di samping laptop. Nyaman banget untuk coding tema gelap."
          },
          {
            "type": "text",
            "value": "2. Ringan dan Praktis Satu Kabel\nBeratnya di bawah 600g, mudah masuk ransel. Cukup satu kabel Type-C untuk display dan daya, sangat praktis saat kerja di kafe."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. Kekurangan\nLayar glossy memantulkan cahaya lampu di belakang. Speaker bawaan seadanya, lebih baik pakai headphone."
          },
          {
            "type": "text",
            "value": "Kesimpulan\nBagi yang butuh monitor tambahan portabel dan berkualitas untuk kerja mobile, ini pilihan mantap."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "PenggunaLaptop",
            "content": "Ulasan menarik! Kalau daya cuma dari laptop di kecerahan 100% ada kedip-kedip tidak?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "MejaMinimalis",
            "content": "Sama sekali tidak kedip, dites 100% pakai kabel bawaan sangat stabil."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "PecintaAudio",
            "content": "Layar glossy di tempat terang agak memantul, tapi dapat OLED harga segini sudah untung besar."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "MejaBersih",
            "content": "Setup mejanya rapi banget! Beli desk pad abu-abu di foto kedua di mana ya?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "MejaMinimalis",
            "content": "Desk pad felt biasa beli online sekitar seratus ribuan saja!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "GamerPortabel",
            "content": "Bisa langsung colok konsol game handheld tanpa dock?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "MejaMinimalis",
            "content": "Harus colok charger ke port kedua monitor, daya konsol handheld saja tidak kuat mengangkat layarnya."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Santai",
        "memo": "Mini PC",
        "author": "PengrajinKode",
        "title": "Satu bulan setelah ganti PC desktop bongsor ke Mini PC: pengalaman nyata"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Tanya",
        "memo": "Kopi Rumahan",
        "author": "PecintaEspresso",
        "title": "Rekomendasi grinder manual yang bagus untuk seduh kopi harian?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "Info",
        "memo": "Kesehatan Baterai",
        "author": "TeknoBaterai",
        "title": "Kebiasaan sehari-hari yang diam-diam merusak kesehatan baterai gadget"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Gowes Santai",
        "author": "DuaRoda",
        "title": "Gowes sore tepi sungai akhir pekan kemarin, cuacanya segar banget (Foto)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "Tips",
        "memo": "Markdown",
        "author": "SyntaxDev",
        "title": "Editor Markdown open-source ringan untuk developer dan penulis"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "Tanya",
        "memo": "GaN 65W",
        "author": "KabelRapi",
        "title": "Mencari charger GaN 65W 3 port ber-grounding yang adem"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Ulasan",
        "memo": "Switch Hening",
        "author": "KetukanKeyboard",
        "title": "Pindah dari switch tactile ke linear silent: heningnya beda jauh!"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "Pamer",
        "memo": "Bracket Monitor",
        "author": "WorkspaceIdaman",
        "title": "Pasang monitor arm akhir pekan lalu, meja kerja langsung lega banget"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "Masak",
        "memo": "Pasta Satu Wajan",
        "author": "KokiRumahan",
        "title": "Pasta mentega bawang putih 15 menit satu wajan untuk makan siang praktis"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "Tips",
        "memo": "Trik CLI",
        "author": "PenggiatSkrip",
        "title": "Kumpulan shortcut dan alias terminal CLI yang sangat berguna untuk produktivitas",
        "content": [
          {
            "type": "text",
            "value": "Bekerja seharian di terminal terasa jauh lebih cepat dengan menerapkan shortcut dan alias ini."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: Pencarian riwayat perintah\n2. ctrl + a / ctrl + e: Pindah ke awal/akhir baris\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "ProgrammerSantai",
            "date": "11/09 10:22",
            "content": "ctrl + w buat hapus per kata juga sangat membantu!",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "KawanTerminal",
            "date": "11/09 10:45",
            "content": "Jangan lupa pasang plugin zsh-autosuggestions ya.",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "Foto",
        "memo": "Jalan Pagi",
        "author": "DaunGugur",
        "title": "Jalan pagi menyegarkan di taman tepi danau dengan suasana musim gugur yang indah (Foto)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "Udara sejuk pagi hari di tepi danau dengan kabut tipis dan warna dedaunan yang menawan."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "PecintaAlam",
            "date": "11/09 08:52",
            "content": "Foto yang sangat menenangkan pikiran.",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "Matahari terbenam keemasan di atas ombak tenang",
        "author": "AnginLaut",
        "category": "Alam"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "Ruang keluarga minimalis disinari hangatnya cahaya mentari",
        "author": "RumahNordik",
        "category": "Interior"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "Secangkir kopi seduh manual bersama sahabat di akhir pekan",
        "author": "PeracikKopi",
        "category": "Kopi"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "Sore berhujan di balik jendela dengan pantulan bokeh hangat",
        "author": "HariHujan",
        "category": "Suasana"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "Koleksi piring keramik buatan tangan seniman lokal",
        "author": "KaryaTanahLiat",
        "category": "Kerajinan"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "Pagi berkabut di tepi sungai lembah yang sunyi",
        "author": "PecintaJalan",
        "category": "Pemandangan"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "Pesona blue hour di atas jalanan kota metropolitan",
        "author": "LensaKota",
        "category": "Kota"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "Daun monstera hijau segar yang bermekaran di bawah sinar matahari",
        "author": "PecintaTanaman",
        "category": "Tanaman"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "Sudut kafe botani yang nyaman dan asri",
        "author": "CeritaKafe",
        "category": "Kafe"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "Pegunungan megah berselimut salju abadi",
        "author": "PuncakBersalju",
        "category": "Puncak"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "Roti sourdough renyah beraroma khas yang baru dipanggang",
        "author": "PembuatRoti",
        "category": "Membuat Roti"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "Galaksi Andromeda berkilau di langit malam yang jernih",
        "author": "PenatapBintang",
        "category": "Astro"
      }
    ]
  },
  "hi": {
    "boardTitle": "सामान्य समुदाय",
    "menuGallery": "फ़ोटो गैलरी",
    "galleryTitle": "फ़ोटो गैलरी",
    "menuMainBoard": "मुख्य बोर्ड",
    "menuSettings": "सेटिंग्स",
    "settingsTitle": "सेटिंग्स",
    "settingsMessage": "समुदाय प्राथमिकताएं और भाषा कॉन्फ़िगर करें।",
    "langLabel": "भाषा चुनें (Language)",
    "btnSave": "सहेजें",
    "btnCancel": "रद्द करें",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "समीक्षा",
        "memo": "OLED स्क्रीन",
        "author": "डेस्कयात्री",
        "title": "14\" पोर्टेबल OLED मॉनिटर की 1 सप्ताह की ईमानदार समीक्षा (तस्वीरें)",
        "content": [
          {
            "type": "text",
            "value": "सेल के दौरान एक किफायती 14-इंच पोर्टेबल OLED मॉनिटर खरीदा। इसे आने में दो सप्ताह लगे और मैं एक सप्ताह से इसे सेकेंडरी डिस्प्ले के रूप में इस्तेमाल कर रहा हूँ।"
          },
          {
            "type": "text",
            "value": "कम कीमत की वजह से बहुत उम्मीद नहीं थी, बस यात्रा के लिए एक स्क्रीन चाहिए थी। लेकिन डिब्बा खोलते ही एल्युमिनियम सीएनसी चेसिस और मजबूत हिंज देखकर प्रभावित हुआ।"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. पैनल और डिस्प्ले क्वालिटी\nOLED पैनल वाकई शानदार है। गहरा काला रंग, बेहतरीन कंट्रास्ट और लैपटॉप के बगल में क्रिस्प टेक्स्ट। डार्क मोड कोडिंग और फिल्में देखने के लिए लाजवाब।"
          },
          {
            "type": "text",
            "value": "2. पोर्टेबिलिटी और सिंगल केबल सेटअप\nवजन 600 ग्राम से भी कम है और बैकपैक में आसानी से आ जाता है। एक सिंगल टाइप-सी केबल से वीडियो और पावर दोनों का चलना बेहद सुविधाजनक है।"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. कुछ कमियां\nग्लॉसी स्क्रीन होने की वजह से पीछे की लाइट रिफ्लेक्ट होती है। इनबिल्ट स्पीकर सामान्य हैं, बेहतर होगा कि हेडफोन इस्तेमाल करें।"
          },
          {
            "type": "text",
            "value": "निष्कर्ष\nजो लोग काम के लिए हल्का और शानदार डिस्प्ले वाला सेकेंडरी मॉनिटर ढूंढ रहे हैं, उनके लिए यह बेहतरीन विकल्प है।"
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "लैपटॉपफैन",
            "content": "शानदार समीक्षा! क्या लैपटॉप के यूएसबी-सी से 100% ब्राइटनेस पर बिना झिलमिलाहट के चलता है?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "डेस्कयात्री",
            "content": "हाँ, साथ आई सी-टू-सी केबल से 100% ब्राइटनेस पर बिल्कुल स्थिर काम कर रहा है।"
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "ऑडियोप्रेमी",
            "content": "तेज रोशनी में ग्लॉसी स्क्रीन थोड़ी परेशान कर सकती है, पर इस कीमत पर OLED मिलना बड़ी बात है।"
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "क्लीनडेस्क",
            "content": "सेटअप बहुत सुंदर लग रहा है! दूसरी तस्वीर वाला फेल्ट डेस्क मैट कहाँ से लिया?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "डेस्कयात्री",
            "content": "ऑनलाइन स्टोर से लिया एक सामान्य डार्क ग्रे फेल्ट मैट है, करीब 800 रुपये का पड़ा!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "हैंडहेल्डगेमर",
            "content": "क्या बिना डॉक के हैंडहेल्ड गेमिंग कंसोल को सीधे कनेक्ट कर सकते हैं?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "डेस्कयात्री",
            "content": "कंसोल अकेला पर्याप्त पावर नहीं देता, इसलिए मॉनिटर के दूसरे पोर्ट में चार्जर लगाना पड़ेगा।"
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "चर्चा",
        "memo": "मिनी पीसी",
        "author": "कोडमास्टर",
        "title": "भारी डेस्कटॉप टॉवर छोड़कर मिनी पीसी अपनाने के एक महीने बाद का अनुभव"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "प्रश्न",
        "memo": "होम कैफे",
        "author": "कॉफीप्रेमी",
        "title": "दैनिक फिल्टर कॉफी के लिए कौन सा मैनुअल ग्राइंडर सबसे अच्छा है?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "ज्ञान",
        "memo": "बैटरी लाइफ",
        "author": "टेकगुरु",
        "title": "रोजमर्रा की आम आदतें जो आपके डिवाइस की बैटरी लाइफ को चुपचाप खराब करती हैं"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "फोटो",
        "memo": "साइकिल यात्रा",
        "author": "दोपहिया",
        "title": "वीकेंड पर नदी किनारे साइकिल राइड, शरद ऋतु का मौसम अद्भुत था (तस्वीरें)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "टूल",
        "memo": "मार्कडाउन",
        "author": "डेवलपरमित्र",
        "title": "डेवलपर्स और लेखकों के लिए हल्के ओपन-सोर्स मार्कडाउन एडिटर्स"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "प्रश्न",
        "memo": "65W GaN",
        "author": "केबलव्यवस्थित",
        "title": "बेहतर कूलिंग और ग्राउंडिंग वाला 3-पोर्ट 65W GaN चार्जर सुझाएं"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "समीक्षा",
        "memo": "साइलेंट स्विच",
        "author": "कीबोर्डदीवाना",
        "title": "टैक्टाइल मैकेनिकल स्विच से साइलेंट लीनियर पर स्विच किया: दिन-रात का अंतर!"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "सेटअप",
        "memo": "मॉनिटर आर्म",
        "author": "डेस्कशौकीन",
        "title": "वीकेंड पर मॉनिटर आर्म लगाया और डेस्क पर बहुत सारी जगह खाली हो गई"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "रसोई",
        "memo": "क्विक पास्ता",
        "author": "घरकाबावर्ची",
        "title": "आलसी वीकेंड लंच के लिए 15 मिनट में बनने वाला वन-पैन गार्लिक बटर पास्ता"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "सुझाव",
        "memo": "टर्मिनल टिप्स",
        "author": "शेलकोडर",
        "title": "रोज़मर्रा के टर्मिनल काम को आसान बनाने वाले उपयोगी शॉर्टकट और एलियास",
        "content": [
          {
            "type": "text",
            "value": "कमांड लाइन में हर दिन काम करते हुए ये शॉर्टकट और एलियास मेरे काम को बहुत तेज़ बना देते हैं।"
          },
          {
            "type": "text",
            "value": "1. ctrl + r: पुरानी कमांड खोजना\n2. ctrl + a / ctrl + e: लाइन के शुरुआत/अंत में जाना\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "लिनक्सप्रेमी",
            "date": "11/09 10:22",
            "content": "ctrl + w से पूरा शब्द मिटाना भी बहुत काम आता है।",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "डेवलपर",
            "date": "11/09 10:45",
            "content": "zsh इस्तेमाल करते हैं तो zsh-autosuggestions ज़रूर लगाएं!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "चित्र",
        "memo": "सुबह की सैर",
        "author": "पतझड़प्रेमी",
        "title": "झील के किनारे सुबह की ताज़ा सैर और पतझड़ के खूबसूरत सुनहरे रंग (तस्वीरें)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "सुबह झील के किनारे हल्की धुंध और शांत माहौल का आनंद लेते हुए ली गई एक सुंदर तस्वीर।"
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "प्रकृतिप्रेमी",
            "date": "11/09 08:52",
            "content": "बहुत ही सुकून देने वाला दृश्य!",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "शांत लहरों पर ढलते सूरज की सुनहरी किरणें",
        "author": "सागरहवा",
        "category": "प्रकृति"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "दोपहर की धूप में खिला हुआ सुंदर लिविंग रूम",
        "author": "नॉर्डिकहोम",
        "category": "गृह सज्जा"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "सप्ताहांत पर दोस्तों संग ताज़ा फ़िल्टर कॉफ़ी",
        "author": "कॉफ़ीमास्टर",
        "category": "कॉफ़ी"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "खिड़की पर बारिश की बूंदें और खूबसूरत बोकेह",
        "author": "बारिशीशाम",
        "category": "एहसास"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "हाथ से तराशे गए मिट्टी के सुंदर प्लेट्स",
        "author": "माटीकला",
        "category": "शिल्प"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "शांत घाटी में सुबह की धुंध और कलकल बहती नदी",
        "author": "पर्वतपथिक",
        "category": "प्राकृतिक दृश्य"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "शाम के धुंधलके में जगमगाती महानगर की सड़कें",
        "author": "शहरीदृष्टि",
        "category": "शहर"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "धूप में अपनी नई पत्ती खोलता सुंदर मॉन्स्टेरा",
        "author": "हरियाली",
        "category": "पौधे"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "हरी-भरी पत्तियों से सजी एक शांत कैफ़े टेबल",
        "author": "कैफ़ेकोना",
        "category": "कैफ़े"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "बर्फ की चादर ओढ़े आल्प्स पर्वत श्रृंखला",
        "author": "हिमशिखर",
        "category": "शिखर"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "ओवन से ताज़ा निकला कुरकुरा कारीगरी ब्रेड",
        "author": "सॉवरडो",
        "category": "बेकिंग"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "अंधेरी रात के साए में चमकती एंड्रोमेडा आकाशगंगा",
        "author": "तारामंडल",
        "category": "अंतरिक्ष"
      }
    ]
  },
  "bn": {
    "boardTitle": "সাধারণ সম্প্রদায়",
    "menuGallery": "ফটো গ্যালারি",
    "galleryTitle": "ফটো গ্যালারি",
    "menuMainBoard": "মূল ফোরাম",
    "menuSettings": "সেটিংস",
    "settingsTitle": "সেটিংস",
    "settingsMessage": "কমিউনিটি পছন্দ এবং প্রদর্শনের ভাষা কনফিগার করুন।",
    "langLabel": "ভাষা নির্বাচন করুন (Language)",
    "btnSave": "সংরক্ষণ",
    "btnCancel": "বাতিল",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "রিভিউ",
        "memo": "OLED স্ক্রিন",
        "author": "ডেস্কযাত্রী",
        "title": "১৪\" পোর্টেবল OLED মনিটরের ১ সপ্তাহের সৎ রিভিউ (ছবিসহ)",
        "content": [
          {
            "type": "text",
            "value": "অফারের সময়ে একটি সাশ্রয়ী ১৪-ইঞ্চি পোর্টেবল OLED মনিটর নিয়েছিলাম। ডেলিভারি হতে দুই সপ্তাহ লাগল এবং টানা এক সপ্তাহ ধরে এটি দ্বিতীয় স্ক্রিন হিসেবে ব্যবহার করছি।"
          },
          {
            "type": "text",
            "value": "কম দাম হওয়ায় খুব বেশি প্রত্যাশা ছিল না। তবে বক্স খুলেই সিএনসি অ্যালুমিনিয়াম বডি আর শক্ত কব্জা দেখে সত্যিই অবাক হয়েছি।"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "১. ডিসপ্লে প্যানেল ও ছবির মান\nOLED ডিসপ্লে অসাধারণ! নিখুঁত কালো রঙ, চমৎকার বৈসাদৃশ্য আর ল্যাপটপের পাশে ঝকঝকে ফন্ট। ডার্ক মোডে কোডিং বা রাতে ভিডিও দেখতে দারুন লাগে।"
          },
          {
            "type": "text",
            "value": "২. বহনযোগ্যতা ও সিঙ্গেল কেবল সংযোগ\nওজন ৬০০ গ্রামেরও কম, ব্যাগে অনায়াসে এঁটে যায়। একটি মাত্র টাইপ-সি ক্যাবল দিয়ে ভিডিও ও পাওয়ার দুটোই কাজ করে, ক্যাফেতে কাজের জন্য একদম নিখুঁত।"
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "৩. কিছু সীমাবদ্ধতা\nচকচকে গ্লসি স্ক্রিন হওয়ায় পিছনের আলো প্রতিফলিত হয়। ভেতরের স্পিকারগুলো খুব সাধারণ মানের, তাই হেডফোন ব্যবহার করাই ভালো।"
          },
          {
            "type": "text",
            "value": "উপসংহার\nযারা কাজের জন্য হালকা ও প্রিমিয়াম মানের পোর্টবল স্ক্রিন খুঁজছেন, তারা চোখ বন্ধ করে নিতে পারেন।"
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "ল্যাপটপইউজার",
            "content": "দারুন রিভিউ! ল্যাপটপ থেকে সরাসরি পাওয়ার দিয়ে ১০০% ব্রাইটনেসে কোনো সমস্যা হয়?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "ডেস্কযাত্রী",
            "content": "না, বক্সের সাথে দেওয়া ক্যাবল দিয়ে ১০০% ব্রাইটনেসে একদম স্মুথ চলছে।"
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "অডিওপ্রেমী",
            "content": "ক্যাফেতে আলোর প্রতিফলন একটু লাগতে পারে, তবে এই বাজেটে OLED পাওয়া সত্যিই ভাগ্যের ব্যাপার।"
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "পরিচ্ছন্নডেস্ক",
            "content": "ডেস্ক সেটআপটি খুব সুন্দর! দ্বিতীয় ছবির ধূসর টেবিল ম্যাটটি কোথা থেকে নেওয়া?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "ডেস্কযাত্রী",
            "content": "অনলাইন শপ থেকে কেনা সাধারণ ডার্ক গ্রে ফেল্ট ম্যাট, দাম খুব বেশি নয়!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "পোর্টেবলগেমার",
            "content": "ডক ছাড়া পোর্টেবল গেমিং কনসোল সরাসরি লাগানো যাবে কি?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "ডেস্কযাত্রী",
            "content": "কনসোল পর্যাপ্ত পাওয়ার দিতে পারে না, তাই মনিটরের দ্বিতীয় পোর্টে চার্জার লাগাতে হবে।"
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "আড্ডা",
        "memo": "মিনি পিসি",
        "author": "কোডপ্রেমী",
        "title": "ভারী ডেস্কটপ ছেড়ে মিনি পিসিতে আসার এক মাস পরের অভিজ্ঞতা"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "জিজ্ঞাসা",
        "memo": "হোম ক্যাফে",
        "author": "কফিপাগল",
        "title": "প্রতিদিনের ফিল্টার কফির জন্য ভালো হ্যান্ড গ্রাইন্ডারের পরামর্শ দিন?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "তথ্য",
        "memo": "ব্যাটারি লাইফ",
        "author": "টেকগুরু",
        "title": "নিত্যদিনের কিছু ভুল অভ্যাস যা নীরবে আপনার ডিভাইসের ব্যাটারি নষ্ট করছে"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "ছবি",
        "memo": "সাইকেল রাইড",
        "author": "দুইচাকা",
        "title": "ছুটির দিনে নদীর পাড়ে সাইকেল রাইড, শরতের চমৎকার আবহাওয়া (ছবি)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "টুলস",
        "memo": "মার্কডাউন",
        "author": "ডেভেলপারভাই",
        "title": "ডেভেলপার ও লেখকদের জন্য হালকা ওপেন-সোর্স মার্কডাউন এডিটর"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "জিজ্ঞাসা",
        "memo": "65W GaN",
        "author": "গোছানোটেবিল",
        "title": "ভালো কুলিং ও গ্রাউন্ডিংযুক্ত ৩-পোর্ট ৬৫ ওয়াট GaN চার্জারের খোঁজ চাই"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "রিভিউ",
        "memo": "সাইলেন্ট সুইচ",
        "author": "কীবোর্ডপ্রেমী",
        "title": "ট্যাকটাইল মেকানিক্যাল সুইচ থেকে সাইলেন্ট লিনিয়ারে শিফট: দিন-রাতের পার্থক্য!"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "সেটআপ",
        "memo": "মনিটর আর্ম",
        "author": "ডেস্কসজ্জা",
        "title": "ছুটির দিনে মনিটর আর্ম বসালাম, টেবিলের অর্ধেকের বেশি জায়গা ফাঁকা হলো"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "রান্না",
        "memo": "পাস্তা রেসিপি",
        "author": "সহজরান্না",
        "title": "ছুটির দুপুরের জন্য ১৫ মিনিটে এক কড়াইয়ে তৈরি রসুন-বাটার পাস্তা"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "টিপস",
        "memo": "টার্মিনাল টিপস",
        "author": "শেলকোডার",
        "title": "টার্মিনালে কাজের গতি বাড়াতে প্রতিদিনের দরকারি কিছু শর্টকাট ও অ্যালিয়াস",
        "content": [
          {
            "type": "text",
            "value": "টার্মিনালে কমান্ড লেখার সময় এই কয়েকটি শর্টকাট কাজের গতি বহুগুণ বাড়িয়ে দেয়।"
          },
          {
            "type": "text",
            "value": "1. ctrl + r: কমান্ড ইতিহাস খোঁজা\n2. ctrl + a / ctrl + e: লাইনের শুরু বা শেষে যাওয়া\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "লিনাক্সভক্ত",
            "date": "11/09 10:22",
            "content": "ctrl + w দিয়ে পেছনের শব্দ মুছে ফেলাও দারুণ কাজের।",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "প্রোগ্রামার",
            "date": "11/09 10:45",
            "content": "zsh ব্যবহার করলে zsh-autosuggestions প্লাগইন মিস করবেন না!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "ছবি",
        "memo": "সকালের হাঁটা",
        "author": "ঝরাপাতা",
        "title": "সকালে হ্রদের ধারে হাঁটতে হাঁটতে তোলা শরতের মনোরম কিছু ছবি (ছবি)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "সকালে হ্রদের পাড়ে হাঁটার সময় কুয়াশা আর শরতের স্নিগ্ধ আলোয় তোলা একটি মনোরম ছবি।"
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "প্রকৃতিপ্রেমী",
            "date": "11/09 08:52",
            "content": "খুবই শান্ত ও সুন্দর একটি দৃশ্য!",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "শান্ত সমুদ্রের ঢেউয়ে সোনালি সূর্যাস্তের আভা",
        "author": "সাগরহাওয়া",
        "category": "প্রকৃতি"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "রোদে ঝলমল করা স্ক্যান্ডিনেভিয়ান বসার ঘর",
        "author": "নর্ডিকহোম",
        "category": "সজ্জা"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "ছুটির দিনে বন্ধুদের সাথে তৈরি করা ফিল্টার কফি",
        "author": "কফিমাস্টার",
        "category": "কফি"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "জানালার কাঁচে বৃষ্টির ফোঁটা ও উষ্ণ বোকেহ আলোর রূপ",
        "author": "বৃষ্টিদিন",
        "category": "অনুভূতি"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "হাতে গড়া নান্দনিক সিরামিক থালার সমাহার",
        "author": "মাটিরশিল্প",
        "category": "শিল্পকর্ম"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "কুয়াশাচ্ছন্ন ভোরে শান্ত পাহাড়ি নদীর দৃশ্য",
        "author": "পাহাড়িপথ",
        "category": "প্রাকৃতিক দৃশ্য"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "নীল সন্ধ্যার আলোয় ঝলমলে মহানগরীর রাজপথ",
        "author": "শহুরেচোখ",
        "category": "শহর"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "রোদের আলোয় মেলে ধরা সতেজ মনস্টেরা পাতা",
        "author": "সবুজপ্রেমী",
        "category": "গাছপালা"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "সবুজ গাছপালায় ঘেরা এক শান্ত ক্যাফের কোণ",
        "author": "ক্যাফেআড্ডা",
        "category": "ক্যাফে"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "বরফে ঢাকা সুবিশাল আল্পস পর্বতমালা",
        "author": "বরফশৃঙ্গ",
        "category": "পাহাড়"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "সকালে ওভেন থেকে সদ্য বের করা তাজা সাওয়ারডো রুটি",
        "author": "কারিগরবেকার",
        "category": "বেকিং"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "গভীর রাতের আকাশে জ্বলজ্বল করা অ্যান্ড্রোমিডা গ্যালাক্সি",
        "author": "তারারসন্ধানে",
        "category": "মহাকাশ"
      }
    ]
  },
  "ar": {
    "boardTitle": "المنتدى العام",
    "menuGallery": "معرض الصور",
    "galleryTitle": "معرض الصور",
    "menuMainBoard": "المنتدى العام",
    "menuSettings": "الإعدادات",
    "settingsTitle": "الإعدادات",
    "settingsMessage": "تكوين تفضيلات المنتدى ولغة العرض.",
    "langLabel": "اختيار اللغة (Language)",
    "btnSave": "حفظ",
    "btnCancel": "إلغاء",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "مراجعة",
        "memo": "شاشة OLED",
        "author": "عاشق_المكتب",
        "title": "مراجعة صادقة بعد أسبوع من استخدام شاشة OLED المحمولة 14 بوصة (صور)",
        "content": [
          {
            "type": "text",
            "value": "اشتريت شاشة OLED محمولة مقاس 14 بوصة بسعر مخفض خلال عروض التخفيضات. استغرق الشحن أسبوعين، وأستخدمها يومياً كشاشة ثانوية منذ أسبوع."
          },
          {
            "type": "text",
            "value": "بصراحة لم تكن توقعاتي عالية نظراً لسعرها الاقتصادي، ولكن عند فتح الصندوق فاجأتني جودة التصنيع المصنوعة من الألومنيوم والمفصلات القوية."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. اللوحة وجودة الصورة\nلوحة OLED خرافية بحق: سواد نقي وتباين مذهل ونصوص فائقة الوضوح بجانب شاشة اللابتوب. ممتازة للبرمجة بالوضع الداكن ومشاهدة المحتوى."
          },
          {
            "type": "text",
            "value": "2. سهولة الحمل وتوصيل بكابل واحد\nوزنها أقل من 600 غرام وتتسع في حقيبة الظهر بسهولة. كابل Type-C واحد ينقل الفيديو والطاقة معاً وهو أمر مريح للغاية في المقاهي والفنادق."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. بعض العيوب\nالشاشة لامعة فإذا كانت هناك إضاءة خلفك ستلاحظ انعكاسات. السماعات المدمجة متواضعة، ويفضل استخدام سماعات رأس."
          },
          {
            "type": "text",
            "value": "الخلاصة\nلكل من يبحث عن شاشة إضافية محمولة وعالية الجودة للتنقل، أنصح بها بشدة."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "محبي_اللابتوب",
            "content": "مراجعة رائعة! هل تعمل عند سطوع 100% مباشرة من اللابتوب دون أي وميض؟"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "عاشق_المكتب",
            "content": "نعم، اختبرتها بسطوع 100% باستخدام كابل C-to-C المرفق وتعمل بثبات تام دون وميض."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "متذوق_الصوت",
            "content": "الشاشة اللامعة في المقاهي المضيئة قد تزعج قليلاً، لكن وجود OLED بهذا السعر صفقة رائعة."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "مكتب_أنيق",
            "content": "ترتيب المكتب رائع جداً! من أين اشتريت بساط اللباد الرمادي في الصورة الثانية؟"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "عاشق_المكتب",
            "content": "بساط لباد مكتبي عادي من أحد المتاجر الإلكترونية بسعر حوالي 12 دولاراً!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "لاعب_محمول",
            "content": "هل يمكن توصيل جهاز ألعاب محمول بها مباشرة دون منصة (Dock)؟"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "عاشق_المكتب",
            "content": "جهاز الألعاب لا يعطي طاقة كافية بمفرده، يجب توصيل شاحن بالمنفذ الثاني للشاشة."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "دردشة",
        "memo": "ميني بي سي",
        "author": "مبرمج_بسيط",
        "title": "تجربتي بعد شهر من التخلي عن صندوق الحاسوب الضخم واستخدام Mini PC"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "سؤال",
        "memo": "قهوة منزلية",
        "author": "عاشق_الإسبريسو",
        "title": "ما هي أفضل مطحنة قهوة يدوية للتحضير المقطر اليومي؟"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "معلومات",
        "memo": "صحة البطارية",
        "author": "خبير_التقنية",
        "title": "عادات يومية شائعة تدمر صحة بطارية أجهزتك ببطء ودون أن تشعر"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "صور",
        "memo": "جولة دراجة",
        "author": "دراج_المدينة",
        "title": "جولة بالدراجة على ضفاف النهر في عطلة نهاية الأسبوع، أجواء خريفية رائعة (صور)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "أدوات",
        "memo": "ماركداون",
        "author": "مطور_حر",
        "title": "أفضل محررات Markdown مفتوحة المصدر والخفيفة للمطورين والكتّاب"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "سؤال",
        "memo": "شاحن GaN",
        "author": "منظم_الأسلاك",
        "title": "أبحث عن شاحن GaN بقوة 65 واط و3 منافذ مع تأريض وتبريد ممتاز"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "تجربة",
        "memo": "مفاتيح صامتة",
        "author": "عاشق_الميكانيك",
        "title": "انتقلت من مفاتيح الكيبورد التكتيكية إلى الخطية الصامتة: فرق شاسع جداً!"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "مشاركة",
        "memo": "ذراع شاشة",
        "author": "مساحة_عمل",
        "title": "قمت بتركيب ذراع للشاشة في العطلة وتوفرت مساحة هائلة على المكتب"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "طبخ",
        "memo": "باستا سريعة",
        "author": "شيف_منزلي",
        "title": "باستا الزبدة والثوم في مقلاة واحدة خلال 15 دقيقة لوجبة غداء سريعة"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "نصائح",
        "memo": "حيل الطرفية",
        "author": "مبرمج_الطرفية",
        "title": "اختصارات وأوامر موجهة للطرفية تعزز الإنتاجية اليومية للمطورين",
        "content": [
          {
            "type": "text",
            "value": "مجموعة من الاختصارات والأوامر المختصرة التي توفر الكثير من الوقت أثناء العمل اليومي على سطر الأوامر."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: البحث في السجل القديم\n2. ctrl + a / ctrl + e: الانتقال لبداية/نهاية السطر\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "عاشق_لينكس",
            "date": "11/09 10:22",
            "content": "اختصار ctrl + w لحذف الكلمة السابقة لا غنى عنه أيضاً.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "خبير_أوبنتو",
            "date": "11/09 10:45",
            "content": "أنصح بشدة بإضافة zsh-autosuggestions إذا كنت تستخدم zsh!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "صور",
        "memo": "جولة صباحية",
        "author": "أوراق_الخريف",
        "title": "نزهة صباحية منعشة حول بحيرة الحديقة وسط ألوان الخريف الذهبية (صور)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "نزهة صباحية هادئة حول البحيرة مع الضباب الصباحي والهدوء الساحر."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "صديق_الطبيعة",
            "date": "11/09 08:52",
            "content": "مشهد جميل يبعث على الراحة والسكينة.",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "غروب ذهبي ساحر يعانق أمواج البحر الهادئة",
        "author": "نسيم_البحر",
        "category": "طبيعة"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "غرفة معيشة بسيطة ودافئة تغمرها أشعة الشمس",
        "author": "طراز_اسكندنافي",
        "category": "ديكور"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "قهوة مقطرة مميزة نتشاركها في عطلة نهاية الأسبوع",
        "author": "خبير_القهوة",
        "category": "قهوة"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "قطرات المطر على النافذة مع أضواء بوكيه دافئة",
        "author": "يوم_ماطر",
        "category": "أجواء"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "مجموعة أطباق خزفية مصنوعة يدوياً بإتقان",
        "author": "صانع_الفخار",
        "category": "حرف"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "فجر ضبابي ينساب بهدوء على ضفاف نهر الجبل",
        "author": "عابر_الجبال",
        "category": "مناظر"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "الساعة الزرقاء تضيء ناطحات السحاب في شوارع العاصمة",
        "author": "نبض_المدينة",
        "category": "مدينة"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "ورقة مونستيرا خضراء يانعة تتفتح تحت أشعة الشمس",
        "author": "عاشق_النبات",
        "category": "نباتات"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "ركن مقهى هادئ ومريح تحيط به النباتات الطبيعية",
        "author": "زاوية_المقهى",
        "category": "مقهى"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "سلسلة جبال الألب الشاهقة المغطاة بالثلوج البيضاء",
        "author": "قمم_الثلوج",
        "category": "قمم"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "خبز ساوردو مقرمش وطازج خرج للتو من الفرن التقليدي",
        "author": "خميرة_طبيعية",
        "category": "مخبوزات"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "مجرة أندروميدا تتلألأ في عمق السماء الليلية الصافية",
        "author": "مراقب_النجوم",
        "category": "فلك"
      }
    ]
  },
  "fa": {
    "boardTitle": "انجمن عمومی",
    "menuGallery": "گالری عکس",
    "galleryTitle": "گالری عکس",
    "menuMainBoard": "تالار گفتگوی اصلی",
    "menuSettings": "تنظیمات",
    "settingsTitle": "تنظیمات",
    "settingsMessage": "پیکربندی تنظیمات انجمن و زبان نمایش.",
    "langLabel": "انتخاب زبان (Language)",
    "btnSave": "ذخیره",
    "btnCancel": "لغو",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "بررسی",
        "memo": "نمایشگر OLED",
        "author": "میزبان_دیجیتال",
        "title": "بررسی صادقانه پس از ۱ هفته کار با مانیتور پرتابل ۱۴ اینچ OLED (عکس)",
        "content": [
          {
            "type": "text",
            "value": "در حراج فصلی یک مانیتور قابل حمل ۱۴ اینچی OLED با قیمت مناسب خریدم. بعد از دو هفته رسید و الان یک هفته است روزانه به عنوان نمایشگر دوم لپ‌تاپ از آن استفاده می‌کنم."
          },
          {
            "type": "text",
            "value": "راستش با توجه به قیمت پایین انتظار زیادی نداشتم، فقط می‌خواستم در سفر کارم را راه بیندازد. اما به محض باز کردن جعبه، بدنه آلومینیومی CNC و لولاهای محکم حسابی شگفت‌زده‌ام کرد."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "۱. پنل و کیفیت تصویر\nپنل OLED محشره: رنگ مشکی عمیق، کنتراست عالی و فونت‌های بسیار خوانا کنار لپ‌تاپ. برای کدنویسی در حالت تاریک و دیدن فیلم عالیه."
          },
          {
            "type": "text",
            "value": "۲. قابلیت حمل و اتصال با یک کابل\nوزنش زیر ۶۰۰ گرمه و راحت توی کیف لپ‌تاپ جا می‌شه. این‌که یک کابل Type-C هم تصویر و هم برق را انتقال می‌ده برای کار در کافه‌ها خیلی راحته."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "۳. معایب\nصفحه براقه و اگر نور مستقیم پشت سر باشه انعکاس داره. اسپیکرهای داخلی ضعیفه و بهتره از هدفون استفاده کنید."
          },
          {
            "type": "text",
            "value": "نتیجه‌گیری\nبرای کسانی که دنبال مانیتور دوم باکیفیت و سبک برای کار سیار هستند، کاملاً توصیه می‌شود."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "لپ‌تاپ‌باز",
            "content": "بررسی خیلی کاملی بود! با برق مستقیم لپ‌تاپ در روشنایی ۱۰۰ درصد پرش تصویر نداره؟"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "میزبان_دیجیتال",
            "content": "اصلاً پرش نداره، با همون کابل دو سر تایپ‌سی داخل جعبه روی روشنایی ۱۰۰ درصد کاملاً ثابته."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "عاشق_صدا",
            "content": "صفحه براق زیر نور کافه شاید کمی بازتاب داشته باشه ولی OLED با این قیمت واقعاً مفته."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "میز_تمیز",
            "content": "میز کارت خیلی تمیزه! پد نمدی خاکستری عکس دوم رو از کجا گرفتی؟"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "میزبان_دیجیتال",
            "content": "یک پد نمدی ساده تیره است که آنلاین سفارش دادم، قیمتش هم مناسب بود!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "گیمر_پرتابل",
            "content": "میشه کنسول بازی پرتابل رو مستقیم بدون داک بهش وصل کرد؟"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "میزبان_دیجیتال",
            "content": "کنسول به تنهایی توان برق‌رسانی نداره، باید شارژر رو به پورت دوم مانیتور وصل کنید."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "گپ",
        "memo": "مینی پی‌سی",
        "author": "کدنویس_خلوت",
        "title": "یک ماه پس از کنار گذاشتن کیس غول‌پیکر و کوچ به مینی پی‌سی: تجربیات"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "پرسش",
        "memo": "کافه خانگی",
        "author": "عاشق_قهوه",
        "title": "پیشنهاد شما برای آسیاب دستی قهوه دمی و فیلتری روزمره چیه؟"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "ترفند",
        "memo": "سلامت باتری",
        "author": "تکنولوژیست",
        "title": "عادت‌های روزمره‌ای که بی‌صدا سلامت باتری گوشی و لپ‌تاپ را نابود می‌کنند"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "عکس",
        "memo": "دوچرخه‌سواری",
        "author": "دوچرخه‌سوار",
        "title": "دوچرخه‌سواری آخر هفته در مسیر ساحلی رودخانه، هوای پاییزی فوق‌العاده بود (عکس)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "ابزار",
        "memo": "مارک‌داون",
        "author": "توسعه‌دهنده",
        "title": "ویرایشگرهای سبک و متن‌باز Markdown برای برنامه‌نویسان و نویسندگان"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "پرسش",
        "memo": "شارژر GaN",
        "author": "سیم‌های_مرتب",
        "title": "دنبال یک شارژر سه پورت 65W GaN با ارت مناسب و دمای پایین هستم"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "بررسی",
        "memo": "سوییچ بی‌صدا",
        "author": "کیبوردباز",
        "title": "تعویض سوییچ مکانیکی با مدل خطی بی‌صدا (Silent Linear): واقعاً مثل معجزه بود"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "اتاق",
        "memo": "پایه مانیتور",
        "author": "طراح_میز",
        "title": "نصب بازوی مانیتور در تعطیلات: میزم دو برابر خلوت‌تر و جادارتر شد"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "آشپزی",
        "memo": "پاستا سریع",
        "author": "آشپز_تنها",
        "title": "پاستای کره‌ای سیر در یک تابه در ۱۵ دقیقه برای ناهار سریع روزهای تعطیل"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "نکته",
        "memo": "ترفندهای ترمینال",
        "author": "شل_اسکریپتر",
        "title": "کلیدهای میانبر و نام‌های مستعار کاربردی ترمینال برای افزایش بهره‌وری روزمره",
        "content": [
          {
            "type": "text",
            "value": "چند کلید میانبر و میانبر دستورات که کار با خط فرمان لینوکس را چند برابر سریع‌تر و لذت‌بخش‌تر می‌کنند."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: جستجوی تاریخچه دستورات\n2. ctrl + a / ctrl + e: رفتن به ابتدا/انتهای خط\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "کاربر_لینوکس",
            "date": "11/09 10:22",
            "content": "کلید ctrl + w هم برای پاک کردن کلمه قبلی فوق‌العاده است.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "توسعه_دهنده",
            "date": "11/09 10:45",
            "content": "پلاگین zsh-autosuggestions رو حتما نصب کنید!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "عکس",
        "memo": "پیاده‌روی",
        "author": "برگ_ریزان",
        "title": "پیاده‌روی صبحگاهی پاییزی در پارک دریاچه و هوای دلپذیر (عکس‌ها)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "قدم زدن در هوای خنک صبحگاهی کنار دریاچه با مه ملایم و رنگ‌های طلایی پاییز."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "طبیعت‌گرد",
            "date": "11/09 08:52",
            "content": "عکسی بسیار آرامش‌بخش و زیبا.",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "غروب زرین خورشید بر فراز امواج آرام دریا",
        "author": "نسیم_دریا",
        "category": "طبیعت"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "اتاق نشیمن مینیمال و پرنور با حس آرامش اسکاندیناوی",
        "author": "خانه_مینیمال",
        "category": "دکوراسیون"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "قهوه دمی دست‌ساز در کنار دوستان صمیمی در آخر هفته",
        "author": "باریستای_ماهر",
        "category": "قهوه"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "بازتاب باران پاییزی پشت پنجره با نورهای بوکه گرم",
        "author": "روز_بارانی",
        "category": "احساس"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "مجموعه ظروف سفالی دست‌ساز با لعاب طبیعی",
        "author": "سفالگری",
        "category": "صنایع دستی"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "صبح مه‌آلود و باطراوت در کنار رودخانه آرام دره",
        "author": "مسیر_کوهستان",
        "category": "چشم‌انداز"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "ساعت آبی دل‌انگیز برفراز خیابان‌های پرنور کلان‌شهر",
        "author": "عکاس_شهر",
        "category": "شهر"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "برگ تازه و شاداب برگ‌انجیری غرق در نور آفتاب",
        "author": "سبزاندیش",
        "category": "گیاهان"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "گوشه‌ای دنج و آرام در کافه‌ای پر از گیاهان طبیعی",
        "author": "کافه_دنج",
        "category": "کافه"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "رشته‌کوه‌های باصلابت و پوشیده از برف همیشگی",
        "author": "سپیدکوه",
        "category": "قله‌ها"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "نان ترد و برشته خمیرترش تازه بیرون‌آمده از تنور",
        "author": "نان_سنتی",
        "category": "پخت نان"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "کهکشان آندرومدا که در دل آسمان زلال شب می‌درخشد",
        "author": "نگاه_به_آسمان",
        "category": "نجوم"
      }
    ]
  },
  "he": {
    "boardTitle": "קהילה כללית",
    "menuGallery": "גלריית תמונות",
    "galleryTitle": "גלריית תמונות",
    "menuMainBoard": "פורום כללי",
    "menuSettings": "הגדרות",
    "settingsTitle": "הגדרות",
    "settingsMessage": "הגדרות העדפות הקהילה ושפת התצוגה.",
    "langLabel": "בחירת שפה (Language)",
    "btnSave": "שמור",
    "btnCancel": "ביטול",
    "posts": [
      {
        "id": "post-1",
        "date": "11/10 09:25",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
        "viewCount": "2,140",
        "likeCount": "38",
        "hotCount": 38,
        "commentCount": "18",
        "coldCount": 18,
        "mediaUrl": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "סקירה",
        "memo": "מסך OLED",
        "author": "נווד_שולחן",
        "title": "סקירה כנה לאחר שבוע עם מסך נייד OLED בגודל 14 אינץ' (תמונות)",
        "content": [
          {
            "type": "text",
            "value": "קניתי מסך נייד OLED בגודל 14 אינץ' במבצע. לקח לו שבועיים להגיע ואני משתמש בו כבר שבוע כמסך משני יומיומי."
          },
          {
            "type": "text",
            "value": "לא ציפיתי להרבה בגלל המחיר הזול, אבל כשפתחתי את הקופסה הופתעתי לטובה: מארז אלומיניום CNC וצירים קשיחים שמעניקים תחושה יוקרתית."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800"
          },
          {
            "type": "text",
            "value": "1. איכות פאנל ותמונה\nפאנל ה-OLED פשוט מדהים: שחור עמוק ומוחלט, ניגודיות מעולה וטקסט חד ליד המחשב הנייד. נהדר לכתיבת קוד במצב כהה ולצפייה בסרטים."
          },
          {
            "type": "text",
            "value": "2. ניידות וחיבור בכבל יחיד\nשוקל פחות מ-600 גרם ונכנס בקלות לתיק הגב. כבל Type-C יחיד שמעביר וידאו וחשמל בו-זמנית הופך את העבודה בבתי קפה לפשוטה מאוד."
          },
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1700451960095-c37c0b388624?w=800"
          },
          {
            "type": "text",
            "value": "3. חסרונות\nהמסך בגימור מבריק ולכן מנורות מאחור יוצרות השתקפות. הרמקולים המובנים בסיסיים, עדיף להשתמש באוזניות."
          },
          {
            "type": "text",
            "value": "סיכום\nלכל מי שמחפש מסך משני קל ואיכותי לדרכים – מומלץ בחום."
          }
        ],
        "comments": [
          {
            "link": "c-1",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_laptop",
            "date": "09:31",
            "hotCount": 15,
            "coldCount": 0,
            "level": 0,
            "author": "חובב_מחשבים",
            "content": "סקירה מצוינת! האם בחיבור ישיר למחשב הנייד ב-100% בהירות המסך יציב ללא הבהובים?"
          },
          {
            "link": "c-2",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "09:34",
            "hotCount": 24,
            "coldCount": 0,
            "level": 1,
            "author": "נוود_שולחן",
            "content": "יציב לחלוטין, בדקתי עם כבל ה-C-to-C המצורף בבהירות מלאה והוא פועל בצורה חלקה."
          },
          {
            "link": "c-3",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_audio",
            "date": "09:42",
            "hotCount": 36,
            "coldCount": 0,
            "level": 0,
            "author": "חובב_סאונד",
            "content": "מסך מבריק בבית קפה מואר עלול להפריע, אבל לקבל OLED במחיר כזה זו עסקה מעולה."
          },
          {
            "link": "c-4",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_desk",
            "date": "09:58",
            "hotCount": 19,
            "coldCount": 0,
            "level": 0,
            "author": "שולחן_נקי",
            "content": "פינת עבודה נקייה מאוד! מאיפה משטח הלבד האפור בתמונה השנייה?"
          },
          {
            "link": "c-5",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:05",
            "hotCount": 14,
            "coldCount": 0,
            "level": 1,
            "author": "נוود_שולחן",
            "content": "משטח לבד פשוט שהזמנתי אונליין בכמה עשרות שקלים!"
          },
          {
            "link": "c-6",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_handheld",
            "date": "10:14",
            "hotCount": 8,
            "coldCount": 0,
            "level": 0,
            "author": "גיימר_נייד",
            "content": "אפשר לחבר קונסולת משחקים ניידת ישירות ללא עמדת עגינה (Dock)?"
          },
          {
            "link": "c-7",
            "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=tech_avatar",
            "date": "10:20",
            "hotCount": 16,
            "coldCount": 0,
            "level": 1,
            "author": "נוود_שולחן",
            "content": "הקונסולה לבדה לא מספקת מספיק חשמל, צריך לחבר מטען ליציאה השנייה של המסך."
          }
        ]
      },
      {
        "id": "post-2",
        "date": "11/10 09:12",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_code",
        "viewCount": "1,890",
        "likeCount": "28",
        "hotCount": 28,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "שיחה",
        "memo": "מיני PC",
        "author": "מתכנת_מינימל",
        "title": "חודש לאחר המעבר ממארז מחשב ענקי למיני PC: תובנות ראשונות"
      },
      {
        "id": "post-3",
        "date": "11/10 08:45",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_coffee",
        "viewCount": "320",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "שאלה",
        "memo": "קפה ביתי",
        "author": "אוהב_אספרסו",
        "title": "המלצות למטחנת קפה ידנית איכותית לשימוש יומיומי עם פילטר?"
      },
      {
        "id": "post-4",
        "date": "11/10 07:30",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bat",
        "viewCount": "3,450",
        "likeCount": "75",
        "hotCount": 75,
        "commentCount": "38",
        "coldCount": 38,
        "types": [],
        "category": "מידע",
        "memo": "חיי סוללה",
        "author": "איש_טכנולוגיה",
        "title": "הרגלים יומיומיים נפוצים שהורסים בשקט את בריאות הסוללה של המכשירים"
      },
      {
        "id": "post-5",
        "date": "11/09 23:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_bike",
        "viewCount": "1,200",
        "likeCount": "22",
        "hotCount": 22,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "תמונה",
        "memo": "רכיבת שבת",
        "author": "רוכב_אופניים",
        "title": "רכיבת אופניים לאורך הנהר בסוף השבוע, מזג אוויר סתווי מדהים (תמונות)"
      },
      {
        "id": "post-6",
        "date": "11/09 22:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_git",
        "viewCount": "2,100",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "19",
        "coldCount": 19,
        "types": [],
        "category": "כלים",
        "memo": "Markdown",
        "author": "מפתח_תוכנה",
        "title": "עורכי Markdown קלילים בקוד פתוח למפתחים ולכותבי תוכן"
      },
      {
        "id": "post-7",
        "date": "11/09 20:50",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_elec",
        "viewCount": "1,410",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "24",
        "coldCount": 24,
        "types": [],
        "category": "שאלה",
        "memo": "מטען GaN",
        "author": "סדר_כבלים",
        "title": "מחפש מטען GaN 65W עם 3 יציאות, הארקה תקינה ופיזור חום טוב"
      },
      {
        "id": "post-8",
        "date": "11/09 19:10",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_kb",
        "viewCount": "1,670",
        "likeCount": "45",
        "hotCount": 45,
        "commentCount": "26",
        "coldCount": 26,
        "mediaUrl": "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "חוות דעת",
        "memo": "מתגים שקטים",
        "author": "חובב_מקלדות",
        "title": "עברתי ממתגים טקטיליים למתגים ליניאריים שקטים: פשוט הבדל של יום ולילה"
      },
      {
        "id": "post-9",
        "date": "11/09 17:35",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_room",
        "viewCount": "480",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "mediaUrl": "https://images.unsplash.com/photo-1548123325-525b8e0cde7c?w=800",
        "mediaType": "image",
        "types": [
          "image"
        ],
        "category": "שולחן",
        "memo": "זרוע מסך",
        "author": "עיצוב_סביבה",
        "title": "התקנתי זרוע למסך בסוף השבוע והתפנה המון מקום על שולחן העבודה"
      },
      {
        "id": "post-10",
        "date": "11/09 13:20",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=user_cook",
        "viewCount": "1,540",
        "likeCount": "",
        "hotCount": 0,
        "commentCount": "",
        "coldCount": 0,
        "types": [],
        "category": "בישול",
        "memo": "פסטה בסיר",
        "author": "שף_ביתי",
        "title": "פסטה חמאת שום מהירה ב-15 דקות במחבת אחת לארוחת צהריים קלילה"
      },
      {
        "id": "post-11",
        "date": "11/09 10:15",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=shell_avatar",
        "viewCount": "1,890",
        "likeCount": "54",
        "hotCount": 54,
        "commentCount": "14",
        "coldCount": 14,
        "mediaUrl": "",
        "mediaType": "",
        "types": [],
        "category": "טיפ",
        "memo": "טיפים לטרמינל",
        "author": "אישטרמינל",
        "title": "קיצורי דרך ופקודות alias שימושיות בטרמינל שמאיצות את העבודה היומיומית",
        "content": [
          {
            "type": "text",
            "value": "ריכוז קיצורי מקשים ופקודות מקוצרות שחוסכות זמן רב בעבודה מול שורת הפקודה מדי יום."
          },
          {
            "type": "text",
            "value": "1. ctrl + r: חיפוש מהיר בהיסטוריית הפקודות\n2. ctrl + a / ctrl + e: קפיצה לתחילת/סוף השורה\n3. alias gs=\"git status\", ga=\"git add\""
          }
        ],
        "comments": [
          {
            "id": "c-11-1",
            "author": "מפתחלינוקס",
            "date": "11/09 10:22",
            "content": "ctrl + w למחיקת מילה שלמה הוא קיצור מציל חיים.",
            "likeCount": 12,
            "types": []
          },
          {
            "id": "c-11-2",
            "author": "אישקוד",
            "date": "11/09 10:45",
            "content": "למשתמשי zsh מומלץ מאוד להתקין zsh-autosuggestions!",
            "likeCount": 35,
            "types": []
          }
        ]
      },
      {
        "id": "post-12",
        "date": "11/09 08:40",
        "avatar": "https://api.dicebear.com/7.x/identicon/png?seed=maple_avatar",
        "viewCount": "980",
        "likeCount": "27",
        "hotCount": 27,
        "commentCount": "12",
        "coldCount": 12,
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "mediaType": "image",
        "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "types": [
          "image"
        ],
        "category": "תמונה",
        "memo": "טיול בוקר",
        "author": "שלכתזהובה",
        "title": "הליכת בוקר סתווית מסביב לאגם בפארק השקט (תמונות)",
        "content": [
          {
            "type": "image",
            "value": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"
          },
          {
            "type": "text",
            "value": "הליכת בוקר מרעננת סביב האגם, הערפל הקל והשקט עשו את כל הדרך."
          }
        ],
        "comments": [
          {
            "id": "c-12-1",
            "author": "חובבטבע",
            "date": "11/09 08:52",
            "content": "תמונה מקסימה ומרגיעה במיוחד.",
            "likeCount": 15,
            "types": []
          }
        ]
      }
    ],
    "galleryPosts": [
      {
        "id": "gal-1",
        "date": "11/10 11:20",
        "mediaUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        "likeCount": "184",
        "commentCount": "28",
        "title": "שקיעה מוזהבת מעל גלי הים השקטים",
        "author": "בריזתים",
        "category": "טבע"
      },
      {
        "id": "gal-2",
        "date": "11/10 10:45",
        "mediaUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
        "likeCount": "142",
        "commentCount": "19",
        "title": "סלון סקנדינבי שטוף שמש המשרה שלווה ביתית",
        "author": "עיצובנורדי",
        "category": "עיצוב"
      },
      {
        "id": "gal-3",
        "date": "11/10 09:30",
        "mediaUrl": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
        "likeCount": "215",
        "commentCount": "34",
        "title": "קפה פילטר איכותי עם חברים קרובים בסוף השבוע",
        "author": "בריסטה",
        "category": "קפה"
      },
      {
        "id": "gal-4",
        "date": "11/09 23:15",
        "mediaUrl": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800",
        "likeCount": "168",
        "commentCount": "22",
        "title": "טיפות גשם על החלון עם השתקפויות בוקה חמימות",
        "author": "יוםגשום",
        "category": "אווירה"
      },
      {
        "id": "gal-5",
        "date": "11/09 20:40",
        "mediaUrl": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
        "likeCount": "126",
        "commentCount": "15",
        "title": "אוסף צלחות קרמיקה מעשה ידי אומן בעבודת יד",
        "author": "כליחרס",
        "category": "אומנות"
      },
      {
        "id": "gal-6",
        "date": "11/09 18:20",
        "mediaUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "likeCount": "290",
        "commentCount": "45",
        "title": "בוקר ערפילי קסום לאורך נהר שליו בעמק",
        "author": "שבילבהרים",
        "category": "נוף"
      },
      {
        "id": "gal-7",
        "date": "11/09 16:50",
        "mediaUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "likeCount": "177",
        "commentCount": "24",
        "title": "השעה הכחולה המאירה את גורדי השחקים של העיר",
        "author": "צילוםעירוני",
        "category": "עיר"
      },
      {
        "id": "gal-8",
        "date": "11/09 14:10",
        "mediaUrl": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        "likeCount": "153",
        "commentCount": "18",
        "title": "עלה מונסטרה רענן שנפתח בחום קרני השמש",
        "author": "אוהביצמחים",
        "category": "צמחים"
      },
      {
        "id": "gal-9",
        "date": "11/09 11:35",
        "mediaUrl": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
        "likeCount": "198",
        "commentCount": "31",
        "title": "פינה נעימה ושלווה בבית קפה שופע צמחים ירוקים",
        "author": "פינתקפה",
        "category": "בית קפה"
      },
      {
        "id": "gal-10",
        "date": "11/08 22:15",
        "mediaUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
        "likeCount": "312",
        "commentCount": "52",
        "title": "רכס הרי האלפים הנישא והמושלג במלוא תפארתו",
        "author": "פסגותמושלגות",
        "category": "פסגות"
      },
      {
        "id": "gal-11",
        "date": "11/08 17:50",
        "mediaUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        "likeCount": "224",
        "commentCount": "38",
        "title": "כיכרות לחם מחמצת פריכות שיצאו זה עתה מהתנור",
        "author": "מחמצת",
        "category": "אפייה"
      },
      {
        "id": "gal-12",
        "date": "11/08 14:05",
        "mediaUrl": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800",
        "likeCount": "418",
        "commentCount": "67",
        "title": "גלקסיית אנדרומדה הזוהרת במעמקי שמי הלילה הצלולים",
        "author": "שמילילה",
        "category": "אסטרונומיה"
      }
    ]
  }
};

// Apply aliases
for (const [alias, target] of Object.entries(LOCALE_ALIASES)) {
  if (I18N[target] && !I18N[alias]) {
    I18N[alias] = I18N[target];
  }
}

let currentLocale = "en";

function resolveLocale(loc) {
  if (!loc) return "en";
  if (I18N[loc]) return loc;
  if (LOCALE_ALIASES[loc] && I18N[LOCALE_ALIASES[loc]]) return LOCALE_ALIASES[loc];
  const short = loc.split(/[-_]/)[0];
  if (I18N[short]) return short;
  return "en";
}

function buildListItems(data) {
  return data.posts.map(p => {
    const commentsNum = parseInt(String(p.commentCount || 0).replace(/,/g, ""), 10) || 0;
    return {
      link: `community://post/${p.id}`,
      title: p.title,
      category: p.category,
      memo: p.memo || "",
      author: "",
      avatar: "",
      date: p.date,
      viewCount: p.viewCount,
      likeCount: p.likeCount,
      commentCount: p.commentCount,
      hotCount: p.hotCount !== undefined ? p.hotCount : 0,
      coldCount: commentsNum,
      mediaUrl: p.mediaUrl || "",
      mediaType: p.mediaUrl ? "image" : "",
      thumbnail: p.mediaUrl || "",
      types: p.types || []
    };
  });
}

function buildGalleryItems(data) {
  return data.galleryPosts.map(p => ({
    link: `community://post/${p.id}`,
    title: p.title,
    category: p.category || "Gallery",
    memo: "",
    author: "",
    avatar: "",
    date: p.date,
    viewCount: "",
    likeCount: p.likeCount || "",
    commentCount: p.commentCount || "",
    hotCount: 0,
    coldCount: 0,
    mediaUrl: p.mediaUrl || "",
    mediaType: "image",
    thumbnail: p.mediaUrl || "",
    types: ["image"]
  }));
}

const handler = {
  homeViewId: null,
  galleryViewId: null,

  home: function(locale) {
    if (locale) {
      currentLocale = resolveLocale(locale);
    } else if (typeof navigator !== "undefined" && navigator.language) {
      currentLocale = resolveLocale(navigator.language);
    }
    const data = I18N[currentLocale] || I18N.en;
    const listItems = buildListItems(data);

    const result = synura.open({
      view: "/views/list",
      styles: {
        title: data.boardTitle,
        layout: "card",
        pagination: false,
        media: true,
        menu: true,
        hotThreshold: 70,
        coldThreshold: 50
      },
      models: {
        contents: {
          details: listItems
        },
        menus: {
          details: [data.menuGallery, data.menuSettings]
        }
      }
    });

    if (result.success) {
      handler.homeViewId = result.viewId;
      synura.connect(result.viewId, { from: "home" }, (e) => handler.onListEvent(e));
    }
  },

  onListEvent: function(event) {
    if (event.eventId === "CLICK") {
      const link = event.data.link;
      const data = I18N[currentLocale] || I18N.en;
      const targetPost = data.posts.find(p => `community://post/${p.id}` === link) || data.posts[0];
      handler.openPost(targetPost);
    } else if (event.eventId === "MENU_CLICK") {
      const menu = String(event.data.menu || "");
      const data = I18N[currentLocale] || I18N.en;
      if (menu === data.menuGallery || menu.includes("Gallery") || menu.includes("갤러리") || menu.startsWith("Photo") || menu.startsWith("사진")) {
        handler.openGallery();
      } else if (menu === data.menuSettings || menu.includes("Settings") || menu.includes("설정")) {
        handler.openSettings();
      }
    } else if (event.eventId === "REFRESH") {
      handler.refreshHome();
    }
  },

  openGallery: function() {
    const data = I18N[currentLocale] || I18N.en;
    const galleryItems = buildGalleryItems(data);

    const result = synura.open({
      view: "/views/list",
      styles: {
        title: data.galleryTitle,
        layout: "gallery",
        columnCount: 3,
        media: true,
        menu: true,
        pagination: false
      },
      models: {
        contents: {
          details: galleryItems
        },
        menus: {
          details: [data.menuMainBoard, data.menuSettings]
        }
      }
    });

    if (result.success) {
      handler.galleryViewId = result.viewId;
      synura.connect(result.viewId, { from: "gallery" }, (e) => handler.onGalleryEvent(e));
    }
  },

  onGalleryEvent: function(event) {
    if (event.eventId === "CLICK") {
      const link = event.data.link;
      const data = I18N[currentLocale] || I18N.en;
      const targetPost = data.galleryPosts.find(p => `community://post/${p.id}` === link) || data.galleryPosts[0];
      handler.openPost(targetPost);
    } else if (event.eventId === "MENU_CLICK") {
      const menu = String(event.data.menu || "");
      const data = I18N[currentLocale] || I18N.en;
      if (menu === data.menuMainBoard || menu.includes("Square") || menu.includes("광장") || menu.includes("Board") || menu.includes("게시판")) {
        synura.close(event.viewId);
        handler.galleryViewId = null;
      } else if (menu === data.menuSettings || menu.includes("Settings") || menu.includes("설정")) {
        handler.openSettings();
      }
    } else if (event.eventId === "REFRESH") {
      handler.refreshGallery();
    }
  },

  refreshHome: function() {
    if (handler.homeViewId === null) return;
    const data = I18N[currentLocale] || I18N.en;
    const listItems = buildListItems(data);

    synura.update(handler.homeViewId, {
      styles: {
        title: data.boardTitle,
        layout: "card",
        pagination: false,
        media: true,
        menu: true,
        hotThreshold: 70,
        coldThreshold: 50
      },
      models: {
        contents: {
          details: listItems
        },
        menus: {
          details: [data.menuGallery, data.menuSettings]
        }
      }
    });
  },

  refreshGallery: function() {
    if (handler.galleryViewId === null) return;
    const data = I18N[currentLocale] || I18N.en;
    const galleryItems = buildGalleryItems(data);

    synura.update(handler.galleryViewId, {
      styles: {
        title: data.galleryTitle,
        layout: "gallery",
        columnCount: 3,
        media: true,
        menu: true,
        pagination: false
      },
      models: {
        contents: {
          details: galleryItems
        },
        menus: {
          details: [data.menuMainBoard, data.menuSettings]
        }
      }
    });
  },

  openSettings: function() {
    const data = I18N[currentLocale] || I18N.en;
    const currentName = Object.entries(NAME_TO_LOCALE).find(([k, v]) => v === currentLocale)?.[0] || "English";

    const result = synura.open({
      view: "/views/settings",
      styles: {
        title: data.settingsTitle,
        message: data.settingsMessage
      },
      models: {
        body: {
          details: [
            {
              type: "select",
              name: "language",
              label: data.langLabel,
              value: currentName,
              options: LANG_OPTIONS
            }
          ]
        },
        buttons: {
          details: [data.btnSave, data.btnCancel]
        }
      }
    });

    if (result.success) {
      synura.connect(result.viewId, { from: "settings" }, (e) => handler.onSettingsEvent(e));
    }
  },

  onSettingsEvent: function(event) {
    if (event.eventId === "SUBMIT") {
      const btn = event.data.button;
      const data = I18N[currentLocale] || I18N.en;

      if (btn === data.btnSave || btn === "Save" || btn === "저장") {
        const selected = event.data.language;
        const targetLocale = NAME_TO_LOCALE[selected] || resolveLocale(selected);
        currentLocale = targetLocale;
        synura.close(event.viewId);
        handler.refreshHome();
        handler.refreshGallery();
      } else {
        synura.close(event.viewId);
      }
    }
  },

  openPost: function(post) {
    const data = I18N[currentLocale] || I18N.en;
    let contentBlocks = post.content;
    if (!contentBlocks || contentBlocks.length === 0) {
      contentBlocks = [
        { type: "image", value: post.mediaUrl || "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800" },
        { type: "text", value: post.title }
      ];
    }

    synura.open({
      view: "/views/post",
      styles: {
        title: post.title,
        menu: true,
        authorClickable: true,
        commentHotThreshold: 30,
        commentColdThreshold: 10
      },
      models: {
        link: { message: `community://post/${post.id}` },
        author: { message: post.author },
        avatar: { message: post.avatar },
        category: { message: post.category || "General" },
        memo: { message: post.memo || "" },
        date: { message: post.date },
        viewCount: { message: post.viewCount || "" },
        likeCount: { message: post.likeCount || "" },
        commentCount: { message: post.commentCount || "" },
        content: { details: contentBlocks },
        comments: { details: post.comments || [] },
        menus: { details: [data.menuSettings] }
      }
    }, { postId: post.id }, (e) => handler.onPostEvent(e));
  },

  onPostEvent: function(event) {
    if (event.eventId === "MENU_CLICK") {
      const menu = event.data.menu;
      const data = I18N[currentLocale] || I18N.en;
      if (menu === data.menuSettings || menu === "Settings" || menu === "설정") {
        handler.openSettings();
      }
    }
  }
};
