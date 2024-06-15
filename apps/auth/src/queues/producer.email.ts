import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel, Options } from 'amqplib';


@Injectable()
export class ProducerEmailService implements OnModuleInit {

    
    private readonly logger = new Logger(ProducerEmailService.name);
    private channelWrapper: ChannelWrapper;

    private async initializeConnection() {
        const connection = amqp.connect(['amqp://localhost']);
        this.channelWrapper = connection.createChannel({
            setup: (channel: Channel) => {
                return channel.assertQueue('emailQueue', { durable: true });
            },
        });

        this.logger.log('Connection initialized');
    }
    async onModuleInit() {
        await this.initializeConnection();
    }

    async addToEmailQueue(mail: any) {
        if (!this.channelWrapper) {
            throw new Error('ChannelWrapper is not initialized. Ensure initializeConnection() has been called.');
        }
        try {
            const options = {
                persistent: true,
            } as Options.Publish;

            await this.channelWrapper.sendToQueue(
                'emailQueue',
                Buffer.from(JSON.stringify(mail)),
                options
            );
            this.logger.log('Sent To Queue');
        } catch (error) {
            this.logger.error('Error adding mail to queue', error.stack);
            throw new HttpException(
                'Error adding mail to queue',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}