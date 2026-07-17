
import { CurriculumDBType, DistributionMode, GroupSchedules, StudentLevel } from './types';

export const CURRICULUM_DB: CurriculumDBType = {
  5: {
    "TÜRKÇE": ["Sözcükte Anlam", "Kökler ve Ekler", "Cümlede Anlam", "Paragraf", "Ses Bilgisi", "Noktalama İşaretleri", "Yazım Kuralları", "Metin Türleri", "Söz Sanatları", "Görsel Okuma"],
    "MATEMATİK": ["Doğal Sayılar", "Doğal Sayılarla İşlemler", "Kesirler", "Kesirlerle İşlemler", "Ondalık Gösterim", "Yüzdeler", "Temel Geometrik Kavramlar ve Çizimler", "Üçgenler ve Dörtgenler", "Veri Toplama ve Değerlendirme", "Uzunluk ve Zaman Ölçme", "Alan Ölçme", "Geometrik Cisimler"],
    "FEN BİLİMLERİ": ["Güneş'in Yapısı ve Özellikleri", "Ay'ın Yapısı ve Özellikleri", "Ay'ın Hareketleri ve Evreleri", "Güneş, Dünya ve Ay", "Canlıları Tanıyalım", "Kuvvetin Ölçülmesi", "Sürtünme Kuvveti", "Maddenin Hal Değişimi", "Maddenin Ayırt Edici Özellikleri", "Isı ve Sıcaklık", "Isı Maddeleri Etkiler", "Işığın Yayılması", "Işığın Yansıması", "Işığın Maddeyle Karşılaşması", "Tam Gölge", "Biyoçeşitlilik", "İnsan ve Çevre", "Yıkıcı Doğa Olayları", "Devre Elemanlarının Sembollerle Gösterimi", "Basit Elektrik Devresi"],
    "İNKILAP/SOSYAL": ["Haklarımı Öğreniyorum", "Çocuk Hakları", "Kültürel Özelliklerimiz", "Geçmişten Günümüze", "Haritayı Tanıyalım", "İklim ve Yaşam", "Nerede Yaşıyoruz?", "Afetler ve Çevre Sorunları", "Teknoloji ve Toplum", "Doğru Bilgi Alma", "Ekonomi ve Yaşam", "Üretim Serüveni", "Halka Hizmet Edenler", "Bilinçli Tüketici", "Yönetim Birimleri", "Temel Hak ve Özgürlükler", "Bayrağımız ve İstiklal Marşı", "Yaşadığım Yer ve Ekonomi", "Turizm ve Uluslararası İlişkiler"],
    "İNGİLİZCE": ["Hello", "My Town", "Games and Hobbies", "My Daily Routine", "Health", "Movies", "Party Time", "Fitness", "The Animal Shelter", "Festivals"],
    "DİN": ["Allah İnancı", "Ramazan ve Oruç", "Adap ve Nezaket", "Hz. Muhammed ve Aile Hayatı", "Çevremizde Dinin İzleri"]
  },
  6: {
    "TÜRKÇE": ["Sözcükte Anlam", "Cümlede Anlam", "Paragraf", "İsimler", "Sıfatlar", "Zamirler", "Edat, Bağlaç, Ünlem", "İsim Tamlamaları", "Sıfat Tamlamaları", "Yazım Kuralları", "Noktalama İşaretleri", "Metin Türleri", "Söz Sanatları"],
    "MATEMATİK": ["Doğal Sayılarla İşlemler", "Çarpanlar ve Katlar", "Kümeler", "Tam Sayılar", "Kesirlerle İşlemler", "Ondalık Gösterim", "Oran", "Cebirsel İfadeler", "Veri Analizi", "Açılar", "Alan Ölçme", "Çember", "Geometrik Cisimler (Hacim)", "Sıvı Ölçme"],
    "FEN BİLİMLERİ": ["Güneş Sistemi", "Güneş ve Ay Tutulmaları", "Destek ve Hareket Sistemi", "Sindirim Sistemi", "Dolaşım Sistemi", "Solunum Sistemi", "Boşaltım Sistemi", "Bileşke Kuvvet", "Sabit Süratli Hareket", "Maddenin Tanecikli Yapısı", "Yoğunluk", "Madde ve Isı", "Yakıtlar", "Sesin Yayılması", "Sesin Farklı Ortamlarda Farklı Duyulması", "Sesin Sürati", "Sesin Maddeyle Etkileşimi", "Denetleyici ve Düzenleyici Sistemler", "Duyu Organları", "İletken ve Yalıtkan Maddeler", "Elektriksel Direnç"],
    "İNKILAP/SOSYAL": ["Birey ve Toplum", "Kültür ve Miras", "İnsanlar, Yerler ve Çevreler", "Bilim, Teknoloji ve Toplum", "Üretim, Dağıtım ve Tüketim", "Etkin Vatandaşlık", "Küresel Bağlantılar"],
    "İNGİLİZCE": ["Life", "Yummy Breakfast", "Downtown", "Weather and Emotions", "At the Fair", "Occupations", "Holidays", "Bookworms", "Saving the Planet", "Democracy"],
    "DİN": ["Peygamber ve İlahi Kitap İnancı", "Namaz", "Zararlı Alışkanlıklar", "Hz. Muhammed'in Hayatı", "Temel Değerlerimiz"]
  },
  7: {
    "TÜRKÇE": ["Sözcükte Anlam", "Cümlede Anlam", "Deyimler ve Atasözleri", "Söz Sanatları", "Paragrafta Anlam", "Fiiller", "Zarflar", "Anlatım Bozuklukları", "Yazım Kuralları", "Noktalama İşaretleri", "Sözel Mantık"],
    "MATEMATİK": ["Tam Sayılarla İşlemler", "Rasyonel Sayılar", "Rasyonel Sayılarla İşlemler", "Cebirsel İfadeler", "Eşitlik ve Denklem", "Oran ve Orantı", "Yüzdeler", "Doğrular ve Açılar", "Çokgenler", "Çember ve Daire", "Veri Analizi", "Cisimlerin Görünümleri"],
    "FEN BİLİMLERİ": ["Güneş Sistemi ve Ötesi", "Hücre ve Bölünmeler", "Kuvvet ve Enerji", "Saf Madde ve Karışımlar", "Işığın Madde ile Etkileşimi", "Canlılarda Üreme, Büyüme ve Gelişme", "Elektrik Devreleri"],
    "İNKILAP/SOSYAL": ["Birey ve Toplum", "Kültür ve Miras", "İnsanlar, Yerler ve Çevreler", "Bilim, Teknoloji ve Toplum", "Üretim Dağıtım ve Tüketim", "Etkin Vatandaşlık", "Küresel Bağlantılar"],
    "İNGİLİZCE": ["Appearance and Personality", "Sports", "Biographies", "Wild Animals", "Television", "Celebrations", "Dreams", "Public Buildings", "Environment", "Planets"],
    "DİN": ["Melek ve Ahiret İnancı", "Hac ve Kurban", "Ahlaki Davranışlar", "Allah’ın Kulu ve Elçisi: Hz. Muhammed", "İslam Düşüncesinde Yorumlar"]
  },
  8: {
    "TÜRKÇE": ["Sözcükte Anlam", "Cümlede Anlam", "Paragrafta Anlam", "Fiilimsiler", "Yazım Kuralları", "Noktalama İşaretleri", "Cümlenin Ögeleri", "Cümle Türleri", "Fiilde Çatı", "Anlatım Bozuklukları", "Metin Türleri ve Söz Sanatları", "Sözel Mantık"],
    "MATEMATİK": ["Çarpanlar ve Katlar", "Üslü İfadeler", "Kareköklü İfadeler", "Veri Analizi", "Basit Olayların Olma Olasılığı", "Cebirsel İfadeler ve Özdeşlikler", "Doğrusal Denklemler", "Eşitsizlikler", "Üçgenler", "Eşlik ve Benzerlik", "Dönüşüm Geometrisi", "Geometrik Cisimler"],
    "FEN BİLİMLERİ": ["Mevsimler ve İklim", "DNA ve Genetik Kod", "Basınç", "Madde ve Endüstri", "Basit Makineler", "Enerji Dönüşümleri ve Çevre Bilimi", "Elektrik Yükleri ve Elektrik Enerjisi"],
    "İNKILAP/SOSYAL": ["Bir Kahraman Doğuyor", "Milli Uyanış: Bağımsızlık Yolunda Atılan Adımlar", "Milli Bir Destan: Ya İstiklal Ya Ölüm!", "Atatürkçülük ve Çağdaşlaşan Türkiye", "Demokratikleşme Çabaları", "Atatürk Dönemi Türk Dış Politikası", "Atatürk'ün Ölümü ve Sonrası"],
    "İNGİLİZCE": ["Friendship", "Teen Life", "In The Kitchen", "On The Phone", "The Internet", "Adventures", "Tourism", "Chores", "Science", "Natural Forces"],
    "DİN": ["Kader İnancı", "Zekât ve Sadaka", "Din ve Hayat", "Hz. Muhammed’in Örnekliği", "Kur’an-ı Kerim ve Özellikleri"]
  },
  9: {
    "TÜRK DİLİ VE EDEBİYATI": ["Giriş (Edebiyat Nedir?)", "Hikaye", "Şiir Bilgisi", "Masal ve Fabl", "Roman", "Tiyatro", "Biyografi ve Otobiyografi", "Mektup ve E-Posta", "Günlük ve Blog"],
    "MATEMATİK": ["Mantık", "Kümeler", "Sayı Kümeleri", "Bölünebilme Kuralları", "EBOB-EKOK", "Denklem ve Eşitsizlikler", "Üslü ve Köklü İfadeler", "Oran - Orantı", "Problemler", "Üçgenler (Açı, Eşlik, Benzerlik)", "Üçgenin Yardımcı Elemanları", "Üçgende Alan", "Veri"],
    "FİZİK": ["Fizik Bilimine Giriş", "Madde ve Özellikleri", "Hareket ve Kuvvet", "İş, Güç ve Enerji", "Isı ve Sıcaklık", "Elektrostatik"],
    "KİMYA": ["Kimya Bilimi", "Atom ve Periyodik Sistem", "Kimyasal Türler Arası Etkileşimler", "Maddenin Halleri", "Doğa ve Kimya"],
    "BİYOLOJİ": ["Canlıların Ortak Özellikleri", "Canlıların Temel Bileşenleri (İnorganik-Organik)", "Hücre Teorisi ve Yapısı", "Hücre Zarından Madde Geçişleri", "Canlıların Sınıflandırılması", "Canlı Alemleri (Bakteri, Arke, Protista, Bitki, Mantar, Hayvan)"],
    "TARİH": ["Tarih ve Zaman", "İnsanlığın İlk Dönemleri", "Orta Çağ'da Dünya", "İlk ve Orta Çağlarda Türk Dünyası", "İslam Medeniyetinin Doğuşu", "Türklerin İslamiyet'i Kabulü"],
    "COĞRAFYA": ["Doğa ve İnsan", "Dünya'nın Şekli ve Hareketleri", "Coğrafi Koordinat Sistemi", "Harita Bilgisi", "İzohipsler", "Atmosfer ve İklim", "Sıcaklık, Basınç ve Rüzgarlar", "Nem ve Yağış", "İklim Tipleri", "Türkiye'nin İklimi", "Yer'in Şekillenmesi (İç Kuvvetler)", "Dış Kuvvetler", "Beşeri Sistemler (Yerleşme)"]
  },
  10: {
    "TÜRK DİLİ VE EDEBİYATI": ["Giriş (Edebiyat Tarihi)", "Hikaye (Dede Korkut, Halk Hikayeleri)", "Şiir (İslamiyet Öncesi, Geçiş Dönemi, Halk, Divan)", "Destan ve Efsane", "Roman (Tanzimat, Servetifünun, Milli Edb)", "Tiyatro (Geleneksel, Modern)", "Anı (Hatıra)", "Haber Metni", "Gezi Yazısı"],
    "MATEMATİK": ["Permütasyon", "Kombinasyon", "Binom", "Olasılık", "Fonksiyonlar", "Polinomlar", "İkinci Dereceden Denklemler", "Çokgenler", "Dörtgenler ve Özellikleri", "Özel Dörtgenler (Yamuk, Paralelkenar)", "Özel Dörtgenler (Eşkenar Dörtgen, Dikdörtgen)", "Özel Dörtgenler (Kare, Deltoid)", "Katı Cisimler (Prizmalar, Piramitler)"],
    "FİZİK": ["Elektrik Akımı ve Devreler", "Mıknatıs ve Manyetik Alan", "Basınç", "Kaldırma Kuvveti", "Dalgalar (Yay, Su)", "Ses ve Deprem Dalgaları", "Aydınlanma ve Gölge", "Yansıma ve Aynalar", "Kırılma", "Mercekler", "Renk"],
    "KİMYA": ["Kimyanın Temel Kanunları", "Mol Kavramı", "Kimyasal Tepkimeler ve Denklemler", "Kimyasal Hesaplamalar", "Karışımlar", "Asitler, Bazlar ve Tuzlar", "Kimya Her Yerde"],
    "BİYOLOJİ": ["Mitoz Bölünme", "Eşeysiz Üreme", "Mayoz Bölünme", "Eşeyli Üreme", "Kalıtımın Genel İlkeleri", "Ekosistem Ekolojisi", "Güncel Çevre Sorunları"],
    "TARİH": ["Yerleşme ve Devletleşme Sürecinde Selçuklu", "Beylikten Devlete Osmanlı", "Devletleşme Sürecinde Savaşçılar ve Askerler", "Beylikten Devlete Osmanlı Medeniyeti", "Dünya Gücü Osmanlı (1453-1595)", "Sultan ve Osmanlı Merkez Teşkilatı", "Klasik Çağda Osmanlı Toplum Düzeni"],
    "COĞRAFYA": ["Yer'in Yapısı ve Kayaçlar", "Levha Tektoniği", "İç ve Dış Kuvvetler", "Türkiye'nin Yer Şekilleri", "Su Kaynakları", "Topraklar", "Bitkiler", "Nüfus", "Göç", "Ekonomik Faaliyetler", "Uluslararası Ulaşım Hatları"]
  },
  11: {
    "TÜRK DİLİ VE EDEBİYATI": ["Giriş (Edebiyat-Toplum)", "Hikaye (Cumhuriyet Dönemi 1923-1960)", "Şiir (Tanzimat, Servetifünun, Fecriati)", "Şiir (Milli Edb, Cumhuriyet)", "Makale", "Sohbet ve Fıkra", "Roman (Cumhuriyet Dönemi)", "Tiyatro", "Eleştiri", "Mülakat"],
    "MATEMATİK": ["Yönlü Açılar", "Trigonometri", "Analitik Geometri (Nokta ve Doğru)", "Fonksiyonlarda Uygulamalar", "Parabol", "Denklem ve Eşitsizlik Sistemleri", "Çemberin Temel Elemanları", "Çemberde Açı", "Çemberde Uzunluk", "Dairede Alan", "Katı Cisimler (Silindir, Koni, Küre)", "Olasılık (Koşullu Olasılık)"],
    "FİZİK": ["Vektörler", "Bağıl Hareket", "Newton'un Hareket Yasaları", "Bir Boyutta Sabit İvmeli Hareket", "İki Boyutta Hareket (Atışlar)", "Enerji ve Hareket", "İtme ve Momentum", "Tork ve Denge", "Kütle ve Ağırlık Merkezi", "Basit Makineler", "Elektriksel Kuvvet ve Alan", "Elektriksel Potansiyel", "Düzgün Elektrik Alan ve Sığa", "Manyetizma ve Elektromanyetik İndüksiyon", "Alternatif Akım ve Transformatörler"],
    "KİMYA": ["Modern Atom Teorisi", "Gazlar", "Sıvı Çözeltiler ve Çözünürlük", "Kimyasal Tepkimelerde Enerji", "Kimyasal Tepkimelerde Hız", "Kimyasal Denge", "Sulu Çözelti Dengeleri (Asit-Baz)", "Çözünürlük Dengesi (KÇÇ)"],
    "BİYOLOJİ": ["Sinir Sistemi", "Endokrin Sistem", "Duyu Organları", "Destek ve Hareket Sistemi", "Sindirim Sistemi", "Dolaşım Sistemi", "Lenf ve Bağışıklık Sistemi", "Solunum Sistemi", "Üriner (Boşaltım) Sistem", "Üreme Sistemi ve Embriyonik Gelişim", "Komünite Ekolojisi", "Popülasyon Ekolojisi"],
    "TARİH": ["Değişen Dünya Dengeleri Karşısında Osmanlı (1595-1774)", "Değişim Çağında Avrupa ve Osmanlı", "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)", "Devrimler Çağında Değişen Devlet-Toplum İlişkileri", "Sermaye ve Emek"],
    "COĞRAFYA": ["Biyoçeşitlilik", "Ekosistemlerin İşleyişi", "Madde Döngüleri ve Enerji Akışı", "Nüfus Politikaları", "Türkiye'de Nüfus ve Yerleşme", "Ekonomik Faaliyetler ve Doğal Kaynaklar", "Türkiye Ekonomisi (Tarım, Hayvancılık)", "Türkiye Ekonomisi (Maden, Sanayi, Enerji)", "Hizmet Sektörü (Ulaşım, Ticaret, Turizm)", "Küresel Ortam: Bölgeler ve Ülkeler", "Çevre ve Toplum"]
  },

};



export const TIME_SLOTS = ["14:30 - 15:10", "15:20 - 16:10", "16:10 - 17:00", "17:00 - 17:45", "17:45 - 18:30", "18:30 - 19:15", "20:10 - 20:50", "21:00 - 22:00"];
export const MODULE2_TIME_SLOTS = [
  "14:30 - 15:15",
  "15:15 - 15:55",
  "15:55 - 16:35",
  "16:35 - 17:15",
  "17:15 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00"
];

export const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
export const SEMESTER_DAYS = ["1. Gün", "2. Gün", "3. Gün", "4. Gün", "5. Gün", "6. Gün", "7. Gün", "8. Gün", "9. Gün", "10. Gün", "11. Gün", "12. Gün", "13. Gün", "14. Gün", "15. Gün"];

// Data parsed from PDF for automation
export const CLASS_PROGRAMS: Record<string, Record<string, string[]>> = {
  "7 E1": {
    "Pazartesi": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "KAAN KELLECİ Matematik", "KAAN KELLECİ Matematik"],
    "Salı": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "KAAN KELLECİ Matematik", "KAAN KELLECİ Matematik"],
    "Çarşamba": ["NİSA HANIM İngilizce", "NİSA HANIM İngilizce", "MEHMET KÜÇÜKOĞLU Fen", "MEHMET KÜÇÜKOĞLU Fen"],
    "Perşembe": ["ETÜT/SORU ÇÖZÜMÜ", "NADİRE HANIM İnk.Tar", "NADİRE HANIM İnk.Tar", "ETÜT/SORU ÇÖZÜMÜ"],
    "Cuma": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ALİ HAYDAR ÇOBAN Türkçe", "ALİ HAYDAR ÇOBAN Türkçe"]
  },
  "7 ATAK": {
    "Pazartesi": ["EYÜP SÜLÜKER Fen Bilg.", "EYÜP SÜLÜKER Fen Bilg.", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Salı": ["ALİ HAYDAR ÇOBAN Türkçe", "ALİ HAYDAR ÇOBAN Türkçe", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Çarşamba": ["ÇİĞDEM AKDEMİR İnk.Tar", "ÇİĞDEM AKDEMİR İnk.Tar", "NİSA HANIM İngilizce", "ETÜT/SORU ÇÖZÜMÜ"],
    "Perşembe": ["ETÜT/SORU ÇÖZÜMÜ", "TANER ERGÜLEN Matematik", "TANER ERGÜLEN Matematik", "ETÜT/SORU ÇÖZÜMÜ"],
    "Cuma": ["NİSA HANIM İngilizce", "TANER ERGÜLEN Matematik", "TANER ERGÜLEN Matematik", "ETÜT/SORU ÇÖZÜMÜ"]
  },
  "7 E2": {
    "Pazartesi": ["MEHMET KÜÇÜKOĞLU Fen", "MEHMET KÜÇÜKOĞLU Fen", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Salı": ["KAAN KELLECİ Matematik", "NADİRE HANIM İnk.Tar", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Çarşamba": ["SERDAR BEY Türkçe", "SERDAR BEY Türkçe", "NADİRE HANIM İnk.Tar", "ETÜT/SORU ÇÖZÜMÜ"],
    "Perşembe": ["KAAN KELLECİ Matematik", "KAAN KELLECİ Matematik", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Cuma": ["KAAN KELLECİ Matematik", "NİSA HANIM İngilizce", "NİSA HANIM İngilizce", "ETÜT/SORU ÇÖZÜMÜ"]
  },
  "7 E3": {
    "Pazartesi": ["SERDAR BEY Türkçe", "SERDAR BEY Türkçe", "ETÜT/SORU ÇÖZÜMÜ", "MEHMET KÜÇÜKOĞLU Fen"],
    "Salı": ["NADİRE HANIM İnk.Tar", "NİSA HANIM İngilizce", "NİSA HANIM İngilizce", "ETÜT/SORU ÇÖZÜMÜ"],
    "Çarşamba": ["MEHMET KÜÇÜKOĞLU Fen", "KAAN KELLECİ Matematik", "KAAN KELLECİ Matematik", "ETÜT/SORU ÇÖZÜMÜ"],
    "Perşembe": ["NADİRE HANIM İnk.Tar", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Cuma": ["ETÜT/SORU ÇÖZÜMÜ", "KAAN KELLECİ Matematik", "KAAN KELLECİ Matematik", "ETÜT/SORU ÇÖZÜMÜ"]
  },
  "F1": {
    "Pazartesi": ["DİLAN KILIÇ Matematik", "DİLAN KILIÇ Matematik", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Salı": ["ETÜT/SORU ÇÖZÜMÜ", "EYÜP SÜLÜKER Fen Bilg.", "EYÜP SÜLÜKER Fen Bilg.", "ETÜT/SORU ÇÖZÜMÜ"],
    "Çarşamba": ["F1 MAT SOR ÇÖZ Matematik", "F1 MAT SOR ÇÖZ Matematik", "MURAT GENÇ Türkçe", "MURAT GENÇ Türkçe"],
    "Perşembe": ["DİLAN KILIÇ Matematik", "DİLAN KILIÇ Matematik", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Cuma": ["ETÜT/SORU ÇÖZÜMÜ", "İPEK HANIM İngilizce", "İPEK HANIM İngilizce", "ETÜT/SORU ÇÖZÜMÜ"]
  },
  "F2": {
    "Pazartesi": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "İPEK HANIM İngilizce"],
    "Salı": ["EYÜP SÜLÜKER Fen Bilg.", "ETÜT/SORU ÇÖZÜMÜ", "NADİRE HANIM İnk.Tar", "NADİRE HANIM İnk.Tar"],
    "Çarşamba": ["MURAT GENÇ Türkçe", "MURAT GENÇ Türkçe", "F2 MAT SOR ÇÖZ Matematik", "F2 MAT SOR ÇÖZ Matematik"],
    "Perşembe": ["EYÜP SÜLÜKER Fen Bilg.", "MİKAİL YILDIZ Matematik", "MİKAİL YILDIZ Matematik", "ETÜT/SORU ÇÖZÜMÜ"],
    "Cuma": ["MİKAİL YILDIZ Matematik", "MİKAİL YILDIZ Matematik", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"]
  },
  "F3": {
    "Pazartesi": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "NADİRE HANIM İnk.Tar"],
    "Salı": ["MURAT GENÇ Türkçe", "MURAT GENÇ Türkçe", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Çarşamba": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "MİKAİL YILDIZ Matematik"],
    "Perşembe": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "MİKAİL YILDIZ Matematik"],
    "Cuma": ["EYÜP SÜLÜKER Fen Bilg.", "EYÜP SÜLÜKER Fen Bilg.", "ETÜT/SORU ÇÖZÜMÜ", "İPEK HANIM İngilizce"]
  },
  "F4": {
    "Pazartesi": ["ETÜT/SORU ÇÖZÜMÜ", "İPEK HANIM İngilizce", "İPEK HANIM İngilizce", "ETÜT/SORU ÇÖZÜMÜ"],
    "Salı": ["MİKAİL YILDIZ Matematik", "MİKAİL YILDIZ Matematik", "SERDAR BEY Türkçe", "SERDAR BEY Türkçe"],
    "Çarşamba": ["NADİRE HANIM İnk.Tar", "NADİRE HANIM İnk.Tar", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Perşembe": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "EYÜP SÜLÜKER Fen Bilg."],
    "Cuma": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "MİKAİL YILDIZ Matematik"]
  },
  "F5": {
    "Pazartesi": ["MİKAİL YILDIZ Matematik", "MİKAİL YILDIZ Matematik", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ"],
    "Salı": ["ETÜT/SORU ÇÖZÜMÜ", "İPEK HANIM İngilizce", "İPEK HANIM İngilizce", "MİKAİL YILDIZ Matematik"],
    "Çarşamba": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "SERDAR BEY Türkçe", "SERDAR BEY Türkçe"],
    "Perşembe": ["ETÜT/SORU ÇÖZÜMÜ", "EYÜP SÜLÜKER Fen Bilg.", "EYÜP SÜLÜKER Fen Bilg.", "ETÜT/SORU ÇÖZÜMÜ"],
    "Cuma": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "NADİRE HANIM İnk.Tar", "NADİRE HANIM İnk.Tar"]
  },
  "F6": {
    "Pazartesi": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "NİDA HANIM Fen Bilg.", "NİDA HANIM Fen Bilg."],
    "Salı": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "İPEK HANIM İngilizce"],
    "Çarşamba": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "KAAN KELLECİ Matematik"],
    "Perşembe": ["ETÜT/SORU ÇÖZÜMÜ", "ETÜT/SORU ÇÖZÜMÜ", "KAAN KELLECİ Matematik", "KAAN KELLECİ Matematik"],
    "Cuma": ["SERDAR BEY Türkçe", "SERDAR BEY Türkçe", "ÇİĞDEM AKDEMİR İnk.Tar", "ÇİĞDEM AKDEMİR İnk.Tar"]
  }
};


export const MOTIVATION_QUOTES = [
  "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.",
  "Gelecek, bugün ne yaptığına bağlıdır.",
  "Sadece çalış, sessizce. Bırak başarı gürültünü yapsın.",
  "Durmadığın sürece ne kadar yavaş gittiğinin bir önemi yok.",
  "Vazgeçmediğin sürece yenilmiş sayılmazsın.",
  "🚀 Harikasın şampiyon! Bu maratonun sonu zafer, adımlarını sağlam at.",
  "🔥 O son soru seni değil, sen onu yeneceksin! Masaya dön ve gücünü göster.",
  "🌟 Bugün çözdüğün her soru, hayallerindeki geleceğe döşediğin bir tuğla.",
  "💎 Elmas baskı altında oluşur. Şu an hissettiğin zorluk, parlayacağın anın habercisi."
];

export const STUDENT_LEVELS: Record<string, StudentLevel> = {
  BASLANGIC: { label: "Başlangıç", multiplier: 0.7, color: "bg-green-100 text-green-700" },
  ORTA: { label: "Orta", multiplier: 1.0, color: "bg-blue-100 text-blue-700" },
  ILERI: { label: "İleri", multiplier: 1.3, color: "bg-purple-100 text-purple-700" }
};

export const SUBTOPIC_SUGGESTIONS: Record<string, string[]> = {
  "Sözcükte Anlam": ["Gerçek/Mecaz Anlam", "Terim Anlam", "Eş/Zıt Anlam", "Söz Grupları"],
  "Cümlede Anlam": ["Neden-Sonuç", "Amaç-Sonuç", "Koşul-Sonuç", "Öznel/Nesnel Bakış"],
  "Paragrafta Anlam": ["Ana Düşünce", "Yardımcı Düşünce", "Yapı (Giriş-Gelişme-Sonuç)", "Anlatım Teknikleri"],
  "Yazım Kuralları": ["Büyük Harflerin Yazımı", "Sayıların Yazımı", "De/Ki/Mi Yazımı", "Kısaltmalar"],
  "Noktalama İşaretleri": ["Virgülün Görevleri", "Noktalı Virgül", "Kesme İşareti", "Tırnak İşareti"],
  "Fiilimsiler": ["İsim Fiil", "Sıfat Fiil", "Zarf Fiil", "Fiilimsi Ekleri"],
  "Cümlenin Ögeleri": ["Özne-Yüklem", "Nesne (Belirtili/Belirtisiz)", "Tümleçler (Dolaylı/Zarf)"],
  "Çarpanlar ve Katlar": ["EBOB-EKOK", "Asal Sayılar", "Aralarında Asal Olma", "Bölünebilme"],
  "Üslü İfadeler": ["Negatif Kuvvet", "Üslü Sayılarda İşlemler", "Bilimsel Gösterim", "Ondalık Çözümleme"],
  "Kareköklü İfadeler": ["Tam Kare Sayılar", "Kök Dışına Çıkarma", "Kareköklü İşlemler", "İrrasyonel Sayılar"],
  "Cebirsel İfadeler": ["Özdeşlikler", "Çarpanlara Ayırma", "Denklem Kurma", "X Değerini Bulma"],
  "Mevsimler ve İklim": ["Mevsimlerin Oluşumu", "Hava Olayları", "İklim ve Modifikasyon", "Küresel Isınma"],
  "DNA ve Genetik Kod": ["Nükleotidler", "Eşlenme", "Kalıtım ve Çaprazlama", "Mutasyon/Modifikasyon"],
  "Basınç": ["Katı Basıncı", "Sıvı Basıncı", "Açık Hava Basıncı", "Pascal Prensibi"],
  "Mevsimler ve İklim ": ["Eksen Eğikliği", "Güneş Işınları", "Hava Olayları", "İklim Tipleri"],
};

export const DISTRIBUTION_MODES: Record<string, DistributionMode> = {
  LIGHT: { label: "Hafif Tempo", questionBase: 15, color: "bg-green-100 border-green-200 text-green-700" },
  MEDIUM: { label: "Standart", questionBase: 30, color: "bg-blue-100 border-blue-200 text-blue-700" },
  HEAVY: { label: "Yoğun Kamp", questionBase: 50, color: "bg-red-100 border-red-200 text-red-700" },
  SEMESTER: { label: "15 Tatil Kampı", questionBase: 75, color: "bg-orange-50 border-orange-200 text-orange-700" }
};

export const GROUP_SCHEDULES: GroupSchedules = {
  "8-F5": {
    "Pazartesi_17:45 - 18:30": { code: "MAT (MİKAİL)", locked: true }, "Pazartesi_18:30 - 19:15": { code: "MAT (MİKAİL)", locked: true },
    "Salı_15:20 - 16:10": { code: "İNK (NADİRE)", locked: true }, "Salı_16:10 - 17:00": { code: "İNK (NADİRE)", locked: true },
    "Çarşamba_15:20 - 16:10": { code: "FEN (EYÜP)", locked: true }, "Çarşamba_16:10 - 17:00": { code: "FEN (EYÜP)", locked: true }, "Çarşamba_17:00 - 17:45": { code: "TRK (SERDAR)", locked: true }, "Çarşamba_17:45 - 18:30": { code: "TRK (SERDAR)", locked: true },
    "Perşembe_17:45 - 18:30": { code: "MAT (MİKAİL)", locked: true }, "Perşembe_18:30 - 19:15": { code: "MAT (MİKAİL)", locked: true },
    "Cuma_17:45 - 18:30": { code: "İNG (İPEK)", locked: true }, "Cuma_18:30 - 19:15": { code: "İNG (İPEK)", locked: true }
  },
  "Bireysel": {}
};
