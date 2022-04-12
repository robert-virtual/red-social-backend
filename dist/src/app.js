"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constantes_1 = require("../constantes");
const auth_1 = __importDefault(require("./routes/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
if (!constantes_1.__prod__) {
    dotenv_1.default.config();
    app.use((0, morgan_1.default)("dev"));
}
const port = process.env.PORT || 3000;
app.use("/", auth_1.default);
app.listen(port, () => console.log("app running on port: " + port));
//# sourceMappingURL=app.js.map