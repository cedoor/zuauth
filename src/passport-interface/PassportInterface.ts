import { ArgsOf, PCDPackage } from "@pcd/pcd-types"

export enum PCDRequestType {
    Get = "Get"
}

export interface PCDRequest {
    returnUrl: string
    type: PCDRequestType
}

export interface ProveOptions {
    genericProveScreen?: boolean
    title?: string
    description?: string
    debug?: boolean
    proveOnServer?: boolean
    signIn?: boolean
}

export interface PCDGetRequest<T extends PCDPackage = PCDPackage> extends PCDRequest {
    type: PCDRequestType.Get
    pcdType: T["name"]
    args: ArgsOf<T>
    options?: ProveOptions
}

export function constructZupassPcdGetRequestUrl<T extends PCDPackage>(
    zupassClientUrl: string,
    returnUrl: string,
    pcdType: T["name"],
    args: ArgsOf<T>,
    options?: ProveOptions
) {
    const req: PCDGetRequest<T> = {
        type: PCDRequestType.Get,
        returnUrl: returnUrl,
        args: args,
        pcdType,
        options
    }
    const encReq = encodeURIComponent(JSON.stringify(req))
    return `${zupassClientUrl}#/prove?request=${encReq}`
}
