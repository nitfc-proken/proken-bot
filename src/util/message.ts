import { TextChannel } from 'discord.js';
import {DiscordClient} from '../main';
async function sendMessage(channelId: string, message: string): Promise<void> {
  try {
    const channel = await DiscordClient.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      console.error(`チャンネルが見つからないか、テキストチャンネルではありません: ${channelId}`);
      return;
    }

    // チャンネルがテキストチャネルであることを確認
    (channel as TextChannel).send(message);
  } catch (error) {
    console.error(`メッセージの送信中にエラーが発生しました: ${error}`);
  }
}

export { sendMessage };