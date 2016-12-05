/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Pokedex tell me about Pikachu."
 *  Alexa: "(reads back information for Pikachu)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    monsters = require('./monsters');

var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * MinecraftHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Pokedex = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Pokedex.prototype = Object.create(AlexaSkill.prototype);
Pokedex.prototype.constructor = Pokedex;

Pokedex.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Alexadex. You can ask a question like, tell me about Pikachu.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

Pokedex.prototype.intentHandlers = {
    "MonsterIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "Information for " + itemName,
            monster = monsters[itemName],
            speechOutput,
            repromptOutput;
        if (monster) {
            speechOutput = {
                speech: monster,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, monster);
        } else {
            var speech;
            if (itemName) {
                speech = "I'm sorry, I currently do not know the Pokemon named " + itemName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that Pokemon. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions such as, tell me about Pikachu.";
        var repromptText = "You can say things like, tell me about Pikachu";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var pokedex = new Pokedex();
    pokedex.execute(event, context);
};
