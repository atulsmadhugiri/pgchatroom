import _ from 'underscore';
import $ from 'jquery';
import BabyParse from 'babyparse';

const $dataInput = $('#dataInput');
const $submitButton = $('button[name="submit"]');
const $csvResults = $('.csvResults');

const convertToCSV = (text) => {
  const json = JSON.parse(text);
  const FIELDS = ['Room', 'Room ID', 'User ID'];
  const data = [];

  _.mapObject(json, (roomTypeData, roomType) => {
    _.mapObject(roomTypeData.rooms, (roomData, room) => {
      _.mapObject(roomData.users, (userVal, user) => {
        data.push([roomType, room, user]);
      });
    });
  });

  return BabyParse.unparse({fields: FIELDS, data: data});
};

$submitButton.click(() => {
  const csvData = convertToCSV($dataInput.val());
  $csvResults.html(csvData);
});

export default convertToCSV;
