class ILogEntry {
    constructor(uuid, timestamp) {
        this.uuid = uuid;
        this.timestamp = timestamp;
    }
}
export class  IClipboardData extends ILogEntry {
    constructor(uuid,timestamp,text,url) {
        super(uuid,timestamp);
        this.text=text;
        this.url = url;
    }
}

export class INavigationLogEntry extends ILogEntry{
    constructor(uuid,timestamp,url) {
        super(uuid,timestamp);
        this.url = url;
    }
}