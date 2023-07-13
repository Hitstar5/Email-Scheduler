# Email-Scheduler

##Libraries Used
Mongodb database
Express framework
##In app mail sending using nodemailer with automated mail sending with agenda libarary for Job scheduling

## Agenda is a MongoDB job scheduler

## agenda.schedule method is used to schedule a job at a given time in the create email schedule(POST) api. It will not query main DB and in case of server shoutdown, it will fire those scheduled job which are not finished (in queue), when server restarts.

##Note:- not implemented cancel job and update job in delete and update apis respectively.

## postman collection added in the file for refrence
while scheduling an email, you can select US and Indian timezones (IST, PST, CST, MST, EST).

##ESlint is used for linting

##setup .env file 
PORT = 9000, MAIL_EMAIL = "", MAIL_PASSWORD = "", EMAIL_HOST = "", 
EMAIL_PORT = ""


