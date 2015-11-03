import alt from '../alt';

import { getAttributeFromUrlParams } from '../util';

const USER_ID_REGEX = /user_id=(\w+)/;

class UserActions {
  getInitialUserId() {
    const userId = getAttributeFromUrlParams(USER_ID_REGEX);
    if (!userId) { throw new Error('Missing user_id in url!'); }

    this.dispatch(userId);
  }
}

export default alt.createActions(UserActions);
