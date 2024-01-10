"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
class RedisManager {
    constructor() {
        this._redis = new ioredis_1.Redis({
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT, // make the port as number
            username: process.env.REDIS_USER,
            password: process.env.REDIS_PASSWORD
        });
    }
    get redis() {
        return this._redis;
    }
    publish(channel, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._redis.publish(channel, payload);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    subscribe(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._redis.subscribe(channel);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.default = RedisManager;
