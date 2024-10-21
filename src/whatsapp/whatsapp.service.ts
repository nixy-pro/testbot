import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;

  onModuleInit() {
    this.initializeBot();
  }

  initializeBot() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('Bot WhatsApp sudah siap!');
    });

    this.client.on('message', async (message) => {
      if (message.body === '!sendtoall') {
        const chat = await message.getChat();

        if (chat.isGroup) {
          const participants = chat.participants;

          participants.forEach(async (participant) => {
            const contact = await this.client.getContactById(participant.id._serialized);

            if (!contact.isMe) {
              this.client.sendMessage(contact.id._serialized, 'Pesan dari bot WhatsApp!');
            }
          });
        } else {
          message.reply('Ini bukan grup!');
        }
      }
    });

    this.client.initialize();
  }
}
