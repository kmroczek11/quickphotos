let insertBtn = document.getElementById("insertBtn");
let determined = 0;
let downloadedFilenames = {};
const log = chrome.extension.getBackgroundPage().console.log;

chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  let filename = determined.toString() + ".jpg";
  suggest({
    filename: filename
  });
  downloadedFilenames[determined] = filename;
  determined++;
});

insertBtn.addEventListener("click", () => {
  try {
    let url = document.getElementById("link").value;
    if (XMLHttpRequest) {
      let request = new XMLHttpRequest();
      if ("withCredentials" in request) {
        request.open("GET", url, true);
        request.responseType = "document";
        request.onload = function(e) {
          let doc = this.response;
          let images = doc.getElementsByClassName("bigImage");

          chrome.tabs.query({ active: true, currentWindow: true }, function(
            tabs
          ) {
            log("Id pierwotnej: ", tabs[0].id);
            chrome.tabs.executeScript(tabs[0].id, { file: "click.js" });
          });

          let downloadFiles = new Promise(function(resolve, reject) {
            for (let i = 0; i < images.length; i++) {
              let src = images[i].dataset.lazy;
              chrome.downloads.download({ url: src }, function(id) {});
            }

            setTimeout(function() {
              resolve(downloadedFilenames);
            }, 3000);
          });

          downloadFiles.then(function(downloads) {
            chrome.windows.getCurrent(function(window) {
              chrome.windows.update(window.id, { focused: true }, function(
                window
              ) {
                chrome.extension.getBackgroundPage().simulate();
              });
            });
          });
        };
        request.send();
      } else {
        log("CORS not supported");
      }
    }
  } catch (error) {
    log(error.stack);
  }
});
