/*
    These functions are used to generate updates to the page
    Thera are two types
    1) Blocks where the contents of a block are replaced by the results of the backend call
    2) Updates where the backend call returns json name value pairs. The names are matched
        to element ids, then the content of the individual elements replaced by the value
*/
/* ------------------- HELPERS --------------------*/
// find an element matching the provided id, and update it with the corresponding value
function setIfExists(id, value) {
    var myEle = document.getElementById(id);
    if (myEle) {
        if (myEle.tagName === 'SELECT' || myEle.tagName === 'INPUT') {
            if (myEle.type == 'checkbox') {
                myEle.checked = (value == "true");
            }
            else {
                myEle.value = value;
            }
        }
        else {
            myEle.innerHTML = value;
        }
    }
    else {
        console.log(id + " not found");
    }
}

// work through a list of kvp updating each element with value
function updatePropertiesFromList(obj) {
    for (var key of Object.keys(obj)) {
        setIfExists(key, obj[key]);
    }
}


// check if an element exists with matching id, return string in the form &id=value
function valueIfExists(id) {
    var docfield = document.getElementById(id);
    if (docfield) {
        return "&" + id + "=" + docfield.value;
    }
    return "";
}

//FUNCTIONALITY FOR FETCHING DATA

// call the url and replace content based on the returned name value list
async function callAndReplaceFields(url) {
    var xhttp = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {

                    var jsonResponse = JSON.parse(this.responseText);

                    for (var i = 0, len = jsonResponse.length; i < len; ++i) {
                        var update = jsonResponse[i];
                        updatePropertiesFromList(update);
                    }
                    resolve("ok");
                }
                else {
                    setIfExists("confirmation", "Error: " + xhttp.status + " " + xhttp.responseText);
                    reject(xhttp.responseText);
                }
            }
        };
        xhttp.open("GET", url);
        xhttp.send();
    })
}

async function getDataForAction(action, refresh) {
    var sections = document.getElementsByClassName("UIsection");
    for (const ele of sections) {

        var UID = ele.getAttribute('UID');
        var sectionName = ele.getAttribute('name');

        if (UID && sectionName) {
            var url = "/page?action=" + action + "&UID=" + UID + "&div=" + sectionName;

            if (refresh) {
                url += "&bdRefresh=true"
            }
            var IDXAttr = ele.getAttribute('IDX');
            if (IDXAttr) {
                url += "&IDX=" + IDXAttr;
            }
            else {
                url += valueIfExists("IDX");
            }

            try {
                await callAndReplaceFields(url);
            }
            catch (err) {
                console.log(err)
            }
        }
    }
}

async function getDataForSection(ele) {

    var UID = ele.getAttribute('UID');
    var sectionName = ele.getAttribute('name');

    if (UID && sectionName) {
        var url = "/page?action=data&UID=" + UID + "&div=" + sectionName;

        var IDXAttr = ele.getAttribute('IDX');
        if (IDXAttr) {
            url += "&IDX=" + IDXAttr;
        }
        else {
            url += valueIfExists("IDX");
        }

        try {
            await callAndReplaceFields(url);
        }
        catch (err) {
            console.log(err)
        }
    }
}


// FUNCTIONALITY FOR LOADING BLOCKS

// find an element matching the provided id, and replace it with the corresponding value
async function callAndReplaceBlock(id, url, upatesection) {
    var xhttp = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {

                    var newValue = xhttp.responseText;

                    if (newValue != "") {
                        setIfExists(id, newValue);

                        if (upatesection) {
                            var block = document.getElementById(id);
                            if (block) {
                                var childSections = block.getElementsByClassName("UIsection");
                                for (const ele of childSections) {
                                    getDataForSection(ele);
                                }
                            }
                        }
                    }
                    resolve("ok");
                }
                else {
                    setIfExists("confirmation", "Error: " + xhttp.status + " " + xhttp.responseText);
                    reject(xhttp.responseText);
                }
            }
        };
        xhttp.open("GET", url);
        xhttp.send();
    })
}



async function getBlocks(upatesection) {
    return new Promise(function (resolve, reject) {
        var blocks = document.getElementsByClassName("UIblock");
        for (const ele of blocks) {

            var UID = ele.getAttribute('UID');
            var blockName = ele.getAttribute('name');
            var blockId = ele.getAttribute('id');
            if (UID && blockName && blockId) {

                var url = "/page?action=loadblock&UID=" + UID + "&block=" + blockId;

                var IDXAttr = ele.getAttribute('IDX');
                if (IDXAttr) {
                    url += "&IDX=" + IDXAttr;
                }
                else {
                    url += valueIfExists("IDX");
                }

                try {
                    callAndReplaceBlock(blockId, url, upatesection);
                    resolve();
                }
                catch (err) {
                    console.log(err)
                    reject();
                }
            }
        }
    })
}

// FUNCTIONALITY FOR SAVING DATA


function savePageData(UIsectionId) {

    setIfExists("confirmation", "");

    var uiSection = document.getElementById(UIsectionId);
    if (uiSection) {
        var UID = uiSection.getAttribute("UID");
        if (UID) {
            const input = uiSection.querySelector('form');
            if (input) {
                var inputData = new FormData(input);
                var request = new XMLHttpRequest();

                request.open("POST", "/page?action=save&UID=" + UID + "&div=" + UIsectionId);

                request.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            var jsonResponse = JSON.parse(this.responseText);

                            for (var i = 0, len = jsonResponse.length; i < len; ++i) {
                                var update = jsonResponse[i];
                                updatePropertiesFromList(update);
                            }
                        }
                        else {
                            setIfExists("confirmation", "Error: " + this.status + " " + this.responseText);
                        }
                    }
                };
                request.send(inputData);
            }
        }
    }
    return false;
}

// USER FACING FUNCTIONS

function loadPageData() {
    getDataForAction("data", false);
}

function loadPageBlocks() {
    getBlocks(false);
}

function refreshData() {
    getDataForAction("data", true);
};

async function loadBlocksThenData() {
    await getBlocks(true);
}


function customDataAction(action) {
    getDataForAction(action, false);
    return false;
}



// DOWNLOAD A FILE

function download(filename) {
    window.location = "/page?action=download&UID=307&file=" + filename;
}




function grabFromURL(propName) {
    var TargetField = document.getElementById(propName);
    if (TargetField) {
        var url_string = window.location.href;
        var pageurl = new URL(url_string);
        var urlField = pageurl.searchParams.get(propName);
        if (urlField) {
            TargetField.value = urlField;
        }
    }
}

