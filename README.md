# RentWise
#### What is RentWise?
RentWise is a webapp designed to help people looking for a home find a place right for them, by seeing reviews from its previous tenants.

#### Technology used
For this project, we used pure HTML and CSS for the front-end work, no bootstrap or SaSS in this.
Our backend was done using Node.js, with packages including:
 - Express
 - Express-session
 - mysql2
 - multer
 - jsdom
 - sanitize-html

Our database was made in SQL, and we hosted our website on heroku, although the heroku hosting was only partially successful, as the image uploading functions do not operate successfully on heroku.

#### File Contents
ROOT  
│   .gitignore  
│   README.md  
│   Server.js  
│  
├───assets  
│   ├───images  
│   │       city1.jpg  
│   │       city2.jpeg  
│   │       city3.jpeg  
│   │       city3.jpg  
│   │       city3.psd  
│   │       city4.jpg  
│   │       city5.jpg  
│   │       city5.psd  
│   │       city6.jpg  
│   │       closeButton.png  
│   │       favicon.ico  
│   │       house1.jpeg  
│   │       menuIcon.png  
│   │       placeholder1.png  
│   │       placholderprofilephoto.jpg  
│   │       post1.jpg  
│   │       post2.jpg  
│   │       post3.jpg  
│   │       post4.jpg  
│   │       post5.jpeg  
│   │       Rentwise_Logo.png  
│   │       searchIcon.png  
│   │  
│   ├───uploads  
│   │  
│   └───videos  
│           RentwiseGood1.mp4  
│  
├───css  
│       admin.css  
│       allPages.css  
│       createAccount.css  
│       createPost.css  
│       home.css  
│       landing.css  
│       login.css  
│       notFound.css  
│       profile.css  
│       results.css  
│       templateStyle.css  
│       unitViewing.css  
│       userTimeLineStyle.css  
│  
├───html  
│       admin.html  
│       createAccount.html  
│       createPost.html  
│       home.html  
│       index.html  
│       login.html  
│       notFound.html  
│       profile.html  
│       results.html  
│       unitView.html  
│       userTimeLine.html  
│  
├───js  
│       admin.js  
│       client.js  
│       createAccount.js  
│       createPost.js  
│       easterEgg.js  
│       profile.js  
│       search.js  
│       unitView.js  
│  
├───sql  
│      database.sql  
│  
└───  
#### How to install and run the project
##### Step 1: Downloading the project
 - On this github page, click the "Code" button to open the dropdown menu.
 - From the dropdown, select "Download ZIP" from the options.
 - Once the ZIP is downloaded, unpack it into the folder you’d like it to be in.
##### Step 2: Installing required technology
 - If you don't have it installed already, start by installing Visual Studio Code (Or another IDE, if you'd prefer.)
 - For local testing, you'll need to install XAMPP onto your computer, with the MySQL packages included.
 - You’ll also need to install Node.js and the Node package manager, since these are the fundamental building blocks of the server.
##### Step 3: Setting up node packages
 - Once everything is downloaded, use the command line to navigate to the folder you saved the project files into.
 - Inside this folder, type the following command:
npm install express express-session mysql2 multer jsdom sanitize-html
##### Step 4: Setting up the database
 - Start up XAMPP as an administrator, and run the MySQL option.
 - On the right side of the window, select “Shell”
 - From here, type in “mysql -u root -p” (or, your user credentials, if you have previously set up mysql with different credentials than the default ones.)
 - Then, in the project files folder, navigate to “sql/database.sql” and copy all of the code from this file into the XAMPP shell.
 - You may now close the shell, but leave XAMPP running with the MySQL process while you are working on the site.
##### Step 5: Running the site
 - Inside the command line for the folder, type in “node Server.js” to start the website.
 - To see the site running, open up your web browser of choice and navigate to http://localhost:8000/

#### How to use the product
- Create an account or login to the account.
- On the main/search page You can enter relevant criteria and search for existing addresses and read posts made about them.
 - You can create posts of your own by selecting the Create Post item from the navigation menu.
 - On the Create Post page, enter the address information, write your comments, attach any images that you want added, and then hit the submit button. Your post will be added for that address.
 - You can find your post again by searching for that address, or you can go to your timeline, where all your previous posts are listed.
 - Editing posts is an unfinished element that we are working on. Once implemented you will be able to edit your posts from the timeline page, or from the posting page by clicking the edit button.
 - When editing you can delete your existing images or add new ones.
 - If you are an admin user, You will see an Admin link in the navigation bar which takes you to the admin dashboard.
 - On the admin page you can manually add or delete users, change existing data on users, as well as changing permission levels.
 - On the profile page you edit your personal information, as well as add/change your avatar image
 - In the future you will be able to comment on other people’s posts, but this is not implemented yet.
#### Credits
 - Icons provided by Google - Flaticon
 - Stock images found on Pexels
 - Development support provided by members of the BCIT Computer science department
