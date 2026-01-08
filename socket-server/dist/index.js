"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// ✅ Use env PORT for hosting, fallback to 3000
const PORT = Number(process.env.PORT) || 3000;
app.get("/", (_req, res) => {
    res.status(200).send("Hello World!");
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
