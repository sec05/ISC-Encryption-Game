import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
type GameState = "select" | "playing" | "completed";
type Difficulty = "easy" | "medium" | "hard" | null;

export const Game: React.FC = () => {
  const navigate = useNavigate();
  const redirect = (path: string) => {
    navigate(path);
  };
  const [gameState, setGameState] = useState<GameState>("select");
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [challenge, setChallenge] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [challengeID, setChallengeID] = useState<number>(-1);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    // Check if the name is already stored in localStorage
    const storedName = localStorage.getItem("name");
    if (!storedName) {
      redirect("/"); // Redirect to game if name is found
    } else {
      //setShowInput(true); // Show input if no name is stored
      setName(storedName);
      console.log("Name found in localStorage:", storedName); // Debugging
    }
  }, []);
  

  const handleDifficultySelect = async (level: Difficulty) => {
    if (!level) return;

    try {
      const response = await fetch(`http://127.0.0.1:5555/challenge/${level}`);
      if (!response.ok) throw new Error("Failed to fetch challenge");

      const data = await response.json();
      console.log("Challenge data received:", data); // Debugging

      setDifficulty(level);
      setChallenge(data["challenge"] || "No challenge received!");
      setChallengeID(data["id"] ?? -1);
      setGameState("playing");
    } catch (error) {
      console.error("Error fetching challenge:", error);
      setChallenge("Error loading challenge. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:5555/challenge/${challengeID}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json", 
            },
            body: JSON.stringify({ answer: userInput, name: name }), // Include the name in the request body
          });
          
        if (!response.ok) throw new Error("Failed to submit answer");
        const data = await response.json();
        console.log("Response data:", data); // Debugging
        if (data["status"] === "correct") {
            setGameState("select");
            setUserInput(""); // Clear the input field
            alert("Correct! Well done.");
            setChallenge("");
            }
    } catch (error) {
        alert("error with answer! try again");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {gameState === "select" && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Select Difficulty</h1>
          <div className="flex space-x-4">
            {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultySelect(level)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-lg transition-transform duration-300 hover:scale-105"
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Decrypt:</h2>
          <p className="mb-4 text-lg">{challenge}</p>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 outline-none"
            placeholder="Enter answer"
          />
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg transition-transform duration-300 hover:scale-105"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
