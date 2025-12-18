# Synura'ya Hoş Geldiniz!

## Synura Nedir?
Synura, "uzantılar" (extensions) adı verilen güçlü mini uygulamalar kullanarak çeşitli kaynaklardan içeriklere göz atmanızı sağlayan çok yönlü bir uygulamadır. Bunu bir tarayıcı olarak düşünün, ancak web siteleri yerine, içeriği temiz, yerel bir uygulama biçiminde almak için uzantıları kullanırsınız.

## Kullanıcılar İçin Temel Kavramlar

*   **Uzantı Keşfi**: Bir alan adı (ör. `example.com` veya `https://example.com`) girerek o alan adından `synura.js` dosyasını otomatik olarak getirin. Protokol sağlanmazsa, varsayılan olarak `https://` kullanılır. Bu, uzantıları resmi web sitelerinden yüklemenin birincil yoludur.
*   **Doğrudan Yükleme**: Belirli bir uzantı komut dosyasını yüklemek için tam bir URL (ör. `https://raw.githubusercontent.com/user/repo/main/synura.js`) girin. **Güvenlik Notu**: Bu yöntem, kötü amaçlı kod yürütülmesini önlemek için güvenilir alan adlarıyla (GitHub, GitLab vb. gibi) sınırlandırılmıştır. Bunu genel alan adları için kullanmayın.
*   **Beyaz Liste Doğrulaması**: Doğrudan URL yüklemeleri, güvenlik için izin verilen alan adlarından oluşan bir beyaz listeye karşı doğrulanır. Alan adı keşfi, keşfe izin vermek için bu kontrolü atlar.
*   **Uzantılar**: Bunlar içeriği getiren ve görüntüleyen küçük eklentilerdir. Örneğin, bir haber sitesi, video platformu veya sosyal medya akışı için bir uzantınız olabilir. Synura ile yapabileceklerinizi genişletmek için yeni uzantılar yükleyebilirsiniz.
*   **Çalışma Zamanları (Runtimes)**: Bir uzantıyı açtığınızda, bir "çalışma zamanı" içinde çalışır. Bir web tarayıcısında birden fazla sekmeye sahip olmak gibi, aynı anda birden fazla çalışma zamanını açık tutabilirsiniz. Her çalışma zamanı, bir uzantının ayrı bir örneğidir. Bunlar arasında geçiş yapabilir ve hatta aynı uzantı için birden fazla çalışma zamanına sahip olabilirsiniz.
*   **Yer İşaretleri**: İlginç bir şey mi buldunuz? Mevcut görünümü daha sonra kaydetmek için yer imlerine ekleyebilirsiniz. Bir yer imi, görünümün tam durumunu kaydeder, böylece istediğiniz zaman ona geri dönebilirsiniz.

## Uygulamada Gezinme

### Ana Ekran
Uygulamanın ana ekranı, çalışma zamanlarınızı yönettiğiniz yerdir. Üst çubuk (uygulama çubuğu), ana gezinme aracınızdır.

### Uygulama Çubuğu

Uygulama çubuğunda birkaç simge bulunur:

*   **`+` (Ekle)**: Yeni bir çalışma zamanı açmak için buna dokunun. Yüklü bir uzantıyı seçebilir veya yeni bir tane yüklemek için bir web sitesi alan adı girebilirsiniz.
*   **Açılır Menü (orta)**: Şu anda etkin olan çalışma zamanını gösterir. Açık olan tüm çalışma zamanlarınızın bir listesini görmek ve bunlar arasında geçiş yapmak için buna dokunun. Hızlıca geçiş yapmak için açılır menüde sola veya sağa da kaydırabilirsiniz.
*   **`X` (Kapat)**: Bu, geçerli çalışma zamanını kapatır.
*   **`☆` (Yer İşareti Ekle)**: Mevcut görünümü yer işaretlerinize kaydetmek için buna dokunun.
*   **`🔖` (Yer İşaretleri)**: Bu sizi kayıtlı yer işaretleri listenize götürür.
*   **`⚙️` (Ayarlar)**: Bu, Synura'yı özelleştirebileceğiniz ayarlar ekranını açar.

Ekran çok darsa, bu seçenekler sağdaki üç noktalı bir menüde daraltılacaktır.

### Yer İşaretleri
Yer işaretleri ekranı, kayıtlı tüm görünümlerinizi gösterir.

*   **Görünüm Anlık Görüntüsü**: Bir yer işaretine dokunmak, sayfanın kaydettiğiniz andaki halinin **önbelleğe alınmış bir anlık görüntüsünü** açar. Bu, internet bağlantısına ihtiyaç duymadan bilgilere hızlıca başvurmak için harikadır.
*   **Görünümü Geri Yükle**: Sayfayla tekrar etkileşime girmek (ör. bağlantılara tıklamak, verileri yenilemek) için **geri yükleme simgesini** arayın. Buna dokunmak, uzantıya yeniden bağlanacak ve görünümü yeni bir çalışma zamanında hayata döndürecektir.

## Ayarlar (`⚙️`)

Ayarlar ekranı, Synura deneyiminizin neredeyse her yönünü ince ayar yapmanıza olanak tanır.

### Uzantılar
*   **Yeni Uzantılar Yükle**: Uygulama çubuğundaki **`+`** düğmesine dokunun ve web sitesi alan adını (ör. `https://example.com`) girin. Site Synura'yı destekliyorsa, uzantı otomatik olarak keşfedilecek ve yüklenecektir.
*   **Uzantıları Yönet**: Yüklü uzantılarınızın bir listesini görmek için **Yönet**'e dokunun; burada bunları güncelleyebilir veya kaldırabilirsiniz.

### Görünüm
*   **İçerik Yoğunluğunu Ayarla**: İçeriğin daha yaygın veya daha kompakt görünmesini sağlamak için kaydırıcıyı kullanın. Bunun listeleri ve kartları nasıl etkilediğine dair canlı bir önizleme göreceksiniz.
*   **Renk Teması**: **Açık**, **Koyu** ve **Monokai** renk şemaları arasından seçim yaparak uygulamanın görünümünü kişiselleştirin.
*   **Yazı Tipi Kalınlığı**: Metin kalınlığını tercihinize göre ayarlayın (ör. hafif, normal, kalın).
*   **Dil**: Uygulama dilini ayarlayın. Belirli bir dil seçebilir veya sisteminizin varsayılanını izlemesine izin verebilirsiniz.

### Davranış
*   **Ağ Zaman Aşımı**: Uygulamanın bir ağ isteğinden yanıt beklemesi gereken süreyi 1 ila 60 saniye arasında ayarlayın.
*   **Proxy Ayarları**: Ağ istekleri için bir proxy sunucusu yapılandırın.
*   **Önbellek Ayarları**: Alan açmak için önbelleğe alınmış verileri temizlemek de dahil olmak üzere uygulamanın önbelleğini yönetin.
*   **GIF Animasyonu**: Hareketli GIF'lerin nasıl oynatılacağını kontrol edin: **Kapalı** (statik görüntü), **Bir Kez** (bir kez oynat) veya **Döngü** (sürekli oynat).

### Video ve Ses
*   **Video Otomatik Oynatma**: Videoların ekranda göründüğünde otomatik olarak oynatılmaya başlayıp başlamayacağını kontrol eden bir anahtar.
*   **Video Arka Plan Oynatma**: Başka bir yere gittikten veya başka bir uygulamaya geçtikten sonra bile bir videonun sesini duymaya devam etmek için bunu etkinleştirin.
*   **Diğerleriyle Karıştır**: Synura'dan gelen sesin diğer uygulamalardan gelen sesle aynı anda çalmasına izin verin.
*   **Canlı Oynatma DVR Saatleri**: Canlı yayınlar için, yayının kaç saatinin geriye doğru arama için kullanılabilir durumda tutulacağını seçin (0 ila 6 saat arası).

### Gizlilik ve Güvenlik
*   **Ayarları Yönet**: Hangi verilerin saklanacağını ve paylaşılacağını kontrol etmek için çeşitli gizlilik ve güvenlik seçeneklerini yapılandırın.

### Hakkında
*   **Açık Kaynak Lisansları**: Synura'ya güç sağlamaya yardımcı olan açık kaynaklı yazılımların lisanslarını görüntüleyin.

---
*Bu belge son kullanıcılar içindir. Geliştirici belgeleri için lütfen [Başlarken](getting_started.md), [API Referansı](api_reference.md) ve [Örnekler](examples.md) bölümlerine bakın.*