
// Tokens for Facebook Messenger API
const PAGE_ACCESS_TOKEN ='EAAFgl5IbWKgBOZBXh0ZBudJyG4fubZB3YmaXpO03DeVIgcCMCx8gFJy3OubLqiGwuCp5VMhSZAQKIdJlYDhZAZCmW5w9d4qqnTooytX9ycpALMFOSABe1xWYqv81MtzQlhTtDryy6fPRigxovrmBVpZBdyBUiq0LLD71ZBQjcNxfXlCIZC5bRt2R3aCioZCNZCA6JRP'; // Replace with your Page Access Token from Facebook
const VERIFY_TOKEN = 'livechateWebsiteTokendfsdfsdf'; // Replace with your Verify Token to validate webhook



// Endpoint for verifying the webhook with Facebook
const getingWebHook = async = (req, res) => {
    // Extract query parameters from the request
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Check if mode and token are present
    if (mode && token) {
        // Verify the token matches the expected token
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED'); // Log verification success
            res.status(200).send(challenge); // Respond with the challenge to complete verification
        } else {
            res.sendStatus(403); // Respond with '403 Forbidden' if verification fails
        }
    }
};



// Endpoint for handling webhook events from Facebook
const postWebHook = async (req, res) => {
    const body = req.body; // Get the body of the request

    // Check if the webhook event is for a page
    if (body.object === 'page') {
        // Iterate over each entry (could be multiple entries in the event)
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0]; // Get the first messaging event
            console.log(webhookEvent); // Log the event for debugging

            const senderPsid = webhookEvent.sender.id; // Get the sender's PSID (Page-scoped ID)
            console.log('Sender PSID: ' + senderPsid); // Log the sender's PSID

            // Check if the event is a message or a postback
            if (webhookEvent.message) {
                handleMessage(senderPsid, webhookEvent.message); // Handle incoming messages
            } else if (webhookEvent.postback) {
                handlePostback(senderPsid, webhookEvent.postback); // Handle postback actions
            }
        });

        res.status(200).send('EVENT_RECEIVED'); // Respond with '200 OK' to acknowledge receipt of the event
    } else {
        res.sendStatus(404); // Respond with '404 Not Found' if the event is not for a page
    }
};



// Function to handle incoming messages
function handleMessage(senderPsid, receivedMessage) {
    let response; // Initialize the response object

    // Check if the message contains text
    if (receivedMessage.text) {
        response = {
            text: `You sent the message: "${receivedMessage.text}". Now send me an image!`
        }; // Create a response with the received text
    }

    callSendAPI(senderPsid, response); // Send the response message back to the user
}



// Function to handle postback actions (button clicks)
function handlePostback(senderPsid, receivedPostback) {
    let response; // Initialize the response object

    const payload = receivedPostback.payload; // Get the payload of the postback

    // Determine response based on the postback payload
    if (payload === 'yes') {
        response = { text: 'Thanks!' }; // Respond with 'Thanks!' if payload is 'yes'
    } else if (payload === 'no') {
        response = { text: 'Oops, try sending another message.' }; // Respond with 'Oops' if payload is 'no'
    }

    callSendAPI(senderPsid, response); // Send the response message back to the user
}




// Function to send messages via the Send API
function callSendAPI(senderPsid, response) {
    const requestBody = {
        recipient: {
            id: senderPsid // ID of the message recipient
        },
        message: response // The message to send
    };

    // Make a POST request to the Facebook Send API
    request({
        uri: 'https://graph.facebook.com/v10.0/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN }, // Page Access Token for authentication
        method: 'POST',
        json: requestBody // Send the request body as JSON
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!'); // Log success if the message is sent
        } else {
            console.error('Unable to send message:' + err); // Log the error if the message is not sent
        }
    });
}



module.exports = { getingWebHook ,postWebHook};