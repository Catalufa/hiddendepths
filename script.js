const h = document.querySelector("#title");
const l = document.querySelector("#logo-container");
var distanceFromTop;
var difference;
let initComplete = false;
let totalTopDistance = 0;
function init(e, undo = false) {
    initComplete = true;
    if (undo) initComplete = false;
    let changeH = h.getBoundingClientRect().top;
    let changeL = l.getBoundingClientRect().top-h.getBoundingClientRect().height+20;
    if (!totalTopDistance) {
        totalTopDistance = h.getBoundingClientRect().height + l.getBoundingClientRect().height
        document.querySelectorAll("section:not([id='home'])").forEach(s => {
            s.style.paddingTop = totalTopDistance + "px"
        })
    }
    difference = changeH - changeL;
    distanceFromTop = h.offsetTop - changeH
    l.style.transform = `translateY(-${
        changeL
    }px)`
    h.style.transform = `translateY(-${
        changeH
    }px)`
    // h.style.opacity = "0.2"
    h.style.fontSize = "2rem"
    document.querySelector("#ripple").style.border = "transparent 3px solid"
    document.querySelector("#home-content").style.opacity = "0";
    document.querySelector("#home-content").style.pointerEvents = "none";
    if (undo) {
        l.style.transform = ""
        h.style.transform = ""
        h.style.opacity = "1"
        h.style.fontSize = "3rem"
        document.querySelector("#ripple").style.border = "white 3px solid"
        document.querySelector("#home-content").style.opacity = "1";
        document.querySelector("#home-content").style.pointerEvents = "all";
    }
}
document.querySelector("#go").addEventListener("click", e => {
    init();
    navActivate("about");
})
window.addEventListener("resize", () => {
    if (!initComplete) return;
    let newChange = h.offsetTop-distanceFromTop - 10
    h.style.transform = `translateY(-${
        newChange
    }px)`
    l.style.transform = `translateY(-${
        newChange - difference
    }px)`
});

// document.body.addEventListener("mousemove", e => {
//     const m = document.querySelector("#home-move");
//     m.style.transform = `translateX(${(e.clientX - window.screen.width / 2)}px)`
// })

const topTexts = {
    home: ["hidden", "depths"],
    about: [" ", "about"],
    services: ["services", " "],
    clients: [" ", "clients"],
    contact: ["contact", " "],
}
const nav = document.querySelector("nav")
function navActivate(name, el) {
    nav.querySelectorAll(":scope > p").forEach(p => {p.classList.remove("active")})
    if (name) nav.querySelector(`[data-nav=${name}]`).classList.add("active")
    if (el) {
        el.classList.add("active")
        name = el.getAttribute("data-nav")
    }
    document.querySelectorAll(`section:not([id="home"]):not([id="${name}"])`).forEach(s => {
        // s.style.display = "none"
        s.style.opacity = "0";
        s.style.pointerEvents = "none";
        if (name == "home" || name == "contact") {
            s.style.transform = "translateY(100vh)"
            return
        }
        s.style.transform = "translateX(100vh)"
    })
    l.classList.remove("contact-active")
    if (name == "contact") l.classList.add("contact-active")
    document.querySelector(`#${name}`).style.opacity = "1";
    document.querySelector(`#${name}`).style.transform = "translateX(0)"
    document.querySelector(`#${name}`).style.pointerEvents = "all";
    toShuffle = {before: false, after: false}
    if (h.getAttribute("data-before") != topTexts[name][0]) {
        toShuffle.before = topTexts[name][0]
    }
    if (h.getAttribute("data-after") != topTexts[name][1]) {
        toShuffle.after = topTexts[name][1]
    }
    shuffle(toShuffle.before, toShuffle.after, name)
}
nav.addEventListener("click", e => {
    if (e.target == nav) return
    navOpen = false;
    nav.classList.remove("nav-open");

    console.log(e.target)
    navActivate(false, e.target)

    if (e.target.getAttribute("data-nav") == "home") {
        init(false, true)
        return
    }
    if (!initComplete) {
        init()
    }
})

const randoms = (x) => {return Array(x).fill().map(_=>String.fromCharCode(97+Math.random()*26|0)).join('')}
let delayShuffle
function shuffle(before, after, name) {
    let oldBefore, beforeDif, oldAfter, afterDif
    if (before) {
        oldBefore = h.getAttribute("data-before");
        beforeDif = oldBefore.length - before.length;
    }
    if (after) {
        oldAfter = h.getAttribute("data-after");
        afterDif = oldAfter.length - after.length;
    }
    let i = 0;
    clearTimeout(delayShuffle)
    delayShuffle = setTimeout(() => {
        h.classList.add("heading-mono")
        let shuffleTimer = setInterval(() => {
            if (before) h.setAttribute("data-before", randoms(oldBefore.length - Math.ceil(beforeDif * i)));
            if (after) h.setAttribute("data-after", randoms(oldAfter.length - Math.ceil(afterDif * i)));
            i = i + ((name == "home") ? 0.05 : 0.1)
            if (i >= 1) {
                clearInterval(shuffleTimer)
                if (before) h.setAttribute("data-before", before);
                if (after) h.setAttribute("data-after", after);
                if (name == "home") h.classList.remove("heading-mono")
            }
        }, 20)
    }, (oldBefore == "hidden") ? 250 : 0)
}

document.querySelectorAll("[data-next]").forEach(el => {
    el.addEventListener("click", () => {
        navActivate(el.getAttribute("data-next"))
    })
})

let navOpen = false;
document.querySelector("#nav-mobile").addEventListener("click", () => {
    navOpen = !navOpen;
    nav.classList.remove("nav-open");
    if (navOpen) nav.classList.add("nav-open");

})

document.querySelector("#copy-email").addEventListener("click", e => {
    navigator.clipboard.writeText("hello@hiddendepths.uk");
    e.target.innerText = "Copied!"
})