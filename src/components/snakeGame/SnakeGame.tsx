import React, { useRef, useEffect, useState } from "react";
import { GameOver } from "./GameOver";

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

const checkCollision = (
  p1: { x: number; y: number },
  p2: { x: number; y: number } | null
): boolean => {
  if (p2) {
    return p1.x === p2.x && p1.y === p2.y;
  }
  return false;
};

const initialFoodRandomPosition = generateRandomGridPosition();
const initialSnakeRandomPosition = generateRandomGridPosition();

export const SnakeGame: React.FC = () => {
  const [gameOver, setGameOver] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [foodPos, setFoodPos] = useState<{ x: number; y: number } | null>(
    initialFoodRandomPosition
  );
  const [snake, setSnake] = useState<Array<{ x: number; y: number }>>([
    initialSnakeRandomPosition,
  ]);
  const [currentDirection, setCurrentDirection] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const movementInterval = useRef<number | null>(null);
  const directionBuffer = useRef<{ x: number; y: number }[]>([]);

  const handleKeydown = (e: KeyboardEvent) => {

    if (gameOver) {
      return;
    }
    
    let newDirection = null;

    switch (e.key) {
      case "ArrowUp":
        if (currentDirection.y === 0) newDirection = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (currentDirection.y === 0) newDirection = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (currentDirection.x === 0) newDirection = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (currentDirection.x === 0) newDirection = { x: 1, y: 0 };
        break;
    }

    if (newDirection) {
      directionBuffer.current.push(newDirection);
      if (directionBuffer.current.length > 2) {
        directionBuffer.current.shift();
      }
    }
  };

  useEffect(() => {
    if (movementInterval.current) {
      clearInterval(movementInterval.current);
    }

    movementInterval.current = window.setInterval(() => {
      if (directionBuffer.current.length) {
        setCurrentDirection(directionBuffer.current.shift()!);
      }

      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + currentDirection.x * moveAmount,
          y: prevSnake[0].y + currentDirection.y * moveAmount,
        };

        if (
          newHead.x < radius ||
          newHead.x > canvasSize - radius ||
          newHead.y < radius ||
          newHead.y > canvasSize - radius
        ) {
          setGameOver(true);
          if (movementInterval.current !== null) {
            clearInterval(movementInterval.current);
          }
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        if (checkCollision(newHead, foodPos)) {
          setFoodPos(generateRandomGridPosition());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => {
      if (movementInterval.current !== null) {
        clearInterval(movementInterval.current);
      }
    };
  }, [currentDirection, foodPos]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentDirection]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        snake.forEach((segment) => {
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = "blue";
          ctx.fill();
        });

        if (foodPos) {
          ctx.beginPath();
          ctx.arc(foodPos.x, foodPos.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      }
    }
  }, [snake, foodPos]);

  return (
    <>
      {gameOver ? <GameOver /> : null}
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{
          border: "8px solid #649b74",
          outline: "2px solid #649b74",
          borderImageSlice: "1",
          boxShadow: "inset 0 0 0 2px #649b74",
          borderImageSource: `
            repeating-linear-gradient(
              -75deg,
              #649b74,
              #649b74 10px,
              white 10px,
              white 20px
            )
          `,
          borderRadius: "8px"
        }}
      ></canvas>
    </>
  );
};
