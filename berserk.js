// ==UserScript==
// @name     avannaBerserk
// @version  1.1.1.1
// @grant    none
// @run-at   document-idle
// @include  /^https:\/\/lichess\.org\/([a-zA-Z0-9\/]){6,}
// ==/UserScript==

setTimeout(function()
{
    var berserkAlwaysDiv;
    var berserkBackDiv;

    var berserkAlwaysCheckbox;
    var berserkBackCheckbox;

    var zerked = false; // makes a few things more readable
    var cName; // stores the class of the tournament-defining component (tournament-lobby or tournament-game), in order to add the elements to the correct div


    // storage functions. remember berserking preferences between games
    function getStorage(v)
    {
        return lichess.storage.get(v) === 'true';
    }

    function setStorage(v, val)
    {
        lichess.storage.set(v, val);
    }


    function clickZerkLoop()
    {
        if (document.getElementsByClassName("fbt go-berserk")[0] != undefined && !zerked)
        {
            document.getElementsByClassName("fbt go-berserk")[0].click();
            zerked = true;
        }
        if (!zerked)
        {
            setTimeout(clickZerkLoop, 50);
        }
    }

    function backZerkLoop()
    {
        if (document.getElementsByClassName("rclock rclock-top")[0].getElementsByClassName("berserked top")[0] != undefined)
        {
            clickZerkLoop();
        }
        if (!zerked && berserkBackCheckbox.checked)
        {
            setTimeout(backZerkLoop, 150);
        }
    }


    // looks at which boxes are checked and performs actions
    function checkBoxes()
    {
        if (!zerked && document.getElementsByClassName("game__tournament").length > 0) // only try to click the buttons if you are actually playing (not in lobby or observing a tournament game)
        {
            if (berserkAlwaysCheckbox.checked)
            {
                clickZerkLoop();
            }
            if (berserkBackCheckbox.checked)
            {
                backZerkLoop();
            }
        }
    }


    // checks if page is a tournament lobby or tournament game
    if (document.getElementsByClassName("tour__meta").length > 0 || document.getElementsByClassName("game__tournament-link").length > 0 || document.getElementsByClassName("game__tournament").length > 0)
    {
        cName = (document.getElementsByClassName("tour__meta").length > 0) ? "tour__meta" : "game__meta";

        // cosmetics and buttons. div that will contain the new elements
        var theDiv = document.getElementsByClassName(cName)[0];

        // defines the text-accompanying elements
        berserkAlwaysCheckbox = document.createElement("input");
        berserkAlwaysCheckbox.id = "berserkAlwaysCheckbox";
        berserkAlwaysCheckbox.type = "checkbox";

        berserkBackCheckbox = document.createElement("input");
        berserkBackCheckbox.id = "berserkBackCheckbox";
        berserkBackCheckbox.type = "checkbox";

        // defines the divs that will contain the checkboxes and adds them
        berserkAlwaysDiv = document.createElement("div");
        berserkAlwaysDiv.id = "berserk-always";
        berserkAlwaysDiv.appendChild(berserkAlwaysCheckbox);
        berserkAlwaysDiv.appendChild(document.createTextNode(" Berserk always"));

        berserkBackDiv = document.createElement("div");
        berserkBackDiv.id = "berserk-back";
        berserkBackDiv.appendChild(berserkBackCheckbox);
        berserkBackDiv.appendChild(document.createTextNode(" Berserk back"));

        // after everything is setup, add things to the div
        theDiv.appendChild(berserkAlwaysDiv);
        theDiv.appendChild(berserkBackDiv);

        // adds listeners to checkboxes
        berserkAlwaysCheckbox.addEventListener("click", function()
        {
            setStorage("berserkAlwaysCheckbox", this.checked);
            checkBoxes();
        });

        berserkBackCheckbox.addEventListener("click", function()
        {
            setStorage("berserkBackCheckbox", this.checked);
            checkBoxes();
        });

        berserkAlwaysCheckbox.checked = getStorage("berserkAlwaysCheckbox");
        berserkBackCheckbox.checked = getStorage("berserkBackCheckbox");

        checkBoxes();
        console.log("loaded berserk script");
    }
}, 250);
