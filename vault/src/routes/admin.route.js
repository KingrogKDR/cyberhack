import { Router } from "express";
import { tryInternalRefresh } from "../worker/internalAuditRefresh";

const router = Router()

router.post("/internal-refresh", async (req, res) => {
    // authorization logic to be included
    const { token } = req.body
    if (!token) return res.status(400).json({ error: 'Missing token' });

    const result = await tryInternalRefresh(token);
    if (result?.status === 'ok') {
        res.json({ success: true, field: result.field, masked: result.masked });
    } else {
        res.status(404).json({ success: false, reason: result?.reason || 'Token not found or audit denied' });
    }
})

export default router