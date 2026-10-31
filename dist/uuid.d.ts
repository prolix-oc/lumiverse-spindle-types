/** Backend UUID generation (free tier — no permission needed). */
export interface SpindleUUIDAPI {
    /** Generate a random UUID v4 string using the backend's UUID helper. */
    v4(): Promise<string>;
    /** Generate a timestamp-ordered UUID v7 string using the backend's UUID helper. */
    v7(): Promise<string>;
}
export type UUIDWorkerMessage = {
    type: "uuid_generate";
    requestId: string;
    version: 4 | 7;
};
