// 点击 surpriseButton 后显示隐藏的 surprise div，并显示"点击14次"按钮
databaseURL: "https://console.firebase.google.com/project/birthdayyige/database/birthdayyige-default-rtdb/data/~2F?hl=zh-cn"
document.getElementById("surpriseButton").addEventListener("click", function() {
    var surpriseDiv = document.getElementById("surprise");

    // 如果 surprise 是隐藏的，就显示出来
    if (surpriseDiv.classList.contains("hidden")) {
        surpriseDiv.classList.remove("hidden");
        document.getElementById("click14Button").classList.remove("hidden");
    } else {
        surpriseDiv.classList.add("hidden");
    }

    // 先设置一个初始背景色
    document.body.style.backgroundColor = "#2C2C2C";
    document.body.style.transition = "background-color 2s ease-in-out";

    // 然后开始背景颜色变化
    setInterval(changeBackgroundColor, 3000);
});

var clickCount = 0;
var isAudioMode = false; // 标记当前是否为音频模式

// 监听 click14Button 的点击事件
document.getElementById("click14Button").addEventListener("click", function() {
    clickCount++;

    if (clickCount >= 25 && !isAudioMode) {
        // 切换到音频模式
        switchToAudioMode();
        isAudioMode = true;
    }
});

// 切换到音频模式的函数
function switchToAudioMode() {
    // 隐藏视频
    var video = document.getElementById("birthdayVideo");
    video.pause();
    video.classList.add("hidden");

    // 播放音频
    var audio = document.getElementById("audioSurprise");
    audio.play();

    // 更新控制按钮的文本和功能
    updateControlButtons();
}

// 更新控制按钮的函数
function updateControlButtons() {
    // 获取控制按钮容器
    var controlsDiv = document.querySelector('.controls');

    // 清空现有的按钮
    controlsDiv.innerHTML = '';

    // 创建新的音频控制按钮
    var playAudioBtn = document.createElement('button');
    playAudioBtn.textContent = '播放音乐';
    playAudioBtn.onclick = playAudio;

    var pauseAudioBtn = document.createElement('button');
    pauseAudioBtn.textContent = '暂停音乐';
    pauseAudioBtn.onclick = pauseAudio;

    var restartAudioBtn = document.createElement('button');
    restartAudioBtn.textContent = '重新播放';
    restartAudioBtn.onclick = restartAudio;

    var stopAudioBtn = document.createElement('button');
    stopAudioBtn.textContent = '停止音乐';
    stopAudioBtn.onclick = stopAudio;

    // 添加按钮到控制容器
    controlsDiv.appendChild(playAudioBtn);
    controlsDiv.appendChild(pauseAudioBtn);
    controlsDiv.appendChild(restartAudioBtn);
    controlsDiv.appendChild(stopAudioBtn);
}

// 音频控制函数
function playAudio() {
    var audio = document.getElementById("audioSurprise");
    audio.play();
    console.log("音乐开始播放");
}

function pauseAudio() {
    var audio = document.getElementById("audioSurprise");
    audio.pause();
    console.log("音乐已暂停");
}

function stopAudio() {
    var audio = document.getElementById("audioSurprise");
    audio.pause();
    audio.currentTime = 0;
    console.log("音乐已停止");
}

function restartAudio() {
    var audio = document.getElementById("audioSurprise");
    audio.currentTime = 0;
    audio.play();
    console.log("音乐重新开始播放");
}

// 视频控制函数（在切换到音频模式前使用）
function playVideo() {
    var video = document.getElementById("birthdayVideo");
    video.muted = false;
    video.volume = 1.0;
    video.play();
}

function stopVideo() {
    var video = document.getElementById("birthdayVideo");
    video.pause();
}

function restartVideo() {
    var video = document.getElementById("birthdayVideo");
    video.currentTime = 0;
    video.play();
}

// 改进的背景颜色变化函数 - 灰橙色调
function changeBackgroundColor() {
    // 灰橙色调色板
    var colors = [
        "#2C2C2C", // 深灰
        "#3A3A3A", // 中灰
        "#4A4A4A", // 浅灰
        "#5D4037", // 棕灰
        "#E67E22", // 橙色
        "#D35400", // 深橙色
        "#F39C12", // 亮橙色
        "#BF360C", // 深红橙
        "#34495E", // 蓝灰色
        "#2C3E50"  // 深蓝灰
    ];

    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;

    // 在控制台输出当前颜色，方便调试
    console.log("背景颜色变为:", randomColor);
}

// 删除所需的密码
const adminPassword = "2507";

// 生日愿望提交
document.getElementById("submitWish").addEventListener("click", function() {
    var wishInput = document.getElementById("wishInput");
    var wishText = wishInput.value.trim();
    if (wishText !== "") {
        saveWishToFirebase(wishText);
        wishInput.value = "";
    }
});

// 从 Firebase 加载愿望
window.onload = function() {
    loadWishesFromFirebase();
};

// 保存愿望到 Firebase
function saveWishToFirebase(wishText) {
    const timestamp = new Date().toISOString();
    db.ref("wishes").push({
        text: wishText,
        time: timestamp
    });
}

// 从 Firebase 实时加载愿望
function loadWishesFromFirebase() {
    db.ref("wishes").on("value", function(snapshot) {
        const wishesContainer = document.getElementById("wishes");
        wishesContainer.innerHTML = ""; // 清空旧内容

        snapshot.forEach(function(childSnapshot) {
            const wishData = childSnapshot.val();
            const wishKey = childSnapshot.key;
            addWishToWall(wishData.text, wishData.time, wishKey);
        });
    });
}

// 将愿望显示到墙上
function addWishToWall(wishText, wishTime, wishKey) {
    var wishDiv = document.createElement("div");
    wishDiv.className = "wish";
    var timestamp = new Date(wishTime).toLocaleString();

    wishDiv.innerHTML = `
        <div class="wish-content">${wishText}</div>
        <div class="wish-time">${timestamp}</div>
    `;

    var deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    deleteButton.style.marginLeft = "10px";
    deleteButton.onclick = function() {
        var enteredPassword = prompt("Please enter code to delete this wish:");
        if (enteredPassword === adminPassword) {
            deleteWishFromFirebase(wishKey);
            alert("This wish is deleted.");
        } else {
            alert("This code is wrong, you can't delete it!");
        }
    };

    wishDiv.appendChild(deleteButton);
    document.getElementById("wishes").appendChild(wishDiv);
}

// 从 Firebase 删除愿望
function deleteWishFromFirebase(wishKey) {
    db.ref("wishes/" + wishKey).remove();
}
