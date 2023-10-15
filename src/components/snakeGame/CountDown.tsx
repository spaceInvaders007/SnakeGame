interface CountDownProps {
  countdown: number;
}

export const CountDown = ({ countdown }: CountDownProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.85)",
        zIndex: 1000,
      }}
    >
      <span style={{ fontSize: "16rem", color: "#abbd25" }}> {countdown}</span>
    </div>
  );
};
