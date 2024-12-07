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

// Styled container for buttons
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

// Styled floating information button
const InfoButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;

  &:hover {
    background-color: #138496;
  }
`;

// Styled modal overlay
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Styled modal content
const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  border-radius: 10px;
  position: relative;

  h2 {
    margin-top: 0;
  }

  p {
    line-height: 1.6;
  }
`;

// Styled close button for the modal
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
`;

const PomodoroTimer = () => {
  // Timer durations in seconds
  const WORK_TIME = 0.1 * 60; // 25 minutes
  const SHORT_BREAK_TIME = 0.1 * 60; // 5 minutes
  const LONG_BREAK_TIME = 0.2 * 60; // 30 minutes

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false); // Work or Break state
  const [pomodoroCount, setPomodoroCount] = useState(0); // Completed Pomodoros
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

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

  // Open Modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
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
              const newPomodoroCount = pomodoroCount + 1;
              setPomodoroCount(newPomodoroCount);

              if (newPomodoroCount % 4 === 0) {
                setIsBreak(true);
                setTimeLeft(LONG_BREAK_TIME);
              } else {
                setIsBreak(true);
                setTimeLeft(SHORT_BREAK_TIME);
              }
            }
          }

          return prevTime > 0 ? prevTime - 1 : 0;
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
          ? pomodoroCount > 0 && pomodoroCount % 4 === 0
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
              ? pomodoroCount > 0 && pomodoroCount % 4 === 0
                ? "#28a745" // Long Break - Green
                : "#ffc107" // Short Break - Yellow
              : "#dc3545", // Work Time - Red
            trailColor: "#eee",
            textSize: "16px",
          })}
        />
      </div>
      <ButtonContainer>
        <button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={resetTimer}>Reset</button>
      </ButtonContainer>

      {/* Floating Information Button */}
      <InfoButton
        onClick={openModal}
        aria-label="Learn about Pomodoro Technique"
      >
        ℹ️
      </InfoButton>

      {/* Modal Component */}
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal} aria-label="Close Modal">
              &times;
            </CloseButton>
            <h2>About the Pomodoro Technique</h2>
            <p>
              The Pomodoro Technique is a time management method developed by
              Francesco Cirillo in the late 1980s. It uses a timer to break work
              into intervals, traditionally 25 minutes in length, separated by
              short breaks. These intervals are known as "pomodoros."
            </p>
            <h3>Uses</h3>
            <ul>
              <li>Enhancing focus and concentration.</li>
              <li>Managing time more effectively.</li>
              <li>Reducing mental fatigue and burnout.</li>
              <li>Tracking progress and productivity.</li>
            </ul>
            <h3>Benefits</h3>
            <ul>
              <li>Improved time management skills.</li>
              <li>Increased productivity and efficiency.</li>
              <li>Better work-life balance.</li>
              <li>Enhanced motivation and accountability.</li>
            </ul>
            <p>
              By breaking work into manageable intervals and incorporating
              regular breaks, the Pomodoro Technique helps maintain high levels
              of productivity while minimizing burnout.
            </p>
          </ModalContent>
        </ModalOverlay>
      )}
    </TimerContainer>
  );
};

export default PomodoroTimer;
