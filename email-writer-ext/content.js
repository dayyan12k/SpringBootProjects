console.log("WMAIL WRITER ASSISTANT-WORKING FINE");
function findToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role = "toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}



function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;

}

function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        'gmail_quote',
        '[role = "presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        } else {
            return null;
        }
    }
}




function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();
    const toolbar = findToolbar();
    if (!toolbar) {
        console.log("toolbar not exist");
    }
    else {
        console.log("toolbar exist - creating AI-Reply Button");
    }
    const button = createAIButton();
    button.classList.add('ai-reply-button');
    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating . . .';
            button.disabled = true;
            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional"
                })


            });

            if (!response.ok) {
                throw new Error('API REQUEST FAILED!');
            }
            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role = "textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            }
            else {
                console.log("not found");

            }
        } catch (error) {
            alert("failed generating reply");

        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild);
}



const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNode = Array.from(mutation.addedNodes);
        const hasComposeEmail = addedNode.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh , .btC, [role = "dialog"]') || node.querySelector('.aDh , .btC, [role = "dialog"]'))
        );
        if (hasComposeEmail) {
            console.log("compose window detected");
            setTimeout(injectButton, 500);
        }
    }

});


observer.observe(document.body, {
    childList: true,
    subtree: true

})