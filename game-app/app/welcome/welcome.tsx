import { useState, useEffect } from "react";
import {useNavigate} from "react-router";
export const Welcome = () => {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const redirect = (path: string) => {
    navigate(path);
  }
  const handleStart = () => {
    setShowInput(true);
  };

  const handlePlay = async () => {
    if (name.trim()) {
    try {
        const response = await fetch("https://sevansco.pythonanywhere.com/leaderboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          alert("Error: " + (errorData.error || "Unknown error occurred"));
          return;
        }
  
        localStorage.setItem("name", name);
        redirect("/game");
      } catch (error) {
        alert("Network Error: " + error);
      }
    } 
      redirect("/game");
  };
  useEffect(() => {
    // Check if the name is already stored in localStorage
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
      console.log("Name found in localStorage:", storedName); // Debugging
      redirect("/game"); // Redirect to game if name is found
    } else {
      //setShowInput(true); // Show input if no name is stored
    }
  }, []);
  
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {!showInput ? (
        <div className="text-center transition-opacity duration-500 ease-in-out">
          <h1 className="text-4xl font-bold mb-6">Welcome to the encryption challenge!</h1>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-lg transition-transform duration-300 hover:scale-105"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center transition-transform duration-500 ease-in-out transform translate-y-4 opacity-100">
          <h2 className="text-2xl font-semibold mb-4">Enter Your Name</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 rounded-lg  border-2 border-gray-300 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handlePlay}
            className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg transition-transform duration-300 hover:scale-105"
          >
            Let's Play!
          </button>
        </div>
      )}
    </div>
  );
}
