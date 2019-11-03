import alt from '../alt';

import { convertToMins, findLowestUserId } from '../util';
import { MESSAGE_TYPES } from '../../constants';

function waitingMessage(maxWaitingTime) {
  return `Please wait while we match you to a room. If we are ` +
    `not able to match you in ${convertToMins(maxWaitingTime)} minutes you ` +
    `will be able to move on to the next part of the survey.`;
}

function startMessage(usersPerRoom, roomOpenTime) {
  if (usersPerRoom === 1) {
    return `You have been matched to 1 other participants. ` +
    `ATUL2You have ${convertToMins(roomOpenTime)} minutes to chat.`;
  }
  return `You have been matched to ${usersPerRoom - 1} other participants. ` +
    `ATUL3You have ${convertToMins(roomOpenTime)} minutes to chat.`;
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
    this.generateActions('receiveMessage');
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

  waitingMessage({ MessagesStore, UserStore, RoomStore, StudyStore }) {
    const maxWaitingTime = StudyStore.get('config').maxWaitingTime;
    this.actions.systemMessage({
      MessagesStore,
      UserStore,
      RoomStore,
      message: waitingMessage(maxWaitingTime),
      pushToFb: false,
    });
  }

  systemMessage({ MessagesStore, UserStore, RoomStore, message, pushToFb }) {
    const lowestId = findLowestUserId(RoomStore.get('userIds'));
    const userId = parseInt(UserStore.get('userId'), 10);

    const messagingFb = MessagesStore.get('messagingFb');
    const messageObj = { userId: MESSAGE_TYPES.system, message, generated: true };

    if (messagingFb && userId === lowestId && pushToFb) {
      messagingFb.push(messageObj);
    } else if (!pushToFb) {
      MessagesStore.get('messages').push(messageObj);
    }
  }

  sendMessage({ MessagesStore, UserStore, RoomStore, userId, message, generated }) {
    const lowestId = findLowestUserId(RoomStore.get('userIds'));
    const chatUserId = parseInt(UserStore.get('userId'), 10);

    const messagingFb = MessagesStore.get('messagingFb');

    if (!generated || (generated && lowestId === chatUserId)) {
      messagingFb.push({ userId, message, generated });
    }
  }

  startMessage({ MessagesStore, UserStore, RoomStore, StudyStore }) {
    const { usersPerRoom, roomOpenTime } = StudyStore.get('config');

    this.actions.systemMessage({
      MessagesStore,
      UserStore,
      RoomStore,
      message: startMessage(usersPerRoom, roomOpenTime),
      pushToFb: false,
    });

    this.actions.enableMessaging(MessagesStore);
  }

  finishMessage({ MessagesStore, UserStore, RoomStore, StudyStore }) {
    const baseFb = StudyStore.get('baseFb');
    const password = StudyStore.get('config').password;

    this.actions.systemMessage({
      MessagesStore,
      UserStore,
      RoomStore,
      message: finishMessage(password),
      pushToFb: false,
    });

    this.actions.disableMessaging(baseFb);
  }

  earlyFinishMessage({ MessagesStore, UserStore, RoomStore, StudyStore }) {
    const baseFb = StudyStore.get('baseFb');
    const altPassword = StudyStore.get('config').altPassword;

    this.actions.systemMessage({
      MessagesStore,
      UserStore,
      RoomStore,
      message: earlyFinishMessage(altPassword),
      pushToFb: false,
    });

    this.actions.disableMessaging(baseFb);
  }
}

export default alt.createActions(MessagesActions);
