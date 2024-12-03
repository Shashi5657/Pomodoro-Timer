// App.js
import "./App.css";
import Pomodoro from "./components/Pomodoro";

function App() {
  return (
    <div className="app-container">
      <h1 className="app-heading">
        <span className="highlight">🍅</span> Pomodoro Timer{" "}
        <span className="highlight">⏰</span>
      </h1>
      <Pomodoro />
    </div>
  );
}

export default App;
