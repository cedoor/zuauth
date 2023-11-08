import React from 'react';
import { FaToggleOff, FaToggleOn } from "react-icons/fa";

interface ToggleProps {
    checked?: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked = false, onToggle, disabled }) => {
    const handleClick = () => {
        if (!disabled) {
            onToggle();
        }
    };

    return (
        <button
            className={`toggle-icon ${checked ? 'active' : ''}`}
            onClick={handleClick}
            disabled={disabled}
        >
            {checked ? <FaToggleOn size={30} className="text-blue-800"/> : <FaToggleOff size={30} />}
        </button>
    );
}

export default Toggle;
