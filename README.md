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

5. In your new project, click the gear symbol next to "Project Overview" and click "Project settings"
6. There should be a row of tabs at the top of the page, please click on "Service accounts"
7. On this page, click on "Generate new private key" on the bottom of the page; this will download a file with information that will help our blog application connect to our online Firebase database. Rename this file to "firebase-key.json" and save it in the blog template folder you downloaded in the previous step.
8. Finally, click on the "Database" section from the sidebar on the left
9. Here, make sure that the dropdown next to the "Database" header on the page is set to "Cloud Firestore" rather than "Realtime Database"

## Integrating Firebase in our Application Code

All of the code written in this workshop will be done in two files: `App.js` and `database.js`. Create the new `database.js` file under the `src` directory and open it up on your favorite text editor.

First, we need to include a way for us to use Firebase code:
```javascript
const firebase = require("firebase/app");
require('@firebase/database');
```
Note that while we've required these dependencies, we haven't actually downloaded any of the firebase code we wish to use. To do this, run `npm install --save firebase` in your console.

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
9. Now, click on `Authentication` under the `Develop section on the left.
10. On the top right, click on `Web setup`.
11. Copy the code from `//Initialize Firebase` to `firebase.initializeApp(config)` (both lines included).

After following these steps, we've done everything we need to setup Firebase for usage in our web app! Now we can learn how to use the firebase for storing information.


``` javascript
const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const postsCollection = db.collection('posts');
```

**Aside**

On top of being quick to set up, Firebase is supported by very thorough and readable documentation. For instance, almost everything I've explained so far can be found in the Firebase documentation on a single page [here](https://firebase.google.com/docs/admin/setup). There are many Firebase details, and I may not be able to cover them all in the time that we have. For anything you are not clear about, please read the documentation as it should be able to solve most of your issues.

**End Aside**

Remember that Firebase stores data objects as "documents" while we use javascript objects in the code that we write. To make sure we can use what Firebase gives us, we need to write a function to convert between data formats.

``` javascript
// Converts a Firebase document to a JavaScript object we could JSON-stringify.
function docSnapshotToData(doc) {
	const { title, body, creationTime } = doc.data();
	return {
		id: doc.id,
		title,
		body,
		creationTime: creationTime.toMillis(),
	};
}
```

## Writing Database Code

Finally, we get to show interaction between data in our online database and code in our application. We can't have a blog without being able to write posts! Let's write a function to do this.

``` javascript
// post is an object with the following fields:
// - title (string)
// - body (string): body of the post in HTML
async function addPost(post) {
	const doc = await postsCollection.add({
		title: post.title,
		body: post.body,
		creationTime: FieldValue.serverTimestamp(),
	});
	return doc.id;
}
```
There's a few things to note here. Remember that we use async functions for operations that may take a long time. Writing to, deleting from, and updating a database takes time. This means that whenever we want to change the state of the database or ask it for some data, its best to write async functions. The `FieldValue` is used to keep track of when a post was created on the database, you can read more about it [here](https://firebase.google.com/docs/reference/js/firebase.firestore.FieldValue).


At this point, we've written the function that correctly adds a post to our Firebase database! There is one last step though. This function can only be used by backend code right now. If someone working on the frontend wants to allow a post to be added to the database if a user clicks on a button to do so, they have no way of accessing the behavior we just implemented! Let's create the route in our API that lets others do this.

```javascript
router.post('/', async (req, res, next) => {
	try {
		const id = await addPost(req.body);
		res.end(id);
	} catch (err) {
		next(err);
	}
});
```

For an outside user of our backend code, this route says "if you make a post request to the `/` route on the backend, you'll add a post to the database".

With this implemented, let's start the blog app and see what we have so far. Please follow these steps:

To start the backend,

```shell
cd backend
npm install
node index.js
```
Remember, `cd` should be `dir` in Windows CMD.

To start the frontend,
```shell
cd ..
cd frontend
npm install
npm start
```

You should be able to see app at localhost:3000

Let's try to COMPOSE a post on this page. After you've done so, what do you notice? We can't see the post! Let's head over to our Firebase console to see what's happening. Click on "Database" on the left sidebar. What do you notice now?

You've learned how to save application data onto a database! Unfortunately, this is all we have time for today. Get started on the rest of the blog!!!

## Finishing the Blog App

With the backend-template project we've been working on in today's workshop, all of the front end code has been provided to you. However, there are many gaps in the backend code that need to be completed. In the `index.js` file and the "routes" folder's `posts.js` file we've written many TODOs where code needs to be added. You'll have the next few weeks to fill out this code to get all of the features of the blog app working.
