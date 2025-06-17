import React, { useState, useEffect } from 'react';
import '../styles/CountdownTimer.css';

/**
 * Countdown Timer Component
 * Displays a countdown to a specific date/time
 * @param {String} targetDate - Target date in ISO format (e.g., "2025-06-15T23:59:59")
 * @param {Function} onComplete - Optional callback function to run when countdown reaches zero
 */
const CountdownTimer = ({ targetDate, onComplete }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    
    if (difference <= 0) {
      if (onComplete) onComplete();
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  const padWithZero = (num) => {
    return num.toString().padStart(2, '0');
  };
  
  return (
    <div className="mk-countdown">
      <div className="mk-countdown-item">
        <span className="mk-countdown-value">{timeLeft.days}</span>
        <span className="mk-countdown-label">Days</span>
      </div>
      <div className="mk-countdown-item">
        <span className="mk-countdown-value">{padWithZero(timeLeft.hours)}</span>
        <span className="mk-countdown-label">Hours</span>
      </div>
      <div className="mk-countdown-item">
        <span className="mk-countdown-value">{padWithZero(timeLeft.minutes)}</span>
        <span className="mk-countdown-label">Minutes</span>
      </div>
      <div className="mk-countdown-item">
        <span className="mk-countdown-value">{padWithZero(timeLeft.seconds)}</span>
        <span className="mk-countdown-label">Seconds</span>
      </div>
    </div>
  );
};

export default CountdownTimer;