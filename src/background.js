console.log('Background script loaded');

import { translate } from '@vitalets/google-translate-api';

// background.js
let isOn = false;
let lang1 = 'iw'
let lang2 = 'en'


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getMode') {
    sendResponse({ isOn, lang1, lang2 });
  }else if (request.action === 'setMode') {
    isOn = request.isOn;
  } else if (request.action === "setLang1"){
    lang1 = request.selectedLang1;
  } else if (request.action === "setLang2"){
    lang2 = request.selectedLang2;
  }
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
        const selectedText = response.selectedText
        detectLanguage(selectedText).then(detectRes => {
          console.log("de11");
          console.log(detectRes);
          const sourceLang = detectRes.raw.src; // Detected language
          const targetLang = sourceLang === lang1 ? lang2 : lang1; // Determine the target language
          console.log(sourceLang);
          console.log(targetLang);
          // Translate the text to the target language
          translate(selectedText, { from: sourceLang, to: targetLang }).then(res => {
            console.log(res);
            const translatedText = res.text;
            chrome.tabs.sendMessage(tabs[0].id, { action: 'replaceSelection', translatedText });
          }).catch(err => {
            console.error(err);
          });
        }).catch(err => {
          console.error(err);
        });
      } else {
        console.error('Error: Invalid or missing response from content script');
      }
    });
  });

  
}

// Function to detect language
function detectLanguage(text) {
  console.log("textDetection");
  console.log(text);
  return translate(text, { to: 'en' }); // Translate to English for language detection
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url === "chrome://new-tab-page/") {
    chrome.tabs.executeScript(tabId, { file: "content.js" });
  }
});   