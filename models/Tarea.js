const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const tareaSchema = new Schema({
    
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type:String,
    },
    title: String,
    description: String,
    duration: String,
    time: {type: String,
    default: "No terminado"},
    complete: String
}
,{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
})

module.exports = mongoose.model('Tarea', tareaSchema)