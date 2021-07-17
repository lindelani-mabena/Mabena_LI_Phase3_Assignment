var mongoose = require('mongoose');

var chatSchema = mongoose.Schema(
    {

        name: {
            type: String,
            required: true
        },
        chat: {
            type: String,
            required: true
        },
        chatRoom: {
            type: String,
            required: true
        },
    }
)

module.exports = mongoose.model('Chat', chatSchema);