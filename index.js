const Twit = require('twit');
require('dotenv').config();

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  timeout_ms: 60 * 1000,
});

console.log('The bot is starting');

const downloader = require('./downloader');
const followList = [process.env.following.split(',')];
const stream = T.stream('statuses/filter', { follow: followList });

stream.on('tweet', function (tweet, err) {
  if (tweet.entities.media == undefined) {
    console.log('text-only tweet');
  } else if (tweet.retweeted_status == undefined) {
    const name = 'images/' + tweet.id_str + '.png';
    downloader.download(tweet.entities.media[0].media_url, name, callback);
  }
});

const callback = function () {
  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + ' ' + time;
  console.log('Download succesful: ' + dateTime);
};
