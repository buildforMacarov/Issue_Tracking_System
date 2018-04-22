# Issue Tracking System
Tracks software issues :mag:

## Develop With Us

### Requirements
* Nodejs and npm
* MySQL

### Steps
* Clone this repo
  - `$ git clone <this-repo> && cd <this-repo>`
* Put the following in a new file `.env` in the project's root directory
  - `DBUSER=its_tester`
  - `DB=its_test`
  - `JWT_SECRET=2okejf0jfkeflj20ef89e8fkl`
* Configure the database
  - `$ mysql -u root -p`
  - `mysql> create database its_test;`
  - `create user 'its_tester'@'localhost';`
  - `grant all privileges on its_test.* to 'its_tester'@'localhost'; exit;`
  - `$ npm run reset-testdb`
* Install dependencies and build
  - `$ npm install && npm install --dev`
  - `$ npm run build`
* Run it
  - `$ npm start`
  - Go to `localhost:3000`
