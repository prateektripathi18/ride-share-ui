import React, { useState } from 'react';
import './ToggleSwitch.css'; // Import the CSS file

/**
 * A reusable controlled toggle switch component.
 *
 * @param {object} props
 * @param {boolean} props.initialState - The initial state of the toggle (true for ON, false for OFF).
 * @param {function} props.onToggle - Callback function when the toggle state changes.
 * @param {string} [props.label] - Optional text label to display next to the switch.
 */
const ToggleSwitch = ({ initialState = false, onToggle, label }) => {
  // Use state to manage the current state of the switch
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    // Call the parent component's handler with the new state
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className="toggle-switch-container">
      {label && <span className="toggle-label">{label}</span>}
      <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
        <div className="switch-handle" />
      </div>
    </div>
  );
};

export default ToggleSwitch;