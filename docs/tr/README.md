# Synura'ya Hoş Geldiniz!

## Synura Nedir?
Synura, "uzantılar" (extensions) adı verilen güçlü mini uygulamalar kullanarak çeşitli kaynaklardan gelen içeriklere göz atmanızı sağlayan çok yönlü bir uygulamadır. Bunu bir tarayıcı olarak düşünün, ancak web siteleri yerine, içeriği temiz, yerel bir uygulama biçiminde almak için uzantıları kullanırsınız.

## Kullanıcılar İçin Temel Kavramlar

*   **Uzantı Keşfi**: Bir alan adı (ör. `example.com` veya `https://example.com`) girerek `synura.js` dosyasını o alan adından otomatik olarak getirin. Protokol sağlanmazsa, varsayılan olarak `https://` kullanılır. Bu, uzantıları resmi web sitelerinden yüklemenin birincil yoludur.
*   **Doğrudan Yükleme**: Belirli bir uzantı komut dosyasını yüklemek için tam bir URL (ör. `https://raw.githubusercontent.com/user/repo/main/synura.js`) girin. **Güvenlik Notu**: Bu yöntem, kötü amaçlı kod yürütülmesini önlemek için güvenilir alanlarla (GitHub, GitLab vb. gibi) sınırlandırılmıştır. Bunu genel alan adları için kullanmayın.
*   **Beyaz Liste Doğrulaması**: Doğrudan URL yüklemeleri, güvenlik amacıyla izin verilen alan adları beyaz listesine göre doğrulanır. Alan adı keşfi, keşfe izin vermek için bu kontrolü atlar.
*   **Uzantılar**: Bunlar içeriği getiren ve görüntüleyen küçük eklentilerdir. Örneğin, bir haber sitesi, bir video platformu veya bir sosyal medya akışı için bir uzantınız olabilir. Synura ile yapabileceklerinizi genişletmek için yeni uzantılar yükleyebilirsiniz.
*   **Çalışma Zamanları (Runtimes)**: Bir uzantıyı açtığınızda, bir "çalışma zamanında" çalışır. Tıpkı bir web tarayıcısında birden fazla sekme olduğu gibi, aynı anda açık birden fazla çalışma zamanınız olabilir. Her çalışma zamanı, bir uzantının ayrı bir örneğidir. Bunlar arasında geçiş yapabilir ve hatta aynı uzantı için birden fazla çalışma zamanına sahip olabilirsiniz.
*   **Yer İmleri**: İlginç bir şey mi buldunuz? Geçerli görünümü daha sonra kaydetmek için yer imlerine ekleyebilirsiniz. Bir yer imi, görünümün tam durumunu kaydeder, böylece istediğiniz zaman ona geri dönebilirsiniz.

## Uygulamada Gezinme

### Ana Ekran
Uygulamanın ana ekranı, çalışma zamanlarınızı yönettiğiniz yerdir. Üst çubuk (uygulama çubuğu) ana gezinme aracınızdır.

### Uygulama Çubuğu

Uygulama çubuğu, içeriğinizde gezinmenize ve yönetmenize yardımcı olan birkaç simgeye sahiptir. Bazı simgelerin uzun basılarak erişilen **gizli kısayolları** vardır:

*   **`+` (Ekle)**:
    *   **Dokunma**: Yeni bir çalışma zamanı açın. Yüklü bir uzantıyı seçebilir veya yeni bir tane yüklemek için bir web sitesi alan adı/URL'si girebilirsiniz.
    *   **Uzun Basma**: Yüklü uzantılarınızla ilgili ayrıntıları görüntülemek için **Uzantı Yönetimi** ekranını açın.
*   **Açılır Menü (orta)**: Şu anda etkin olan çalışma zamanını görüntüler. Açık çalışma zamanları arasında geçiş yapmak için dokunun veya aralarında gezinmek için açılır menüde sola/sağa kaydırın.
*   **`X` (Kapat)**: Geçerli çalışma zamanını kapatır.
*   **`↻` (Güncelle)**: *Yalnızca Geliştirici Modunda görünür.* Geçerli uzantıyı kaynağından günceller.
*   **`✨` (Yapay Zeka)**:
    *   **Dokunma**: Hızlı işlemler (Özetle, Çevir vb.) için **Yapay Zeka Menüsü**nü açın.
    *   **Uzun Basma**: Sağlayıcıları ve tercihleri yapılandırmak için **Yapay Zeka Ayarları**nı açın.
*   **`☆` (Yer İmi Ekle)**:
    *   **Dokunma**: Geçerli görünümü yer imlerinize kaydedin.
    *   **Uzun Basma**: Doğrudan **Yer İmleri** listenize gidin.
*   **`🔖` (Yer İmleri)**: Kayıtlı yer imleri listenizi görüntüleyin.
*   **`⚙️` (Ayarlar)**: Ana ayarlar ekranını açın.

Ekran çok darsa, bazı seçenekler üç noktalı bir menüye taşınabilir.

### Yapay Zeka Düğmesi (`✨`)
Uygulama çubuğundaki **Yapay Zeka düğmesine** dokunarak **Yapay Zeka Menüsü İletişim Kutusu**nu açın. Bu, geçerli görünüm için size isteğe bağlı yapay zeka destekli özellikler sunar:

*   **Özet**: Ekrandaki içeriğin yapay zeka tarafından oluşturulan hızlı bir özetini alın.
*   **Çevir**: İçeriği hedef dilinize çevirin (Yapay Zeka Ayarlarında yapılandırılır).
*   **Özel Komut**: Yapay zekanın içeriği analiz etmesi için kendi talimatlarınızı girin.
*   **Harici Yapay Zekaya Paylaş**: Geçerli görünümün içeriğini cihazınızdaki ChatGPT veya Gemini gibi harici yapay zeka uygulamalarına aktarın.
*   **Önbellek Geçişi**: Önbelleğe alınmış yapay zeka sonuçlarının mı kullanılacağını yoksa yeni bir analizin mi zorlanacağını kontrol edin.

Ayrıntılı yapay zeka yapılandırması için **Ayarlar > Yapay Zeka Ayarları**na gidin; burada şunları yapabilirsiniz:
*   Tercih ettiğiniz yapay zeka sağlayıcısını yapılandırın (Gemini, OpenAI, DeepSeek, Claude).
*   Çeviri için kaynak ve hedef dilleri ayarlayın.
*   Analiz arama aralığını (Derin yalnızca Liste Görünümündedir) ve profilini (Özet, Açıkla, Basitleştir, Doğruluk Kontrolü, Eleştiri, İçgörü) seçin.
*   Özet uzunluğu tercihlerini ayarlayın.
*   Jeton kullanım istatistiklerini görüntüleyin.
*   Her sağlayıcı için API anahtarlarını yönetin.

### Yer İmleri
Yer imleri ekranı, kayıtlı tüm görünümlerinizi gösterir.

*   **Görünüm Anlık Görüntüsü**: Bir yer imine dokunmak, sayfanın kaydettiğiniz andaki **önbelleğe alınmış anlık görüntüsünü** açar. Bu, internet bağlantısına ihtiyaç duymadan bilgilere hızlıca başvurmak için harikadır.
*   **Görünümü Geri Yükle**: Sayfayla tekrar etkileşime girmek için (örneğin, bağlantılara tıklamak, verileri yenilemek), **geri yükle simgesini** arayın. Buna dokunmak, uzantıya yeniden bağlanacak ve görünümü yeni bir çalışma zamanında canlandıracaktır.

## Ayarlar (`⚙️`)

Ayarlar ekranı, Synura deneyiminizin neredeyse her yönünü ince ayar yapmanıza olanak tanır.

### Uzantılar
*   **Yeni Uzantılar Yükle**: Uygulama çubuğundaki **`+`** düğmesine dokunun ve web sitesi alan adını girin (ör. `https://example.com`). Site Synura'yı destekliyorsa, uzantı otomatik olarak keşfedilecek ve yüklenecektir.
*   **Uzantıları Yönet**: Yüklü uzantılarınızın bir listesini görmek için **Yönet**e dokunun; burada bunları güncelleyebilir veya kaldırabilirsiniz.

### Görünüm
*   **İçerik Yoğunluğunu Ayarla**: İçeriğin daha yaygın veya daha kompakt görünmesini sağlamak için kaydırıcıyı kullanın. Bunun listeleri ve kartları nasıl etkilediğinin canlı bir önizlemesini göreceksiniz.
*   **Renk Teması**: **Açık**, **Koyu** ve **Monokai** renk şemaları arasından seçim yaparak uygulamanın görünümünü kişiselleştirin.
*   **Yazı Tipi Ağırlığı**: Metin kalınlığını tercihinize göre ayarlayın (ör. hafif, normal, kalın).
*   **Dil**: Uygulama dilini ayarlayın. Belirli bir dili seçebilir veya sisteminizin varsayılanını takip etmesine izin verebilirsiniz.

### Davranış
*   **Ağ Zaman Aşımı**: Uygulamanın bir ağ isteğinden yanıt beklemesi gereken süreyi 1 ila 60 saniye arasında ayarlayın.
*   **Proxy Ayarları**: Ağ istekleri için bir proxy sunucusu yapılandırın.
*   **Önbellek Ayarları**: Yer açmak için önbelleğe alınmış verileri temizlemek de dahil olmak üzere uygulamanın önbelleğini yönetin.
*   **GIF Animasyonu**: Animasyonlu GIF'lerin nasıl oynatılacağını kontrol edin: **Kapalı** (statik görüntü), **Bir Kez** (bir kez oynat) veya **Döngü** (sürekli oynat).

### Video ve Ses
*   **Video Otomatik Oynatma**: Videoların ekranda göründüğünde otomatik olarak oynatılmaya başlayıp başlamayacağını kontrol eden bir anahtar.
*   **Video Arka Plan Oynatma**: Başka bir yere gittikten veya başka bir uygulamaya geçtikten sonra bile bir videodan ses duymaya devam etmek için bunu etkinleştirin.
*   **Diğerleriyle Karıştır**: Synura'dan gelen sesin diğer uygulamalardan gelen sesle aynı anda çalınmasına izin verin.
*   **Canlı Oynatma DVR Saatleri**: Canlı yayınlar için, yayının kaç saatinin geriye doğru arama için kullanılabilir tutulacağını seçin (0 ila 6 saat arası).

### Gizlilik ve Güvenlik
*   **Ayarları Yönet**: Hangi verilerin saklandığını ve paylaşıldığını kontrol etmek için çeşitli gizlilik ve güvenlik seçeneklerini yapılandırın.

### Hakkında
*   **Açık Kaynak Lisansları**: Synura'yı güçlendirmeye yardımcı olan açık kaynaklı yazılımların lisanslarını görüntüleyin.

---
*Bu belge son kullanıcılar içindir. Geliştirici belgeleri için lütfen [Başlarken](getting_started.md), [API Referansı](api_reference.md) ve [Örnekler](examples.md) bölümlerine bakın.*