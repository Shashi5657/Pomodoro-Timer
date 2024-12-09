import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styled from "styled-components";

// Styled container for the timer
const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 300px;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.8;
    }

    &:nth-child(1) {
      background-color: #007bff;
    }

    &:nth-child(2) {
      background-color: #dc3545;
    }
  }
`;

const PomodoroTimer = () => {
  // Set actual Pomodoro intervals in seconds
  const WORK_TIME = 0.1 * 60; // 25 minutes
  const SHORT_BREAK_TIME = 0.1 * 60; // 5 minutes
  const LONG_BREAK_TIME = 0.2 * 60; // 30 minutes

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false); // Work or Break state
  const [pomodoroCount, setPomodoroCount] = useState(0); // Full Pomodoro counter

  // Toggle Start/Pause
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  // Reset Timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setPomodoroCount(0);
    setTimeLeft(WORK_TIME);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer countdown logic
  useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);

            if (isBreak) {
              // End of Break → Start Work Session
              setIsBreak(false);
              setTimeLeft(WORK_TIME);
            } else {
              // End of Work → Start Break
              setIsBreak(true);
              setPomodoroCount((prev) => prev + 1); // Increment after work session

              // Determine if it's time for a long break
              if ((pomodoroCount + 1) % 4 === 0) {
                setTimeLeft(LONG_BREAK_TIME);
              } else {
                setTimeLeft(SHORT_BREAK_TIME);
              }
            }
            return 0; // Reset current countdown
          }

          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, isBreak, pomodoroCount]);

  // Calculate progress percentage
  const totalTime = isBreak
    ? pomodoroCount > 0 && pomodoroCount % 4 === 0
      ? LONG_BREAK_TIME
      : SHORT_BREAK_TIME
    : WORK_TIME;

  const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <TimerContainer>
      <h2>
        {isBreak
          ? pomodoroCount % 4 === 0
            ? "Long Break"
            : "Short Break"
          : "Work Time"}
      </h2>
      <p>Pomodoros Completed: {pomodoroCount}</p>
      <div style={{ width: 200, height: 200 }}>
        <CircularProgressbar
          value={progressPercentage}
          text={formatTime(timeLeft)}
          styles={buildStyles({
            textColor: "#000",
            pathColor: isBreak
              ? pomodoroCount % 4 === 0
                ? "#28a745" // Green for long break
                : "#ffc107" // Yellow for short break
              : "#dc3545", // Red for work
            trailColor: "#eee",
            textSize: "16px",
          })}
        />
      </div>
      <ButtonContainer>
        <button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={resetTimer}>Reset</button>
      </ButtonContainer>
    </TimerContainer>
  );
};

export default PomodoroTimer;
