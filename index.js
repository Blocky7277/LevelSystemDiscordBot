const Discord = require('discord.js')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const mongoose = require('mongoose')
const getCommands = require("./utility/getCommands.js")
const userProfiles = require("./schemas/player.js")
const lvlSys = require("./module/levelingSystem.js")
require("dotenv/config")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers,
    ],
})

const commandsArr = getCommands("./commands")

client.commands = new Collection();

for (const filePath of commandsArr) {
    const command = require(filePath);
    if ('data' in command && 'call' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`The command at ${filePath} is missing a required "data" or "call" atrribute.`);
    }
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
    console.log("Found Commands:", commandsArr)

})

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return

    command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Command "${interaction.commandName}" not found.`);
        interaction.reply(`The command ${interaction.commandName} wasn't found, it is most likely being restored right now.`)
        return
    }

    try {
        await command.call(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
})


client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return
    await lvlSys.createUser(msg.author.id, msg.guildId)

    xp = msg.content.length

    if (xp > 100) { xp = 100; }

    const result = await lvlSys.addXp(msg.author.id, msg.guildId, xp);
    
    if (result?.leveledUp) {
        msg.channel.send(`Congratulations <@${msg.author.id}> on leveling up! You are now level ${result.user.level}`)
    }

    // console.log(result.user)

})


mongoose.connect(process.env.MONGODB, {dbName: 'level_system',})

client.login(process.env.TOKEN).catch(console.error)