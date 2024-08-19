const { Schema, model } = require('mongoose')

const profileShema = {
    _id: Schema.Types.ObjectId,
    userId: String,
    guildId: String,
    levelNotifications: { type: Boolean, default: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },

}

module.exports = model("userProfile", profileShema, "userProfiles");