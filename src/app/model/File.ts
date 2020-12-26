/**
 * Representa a entrada de um arquivo
 */
export class FileInfo {
    constructor() {
        this.base64 = '';
        this.id = null;
        this.name = '';
        this.type = 'PDF';
    }
    base64: string;
    id: string;
    name: string;
    type: string;
}