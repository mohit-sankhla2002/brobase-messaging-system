"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValidator = void 0;
const zod_1 = require("zod");
exports.MessageValidator = zod_1.z.object({
    type: zod_1.z.enum(["MSG", "ERR"]),
    group: zod_1.z.string(),
    payload: zod_1.z.string().max(1000)
});
