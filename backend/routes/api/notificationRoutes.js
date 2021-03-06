const notificationService = require('../../services/notificationService');

module.exports = function(app) {

  app.post('/api/notification/email', (req, res, next) => {
    notificationService.emailNotification(req.body, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      } else {
        res.status(200).send('Success');
      }
    });
  });

};
