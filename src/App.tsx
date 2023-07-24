import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const App: React.FC = () => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [speed, setSpeed] = useState(0);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [sideDirection, setSideDirection] = useState<
    "playerRight" | "playerLeft"
  >("playerRight");
  const accelerationRate = 0.3;
  const maxSpeed = 6;
  const [animationDuration, setAnimationDuration] = useState(0.5);

  useEffect(() => {
    setAnimationDuration(2 / Math.sqrt(speed));
  }, [speed]);

  const updateSpeed = useCallback(() => {
    setSpeed((prevSpeed) => Math.min(prevSpeed + accelerationRate, maxSpeed));
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "arrowup") {
        setDirection({ ...direction, y: -1 });
        updateSpeed();
      } else if (key === "s" || key === "arrowdown") {
        setDirection({ ...direction, y: 1 });
        updateSpeed();
      } else if (key === "a" || key === "arrowleft") {
        setDirection({ ...direction, x: -1 });
        updateSpeed();
        setSideDirection("playerLeft");
      } else if (key === "d" || key === "arrowright") {
        setDirection({ ...direction, x: 1 });
        updateSpeed();
        setSideDirection("playerRight");
      }
    },
    [direction, updateSpeed]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (
        key === "w" ||
        key === "arrowup" ||
        key === "s" ||
        key === "arrowdown"
      ) {
        setDirection({ ...direction, y: 0 });
      } else if (
        key === "a" ||
        key === "arrowleft" ||
        key === "d" ||
        key === "arrowright"
      ) {
        setDirection({ ...direction, x: 0 });
      }
      setAnimationDuration(0.2);
      setSpeed(0);
    },
    [direction]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (direction.x !== 0 || direction.y !== 0) {
      setPosition((prevPosition) => ({
        top: prevPosition.top + speed * direction.y,
        left: prevPosition.left + speed * direction.x,
      }));
    }
  }, [speed, direction]);

  return (
    <div>
      <div
        className={`player ${speed && sideDirection}`}
        style={{
          top: position.top,
          left: position.left,
          position: "absolute",
          transform:
            sideDirection === "playerLeft"
              ? "rotateY(180deg) translateY(-6px)"
              : "none",
        }}
      >
        <div className="body">
          <div className="shadow" />
        </div>

        <div
          className={`glasses ${speed && "animate"}`}
          style={{ animationDuration: `${animationDuration.toString()}s` }}
        >
          <div className="shadow">
            <div className="shadow" />
          </div>
        </div>

        <div
          className={`bag ${speed && "animate"}`}
          style={{ animationDuration: `${animationDuration.toString()}s` }}
        >
          <div className="shadow" />
        </div>

        <div
          className={`legLeft ${speed && "animate"}`}
          style={{ animationDuration: `${animationDuration.toString()}s` }}
        />
        <div
          className={`legRight ${speed && "animate"}`}
          style={{ animationDuration: `${animationDuration.toString()}s` }}
        />
      </div>
    </div>
  );
};

export default App;
