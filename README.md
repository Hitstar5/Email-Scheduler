# Email-Scheduler

##Libraries Used
Mongodb database
Express framework
##In app mail sending using nodemailer with automated mail sending with agenda libarary for Job scheduling

## Agenda is a MongoDB job scheduler

## agenda is used to schedule jobs for any given time. We have scheduled emails for a given time and it creates a document in a different schema, no need to query main Schema, and in case of server shoutdown it will fire those scheduled job which are not finished (in queue), when server restarts.

## we have implemented create, update and cancel job.

## postman collection added in the file for refrence
while scheduling an email, you can select US and Indian timezones (IST, PST, CST, MST, EST).

##ESlint is used for linting

##setup .env file 
PORT = 9000, MAIL_EMAIL = "", MAIL_PASSWORD = "", EMAIL_HOST = "", 
EMAIL_PORT = ""


