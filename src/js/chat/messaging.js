import $ from 'jquery';

// Dom elements
const MESSAGE_INPUT = $('#messageInput');
const MESSAGES_ELEMENT = $('#messages');

export default class Messaging {
  static addMessageHTML(name, message) {
    const row = $("<div class='row'>").appendTo(MESSAGES_ELEMENT);
    $("<div class='user'>").text(name).appendTo(row);
    $("<div class='message'>").text(message).appendTo(row);

    // Scroll to bottom of messages
    MESSAGES_ELEMENT[0].scrollTop = MESSAGES_ELEMENT[0].scrollHeight;
  }

  static sendSystemMessage(message) {
    this.addMessageHTML('System', message);
  }

  static enableMessaging() {
    MESSAGE_INPUT.prop('disabled', false);
    this.sendSystemMessage('You have been matched to 2 other participants. You have 3 minutes to chat.');
  }

  static disableMessaging() {
    MESSAGE_INPUT.prop('disabled', true);
  }

  static finishChat() {
    this.disableMessaging();
    this.sendSystemMessage('Your chat time is over. Please proceed to the next section of ' +
                           'the survey using the password "complete123" (without quotes)');
  }

  static earlyFinish() {
    this.disableMessaging();
    this.sendSystemMessage('We were not able to match you with other participants in time. ' +
      'Please proceed to the next section of the survey using the password "alternate123" (without quotes)');
  }
}
