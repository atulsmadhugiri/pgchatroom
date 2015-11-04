import alt from '../alt';

import { convertToMins } from '../util';

function startMessage(maxWaitingTime) {
  return `Please wait while we match you to a room. If we are ` +
    `not able to match you in ${convertToMins(maxWaitingTime)} minutes you ` +
    `will be able to move on to the next part of the survey.`;
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
    this.generateActions('systemMessage', 'message');
  }

  startMessage(maxWaitingTime) {
    this.actions.systemMessage(startMessage(maxWaitingTime));
  }

  finishMessage(password) {
    this.actions.systemMessage(finishMessage(password));
  }

  earlyFinishMessage(altPassword) {
    this.actions.systemMessage(earlyFinishMessage(altPassword));
  }
}

export default alt.createActions(MessagesActions);
