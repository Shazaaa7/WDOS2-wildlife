//It selects the elements in the document with the class and places it into constant
const headerBtn = document.querySelector('.headerBars');
const mobileNav = document.querySelector('.mobileNav');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeSpan = document.querySelector('.close');
const submitBtn = document.getElementById('submitBtn');
const logoutBtn = document.getElementById('logoutBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorDiv = document.getElementById('error');
const mainContent = document.querySelector('.main-content');
const editbutton = document.getElementById('editbtn');
const donebutton = document.getElementById('donebtn');

//declares the variable and initializes it to the variable
let isMobileNavOpen = false;

// an event listener is added listening to a click event. once clicked the provided function will be executed
headerBtn.addEventListener('click', () => {
    isMobileNavOpen = !isMobileNavOpen;
    if (isMobileNavOpen) {
        mobileNav.style.display = 'flex';
    } else {
        mobileNav.style.display = 'none';
    }
});

// adds an event listener to the submit button, 
submitBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission
    authenticateUser(); // calling the authenticate user function to check credentials entered
});

// adds an event listener to the log in button, once clicked it will execute
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block'; // the style here is blocked, when the login button is clicked it will display
})

// adds an event listener to the log out button,  once clicked it will execute
logoutBtn.addEventListener('click', () => {
    logoutUser(); 
    alert('Logout successful!'); // displays message to saying logout was succcessful 
});

closeSpan.onclick = () => {
    loginModal.style.display = 'none';
};

editbutton.addEventListener('click', convertElements);// adds an event listener listening to click, once clicked convertElements function element will be executed

donebutton.addEventListener('click', revertElementsAndSaveContent);// adds an event listener listening to click, once clicked revertElementsAndSaveContent function element will be executed

window.addEventListener('DOMContentLoaded', () => { //adds an event listener listening to click, once clicked the arrow function  will be executed
    LoadPageData(); 
    updateUserStatus();
});

// Fetching and Loading JSON content---->in the local storage
fetchAndStoreJSON('one.json ', 'webContent');
fetchAndStoreJSON('userdata.json', 'userInfo');

// Hide

function authenticateUser () {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const userData= JSON.parse(localStorage.getItem('userInfo'));
    const users = userData.users

    const isValidUser = users.some(user => user.username === username && user.password === password);
    if (isValidUser) {
        sessionStorage.setItem('userLoggedIn', "true");
        alert('Authentication successful! Welcome, ' + username + '!');
        loginModal.style.display = 'none';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        editbutton.style.display = 'block';
    } else {
        errorDiv.style.display = 'block';
    }
}

function logoutUser () {
    sessionStorage.removeItem('userLoggedIn')
    loginBtn.style.display = 'flex';
    logoutBtn.style.display = 'none';
    editbutton.style.display = 'none';
    donebutton.style.display = 'none';
}

function updateUserStatus() {
    let isLoggedIn = sessionStorage.getItem('userLoggedIn');

    if (isLoggedIn === "true") {
        loginBtn.style.display = "none";
        editbutton.style.display = "block";
        logoutBtn.style.display = "block";
    } else {
        loginBtn.style.display = "block";
        editbutton.style.display = "none";
        donebutton.style.display = "none";
        logoutBtn.style.display = "none";
    }
}

function fetchAndStoreJSON(jsonFile, storageKey) {
    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem(storageKey, JSON.stringify(data));
            console.log(`JSON data fetched from ${jsonFile} and stored in local storage with key ${storageKey}`);
        })
        .catch(error => console.error('There was a problem fetching the JSON:', error));
}

function LoadPageData (){
    // Retrieve data from localStorage
    const data = JSON.parse(localStorage.getItem('webContent'));
    const currPage = getCurrentPage();

    if (data) {
        // Get the data for the current page
        const pageData = data[currPage];

        // Loop through each section in the page data
        for (const sectionKey in pageData) {
            const sectionData = pageData[sectionKey];

            // Loop through each element in the section data
            for (const elementKey in sectionData) {
                const elementContent = sectionData[elementKey];
                const element = document.getElementById(elementKey);

                // Check if element exists in HTML and content is not empty
                if (element && elementContent) {
                    // Check if element is a list
                    if (element.tagName === 'UL') {
                        // If element is a list, loop through each item in the array
                        elementContent.forEach(item => {
                            const li = document.createElement('li');
                            li.textContent = item;
                            element.appendChild(li);
                        });
                    } else {
                        // Otherwise, set textContent directly
                        element.textContent = elementContent;
                    }
                }
            }
        }
    }
}

function getCurrentPage() {
    // Get the current URL
    const url = window.location.href;
  
    // Find the last '/' in the URL
    const lastSlashIndex = url.lastIndexOf('/');
  
    // Extract the page name from the URL
    let currentPage = url.substring(lastSlashIndex + 1);
  
    // Remove the '.html' extension if present
    currentPage = currentPage.replace('.html', '');
  
    return currentPage;
}

function convertElementToEditable(id) {
    const element = document.getElementById(id);
    
    if (element) {
        const tagName = element.tagName.toLowerCase();
        
        if (['h1', 'h2', 'h3'].includes(tagName)) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = element.textContent;
            
            // Copy attributes
            Array.from(element.attributes).forEach(attr => {
                input.setAttribute(attr.name, attr.value);
            });
            
            // Replace the element with input
            element.parentNode.replaceChild(input, element);
        } else if (['p', 'span'].includes(tagName)) {
            const textarea = document.createElement('textarea');
            textarea.value = element.textContent;
            
            // Copy attributes
            Array.from(element.attributes).forEach(attr => {
                textarea.setAttribute(attr.name, attr.value);
            });
            
            // Replace the element with textarea
            element.parentNode.replaceChild(textarea, element);
        } else if (tagName === 'ul') {
            const liElements = element.getElementsByTagName('li');
        
            Array.from(liElements).forEach(liElement => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = liElement.textContent;

                // Copy attributes
                Array.from(liElement.attributes).forEach(attr => {
                    input.setAttribute(attr.name, attr.value);
                });

                // Wrap input within a new li element
                const newLiElement = document.createElement('li');
                newLiElement.appendChild(input);

                // Replace the original li element with the new one
                liElement.parentNode.replaceChild(newLiElement, liElement);
            });
        } else {
            console.log('Element is not a supported type for conversion.');
        }
    } else {
        console.log('Element with id ' + id + ' not found.');
    }
}

function convertElements() {
    const currentPage = getCurrentPage();
    editbutton.style.display = 'none';
    donebutton.style.display = 'flex';

    // Check the current page and convert elements accordingly
    switch (currentPage) {
        case 'index':
            convertElementToEditable("indexS1H1");
            convertElementToEditable("indexS1P1");
            convertElementToEditable("indexS1P2");
            convertElementToEditable("indexS1P3");
            convertElementToEditable("indexS1H2");
            convertElementToEditable("indexS1H3");
            convertElementToEditable("indexbullet");
            convertElementToEditable("indexS1P4");
            convertElementToEditable("indexS1P5");
            convertElementToEditable("indexS2H1");
            convertElementToEditable("indexS2P1");
            convertElementToEditable("indexS2P2");
            convertElementToEditable("indexS2P3");
            convertElementToEditable("indexS2H2");
            convertElementToEditable("indexS2P4");
            convertElementToEditable("indexS2P5");
            convertElementToEditable("indexS2P6");
            convertElementToEditable("indexS2P7");
            convertElementToEditable("indexS2P8");
            convertElementToEditable("indexS2P9");
            convertElementToEditable("indexS2P10");
            
            break;
        case 'departmentofwildlifeconservation':
            convertElementToEditable("dwS1H1");
            convertElementToEditable("dwS1P1");
            convertElementToEditable("dwS2H1");
            convertElementToEditable("dwS2P1");
            convertElementToEditable("dwS3H1");
            convertElementToEditable("dwS3P1");
            convertElementToEditable("dwS4H1");
            convertElementToEditable("dwS4P1");

            break;
        // case 'endemic':
            // convertElementToEditable("endS1H1");
            // convertElementToEditable("endS1P1");
            
            // break;
        case 'introduction':
            convertElementToEditable("wiS1H1");
            convertElementToEditable("wiS1H2");
            convertElementToEditable("wiS1P1");
            convertElementToEditable("wiS2H1");
            convertElementToEditable("wiS2P1");
            convertElementToEditable("wiS3H1");
            convertElementToEditable("wiS3P1");
            convertElementToEditable("wiS4H1");
            convertElementToEditable("wiS4H2");
            convertElementToEditable("wiS4P1");
            convertElementToEditable("wiS5H1");
            convertElementToEditable("wiS5P1");
            convertElementToEditable("wiS6H1");
            convertElementToEditable("wiS6P1");
            
            break;
        case 'leopards':
            convertElementToEditable("leoS1H1");
            convertElementToEditable("leoS1H2");
            convertElementToEditable("leoS1P1");
            convertElementToEditable("leoS1H3");
            convertElementToEditable("leoS1H4");
            convertElementToEditable("leoS1P2");
            convertElementToEditable("leoS1H5");
            convertElementToEditable("leoS1P3");
            convertElementToEditable("leoS1H6");
            convertElementToEditable("leoS1P4");
            convertElementToEditable("leoS2H1");
            convertElementToEditable("leoS2H2");
            convertElementToEditable("leoS2P1");
            convertElementToEditable("leoS2H3");
            convertElementToEditable("leoS2P2");
            convertElementToEditable("leoS2H4");
            convertElementToEditable("leoS2H5");
            convertElementToEditable("leoS2P3");
            convertElementToEditable("leoS2H6");
            convertElementToEditable("leoS2P4");
            
            break;
        case 'wilpattu':
            convertElementToEditable("wilS1H1");
            convertElementToEditable("wilS1H2");
            convertElementToEditable("wilS1P1");
            convertElementToEditable("wilS2H1");
            convertElementToEditable("wilS2P1");
            convertElementToEditable("wilS2P2");
            convertElementToEditable("wilS2P3");
            convertElementToEditable("wilS2P4");
            convertElementToEditable("wilS2P5");
            convertElementToEditable("wilS2P6");
            convertElementToEditable("wilS2P7");
            convertElementToEditable("wilS2P8");
            convertElementToEditable("wilS2P9");
            convertElementToEditable("wilS2P10");
            convertElementToEditable("wilS2P11");
            convertElementToEditable("wilS2P12");
            convertElementToEditable("wilS3H1");
            convertElementToEditable("wilS3H2");
            convertElementToEditable("wilS3H3");
            
            break;
        case 'yala':
            convertElementToEditable("yalaS1H1");
            convertElementToEditable("yalaS1H2");
            convertElementToEditable("yalaS1P1");
            convertElementToEditable("yalaS2H1");
            convertElementToEditable("yalaS2p1");
            convertElementToEditable("yalas2p2");
            convertElementToEditable("yalas2p3");
            convertElementToEditable("yalas2p4");
            convertElementToEditable("yalas2p5");
            convertElementToEditable("yalas2p6");
            convertElementToEditable("yalas2p7");
            convertElementToEditable("yalas2p8");
            convertElementToEditable("yalas2p9");
            convertElementToEditable("yalas2p10");
            convertElementToEditable("yalas2p11");
            convertElementToEditable("yalas2p12");
            convertElementToEditable("yalaS2H2");
            convertElementToEditable("yalaS2H3");
            convertElementToEditable("yalaS2H4");
            
            break;
        default:
            console.log('No elements to convert on this page.');
            break;
    }
}

function revertEditableToElement(id) {
    const element = document.getElementById(id);

    if (element) {
        const tagName = element.tagName.toLowerCase();
        switch (tagName) {
            case 'input':
                const classNameInput = element.className;

                let newElementInput;
                switch (true) {
                    case classNameInput.includes('eh1'):
                        newElementInput = document.createElement('h1');
                        break;
                    case classNameInput.includes('eh2'):
                        newElementInput = document.createElement('h2');
                        break;
                    case classNameInput.includes('eh3'):
                        newElementInput = document.createElement('h3');
                        break;
                    default:
                        console.log('Invalid class name for input element.');
                        return;
                }

                // Restore attributes for input element
                Array.from(element.attributes).forEach(attr => {
                    newElementInput.setAttribute(attr.name, attr.value);
                });

                // Replace the input element with the new one
                element.parentNode.replaceChild(newElementInput, element);
                break;

            case 'textarea':
                const classNameTextarea = element.className;

                let newElementTextarea;
                switch (true) {
                    case classNameTextarea.includes('epara'):
                        newElementTextarea = document.createElement('p');
                        break;
                    case classNameTextarea.includes('espan'):
                        newElementTextarea = document.createElement('span');
                        break;
                    default:
                        console.log('Invalid class name for textarea element.');
                        return;
                }

                // Restore attributes for textarea element
                Array.from(element.attributes).forEach(attr => {
                    newElementTextarea.setAttribute(attr.name, attr.value);
                });

                // Replace the textarea element with the new one
                element.parentNode.replaceChild(newElementTextarea, element);
                break;
            case 'ul':
                const classNameUL = element.className;

                let newElementUL;
                switch(true) {
                    case classNameUL.includes('bullet-list'):
                        while (element.firstChild) {
                            element.removeChild(element.firstChild);
                        }
                    default:
                        console.log('Invalid class name for ul element.');
                        return;
                }
            default:
                console.log('Element is not a supported type for reversion.');
        }
    } else {
        console.log('Element with id ' + id + ' not found.');
    }
}


function revertElementsAndSaveContent() {
    const currentPage = getCurrentPage();
    const data = JSON.parse(localStorage.getItem('webContent'));
    editbutton.style.display = 'flex';
    donebutton.style.display = 'none';

    // Check the current page and convert elements accordingly
    switch (currentPage) {
        case 'index':
            data.index.indexSection1.indexS1H1 = document.getElementById("indexS1H1").value;
            data.index.indexSection1.indexS1P1 = document.getElementById("indexS1P1").value;
            data.index.indexSection1.indexS1P2 = document.getElementById("indexS1P2").value;
            data.index.indexSection1.indexS1P3 = document.getElementById("indexS1P3").value;
            data.index.indexSection1.indexS1H2 = document.getElementById("indexS1H2").value;
            data.index.indexSection1.indexS1H3 = document.getElementById("indexS1H3").value;
            const bulletItems = Array.from(document.getElementById('indexbullet').getElementsByTagName('input')).map(input => input.value.trim());
            data.index.indexSection1.indexbullet = bulletItems;
            data.index.indexSection1.indexS1P4 = document.getElementById("indexS1P4").value;
            data.index.indexSection1.indexS1P5 = document.getElementById("indexS1P5").value;
            data.index.indexSection2.indexS2H1 = document.getElementById("indexS2H1").value;
            data.index.indexSection2.indexS2P1 = document.getElementById("indexS2P1").value;
            data.index.indexSection2.indexS2P2 = document.getElementById("indexS2P2").value;
            data.index.indexSection2.indexS2P3 = document.getElementById("indexS2P3").value;
            data.index.indexSection2.indexS2H2 = document.getElementById("indexS2H2").value;
            data.index.indexSection2.indexS2P4 = document.getElementById("indexS2P4").value;
            data.index.indexSection2.indexS2P5 = document.getElementById("indexS2P5").value;
            data.index.indexSection2.indexS2P6 = document.getElementById("indexS2P6").value;
            data.index.indexSection2.indexS2P7 = document.getElementById("indexS2P7").value;
            data.index.indexSection2.indexS2P8 = document.getElementById("indexS2P8").value;
            data.index.indexSection2.indexS2P9 = document.getElementById("indexS2P9").value;
            data.index.indexSection2.indexS2P10 = document.getElementById("indexS2P10").value;
    
            revertEditableToElement("indexS1H1");
            revertEditableToElement("indexS1P1");
            revertEditableToElement("indexS1P2");
            revertEditableToElement("indexS1P3");
            revertEditableToElement("indexS1H2");
            revertEditableToElement("indexS1H3");
            revertEditableToElement("indexbullet");
            revertEditableToElement("indexS1P4");
            revertEditableToElement("indexS1P5");
            revertEditableToElement("indexS2H1");
            revertEditableToElement("indexS2P1");
            revertEditableToElement("indexS2P2");
            revertEditableToElement("indexS2P3");
            revertEditableToElement("indexS2H2");
            revertEditableToElement("indexS2P4");
            revertEditableToElement("indexS2P5");
            revertEditableToElement("indexS2P6");
            revertEditableToElement("indexS2P7");
            revertEditableToElement("indexS2P8");
            revertEditableToElement("indexS2P9");
            revertEditableToElement("indexS2P10");
            break;
        case 'departmentofwildlifeconservation':
            data.departmentofwildlifeconservation.dwSection1.dwS1H1 = document.getElementById("dwS1H1").value;
            data.departmentofwildlifeconservation.dwSection1.dwS1P1 = document.getElementById("dwS1P1").value;
            data.departmentofwildlifeconservation.dwSection2.dwS2H1 = document.getElementById("dwS2H1").value;
            data.departmentofwildlifeconservation.dwSection2.dwS2P1 = document.getElementById("dwS2P1").value;
            data.departmentofwildlifeconservation.dwSection3.dwS3H1 = document.getElementById("dwS3H1").value;
            data.departmentofwildlifeconservation.dwSection3.dwS3P1 = document.getElementById("dwS3P1").value;
            data.departmentofwildlifeconservation.dwSection4.dwS4H1 = document.getElementById("dwS4H1").value;
            data.departmentofwildlifeconservation.dwSection4.dwS4P1 = document.getElementById("dwS4P1").value;
    
            revertEditableToElement("dwS1H1");
            revertEditableToElement("dwS1P1");
            revertEditableToElement("dwS2H1");
            revertEditableToElement("dwS2P1");
            revertEditableToElement("dwS3H1");
            revertEditableToElement("dwS3P1");
            revertEditableToElement("dwS4H1");
            revertEditableToElement("dwS4P1");
            break;
        // case 'endemic':
            // revertEditableToElement("endS1H1");
            // revertEditableToElement("endS1P1");
            // break;
        case 'introduction':
            data.introduction.wiSection1.wiS1H1 = document.getElementById("wiS1H1").value;
            data.introduction.wiSection1.wiS1H2 = document.getElementById("wiS1H2").value;
            data.introduction.wiSection1.wiS1P1 = document.getElementById("wiS1P1").value;
            data.introduction.wiSection2.wiS2H1 = document.getElementById("wiS2H1").value;
            data.introduction.wiSection2.wiS2P1 = document.getElementById("wiS2P1").value;
            data.introduction.wiSection3.wiS3H1 = document.getElementById("wiS3H1").value;
            data.introduction.wiSection3.wiS3P1 = document.getElementById("wiS3P1").value;
            data.introduction.wiSection4.wiS4H1 = document.getElementById("wiS4H1").value;
            data.introduction.wiSection4.wiS4H2 = document.getElementById("wiS4H2").value;
            data.introduction.wiSection4.wiS4P1 = document.getElementById("wiS4P1").value;
            data.introduction.wiSection5.wiS5H1 = document.getElementById("wiS5H1").value;
            data.introduction.wiSection5.wiS5P1 = document.getElementById("wiS5P1").value;
            data.introduction.wiSection6.wiS6H1 = document.getElementById("wiS6H1").value;
            data.introduction.wiSection6.wiS6P1 = document.getElementById("wiS6P1").value;
    
            revertEditableToElement("wiS1H1");
            revertEditableToElement("wiS1H2");
            revertEditableToElement("wiS1P1");
            revertEditableToElement("wiS2H1");
            revertEditableToElement("wiS2P1");
            revertEditableToElement("wiS3H1");
            revertEditableToElement("wiS3P1");
            revertEditableToElement("wiS4H1");
            revertEditableToElement("wiS4H2");
            revertEditableToElement("wiS4P1");
            revertEditableToElement("wiS5H1");
            revertEditableToElement("wiS5P1");
            revertEditableToElement("wiS6H1");
            revertEditableToElement("wiS6P1");
            break;
        case 'leopards':
            data.leopards.leoSection1.leoS1H1 = document.getElementById("leoS1H1").value;
            data.leopards.leoSection1.leoS1H2 = document.getElementById("leoS1H2").value;
            data.leopards.leoSection1.leoS1P1 = document.getElementById("leoS1P1").value;
            data.leopards.leoSection1.leoS1H3 = document.getElementById("leoS1H3").value;
            data.leopards.leoSection1.leoS1H4 = document.getElementById("leoS1H4").value;
            data.leopards.leoSection1.leoS1P2 = document.getElementById("leoS1P2").value;
            data.leopards.leoSection1.leoS1H5 = document.getElementById("leoS1H5").value;
            data.leopards.leoSection1.leoS1P3 = document.getElementById("leoS1P3").value;
            data.leopards.leoSection1.leoS1H6 = document.getElementById("leoS1H6").value;
            data.leopards.leoSection1.leoS1P4 = document.getElementById("leoS1P4").value;
            data.leopards.leoSection2.leoS2H1 = document.getElementById("leoS2H1").value;
            data.leopards.leoSection2.leoS2H2 = document.getElementById("leoS2H2").value;
            data.leopards.leoSection2.leoS2P1 = document.getElementById("leoS2P1").value;
            data.leopards.leoSection2.leoS2H3 = document.getElementById("leoS2H3").value;
            data.leopards.leoSection2.leoS2P2 = document.getElementById("leoS2P2").value;
            data.leopards.leoSection2.leoS2H4 = document.getElementById("leoS2H4").value;
            data.leopards.leoSection2.leoS2H5 = document.getElementById("leoS2H5").value;
            data.leopards.leoSection2.leoS2P3 = document.getElementById("leoS2P3").value;
            data.leopards.leoSection2.leoS2H6 = document.getElementById("leoS2H6").value;
            data.leopards.leoSection2.leoS2P4 = document.getElementById("leoS2P4").value;
    
            revertEditableToElement("leoS1H1");
            revertEditableToElement("leoS1H2");
            revertEditableToElement("leoS1P1");
            revertEditableToElement("leoS1H3");
            revertEditableToElement("leoS1H4");
            revertEditableToElement("leoS1P2");
            revertEditableToElement("leoS1H5");
            revertEditableToElement("leoS1P3");
            revertEditableToElement("leoS1H6");
            revertEditableToElement("leoS1P4");
            revertEditableToElement("leoS2H1");
            revertEditableToElement("leoS2H2");
            revertEditableToElement("leoS2P1");
            revertEditableToElement("leoS2H3");
            revertEditableToElement("leoS2P2");
            revertEditableToElement("leoS2H4");
            revertEditableToElement("leoS2H5");
            revertEditableToElement("leoS2P3");
            revertEditableToElement("leoS2H6");
            revertEditableToElement("leoS2P4");
            break;
        case 'wilpattu':
            data.wilpattu.wilSection1.wilS1H1 = document.getElementById("wilS1H1").value;
            data.wilpattu.wilSection1.wilS1H2 = document.getElementById("wilS1H2").value;
            data.wilpattu.wilSection1.wilS1P1 = document.getElementById("wilS1P1").value;
            data.wilpattu.wilSection2.wilS2H1 = document.getElementById("wilS2H1").value;
            data.wilpattu.wilSection2.wilS2P1 = document.getElementById("wilS2P1").value;
            data.wilpattu.wilSection2.wilS2P2 = document.getElementById("wilS2P2").value;
            data.wilpattu.wilSection2.wilS2P3 = document.getElementById("wilS2P3").value;
            data.wilpattu.wilSection2.wilS2P4 = document.getElementById("wilS2P4").value;
            data.wilpattu.wilSection2.wilS2P5 = document.getElementById("wilS2P5").value;
            data.wilpattu.wilSection2.wilS2P6 = document.getElementById("wilS2P6").value;
            data.wilpattu.wilSection2.wilS2P7 = document.getElementById("wilS2P7").value;
            data.wilpattu.wilSection2.wilS2P8 = document.getElementById("wilS2P8").value;
            data.wilpattu.wilSection2.wilS2P9 = document.getElementById("wilS2P9").value;
            data.wilpattu.wilSection2.wilS2P10 = document.getElementById("wilS2P10").value;
            data.wilpattu.wilSection2.wilS2P11 = document.getElementById("wilS2P11").value;
            data.wilpattu.wilSection2.wilS2P12 = document.getElementById("wilS2P12").value;
            data.wilpattu.wilSection2.wilS3H1 = document.getElementById("wilS3H1").value;
            data.wilpattu.wilSection2.wilS3H2 = document.getElementById("wilS3H2").value;
            data.wilpattu.wilSection2.wilS3H3 = document.getElementById("wilS3H3").value;
    
            revertEditableToElement("wilS1H1");
            revertEditableToElement("wilS1H2");
            revertEditableToElement("wilS1P1");
            revertEditableToElement("wilS2H1");
            revertEditableToElement("wilS2P1");
            revertEditableToElement("wilS2P2");
            revertEditableToElement("wilS2P3");
            revertEditableToElement("wilS2P4");
            revertEditableToElement("wilS2P5");
            revertEditableToElement("wilS2P6");
            revertEditableToElement("wilS2P7");
            revertEditableToElement("wilS2P8");
            revertEditableToElement("wilS2P9");
            revertEditableToElement("wilS2P10");
            revertEditableToElement("wilS2P11");
            revertEditableToElement("wilS2P12");
            revertEditableToElement("wilS3H1");
            revertEditableToElement("wilS3H2");
            revertEditableToElement("wilS3H3");
            break;
        case 'yala':
            data.yala.yalaSection1.yalaS1H1 = document.getElementById("yalaS1H1").value;
            data.yala.yalaSection1.yalaS1H2 = document.getElementById("yalaS1H2").value;
            data.yala.yalaSection1.yalaS1P1 = document.getElementById("yalaS1P1").value;
            data.yala.yalaSection2.yalaS2H1 = document.getElementById("yalaS2H1").value;
            data.yala.yalaSection2.yalaS2p1 = document.getElementById("yalaS2p1").value;
            data.yala.yalaSection2.yalas2p2 = document.getElementById("yalas2p2").value;
            data.yala.yalaSection2.yalas2p3 = document.getElementById("yalas2p3").value;
            data.yala.yalaSection2.yalas2p4 = document.getElementById("yalas2p4").value;
            data.yala.yalaSection2.yalas2p5 = document.getElementById("yalas2p5").value;
            data.yala.yalaSection2.yalas2p6 = document.getElementById("yalas2p6").value;
            data.yala.yalaSection2.yalas2p7 = document.getElementById("yalas2p7").value;
            data.yala.yalaSection2.yalas2p8 = document.getElementById("yalas2p8").value;
            data.yala.yalaSection2.yalas2p9 = document.getElementById("yalas2p9").value;
            data.yala.yalaSection2.yalas2p10 = document.getElementById("yalas2p10").value;
            data.yala.yalaSection2.yalas2p11 = document.getElementById("yalas2p11").value;
            data.yala.yalaSection2.yalas2p12 = document.getElementById("yalas2p12").value;
            data.yala.yalaSection2.yalaS2H2 = document.getElementById("yalaS2H2").value;
            data.yala.yalaSection2.yalaS2H3 = document.getElementById("yalaS2H3").value;
            data.yala.yalaSection2.yalaS2H4 = document.getElementById("yalaS2H4").value;
    
            revertEditableToElement("yalaS1H1");
            revertEditableToElement("yalaS1H2");
            revertEditableToElement("yalaS1P1");
            revertEditableToElement("yalaS2H1");
            revertEditableToElement("yalaS2p1");
            revertEditableToElement("yalas2p2");
            revertEditableToElement("yalas2p3");
            revertEditableToElement("yalas2p4");
            revertEditableToElement("yalas2p5");
            revertEditableToElement("yalas2p6");
            revertEditableToElement("yalas2p7");
            revertEditableToElement("yalas2p8");
            revertEditableToElement("yalas2p9");
            revertEditableToElement("yalas2p10");
            revertEditableToElement("yalas2p11");
            revertEditableToElement("yalas2p12");
            revertEditableToElement("yalaS2H2");
            revertEditableToElement("yalaS2H3");
            revertEditableToElement("yalaS2H4");
            break;
        default:
            break;
    }
    
    localStorage.setItem('webContent', JSON.stringify(data))

    LoadPageData();
}

// Function to check if the user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('userLoggedIn') === "true";
}

// Function to check if the user is an admin
function isAdmin() {
    return sessionStorage.getItem('isAdmin') === "true";
}

// Function to restrict access to certain parts of the webpage
function restrictAccess() {
    if (!isLoggedIn() && !isAdmin()) {
        // Redirect or display an error message here
        // For example:
        alert('You must be logged in to access this feature.');
        return false; // Prevent further execution
    }
    return true;
}


function saveSubs() {
    // Get user input
    const fullName = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    // Store user input in local storage
    const subscriptionDetails = JSON.parse(localStorage.getItem('subscriptionDetails')) || [];
    subscriptionDetails.push({ fullName, email });
    localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionDetails));

    // Clear form fields
    document.getElementById("newsletterForm").reset();

    // Call function to display updated subscription details
    displaySubscriptionDetails();
    alert("Subscription Successful!");
}

function displaySubscriptionDetails() {
    const subscriptionDetails = JSON.parse(localStorage.getItem('subscriptionDetails'));
    console.log(subscriptionDetails);
    const tableBody = document.getElementById('subscriberTableBody');
    tableBody.innerHTML = ''; // Clear existing table rows

    if (subscriptionDetails && subscriptionDetails.length > 0) {
        subscriptionDetails.forEach(subscription => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subscription.fullName}</td>
                <td>${subscription.email}</td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById('subscriberList').style.display = 'block'; // Show subscription details
    } else {
        document.getElementById('subscriberList').style.display = 'none'; // Hide subscription details if no subscriptions
    }
}

document.getElementById("newsletterForm").addEventListener('submit', function(event) {
    event.preventDefault();
    saveSubs();
});
