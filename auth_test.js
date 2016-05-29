/**
 * Tests to make sure that unauthorized users can't access more than they
 * should.
 */
const Firebase = require('firebase');

const base = new Firebase('https://research-chat-room.firebaseio.com');

function notEditable(fb) {
  fb.set('hi')
    .then(() => { console.error('Bad auth:', fb.key()) })
    .catch((err) => true);
}

// Should error
console.log('These should error');
console.log('==================');
notEditable(base.child('studies'))
notEditable(base.child('admins'))
notEditable(base.child('constants'))

setTimeout(() => process.exit(0), 5000);
