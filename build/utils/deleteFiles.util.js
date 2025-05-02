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
exports.deleteFiles = void 0;
const cloudinary_config_1 = require("../config/cloudinary.config");
const deleteFiles = (public_ids) => __awaiter(void 0, void 0, void 0, function* () {
    public_ids.forEach((public_id) => __awaiter(void 0, void 0, void 0, function* () {
        yield cloudinary_config_1.cloudinary.uploader.destroy(public_id);
    }));
});
exports.deleteFiles = deleteFiles;
