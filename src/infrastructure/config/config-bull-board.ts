import { INestApplication } from '@nestjs/common';

import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

export const configBullBoard = (
  app: INestApplication,
  route: string,
  queueNames: string[],
): void => {
  const serverAdapter = new ExpressAdapter();
  createBullBoard({
    queues: queueNames.map(
      (queueName) => new BullAdapter(app.get<Queue>(getQueueToken(queueName))),
    ),
    serverAdapter,
  });
  serverAdapter.setBasePath(route);

  app.use(route, serverAdapter.getRouter());
};
