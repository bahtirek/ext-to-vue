
const pdfPages = {
    content: [],
    pageMargins: [20, 40, 20, 40],
    styles: {
        subheader: {
            fontSize: 12,
            bold: true,
            margin: [0, 0, 0, 5]
        },
        description: {
            fontSize: 12,
            margin: [0, 0, 0, 20]
        },
        screenshot: {
            margin: [0, 0, 0, 20]
        }
    }
};
const savePdf = async function (report, screenshot, queryWidth) {   
    const filename = getFileName();
    pdfPages.content = [];            
    var pdfMake = require('pdfmake/build/pdfmake.js')
    if (pdfMake.vfs == undefined){
        var pdfFonts = require('pdfmake/build/vfs_fonts.js')
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }
    let page = await createPdfContent(report, screenshot, queryWidth);
    console.log(page);
    pdfPages.content = pdfPages.content.concat(page);
    pdfMake.createPdf(pdfPages).download(filename + '.pdf');
    return true;               
}

const createPdfContent = async function (report, screenshot, queryWidth) {
    const list = ['description', 'actualResults', 'expectedResults', 'stepsToReproduce'];
    const titles = {
        description: 'Description',
        actualResults: 'Actual results',
        expectedResults: 'Expected results',
        stepsToReproduce: 'Steps to reproduce'
    }
    let content = [];

    for (const item of list) {
        if (report[item].length > 0) {
            let title = {
                text: `${titles[item]}`,
                style: 'subheader'
            }

            let description = {
                text: `${report[item]}`,
                style: 'description'
            }

            content.push(title);
            content.push(description);
        }                   
    }

    if(report.saveScreenshot) { 
        const screenshotContent = {
            image: screenshot,
            width: queryWidth,
            pageBreak: 'after',
            style: 'screenshot'
        };
        content.push(screenshotContent);
    }
    return content;
}

const getFileName = function (moduleName) {
    const date = getDate();
    if(moduleName) {
        return moduleName + '_' + date
    } else {
        return 'BugReport'+ '_' + date
    }
}

const getDate = function () {
    let date = Date.now().toString();
    return date.slice(-6)
}

export default {
    savePdf,
    createPdfContent,
    getFileName,
    getDate,
}