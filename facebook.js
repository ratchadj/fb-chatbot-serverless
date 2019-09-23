'use strict';
const VERIFY_TOKEN = "ratchadjFbChabotMessages";
const https = require('https');
const PAGE_ACCESS_TOKEN = "EAAiqxpAtEaMBAAHcZBw6FQWSzZCATU0Qp6I8RIUZBnur5X99AnAZCv3IxEG99eUHJVcywOACu8oQVzhVm2KhSIwojxSqOfD6Q94KAgmZBloAoWIbkSsixHAFjjJ86QkZCFSr0IDpqYXQCBw8AOZC0WRhsUNp4WuGhUamdJLGb1ZCG3WkbFeQxzVR";
module.exports.fbmessage = (event, context, callback) => {
    console.log("event:",event);
    // console.log("context:",context);
    if(event.queryStringParameters){
        const queryparams = event.queryStringParameters;
        const mode = queryparams['hub.mode'];
        console.log("queryparams:",queryparams);
        console.log("mode:",mode);
        switch(mode) {
            case "subscribe":
                console.log("case: subscribe");
                const response = verifyToken(queryparams);
                console.log("response:",response);
                callback(null, response);
                break;
            case "POST":
                break;
            default:
                console.log("case: default");
        }
    }
    else{
        if(event.body){
            var body = JSON.parse(event.body);
            console.log("event.body:", body);
            // const response = sender_psid(body);
            // callback(null, response);
            // const sender = getSender(body);
            // console.log("sender:", sender);
            // eventMessage(body);
        }
    }
};

function verifyToken(queryparams){
    if(queryparams['hub.verify_token'] === VERIFY_TOKEN){
        return{
            'body': parseInt(queryparams['hub.challenge']),
            'statusCode': 200
        }
    }else{
        return{
            'body': 'Error, wrong validation token',
            'statusCode': 422
        }
    }
}

function sender_psid(body){
    // Get the sender's page-scoped ID
    // Parse the request body from the POST
    // let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Get the webhook event. entry.messaging is an array, but 
            // will only ever contain one event, so we get index 0
                let webhook_event = entry.messaging[0];//entry[0].id;
                console.log("webhook_event:", webhook_event);
        
        });

        // Return a '200 OK' response to all events
        // res.status(200).send('EVENT_RECEIVED');
        return{
            'body': 'EVENT_RECEIVED',
            'statusCode': 200
        }

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        return{
            'body': 'Error, event is not from a page subscription',
            'statusCode': 404
        }
    }
}

function getSender(body){
    body.entry.forEach(function(entry) {

        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log("webhook_event: ", webhook_event);
        
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
    
    });
}

function eventMessage(body){
    console.log('eventMessage: ',body);
    if (body.object === 'page') {
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log("webhook_event: ", webhook_event);        
            
            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
            
            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);        
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        
        });
    }
}

// Handles messages events
function handleMessage(sender_psid, received_message) {

    let response;

    // Check if the message contains text
    if (received_message.text) {    
  
      // Create the payload for a basic text message
      response = {
        "text": `You sent the message: "${received_message.text}". Now send me an image!`
      }
    } else if (received_message.attachments) {
  
        // Gets the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
    } else if (received_message.attachments) {
            // Get the URL of the message attachment
            let attachment_url = received_message.attachments[0].payload.url;
            response = {
                "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                    "title": "Is this the right picture?",
                    "subtitle": "Tap a button to answer.",
                    "image_url": attachment_url,
                    "buttons": [
                        {
                        "type": "postback",
                        "title": "Yes!",
                        "payload": "yes",
                        },
                        {
                        "type": "postback",
                        "title": "No!",
                        "payload": "no",
                        }
                    ],
                    }]
                }
            }
        }
    }
    
    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;
  
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { "text": "Thanks!" }
    } else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response){
    const messageData = {
        "recipient": {
        "id": sender_psid
        },
        "message": response
    }
    console.log('callSendAPI:', messageData);
    const body = JSON.stringify(messageData);
    const path = '/v2.6/me/messages?access_token=' + PAGE_ACCESS_TOKEN;
    const options = {
        host: "graph.facebook.com",
        path: path,
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    };
    var callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
        str += chunk;
        });
        response.on('end', function () {
    
        });
    }
    var req = https.request(options, callback);
    req.on('error', function(e) {
        console.log('problem with request: '+ e);
    });
    
    req.write(body);
    req.end();
}
