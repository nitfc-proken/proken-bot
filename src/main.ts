import {
  Client,
  Events,
  GatewayIntentBits,
} from 'discord.js';
import { YamlConfiguation } from './util/yaml';
import { JoinRole } from './join-role/JoinRole'; // Import the JoinRole class from the appropriate module

const bot_token = YamlConfiguation.get('DISCORD.TOKEN');

if (!bot_token) {
  console.error('Discordのトークンが見つかりません。');
  process.exit(1);
}

export const DiscordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});


DiscordClient.login(bot_token);

DiscordClient.once(Events.ClientReady, () => {
  console.log(`Logged in as ${DiscordClient.user?.tag}!`);
  new JoinRole(DiscordClient);
})

