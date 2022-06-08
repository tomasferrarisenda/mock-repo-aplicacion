// For Node/CommonJS
// declare function require(path: string): any;
declare module "*.html" {
    const content: string;
    export default content;
}

declare var XDomainRequest;