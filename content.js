var playButtonSigil = document.querySelectorAll("*[data-sigil='m-video-play-button playInlineVideo']");
if (playButtonSigil.length > 0) {
    var playButton = playButtonSigil[0];
    playButton.click();
    var urlVar = document.querySelectorAll('video')[0].src;
    chrome.runtime.sendMessage({ url: urlVar }, function (response) {
    });
} else {
    console.log("Couldn't find any play button. Please enter the specific video page.");
}
