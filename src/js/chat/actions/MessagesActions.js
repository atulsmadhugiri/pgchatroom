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
    this.generateActions('systemMessage', 'receiveMessage');
  }

  enableMessaging(MessagesStore) {
    this.dispatch();
    const messagingFb = MessagesStore.get('messagingFb');

    messagingFb.on('child_added', snapshot => {
      const message = snapshot.val();
      this.actions.receiveMessage(message);
    });
  }

  disableMessaging() {
    this.dispatch();
  }

  sendMessage({ MessagesStore, userId, message }) {
    const messagingFb = MessagesStore.get('messagingFb');
    messagingFb.push({ userId, message });
  }

  waitingMessage(StudyStore) {
    const maxWaitingTime = StudyStore.get('config').maxWaitingTime;
    this.actions.systemMessage(waitingMessage(maxWaitingTime));
  }

  startMessage({ StudyStore, MessagesStore }) {
    const { usersPerRoom, roomOpenTime } = StudyStore.get('config');

    this.actions.systemMessage(startMessage(usersPerRoom, roomOpenTime));
    this.actions.enableMessaging(MessagesStore);
  }

  finishMessage(StudyStore) {
    const baseFb = StudyStore.get('baseFb');
    const password = StudyStore.get('config').password;

    this.actions.systemMessage(finishMessage(password));
    this.actions.disableMessaging(baseFb);
  }

  earlyFinishMessage(StudyStore) {
    const baseFb = StudyStore.get('baseFb');
    const altPassword = StudyStore.get('config').altPassword;

    this.actions.systemMessage(earlyFinishMessage(altPassword));
    this.actions.disableMessaging(baseFb);
  }
}

export default alt.createActions(MessagesActions);
