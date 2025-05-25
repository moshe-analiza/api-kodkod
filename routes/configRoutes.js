const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to the API. Use /api/data for data operations.'
    });
});
router.get('/data', configController.getData);
router.post('/data', configController.createData);
router.put('/data/:id', configController.updateData);
router.delete('/data/:id', configController.deleteData);
router.post('/generate-key', configController.generateApiKey);

module.exports = router;
