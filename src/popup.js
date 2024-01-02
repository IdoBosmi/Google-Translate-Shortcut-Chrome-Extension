document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({ action: 'getHebrewMode' }, function (response) {
      const isOn = response.isOn || false;
      updateToggleState(isOn);
    });
  
    document.getElementById('toggleInput').addEventListener('change', function () {
      const isOn = this.checked;
      updateToggleState(isOn);
      chrome.runtime.sendMessage({ action: 'setHebrewMode', isOn });
    });
  
    function updateToggleState(isOn) {
        const input = document.getElementById('toggleInput');
        input.checked = isOn;
    }
  });
  