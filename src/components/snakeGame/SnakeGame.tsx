import React, { useRef, useEffect, useState } from "react";
import { GameOver } from "./GameOver";
import { NewGameButton } from "./NewGameButton";
import { Score } from "./Score";
import { CountDown } from "./CountDown";

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

const checkSelfCollision = (
  snake: {
    x: number;
    y: number;
  }[]
): boolean => {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
};

const initialFoodRandomPosition = generateRandomGridPosition();
const initialSnakePosition = { x: 150, y: 30 };

export const SnakeGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(() => {
    return Number(localStorage.getItem("highestScore") || 0);
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [foodPos, setFoodPos] = useState<{ x: number; y: number } | null>(
    initialFoodRandomPosition
  );
  const [snake, setSnake] = useState<Array<{ x: number; y: number }>>([
    initialSnakePosition,
  ]);
  const [currentDirection, setCurrentDirection] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 1 });
  const movementInterval = useRef<number | null>(null);
  const directionBuffer = useRef<{ x: number; y: number }[]>([]);

  const handleKeydown = (e: KeyboardEvent) => {
    if (gameOver) {
      directionBuffer.current = [];
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
      if (gameOver) {
        return;
      }

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
          newHead.y > canvasSize - radius ||
          checkSelfCollision(prevSnake)
        ) {
          setGameOver(true);
          directionBuffer.current = [];
          if (movementInterval.current !== null) {
            clearInterval(movementInterval.current);
          }
          if (score > highestScore) {
            setHighestScore(score);
          }
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        if (checkCollision(newHead, foodPos)) {
          setFoodPos(generateRandomGridPosition());
          setScore((prev) => prev + 1);
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

        snake.forEach((segment, index) => {
          ctx.beginPath();
          ctx.rect(
            segment.x - radius,
            segment.y - radius,
            2 * radius,
            2 * radius
          );
          ctx.fillStyle = "blue";
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "white";
          if (index !== 0) {
            // Draw a white line between segments, except for the head.
            ctx.moveTo(segment.x - radius, segment.y - radius);
            ctx.lineTo(segment.x + radius, segment.y - radius);
            ctx.lineTo(segment.x + radius, segment.y + radius);
            ctx.lineTo(segment.x - radius, segment.y + radius);
            ctx.lineTo(segment.x - radius, segment.y - radius);
          }
          ctx.stroke();
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

  useEffect(() => {
    localStorage.setItem("highestScore", highestScore.toString());
  }, [highestScore]);

  const handleRestartClick = () => {
    setCountdown(3);
    let interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev !== null && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(interval);
          startNewGame();
          return null;
        }
      });
    }, 1000);
  };

  const startNewGame = () => {
    setSnake([initialSnakePosition]);
    setFoodPos(generateRandomGridPosition());
    setCurrentDirection({ x: 0, y: 1 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Score score={score} highestScore={highestScore} />
      <NewGameButton onClick={handleRestartClick} gameOver={!!gameOver} />

      {gameOver ? <GameOver /> : null}
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          style={{
            border: "8px solid #d8931b",
            borderRadius: "8px",
          }}
        ></canvas>
        {countdown && <CountDown countdown={countdown} />}
      </div>
    </div>
  );
};
