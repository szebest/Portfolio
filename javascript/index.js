let navbar;
let scrollTimeout;
let lastScrollElementId;
let finishedScrolling = true;

//animated flex-wrap css property
window.addEventListener('load', function (event) {
    var targetClassName = 'animate-flex-wrap'
    var defaultDuration = '0.1s'

    var dummyList = [];

    function addDummy(item, duration) {
        var top = item.offsetTop
        var left = item.offsetLeft
        setTimeout(function () {
            item.style.position = 'absolute'
            item.style.top = top + 'px'
            item.style.left = left + 'px'

            var dummyDiv = document.createElement('div')
            dummyDiv.classList.add(targetClassName + '-dummy')
            var rect = item.getBoundingClientRect()
            dummyDiv.style.width = rect.width + 'px'
            dummyDiv.style.height = rect.height + 'px'
            dummyDiv.style.visibility = 'hidden'
            dummyDiv['__' + targetClassName + '_pair'] = item
            dummyDiv['__' + targetClassName + '_duration'] = duration
            item.parentNode.appendChild(dummyDiv)
            dummyList.push(dummyDiv)
        }, 0);
    }

    var conts = document.getElementsByClassName(targetClassName)
    for (cont of conts) {
        cont.style.position = 'relative'
        var duration = cont.getAttribute('data-duration') || defaultDuration
        var items = cont.getElementsByTagName('div')

        for (item of items)
            addDummy(item, duration)
    }

    window.addEventListener('resize', function (event) {
        dummyList.forEach(function (dummyDiv) {
            var item = dummyDiv['__' + targetClassName + '_pair']
            var duration = dummyDiv['__' + targetClassName + '_duration']
            if (item.offsetTop != dummyDiv.offsetTop) {
                item.style.transition = 'all ' + duration
                item.style.top = dummyDiv.offsetTop + 'px'
                item.style.left = dummyDiv.offsetLeft + 'px'
            } else {
                item.style.transition = ''
                item.style.left = dummyDiv.offsetLeft + 'px'
            }
        });
    });
});

window.addEventListener("scroll", () => {
    //we are scrolling
    finishedScrolling = false

    //after 100ms we set it so we finished scrolling
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
        finishedScrolling = true
    }, 100);

    var value = window.scrollY;
    var actualTop = document.documentElement.scrollTop || document.body.scrollTop;

    //change the class of the navbar
    if (actualTop === 0) {
        navbar.classList.add('top')
        localStorage.setItem('navbarClassName', 'top')
    } else {
        navbar.classList.remove('top')
        localStorage.setItem('navbarClassName', '')
    }
})

//scrolls smoothly to
function scrollSmoothTo(elementId) {
    if (!finishedScrolling && elementId === lastScrollElementId)
        return

    lastScrollElementId = elementId

    var element = document.getElementById(elementId)
    element.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
    });
}

function sendEmail(e) {
    if (e === undefined)
        return

    //we prevent it from reloading
    e.preventDefault()

    //get all items which meet the selector
    const querySelectorList = document.querySelectorAll("#emailForm .input")

    //we make an array out of it
    const inputArray = Array.from(querySelectorList).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {})

    //data from inputs
    const fromEmail = inputArray["email"]
    const contextMessage = inputArray["message"]

    const emailParams = {
        from_name: fromEmail,
        message: contextMessage
    }

    //we send the email
    emailjs.send('service_svjj95n', 'template_4awjlrn', emailParams)
        .then((r) => {
            var statusMsg = document.getElementById("statusMsg")

            if (r.text === "OK") {
                //we set the status
                statusMsg.innerHTML = "E-mail sent successfully"
                statusMsg.style.color = "green"

                querySelectorList.forEach((input) => {
                    input.value = ""
                    input.classList.remove('withValue')
                })

                //after 5 seconds we remove the status
                setTimeout(() => {
                    document.getElementById("statusMsg").innerHTML = ""
                }, 5000);

                return;
            }

            throw Error()
        })
        .catch((r) => {
            var statusMsg = document.getElementById("statusMsg");

            //we set the status
            statusMsg.innerHTML = "There was an error sending your e-mail. Try again!"
            statusMsg.style.color = "red"

            //after 5 seconds we remove the status
            setTimeout(() => {
                document.getElementById("statusMsg").innerHTML = ""
            }, 5000);
        })
}

window.onload = () => {
    //initialize mail
    emailjs.init("user_j80DIvWVjKF8Ua6toZXNc")

    var siteNav = document.getElementsByClassName('site-navigation')[0];

    document.getElementsByClassName('toggle-btn')[0].addEventListener('click', () => {
        siteNav.classList.toggle('active')
    })

    //initialize input event listeners
    document.querySelectorAll("#emailForm .input").forEach((input) => {
        input.addEventListener("change", () => {
            if (input.value != "")
                input.classList.add('withValue')
            else
                input.classList.remove('withValue')
        })
    })

    //get the navigation bar
    navbar = document.getElementById("navbar")
}