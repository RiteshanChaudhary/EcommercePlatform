"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = (url) => {
    mongoose_1.default.connect(url).then(() => console.log('Database connected')).catch((err) => console.log('db connection err', err));
};
exports.connectDatabase = connectDatabase;
