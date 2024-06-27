import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';

@Injectable({
  providedIn: 'root',
})
export class OcrService {
  private worker: any;

  constructor() {
    this.initializeWorker();
  }

  private async initializeWorker() {
    this.worker = await createWorker();
    await this.worker.load();
    await this.worker.loadLanguage('spa');
    await this.worker.initialize('spa');
  }

  public async recognizeImage(image: File): Promise<string> {
    const { data } = await this.worker.recognize(image);
    return data.text;
  }

  public async terminateWorker() {
    await this.worker.terminate();
  }
}
