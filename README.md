# TeamWork
Teamwork is an internal social network for employees of an organization. The goal of this application is to facilitate more interaction between colleagues and promote team bonding.

The projet is built with NodeJS.

The server is running on localhost:3000 which can be started with the following command "npm run start:teamwork" without the quotes. Also the setting that made this happen can be located in the package.json file on line 9.

Below are the tools installed to this NodeJS project (N), their functions (F) and how it was installed (H):

1. (N) Babel,       (F) Babel is a JavaScript transpiler that converts edge JavaScript into plain old ES5 JavaScript that can run in any browser (even the old ones). It makes available all the syntactical sugar that was added to JavaScript with the new ES6 specification, including classes, fat arrows and multiline strings,        (H) npm i -D @babel/cli @babel/core @babel/preset-env @babel/register @babel/node

2. (N) Express,     (F) Helps in writing the code simpler and faster,         (H) npm i -S express

3. (N) Nodemon,     (F) Helps refreshes the server aautomatically each time new changes are made,       (H) npm i -D nodemon

4. Created a file name ".babelrc" in the root directory without the quotes just after installing babel and there you can see i'm telling the babel we are working with the environment.

5. (N) Eslint       (F) Helps identifying errors on code faster with the help of airbnb style guide,        (H) npx eslint --init