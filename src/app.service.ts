import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {
    const serviceAccount = this.configService.get<string>(
      'GOOGLE_APPLICATION_CREDENTIALS',
    );

    initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
    });
  }

  async getHello(): Promise<string> {
    const db = getFirestore();
    const snapshot = await db.collection('users').get();

    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });

    return 'Hello World!';
  }
}
