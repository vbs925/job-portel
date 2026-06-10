"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback';
// Helper to generate tokens
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};
// ==========================================
// APPLICANT ROUTES
// ==========================================
router.post('/applicant/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Check if user exists
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Create Applicant
        const user = await prisma_1.default.user.create({
            data: {
                email,
                passwordHash,
                name,
                role: 'APPLICANT',
            },
        });
        res.status(201).json({
            message: 'Applicant registered successfully',
            token: generateToken(user.id, user.role),
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        console.error('Applicant Register Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/applicant/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || user.role !== 'APPLICANT') {
            return res.status(400).json({ message: 'Invalid credentials or incorrect portal' });
        }
        // Verify password
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json({
            message: 'Logged in successfully',
            token: generateToken(user.id, user.role),
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        console.error('Applicant Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// ==========================================
// HIRING MANAGER ROUTES
// ==========================================
router.post('/manager/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Create Manager
        const user = await prisma_1.default.user.create({
            data: {
                email,
                passwordHash,
                name,
                role: 'MANAGER',
            },
        });
        res.status(201).json({
            message: 'Manager registered successfully',
            token: generateToken(user.id, user.role),
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        console.error('Manager Register Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/manager/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || user.role !== 'MANAGER') {
            return res.status(400).json({ message: 'Invalid credentials or you are not a manager' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.json({
            message: 'Manager logged in successfully',
            token: generateToken(user.id, user.role),
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    }
    catch (error) {
        console.error('Manager Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
