/// <reference types="@types/express" />
import { NextFunction, Request, Response } from "express";
export default function middleware(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=middleware.d.ts.map