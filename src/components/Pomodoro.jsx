import { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Pomodoro.css"; // Make sure to create this file for CSS styles
// import startWorkSound from "./assets/sounds/start-work.mp3";
// import endWorkSound from "./assets/sounds/end-work.mp3";
// import endBreakSound from "./assets/sounds/end-break.mp3";

const PomodoroTimer = () => {
  // Default timer durations in seconds
  const defaultWorkTime = 25 * 60; // 25 minutes
  const defaultShortBreakTime = 5 * 60; // 5 minutes
  const defaultLongBreakTime = 30 * 60; // 30 minutes
  //   const startWorkAudio = useRef(new Audio(startWorkSound));
  //   const endWorkAudio = useRef(new Audio(endWorkSound));
  //   const endBreakAudio = useRef(new Audio(endBreakSound));

  const [workTime, setWorkTime] = useState(defaultWorkTime);
  const [shortBreakTime, setShortBreakTime] = useState(defaultShortBreakTime);
  const [longBreakTime, setLongBreakTime] = useState(defaultLongBreakTime);

  const [timeLeft, setTimeLeft] = useState(workTime);
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
    setTimeLeft(workTime);
  };

  // Set default times
  const setDefaultTimes = () => {
    setWorkTime(defaultWorkTime);
    setShortBreakTime(defaultShortBreakTime);
    setLongBreakTime(defaultLongBreakTime);
    setTimeLeft(defaultWorkTime); // Reset timer to default work time
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
              //   endBreakAudio.current.play(); // Play end break sound
              setIsBreak(false);
              setTimeLeft(workTime);
              //   startWorkAudio.current.play().catch((error) => {
              // console.error("Error playing end break sound:", error); // Play start work sound
            } else {
              // End of Work → Start Break
              //   endWorkAudio.current.play().catch((error) => {
              // console.error("Error playing end break sound:", error); // Play end work sound
              const newPomodoroCount = pomodoroCount + 1;
              setPomodoroCount(newPomodoroCount);

              if (newPomodoroCount % 4 === 0) {
                setIsBreak(true);
                setTimeLeft(longBreakTime);
              } else {
                setIsBreak(true);
                setTimeLeft(shortBreakTime);
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
  }, [
    isRunning,
    isBreak,
    pomodoroCount,
    workTime,
    shortBreakTime,
    longBreakTime,
  ]);

  // Calculate progress percentage
  const totalTime = isBreak
    ? pomodoroCount > 0 && pomodoroCount % 4 === 0
      ? longBreakTime
      : shortBreakTime
    : workTime;

  const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="timer-container">
      <h2 className="timer-title">
        {isBreak
          ? pomodoroCount > 0 && pomodoroCount % 4 === 0
            ? "🌙 Long Break 🌙"
            : "☕ Short Break ☕"
          : "💼 Work Time 💼"}
      </h2>
      <p>Pomodoros Completed: {pomodoroCount}</p>
      <div className="circular-progressbar-container">
        <CircularProgressbar
          value={progressPercentage}
          text={formatTime(timeLeft)}
          styles={buildStyles({
            textColor: "#333",
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
      <div className="button-container">
        <button className="start-pause-btn" onClick={toggleTimer}>
          {isRunning ? "⏸ Pause" : "▶️ Start"}
        </button>
        <button className="reset-btn" onClick={resetTimer}>
          🔄 Reset
        </button>
      </div>

      <div className="timer-settings-container">
        <h3>Customise Pomodoro</h3>
        <div>
          <label className="timer-label">Work Time (minutes): </label>
          <input
            className="timer-input"
            type="number"
            value={workTime / 60}
            onChange={(e) => setWorkTime(Number(e.target.value) * 60)}
            min="1"
          />
        </div>
        <div>
          <label className="timer-label">Short Break Time (minutes): </label>
          <input
            className="timer-input"
            type="number"
            value={shortBreakTime / 60}
            onChange={(e) => setShortBreakTime(Number(e.target.value) * 60)}
            min="1"
          />
        </div>
        <div>
          <label className="timer-label">Long Break Time (minutes): </label>
          <input
            className="timer-input"
            type="number"
            value={longBreakTime / 60}
            onChange={(e) => setLongBreakTime(Number(e.target.value) * 60)}
            min="1"
          />
        </div>
        <button className="reset-button" onClick={resetTimer}>
          Reset Timer
        </button>
        <button className="default-button" onClick={setDefaultTimes}>
          Default Times
        </button>
      </div>

      {/* Floating Information Button */}
      <button
        className="info-button"
        onClick={openModal}
        aria-label="Learn about Pomodoro Technique"
      >
        ℹ️
      </button>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={closeModal}
              aria-label="Close Modal"
            >
              &times;
            </button>
            <h2>About the Pomodoro Technique</h2>
            <p>
              The Pomodoro Technique is a time management method developed by
              Francesco Cirillo in the late 1980s. It uses a timer to break work
              into intervals, traditionally 25 minutes in length, separated by
              short breaks. These intervals are known as pomodoros.
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
