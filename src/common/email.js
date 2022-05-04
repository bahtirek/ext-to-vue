const sendEmail = async function(report, user) {  
    const emailBody = await createEmailContent(report, user);
    const email = makeTextFile(emailBody);
    let link = document.getElementById('ui-br-ext-download-email');
    link.href = makeTextFile(emailBody);   
	link.click();
}

const createEmailContent = function (report) {
    const list = ['description', 'actualResult', 'expectedResult', 'stepsToReproduce'];
    const titles = {
        description: 'Description',
        actualResult: 'Actual results',
        expectedResult: 'Expected results',
        stepsToReproduce: 'Steps to reproduce'
    }

    let content = ``;

    for (const item of list) {
        if (report[item] && report[item].length > 0) {
            content += `<div class="title"><b>${titles[item]}</b><div>
                        <div class="description"><pre>${report[item]}</pre><div> <br>`

        }                   
    }

    if(report.screenshot) { 
        content += '<img src="cid:screenshot">';       
    }
    
    let emailBody = 
`X-Unsent: 1\nSubject: Bug Report\nContent-Type: multipart/related;\n boundary="multipart_related_boundary"\n\nThis is a multi-part message in MIME format\n--multipart_related_boundary\nContent-Type: text/html\nContent-Transfer-Encoding: 7bit

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
    <html>
    <head>
    <style>
    
    </style>
    </head>
    <body>
    <div class="main">${content}</div>
    </body>
    </html>\n`;

    if(report.screenshot) { 
        let image = report.screenshot.replace("data:image/png;base64,", "");
        const cid = `\n--multipart_related_boundary\nContent-Type: image/png; name="screenshot.png"\nContent-Transfer-Encoding: base64\nContent-ID: <screenshot>\nContent-Disposition: inline; filename="screenshot.png"\n\n${image}`
        emailBody += cid;       
    }

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