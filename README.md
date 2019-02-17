# HOTH 6: Introduction to Back-End Web Development
**Location**: Carnesale Hermosa (100)

**Time**: 11:30-12:30am, February 17, 2019.

**Teacher**: Prateek Singh

## Resources

**Slides**
* [HOTH 6: Introduction to Back-End Web Development](https://docs.google.com/presentation/d/1zZLfPrK6_qjVlIH2yVD2nagibSlYdH64HsMAWOtO_Sc/edit?usp=sharing)

**ACM Membership Attendance Portal**
* [Portal](https://members.uclaacm.com/login)

## Today's Questions

* What is a database?
* Why are they important?
* How can I use a database in my own applications?

## Note

Many of you are probably attending this workshop because you'd like to learn how to incorporate a database into your HOTH project. Because of this, I've geared the workshop more toward practical topics, mainly setup and usage in projects. There are a lot of other topics that we will not have time to cover, so feel free to ask mentors or any of the ACM staff if you have any related questions and we'll be free to help!

## What is a database?

A database is a system that stores application data in an organized fashion. A database makes it easy to access, update, and delete our data.

## Why are they important?

Consider an app like a Todo List. In this app we can add new tasks and cross off tasks that we've already completed. Using just plain HTML, CSS, and some JavaScript, you can build something like this! BUT, there is one big issue. Let's say I've added a few tasks and marked some of them as completed. If I close this application and start it again, my Todo List will have no items just as in the beginning!

Databases are very important to us because they give us the power of persistent storage to our applications.

If the tasks of a Todo List are stored in a database instead of an array managing all of the tasks, the next time we open up the application, the Todo List will be able to ask the database for the current set of tasks and remember where we left off from last time!

## How can I use a database in my own applications?

Most database systems can be installed by simply going to a website and "downloading" (i.e. like most other software, and like the way we installed Node.js). Likewise, they usually have a terminal / console window that can be used to interact with the database using special commands. Using these types of databases, the application data that we save is stored on our own computers.

However, today we'll be using a database that's a little different: Firebase.

Firebase is a "cloud platform", which means that it provides many services online rather than making the user download them onto a computer for local use. Our data in the Firebase database will be stored online, i.e. "on the cloud". This means that the database and all of our data inside it will be living online on a different computer. In the next steps, we'll learn how to use Firebase to store tweets!

## Initial Project Setup

First, if you attended the previous workshop and finished a working version of the demo, you may skip the remaining steps in this portion.

Otherwise, you'll want to download the starter code for this project. If you are viewing this tutorial on GitHub, just scroll to the top of the page and click the green button. You will have the option of using `git clone` or downloading the folder as a zip file.

Once you have obtained the necessary files, you will have to download Node.js. Then, open the project folder in your terminal and, in the same directory level as the folders `public`, `src`, `package.json`, etc. run `npm install` to install all of the necessary dependencies for this project. Finally, run `npm start` which will open a new tab on your default browser. Use this to test and make sure the basic version of the app works for you.

## Set up the Firebase Account

Since Firebase is an online platform, we'll need to make an account through Google to be able to connect our application to the online database we make. Please follow these steps:

1. Go to the [Firebase website](https://firebase.google.com/).
2. Make a Google account if you do not already have one, otherwise sign in with your account.
3. Click "Go To Console" on the home page.
4. Create a new project by clicking "Add project". Use the title 'HOTH 6 Firebase Demo' or similar, accept the terms, and create project.
5. Keep this tab open, we will come back to it later.

## Integrating Firebase in our Application Code

All of the code written in this workshop will be done in two files: `App.js` and `database.js`. Create the new `database.js` file under the `src` directory and open it up on your favorite text editor.

First, we need to include a way for us to use Firebase code:
```javascript
const firebase = require("firebase/app");
require('@firebase/database');
```
Note that while we've required these dependencies, we haven't actually downloaded any of the firebase code we wish to use. To do this, run `npm install --save firebase` in your console in the same directory level you ran the previous `npm install` command.

Next, we need to include JavaScript code that connects our project to our online database. Let's continue the steps we followed on our account:

6. Click on `Database` under the `Develop` section on the left.
7. Scroll down to `Realtime Database` and click on `Create database`.
8. Select the `Start in Test Mode` option and continue. If you are not sure you've done this correctly, just make sure that under the `Rules` tab you have the following:

```javascript
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
9. Now, click on `Authentication` under the `Develop` section on the left.
10. On the top right, click on `Web setup`.
11. Copy the code from `//Initialize Firebase` to `firebase.initializeApp(config)` (both lines included).
12. Paste these lines after the previous code we wrote in `database.js`.

After following these steps, we've done everything we need to setup Firebase for usage in our web app! Now we can learn how to store information.

## Another Note

On top of being quick to set up, Firebase is supported by very thorough and readable documentation. For instance, almost everything I will talk about in this workshop can be found in the Firebase documentation on a single page [here](https://firebase.google.com/docs/database/web/read-and-write). There are many Firebase details, and I may not be able to cover them all in the time that we have. For anything you are not clear about, please read the documentation as it should be able to solve most of your issues.

## Writing Database Code

Finally, we get to show interaction between data in our online database and code in our application. We'd like to be able to hold on to tweets for the future even after someone has closed our application. There are two main behaviors that we are interested in.

1. Save a new tweet into the database corresponding to every time a user posts a new tweet on the app.
2. Update an existing tweet's likes when a user likes a given tweet. 

First, we need to create a database variable that we'll use to refer to our online database:

```javascript
let database = firebase.database();
```

Let's write a function to implement the first behavior in `database.js`.

```javascript
function saveTweet(curTweet, likes){
  database.ref('tweets').push({
    tweetText: curTweet,
    numLikes: likes
  });
}
```

While this isn't too much code, there are a few things happening here worth explaining. The first line creates a collection in our database named `tweets` if it does not already exist. Then, we use the `push` function since we are specifically adding a new document to this collection. In this case, the document is simply a tweet's text and number of likes, which are assigned using the parameters of the function.

At this point, we should test our current implementation before moving forward. Create an export object which looks like the following at the very end of `database.js`:

```javascript
module.exports = {
  saveTweet,
};
```
Next, make sure to include this in `App.js` by writing the following under the React import statement:
```javascript
const { saveTweet } = require('./database.js');
```

While we've implemented `saveTweet`, it's not called anywhere! Call our new function in the corresponding TODO block in `App.js`; it should look like this:

```javascript
saveTweet(currTweetObj.content, 0);
```
With this call, we make sure that every new tweet will be saved to the database with its given text and an initial like count of 0.

Now, you should be able to start up the app, create a new tweet, and then see it saved on your firebase tab in real time! (This will be under `Database` in the `Develop` section on the left.)

This is great and it means that we've done everything correctly so far. However, you'll notice that even when we click the like button, the UI is updated but the entry in our database is not. Remember that this is the second behavior that we wanted to implement, so let's go ahead and do that now.

Go to `database.js` and add a new function:

```javascript
function updateLikes(tweetContent, newLikeCount){
  let query = database.ref('tweets').orderByChild('tweetText').equalTo(tweetContent);
  query.once("child_added", function(snapshot){
    snapshot.ref.update({numLikes: newLikeCount + 1});
  });
}
```

This function looks more complicated than the last, but there's a reason for it. When we want to update the number of likes in our database, we don't have an easy way of determining which tweet the current number of likes belongs too. So, we have to write a query to lookup the tweet we want in our database based on the text of the tweet we wish to update. Then, we go ahead and increment its number of likes everytime the user presses the corresponding button. This syntax seems to include a lot of things we haven't seen before, but a quick look through Google's documentation on Firebase should help you familiarize yourself with what keywords such as `snapshot`, `orderByChild`, etc. mean. If you have specific questions, feel free to ask anytime!

To test and use this function, we have just a few more steps left.

1. Add `updateLikes` to the export object.
2. Add `updateLikes` to the require statement in `App.js`.
3. Call `updateLikes` in the corresponding TODO block:

```javascript
updateLikes(this.props.tweet, this.state.numLike);
```

And that's it! After these changes, you should now be able to see a given tweet's like count update in real time as well. If you have prior experience or have been paying attention carefully, you'll notice that there are some concerns that you may want to address depending on your use cases:

1. We update the number of likes by looking up a tweet based on its text content; this will fail if tweets have identical text content. The best way to fix this is to save another value for each tweet, a tweetIndex, which is unique for every tweet and can be used to search. Alternatively, you can look into Firebase's built-in indexing which will do this for you more smoothly; consult the documentation or ask after the presentation for help with this.

2. Google has recently changed Firebase's flagship storage model to Cloud Firestore. This is generally a preferred alternative to the Realtime Database option we have used in this workshop. If you are looking to use Firebase outside the scope of this hackathon, you may want to checkout how to set it up [here](https://firebase.google.com/docs/admin/setup).

Thanks for coming out to the workshop!
