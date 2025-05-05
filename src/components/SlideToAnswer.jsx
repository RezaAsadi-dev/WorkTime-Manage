import React, { useState, useRef, useEffect } from "react";
import "./SlideToAnswer.css";
import { toast } from "react-toastify";

const SlideToAnswer = ({
  onAnswer,
  onOut,
  isCheckOut = false,
  onReset = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sliderRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (onReset) {
      setIsCompleted(false);
      setCurrentX(0);
    }
  }, [onReset]);

  useEffect(() => {
    if (isCheckOut) {
      setCurrentX(0);
    } else {
      setCurrentX(0);
    }
  }, [isCheckOut]);

  const handleStart = (e) => {
    if (isCompleted) {
      e.preventDefault();
      onAnswer();
      return;
    }
    setIsDragging(true);
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMove = (e) => {
    if (!isDragging || isCompleted) return;

    const maxWidth =
      sliderRef.current.offsetWidth - buttonRef.current.offsetWidth;
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;

    // For check-in, slide from left to right
    const newPosition = Math.max(0, Math.min(deltaX, maxWidth));
    setCurrentX(newPosition);

    // Check if slide is completed (80% of the way)
    if (newPosition >= maxWidth * 1) {
      setIsCompleted(true);
      setCurrentX(maxWidth);
      handleCheckIn();
    }
  };

  const handleEnd = () => {
    if (!isCompleted) {
      setCurrentX(0);
    }
    setIsDragging(false);
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      await onAnswer();
      setIsLoading(false);
    } catch (error) {
      console.error("Check-in failed:", error);
      setIsLoading(false);
      setIsCompleted(false);
      setCurrentX(0);
    }
  };

  const handleCheckOut = async () => {
    if (isCompleted) {
      try {
        await onOut();
        setIsCompleted(false);
        setCurrentX(0);
      } catch (error) {
        console.error("Check-out failed:", error);
      }
    }
  };

  useEffect(() => {
    const moveEvent = window.PointerEvent ? "pointermove" : "mousemove";
    const endEvent = window.PointerEvent ? "pointerup" : "mouseup";

    window.addEventListener(moveEvent, handleMove);
    window.addEventListener(endEvent, handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener(moveEvent, handleMove);
      window.removeEventListener(endEvent, handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, startX, isCompleted, isCheckOut]);

  return (
    <div className="slide-container">
      <div
        className={`slide-track ${isCompleted ? "completed" : ""} ${
          isLoading ? "loading" : ""
        }`}
        ref={sliderRef}
      >
        {!isCompleted && (
          <div
            className={`slide-button ${isCompleted ? "completed" : ""}`}
            ref={buttonRef}
            style={{ transform: `translateX(${currentX}px)` }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            onPointerDown={handleStart}
          >
            <span>{isCompleted ? "←" : "→"}</span>
          </div>
        )}
        <div className="slide-text" onClick={handleCheckOut}>
          {isLoading ? (
            <div className="loader"></div>
          ) : isCompleted ? (
            "Click to Check Out"
          ) : (
            `Slide to ${isCheckOut ? "Check Out" : "Check In"}`
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideToAnswer;
