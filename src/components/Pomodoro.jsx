import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const Pomodoro = () => {
  const initialWorkTime = 25 * 60 * 1000; // 25 minutes in milliseconds
  const [workTime, setWorkTime] = useState(initialWorkTime);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkTime((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000; // Reduce 1 second
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    setProgress((workTime / initialWorkTime) * 100); // Update progress percentage
  }, [workTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div style={{ width: "200px", margin: "50px auto" }}>
      <CircularProgressbar
        value={progress}
        text={formatTime(workTime)} // Show formatted time inside the progress bar
        styles={buildStyles({
          textColor: "#000",
          pathColor: progress > 50 ? "#d9534f" : "#28a745", // Red for work, green when less than 50%
          trailColor: "#eee",
          textSize: "16px",
        })}
      />
    </div>
  );
};

export default Pomodoro;
