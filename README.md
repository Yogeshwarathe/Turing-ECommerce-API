## Turing-ECommerce-API
In this project I worked with a real life web application to write its Backend code

## Backend of an e-commerce website
In this project, I have made a backend of an e-commerce website using Express framework of NodeJS.
Here's the swagger
        https://backendapi.turing.com/docs/

but you need to pass the test for it first here
        https://developers.turing.com/dashboard/challenge

I have also used JWT-authentication token to verify the if the customer is valid or not. We are already given the mysql-database in which there are different tables and their data. We've to write different queries for different endpoints to make them working.

## Requirements
Installation process and Execution
First and foremost, If you'are using Linux-based-OS, open your terminal and install the latest version of NodeJS and npm. You do also need to install mysql database onto your system. by writing the following commands. 
This will install NodeJS version-12 and npm version-6 on your system.

$ sudo apt-get update && sudo apt-get install curl
$ sudo apt install build-essential apt-transport-https lsb-release ca-certificates curl
$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
$ sudo apt install nodejs
Next, you've to install mysql-database onto your system. For this, write these following commands on your terminal. 

$ sudo apt-get update
$ sudo apt-get install mysql-server
You can also check the version of NodeJS and npm by writing, node -v and npm -v on the terminal respectively. 
Next, you need to make a clone of this repository and get into the repository on your terminal. Now, you need to install the required dependencies from your package.json file. For this, you've to write sudo npm install. 

There is a tshirtshop.sql file already present in the database/ folder. You have to import this file to an empty database. For this, make a new database first, and navigate to the database/ directory and then write the following commands: 
Import the schema using mysql -u <user_name> -p <database_name> < tshirtshop.sql
For checking the data, log into your user, by writing mysql -u <user_name> -p. You would be asked for your password. Now, you can use database with all its tables' data. 

Next, navigate to the folder where, server.js file is located. You can start the local server by writing node server.js on the terminal. 
You can always kill your running port by writing, killall -9 node on the terminal. 
Now, you need to install postman, that helps you to develop APIs and getting responses from it, by writing the following commands on your terminal.

$ sudo apt-get install snap
$ snap install postman
For < links > and < endpoints >, open your postman, and import my localhost postman collection from the given link.
https://www.getpostman.com/collections/692a8dad491b20a5c300

You could also check stripe.js file in routes/, you may need to host the website first and then you have to signup on https://stripe.com/ to get the access-token to use these endpoints. I have not mentioned them in my postman collection though. 



    $ sudo apt-get install snap
    $ snap install postman
For < links > and < endpoints >, open your postman, and import my localhost postman collection from the given link.
https://www.getpostman.com/collections/692a8dad491b20a5c300

You could also check stripe.js file in routes/, you may need to host the website first and then you have to signup on https://stripe.com/ to get the access-token to use these endpoints. I have not mentioned them in my postman collection though. 

