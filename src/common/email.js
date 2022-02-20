
const sendEmail = async function(report, user) {  
    const emailBody = await createEmailContent(report, user);
    const email = makeTextFile(emailBody);
    console.log(email);
    console.log(emailBody);
    let link = document.getElementById('ui-br-ext-download-email');
    link.href = makeTextFile(emailBody);   
	link.click();
}

const createEmailContent = function (report) {
    const list = ['description', 'actualResults', 'expectedResults', 'stepsToReproduce'];
    const titles = {
        description: 'Description',
        actualResults: 'Actual results',
        expectedResults: 'Expected results',
        stepsToReproduce: 'Steps to reproduce'
    }

    let content = ``;

    for (const item of list) {
        if (report[item] && report[item].length > 0) {
            content += `<div class="title"><b>${titles[item]}</b><div>
                        <div class="description"><pre>${report[item]}</pre><div> <br>`

        }                   
    }

    if(report.saveScreenshot && report.screenshot) { 
        content += `<br><div class="image"> <img src=${report.screenshot} width="500px" height="400px"></div>`
    }
    const emailBody = 
   `Subject: Bug Report\nX-Unsent: 1\nContent-Type: text/html

    <html>
    <head>
    <style>
    
    </style>
    </head>
    <body>
    <div class="main">${content}</div>
    </body>
    </html>`
    return emailBody;
}

const makeTextFile = function (text) {
    let data = new Blob([text], {type: 'text/plain'});    
    const textFile = window.URL.createObjectURL(data);
    return textFile;
};
    
export default {
    sendEmail
}