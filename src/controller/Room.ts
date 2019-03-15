export class Room {

    rooms_fullname: string;     // Full building name (e.g., "Hugh Dempster Pavilion").
    rooms_shortname: string;    // Short building name
    rooms_number: string;       // The room number. Not always a number, so represented as a string.
    rooms_name: string;         // The room id; should be rooms_shortname + "_" + rooms_number.
    rooms_address: string;      // The building address
    rooms_lat: number;          // The latitude of the building
    rooms_lon: number;          // The longitude of the building
    rooms_seats: number;        // The number of seats in the room
    rooms_type: string;         // The room type  (e.g., "Small Group")
    rooms_furniture: string;    // The room type (e.g., "Classroom-Movable Tables & Chairs").
    rooms_href: string;         // The link to full details online
    [key: string]: any;

    // update the list of valid keys when adding/removing keys from the class
    private static mKeys = ['rooms_lat', 'rooms_lon','rooms_seats'];
    private static sKeys = ['rooms_fullname','rooms_shortname', 'rooms_number', 'rooms_name', 'rooms_address',
                            'rooms_type', 'rooms_furniture', 'rooms_href'];

    public constructor(fullname?: string, shortname?: string, number?: string, name?: string, address?: string,
                       lat?: number, lon?: number, seats?: number, type?: string, furniture?: string, href?: string) {

        this.rooms_fullname = fullname;
        this.rooms_shortname = shortname;
        this.rooms_number = number;
        this.rooms_name = name;
        this.rooms_address = address;
        this.rooms_lat = lat;
        this.rooms_lon = lon;
        this.rooms_seats = seats;
        this.rooms_type = type;
        this.rooms_furniture = furniture;
        this.rooms_href = href;
    }

    public static isKey(key: string): boolean {
        return Room.isMKey(key) || Room.isSKey(key);
    }

    public static isMKey(key: string): boolean {
        return Room.mKeys.includes(key);
    }

    public static isSKey(key: string): boolean {
        return Room.sKeys.includes(key);
    }
}