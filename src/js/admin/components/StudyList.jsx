/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable comma-dangle */
import React from 'react';

import AdminActions from '../actions/AdminActions';
import CreateStudy from './CreateStudy';
import Spacer from './Spacer';

function StudyList(props) {
  React.useEffect(() => {
    AdminActions.listenForStudies();
    return () => AdminActions.unlistenForStudies();
  }, []);

  const { studies } = props;

  if (!studies) {
    return <div>Loading studies...</div>;
  }

  let studyLinks;

  const handleSelectStudy = React.useCallback(
    (study) => {
      AdminActions.setSelectedStudy(study);
    },
    [studies]
  );

  if (studies.length === 0) {
    studyLinks = <div>No studies yet.</div>;
  } else {
    studyLinks = studies.map((study) => (
      <div key={study} className="button" onClick={handleSelectStudy(study)}>
        {study}
      </div>
    ));
  }

  return (
    <div>
      <h3>List of Studies</h3>
      <h3>Click on one to modify its settings</h3>
      {studyLinks}
      <Spacer />
      <CreateStudy studies={studies} />
    </div>
  );
}

export default StudyList;
