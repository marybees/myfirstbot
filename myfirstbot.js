var builder     = require('botbuilder')
var restify     = require('restify')
var connector   = new builder.ChatConnector()
var bot         = new builder.UniversalBot(connector)   

bot.dialog("/", [
    session => { builder.Prompts.text(session, "what is your name?") },
    (session,result) => {
            if( result.response == 'Mary')
            {
                    session.send("cool name!");
            }
            else{
                    session.send("thank you!");
            }
    }
])

var server = restify.createServer()
server.listen(3978, function() {    
    console.log('test bot endpoint at http://localhost:3978/api/messages')
})
server.post('/api/messages', connector.listen())
