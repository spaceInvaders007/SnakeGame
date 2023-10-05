import React, { useRef, useEffect, useState } from "react";

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pos, setPos] = useState({ x: 200, y: 200 });
  const movementInterval = useRef<number | null>(null);

  const handleKeydown = (e: KeyboardEvent) => {
    if (movementInterval.current) {
      clearInterval(movementInterval.current);
    }

    const moveAmount = 10;
    const radius = 10;

    movementInterval.current = window.setInterval(() => {
      setPos((prevPos) => {
        let newX = prevPos.x;
        let newY = prevPos.y;

        switch (e.key) {
          case "ArrowUp":
            newY = Math.max(newY - moveAmount, radius);
            break;
          case "ArrowDown":
            newY = Math.min(newY + moveAmount, 400 - radius);
            break;
          case "ArrowLeft":
            newX = Math.max(newX - moveAmount, radius);
            break;
          case "ArrowRight":
            newX = Math.min(newX + moveAmount, 400 - radius);
            break;
        }

        if (
          newY === radius ||
          newY === 400 - radius ||
          newX === radius ||
          newX === 400 - radius
        ) {
          if (movementInterval.current !== null) {
            clearInterval(movementInterval.current);
          }
        }

        return { x: newX, y: newY };
      });
    }, 100);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (movementInterval.current !== null) {
        clearInterval(movementInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, 400, 400);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
      }
    }
  }, [pos]);

  return <canvas ref={canvasRef} width={400} height={400}></canvas>;
};
