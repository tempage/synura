# Selamat datang di Synura!

## Apa itu Synura?
Synura adalah aplikasi serbaguna yang memungkinkan Anda menelusuri konten dari berbagai sumber menggunakan aplikasi mini canggih yang disebut "ekstensi". Anggap saja sebagai browser, tetapi alih-alih situs web, Anda menggunakan ekstensi untuk mendapatkan konten dalam format aplikasi asli yang bersih.

## Konsep Inti untuk Pengguna

*   **Penemuan Ekstensi**: Masukkan domain (mis., `example.com` atau `https://example.com`) untuk secara otomatis mengambil file `synura.js` dari domain tersebut. Jika tidak ada protokol yang diberikan, `https://` digunakan secara default. Ini adalah cara utama untuk menginstal ekstensi dari situs web resminya.
*   **Instalasi Langsung**: Masukkan URL lengkap (mis., `https://raw.githubusercontent.com/user/repo/main/synura.js`) untuk menginstal skrip ekstensi tertentu. **Catatan Keamanan**: Metode ini dibatasi untuk domain tepercaya (seperti GitHub, GitLab, dll.) untuk mencegah eksekusi kode berbahaya. Jangan gunakan ini untuk domain umum.
*   **Validasi Daftar Putih**: Instalasi URL langsung divalidasi terhadap daftar putih domain yang diizinkan untuk keamanan. Penemuan domain melewati pemeriksaan ini untuk memungkinkan eksplorasi.
*   **Ekstensi**: Ini adalah plugin kecil yang mengambil dan menampilkan konten. Misalnya, Anda dapat memiliki ekstensi untuk situs berita, platform video, atau umpan media sosial. Anda dapat menginstal ekstensi baru untuk memperluas apa yang dapat Anda lakukan dengan Synura.
*   **Runtime**: Saat Anda membuka ekstensi, ekstensi itu berjalan dalam "runtime". Anda dapat membuka beberapa runtime sekaligus, seperti memiliki beberapa tab di browser web. Setiap runtime adalah instance terpisah dari sebuah ekstensi. Anda dapat beralih di antaranya, dan bahkan memiliki beberapa runtime untuk ekstensi yang sama.
*   **Bookmark**: Menemukan sesuatu yang menarik? Anda dapat mem-bookmark tampilan saat ini untuk menyimpannya nanti. Bookmark menyimpan keadaan tampilan yang tepat, sehingga Anda dapat kembali lagi kapan saja.

## Menjelajahi Aplikasi

### Layar Utama
Layar utama aplikasi adalah tempat Anda mengelola runtime Anda. Bilah atas (bilah aplikasi) adalah alat navigasi utama Anda.

### Bilah Aplikasi

Bilah aplikasi memiliki beberapa ikon:

*   **`+` (Tambah)**: Ketuk ini untuk membuka runtime baru. Anda dapat memilih ekstensi yang diinstal atau memasukkan domain situs web untuk menginstal yang baru.
*   **Menu Dropdown (tengah)**: Ini menunjukkan runtime yang sedang aktif. Ketuk untuk melihat daftar semua runtime yang terbuka dan beralih di antaranya. Anda juga dapat menggeser ke kiri atau kanan pada dropdown untuk beralih dengan cepat.
*   **`X` (Tutup)**: Ini menutup runtime saat ini.
*   **`☆` (Tambah Bookmark)**: Ketuk ini untuk menyimpan tampilan saat ini ke bookmark Anda.
*   **`🔖` (Bookmark)**: Ini membawa Anda ke daftar bookmark yang Anda simpan.
*   **`⚙️` (Pengaturan)**: Ini membuka layar pengaturan, tempat Anda dapat menyesuaikan Synura.

Jika layar terlalu sempit, opsi ini akan diringkas menjadi menu tiga titik di sebelah kanan.

### Bookmark
Layar bookmark menampilkan semua tampilan yang Anda simpan.

*   **Cuplikan Tampilan**: Mengetuk bookmark akan membuka **cuplikan cache** halaman seperti saat Anda menyimpannya. Ini bagus untuk merujuk informasi dengan cepat tanpa memerlukan koneksi internet.
*   **Pulihkan Tampilan**: Untuk berinteraksi dengan halaman lagi (mis., klik tautan, segarkan data), cari **ikon pulihkan**. Mengetuk ini akan menghubungkan kembali ke ekstensi dan menghidupkan kembali tampilan dalam runtime baru.

## Pengaturan (`⚙️`)

Layar pengaturan memungkinkan Anda menyempurnakan hampir setiap aspek pengalaman Synura Anda.

### Ekstensi
*   **Instal Ekstensi Baru**: Ketuk tombol **`+`** di bilah aplikasi dan masukkan domain situs web (mis., `https://example.com`). Jika situs mendukung Synura, ekstensi akan ditemukan dan diinstal secara otomatis.
*   **Kelola Ekstensi**: Ketuk **Kelola** untuk melihat daftar ekstensi yang Anda instal, tempat Anda dapat memperbarui atau menghapusnya.

### Tampilan
*   **Sesuaikan Kepadatan Konten**: Gunakan penggeser untuk membuat konten tampak lebih tersebar atau lebih padat. Anda akan melihat pratinjau langsung tentang bagaimana hal itu memengaruhi daftar dan kartu.
*   **Tema Warna**: Personalisasikan tampilan aplikasi dengan memilih antara skema warna **Terang**, **Gelap**, dan **Monokai**.
*   **Ketebalan Font**: Sesuaikan ketebalan teks dengan preferensi Anda (mis., ringan, reguler, tebal).
*   **Bahasa**: Atur bahasa aplikasi. Anda dapat memilih bahasa tertentu atau membiarkannya mengikuti default sistem Anda.

### Perilaku
*   **Batas Waktu Jaringan**: Tetapkan berapa lama aplikasi harus menunggu respons dari permintaan jaringan, dari 1 hingga 60 detik.
*   **Pengaturan Proxy**: Konfigurasikan server proxy untuk permintaan jaringan.
*   **Pengaturan Cache**: Kelola cache aplikasi, termasuk membersihkan data yang di-cache untuk mengosongkan ruang.
*   **Animasi GIF**: Kontrol cara GIF animasi diputar: **Mati** (gambar statis), **Sekali** (putar satu kali), atau **Loop** (putar terus menerus).

### Video & Audio
*   **Putar Otomatis Video**: Sakelar untuk mengontrol apakah video mulai diputar secara otomatis saat muncul di layar.
*   **Putar Latar Belakang Video**: Aktifkan ini untuk terus mendengar audio dari video bahkan setelah Anda menavigasi pergi atau beralih ke aplikasi lain.
*   **Campur dengan Lainnya**: Izinkan audio dari Synura diputar pada saat yang sama dengan audio dari aplikasi lain.
*   **Jam DVR Pemutaran Langsung**: Untuk siaran langsung, pilih berapa jam siaran yang tetap tersedia untuk mencari mundur (dari 0 hingga 6 jam).

### Privasi & Keamanan
*   **Kelola Pengaturan**: Konfigurasikan berbagai opsi privasi dan keamanan untuk mengontrol data apa yang disimpan dan dibagikan.

### Tentang
*   **Lisensi Sumber Terbuka**: Lihat lisensi perangkat lunak sumber terbuka yang membantu mendukung Synura.

---
*Dokumen ini untuk pengguna akhir. Untuk dokumentasi pengembang, silakan lihat [Memulai](getting_started.md), [Referensi API](api_reference.md), dan [Contoh](examples.md).*