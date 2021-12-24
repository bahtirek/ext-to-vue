const getScreenshot = async function(){
	//document.getElementById('ui-br-ext-extension').style.display = 'none';
	document.querySelector('body').classList.add('ui-br-ext-hide-hovered');
	await setDelay(100);
	return new Promise((resolve, reject)=> {
		chrome.runtime.sendMessage({todo: "getImage"}, response => {
			if(response.imgSrc) {
				resolve(response.imgSrc);
				//document.getElementById('ui-br-ext-extension').style.display = 'block';	
				document.querySelector('body').classList.remove('ui-br-ext-hide-hovered');
			} else {
				reject();
				//document.getElementById('ui-br-ext-extension').style.display = 'block';
				document.querySelector('body').classList.remove('ui-br-ext-hide-hovered');
			}
		});
	})
}

const setDelay = function(timeout){
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, timeout);
	})
}

const imageDownload = async function(filename) {
	if (!window.bugReportextension.screenshot) {
		window.bugReportextension.screenshot = await getScreenshot();
	}
	screenshotLink('ui-br-ext-download-image-full', window.bugReportextension.screenshot, 'full_screenshot');
}

const screenshotLink = async function(id, dataUrl, filename) {
	let dlLink = document.getElementById(id);
	let MIME_TYPE = "image/jpeg";
	dlLink.download = filename;
	dlLink.href = dataUrl;
	dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
	dlLink.click();
}

export default {
    getScreenshot,
    setDelay,
    imageDownload,
    screenshotLink
}

