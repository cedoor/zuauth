import { EdDSATicketPCDPackage } from "@pcd/eddsa-ticket-pcd"
import { ArgumentTypeName } from "@pcd/pcd-types"
import { SemaphoreIdentityPCDPackage } from "@pcd/semaphore-identity-pcd"
import {
    EdDSATicketFieldsToReveal,
    ZKEdDSAEventTicketPCDArgs,
    ZKEdDSAEventTicketPCDPackage
} from "@pcd/zk-eddsa-event-ticket-pcd"
import { constructZupassPcdGetRequestUrl } from "./passport-interface/PassportInterface"
import { ZUPASS_URL, supportedEvents, supportedProducs, zupassPublicKey } from "./config"
import { openZupassPopup } from "./passport-interface/PassportPopup"

/**
 * Opens a Zupass popup to make a proof of a ZK EdDSA event ticket PCD.
 */
export function openZKEdDSAEventTicketPopup(
    fieldsToReveal: EdDSATicketFieldsToReveal,
    watermark: string | bigint,
    validEventIds: string[] = supportedEvents,
    validProductIds: string[] = supportedProducs,
    popupRoute: string = "popup"
) {
    const args: ZKEdDSAEventTicketPCDArgs = {
        ticket: {
            argumentType: ArgumentTypeName.PCD,
            pcdType: EdDSATicketPCDPackage.name,
            value: undefined,
            userProvided: true,
            validatorParams: {
                eventIds: validEventIds,
                productIds: validProductIds,
                notFoundMessage: "No eligible PCDs found"
            }
        },
        identity: {
            argumentType: ArgumentTypeName.PCD,
            pcdType: SemaphoreIdentityPCDPackage.name,
            value: undefined,
            userProvided: true
        },
        validEventIds: {
            argumentType: ArgumentTypeName.StringArray,
            value: validEventIds.length != 0 ? validEventIds : undefined,
            userProvided: false
        },
        fieldsToReveal: {
            argumentType: ArgumentTypeName.ToggleList,
            value: fieldsToReveal,
            userProvided: false
        },
        watermark: {
            argumentType: ArgumentTypeName.BigInt,
            value: watermark.toString(),
            userProvided: false
        },
        externalNullifier: {
            argumentType: ArgumentTypeName.BigInt,
            value: watermark.toString(),
            userProvided: false
        }
    }

    const popupUrl = window.location.origin + "/" + popupRoute

    const proofUrl = constructZupassPcdGetRequestUrl<typeof ZKEdDSAEventTicketPCDPackage>(
        ZUPASS_URL,
        popupUrl,
        ZKEdDSAEventTicketPCDPackage.name,
        args,
        {
            genericProveScreen: true,
            title: "ZKEdDSA Ticket Proof",
            description: "ZKEdDSA Ticket PCD Request"
        }
    )

    openZupassPopup(popupUrl, proofUrl)
}

export function parseSerializedPCD(serializedPCD: string): string | undefined {
    try {
        const { pcd } = JSON.parse(serializedPCD)

        return pcd
    } catch {
        return undefined
    }
}

export function isZupassPublicKey(publicKey: [string, string]): boolean {
    return zupassPublicKey[0] === publicKey[0] && zupassPublicKey[1] === publicKey[1]
}
