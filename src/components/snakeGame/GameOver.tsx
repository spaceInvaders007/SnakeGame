import { useEffect, useState } from "react";

export const GameOver: React.FC = () => {
  const colors = ["red", "blue", "green", "yellow", "purple"];
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const generateLightbulbs = () => {
    const bulbs = [];
    const bulbSpacing = 30; 
    const totalWidth = 360; 
    const totalHeight = 120; 

    // Top and Bottom
    for (let x = 0; x <= totalWidth; x += bulbSpacing) {
      bulbs.push({ x, y: 0 }); // Top bulbs
      bulbs.push({ x, y: totalHeight }); // Bottom bulbs
    }

    // Left and Right
    for (let y = bulbSpacing; y < totalHeight; y += bulbSpacing) {
      bulbs.push({ x: 0, y }); // Left bulbs
      bulbs.push({ x: totalWidth, y }); // Right bulbs
    }

    return bulbs;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        padding: "20px",
        width: "320px",
        height: "80px",
        background: "#acbe25",
        backgroundSize: "40px 40px",
        borderRadius: "10px",
        border: "10px solid #acbe25",
        boxShadow: "0 0 15px rgba(0,0,0,0.5)",
      }}
    >
      {generateLightbulbs().map((pos, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            width: "15px",
            height: "15px",
            background: colors[(colorIndex + idx) % colors.length],
            borderRadius: "50%",
            boxShadow: "0 0 5px 2px rgba(0,0,0,0.3)",
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
      <h1
        style={{
          fontFamily: "'Dancing Script', cursive",
          color: "#fff",
          fontSize: "3em",
          textShadow: "2px 2px 4px #000000",
          bottom: "-6px",
          right: "80px",
          position: "absolute",
          
        }}
      >
        Game Over
      </h1>
    </div>
  );
};
