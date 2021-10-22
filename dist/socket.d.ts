/// <reference types="@types/express" />
/// <reference types="node" />
import { Application } from "express";
import { Server } from "socket.io";
export declare function connect(app: Application): import("http").Server;
export declare function io(): Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap>;
//# sourceMappingURL=socket.d.ts.map