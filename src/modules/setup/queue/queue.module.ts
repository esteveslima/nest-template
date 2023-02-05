import {
  DynamicModule,
  Logger,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { BullModule, BullModuleOptions, getQueueToken } from '@nestjs/bull';
import { ModuleRef } from '@nestjs/core';
import { Job, Queue } from 'bull';
import { logClientMethods } from '../log/utils/log-client-methods';
import { ILogPayload } from '../log/types/log-payload.interface';

@Module({})
export class QueueModule implements OnApplicationBootstrap {
  static registeredQueuesConfig: BullModuleOptions[] = [];

  static setup(queuesConfig: BullModuleOptions[]): DynamicModule {
    QueueModule.registeredQueuesConfig.push(...queuesConfig);

    const registeredQueues = queuesConfig.map((queueConfig) =>
      BullModule.registerQueue(queueConfig),
    );

    return {
      module: QueueModule,
      imports: [
        BullModule.forRootAsync({
          useFactory: () => ({
            redis: {
              port: +process.env.QUEUE_PORT,
              host: process.env.QUEUE_HOST,
              username: process.env.QUEUE_USER,
              password: process.env.QUEUE_PASS,
              db: +process.env.QUEUE_DB,
            },
          }),
        }),
        ...registeredQueues,
      ],
      exports: [BullModule],
    };
  }

  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationBootstrap(): any {
    const queueNames = QueueModule.registeredQueuesConfig.map(
      (registeredQueueConfig) => registeredQueueConfig.name,
    );
    this.setupBullQueuesLog(queueNames);
  }

  private setupBullQueuesLog(queueNames: string[]) {
    queueNames.forEach((queueName) => {
      const queueToken = getQueueToken(queueName);
      const queue = this.moduleRef.get<Queue>(queueToken, { strict: false });

      queue.on('completed', this.logCompletedBullQueuesJob);
      queue.on('failed', this.logFailedBullQueuesJob);

      logClientMethods(queue, {
        context: `queue(${queue.name})`,
        selectedMethods: ['add'],
        logger: Logger,
      });
    });
  }
  private logCompletedBullQueuesJob(job: Job, jobResult: any): void {
    const logPayload: ILogPayload = {
      context: `queue(${job.queue.name})`,
      operation: `consume`,
      params: job.data,
      result: jobResult,
      details: {
        startTime: job.processedOn,
        executionTime: Date.now() - job.processedOn,
        job,
      },
    };
    Logger.log(logPayload);
  }
  private logFailedBullQueuesJob(job: Job, err: Error): void {
    const logPayload: ILogPayload = {
      context: `queue(${job.queue.name})`,
      operation: `consume`,
      params: job.data,
      result: err.message,
      details: {
        startTime: job.processedOn,
        executionTime: Date.now() - job.processedOn,
        errorStack: err.stack,
        job,
      },
    };
    Logger.error(logPayload);
  }
}
