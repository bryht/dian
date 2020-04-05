
export default class Log {
    public static Info(obj: any): void {
        console.log(JSON.stringify(obj, null, 2));
    }
    public static Debug(obj: any): void {
        console.debug(JSON.stringify(obj, null, 2));
    }
}
