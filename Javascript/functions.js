function getChapters() {
    const chapterContainer = document.getElementById("chapterContainer");

    const divChapters = document.createElement("div");
    divChapters.className = "divChapters";

    for (let chapter in MARDEK) {
        const objChapter = MARDEK[chapter]
        //console.info(chapter)

        const divChapter = document.createElement("div");
        divChapter.addEventListener('click', function () {
            cleanUpContainer("characterContainer", "characterListDiv")
            getCharacters(objChapter); //Event listeners to change chapters
        });
        const chapterLink = document.createElement('a');
        chapterLink.id = chapter;

        const imgChapter = document.createElement('img');
        imgChapter.className = "chapterImage"
        imgChapter.src = "Images/Chapters/" + chapter + ".png"
        imgChapter.alt = chapter;

        chapterLink.appendChild(imgChapter)
        divChapter.appendChild(chapterLink)
        divChapters.appendChild(divChapter)
    }
    chapterContainer.appendChild(divChapters)
}

function cleanUpContainer(parentId, childId) {
    const parentNode = document.getElementById(parentId);
    const childNode = document.getElementById(childId);
    if (childNode) {
        parentNode.removeChild(childNode);
    }
}

function getCharacters(chapter) {
    //console.info(chapter)
    const chapterContainer = document.getElementById("characterContainer");
    const characterListDiv = document.createElement("div");
    characterListDiv.id = "characterListDiv";

    for (let character in chapter) {
        //console.info(character)
        const objCharacter = chapter[character];
        if (typeof objCharacter === 'object') {
            //console.info(objCharacter)
            const characterDiv = document.createElement("div");
            characterDiv.className = "characterDiv";
            characterDiv.addEventListener('click', function () {
                switchSelectedState(characterDiv, "selected");
                cleanUpContainer("skillListContainer", "skillContainer");
                getSkillContent(objCharacter); //Event listeners to change characters
            });

            const characterLink = document.createElement('div');
            characterLink.id = character;

            const imgCharacter = document.createElement('img');
            imgCharacter.src = "Images/Sprites/" + objCharacter.Image + ".gif";
            imgCharacter.alt = objCharacter.Name;
            imgCharacter.className = "characterIcon"

            characterLink.appendChild(imgCharacter);
            characterDiv.appendChild(characterLink);
            characterListDiv.appendChild(characterDiv);
        }
        chapterContainer.appendChild(characterListDiv);
    }
    chapterContainer.appendChild(characterListDiv)
}

function switchSelectedState(selectedDiv, className) {
    const currentSelected = document.getElementsByClassName(className);
    // console.info(selectedDiv)
    // console.info(currentSelected[0])
    if (currentSelected.length > 0) {
        //console.log("removing selected from: ", currentSelected )
        currentSelected[0].classList.remove(className);
    }
    selectedDiv.classList.add(className);
}

function getSkillContent(character) {
    //console.info(character)
    changeChosenCharacter(character);
    createSkillList(character);
}

function changeChosenCharacter(character) {
    //Change sprite of selected character here
    const curCharacter = document.getElementById("currentSelected")
    curCharacter.src = "Images/Sprites/" + character.Image + ".gif"
    curCharacter.alt = character.Name
}

function createSkillList(character) {
    const skillListContainer = document.getElementById("skillListContainer");
    const skillContainer = document.createElement("div");
    skillContainer.id = "skillContainer";

    const containerDiv = document.createElement("div");
    containerDiv.className = "skillTable"

    //Top selector row -> main skill, PhysAtk, PhysDef, MagAtk, MagDef, Passive
    const selectionContainer = document.createElement("div")
    selectionContainer.className = "skillSelectionContainer";

    const skillTypes = new Set(character["Skills"].map(key => key.Type));
    //console.info(skillTypes)
    skillTypes.forEach(function (skillType) {
        //console.info(skillType)
        const divSkillType = document.createElement("div");
        divSkillType.addEventListener('click', function () {
            switchSelectedState(divSkillType, "selectedSkill")
            cleanUpContainer("skillContainer", "skillList");
            findSkillsForType(skillType, character); //Event listeners to change chapters
        });

        const typeImg = document.createElement("img")
        typeImg.src = "Images/Skills/" + skillType + ".png";
        typeImg.alt = skillType;

        divSkillType.appendChild(typeImg);
        selectionContainer.appendChild(divSkillType);
    });

    skillContainer.appendChild(selectionContainer);
    skillListContainer.appendChild(skillContainer);
}

function findSkillsForType(skillType, character) {
    // console.info(skillType)
    // console.info(character)
    const getMasteryOption = localStorage.getItem("masteryOption");
    //console.log(getMasteryOption)

    const skillListContainer = document.getElementById("skillContainer");
    const skillList = document.createElement("div")
    skillList.id = "skillList";

    const skills = character["Skills"]
    skills.forEach(function (arraySkill) {
        if (arraySkill.Type === skillType) {
            const getProgress = localStorage.getItem(character.Name + "_" + arraySkill.Name);

            const skillEntry = document.createElement("div")
            skillEntry.className = "skillEntry";

            const skillNameDiv = document.createElement("div");
            skillNameDiv.className = "skillName";
            const name = document.createTextNode(arraySkill.Name);
            skillNameDiv.appendChild(name);

            const skillFoundDiv = document.createElement("div");
            skillFoundDiv.className = "skillFoundOn";
            const found = document.createTextNode(arraySkill.Found);
            skillFoundDiv.appendChild(found);

            skillEntry.appendChild(skillNameDiv);
            skillEntry.appendChild(skillFoundDiv);

            if ((arraySkill.Total === 1) || (getMasteryOption === "useCheckbox")) {
                createMasteredCheckbox(character, arraySkill, getProgress, skillEntry);
            } else {
                createProgressBar(character, arraySkill, getProgress, skillEntry);
            }
            skillList.appendChild(skillEntry)
        }
    });
    skillListContainer.appendChild(skillList)
}

function createMasteredCheckbox(character, arraySkill, getProgress, entry) {
    //console.info(arraySkill)
    //console.info(getProgress)
    const getMasteryOption = localStorage.getItem("masteryOption");
    const masteredImg = document.createElement('img');
    let check_Mastered = false;

    if (!getProgress) {
        check_Mastered = false;
    } else {
        //console.log(getProgress)
        check_Mastered = getProgress === arraySkill.Total.toString();
    }

    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";
    let masteredBtn = document.createElement("button");
    masteredBtn.className = "progressBtn mastered"
    masteredBtn.addEventListener('click', function toggleMastery() {
        //Event listeners to save mastered progress
        if (check_Mastered === true) {
            //If already mastered, reduce mastery progress by 1
            saveProgress(character.Name, arraySkill.Name, arraySkill.Total - 1);
        } else {
            //if not mastered, set mastery to total mastery amount
            saveProgress(character.Name, arraySkill.Name, arraySkill.Total);
        }

        if(arraySkill.Total == 0){
            masteredImg.src = "Images/Others/Mastered_true.png";
        }
        else{
            check_Mastered = !check_Mastered
            masteredImg.src = "Images/Others/Mastered_" + check_Mastered + ".png";
            masteredImg.alt = check_Mastered;
        }

    });

    if(arraySkill.Total == 0){
        masteredImg.src = "Images/Others/Mastered_true.png";
    }
    else{
        masteredImg.src = "Images/Others/Mastered_" + check_Mastered + ".png";
    }
    masteredImg.alt = check_Mastered;


    if (arraySkill.Total === 1 || getMasteryOption === "useCheckbox") {
        masteredBtn.appendChild(masteredImg)
        progressContainer.appendChild(masteredBtn)
        entry.appendChild(progressContainer)
    }
}

function createProgressBar(character, arraySkill, getProgress, entry) {
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";

    const progressWrapper = document.createElement("div");
    progressWrapper.className = "progress-wrapper";

    const progressLabel = document.createElement("label");
    progressLabel.id = "progressLabel"
    const progressTextNode = document.createTextNode(getProgress ? getProgress : 0);
    progressLabel.appendChild(progressTextNode)

    const maxLabel = document.createElement("label")
    maxLabel.id = "maxLabel"
    const maxTextNode = document.createTextNode(arraySkill.Total);
    maxLabel.appendChild(maxTextNode)

    const labelDiv = document.createElement("span");
    labelDiv.className = "progress-label"
    labelDiv.appendChild(progressLabel)
    labelDiv.appendChild(maxLabel)

    const progressBar = document.createElement('progress')
    progressBar.id = arraySkill.Name;
    progressBar.className = "progressBar"
    progressBar.max = (arraySkill.Total > 0) ? arraySkill.Total : 1;
    progressBar.value = getProgress;

    if (arraySkill.Total === 0) {
        progressBar.value = progressBar.max;
    }

    const masteredImg = document.createElement('img');
    masteredImg.src = "Images/Others/Mastered_true.png";
    masteredImg.alt = "Mastered";
    masteredImg.className = "mastered-img";
    masteredImg.style.visibility = "hidden"; // start hidden

    const decreaseImg = document.createElement("img")
    decreaseImg.src = "Images/Others/Mardek_arrow_left.png"

    let timer;

    function contIncrease() {
        progressBar.value++;
        progressTextNode.nodeValue = progressBar.value;

        enableProgressButtons(progressBar, increaseButton, decreaseButton, labelDiv, masteredImg); // 🔹 extra params
        saveProgress(character.Name, arraySkill.Name, progressBar.value); //Event listeners to change chapters
        timer = setTimeout(contIncrease, 200);
    }

    function contDecrease() {
        progressBar.value--;
        progressTextNode.nodeValue = progressBar.value;

        enableProgressButtons(progressBar, increaseButton, decreaseButton, labelDiv, masteredImg); // 🔹 extra params
        saveProgress(character.Name, arraySkill.Name, progressBar.value); //Event listeners to change chapters
        timer = setTimeout(contDecrease, 200);
    }

    function timeoutClear() {
        clearTimeout(timer);
    }

    const decreaseButton = document.createElement("button")
    decreaseButton.id = arraySkill.Name + "_decrease";
    decreaseButton.className = "progressBtn decrease";
    decreaseButton.addEventListener('mousedown', contDecrease);
    decreaseButton.addEventListener('mouseup', timeoutClear);
    decreaseButton.addEventListener('mouseleave', timeoutClear);
    decreaseButton.addEventListener('dragleave', timeoutClear);
    decreaseButton.appendChild(decreaseImg)

    const increaseImg = document.createElement("img")
    increaseImg.src = "Images/Others/Mardek_arrow_right.png"

    const increaseButton = document.createElement("button")
    increaseButton.id = arraySkill.Name + "_increase";
    increaseButton.className = "progressBtn increase";
    increaseButton.addEventListener('mousedown', contIncrease);
    increaseButton.addEventListener('mouseup', timeoutClear);
    increaseButton.addEventListener('mouseleave', timeoutClear);
    increaseButton.addEventListener('dragleave', timeoutClear);
    increaseButton.appendChild(increaseImg)

    enableProgressButtons(progressBar, increaseButton, decreaseButton, labelDiv, masteredImg); // 🔹 extra params

    if (arraySkill.Total !== -1) {
        progressWrapper.appendChild(progressBar);
        progressWrapper.appendChild(labelDiv);
        progressWrapper.appendChild(masteredImg);

        progressContainer.appendChild(decreaseButton)
        progressContainer.appendChild(progressWrapper)
        progressContainer.appendChild(increaseButton)
    } else {
        const textNode = document.createTextNode(character.Name + " cannot master this skill");
        progressContainer.appendChild(textNode);
    }
    entry.appendChild(progressContainer)
}

function enableProgressButtons(progressBar, increaseButton, decreaseButton, labelDiv, masteredImg) {
    //console.info(progressBar)
    //console.info(labelDiv)
    //console.info(masteredImg)

    if (progressBar.value === 0 || progressBar.max === 1) {
        decreaseButton.disabled = true;
        decreaseButton.classList.add('gray');
    } else {
        if (decreaseButton.classList.contains('gray')) {
            decreaseButton.classList.remove('gray');
            decreaseButton.disabled = false;
        }
    }
    if (progressBar.value === progressBar.max) {
        increaseButton.disabled = true;
        increaseButton.classList.add('gray');

        // 🔹 Added visibility toggle instead of display:none
        progressBar.style.visibility = "hidden";
        labelDiv.style.visibility = "hidden";
        masteredImg.style.visibility = "visible";

    } else {
        if (increaseButton.classList.contains('gray')) {
            increaseButton.classList.remove('gray');
            increaseButton.disabled = false;
        }
        // 🔹 Reset visibility when not mastered
        progressBar.style.visibility = "visible";
        labelDiv.style.visibility = "visible";
        masteredImg.style.visibility = "hidden";
    }
}

function saveProgress(character, skill, skillProgress) {
    // console.info(character, skill, skillProgress) //KidMardek Strike 0 //ch2Mardek Regen 10
    localStorage.setItem(character + "_" + skill, skillProgress)
}

function createFooter() {
    const getMasteryOption = localStorage.getItem("masteryOption");
    let checked = false;
    if (getMasteryOption === "useCheckbox") {
        checked = true
    }

    const footer = document.getElementsByClassName("footer")[0];
    const radioContainer = document.createElement("div");
    radioContainer.className = "radioContainer";


    const radioButton1 = document.createElement('input');
    radioButton1.type = "radio";
    radioButton1.id = "masteryCheckbox";
    radioButton1.name = "masteryType";
    radioButton1.checked = checked;

    const radioButton2 = document.createElement('input');
    radioButton2.type = "radio";
    radioButton2.id = "masteryProgressBar";
    radioButton2.name = "masteryType";
    radioButton2.checked = !checked;

    const label1 = document.createElement("label");
    label1.textContent = "Checkbox";
    label1.htmlFor = "masteryCheckbox";
    const label2 = document.createElement("label");
    label2.textContent = "Progress bar";
    label2.htmlFor = "masteryProgressBar";

    radioButton1.addEventListener('change', function () {
        if (radioButton1.checked) {
            localStorage.setItem("masteryOption", "useCheckbox");
        }
    })
    radioButton2.addEventListener('change', function () {
        if (radioButton2.checked) {
            localStorage.setItem("masteryOption", "useProgressBar");
        }
    });

    radioContainer.appendChild(radioButton1)
    radioContainer.appendChild(label1)
    radioContainer.appendChild(radioButton2)
    radioContainer.appendChild(label2)


    const gliderContainer = document.createElement("div");
    gliderContainer.className = "gliderContainer";

    const glider = document.createElement("div");
    glider.className = "glider";

    gliderContainer.appendChild(glider);
    radioContainer.appendChild(gliderContainer);
    footer.appendChild(radioContainer);
}

function resetData() {
    let resetBtn = confirm("You are about to reset your data and start over with a blank slate \r\nThis action cannot be reverted \r\n\r\nDo you wish to continue?");
    if (resetBtn) {
        localStorage.clear();
        location.reload();
    }
}