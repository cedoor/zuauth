import React from 'react';
import { EdDSATicketFieldsToReveal } from "@pcd/zk-eddsa-event-ticket-pcd";

interface RevealedFieldsInfoProps {
    user: {
        [key: string]: boolean | string | number;
    };
    revealedFields: EdDSATicketFieldsToReveal;
}

const RevealedFieldsInfo: React.FC<RevealedFieldsInfoProps> = ({ user, revealedFields }) => {
    const renderedFields = Object.entries(revealedFields).map(([fieldName, shouldReveal]) => {
        if (shouldReveal) {
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

    const allNull = renderedFields.filter(field => field !== null).length === 0;

    return (
        <div>
            {allNull ? (
                <div className="text-center">You're logged in without revealing anything :)</div>
            ) : (
                renderedFields
            )}
        </div>
    );
};

export default RevealedFieldsInfo;
