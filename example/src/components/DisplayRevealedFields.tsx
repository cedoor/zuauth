import React from 'react';
import { EdDSATicketFieldsToReveal } from "@pcd/zk-eddsa-event-ticket-pcd";

interface DisplayRevealedFieldsProps {
    user: {
        [key: string]: boolean | string | number;
    };
    revealedFields: EdDSATicketFieldsToReveal;
}


// Display the field name and corresponent value for each one that were revealed.
const DisplayRevealedFields: React.FC<DisplayRevealedFieldsProps> = ({ user, revealedFields }) => {
    const renderedFields = Object.entries(revealedFields).map(([fieldName, shouldReveal]) => {
        if (shouldReveal) {
            // Remove the 'reveal' substring and lower the subsequent capitalized letter.
            // eg., from 'revealTicketId' to 'ticketId'.
            const replaced = fieldName.replace('reveal', '').charAt(0).toLowerCase() + fieldName.slice(7)

            const fieldValue = user[replaced];
            return (
                <div key={fieldName} className="my-2 text-center">
                    <div className="font-bold">{replaced}</div>
                    <div className="ml-4">{fieldValue.toString()}</div>
                </div>
            );
        }
        return null;
    });

    return (
        <div>
            {renderedFields.filter(field => field !== null).length === 0 ? (
                <div className="text-center">You&apos;re in, anon! No ticket info has been revealed 🕶</div>
            ) : (
                renderedFields
            )}
        </div>
    );
};

export default DisplayRevealedFields;
