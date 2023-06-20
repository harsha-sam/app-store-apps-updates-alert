const express = require('express');
const router = express.Router();
const clientPromise = require('../lib/db');
const getAppDetails = require('../lib/getAppDetails');

router.post('/', async (req, res) => {
  try {
    const client = await clientPromise;
    const db = await client.db();
    const { email, appId } = req.body;
    const alert = await db.collection('alerts').findOne({
      email,
      appId,
    });
    if (alert) {
      throw new Error('Alert for this app id already exists with this email');
    }
    const response = await getAppDetails(appId);
    if (!response) {
      throw new Error('Invalid App Id');
    }
    const { name: appName, version: appVersion } = response;
    const data = await db.collection('alerts').insertOne({
      email,
      appId,
      appName,
      appVersion
    });
    res.json(data);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

router.delete('/', async (req, res) => {
  try {
    const client = await clientPromise;
    const db = await client.db();
    const { email, appId } = req.body;
    const data = await db.collection('alerts').deleteOne({
      email,
      appId,
    });
    res.json(data);
  }
  catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
