/**
 * Representa a entrada de um arquivo
 */
export class FileInfo {
    constructor() {
        this.base64 = '';
        this.id = '';
        this.name = '';
        this.type = 'PDF';
        this.url = '';
     }
    base64: string;
    id: string;
    name: string;
    type: string;
    url: string;
}