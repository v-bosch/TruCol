var editor;
function loaded() {
    
    var initialValue = "pragma solidity";

    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        theme: "solidity",
        matchBrackets: true,
        indentUnit: 4,
        lineNumbers: true,
        tabSize: 8,
        indentWithTabs: true,
        mode: "text/x-solidity",
        value: initialValue
      });
}

// function toggleCode() {
//     let button = document.getElementById("toggleCode");
//     var codeMirror = document.getElementById("CodeMirror");
//     console.log(codeMirror.style);
//     if (button.innerText === "Show ") {
//         button.innerText = "Hide";
//     } else {
//         button.innerText = "Show";
//     }
// }
// document.getElementById("toggleCode").onclick = 
document.addEventListener("DOMContentLoaded", loaded, false);

