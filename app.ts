import * as express from 'express';
import * as builder from 'botbuilder';
import { Handoff } from './handoff';
import { commandsMiddleware } from './commands';

//=========================================================
// Bot Setup
//=========================================================

const app = express();

// Setup Express Server
app.listen(process.env.port || process.env.PORT || 3978, '::', () => {
    console.log('Server Up');
});
// Create chat bot
const connector = new builder.ChatConnector({
    //appId: process.env.MICROSOFT_APP_ID,
    //appPassword: process.env.MICROSOFT_APP_PASSWORD
    appId:"5a8f6a4c-8ea2-4ded-bcc3-8ee3a7f4556d",
    appPassword:"mvdvHIJY6259%^gldGNZ2$}"
});

const bot = new builder.UniversalBot(connector, [
    function (session, args, next) {
        session.send('Echo ' + session.message.text);
    }
]);

app.post('/api/messages', connector.listen());

// Create endpoint for agent / call center
app.use('/webchat', express.static('public'));

// replace this function with custom login/verification for agents
const isAgent = (session: builder.Session) => 
    session.message.user.name.startsWith("Agent");

const handoff = new Handoff(bot, isAgent);

//========================================================
// Bot Middleware
//========================================================
bot.use(
    commandsMiddleware(handoff),
    handoff.routingMiddleware(),
    /* other bot middlware should probably go here */
);

