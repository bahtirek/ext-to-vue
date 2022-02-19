
let mediaRecorder;

const startRecord = function(){
    const mimeType = 'video/webm';            
    const displayStream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true});
    const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    let tracks = [...displayStream.getTracks(), ...voiceStream.getAudioTracks()]
    const stream = new MediaStream(tracks);
    mediaRecorder = createRecorder(stream, mimeType);
}
const stopRecord = function(){
    mediaRecorder.stop();
}

const createRecorder = function (stream, mimeType) {
    // the stream data is stored in this array
    let recordedChunks = []; 

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
        recordedChunks.push(e.data);
        }  
    };

    mediaRecorder.onstop = function () {
        saveFile(recordedChunks, mimeType);
        recordedChunks = [];
        stream.getTracks().forEach(track => track.stop())//removes stop sharing dialog box
    };
    
    mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
    return mediaRecorder;
}

const saveFile = function (recordedChunks, mimeType){

    const blob = new Blob(recordedChunks, {
        type: mimeType
    });
    let filename = window.prompt('Enter file name'),
    downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.webm`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
}

export default {
    startRecord,
    stopRecord
}