HRMS Backend
============

This repository contains the backend code for the HRMS application, built using Node.js and MongoDB.

Table of Contents
-----------------

-   [Installation](##installation)

-   [Environment Variables](##environment-variables)

-   [Running the Project](##running-the-project)

-   [Project Structure](##project-structure)

-   [Contributing](##contributing)


------------

## Installation

**1. Clone the repository:**
```bash 
git clone https://gitlab.com/your_username/hrms-backend.git
cd hrms-backend
```
**2. Install dependencies:**

 ```bash
npm install
```

**3. Set up environment variables:** Create a .env file in the root directory of the project and copy the following environment variables. Update the values as needed.

------------

## Environment Variables

The application requires the following environment variables to be set:

```

# Database connection URL

MONGO_URL="mongodb+srv://<username>:<password>@hrmscluster.q13pvzr.mongodb.net/?retryWrites=true&w=majority&appName=hrmsCluster"

#example - mongodb+srv://raman:pyzsOpWMheCbFZTc@hrmscluster.q13pvzr.mongodb.net/?retryWrites=true&w=majority&appName=hrmsCluster


# Server port

PORT=8080

# JWT private key for authentication

PRIVATE_KEY="this_is_a_secret_key_9876543210"

# Encryption keys for secure data handling

ENCRYPT_KEY="3b0a1d2f4c6e8g9i0k2m4o6q8s1v3y5z"

IV_FOR_ENCRYPT="000102030405060708090a0b0c0d0e0f"

# URL of the frontend client

CLIENT_URL="http://localhost:3000"

# Email service configuration for sending emails

SERVICE="Outlook365"

HOST="smtp.office365.com"

BOT_EMAIL_ID="bot-daksh@outlook.com"

BOT_EMAIL_PASSWORD="AdminDaksh#123"

# Receiver email for testing purposes

RECEIVER_EMAIL_FOR_TEST="yourmail@mail.com"

# Environment configuration (DEV or PROD)

ENV="PROD"

#ENV = "DEV"

```
-------------------

## Running the Project

```
npm run start
```
-----------------

## Project Structure

```

├── controllers         # application business logic

├── crons               # Cron jobs

├── mail templates      # HTML Mail templates design

├── middlewares         # Middleware for authentication

├── models              # Mongoose models (MongoDB schemas)

├── routes              # Express routes

├── utils               # Utility functions

└── .env                # Environment Variables file

└── index.js            # Entry point of the application

├── .env                # Environment variables

├── .gitignore          # Files and directories to ignore in Git

├── node modules        # node packages

├── package.json        # Node.js dependencies and scripts

└── README.md           # Project documentation

```
------------

## Contributing


Workflow for Team Members

For Pushing Code

1. Create a new feature branch from `dev`
    ```git checkout dev
    git pull origin dev
    git checkout -b issue_number/your_name/date   (example, task-001/raman/06-08-24)
   ```

2. Work on your feature and commit changes
    - Add changes :
        ```
         git add .
        ```

    - Commit changes:
        ```
        git commit -m "issue_number/commit_number/date"    (example, task-001/commit-01/06-08-24)
   ```

3. Push the feature branch to Gitlab
    ```
    git push origin issue_number/your_name/date 
    ```

4. Create a pull request (PR) on Gitlab:
    - Go to your repository on Gitlab.
    - Click on "Compare & pull request" next to your feature branch.
    - Select `dev` as the base branch and your feature branch as the compare branch.
    - Add a title and description, then click "Create pull request".

For Updating Your Code
1. Switch to dev branch
2. Go to your fork repo and sync fork
2. Take pull locally by running this command -
     git pull
3. Check if you got changes by checking last commit. To check last commit, run 
   git log

Follow workflow again from step 1 for working on new task

**Code practices:**
Please ensure your code follows the proper naming conventions for variables and file naming. Also add comments in your code.