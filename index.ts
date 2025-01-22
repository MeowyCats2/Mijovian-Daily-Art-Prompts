import client from "./client.ts";
import "./webserver.ts";
import { dataContent, saveData } from "./dataMsg.ts"
import { Routes, ApplicationCommandType, ApplicationCommandOptionType, Events, InteractionContextType } from "discord.js";
import type { TextChannel, RESTPutAPIApplicationCommandsJSONBody, GuildMember } from "discord.js"
import "./activity.ts";
import JSZip from "jszip";

const targetChannel = await client.channels.fetch("1327068800931070064") as TextChannel;
const dataChannel = await client.channels.fetch("1327066650133925898") as TextChannel;
const getCurrentDate = () => (new Date()).getUTCFullYear() + "-" + (new Date()).getUTCMonth() + "-" + (new Date()).getUTCDate();

const generateDuolingoInvite = async () => {
    const userCreationResponse = await fetch("https://www.duolingo.com/2017-06-30/users?fields=id", {
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
            "Accept": "application/json; charset=UTF-8",
            "Accept-Language": "en-CA,en-US;q=0.7,en;q=0.3",
            "X-Amzn-Trace-Id": "User=0",
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json; charset=UTF-8"
        },
        "referrer": "https://www.duolingo.com/register",
        "body": "{\"distinctId\":\"0f678ecb-6de9-4c08-96da-26eed68f8e22\",\"signal\":{\"siteKey\":\"6LcLOdsjAAAAAFfwGusLLnnn492SOGhsCh-uEAvI\",\"token\":\"03AFcWeA6ngV7TPcJ0KPAeWzzxiR2tSmcNCCAg9iSy0bzOfyIhpZCVEanqYYp1LS5jXDhODeJUY-G1TRBUiHG9dFZNe3C94ETKHKfIRHZxCadqRtbW4C8_KseSMMFrRr0iQ0QrwsmqOpvwkx5ChUZgLcFW66u_DI9tTyCoZu6JeSIpyMejbvC250uoq_4tflvynpsFbar1DW6swOAlARSzuED_rt6brSSPDboVJD6yO_P4TprjQCdw28GxyvIDteqjRVlpHgvBBiAHJz_XEn9rCQRnWqu_kgTdDHoLKdqOUtJZ7sd8jKCiZgpEYgafRwHqTF7_NtX35MjMrEWjQd76ZNQIfUUP2wmzGxDPD3ORSLokYJ-mLGo1nfNWG3390otQaMwsV5IzGNhf2vbR4A8bmiqkMoO6vQussNRoCw-dkhF0Md3KBRdC7PdWhtcDAL0AhtYuciERa5PZT1nFTCsmzt6e4tW7sfM-gZ27zcZOvIfjRJGLQL51FFjYW4GIDtZiSnWhbkLP5BNU_6BpDSBqDVLxceY1vqJsKt9deuScZ5YAMxIdffhPd2y4BU4gYOKbGjNSzL0LPuylVOWJL5QGc99-5bWKKEQaeHsQ5c9NssIZs9RbEG6CuVwMgREt_M1jPFi_1CVfChZVirfX5Ee2Z0a9l5bGyZUtg4Md4WfJ8JAtfCaIZvNrNbpFaTBzCu5ZPLvPnMYIfljvbJnF7hJYwAr1CM31ZmEe5UCCdCsjLe-tTYtCp6s5SZGgZ53xkht6Y-hO76EK80MJYkGKHyk16KQxeIlsfDhriE75VhAQUX9h8SqpCxUIRXvU1KtNx8zPln6uNKjfxKlwoF0kWYYykWHuUDC1hQYelOMQOhaq2Gck7sAOxO9NWjs7tCaOxLu9EaeCpEhkLUXvhQ8Nn9-xhRhK9MYgUYrnoKCisqgPvfzaZbTRA94AZ9fZ2KDUaVcMKqmg1ebf7vOyiFOTMUhWHHJ38r9EvODuNVnRTzYLwtCYUyvIQYe32CnVH-SO9Cmda4ULKvtO_GcfChPJnNx7O2ftfCy4WS2IZymbRpTBwJ5TO6cS__DO9myNkxScqk7jgRL0Ck-AAh5VEn3ZPiYpGQ92Ee5Recubq5Hx2dffMqrlfl00xFdCw8kMDtVN3V_BjqVQ_aXutkb6rLkdiOKnjiCwPxvMRqkUkUj_k8GqSJhd9AUaOj4LX3Qzpk7hEmOhH54skv5Uoy8oqvqKwun3Z4_Y1LNZTa8keTIHpkq2EjDW4xyOiwOByz_OSa1Cgx_ytk764cdnl22-5R21K_ppnUFGe9QY6B2K7iRrAO2UMpchiKaXKdIfCY0Ev5BhVQ4uSJQIFtlmDEmUFmvPyM7lS6juElfHj_T36FuyiQts-XCEdwk_rGob2jdB3AJffYSXg6Y-EWumXEWdDy0HdWTBOvfrHLjXzIZwP3WGc8NQauy0MrdM8Okmg6dlUmXhKlffhi2qzUawx7ie-1VfQ1YKXR58FKNqbT76ua0iWUnCozl1mc7cB-PxFDhBHRHYWnT8YLfiQvkoL__MlIrX4m9s8QF9VH8fcAEOH5zyfbxTHBg4iXIK7XKtaSr6gdpyY3HYvPyfNBdO-B0xXfo5eRCbcBPBLxQTnqZ50a0AwVI3SyTl1_G-ShAOjcrbCYlW1wza_DYgsJGmLm-Z-1X6RlXTDB1tJlX74INo6ZJIBiWKlmplkpiehhz7GSBaBIrQbiwH4-bBelvFCspEnQceBGJCYd4bI_V29arQbspMWwD9zjMTewbpfgIu5Xpm-vlLvYCWHiCaN4CcX0P4sBA-MxT2fsyDVXfhxjknweUre7qsFQhmKFbwSf8FTHE-Z1QWCOIwAEJcv0148OLwiTJD8oom7Whm7bwxlNH4oKp3pTA_jWIlrx_HbR3a7Z9XJx42YC7HYaggI11q0N0HYhHyFMILnORQ51ND2FfSG4lii9DlfPEgBgOzLoFvlYcjTNigQ1pCnX_vLRJFTRLc\",\"vendor\":2},\"timezone\":\"America/Vancouver\",\"fromLanguage\":\"en\",\"learningLanguage\":\"es\",\"landingUrl\":\"https://www.duolingo.com/redeem\",\"initialReferrer\":\"https://www.reddit.com/\",\"lastReferrer\":\"https://www.reddit.com/\"}",
        "method": "POST"
    })
    
    const setCookie = userCreationResponse.headers.getSetCookie();
    
    const userId = (await userCreationResponse.json()).id;
    
    const redeemFamilyPlanResponse = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}/shop-items`, {
        "headers": {
            "Accept": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + setCookie.find(cookie => cookie.startsWith("jwt_token="))!.match(/jwt_token=(.+?);/)![1],
            "Content-Type": "application/json; charset=UTF-8"
        },
        "referrer": "https://www.duolingo.com/lesson",
        "body": "{\"itemName\":\"immersive_plus_family_gems_1000\",\"learningLanguage\":\"fr\",\"isFree\":true}",
        "method": "POST",
        "mode": "cors"
    });
    
    const purchaseInfo = await redeemFamilyPlanResponse.json();
    
    return purchaseInfo.familyPlanInfo.inviteToken;
}
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
    await saveData();

    ((await client.channels.fetch("1331508473665552384")) as TextChannel).send("https://www.duolingo.com/family-plan?invite=" + await generateDuolingoInvite());
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
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "get_duolingo") return;
    await interaction.deferReply();
    let inviteCode = null;
    try {
        inviteCode = await generateDuolingoInvite();
    } catch (e) {
        return await interaction.followUp("Failed to generate an invite.")
    }
    return await interaction.followUp("https://www.duolingo.com/family-plan?invite=" + inviteCode)
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
        ],
        contexts: [
            InteractionContextType.Guild
        ]
    },
    {
        type: ApplicationCommandType.ChatInput,
        name: "my_art",
        description: "See all your submissions",
        contexts: [
            InteractionContextType.Guild
        ]
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
        ],
        contexts: [
            InteractionContextType.Guild
        ]
    },
    {
        type: ApplicationCommandType.ChatInput,
        name: "export_art",
        description: "Export all your submissions",
        contexts: [
            InteractionContextType.Guild
        ]
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
        ],
        contexts: [
            InteractionContextType.Guild
        ]
    },
    {
        type: ApplicationCommandType.ChatInput,
        name: "get_duolingo",
        description: "Get a Duolingo invite",
        contexts: [
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ]
    },
]
if (!client.application) throw new Error("No application for client?")
await client.rest.put(Routes.applicationCommands(client.application.id), {"body": commands})