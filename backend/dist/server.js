"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Job Portal API is running' });
});
// Authentication Routes
app.use('/api/auth', auth_routes_1.default);
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
server.on('error', (error) => {
    console.error('Server failed to start:', error);
});
// Keep process alive just in case
setInterval(() => { }, 1000 * 60 * 60);
