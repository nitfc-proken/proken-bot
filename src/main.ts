import {
  Client,
  GatewayIntentBits,
  Guild,
  Invite,
  GuildMember,
} from 'discord.js';
import { config } from 'dotenv';
config({ path: 'data/.env' });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
  ],
});

const { DISCORD_TOKEN, GUILD_ID, ROLE_ID, INVITE_CODE } = process.env;

if (!DISCORD_TOKEN || !GUILD_ID || !ROLE_ID || !INVITE_CODE) {
  console.error('環境変数が設定されていません。');
  process.exit(1);
}

// ボットにログイン
client.login(DISCORD_TOKEN);
