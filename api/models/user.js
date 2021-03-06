const mongoose = require('mongoose')

const { Schema } = mongoose

const user = new Schema(
    {
        givenName: { type: String, required: true },
        familyName: { type: String, required: true },
        username: { type: String },
        email: { type: String, required: true },
        imageUrl: { type: String },
        password: String,
        images: { type: [], default: [] },
        animals: [],
        natures: [],
        faces: [],
        foods: [],
        others: [],
    },
    { timestamps: true }
)

module.exports = mongoose.model('user', user)
