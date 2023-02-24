export function isExcludedFromHandling(url: string): boolean {
    return url.match(/^\/assets\/(icons|fonts|images|scss)/) != null;
}
