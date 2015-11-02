var FirebaseServer = require('firebase-server');

new FirebaseServer(5000, 'test.firebaseio.com', {
  constants: {
    usersPerRoom: 3,
    maxWaitingTime: 180000,
    roomOpenTime: 180000,
    warning: 60000,
  }
});
