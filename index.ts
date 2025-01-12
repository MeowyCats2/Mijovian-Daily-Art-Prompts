import client from "./client.ts";
import "./webserver.ts";
import { dataContent, saveData } from "./dataMsg.ts"
import { Routes, ApplicationCommandType, ApplicationCommandOptionType, Events } from "discord.js";
import type { TextChannel, RESTPutAPIApplicationCommandsJSONBody, GuildMember } from "discord.js"
import "./activity.ts";
import JSZip from "jszip";

const targetChannel = await client.channels.fetch("1327068800931070064") as TextChannel;
const dataChannel = await client.channels.fetch("1327066650133925898") as TextChannel;
const getCurrentDate = () => (new Date()).getUTCFullYear() + "-" + (new Date()).getUTCMonth() + "-" + (new Date()).getUTCDate();

const newDay = async () => {
    const membersCollection = await targetChannel.guild.members.fetch();
    const members: GuildMember[] = [];
    while (members.length < 3) {
        const chosen = membersCollection.random()
        if (!chosen) throw new TypeError("Member not chosen.")
        if (chosen.user.bot) continue;
        members.push(chosen)
    }
    let membersString = [];
    for (const member of members) {
        membersString.push(`${membersString.length + 1}. <@${member.id}>`)
    }
    await targetChannel.send({
        content: `# M.D.A.P
## Mijovian Daily Art Prompts
<@&1327097901507154051>
## Members to Draw
${membersString.join("\n")}

## How to Submit
To submit your art, run the /submit_art command.

## Yesterday's Submissions`,
        allowedMentions: {
            users: [],
            roles: ["1327097901507154051"]
        }
    })
    for (const submission of dataContent.current.submissions) {
        const message = await dataChannel.messages.fetch(submission.message);
        await targetChannel.send({
            content: `Submitted by: <@${submission.user}>
Drawing of: <@${submission.target}>`,
            files: [
                {
                    attachment: [...message.attachments.values()][0].url,
                    name: [...message.attachments.values()][0].name,
                    description: [...message.attachments.values()][0].description ?? "",
                }
            ],
            allowedMentions: {
                users: []
            }
        });
    }

    dataContent.submissions.push(...dataContent.current.submissions);
    dataContent.current.submissions = [];
    dataContent.lastRun = getCurrentDate();
    dataContent.current.members = members.map(member => ({
        id: member.id,
        displayName: member.displayName,
        username: member.user.username
    }))
    await saveData()
}

if (dataContent.lastRun !== getCurrentDate()) newDay();

const getMillisecondsUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const millisecondsUntilMidnight = midnight.getTime() - now.getTime();
    return millisecondsUntilMidnight;
}

setTimeout(() => {
    newDay();
    setInterval(newDay, 24 * 60 * 60 * 1000)
}, getMillisecondsUntilMidnight())

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isAutocomplete()) return;
    if (interaction.commandName !== "submit_art") return;
    const name = interaction.options.get("member")?.value as string;
    await interaction.respond(dataContent.current.members.map((member, index) => ({
        name: member.displayName + " (" + member.username + ")",
        value: index + 1
    })).filter(member => member.name.toLowerCase().includes(name.toLowerCase()) || member.value + "" === name))
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "submit_art") return;
    await interaction.deferReply();
    const index = dataContent.current.submissions.findIndex(submission => submission.user === interaction.user.id && submission.target === dataContent.current.members[interaction.options.getInteger("member", true) - 1].id)
    if (index > -1) dataContent.current.submissions.splice(index, 1);
    const buffer = await (await fetch(interaction.options.getAttachment("artwork")!.url)).arrayBuffer();
    const message = await dataChannel.send({
        files: [
            {
                attachment: Buffer.from(buffer),
                description: interaction.options.getAttachment("artwork")!.description ?? undefined,
                name: interaction.options.getAttachment("artwork")!.name
            }
        ]
    })
    dataContent.current.submissions.push({
        message: message.id,
        user: interaction.user.id,
        target: dataContent.current.members[interaction.options.getInteger("member", true) - 1].id,
        timestamp: Date.now()
    })
    await saveData();
    await interaction.followUp((index === -1 ? "Replaced." : "Submitted.") + " (" + buffer.byteLength + " bytes)")
});
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "my_art") return;
    await interaction.deferReply();
    for (const submission of dataContent.submissions) {
        if (submission.user !== interaction.user.id) return;
        const message = await dataChannel.messages.fetch(submission.message);
        await interaction.followUp({
            content: `Submitted by: <@${submission.user}>
Drawing: <@${submission.target}>
Timestamp: <t:${Math.floor(submission.timestamp / 1000)}>`,
            files: [
                {
                    attachment: [...message.attachments.values()][0].url,
                    name: [...message.attachments.values()][0].name,
                    description: [...message.attachments.values()][0].description ?? "",
                }
            ],
            allowedMentions: {
                users: []
            }
        });
    }
    if (dataContent.submissions.filter(submission => submission.user === interaction.user.id).length === 0) return await interaction.followUp("You have no art?")
})
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "export_art") return;
    await interaction.deferReply();
    if (dataContent.submissions.filter(submission => submission.user === interaction.user.id).length === 0) return await interaction.followUp("You have no art?")
    const zip = new JSZip();
    for (const submission of dataContent.submissions) {
        if (submission.user !== interaction.user.id) return;
        const message = await dataChannel.messages.fetch(submission.message);
        zip.file([...message.attachments.values()][0].name, await (await fetch([...message.attachments.values()][0].url)).arrayBuffer())
    }
    await interaction.followUp({
        files: [
            {
                attachment: await zip.generateAsync({type: "nodebuffer"}),
                name: "art.zip"
            }
        ]
    });
});
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "user_submissions") return;
    await interaction.deferReply();
    for (const submission of dataContent.submissions) {
        if (submission.target !== (interaction.options.getMember("member") as GuildMember).id) return;
        const message = await dataChannel.messages.fetch(submission.message);
        await interaction.followUp({
            content: `Submitted by: <@${submission.user}>
Drawing: <@${submission.target}>
Timestamp: <t:${Math.floor(submission.timestamp / 1000)}>`,
            files: [
                {
                    attachment: [...message.attachments.values()][0].url,
                    name: [...message.attachments.values()][0].name,
                    description: [...message.attachments.values()][0].description ?? "",
                }
            ],
            allowedMentions: {
                users: []
            }
        });
    }
    if (dataContent.submissions.filter(submission => submission.target === (interaction.options.getMember("member") as GuildMember).id).length === 0) return await interaction.followUp("They have no art?")
})
const commands: RESTPutAPIApplicationCommandsJSONBody = [
    {
        type: ApplicationCommandType.ChatInput,
        name: "submit_art",
        description: "Submit a drawing of the members of the day",
        options: [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "member",
                description: "The index of the member you're submitting the art for",
                required: true,
                min_value: 1,
                max_value: 3,
                autocomplete: true
            },
            {
                type: ApplicationCommandOptionType.Attachment,
                name: "artwork",
                description: "The artwork you're submitting",
                required: true
            }
        ]
    },
    {
        type: ApplicationCommandType.ChatInput,
        name: "my_art",
        description: "See all your submissions"
    },
    {
        type: ApplicationCommandType.ChatInput,
        name: "user_submissions",
        description: "See all the drawings of when the user was the target",
        options: [
            {
                type: ApplicationCommandOptionType.User,
                name: "member",
                description: "The member to check for",
                required: true
            }
        ]
    },
    {
        type: ApplicationCommandType.ChatInput,
        name: "export_art",
        description: "Export all your submissions"
    },
    {
        type: ApplicationCommandType.ChatInput,
        name: "activity_chart",
        description: "See the activity of a member",
        options: [
            {
                type: ApplicationCommandOptionType.User,
                name: "member",
                description: "The member to check for",
                required: true
            }
        ]
    },
]
if (!client.application) throw new Error("No application for client?")
await client.rest.put(Routes.applicationCommands(client.application.id), {"body": commands})