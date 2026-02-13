/* global chrome */

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("captureBtn");

  button.addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "capture" }, (response) => {
      chrome.storage.local.set(
        { screenshot: response.screenshot },
        () => {
          chrome.tabs.create({ url: "index.html" });
        }
      );
    });
  });
});
