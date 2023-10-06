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

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [foodPos, setFoodPos] = useState<{ x: number; y: number } | null>(
    initialFoodRandomPosition
  );
  const [snake, setSnake] = useState<Array<{ x: number; y: number }>>([
    initialSnakeRandomPosition,
  ]);
  const movementInterval = useRef<number | null>(null);

  const handleKeydown = (e: KeyboardEvent) => {
    if (movementInterval.current) {
      clearInterval(movementInterval.current);
    }

    movementInterval.current = window.setInterval(() => {
      setSnake((prevSnake) => {
        const direction = (() => {
          switch (e.key) {
            case "ArrowUp":
              return { x: 0, y: -1 };
            case "ArrowDown":
              return { x: 0, y: 1 };
            case "ArrowLeft":
              return { x: -1, y: 0 };
            case "ArrowRight":
              return { x: 1, y: 0 };
            default:
              return { x: 0, y: 0 };
          }
        })();

        const newHead = {
          x: prevSnake[0].x + direction.x * moveAmount,
          y: prevSnake[0].y + direction.y * moveAmount,
        };

        if (
          newHead.x < radius ||
          newHead.x > canvasSize - radius ||
          newHead.y < radius ||
          newHead.y > canvasSize - radius
        ) {
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
    <canvas
      ref={canvasRef}
      width={canvasSize}
      height={canvasSize}
      style={{ border: "1px solid black" }}
    ></canvas>
  );
};
