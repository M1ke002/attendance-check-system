# Attendance Check System

## Overview

A full-stack web application for managing student attendance built with MERN stack, and utilizes third party API's. Provides a user-friendly interface for teachers to manage attendance records efficiently.

## Features

- Secure login, sign up for an account
- Reset forgotten password by email
- Upload account avatar, change personal information
- Create, edit, and delete courses
- Add, edit, or remove students from a course
- Enroll multiple students in a course by uploading excel file
- Create, edit, delete attendance records
- Manually check student attendance in a session
- Scan QR code for faster attendance checking
- Provide a detailed history of past attendance records
- Display a summary of overall attendance statistics for a course in form of a bar chart

## Tech stack

- Frontend: ReactJS
- Backend: NodeJS (ExpressJS)
- Database: MongoDB
- Image storage: Cloudinary
- Deployment: Vercel, MongoDB Atlas

## Installation

To set up the project locally, follow these steps:

### 1. Clone this repository

```
git clone https://github.com/M1ke002/attendance-check-system.git
```

### 2. Install the dependencies and run the app

#### 2.1. Client

```
cd attendance-check-system/client
npm install
npm start
```

#### 2.2. Server

```
cd attendance-check-system/server
npm install
```

Create a .env file in the server directory, configure your MongoDB connection, Cloudinary api keys and Brevo email keys. You will need to create a Cloudinary and Brevo account first.

```
// SAMPLE CONFIG .env

MONGO_URL=your_mongo_url
DB_USERNAME=db_username
DB_PASSWORD=db_password
#this is the secret key for the jwt token
ACCESS_KEY=your_secret_key

EMAIL_HOST=smtp-relay.brevo.com
EMAIL_NAME=your_email@gmail.com
EMAIL_KEY=brevo_email_key

CLOUDINARY_SECRET=your_cloudinary_secret
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

Start the server

```
npm run server
```
