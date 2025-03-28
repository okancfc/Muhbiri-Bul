"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const LOCATIONS = [
  "Uçak", "Plaj", "Katedral", "Şirket Partisi", "Kumarhane", 
  "Elçilik", "Otel", "Film Stüdyosu", "Yolcu Treni", "Kutup İstasyonu", 
  "Restoran", "Servis İstasyonu", "Denizaltı", "Üniversite", "Banka", 
  "Tiyatro", "Sirk Çadırı", "Haçlı Ordusu", "Günlük Spa", 
  "Hastane", "Askeri Üs", "Okyanus Gemisi", "Korsan Gemisi", 
  "Polis Karakolu", "Okul", "Uzay İstasyonu", "Süpermarket"
];

export default function GamePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const playerNames = searchParams.get("players")?.split(",") || ["Oyuncu 1", "Oyuncu 2"];

  // Oyuncu sayısına göre konum ve muhbir ataması
  const assignLocations = () => {
    const totalPlayers = playerNames.length;
    
    // Muhbir oyuncusunu rastgele seç
    const informantIndex = Math.floor(Math.random() * totalPlayers);
    
    // Rastgele bir konum seç
    const randomLocationIndex = Math.floor(Math.random() * LOCATIONS.length);
    const commonLocation = LOCATIONS[randomLocationIndex];

    return playerNames.map((name, index) => {
      if (index === informantIndex) {
        return {
          name,
          location: "Muhbir Sensin",
          isInformant: true
        };
      } else {
        return {
          name,
          location: commonLocation,
          isInformant: false
        };
      }
    });
  };

  const [players, setPlayers] = useState(assignLocations());
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
            
            {/* Konum Kartı */}
            {revealedPlayerIndex === index && (
              <div className={`
                absolute z-10 top-full mt-2 left-1/2 transform -translate-x-1/2 
                bg-white text-black p-3 rounded-lg shadow-lg 
                text-center w-48 animate-fade-in
                ${player.isInformant ? 'border-2 border-red-500' : ''}
              `}>
                <p className="text-lg font-bold">Konumunuz:</p>
                <p className={`
                  text-3xl font-bold 
                  ${player.isInformant ? 'text-red-600' : 'text-green-600'}
                `}>
                  {player.location}
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
          <div className="bg-white text-black p-6 rounded-lg text-center w-80">
            <h2 className="text-2xl font-bold mb-4">Konum Listesi</h2>
            <div className="grid grid-cols-2 gap-2">
              {LOCATIONS.sort().map((location, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap"
                >
                  {location}
                </div>
              ))}
            </div>
            <button 
              onClick={toggleLocationList}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => setPlayers(assignLocations())}
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