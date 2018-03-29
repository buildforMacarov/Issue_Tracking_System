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
  - `PASSWORD=<your_pc_password>`
  - `DB=its_test`
* Configure the database
  - `$ mysql -u root -p`
  - `mysql> create database its_test; exit;`
  - `$ npm run resetdb`
* Install dependencies and build
  - `$ npm install && npm install --dev`
  - `$ npm run build`
* Run it
  - `$ npm start`
  - Go to `localhost:3000`
