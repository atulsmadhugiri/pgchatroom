import '../styles/chat.css';

const $dataInput = $('#dataInput');
const $submitButton = $('button[name="submit"]');
const $csvResults = $('.csvResults');

const convertToCSV = (text) => {
  const json = JSON.parse(text);
  const FIELDS = ['Room', 'Room ID', 'User ID'];
  const data = [];

  const roomTypes = Object.keys(json);
  for (let i = 0; i < roomTypes.length; i++) {
    roomType = roomTypes[i];
    console.log(roomType);
    if (!json[roomType].hasOwnProperty('rooms')) { continue; }
    const rooms = Object.keys(json[roomType].rooms);
    // debugger;
    for (let j = 0; j < rooms.length; j++) {
      const room = rooms[j];
      const users = Object.keys(json[roomType].rooms[room].users);
      for (let k = 0; k < users.length; k++) {
        user = users[k];
        data.push([roomType, room, user]);
      }
    }
  }

  return Papa.unparse({fields: FIELDS, data: data});
};

$submitButton.click(() => {
  const csvData = convertToCSV($dataInput.val());
  $csvResults.html(csvData);
});
