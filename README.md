# TeamWork

[![Build Status](https://travis-ci.org/Stanyke/TeamWork.svg?branch=post-article)](https://travis-ci.org/Stanyke/TeamWork)

Teamwork is an internal social network for employees of an organization. The goal of this application is to facilitate more interaction between colleagues and promote team bonding.

The projet is built with NodeJS.

The server is running on localhost:3000 which can be started with the following command "npm run start:teamwork" without the quotes. Also the setting that made this happen can be located in the package.json file on line 9.

Available Routes:
-   /api/v1/auth/create-user
-   /api/v1/auth/signin
-   /api/v1/gifs
-   /api/v1/articles
-   /api/v1/articles/<articleid>
-   /api/v1/gifs/<articleid>
-   /api/v1/articles/<articleid>/comment
-   /api/v1/gifs/<articleid>/comment
-   /api/v1/feed


*Important Things To Note:*
1.  Only Admin can create new users in this route */api/v1/auth/create-user* with the following json query in a POST request
{
	"firstname" : "Mary",
	"lastname" : "Jane",
	"email" : "jane@gmail.com",
	"password" : "123456",
	"gender" : "Female",
	"jobRole" : "coding",
	"department" : "Programming",
	"address" : "Lagos",
	"isAdmin" : "0",
	"verifyAdmin" : "chibuike.stanley50@gmail.com" 
}
*NB:*   verifyAdmin's value can only be 'chibuike.stanley50@gmail.com' to create new users for now as this is           just an example of how to use this api.
-       isAdmin's value 0 is default as a boolean to identify if the new user should be an admin, 0 means not           admin and 1 means admin.
-       The password is encrypted with bcrypt package while creating his/her account and then decoded while             logging in.
-       If verifyAdmin's value is not recognized as registered admin, it bounces back


2.  To login visit this route */api/v1/auth/signin* and make a POST request
{
"email": String,
"password": String
}
*NB:*   As users login, a token is being generated and would last for 30minutes, the token is needed to be              copied and pasted on the *postman application header* for you to be able to access other routes                 available below.
-       Header Key -> Authorization
-       Value -> Bearer auto_generated_token_copied

-       Replace *auto_generated_token_copied* above with the generated token while logging it.
-       Remember This token is only needed in other routes apart from create-user & signin.


3.  After loging in, users can post photos in the */api/v1/gifs* route, making a POST request just after            filling in the gotten token through the method stated above in *stage 2*.
{
"image": image/gif,
"title": String
}
*NB:*   image/gif should be replaced with the name of image file name including it's extension.
        I already added 5 different images to test out (night.jgp, black.jpg, running.jpg, spin.gif, loading.gif).
-       title is maybe a writeup to accompany the image while it's being uploaded.
-       After a successful upload, you will get the url of the image which was uploaded to my cloudinary                account with other details.
-       The above code needs to be queued in the body part of the postman


4.  After loging in, users can post articles in the */api/v1/articles* route, making a POST request just after      filling in the gotten token through the method stated above in *stage 2*.
{
"title": String,
"article": String
}
*NB:*   title is like the subject of the article
-       article is the actual writeup
-       your article id will be generated and will be shown to you if posting was successful
-       The above code needs to be queued in the body part of the postman


5.  After loging in, users can edit their own articles in the */api/v1/articles/<articleid>* route, making a        PATCH request just after filling in the gotten token through the method stated above in *stage 2*.
{
"title": String,
"article": String
}
*NB:*   <articleid> should be replaced with your article id e.g. *1*, if you queued in another user's article           id to edit, you would get bounced back.
-       title is like the subject of the article
-       article is the actual writeup
-       The above code needs to be queued in the body part of the postman


6.  After loging in, users can delete their own articles in the */api/v1/articles/<articleid>* route, making a      DELETE request just after filling in the gotten token through the method stated above in *stage 2*.

*NB:*   <articleid> should be replaced with your article id e.g. *5*, if you queued in another user's article           id to delete, you would get bounced back.
-       The delete request does not need any request from the body.
-       The above code needs to be queued in the body part of the postman


7.  After loging in, users can delete their own photos in the */api/v1/gifs/<articleid>* route, making a DELETE     request just after filling in the gotten token through the method stated above in *stage 2*.

*NB:*   <articleid> should be replaced with your photo id e.g. *13*, if you queued in another user's photo           id to delete, you would get bounced back.
-       The delete request does not need any request from the body.
-       The above code needs to be queued in the body part of the postman


8.  After loging in, users can post comments on articles in the */api/v1/articles/<articleid>/comment* route,       making a POST request just after filling in the gotten token through the method stated above in *stage 2*.
{
"comment": String
}
*NB:*   String should be replaced with the comment yu have in mind in a *quote ""*
-       The above code needs to be queued in the body part of the postman


9.  After loging in, users can post comments on photos in the */api/v1/gifs/<articleid>/comment* route,       making a POST request just after filling in the gotten token through the method stated above in *stage 2*.
{
"comment": String
}
*NB:*   String should be replaced with the comment yu have in mind in a *quote ""*
-       The above code needs to be queued in the body part of the postman

10. After loging in, users can get all articles and photos in the */api/v1/feed* route, making a GET request       just after filling in the gotten token through the method stated above in *stage 2*.
    Users can view all articles and photos, showing the most recently posted articles or photos first.



Below are the tools installed to this NodeJS project (N), their functions (F) and how it was installed (H):

1. (N) Babel,       (F) Babel is a JavaScript transpiler that converts edge JavaScript into plain old ES5 JavaScript that can run in any browser (even the old ones). It makes available all the syntactical sugar that was added to JavaScript with the new ES6 specification, including classes, fat arrows and multiline strings,        (H) npm i -D @babel/cli @babel/core @babel/preset-env @babel/register @babel/node

2. (N) Express,     (F) Helps in writing the code simpler and faster,         (H) npm i -S express

3. (N) Nodemon,     (F) Helps refreshes the server aautomatically each time new changes are made,       (H) npm i -D nodemon

4. Created a file name ".babelrc" in the root directory without the quotes just after installing babel and there you can see i'm telling the babel we are working with the environment.

5. (N) Eslint       (F) Helps identifying errors on code faster with the help of airbnb style guide,        (H) npx eslint --init



Below Are Guildlines i followed in creating this Restful Api
1. Setup ESLint and ensure that your codebase follows the specified style guide
requirements

2. Setup the test framework (This can be Located at the folder *dist* in the backend directory with the help of Travis CI to build a passing project which it's passed test can be found with this readme file)

3. Setup a PostgreSQL database. (This project's database is found in my ElephantSql Account's Database)

4. Write unit-tests for all API endpoints

5. Version my API using URL versioning starting with the letter “v”. A simple ordinal
number would be appropriate and avoid dot notation such as 1.0. An example of this
will be https://somewebapp.com/api/v1.

6. Implementation of token-based authentication using JSON Web Token (JWT) and securing of all
