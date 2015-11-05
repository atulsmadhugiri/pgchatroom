import alt from '../alt';

import { convertToMins } from '../util';

function waitingMessage(maxWaitingTime) {
  return `Please wait while we match you to a room. If we are ` +
    `not able to match you in ${convertToMins(maxWaitingTime)} minutes you ` +
    `will be able to move on to the next part of the survey.`;
}

function startMessage(usersPerRoom, roomOpenTime) {
  return `You have been matched to ${usersPerRoom - 1} other participants. ` +
    `You have ${convertToMins(roomOpenTime)} minutes to chat.`;
}

function finishMessage(password) {
  return `Your chat time is over. Please proceed to the next section of ` +
   `the survey using the password "${password}" (without quotes).`;
}

function earlyFinishMessage(altPassword) {
  return `We were not able to match you with other participants in time. ` +
    `Please proceed to the next section of the survey using the password ` +
    `"${altPassword}" (without quotes)`;
}

class MessagesActions {
  constructor() {
    this.generateActions('enableMessaging', 'disableMessaging',
      'systemMessage', 'message');
  }

  waitingMessage({ maxWaitingTime }) {
    this.actions.systemMessage(waitingMessage(maxWaitingTime));
  }

  startMessage({ usersPerRoom, roomOpenTime }) {
    this.actions.enableMessaging();
    this.actions.systemMessage(startMessage(usersPerRoom, roomOpenTime));
  }

  finishMessage({ password }) {
    this.actions.systemMessage(finishMessage(password));
    this.actions.disableMessaging();
  }

  earlyFinishMessage({ altPassword }) {
    this.actions.systemMessage(earlyFinishMessage(altPassword));
    this.actions.disableMessaging();
  }
}

export default alt.createActions(MessagesActions);
