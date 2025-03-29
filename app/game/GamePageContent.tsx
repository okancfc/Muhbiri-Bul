"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Lokasyonlar ve her lokasyon için olası roller
const LOCATIONS_AND_ROLES: {[key: string]: string[]} = {
  "Uçak": ["Pilot", "Hostes", "Yolcu", "Hava Trafik Kontrolörü", "Kaçak Yolcu"],
  "Plaj": ["Cankurtaran", "Turist", "Dondurma Satıcısı", "Sörf Eğitmeni", "Plaj Görevlisi"],
  "Katedral": ["Rahip", "Turist", "Korist", "Temizlik Görevlisi", "Restoratör"],
  "Şirket Partisi": ["CEO", "Stajyer", "Pazarlama Müdürü", "İK Uzmanı", "Güvenlik Görevlisi"],
  "Kumarhane": ["Krupiye", "Zengin Müşteri", "Barmen", "Güvenlik", "Poker Oyuncusu"],
  "Elçilik": ["Büyükelçi", "Diplomat", "Tercüman", "Güvenlik Görevlisi", "Göçmen Başvuru Görevlisi"],
  "Otel": ["Resepsiyon Görevlisi", "Oda Servisi", "Müşteri", "Otel Müdürü", "Temizlik Görevlisi"],
  "Film Stüdyosu": ["Yönetmen", "Oyuncu", "Kameraman", "Ses Teknisyeni", "Makyajcı"],
  "Yolcu Treni": ["Kondüktör", "Turist", "İş Adamı", "Restoran Şefi", "Makinist"],
  "Kutup İstasyonu": ["Bilim İnsanı", "Doktor", "Mühendis", "Aşçı", "Meteorolog"],
  "Restoran": ["Şef", "Garson", "Müşteri", "Bulaşıkçı", "Maître d'hôtel"],
  "Servis İstasyonu": ["Pompacı", "Kasiyer", "Tamirci", "Müşteri", "Temizlik Görevlisi"],
  "Denizaltı": ["Kaptan", "Denizci", "Mühendis", "Aşçı", "Sonar Teknisyeni"],
  "Üniversite": ["Profesör", "Öğrenci", "Laboratuvar Asistanı", "Kütüphaneci", "Kantin Görevlisi"],
  "Banka": ["Müdür", "Kasiyer", "Güvenlik Görevlisi", "Müşteri", "Kredi Uzmanı"],
  "Tiyatro": ["Aktör", "Yönetmen", "Bilet Görevlisi", "İzleyici", "Kostüm Tasarımcısı"],
  "Sirk Çadırı": ["Palyaço", "Akrobat", "Jonglör", "İzleyici", "Hayvan Terbiyecisi"],
  "Haçlı Ordusu": ["Şövalye", "Okçu", "Papaz", "Kral", "Çavuş"],
  "Günlük Spa": ["Masör", "Müşteri", "Resepsiyon Görevlisi", "Temizlik Görevlisi", "Sauna Görevlisi"],
  "Hastane": ["Doktor", "Hemşire", "Hasta", "Cerrah", "Temizlik Görevlisi"],
  "Askeri Üs": ["Komutan", "Asker", "Doktor", "Pilot", "İstihbarat Subayı"],
  "Okyanus Gemisi": ["Kaptan", "Denizci", "Turist", "Aşçı", "Tayfun"],
  "Korsan Gemisi": ["Kaptan", "Güverteci", "Savaşçı", "Haritacı", "Top Ustası"],
  "Polis Karakolu": ["Komiser", "Polis", "Dedektif", "Suçlu", "Sekreter"],
  "Okul": ["Öğretmen", "Öğrenci", "Okul Müdürü", "Hademe", "Kantinci"],
  "Uzay İstasyonu": ["Astronot", "Mühendis", "Doktor", "Komutan", "Bilim İnsanı"],
  "Süpermarket": ["Kasiyer", "Müşteri", "Müdür", "Raf Düzenleyici", "Güvenlik Görevlisi"]
};

// Konumları diziye dönüştür
const LOCATIONS = Object.keys(LOCATIONS_AND_ROLES);

export default function GamePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const playerNames = searchParams.get("players")?.split(",") || ["Oyuncu 1", "Oyuncu 2"];

  // Oyuncu sayısına göre konum, rol ve muhbir ataması
  const assignLocationsAndRoles = () => {
    const totalPlayers = playerNames.length;
    
    // Muhbir oyuncusunu rastgele seç
    const informantIndex = Math.floor(Math.random() * totalPlayers);
    
    // Rastgele bir konum seç
    const randomLocationIndex = Math.floor(Math.random() * LOCATIONS.length);
    const commonLocation = LOCATIONS[randomLocationIndex];
    
    // Seçilen konum için rolleri al
    const availableRoles = [...LOCATIONS_AND_ROLES[commonLocation]];
    
    // Seçilen rolü hatırlamak için dizi
    const selectedRoles: string[] = [];
    
    return playerNames.map((name, index) => {
      if (index === informantIndex) {
        return {
          name,
          location: "Muhbir Sensin",
          role: "Lokasyonu ve rolleri öğren!",
          isInformant: true
        };
      } else {
        // Henüz yeterli rol kalmadıysa, mevcut roller arasından rastgele seç
        if (availableRoles.length === 0) {
          const randomRole = selectedRoles[Math.floor(Math.random() * selectedRoles.length)];
          return {
            name,
            location: commonLocation,
            role: randomRole,
            isInformant: false
          };
        }
        
        // Rastgele bir rol seç ve listeden çıkar
        const roleIndex = Math.floor(Math.random() * availableRoles.length);
        const role = availableRoles[roleIndex];
        availableRoles.splice(roleIndex, 1);
        
        // Seçilen rolü hatırla
        selectedRoles.push(role);
        
        return {
          name,
          location: commonLocation,
          role: role,
          isInformant: false
        };
      }
    });
  };

  const [players, setPlayers] = useState(assignLocationsAndRoles());
  const [timeLeft, setTimeLeft] = useState(300);
  const [revealedPlayerIndex, setRevealedPlayerIndex] = useState<number | null>(null);
  const [showLocationList, setShowLocationList] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 0) return prev - 1;
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const revealScore = (index: number) => {
    setRevealedPlayerIndex(prevIndex => prevIndex === index ? null : index);
  };

  const toggleLocationList = () => {
    setShowLocationList(!showLocationList);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Konum Listesi Butonu */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleLocationList}
          className="bg-green-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-600"
        >
          Konum Listesi
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Rolünü görmek için adına tıkla</h1>
      
      <div className="text-3xl font-semibold bg-gray-500 px-6 py-2 rounded-lg mb-6">
        {formatTime(timeLeft)}
      </div>

      <div className="flex flex-col space-y-4 mb-6 relative">
        {players.map((player, index) => (
          <div 
            key={index} 
            className="relative"
          >
            <div 
              onClick={() => revealScore(index)}
              className={`
                bg-gray-700 p-4 rounded-lg text-center w-64 cursor-pointer hover:bg-gray-600 transition relative`}
            >
              <h2 className="text-xl font-semibold">{player.name}</h2>
            </div>
            
            {/* Konum ve Rol Kartı */}
            {revealedPlayerIndex === index && (
              <div className={`
                absolute z-10 top-full mt-2 left-1/2 transform -translate-x-1/2 
                bg-white text-black p-3 rounded-lg shadow-lg 
                text-center w-60 
                ${player.isInformant ? 'border-2 border-red-500' : ''}
              `}>
                <p className="text-lg font-semibold">Konumunuz:</p>
                <p className={`
                  text-xl font-bold mb-2
                  ${player.isInformant ? 'text-red-600' : 'text-green-600'}
                `}>
                  {player.location}
                </p>
                
                <p className="text-lg font-semibold">Rolünüz:</p>
                <p className={`
                  text-xl font-bold
                  ${player.isInformant ? 'text-red-600' : 'text-blue-600'}
                `}>
                  {player.role}
                </p>
                
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                  <div className="w-0 h-0 
                      border-l-8 border-l-transparent
                      border-r-8 border-r-transparent
                      border-b-8 border-b-white"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Konum Listesi Modalı */}
      {showLocationList && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="">
          <button 
              onClick={toggleLocationList}
              className="sm:absolute sm:left-10 sm:bottom-230 absolute left-4 top-4 mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Kapat
            </button>
            </div>
          <div className="bg-white text-black p-4 rounded-lg text-center w-90 sm:w-140 max-h-screen overflow-y-auto">
            <h2 className="py-15 pb-2 text-2xl font-bold mb-4">Konum Listesi</h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.keys(LOCATIONS_AND_ROLES).sort().map((location, index) => (
                <div key={index} className="mb-2">
                  <div className="text-lg bg-gray-800 text-white px-2 py-1 rounded-md font-bold">
                    {location}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-1">
                    {LOCATIONS_AND_ROLES[location].map((role, roleIndex) => (
                      <div key={roleIndex} className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded-md">
                        {role}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => {
            setPlayers(assignLocationsAndRoles());
            setTimeLeft(300); // Sayaç 5 dakikaya (300 saniye) sıfırlanıyor
          }}
          className="bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-600"
        >
          Yeni Tur
        </button>

        <button
          onClick={() => router.push("/")}
          className="bg-red-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-600"
        >
          Ana Ekrana Dön
        </button>
      </div>
    </div>
  );
}