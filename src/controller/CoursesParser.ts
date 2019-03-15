import {Parser} from "./Parser";
import {Dataset} from "./Dataset";
import {CourseSection} from "./CourseSection";
let JSZip = require('jszip');

export class CoursesParser extends Parser {
  
    public parse(base64content: string): Promise<Dataset<CourseSection>> {
        return new Promise(function(fulfill, reject) {
            JSZip().loadAsync(base64content, { base64: true }).then(function(zip: JSZip) {

                // read each file async
                let filePromises: Array<Promise<string>> = [];
                for(let filePath in zip.files) {
                    if(zip.file(filePath))     // check if path is a file
                        filePromises.push(zip.file(filePath).async('text'));
                }

                // process each file after reading them
                Promise.all(filePromises).then(function(fileContents: string[]) {
                    let validSections: number = 0;
                    let dataset: Dataset<CourseSection> = new Dataset<CourseSection>();

                    for(let fileContent of fileContents) {
                        validSections += CoursesParser.parseDataFile(fileContent, dataset);
                    }

                    // fulfill if any file contained valid data
                    if(validSections > 0)
                        fulfill(dataset);
                    else
                        reject('dataset is not valid');
                });

            }).catch(function(err: any) {
                reject('dataset is not a valid zip file');
            });
        });
    }

    private static parseDataFile(fileContent: string, dataset: Dataset<CourseSection>): number {
        try {
            let fileContentJson: any = JSON.parse(fileContent);
            let validSections: number = 0;

            // assume that course sections data are in a array named 'result'
            // data file is invalid if there is no 'result' array or it is empty
            if(fileContentJson.hasOwnProperty('result') && Array.isArray(fileContentJson['result'])
                && fileContentJson['result'].length > 0) {

                for(let section of fileContentJson['result']) {
                    let cs: CourseSection = CoursesParser.parseCourseSection(section);
                    if(cs !== null) {
                        dataset.set(cs.courses_uuid, cs);
                        validSections++;
                    }
                }
            }
            return validSections;

        } catch(e) {
            // error parsing json from file
            return 0;
        }
    }

    private static parseCourseSection(section: any): CourseSection {
        let uuid: string;

        // if uuid is not give, consider it an invalid section
        if(!section[CoursesParser.mapping['courses_uuid']]) {
            return null;
        } else {
            uuid = section[CoursesParser.mapping['courses_uuid']].toString();
        }

        let dept: string = section[CoursesParser.mapping['courses_dept']];
        let id: string = section[CoursesParser.mapping['courses_id']];
        let instructor: string = section[CoursesParser.mapping['courses_instructor']];
        let title: string = section[CoursesParser.mapping['courses_title']];
        let avg: number = section[CoursesParser.mapping['courses_avg']];
        let pass: number = section[CoursesParser.mapping['courses_pass']];
        let fail: number = section[CoursesParser.mapping['courses_fail']];
        let audit: number = section[CoursesParser.mapping['courses_audit']];

        let year: number;

        // If the "Section":"overall" property is set, the year should be 1900
        if(section['Section'] === 'overall') {
            year = 1900;
        } else {
            year = parseInt(section[CoursesParser.mapping['courses_year']]);
        }

        return new CourseSection(uuid, dept, id, instructor, title, avg, pass, fail, audit, year);
    }

    // mapping between keys in UBC PAIR data and InsightFacade
    private static mapping = {
        courses_uuid: 'id',
        courses_dept: 'Subject',
        courses_id: 'Course',
        courses_instructor: 'Professor',
        courses_title: 'Title',
        courses_avg: 'Avg',
        courses_pass: 'Pass',
        courses_fail: 'Fail',
        courses_audit: 'Audit',
        courses_year: 'Year'

    }
}