import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Pomodoro.css"; // Make sure to create this file for CSS styles
// import startWorkSound from "./assets/sounds/start-work.mp3";
// import endWorkSound from "./assets/sounds/end-work.mp3";
// import endBreakSound from "./assets/sounds/end-break.mp3";

const LOCAL_STORAGE_KEYS = {
  timeLeft: "pomodoro_timeLeft",
  isRunning: "pomodoro_isRunning",
  isBreak: "pomodoro_isBreak",
  pomodoroCount: "pomodoro_pomodoroCount",
  workTime: "pomodoro_workTime",
  shortBreakTime: "pomodoro_shortBreakTime",
  longBreakTime: "pomodoro_longBreakTime",
};

const PomodoroTimer = () => {
  // Default timer durations in seconds
  const defaultWorkTime = 25 * 60; // 25 minutes
  const defaultShortBreakTime = 5 * 60; // 5 minutes
  const defaultLongBreakTime = 30 * 60; // 30 minutes
  //   const startWorkAudio = useRef(new Audio(startWorkSound));
  //   const endWorkAudio = useRef(new Audio(endWorkSound));
  //   const endBreakAudio = useRef(new Audio(endBreakSound));

  const [workTime, setWorkTime] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.workTime);
    return saved ? Number(saved) : defaultWorkTime;
  });
  const [shortBreakTime, setShortBreakTime] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.shortBreakTime);
    return saved ? Number(saved) : defaultShortBreakTime;
  });
  const [longBreakTime, setLongBreakTime] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.longBreakTime);
    return saved ? Number(saved) : defaultLongBreakTime;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.timeLeft);
    return saved ? Number(saved) : workTime;
  });

  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.isRunning);
    return saved ? JSON.parse(saved) : false;
  });

  const [isBreak, setIsBreak] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.isBreak);
    return saved ? JSON.parse(saved) : false;
  });
  const [pomodoroCount, setPomodoroCount] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.pomodoroCount);
    return saved ? Number(saved) : 0;
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  // After initializing state and refs, add the following useEffect
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.workTime, workTime);
  }, [workTime]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.shortBreakTime, shortBreakTime);
  }, [shortBreakTime]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.longBreakTime, longBreakTime);
  }, [longBreakTime]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.timeLeft, timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.isRunning, isRunning);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.isBreak, isBreak);
  }, [isBreak]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.pomodoroCount, pomodoroCount);
  }, [pomodoroCount]);

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

    // Clear relevant localStorage items
    localStorage.removeItem(LOCAL_STORAGE_KEYS.timeLeft);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.isRunning);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.isBreak);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.pomodoroCount);
  };

  // Set default times
  const setDefaultTimes = () => {
    setWorkTime(defaultWorkTime);
    setShortBreakTime(defaultShortBreakTime);
    setLongBreakTime(defaultLongBreakTime);
    setTimeLeft(defaultWorkTime); // Reset timer to default work time

    // Update localStorage with default values
    localStorage.setItem(LOCAL_STORAGE_KEYS.workTime, defaultWorkTime);
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.shortBreakTime,
      defaultShortBreakTime
    );
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.longBreakTime,
      defaultLongBreakTime
    );
    localStorage.setItem(LOCAL_STORAGE_KEYS.timeLeft, defaultWorkTime);
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
            <h3>Tips for Using the Pomodoro Technique</h3>
            <ul>
              <li>Set clear and specific tasks for each pomodoro session.</li>
              <li>Eliminate distractions during work intervals.</li>
              <li>Take short 5-minute breaks to recharge between sessions.</li>
              <li>After 4 pomodoros, take a longer break (15-30 minutes).</li>
              <li>Track completed pomodoros to monitor productivity.</li>
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
