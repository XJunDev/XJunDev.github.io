const sideBar = document.getElementById('sidebar')
const homeContentContainer = document.getElementById('home-content-container')
const gamesContentContainer = document.getElementById('games-content-container')
const tutorialsContentContainer = document.getElementById('tutorials-content-container')
const blogsContentContainer = document.getElementById('blogs-content-container')
const contactContentContainer = document.getElementById('contact-content-container')
const backToTopButtonShowThreshold = 100;
const naviMap = new Map();

// 聚焦的按钮
let focusedNaviButton = document.getElementById('home')
// 显示的容器
let shownContentContainer = homeContentContainer;

let hashID;

onDOMContentLoaded();
initializeMaps();
initializeContent()
initializeCopyrightInfo();
initializeIconLinks();
initializeDisplayModeToggle();
initializeSidebarToggle();

function onDOMContentLoaded()
{
    window.addEventListener('DOMContentLoaded', function() {
        if (!window.location.hash) return;
        hashID = window.location.hash.substring(1);
    })
}

function initializeMaps()
{
    naviMap.set('home', homeContentContainer);
    naviMap.set('games', gamesContentContainer);
    naviMap.set('tutorials', tutorialsContentContainer);
    naviMap.set('blogs', blogsContentContainer);
    naviMap.set('contact', contactContentContainer);
}

function initializeContent()
{
    let homeHTML;
    let gamesHTML;
    let tutorialsHTML;
    let blogsHTML;
    let contactHTML;
    
    Promise.all([
        getHtmlContent('files/html/home.html'),
        getHtmlContent('files/html/games.html'),
        getHtmlContent('files/html/tutorials.html'),
        getHtmlContent('files/html/blogs.html'),
        getHtmlContent('files/html/contact.html')
    ]).then(contents => {
        [homeHTML, gamesHTML, tutorialsHTML, blogsHTML, contactHTML] = contents;
        
        loadContent(homeContentContainer, homeHTML);
        loadContent(gamesContentContainer, gamesHTML);
        loadContent(tutorialsContentContainer, tutorialsHTML);
        loadContent(blogsContentContainer, blogsHTML);
        loadContent(contactContentContainer, contactHTML);
        
        homeContentContainer.style.display = 'flex';
        
        initializeGameWindow();
        initializeTutorials();
        initializeBlogs();
        initializeNaviButtons();
    }).catch(error => console.log('Error initializing content: ', error))

    function getHtmlContent(path)
    {
        return fetch(path)
            .then(response => response.text())
            .then(htmlContent => htmlContent)
    }
    function loadContent(contentContainer, html)
    {
        const content = document.createElement('div')
        content.innerHTML = html;
        content.style.flex = '1';
        contentContainer.appendChild(content);
        contentContainer.style.display = 'none';
    }
    function initializeGameWindow()
    {
        const gameList = document.getElementById('game-list')
        const gameWindow = document.getElementById('game-window')
        const gameWindowCloseButton = document.getElementById('game-window-close-button')
        const gameFrame = document.getElementById('game-frame')
        
        gameWindowCloseButton.addEventListener('click', function() {
            unloadGame();
            updateUrlByID("games");
            gameWindow.style.display = "none";
            gameList.style.display = 'flex';
            window.removeEventListener('wheel', disableScroll);
        })
        
        gameList.querySelectorAll('.game-panel').forEach(gamePanel => {
            gamePanel.addEventListener('click', function() {
                updateUrlByID(gamePanel.id);
                showGameWindow(gamePanel.id);
            })
            
            if (hashID && hashID === gamePanel.id)
            {
                showGameWindow(hashID);
                const gamesNaviButton = document.getElementById('games')
                ShowNaviContent(gamesNaviButton);
                highlightNaviButton(gamesNaviButton);
            }
        })
        
        function showGameWindow(gamePanelID)
        {
            gameWindow.style.display = 'flex';
            gameList.style.display = 'none';
            window.addEventListener('wheel', disableScroll, 
                { passive : false })
            switch (gamePanelID)
            {
                case 'game-01':
                    break;
            }
        }
        
        function disableScroll(event)
        {
            event.preventDefault();
        }
        function loadGame(path)
        {
            unloadGame();
            gameFrame.src = path;
            gameFrame.setAttribute('allowfullscreen', '');
            gameWindow.appendChild(gameFrame);
        }
        function unloadGame()
        {
            const iframe = gameWindow.querySelector('iframe');
            if(iframe)
            {
                gameWindow.removeChild(iframe);
            }
        }
    }
    function initializeTutorials()
    {
        
    }
    function initializeBlogs()
    {
        
    }
    function initializeNaviButtons()
    {
        const naviButtons = document.querySelectorAll('.navi-button')
        naviButtons.forEach(naviBtn => {
            naviBtn.addEventListener('click', () => {
                if (focusedNaviButton.id === naviBtn.id)
                {
                    if (focusedNaviButton.id === 'home' || focusedNaviButton.id === 'contact') return;
                    
                    const naviContent = naviMap.get(naviBtn.id);
                    const closeButton = naviBtn.querySelector('.close-button')
                    
                    if (closeButton)
                    {
                        closeButton.click();
                        updateUrlByID(naviBtn.id);
                    }
                    return;
                }
                ShowNaviContent(naviBtn);
                updateUrlByID(focusedNaviButton.id);
            })
        })
        if (hashID)
        {
            if (naviMap.get(hashID))
            {
                const naviButton = document.getElementById(hashID);
                ShowNaviContent(naviButton);
            }
        }
        else
        {
            highlightNaviButton(focusedNaviButton);
        }
    }
    
    function updateUrlByID(id)
    {
        const currentUrl = window.location.href;
        const newUrl = currentUrl.split('#')[0] + '#' + id;
        history.pushState(null, null, newUrl);
    }
}

function initializeCopyrightInfo()
{
    const Project_Start_Year = 2024;
    const Current_Year = new Date().getFullYear();
    const currentYearText = document.getElementById('current-year')
    currentYearText.textContent = Current_Year === Project_Start_Year ? 
        Current_Year.toString() : `${Project_Start_Year} - ${Current_Year}`;
}

function ShowNaviContent(naviButton)
{
    focusedNaviButton.classList.remove('navi-button-focused')
    focusedNaviButton.querySelectorAll('span').forEach(element => {
        element.classList.remove('focused');
    });
    focusedNaviButton = naviButton;
    shownContentContainer.style.display = 'none';
    shownContentContainer = naviMap.get(naviButton.id);
    shownContentContainer.style.display = 'flex';
}

function highlightNaviButton(naviButton)
{
    naviButton.classList.add('navi-button-focused')
    naviButton.querySelectorAll('span').forEach(ele => {
        ele.classList.add('focused');
    })
}

function initializeSidebarToggle()
{
    const SIDEBAR_TOGGLE = document.getElementById('sidebar-toggle')
    SIDEBAR_TOGGLE.addEventListener('click', () => {
        sideBar.classList.toggle("closed")
        if (sideBar.classList.contains('closed'))
        {
            localStorage.setItem('sidebar-style', 'closed')
        }
        else
        {
            localStorage.setItem('sidebar-style', 'open')
        }
    })
}

/**
 * 初始化， 菜单栏
 */
function initializeIconLinks()
{
    document.querySelectorAll('.icon-link').forEach(ele => {
        ele.addEventListener('click', env => {
            env.preventDefault();
            window.open(env.currentTarget.getAttribute('data-url', '_blank'))
        })
    })
}

function initializeDisplayModeToggle()
{
    const displayModeToggle = document.getElementById('display-mode-toggle')
    displayModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode')
        if (document.body.classList.contains('dark-mode'))
        {
            localStorage.setItem('theme', 'dark')
        }
        else
        {
            localStorage.setItem('theme', 'light')
        }
    })
}
