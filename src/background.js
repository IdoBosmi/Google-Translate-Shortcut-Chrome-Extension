console.log('Background script loaded');

import { translate } from '@vitalets/google-translate-api';

// background.js
let isOn = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getHebrewMode') {
    sendResponse({ isOn });
  } else if (request.action === 'setHebrewMode') {
    isOn = request.isOn;
  }// } else if (request.action === 'convertSelection') {
  //   convertSelectionToHebrew();
  // }
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'convertSelection') {
        if (isOn) {
          translateText()
        }
  }
});


function translateText(){

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, function (response) {
      if (response && response.selectedText) {
        const selectedText = response.selectedText + ".";
        translate(selectedText).then(res=>{
          console.log(res.text);
          const translatedText = res.text;
          console.log(translatedText);
          chrome.tabs.sendMessage(tabs[0].id, { action: 'replaceSelection', translatedText});
        }).catch(err=>{
          console.log(err);
        })
      } else {
        console.error('Error: Invalid or missing response from content script');
      }
    });
  });

  
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url === "chrome://new-tab-page/") {
    chrome.tabs.executeScript(tabId, { file: "content.js" });
  }
});   