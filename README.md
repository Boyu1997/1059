# 1059 (Beta)

## App
Access application at [1059.boyu.io](http://1059.boyu.io)

## Local Setup
This is mainly a front-end application. A short server-side script is used to direct traffic between the front-end app and the ALF apis.
Server script is already setup running on GCP Cloud Function. To get the app running locally, you will only need to setup the front-end.

Change directory
```
cd client
```

Start the application
```
npm start
```

## Build With
- client: React.js
- server: Python