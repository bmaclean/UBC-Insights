export class CourseSection {

    courses_uuid: string;       // The unique id of a course offering
    courses_dept: string;       // The department that offered the course
    courses_id: string;         // The course number (will be treated as a string, e.g., 499b).
    courses_instructor: string; // The instructor teaching the course offering
    courses_title: string;      // The name of the course.
    courses_avg: number;        // The average of the course offering
    courses_pass: number;       // The number of students that passed the course offering
    courses_fail: number;       // The number of students that failed the course offering
    courses_audit: number;      // The number of students that audited the course offering
    courses_year: number;       // The year the course was offered
    [key: string]: any;

    // update the list of valid keys when adding/removing keys from the class
    private static mKeys: string[] = ['courses_avg', 'courses_pass', 'courses_fail', 'courses_audit', 'courses_year'];
    private static sKeys: string[] = ['courses_uuid', 'courses_dept', 'courses_id', 'courses_instructor', 'courses_title'];


    public constructor(uuid?: string, dept?: string, id?: string, instructor?: string, title?: string,
                       avg?: number, pass?: number, fail?: number, audit?: number, year?: number){

        this.courses_uuid = uuid;
        this.courses_dept = dept;
        this.courses_id = id;
        this.courses_title = title;
        this.courses_instructor = instructor;
        this.courses_avg = avg;
        this.courses_pass = pass;
        this.courses_fail = fail;
        this.courses_audit = audit;
        this.courses_year = year;
    }

    public static isKey(key: string): boolean {
        return CourseSection.isMKey(key) || CourseSection.isSKey(key);
    }

    public static isMKey(key: string): boolean {
        return CourseSection.mKeys.includes(key);
    }

    public static isSKey(key: string): boolean {
        return CourseSection.sKeys.includes(key);
    }
}