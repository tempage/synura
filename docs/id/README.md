# Selamat datang di Synura!

## Apa itu Synura?
Synura adalah aplikasi serbaguna yang memungkinkan Anda menjelajahi konten dari berbagai sumber menggunakan aplikasi mini yang kuat yang disebut "ekstensi". Anggap saja sebagai peramban, tetapi alih-alih situs web, Anda menggunakan ekstensi untuk mendapatkan konten dalam format aplikasi asli yang bersih.

## Konsep Inti untuk Pengguna

*   **Penemuan Ekstensi**: Masukkan domain (misalnya, `example.com` atau `https://example.com`) untuk secara otomatis mengambil file `synura.js` dari domain tersebut. Jika tidak ada protokol yang disediakan, `https://` digunakan secara default. Ini adalah cara utama untuk menginstal ekstensi dari situs web resmi mereka.
*   **Instalasi Langsung**: Masukkan URL lengkap (misalnya, `https://raw.githubusercontent.com/user/repo/main/synura.js`) untuk menginstal skrip ekstensi tertentu. **Catatan Keamanan**: Metode ini dibatasi untuk domain terpercaya (seperti GitHub, GitLab, dll.) untuk mencegah eksekusi kode berbahaya. Jangan gunakan ini untuk domain umum.
*   **Validasi Daftar Putih**: Instalasi URL langsung divalidasi terhadap daftar putih domain yang diizinkan untuk keamanan. Penemuan domain melewati pemeriksaan ini untuk memungkinkan eksplorasi.
*   **Ekstensi**: Ini adalah plugin kecil yang mengambil dan menampilkan konten. Misalnya, Anda dapat memiliki ekstensi untuk situs berita, platform video, atau umpan media sosial. Anda dapat menginstal ekstensi baru untuk memperluas apa yang dapat Anda lakukan dengan Synura.
*   **Runtime**: Saat Anda membuka ekstensi, ekstensi itu berjalan di "runtime". Anda dapat membuka beberapa runtime sekaligus, sama seperti memiliki beberapa tab di peramban web. Setiap runtime adalah instans terpisah dari sebuah ekstensi. Anda dapat beralih di antara mereka, dan bahkan memiliki beberapa runtime untuk ekstensi yang sama.
*   **Bookmark**: Menemukan sesuatu yang menarik? Anda dapat mem-bookmark tampilan saat ini untuk menyimpannya nanti. Bookmark menyimpan status tampilan yang tepat, sehingga Anda dapat kembali ke sana kapan saja.

## Menjelajahi Aplikasi

### Layar Utama
Layar utama aplikasi adalah tempat Anda mengelola runtime Anda. Bilah atas (bilah aplikasi) adalah alat navigasi utama Anda.

### Bilah Aplikasi

Bilah aplikasi memiliki beberapa ikon yang membantu Anda menavigasi dan mengelola konten Anda. Beberapa ikon memiliki **pintasan tersembunyi** yang diakses dengan menekan lama:

*   **`+` (Tambah)**:
    *   **Ketuk**: Buka runtime baru. Anda dapat memilih ekstensi yang terinstal atau memasukkan domain/URL situs web untuk menginstal yang baru.
    *   **Tekan Lama**: Buka layar **Manajemen Ekstensi** untuk melihat detail tentang ekstensi yang terinstal.
*   **Menu Dropdown (tengah)**: Menampilkan runtime yang sedang aktif. Ketuk untuk beralih di antara runtime yang terbuka, atau geser ke kiri/kanan pada dropdown untuk memutar di antaranya.
*   **`X` (Tutup)**: Menutup runtime saat ini.
*   **`↻` (Perbarui)**: *Hanya terlihat dalam Mode Pengembang.* Memperbarui ekstensi saat ini dari sumbernya.
*   **`✨` (AI)**:
    *   **Ketuk**: Buka **Menu AI** untuk tindakan cepat (Ringkasan, Terjemahkan, dll.).
    *   **Tekan Lama**: Buka **Pengaturan AI** untuk mengonfigurasi penyedia dan preferensi.
*   **`☆` (Tambah Bookmark)**:
    *   **Ketuk**: Simpan tampilan saat ini ke bookmark Anda.
    *   **Tekan Lama**: Buka langsung daftar **Bookmark** Anda.
*   **`🔖` (Bookmark)**: Lihat daftar bookmark Anda yang tersimpan.
*   **`⚙️` (Pengaturan)**: Buka layar pengaturan utama.

Jika layar terlalu sempit, beberapa opsi mungkin pindah ke menu tiga titik.

### Tombol AI (`✨`)
Ketuk **tombol AI** di bilah aplikasi untuk membuka **Dialog Menu AI**. Ini memberi Anda fitur bertenaga AI sesuai permintaan untuk tampilan saat ini:

*   **Ringkasan**: Dapatkan ringkasan konten di layar yang dibuat oleh AI dengan cepat.
*   **Terjemahkan**: Terjemahkan konten ke bahasa target Anda (dikonfigurasi dalam Pengaturan AI).
*   **Perintah Kustom**: Masukkan instruksi Anda sendiri agar AI menganalisis konten.
*   **Bagikan ke AI Eksternal**: Ekspor konten tampilan saat ini ke aplikasi AI eksternal seperti ChatGPT atau Gemini di perangkat Anda.
*   **Beralih Cache**: Kontrol apakah akan menggunakan hasil AI yang di-cache atau memaksa analisis baru.

Untuk konfigurasi AI terperinci, buka **Pengaturan > Pengaturan AI** di mana Anda dapat:
*   Mengonfigurasi penyedia AI pilihan Anda (Gemini, OpenAI, DeepSeek, Claude).
*   Mengatur bahasa sumber dan target untuk terjemahan.
*   Memilih rentang pencarian analisis (Dalam hanya ada di Tampilan Daftar) dan profil (Ringkasan, Jelaskan, Sederhanakan, Cek Fakta, Kritik, Wawasan).
*   Menyesuaikan preferensi panjang ringkasan.
*   Melihat statistik penggunaan token.
*   Mengelola kunci API untuk setiap penyedia.

### Bookmark
Layar bookmark menampilkan semua tampilan Anda yang tersimpan.

*   **Cuplikan Tampilan**: Mengetuk bookmark akan membuka **cuplikan yang di-cache** dari halaman seperti saat Anda menyimpannya. Ini bagus untuk merujuk informasi dengan cepat tanpa memerlukan koneksi internet.
*   **Pulihkan Tampilan**: Untuk berinteraksi dengan halaman lagi (misalnya, mengklik tautan, menyegarkan data), cari **ikon pulihkan**. Mengetuk ini akan menghubungkan kembali ke ekstensi dan menghidupkan kembali tampilan di runtime baru.

## Pengaturan (`⚙️`)

Layar pengaturan memungkinkan Anda menyesuaikan hampir setiap aspek pengalaman Synura Anda.

### Ekstensi
*   **Instal Ekstensi Baru**: Ketuk tombol **`+`** di bilah aplikasi dan masukkan domain situs web (misalnya, `https://example.com`). Jika situs mendukung Synura, ekstensi akan secara otomatis ditemukan dan diinstal.
*   **Kelola Ekstensi**: Ketuk **Kelola** untuk melihat daftar ekstensi Anda yang terinstal, di mana Anda dapat memperbarui atau menghapusnya.

### Tampilan
*   **Sesuaikan Kepadatan Konten**: Gunakan penggeser untuk membuat konten tampak lebih menyebar atau lebih padat. Anda akan melihat pratinjau langsung tentang bagaimana hal itu memengaruhi daftar dan kartu.
*   **Tema Warna**: Personalisasi tampilan aplikasi dengan memilih antara skema warna **Terang**, **Gelap**, dan **Monokai**.
*   **Ketebalan Font**: Sesuaikan ketebalan teks dengan preferensi Anda (misalnya, ringan, reguler, tebal).
*   **Bahasa**: Atur bahasa aplikasi. Anda dapat memilih bahasa tertentu atau membiarkannya mengikuti default sistem Anda.

### Perilaku
*   **Batas Waktu Jaringan**: Atur berapa lama aplikasi harus menunggu respons dari permintaan jaringan, dari 1 hingga 60 detik.
*   **Pengaturan Proksi**: Konfigurasikan server proksi untuk permintaan jaringan.
*   **Pengaturan Cache**: Kelola cache aplikasi, termasuk menghapus data yang di-cache untuk mengosongkan ruang.
*   **Animasi GIF**: Kontrol bagaimana GIF animasi diputar: **Mati** (gambar statis), **Sekali** (putar sekali), atau **Loop** (putar terus menerus).

### Video & Audio
*   **Putar Otomatis Video**: Sakelar untuk mengontrol apakah video mulai diputar secara otomatis saat muncul di layar.
*   **Pemutaran Latar Belakang Video**: Aktifkan ini untuk terus mendengar audio dari video bahkan setelah menavigasi pergi atau beralih ke aplikasi lain.
*   **Campur dengan Lainnya**: Izinkan audio dari Synura diputar pada saat yang sama dengan audio dari aplikasi lain.
*   **Jam DVR Pemutaran Langsung**: Untuk streaming langsung, pilih berapa jam siaran yang akan tetap tersedia untuk mencari mundur (dari 0 hingga 6 jam).

### Privasi & Keamanan
*   **Kelola Pengaturan**: Konfigurasikan berbagai opsi privasi dan keamanan untuk mengontrol data apa yang disimpan dan dibagikan.

### Tentang
*   **Lisensi Open Source**: Lihat lisensi perangkat lunak sumber terbuka yang membantu mendukung Synura.

---
*Dokumen ini untuk pengguna akhir. Untuk dokumentasi pengembang, silakan lihat [Memulai](getting_started.md), [Referensi API](api_reference.md), dan [Contoh](examples.md).*