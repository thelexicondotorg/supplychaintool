
export class DOMUtils {
    public static select(tree: Element, selector: string) {
        const elems: HTMLElement[] = [];
        tree.querySelectorAll(selector).forEach(e => elems.push(e as HTMLElement));
        return elems;
    }
}
