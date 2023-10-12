import { ScriptElementKind } from "typescript";

interface ScoreProps {
  score: number;
  highestScore: number;
}

export const Score = ({ score, highestScore }: ScoreProps) => {
  return (
    <div style={{ margin: "0 auto 30px auto", display: "flex" }}>
      <div
        style={{
          marginRight: "100px",
          background: "#abbd25",
          padding: "20px",
          borderRadius: "8px",
          width: "80px",
          display: "flex",
          flexDirection: "column",
          fontWeight: "bold"
        }}
      >
        <span style={{ marginBottom: "5px" }}>Score</span>
        <span>{score}</span>
      </div>
      <div
        style={{
          background: "#abbd25",
          padding: "20px",
          borderRadius: "8px",
          width: "110px",
          display: "flex",
          flexDirection: "column",
          fontWeight: "bold"
        }}
      >
        <span style={{ marginBottom: "5px" }}>Highest Score</span>
        <span>{highestScore}</span>{" "}
      </div>
    </div>
  );
};
