const { SlashCommandBuilder, MessageAttachment, AttachmentBuilder } = require('discord.js');
const {createCanvas, loadImage, registerFont} = require("canvas");
const {fetchUserData, lvlScale} = require("../../module/levelingSystem.js")
const sleep = require("../../utility/sleep.js");

module.exports = {
	data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Shows the level of the target')
    .addUserOption(option => 
        option.setName("target")
        .setDescription("person who's level is displayed")
        .setRequired(true)
    ),
	async call(interaction) {
        interaction.deferReply();
        await sleep(250)
        let target = interaction.options.getUser("target");
        if (!target) {
            target = interaction.user;
        }
        if(!target?.id) return interaction.editReply({content: "Seems like this user doesn't exist or isn't in this server."});
        else if(target.bot) return interaction.editReply({content: `Bot XP isn't tracked so ${target.username} does not have an XP profile.`});
        const user = await fetchUserData(target.id, interaction.guild.id);
        if (!user) return interaction.editReply({content: `Seems like ${target.globalName} has not earned any xp so far.`}); // If there isnt such user in the database, we send a message
        registerFont('AreaKilometer50.ttf', {
            family:'AreaKilometer50',
        })
        // var rank;
        // for (let i = 0; i < rawLeaderboard.length; i++) {
        //     if (rawLeaderboard[i].userID == user.userID){
        //         rank = i + 1;
        //     }
        // }
        const data = {
            level: user.level + 1,
            xp: user.xp,
            nextlvl: lvlScale[user.level + 1],
            // rank,
        };
        const canvas = createCanvas(500, 150),
        cWidth = canvas.width,
        cHeight = canvas.height;
        const ctx = canvas.getContext('2d'),
        bar_width = 300;
        const avatar = await loadImage(target.avatarURL({format:'png', dynamic:false}).replace('webp','png'));
        const bg = await loadImage("pattern.jpg");
        //Background Image
        ctx.drawImage(bg, 0, 0, cWidth, cHeight);
    
    
        //Begin Drawing
        ctx.beginPath();
        ctx.arc(65, 80, 55, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();

        //XP Bar
        ctx.lineJoin = 'round';
        ctx.lineWidth = 35
        
        //shadow
        ctx.strokeStyle = '#C0C0C0'
        ctx.strokeRect(150, 126, bar_width, 0)
        
        //Empty
        ctx.strokeStyle = 'black'
        ctx.strokeRect(150, 125, bar_width, 0)

        //Filled Bar
        ctx.strokeStyle = '#333b66'
        ctx.strokeRect(150, 125, bar_width * data.xp / data.nextlvl, 0)

        //Text 
        ctx.font = '40px AreaKilometer50';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        
        ctx.fillText(`RANK`, 250, 40, 75)
        ctx.fillText(`LEVEL`, 405, 40, 75)
        
        ctx.font = '40px Arial';
        // ctx.fillText(`#${data.rank}`, 320, 40, 50)
        ctx.fillText(`${data.level}`, 465, 40, 50)
        
        ctx.font = '20px AreaKilometer50';
        ctx.textAlign = 'left';
        ctx.fillText(`${target.globalName}`, 147, 105, 200)
        
        ctx.textAlign = 'left';
        ctx.fillText(`${data.xp}/${data.nextlvl} XP`, 355, 105, 100)
        
        //Remove corners
        ctx.beginPath();
        ctx.arc(65, 80, 55, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip()

        //Draw Avatar
        ctx.drawImage(avatar, 10    , 25, 120, 110);
        
        //Send the rank card
        const at =  new AttachmentBuilder().setFile(canvas.toBuffer(), "rank.png")
        await interaction.editReply({
            files: [at]
        })
        // await interaction.editReply('Pong!');
    },
};