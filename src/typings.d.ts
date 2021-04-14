/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
/* CKEditor */
declare module '@ckeditor/ckeditor5-build-decoupled-document' {
  const DecoupledDocumentBuild: any;

  export = DecoupledDocumentBuild;
}
