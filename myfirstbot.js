var builder         = require('botbuilder')
var restify         = require('restify')

var connector       = new builder.ChatConnector()
var bot             = new builder.UniversalBot(connector)   

//Luis Setup
var luisEndpoint    = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8a2efaf1-4d49-47ca-bb6d-9105bf655fe1?subscription-key=9033b7fccb83443d8127d124637a09a9&verbose=true&q='
var recognizer      = new builder.LuisRecognizer(luisEndpoint)
var intents         = new builder.IntentDialog({ recognizers: [recognizer] })

bot.dialog("/", intents)
    .matches("Greeting", [ 
        session => {
            session.send ("Hi friend")
        }  
    ])
    .matches("Menu Inquiry", [ 
        (session, response) => {
           var entities = extractEntities(session, response)

           entities.forEach(e => {
               session.send("I found an entity: " + e.entity)
           })
           
            session.send("You want to know about the menu")
        }
    ])
     .matches("None", [ 
        session => {
            session.send("I don't understand")
        }

     ])
var server = restify.createServer()
server.listen(3978, function() {    
    console.log('test bot endpoint at http://localhost:3978/api/messages')
})
server.post('/api/messages', connector.listen())


//Helper functions
const extractEntities = (session, response) => { 
    var foundentities = []

    var foodType = builder.EntityRecognizer.findEntity(response.entities, "foodType")
    var money = builder.EntityRecognizer.findEntity(response.entities, "builtin.money")

if(foodType) {
    session.userData.foodType = foodType
    foundentities.push(foodType)
}
if(money) {
    session.userData.money = money
    foundentities.push(money)
}

return foundentities
}

