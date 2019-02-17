const firebase = require("firebase/app");
require('@firebase/database');

// Firebase Configuration
let config = {
  apiKey: "AIzaSyA1T4TEKc4XGW9criEyrk1GOmgyysohDTI",
  authDomain: "hothvi-node.firebaseapp.com",
  databaseURL: "https://hothvi-node.firebaseio.com",
  projectId: "hothvi-node",
  storageBucket: "hothvi-node.appspot.com",
  messagingSenderId: "888477214159"
};
firebase.initializeApp(config);
let database = firebase.database();

function saveTweet(curTweet, likes){
  database.ref('tweets').push({
    tweetText: curTweet,
    numLikes: likes
  });
}

function updateLikes(tweetContent, newLikeCount){
  let query = database.ref('tweets').orderByChild('tweetText').equalTo(tweetContent);
  query.once("child_added", function(snapshot){
    snapshot.ref.update({numLikes: newLikeCount + 1});
  });
}

module.exports = {
  saveTweet,
  updateLikes
};
