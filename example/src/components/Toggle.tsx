import React from 'react';
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

interface ToggleProps {
    checked?: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onToggle, disabled }) => {
    const isChecked = checked !== undefined ? checked : false;

    const handleClick = () => {
        if (!disabled) {
            onToggle();
        }
    };

    return (
        <button
            className={`toggle-icon ${isChecked ? 'active' : ''}`}
            onClick={handleClick}
            disabled={disabled}
        >
            {isChecked ? <FaToggleOn size={30} className="text-blue-800"/> : <FaToggleOff size={30} />}
        </button>
    );
}

export default Toggle;