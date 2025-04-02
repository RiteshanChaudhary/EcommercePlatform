"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUser = exports.onlyUser = exports.onlyAdmin = exports.Role = void 0;
var Role;
(function (Role) {
    Role["user"] = "USER";
    Role["admin"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
exports.onlyAdmin = [Role.admin];
exports.onlyUser = [Role.user];
exports.allUser = [Role.admin, Role.user];
