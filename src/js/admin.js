import $ from 'jquery';

const $roomName = $('#url-generator #room-name');
const $urlResult = $('#url-generator #url-result');
const $submitButton = $('#url-generator button[name="submit"]');

const generateUrl = (roomName) => {
  return `https://samlau95.github.io/pg-chat-room?` +
    `room=${roomName}&user_id=\${e://Field/CHATROOM%20ID}`;
};

const outputResult = (url) => {
  $urlResult.html(url);
};

$(() => {
  $submitButton.click(() => outputResult(generateUrl($roomName.val())));
});
