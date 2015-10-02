import _ from 'underscore';
import $ from 'jquery';
import BabyParse from 'babyparse';

const $dataInput = $('#dataInput');
const $submitButton = $('button[name="submit"]');
const $csvResults = $('.csvResults');

const CSV_FIELDS = ['Room', 'Room ID', 'User ID'];

const parseData = (text) => {
  const json = JSON.parse(text);
  const data = [];

  _.mapObject(json, (roomTypeData, roomType) => {
    _.mapObject(roomTypeData.rooms, (roomData, room) => {
      _.mapObject(roomData.users, (userVal, user) => {
        data.push([roomType, room, user]);
      });
    });
  });

  return data;
};

const dataToCsv = (data) => {
  return BabyParse.unparse({ fields: CSV_FIELDS, data: data });
};

$submitButton.click(() => {
  const csvData = parseData($dataInput.val());
  $csvResults.html(dataToCsv(csvData));
});

export default { parseData, dataToCsv };
