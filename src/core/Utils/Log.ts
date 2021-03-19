
export default class Log {
    public static Info(obj: any): void {
        console.log(JSON.stringify(obj, null, 2));
    }
    public static Warning(obj: any): void {
        console.warn(JSON.stringify(obj, null, 2));
    }
}