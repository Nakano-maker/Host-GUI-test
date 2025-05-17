const presetContainer = document.getElementById("presetContainer");
const pvwBox = document.querySelector(".pvw");
const colorPicker = document.getElementById("colorPicker");
const colorDisplay = document.getElementById("colorDisplay");

// **カラーピッカーの変更時にPVWへ適用**
colorPicker.addEventListener("input", () => {
    const selectedColor = colorPicker.value;
    pvwBox.style.backgroundColor = selectedColor;
    colorDisplay.style.backgroundColor = selectedColor; // 選択中の色を表示
});

// **カラープリセットのボタン生成**
const presetColors = [
    { color: "rgb(255,0,0)" },  // 赤
    { color: "rgb(0,255,0)" },  // 緑
    { color: "rgb(0,0,255)" },  // 青
    { color: "rgb(255,255,0)" }, // 黄色
    { color: "rgb(128,0,128)" }, // 紫
    { color: "rgb(0,255,255)" }, // 水色
    { color: "rgb(255,165,0)" }, // オレンジ
    { color: "rgb(255,192,203)" }, // ピンク
    { color: "rgb(255,255,255)" }, // 白
    { color: "rgb(0,0,0)" }, // 黒
    { color: "rgb(128,128,128)" }, // グレー
    { color: "rgb(144,238,144)" } // ライトグリーン
];

// **プリセットボタンを生成**
presetColors.forEach((preset) => {
    let button = document.createElement("button");
    button.className = "preset";
    button.style.backgroundColor = preset.color;
    button.setAttribute("data-color", preset.color);

    button.addEventListener("click", () => {
        pvwBox.style.backgroundColor = preset.color; // **PVWに適用（プリセット優先）**
        colorPicker.value = preset.color; // **カラーピッカーに同期**
        colorDisplay.style.backgroundColor = preset.color; // **選択中の色表示**
    });

    presetContainer.appendChild(button);
});

// pvw pgm cut AUTO の処理だよーーーん
//　ここはGTP生成
document.getElementById("cutButton").addEventListener("click", () => {
    let pvwBox = document.querySelector(".pvw");
    let pgmBox = document.querySelector(".pgm");

    let pvwColor = window.getComputedStyle(pvwBox).backgroundColor;
    let pgmColor = window.getComputedStyle(pgmBox).backgroundColor;

   
    // PVW ↔ PGM の色を交換
    pgmBox.style.backgroundColor = pvwColor;
    pvwBox.style.backgroundColor = pgmColor;

    addLogEntry(pvwColor, "CUT", "N/A", true);
});

document.getElementById("autoButton").addEventListener("click", () => {
    let pgmBox = document.querySelector(".pgm");
    let pvwBox = document.querySelector(".pvw");
    let fadeTime = parseFloat(document.getElementById("fadeTimeDisplay").textContent) * 1000; // 秒→ミリ秒変換

    let pvwColor = window.getComputedStyle(pvwBox).backgroundColor;
    let pgmColor = window.getComputedStyle(pgmBox).backgroundColor;

   

    let step = 0.05;
    let interval = fadeTime / (1 / step); 
    let opacity = 0;

    // フェード用オーバーレイを作成（PVW → PGM）
    let fadeOverlayPGM = document.createElement("div");
    fadeOverlayPGM.style.position = "absolute";
    fadeOverlayPGM.style.width = "100%";
    fadeOverlayPGM.style.height = "100%";
    fadeOverlayPGM.style.backgroundColor = pvwColor;
    fadeOverlayPGM.style.opacity = "0";
    fadeOverlayPGM.style.transition = `opacity ${fadeTime / 1000}s linear`;
    pgmBox.appendChild(fadeOverlayPGM);

    // フェード用オーバーレイを作成（PGM → PVW）
    let fadeOverlayPVW = document.createElement("div");
    fadeOverlayPVW.style.position = "absolute";
    fadeOverlayPVW.style.width = "100%";
    fadeOverlayPVW.style.height = "100%";
    fadeOverlayPVW.style.backgroundColor = pgmColor;
    fadeOverlayPVW.style.opacity = "0";
    fadeOverlayPVW.style.transition = `opacity ${fadeTime / 1000}s linear`;
    pvwBox.appendChild(fadeOverlayPVW);

    // フェード処理開始
    let fadeInterval = setInterval(() => {
        opacity += step;
        fadeOverlayPGM.style.opacity = opacity;
        fadeOverlayPVW.style.opacity = opacity;

        if (opacity >= 1) {
            clearInterval(fadeInterval);
            pgmBox.style.backgroundColor = pvwColor;
            pvwBox.style.backgroundColor = pgmColor;
            pgmBox.removeChild(fadeOverlayPGM);
            pvwBox.removeChild(fadeOverlayPVW);
        }
    }, interval);
});


// FADETIME 調節処理

function adjustFadeTime(change) {
    let fadeTimeDisplay = document.getElementById("fadeTimeDisplay");
    let fadeTime = parseFloat(fadeTimeDisplay.textContent);

    fadeTime = Math.max(0.05, fadeTime + change); // 最小値0.05sを維持
    fadeTimeDisplay.textContent = fadeTime.toFixed(2) + "s";
}

document.getElementById("increaseFade").addEventListener("mousedown", () => {
    let button = document.getElementById("increaseFade");
    button.style.backgroundColor = "rgba(255,255,255,0.5)"; // 透明感を持たせる
    fadeInterval = setInterval(() => adjustFadeTime(0.05), 100);
});

document.getElementById("decreaseFade").addEventListener("mousedown", () => {
    let button = document.getElementById("decreaseFade");
    button.style.backgroundColor = "rgba(255,255,255,0.5)";
    fadeInterval = setInterval(() => adjustFadeTime(-0.05), 100);
});

document.addEventListener("mouseup", () => {
    clearInterval(fadeInterval);
    document.getElementById("increaseFade").style.backgroundColor = "";
    document.getElementById("decreaseFade").style.backgroundColor = "";
});



//透明度調節
document.getElementById("masterDimmer").addEventListener("input", (event) => {
    let dimmerValue = event.target.value;
    document.querySelector(".pgm").style.opacity = dimmerValue;
});

//CUT AUTOのログ反映
//
//
//
function addLogEntry(color, action, fadeTime, success) {
    let logList = document.getElementById("logList");
    let logEntry = document.createElement("li");
    logEntry.textContent = `${color} - ${action} - ${fadeTime}s - ${success}`;
    logList.appendChild(logEntry);

        // **リストの先頭に追加**
    logList.prepend(logEntry);

}



// AUTOボタン
document.getElementById("autoButton").addEventListener("click", () => {
    let pgmBox = document.querySelector(".pgm");
    let pvwBox = document.querySelector(".pvw");
    let fadeTime = parseFloat(document.getElementById("fadeTimeDisplay").textContent);

    let pvwColor = window.getComputedStyle(pvwBox).backgroundColor;
    let pgmColor = window.getComputedStyle(pgmBox).backgroundColor;

    let step = 0.05;
    let interval = fadeTime * 1000 / (1 / step); 
    let opacity = 0;

    let fadeOverlayPGM = document.createElement("div");
    fadeOverlayPGM.style.position = "absolute";
    fadeOverlayPGM.style.width = "100%";
    fadeOverlayPGM.style.height = "100%";
    fadeOverlayPGM.style.backgroundColor = pvwColor;
    fadeOverlayPGM.style.opacity = "0";
    fadeOverlayPGM.style.transition = `opacity ${fadeTime}s linear`;
    pgmBox.appendChild(fadeOverlayPGM);

    let fadeOverlayPVW = document.createElement("div");
    fadeOverlayPVW.style.position = "absolute";
    fadeOverlayPVW.style.width = "100%";
    fadeOverlayPVW.style.height = "100%";
    fadeOverlayPVW.style.backgroundColor = pgmColor;
    fadeOverlayPVW.style.opacity = "0";
    fadeOverlayPVW.style.transition = `opacity ${fadeTime}s linear`;
    pvwBox.appendChild(fadeOverlayPVW);

    let fadeInterval = setInterval(() => {
        opacity += step;
        fadeOverlayPGM.style.opacity = opacity;
        fadeOverlayPVW.style.opacity = opacity;

        if (opacity >= 1) {
            clearInterval(fadeInterval);
            pgmBox.style.backgroundColor = pvwColor;
            pvwBox.style.backgroundColor = pgmColor;
            pgmBox.removeChild(fadeOverlayPGM);
            pvwBox.removeChild(fadeOverlayPVW);
        }
    }, interval);

    addLogEntry(pvwColor, "AUTO", fadeTime.toFixed(2), true);
});

// Render Serverのping値取得
function checkRenderServer() {
    fetch("google.co.jp")
        .then(response => response.json())
        .then(data => {
            addLogEntry("RenderServer Ping", "PING", "3s", data.success);
        })
        .catch(error => {
            addLogEntry("RenderServer Ping", "PING", "3s", false);
        });
}

// 3秒ごとにRender Serverを監視
setInterval(checkRenderServer, 3000);

// Render Serverへの接続成功ログ
function logRenderServerConnection(success) {
    addLogEntry("RenderServer Connection", "CONNECT", "N/A", success);
}

// 重大エラーのログ
function logRenderServerError(errorMessage) {
    addLogEntry(`ERROR: ${errorMessage}`, "CRITICAL", "N/A", false);
}


//flash処理
document.addEventListener("DOMContentLoaded", function() {
    let bpm = 80;
    let bpmInterval;

    function updateBPMDisplay() {
        document.getElementById("bpmDisplay").textContent = `${bpm} BPM`;
    }

    function changeBPM(amount) {
        bpm = Math.max(10, Math.min(300, bpm + amount));
        updateBPMDisplay();
    }

    // 長押し対応（BPM変更）
    function startBPMChange(amount, buttonId) {
        let button = document.getElementById(buttonId);
        button.style.backgroundColor = "rgba(255,255,255,0.5)"; // 背景色を薄くする
        changeBPM(amount);
        bpmInterval = setInterval(() => changeBPM(amount), 100);
    }

    function stopBPMChange(buttonId) {
        clearInterval(bpmInterval);
        document.getElementById(buttonId).style.backgroundColor = ""; // 元の色に戻す
    }

    document.getElementById("increaseBPM").addEventListener("mousedown", function() {
        startBPMChange(1, "increaseBPM");
    });
    document.getElementById("decreaseBPM").addEventListener("mousedown", function() {
        startBPMChange(-1, "decreaseBPM");
    });

    document.addEventListener("mouseup", function() {
        stopBPMChange("increaseBPM");
        stopBPMChange("decreaseBPM");
    });

    // FLASHボタンの動作改善
    let flashing = false;
    let flashInterval;

    document.getElementById("flashButton").addEventListener("click", function() {
        let flashButton = document.getElementById("flashButton");
        let pgmBox = document.querySelector(".pgm");

        if (flashing) {
            clearInterval(flashInterval);
            flashing = false;
            flashButton.style.backgroundColor = "#000000";
            pgmBox.style.visibility = "visible";
        } else {
            flashing = true;
            flashButton.style.backgroundColor = "blue";
            flashInterval = setInterval(() => {
                pgmBox.style.visibility = pgmBox.style.visibility === "hidden" ? "visible" : "hidden";
            }, (60 / bpm) * 1000);
        }
    });

    updateBPMDisplay();
});


