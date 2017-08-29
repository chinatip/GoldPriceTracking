"use strict";
const db = require('../dal/db');
const Client = require('@line/bot-sdk').Client;
const moment = require("moment-timezone");
const lineConfig = require("../config/lineConfig.json");

const client = new Client({
  channelAccessToken: lineConfig.channelAccessToken,
  channelSecret: lineConfig.channelSecret
});

const monthName = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ษ.", "พ.ค.", "มิ.ย.", "ฟ.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

function pushMessage() {
  let dbInstance = db.getInstance();
  dbInstance.ref('price').orderByChild('created_at').limitToLast(1).on('child_added', snapshot => {
    let data = snapshot.val();
    let date = moment(data.created_at).tz('Asia/Bangkok');
    let showMinute = '' + date.minute();
    if(date.minute() < 10) {
      showMinute = '0' + date.minute();
    }
    let dateMessage = 'วันที่ ' + date.date() + ' ' + monthName[date.month()] + ' ' + (date.year() + 543) + ' เวลา ' + date.hour() + ':' + showMinute + ' น.\n';
    let priceMessage = 'ราคารับซื้อ: ' + data.buy + ' บาท\n' + 'ราคาขาย: ' + data.sell + ' บาท';
    let priceDiffMessage = 'เทียบราคาจากครั้งก่อน: ';
    if(data.buyDifferent > 0) {
      priceDiffMessage = priceDiffMessage + '+' + data.buyDifferent + ' บาท';
    }
    else {
      priceDiffMessage = priceDiffMessage + data.buyDifferent + ' บาท';
    }
    let message = dateMessage + '\n' + priceMessage + '\n' + priceDiffMessage;
    db.getAllUser().then(users => {
      if(users != null) {
        Object.keys(users).forEach(key => {
          client.pushMessage(users[key].id, { type: 'text', text: message });
        });
      }
    }).catch(err => {
      console.log(err);
    })
    // client.pushMessage('U192446f179afffe5d1cf02c27125081e', { type: 'text', text: message }); // Test pushMessage
  });
}

function addUser(userId) {
  db.addLineUser(userId).catch(err => console.log(err));
}

module.exports = {
  pushMessage,
  addUser
};