var mongoose = require('mongoose');

var chatSchema = mongoose.Schema(
    {

        title: {
            type: String,
            required: true
        },
        chat: {
            type: String,
            required: true
        },
        createdBy:
        {
            type:String,
            required:true
        },
        dateCreated:
        {
            type:Date,
            default: Date.now
        }
    }
)
module.exports = mongoose.model('Chat', chatSchema);