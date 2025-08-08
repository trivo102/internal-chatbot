const chatBox = document.getElementById("chat-box");

function appendMessage(content, sender) {
    const div = document.createElement("div");
    div.className = "message " + sender;
    div.innerText = content;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    input.value = "";
    appendMessage("...", "bot");

    try {
        const res = await fetch("https://mitivo.tino.page/webhook/ac873734-0e73-46cc-b580-c374863fe93b", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ chatInput: message }),
        });

        const rawData = await res.json();
        const jsonStr = rawData[0]?.output || '[]';
        const jsonMessage = rawData[0]?.message || '';

        document.querySelector(".bot:last-child").remove(); // remove loading

        if (jsonMessage) {
            appendMessage(jsonMessage, "bot");
            return;
        }

        let parsedArray = [];
        try {
            parsedArray = JSON.parse(jsonStr); // parse chuỗi JSON thành mảng object
        } catch (e) {
            console.error("Lỗi parse JSON:", e);
        }

        parsedArray.forEach((item, index) => {
            let formatted = JSON.stringify(item, null, 4).replace(/[{}\[\]]/g, "");
            appendMessage(formatted.trim(), "bot");
        });
    } catch (err) {
        document.querySelector(".bot:last-child").remove();
        appendMessage("Lỗi khi kết nối API", "bot");
    }
}

document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
