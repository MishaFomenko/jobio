This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## The app is deployed at: 
[AWS EC2 server](http://ec2-18-218-30-148.us-east-2.compute.amazonaws.com/)

## Problem Statement:

Providing a web service which would allow companies and job-seekers to find each other.

## Product Requirements:

This application should allow users to:

* register a new account with a new email, signin (email & password), signout, change password;
* create and manage a profile page with personal/professional/institutional information;
* create profiles of two types: organization and job seeker;
* organizations should be able to post job posts;
* job seekers should be able to subscribe to other job seekers and organizations apply for job posts;
* job-seekers and organizations should be able to search for each other in a general search and by suggested categories;


## High level system architecture

The architecture diagram for this app can be found [here](https://miro.com/app/board/uXjVNTStcWE=/?share_link_id=851990420254).
  
## Data Models

The data model diagram for this app can be found [here](https://dbdiagram.io/d/654588a07d8bbd64657522c1).

## API Definitions

API’s structure: 

* userData:
    - GET: /getUserData/[userID] - getting the user data to display on the profile page;
    - PATCH: /patchUserData/[userID] - setting and editing user data on the profile page;
* jobPosts:
    - GET: /getJobPosts/[orgID] - getting the job posts by an organization;
    - POST /postJobPost/[orgID] - creating a new job post;
    - PATCH /editJobPost/[orgID] - editing a job post;
* subs:
    - GET /getSubs/[userID or orgID] - getting the subs list for a user/organization;
    - POST /postSub/[userID]/[orgID] - subscribing for a user/organization;
    - DELETE /deleteSub/[userID]/[orgID] - unsubscribing;

## CI workflow

CI workflow is implemented using the AWS EC2 server where the app is deployed using ghactions and docker images. 