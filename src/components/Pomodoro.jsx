import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const Pomodoro = () => {
  const timeLeft = 60;
  return (
    <div>
      <CircularProgressbar
        value={100}
        text="100"
        styles={buildStyles({
          textColor: "#000",
          pathColor: "#28a745", // Green for Break, Red for Work
          trailColor: "#eee",
          textSize: "16px",
        })}
      />
    </div>
  );
};

export default Pomodoro;
