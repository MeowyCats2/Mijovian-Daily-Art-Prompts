// Require the necessary discord.js classes
import { Client, GatewayIntentBits, Events } from 'discord.js';

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration,
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.GuildPresences,
GatewayIntentBits.MessageContent],
  }); // creates a new bot client

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

console.log("Logging in...")
await client.login(process.env.token)
console.log("Logged in!")
export default client