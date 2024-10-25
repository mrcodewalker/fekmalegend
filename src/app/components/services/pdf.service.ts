import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private pdfjsLib = pdfjsLib;

  constructor() {
    this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';
  }

  async loadPdf(file: File) {
    const fileReader = new FileReader();
    return new Promise<any>((resolve, reject) => {
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdfDocument = await pdfjsLib.getDocument(typedArray).promise;
        resolve(pdfDocument);
      };
      fileReader.onerror = () => {
        reject('Failed to read the PDF file.');
      };
      fileReader.readAsArrayBuffer(file);
    });
  }
}
