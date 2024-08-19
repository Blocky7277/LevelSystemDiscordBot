const userProfiles = require("../schemas/player.js");
const mongoose = require("mongoose");


class lvlSys {
    static lvlScale = [0,100,200,300,400,500,600,700,800,900,1000,1200,1400,1600,1800,2000,2250,2500,2750,3000,3500,4000,5000,6000,7000,8000,9000,10000,20000,30000,40000,50000];
    static async createUser(userId, guildId) {
        if (!userId) return console.error("No User ID found")
        if (!guildId) return console.error("No Guild ID found")
        const isUser = await userProfiles.findOne({ userId: userId, guildId: guildId });

        if (isUser) return false;
        const newUser = new userProfiles({
            _id: new mongoose.Types.ObjectId(),
            userId,
            guildId,
        })
        await newUser.save().catch(console.error)
    }

    static async addXp(userId, guildId, xp) {
        if (!userId) return console.error("No User ID found");
        if (!guildId) return console.error("No Guild ID found");
        const userExists = await userProfiles.findOne({ userId: userId, guildId: guildId });
        let leveledUp = false;
        if (!userExists) return;
        userExists.xp += xp;
        if (userExists.xp >= lvlSys.lvlScale[userExists.level]) {
            userExists.level++;
            leveledUp = true;
        }
        await userExists.save().catch(console.error);
        return {
            user: userExists,
            leveledUp
        };
    }

    static async fetchUserData(userId, guildId) {
        if (!userId) {
            console.error("No User ID found");
            return null; 
        }
        if (!guildId) {
            console.error("No Guild ID found");
            return null;
        }
        const userExists = await userProfiles.findOne({ userId: userId, guildId: guildId });
        if (!userExists) 
            {
                console.error("No person found");
                return null;
            }
        return userExists;
    }

    static async toggleNotifications(userId, notifications) {
        if (!userId) return console.error("No User ID found");
        if (!guildId) return console.error("No Guild ID found");
        const userExists = await userProfiles.findOne({ userId: userId, guildId: guildId });
        if (!userExists) return;
        if (!notifications) userExists.levelNotifications = !userExists.levelNotifications;
        else userExists.levelNotifications = notifications;
        await userExists.save().catch(error => {console.error(error)});
        return userExists.levelNotifications;
    }
}

module.exports = lvlSys