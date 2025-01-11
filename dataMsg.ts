import client from "./client.js";
import type { TextChannel, Snowflake } from "discord.js";

export const dataMsg = await (await client.channels.fetch("1327066650133925898") as TextChannel).messages.fetch("1327068250848235611");
const attachmentText = await (await fetch([...dataMsg.attachments.values()][0].url)).text()
export const dataContent = JSON.parse(attachmentText) as {
    submissions: {
        message: Snowflake,
        user: Snowflake,
        target: Snowflake,
        timestamp: number
    }[],
    current: {
        submissions: {
            message: Snowflake,
            user: Snowflake,
            target: Snowflake,
            timestamp: number
        }[],
        members: {
            id: Snowflake,
            displayName: string,
            username: string
        }[]
    },
    lastRun: string,
};
export const saveData = async () => await dataMsg.edit({
    "files": [
        {
            "attachment": Buffer.from(JSON.stringify(dataContent), "utf8"),
            "name": "data.json"
        }
    ]
});