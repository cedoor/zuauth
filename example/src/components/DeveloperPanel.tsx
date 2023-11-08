import React from 'react';
import { EdDSATicketFieldsToReveal } from "@pcd/zk-eddsa-event-ticket-pcd";
import Toggle from '@/components/Toggle';

interface DeveloperPanelProps {
    fieldsToReveal: EdDSATicketFieldsToReveal;
    onToggleField: (fieldName: keyof EdDSATicketFieldsToReveal) => void;
    disabled?: boolean;
}

// Display a set of toggles associated with ticket fields. When a toggle is activated,
// the ticket proof will reveal the corresponding ticket field.
const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ fieldsToReveal, onToggleField, disabled = false }) => {
    const toggleKeys = Object.keys(fieldsToReveal) as Array<keyof EdDSATicketFieldsToReveal>;

    return (
        <div className="grid grid-cols-4 gap-4">
            {toggleKeys.map(fieldName => (
                <div key={fieldName} className="flex flex-col items-center">
                    <p className="text-center">{fieldName}</p>
                    <Toggle
                        checked={fieldsToReveal[fieldName]}
                        onToggle={() => onToggleField(fieldName)}
                        disabled={disabled}
                    />
                </div>
            ))}
        </div>
    );
}

export default DeveloperPanel;
