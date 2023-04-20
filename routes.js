import express from "express";
const router = express.Router();

export const init = (db, mqttClient) => {
    router.get('/data/realtime', async (req, res) => {
        res.send(await db.getLatestData());
    })

    router.get('/devices', async (req, res) => {
        res.send(await db.getAllDevices());
    })
};

export const getRouter = () => {
    return router;
};