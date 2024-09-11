document.addEventListener('DOMContentLoaded', function () {
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const currentPriceElement = document.getElementById('current-price');
  const storedInfo = document.getElementById('stored-info');
  const payNowButton = document.getElementById('pay-now-button');

  let basePrice = 20000; // Starting price in INR
  let minPrice = 15000;  // Minimum price the bot can accept
  let currentPrice = basePrice; // The price to negotiate from
  let acceptedPrice = null; // Store the accepted price

  // Initial welcome messages
  const initialMessages = [
    'Welcome to the negotiation chatbot!',
    'The starting price is ₹20,000.',
    'Please type your offer, request a discount, or type "Accept Price" to accept the current price.'
  ];

  // Display initial messages
  initialMessages.forEach(message => addMessage(message, false));

  function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', isUser ? 'user-message' : 'bot-message');
    messageElement.textContent = message;

    if (message.startsWith("Current Price:")) {
      messageElement.innerHTML = `<strong>${message}</strong>`;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message

    // Update current price display
    currentPriceElement.textContent = `Current Price: ₹${currentPrice.toFixed(2)}`;
  }

  function botResponse(userMessage) {
    const userOffer = parseFloat(userMessage.replace(/[^0-9.]/g, ''));

    if (userMessage.toLowerCase() === 'accept price') {
      if (!acceptedPrice) {
        acceptedPrice = currentPrice;
        storedInfo.textContent = `Accepted Price: ₹${acceptedPrice.toFixed(2)}`;
        return `You have accepted the price of ₹${currentPrice.toFixed(2)}.`;
      } else {
        return `The price has already been accepted: ₹${acceptedPrice.toFixed(2)}.`;
      }
    }

    if (!isNaN(userOffer)) {
      if (userOffer >= currentPrice) {
        return `You've offered ₹${userOffer.toFixed(2)}, which is acceptable.`;
      } else {
        const newPrice = Math.max(currentPrice - (currentPrice - minPrice) * 0.2, minPrice);
        currentPrice = newPrice;
        return `Your offer of ₹${userOffer.toFixed(2)} is too low. The best I can offer is ₹${currentPrice.toFixed(2)}.`;
      }
    } else if (userMessage.toLowerCase().includes('discount')) {
      const discount = 0.1; // 10% discount
      const discountedPrice = currentPrice - (currentPrice * discount);
      currentPrice = discountedPrice;
      return `Based on your request, the discounted price is now ₹${discountedPrice.toFixed(2)}.`;
    } else {
      return "I didn't understand that. Please provide your offer, request a discount, or type 'Accept Price' to accept the current price.";
    }
  }

  function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
      addMessage(userMessage, true);
      const response = botResponse(userMessage);
      addMessage(response, false);
      userInput.value = '';
      
      // Show Accept Price button after bot response
      const acceptButton = document.createElement('button');
      acceptButton.textContent = 'Accept Price';
      acceptButton.classList.add('accept-button');
      acceptButton.addEventListener('click', function () {
        if (!acceptedPrice) {
          acceptedPrice = currentPrice;
          storedInfo.textContent = `Accepted Price: ₹${acceptedPrice.toFixed(2)}`;
          addMessage(`You have accepted the price of ₹${currentPrice.toFixed(2)}.`, false);
          userInput.disabled = true;
          sendButton.disabled = true;
          payNowButton.style.display = 'block'; // Show the Pay Now button
        }
      });
      chatBox.appendChild(acceptButton);
    }
  }

  sendButton.addEventListener('click', handleUserInput);

  userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  });

  // Hide Pay Now button initially
  payNowButton.style.display = 'none';
});
