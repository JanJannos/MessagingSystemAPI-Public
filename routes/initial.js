const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
  res.json(
    "Hello, if you see this message that means your backend is up and running successfully. Congrats! Now let's dance!"
  )
);

module.exports = router;
