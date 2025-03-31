import { useState, useEffect } from "react";

interface Player {
  name: string;
  points: number;
}

export const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  // Function to fetch leaderboard data
  const getData = async () => {
    try {
      const response = await fetch("http://sevansco.pythonanywhere.com/leaderboard");
      if (response.ok) {
        const data = await response.json();
        // Sort players before updating state
        setPlayers(data.sort((a: Player, b: Player) => b.points - a.points));
      } else {
        console.error("Failed to fetch leaderboard data");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // Fetch leaderboard data every 5 seconds
  useEffect(() => {
    getData(); // Initial fetch

    const interval = setInterval(() => {
      getData();
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="w-1/2 bg-gray-800 p-4 rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">Rank</th>
              <th className="p-2">Name</th>
              <th className="p-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.name} className="border-b border-gray-700">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{player.name}</td>
                <td className="p-2">{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
