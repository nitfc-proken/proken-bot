import {GuildMember, 
  Events,
  Client,} from 'discord.js';
import { sendMessage } from '../util/message';
import { YamlConfiguation } from '../util/yaml';

export class JoinRole{
  private GUILD_ID: string = YamlConfiguation.get("DISCORD.SERVER").toString();
  private ROLE_ID: string = YamlConfiguation.get("JOIN_ROLE.ROLE").toString();
  private INVITE_LINK: string = YamlConfiguation.get("JOIN_ROLE.INVITE").toString();
  
  private invitesCache = new Map<string, Map<string, number>>();
  private DiscordClient: Client<boolean>;

  constructor(DiscordClient: Client<boolean>){
    this.DiscordClient = DiscordClient;
    this.init();

    DiscordClient.on(Events.GuildMemberAdd, this.userJoin.bind(this));
  }

  async init(){  
    const guild = await this.DiscordClient.guilds.fetch(this.GUILD_ID!);
    if (!guild) {
      console.error('ギルドが見つかりません。');
      process.exit(1);
    }
  
    try {
      const invites = await guild.invites.fetch();
      console.log(guild.id)
      console.log(invites)
      this.invitesCache.set(guild.id, new Map(invites.map(invite => [invite.code, invite.uses ?? 0])));
    } catch (error) {
      console.error('招待リンクの取得中にエラーが発生しました: ', error);
      process.exit(1);
    }
    console.log('招待リンクの取得が完了しました。');
  }
  
  async userJoin(member: GuildMember): Promise<void> {
    const GUILD_ID = this.GUILD_ID;
    if (member.guild.id !== GUILD_ID) return;
    
    const cachedInvites = this.invitesCache.get(member.guild.id);
    console.log(cachedInvites)
    if (!cachedInvites) return;
  
    let message = "";
    try {
      const newInvites = await member.guild.invites.fetch();
      const usedInvite = newInvites.find(invite => cachedInvites.get(invite.code)! < invite.uses!);
      if (usedInvite) {

        if (usedInvite.code === this.INVITE_LINK) {
          message = `User ${member.user.tag} joined using invite code ${usedInvite.code}`;
    
          // ロールを付与する
          const role = await member.guild.roles.fetch(this.ROLE_ID!);
          if (role) {
            await member.roles.add(role);
            message = `Assigned role <@&${this.ROLE_ID}> to user <@${member.user.id}`;
          } else {
            message = `指定されたロールが見つかりません。 RoleID=${this.ROLE_ID}`;
          }
        } else {
        message = `User ${member.user.tag} joined using invite code ${usedInvite.code} from ${usedInvite.inviter?.tag}`;
        }
      } else {
        message = `User ${member.user.tag} joined, but the invite code could not be determined.`;
      }
  
      this.invitesCache.set(member.guild.id, new Map(newInvites.map(invite => [invite.code, invite.uses ?? 0])));
    } catch (error) {
      message = '招待リンクの更新中にエラーが発生しました: ' + error;
    }
    sendMessage(member.guild.systemChannelId!,message);
  }
  
}