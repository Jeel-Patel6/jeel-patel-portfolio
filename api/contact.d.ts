/**
 * Types for the shared serverless contact handler (plain JS, so it can be
 * copied to `api/` and bundled by Vercel without a separate TS build step).
 */
declare const handler: (req: any, res: any) => Promise<void>;
export default handler;
