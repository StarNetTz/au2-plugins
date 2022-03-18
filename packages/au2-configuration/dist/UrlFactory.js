export class UrlFactory {
    static create(win, settings) {
        return win.location.protocol + `/${settings.dir}/${settings.file}`;
    }
}
//# sourceMappingURL=UrlFactory.js.map