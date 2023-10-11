import React, { FC, MouseEvent } from "react";

interface RestartButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  gameOver: boolean;
}

const RestartButton: FC<RestartButtonProps> = ({ onClick, gameOver }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: "200px",
        borderRadius: "8px",
        margin: "0 auto 60px auto",
        visibility: gameOver ? "visible" : "hidden",
        fontFamily: "harmony-sans",
        fontSize: "24px",
        background: "#07c7d2",
        color: "white",
        border: "2px solid #239cb2",
      }}
    >
      Restart Game
    </button>
  );
};

export default RestartButton;
