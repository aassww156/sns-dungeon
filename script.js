
const recordButton = document.getElementById("recordButton");
const snsChoice = document.getElementById("snsChoice");
const reasonChoice = document.getElementById("reasonChoice");
 
const xpDisplay = document.getElementById("xpDisplay");
const levelDisplay = document.getElementById("levelDisplay");
const historyList = document.getElementById("historyList");
const historyCount = document.getElementById("historyCount");
 
const monsterCard = document.getElementById("monsterCard");
const monsterImage = document.getElementById("monsterImage");
const monsterName = document.getElementById("monsterName");
const xpBarFill = document.getElementById("xpBarFill");
const xpProgressText = document.getElementById("xpProgressText");
 
// モンスターの進化データ
const monsters = [
    {
        level: 20,
        name: "ダークスライム",
        image: "images/slime_lv20.jfif"
    },
    {
        level: 10,
        name: "ピクシースライム",
       image: "images/slime_lv10.jfif"
    },
    {
        level: 5,
        name: "スライム（進化）",
       image: "images/slime_lv5.jfif"
    },
    {
        level: 3,
        name: "SNSスライム",
       image: "images/slime_lv3.jfif"
    }
];
 
// 保存データを読み込む
let savedData = null;
 
try {
    savedData = JSON.parse(
        localStorage.getItem("snsDungeonData") || "null"
    );
} catch (error) {
    savedData = null;
}
 
let xp = savedData && Number.isFinite(savedData.xp)
    ? savedData.xp
    : 320;
 
let records = savedData && Array.isArray(savedData.records)
    ? savedData.records
    : [];
 
let selectedSNS = "";
 
// データを保存
function saveData() {
    localStorage.setItem(
        "snsDungeonData",
        JSON.stringify({
            xp: xp,
            records: records
        })
    );
}
 
// XPからレベルを計算
function getLevel() {
    return Math.max(1, Math.floor(xp / 100));
}
 
// レベルに対応するモンスターを取得
function getMonster(level) {
    return monsters.find(function (monster) {
        return level >= monster.level;
    }) || monsters[monsters.length - 1];
}
 
// モンスターとXPバーを更新
function updateStatus(animate = false) {
    const level = getLevel();
    const monster = getMonster(level);
 
    levelDisplay.textContent = level;
    monsterName.textContent = monster.name;
    monsterImage.src = monster.image;
    monsterImage.alt = monster.name;
 
    xpDisplay.textContent = "XP " + xp;
 
    // 次の100XPまでの進捗
    const progress = xp % 100;
    xpBarFill.style.width = progress + "%";
 
    const remaining = 100 - progress;
 
    xpProgressText.textContent =
        "次のレベルまで " + remaining + " XP";
 
    // レベルアップ演出
    if (animate) {
        monsterCard.classList.remove("level-up");
        void monsterCard.offsetWidth;
        monsterCard.classList.add("level-up");
    }
}
 
// 記録履歴を表示
function renderHistory() {
    historyCount.textContent = "記録 " + records.length + "件";
    historyList.replaceChildren();
 
    if (records.length === 0) {
        const message = document.createElement("p");
        message.textContent = "まだ記録がありません。";
        historyList.appendChild(message);
        return;
    }
 
    records.forEach(function (record) {
        const item = document.createElement("div");
        item.className = "history-item";
 
        const date = document.createElement("p");
        date.className = "history-date";
        date.textContent = record.date;
 
        const sns = document.createElement("h3");
        sns.textContent = record.sns;
 
        const reason = document.createElement("p");
        reason.textContent = "理由：" + record.reason;
 
        const earnedXP = document.createElement("p");
        earnedXP.textContent = "+10 XP";
 
        item.append(date, sns, reason, earnedXP);
        historyList.appendChild(item);
    });
}
 
// 記録開始
recordButton.addEventListener("click", function () {
    snsChoice.classList.remove("hidden");
    reasonChoice.classList.add("hidden");
});
 
// SNSを選択
document.querySelectorAll(".sns-button").forEach(function (button) {
    button.addEventListener("click", function () {
        selectedSNS = button.dataset.sns;
 
        snsChoice.classList.add("hidden");
        reasonChoice.classList.remove("hidden");
    });
});
 
// 理由を選択して記録
document.querySelectorAll(".reason-button").forEach(function (button) {
    button.addEventListener("click", function () {
        const selectedReason = button.dataset.reason;
 
        const oldLevel = getLevel();
 
        // 履歴に追加
        records.unshift({
            date: new Date().toLocaleString("ja-JP"),
            sns: selectedSNS,
            reason: selectedReason
        });
 
        // XPを10加算
        xp += 10;
 
        const newLevel = getLevel();
 
        // 保存・画面更新
        saveData();
        updateStatus(newLevel > oldLevel);
        renderHistory();
 
        reasonChoice.classList.add("hidden");
 
        if (newLevel > oldLevel) {
            alert(
                "レベルアップ！\n" +
                "Lv." + oldLevel + " → Lv." + newLevel
            );
        } else {
            alert(
                "記録完了！\n" +
                "SNS：" + selectedSNS + "\n" +
                "理由：" + selectedReason + "\n" +
                "+10 XP"
            );
        }
    });
});
 
// 起動時に保存データを表示
updateStatus();
renderHistory();