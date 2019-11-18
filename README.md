# TeamWork

[![Build Status](https://travis-ci.org/Stanyke/TeamWork.svg?branch=post-article)](https://travis-ci.org/Stanyke/TeamWork) [![Coverage Status](https://coveralls.io/repos/github/Stanyke/TeamWork/badge.svg?branch=user-login)](https://coveralls.io/github/Stanyke/TeamWork?branch=user-login)

Teamwork is an internal social network for employees of an organization. The goal of this application is to facilitate more interaction between colleagues and promote team bonding.

The projet is built with NodeJS.

The server is running on localhost:3000 which can be started with the following command "npm run start:teamwork" without the quotes. Also the setting that made this happen can be located in the package.json file on line 9.

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
routes requiring authentication, using JSON Web Token (JWT).