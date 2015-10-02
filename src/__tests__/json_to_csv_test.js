import { expect } from 'chai';

import { parseData, dataToCsv } from '../js/json_to_csv';

const testJSON = {
  'test': {
    'messages' : {},
    'rooms' : {
      '-JzhkKXRyEp00PrGPnIQ' : {
        'createdAt' : 1442802915663,
        'users' : {
          '15132' : true,
          '66291' : true,
          '77721' : true
        }
      }
    },
    'users' : {
      '15132' : '-JzhkKXRyEp00PrGPnIQ',
      '66291' : '-JzhkKXRyEp00PrGPnIQ',
      '77721' : '-JzhkKXRyEp00PrGPnIQ'
    }
  }
}

const testText = JSON.stringify(testJSON);

describe('json_to_csv.js', () => {
  describe('parseData', () => {
    it('exists', () => {
      expect(parseData).to.be.ok;
    });

    it('parses text properly', () => {
      expect(parseData(testText)).to.eql([
        ['test', '-JzhkKXRyEp00PrGPnIQ', '15132'],
        ['test', '-JzhkKXRyEp00PrGPnIQ', '66291'],
        ['test', '-JzhkKXRyEp00PrGPnIQ', '77721'],
      ]);
    });
  });
});
