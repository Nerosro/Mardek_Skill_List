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
		console.info(Skill)
		if(typeof Skill === 'object'){
			
			Skill.forEach(function(arraySkill){
				
				var check_Mastered = false
				var identifier = character.Name+"_"+arraySkill.Name
				var getStatus = localStorage.getItem(identifier);
				if (getStatus == "true") 
				{
					check_Mastered = true;
					//console.info(check_Mastered);
				}
				else{
					check_Mastered = arraySkill.Mastered
					//console.info(getStatus);
				}
				
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

				if(arraySkill.Mastered !== "unable"){
                    var MasteredImg = document.createElement('img');
                        MasteredImg.src = "Images/Others/Mastered_" + check_Mastered + ".png";
                        MasteredImg.alt = check_Mastered;

					
                    var aMastered = document.createElement('a'); //change this to input type checkbox and a label with the image in?
                        aMastered.addEventListener('click', function () {
                            console.info(check_Mastered)
                            saveMastered(character.Name, arraySkill.Name, check_Mastered, MasteredImg); //Event listeners to change chapters
                            check_Mastered=!check_Mastered

                            MasteredImg.src = "Images/Others/Mastered_" + check_Mastered + ".png";
                            MasteredImg.alt = check_Mastered;
                        });
				}
				
				tdSkillType.appendChild(TypeImg)
				tdSkillName.appendChild(Name)
				tdSkillFound.appendChild(Found)

				if(arraySkill.Mastered !== "unable"){
				    aMastered.appendChild(MasteredImg)
				    tdSkillMastered.appendChild(aMastered)
				}

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

function saveMastered(character, skill, mastered){
	console.info(character, skill, mastered) //KidMardek Strike false //ch2Mardek Warp true
	
	if(mastered===true){
		localStorage.setItem(character+"_"+skill, false)
	}
	else{
		localStorage.setItem(character+"_"+skill, true)		
	}
}

function resetData(){
	let resetBtn = confirm("You are about to reset your data and start over with a blank slate \r\nThis action cannot be reverted \r\n\r\nDo you wish to continue?");
	if (resetBtn) {
		localStorage.clear();
		location.reload(); 
	} 
}