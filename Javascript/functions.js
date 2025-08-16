function getChapters(){
	var tblChapter = document.createElement('table');
		tblChapter.className="tblchapters"
	var tbodyChapter = document.createElement('tbody');	
	var trChapter = document.createElement('tr');
	
	for (chapter in MARDEK) //"const" or "let" variable declaration makes it so the value doesn't change for the eventListener
	{
		const objChapter=MARDEK[chapter]
		console.info(chapter)

		var tdChapter = document.createElement('td');
		var aChapter = document.createElement('a');
			aChapter.id=chapter;
			aChapter.addEventListener('click', function () {
				getCharacters(objChapter); //Event listeners to change chapters
			});
			
		var imgChapter = document.createElement('img');
			imgChapter.src = "Images/Chapters/"+chapter+".png"
			imgChapter.alt = chapter;
		
		aChapter.appendChild(imgChapter)
		tdChapter.appendChild(aChapter)
		trChapter.appendChild(tdChapter)
	}
	tbodyChapter.appendChild(trChapter)
	tblChapter.appendChild(tbodyChapter)
	var loc = document.getElementById("divChapter")
	loc.appendChild(tblChapter)
}

function getCharacters(chapter){
	
	//console.info(chapter)
	var tblCharacter = document.createElement('table');
		tblCharacter.className="tblCharacters"
	var tbodyCharacter = document.createElement('tbody');	
	var trCharacter = document.createElement('tr');
	
	for(character in chapter){
		//console.info(character)
		const objCharacter=chapter[character]
		if(typeof objCharacter === 'object'){
			//console.info(objCharacter)
			var tdCharacter = document.createElement('td');
			var aCharacter = document.createElement('a');
				aCharacter.id=character;
				aCharacter.addEventListener('click', function () {
					getSkills(objCharacter); //Event listeners to change characters
				});
				
			var imgCharacter = document.createElement('img');
				imgCharacter.src = "Images/Sprites/"+objCharacter.Image+".gif"
				imgCharacter.alt = objCharacter.Name;
			
			aCharacter.appendChild(imgCharacter)
			tdCharacter.appendChild(aCharacter)
			trCharacter.appendChild(tdCharacter)
		}
	}
	
	tbodyCharacter.appendChild(trCharacter)
	tblCharacter.appendChild(tbodyCharacter)
	
	var loc = document.getElementById("divCharacter")
	var oldCharList=document.getElementsByClassName("tblCharacters")[0]
	if(oldCharList){
		loc.removeChild(oldCharList);
	}
	loc.appendChild(tblCharacter)
}

function getSkills(character){
	console.info(character)
	
	//Change sprite of selected character here
	var curCharacter= document.getElementById("currentSelected")
	curCharacter.src="Images/Sprites/" + character.Image + ".gif"
	curCharacter.alt= character.Name
	
	//Make skill list here
	var tblSkill = document.createElement('table');
		tblSkill.className="tblSkills"
	var tbodySkill = document.createElement('tbody');	
	
	for(skill in character){
		const Skill = character[skill]
		//console.info(Skill)
		if(typeof Skill === 'object'){
			
			Skill.forEach(function(arraySkill){
				var getProgress = localStorage.getItem(character.Name+"_"+arraySkill.Name);

				var trSkill = document.createElement('tr');

				var tdSkillType = document.createElement('td');
				var tdSkillName = document.createElement('td');
				var tdSkillFound = document.createElement('td');
				var tdSkillMastered = document.createElement('td');

				var TypeImg= document.createElement('img');
					TypeImg.src = "Images/Skills/" + arraySkill.Type + ".png";
					TypeImg.alt = arraySkill.Type;
				var Name = document.createTextNode(arraySkill.Name);
				var Found = document.createTextNode(arraySkill.Found);

                if(arraySkill.Total == 1){
				    createMasteredCheckbox(character, arraySkill, getProgress, tdSkillMastered);
                }
                else{
                    createProgressBar(character, arraySkill, getProgress, tdSkillMastered);
                }
				tdSkillType.appendChild(TypeImg)
				tdSkillName.appendChild(Name)
				tdSkillFound.appendChild(Found)

				trSkill.appendChild(tdSkillType)
				trSkill.appendChild(tdSkillName)
				trSkill.appendChild(tdSkillFound)
				trSkill.appendChild(tdSkillMastered)

				tbodySkill.appendChild(trSkill)
			});
		}
	}

	tblSkill.appendChild(tbodySkill)

	var loc = document.getElementById("divSkillList")
	var oldSkillList=document.getElementsByClassName("tblSkills")[0]
	if(oldSkillList){
		loc.removeChild(oldSkillList);
	}
	loc.appendChild(tblSkill)
}

function createMasteredCheckbox(character, arraySkill, getProgress, tdSkillMastered){
    var check_Mastered = false;

    if (!getProgress){check_Mastered = false;}
    else{
        getProgress == 0 ? check_Mastered = false : check_Mastered = true;
    }

    masteredBtn = document.createElement("button");
    masteredBtn.className = "progressBtn mastered"
    masteredBtn.addEventListener('click', function () {
        saveProgress(character.Name, arraySkill.Name, check_Mastered == true ? 0 : 1); //Event listeners to save mastered progress

        check_Mastered =! check_Mastered
        masteredImg.src = "Images/Others/Mastered_" + check_Mastered + ".png";
        masteredImg.alt = check_Mastered;
    });

    var masteredImg = document.createElement('img');
        masteredImg.src = "Images/Others/Mastered_" + check_Mastered + ".png";
        masteredImg.alt = check_Mastered;


    if(arraySkill.Total == 1){
        masteredBtn.appendChild(masteredImg)
        tdSkillMastered.appendChild(masteredBtn)
    }
}

function createProgressBar(character, arraySkill, getProgress, tdSkillMastered){
    var progressContainer = document.createElement("div");
        progressContainer.className = "progress-container";

    var progressWrapper = document.createElement("div");
        progressWrapper.className = "progress-wrapper";

    var progressLabel = document.createElement("label");
        progressLabel.id = "progressLabel"
    var progressTextNode = document.createTextNode(getProgress? getProgress : 0);
        progressLabel.appendChild(progressTextNode)

    var maxLabel = document.createElement("label")
        maxLabel.id = "maxLabel"
    var maxTextNode = document.createTextNode(arraySkill.Total);
        maxLabel.appendChild(maxTextNode)

    var labelDiv = document.createElement("span");
        labelDiv.className = "progress-label"
        labelDiv.appendChild(progressLabel)
        labelDiv.appendChild(maxLabel)

    var progressBar = document.createElement('progress')
        progressBar.id = arraySkill.Name;
        progressBar.className = "progressBar"
        progressBar.max = (arraySkill.Total>0)? arraySkill.Total : 1;
        progressBar.value = getProgress;

    var masteredImg = document.createElement('img');
        masteredImg.src = "Images/Others/Mastered_true.png";
        masteredImg.style.display = "none"; // Hide initially
        masteredImg.alt = "Mastered";

    if(arraySkill.Total == 0){
        progressBar.value = progressBar.max;
    }

    var decreaseImg = document.createElement("img")
        decreaseImg.src = "Images/Others/Mardek_arrow_left.png"

    var decreaseButton = document.createElement("button")
        decreaseButton.id = arraySkill.Name+"_decrease";
        decreaseButton.className = "progressBtn decrease"
        decreaseButton.addEventListener('click', function () {
            progressBar.value--;
            progressTextNode.nodeValue = progressBar.value;

            enableProgressButtons(progressWrapper, increaseButton, decreaseButton);
            saveProgress(character.Name, arraySkill.Name, progressBar.value); //Event listeners to change chapters
        })
        decreaseButton.appendChild(decreaseImg)

    var increaseImg = document.createElement("img")
        increaseImg.src = "Images/Others/Mardek_arrow_right.png"

    var increaseButton = document.createElement("button")
        increaseButton.id = arraySkill.Name+"_increase";
        increaseButton.className = "progressBtn increase"
        increaseButton.addEventListener('click', function () {
            progressBar.value++;
            progressTextNode.nodeValue = progressBar.value;

            enableProgressButtons(progressWrapper, increaseButton, decreaseButton);
            saveProgress(character.Name, arraySkill.Name, progressBar.value); //Event listeners to save progress on skills
        })
        increaseButton.appendChild(increaseImg)

    if(arraySkill.Total != -1){
        progressWrapper.appendChild(progressBar);
        progressWrapper.appendChild(labelDiv);
        progressWrapper.appendChild(masteredImg);

        progressContainer.appendChild(decreaseButton)
        progressContainer.appendChild(progressWrapper)
        progressContainer.appendChild(increaseButton)

        tdSkillMastered.appendChild(progressContainer)
    }
    if(arraySkill.Total!= -1){
        enableProgressButtons(progressWrapper, increaseButton, decreaseButton);
    }
}

function enableProgressButtons(progressWrapper, increaseButton, decreaseButton){
    var progressBar = progressWrapper.firstElementChild;
    var labelDiv = progressBar.nextElementSibling;
    var masteredImg = labelDiv.nextElementSibling;

    //console.info(progressBar)
    //console.info(labelDiv)
    //console.info(masteredImg)

    if(progressBar.value == 0 || progressBar.max == 1){
        decreaseButton.disabled = true;
        decreaseButton.classList.add('gray');
    }
    else{
        if (decreaseButton.classList.contains('gray')) {
            decreaseButton.classList.remove('gray');
            decreaseButton.disabled = false;
        }
    }
    if(progressBar.value === progressBar.max){
        progressBar.style.display = "none";
        labelDiv.style.display = "none";
        masteredImg.style.display = "inline-block";

        increaseButton.disabled = true;
        increaseButton.classList.add('gray');
    }
    else{
        if (increaseButton.classList.contains('gray')) {

            progressBar.style.display = "inline-block";
            labelDiv.style.display = "inline-block";
            masteredImg.style.display = "none";

            increaseButton.classList.remove('gray');
            increaseButton.disabled = false;
        }
    }

}
function saveProgress(character, skill, skillProgress){
	//console.info(character, skill, skillProgress) //KidMardek Strike 0 //ch2Mardek Warp 10
	localStorage.setItem(character+"_"+skill, skillProgress)

}

function resetData(){
	let resetBtn = confirm("You are about to reset your data and start over with a blank slate \r\nThis action cannot be reverted \r\n\r\nDo you wish to continue?");
	if (resetBtn) {
		localStorage.clear();
		location.reload(); 
	} 
}