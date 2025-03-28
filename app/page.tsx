"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  // Varsayılan olarak 3 oyuncu
  const [players, setPlayers] = useState(["", "", ""]);

  // Oyuncu ismini güncelle
  const handleNameChange = (index: number, name: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = name;
    setPlayers(updatedPlayers);
  };

  // Yeni oyuncu ekleme
  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, ""]);
    } else {
      alert("En fazla 6 oyuncu ekleyebilirsiniz.");
    }
  };

  // Oyunu başlat
  const startGame = () => {
    const validPlayers = players.filter(name => name.trim() !== "");
    if (validPlayers.length < 2) {
      alert("En az 2 oyuncu adı girin!");
      return;
    }
    router.push(`/game?players=${encodeURIComponent(validPlayers.join(","))}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-80">
        <h1 className="text-2xl font-bold mb-4">Muhbiri Bul!</h1>

        {/* Oyuncu İsimleri */}
        <div className="space-y-2">
          {players.map((name, index) => (
            <input
              key={index}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Oyuncu ${index + 1} Adı`}
              className="w-full p-2 rounded text-white"
            />
          ))}
        </div>

        {/* Yeni Oyuncu Ekleme Butonu */}
        {players.length < 6 && (
          <button
            onClick={addPlayer}
            className="mr-1 mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
          >
            + Ekle
          </button>
        )}

        {/* Oyunu Başlat Butonu */}
        <button
          onClick={startGame}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
        >
          Başla
        </button>
      </div>
    </div>
  );
}
