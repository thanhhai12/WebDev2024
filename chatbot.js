// Toggle the left side navigation
function toggleNav() {
    var nav = document.getElementById("side-nav");
    nav.style.width = nav.style.width === "250px" ? "0" : "250px";
}

// Open the right chatbot sidenav
function openChatbot() {
    var chatbotNav = document.getElementById("chatbot-nav");
    chatbotNav.style.width = "300px";
    
    // Hide the "Chat with me!" button
    var chatbotBtn = document.querySelector(".chatbot-btn");
    chatbotBtn.style.display = "none";
}

// Close the chatbot sidenav
function closeChatbot() {
    var chatbotNav = document.getElementById("chatbot-nav");
    chatbotNav.style.width = "0";
    
    // Show the "Chat with me!" button again
    var chatbotBtn = document.querySelector(".chatbot-btn");
    chatbotBtn.style.display = "block";
}

// Send a message to the chatbot
function sendMessage() {
    var userInput = document.getElementById('user-input').value;
    if (userInput.trim() === "") return;

    var chatbotContent = document.getElementById('chatbot-content');

    // Add user message
    var userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.textContent = userInput;
    chatbotContent.appendChild(userMessage);

    // Scroll to the bottom
    chatbotContent.scrollTop = chatbotContent.scrollHeight;

    // Clear input field
    document.getElementById('user-input').value = "";

    // Process the user's message
    setTimeout(function() {
        var botMessage = document.createElement('div');
        botMessage.className = 'bot-message';

        // Example of basic responses
        if (userInput.toLowerCase().includes("hello")) {
            botMessage.textContent = "Hi there! How can I help you?";
        } else if (userInput.toLowerCase().includes("help")) {
            botMessage.textContent = "Sure! I'm here to assist you. What do you need help with?";
        } else {
            botMessage.textContent = "Sorry, I didn't understand that. Can you ask something else?";
        }

        chatbotContent.appendChild(botMessage);
        chatbotContent.scrollTop = chatbotContent.scrollHeight;
    }, 1000); // Simulate response delay
}
