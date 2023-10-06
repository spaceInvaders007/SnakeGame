import React, { useRef, useEffect, useState } from "react";

const radius = 10;
const moveAmount = 2 * radius;
const canvasSize = 400;
const gridSize = 2 * radius;
const numberOfGridSquares = canvasSize / gridSize;

const generateRandomGridPosition = (): { x: number; y: number } => {
    const x = Math.floor(Math.random() * numberOfGridSquares) * gridSize + radius;
    const y = Math.floor(Math.random() * numberOfGridSquares) * gridSize + radius;
    return { x, y };
};

const checkCollision = (p1: { x: number; y: number }, p2: { x: number; y: number }): boolean => {
    return p1.x === p2.x && p1.y === p2.y;
};

const initialRandomPosition = generateRandomGridPosition()

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [foodPos, setFoodPos] = useState<{ x: number; y: number } | null>(initialRandomPosition);
  const [snakePos, setSnakePos] = useState({ x: 200, y: 200 });
  const movementInterval = useRef<number | null>(null);

  const handleKeydown = (e: KeyboardEvent) => {
    if (movementInterval.current) {
      clearInterval(movementInterval.current);
    }

    movementInterval.current = window.setInterval(() => {
      setSnakePos((prevPos) => {
        let newX = prevPos.x;
        let newY = prevPos.y;

        switch (e.key) {
          case "ArrowUp":
            newY = Math.max(newY - moveAmount, radius);
            break;
          case "ArrowDown":
            newY = Math.min(newY + moveAmount, canvasSize - radius);
            break;
          case "ArrowLeft":
            newX = Math.max(newX - moveAmount, radius);
            break;
          case "ArrowRight":
            newX = Math.min(newX + moveAmount, canvasSize - radius);
            break;
        }

        if (foodPos && checkCollision({ x: newX, y: newY }, foodPos)) {
          console.log("Collision detected!");
          setFoodPos(generateRandomGridPosition());
        }

        return { x: newX, y: newY };
      });
    }, 200);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [foodPos]);

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
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.beginPath();
        ctx.arc(snakePos.x, snakePos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();

        if (foodPos) {
          ctx.beginPath();
          ctx.arc(foodPos.x, foodPos.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      }
    }
  }, [snakePos, foodPos]);

  return <canvas ref={canvasRef} width={canvasSize} height={canvasSize}></canvas>;
};
