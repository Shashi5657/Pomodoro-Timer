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
  const WORK_TIME = 25 * 60; // 25 minutes in seconds
  const BREAK_TIME = 5 * 60; // 5 minutes in seconds

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false); // Track Work/Break state

  // Toggle Start/Pause
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  // Reset Timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
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
            const nextTime = isBreak ? WORK_TIME : BREAK_TIME; // Switch to Break or Work
            setIsBreak((prev) => !prev); // Toggle state
            return nextTime; // Set new time
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, isBreak]);

  // Calculate progress percentage
  const totalTime = isBreak ? BREAK_TIME : WORK_TIME;
  const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <TimerContainer>
      <h2>{isBreak ? "Break Time" : "Work Time"}</h2>
      <div style={{ width: 200, height: 200 }}>
        <CircularProgressbar
          value={progressPercentage}
          text={formatTime(timeLeft)}
          styles={buildStyles({
            textColor: "#000",
            pathColor: isBreak ? "#28a745" : "#dc3545", // Green for Break, Red for Work
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
