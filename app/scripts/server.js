let userid = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMDFKVktLRVoxVzA5WDJUMDFGTVlWV000UlciLCJpYXQiOjE3NDc2MzU4OTV9.JliGDRaB-9SDoc-9wDpnxxro6WdVCrEHDAcpmn3ZAtk";
let we = "";
let conversationid = "";

function generateConversationId() {
    return 'conv_' + Math.random().toString(36).substr(2, 9);
}

async function initialize() {
    try {
        conversationid = generateConversationId();

        let headers = {
            method: "POST",
            headers: {
                accept: "application/json",
                "x-user-key": userid,
                'Content-Type': 'application/json',
                'Access-Control-Request-Method': 'POST',
                'Origin': 'https://wheat-paint-bartione.glitch.me'
            },
            body: JSON.stringify({ name: "test" })
        };

        const userResponse = await sendRequest(/users/, headers);
        if (!userResponse.success) throw new Error("Ошибка при получении пользователя");

        we = userResponse.data.user.id;

        headers = {
            method: "POST",
            headers: {
                accept: "application/json",
                "x-user-key": userid,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: conversationid })
        };

        const convoResponse = await sendRequest(`/conversations/get-or-create`, headers);
        if (!convoResponse.success) throw new Error("Ошибка при создании беседы");

        conversationid = convoResponse.data.conversation.id;

        return { userid, conversationid, we };
    } catch (error) {
        console.error("Ошибка инициализации:", error);
        return { success: false };
    }
}

const URL = "https://chat.botpress.cloud/dfdd93ed-3222-4dd4-a554-f09ea6d89c9a"; 

async function submit(question, userid, conversationid) {
    if (!question) {
        return { status: false, ans: "Question is empty" };
    }

    let headers = {
        method: "POST",
        headers: {
            accept: "application/json",
            "x-user-key": userid,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            payload: { type: 'text', text: question },
            conversationId: conversationid
        })
    };

    const response = await sendRequest("/messages", headers);
    if (response.success) {
        return { status: true, ans: response.data };
    } else {
        return { status: false, ans: response.data };
    }
}

async function sendRequest(url_add, options) {
    try {
        const response = await fetch(URL + url_add, options);
        const data = await response.json();
        if (response.status === 200) {
            return { success: true, data };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error("Error in sendRequest:", error);
        return { success: false };
    }
}

async function fetchMessages(conversationid, userid) {
    try {
        let headers = {
            method: 'GET',
            headers: { accept: 'application/json', 'x-user-key': userid }
        };

        const messagesResponse = await sendRequest(`/conversations/${conversationid}/messages`, headers);
        if (!messagesResponse.success) throw new Error("Ошибка при получении сообщений");

        const messages = messagesResponse.data.messages;
        messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        console.log(messages)

        if (messages.length > 0) {
            const botId = 'user_01JVKK7TQYJM5YH8PE6X991EZF'
            const botMessages = messages.filter(msg => msg.userId == botId);
            if (botMessages.length > 0) {
                const lastBotMessage = botMessages[botMessages.length - 1].payload.text;
                return { st: true, ms: { answer: lastBotMessage } };
            }
        }
        return { st: false };
    } catch (error) {
        console.error("Ошибка получения сообщений:", error);
        return { st: false };
    }
}