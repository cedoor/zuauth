import React from 'react';
import { EdDSATicketFieldsToReveal } from "@pcd/zk-eddsa-event-ticket-pcd";
import Toggle from '@/components/Toggle';

interface TicketFieldsToRevealGridProps {
    ticketFieldsToReveal: EdDSATicketFieldsToReveal;
    onToggleField: (fieldName: keyof EdDSATicketFieldsToReveal) => void;
    disabled?: boolean
}

// Renders a grid of toggles for revealing specific ticket fields only.
const TicketFieldsToRevealGrid: React.FC<TicketFieldsToRevealGridProps> = ({ ticketFieldsToReveal, onToggleField, disabled }) => {
    const toggleKeys = Object.keys(ticketFieldsToReveal) as Array<keyof EdDSATicketFieldsToReveal>;

    return (
        <div className="grid grid-cols-4 gap-4">
            {toggleKeys.map(fieldName => (
                <div key={fieldName} className="flex flex-col items-center">
                    <p className="text-center">{fieldName}</p>
                    <Toggle
                        checked={ticketFieldsToReveal[fieldName]}
                        onToggle={() => onToggleField(fieldName)}
                        disabled={disabled}
                    />
                </div>
            ))}
        </div>
    );
}

export default TicketFieldsToRevealGrid;
