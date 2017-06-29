#pragma strict

private var state: 					String = "Intro";

private var firstWord: 				String = "Enter German word here";
private var secondWord: 			String = "Enter Spanish word here";
private var firstTestWord: 			String = "";
private var secondTestWord: 		String = "Enter translation here";
private var currentTranslation: 	String = "";

private var firstWordStartString: 	String;
private var secondWordStartString: 	String;
private var translationStartString: String;

private var frameIndex: 			int = 0;

private var wordsExist: 			boolean = false;
private var moreThanOneWordExist: 	boolean = false;
private var hasAdapted: 			boolean = false;

public 	var newSkin: 				GUISkin;
public  var flag01: 				Texture;
public  var flag02: 				Texture;

function Start()
{
	firstWordStartString   = firstWord;
	secondWordStartString  = secondWord;
	translationStartString = secondTestWord;
}

function OnGUI()
{
	frameIndex += 1;
	
	if(frameIndex % 2 != 0)
		return;
		
	if(frameIndex > 100)
		frameIndex = 0;
		
	if(newSkin)
		GUI.skin = newSkin;
		
	adaptToScreen();

	if(state == "EnterWords")
	{
		GUI.Box(rectAdapt(10, 10, 1260, 200), "Enter your words!");
		
		GUI.SetNextControlName("textfield01");
		firstWord = GUI.TextField(rectAdapt(50, 230, 700, 150), firstWord, 40);
		GUI.Box(rectAdapt(46, 145, 80, 80), flag01);
		
		GUI.SetNextControlName("textfield02");
		secondWord = GUI.TextField(rectAdapt(530, 420, 700, 150), secondWord, 40);
		GUI.Box(rectAdapt(1154, 575, 80, 80), flag02);
		
		if (UnityEngine.Event.current.type == EventType.Repaint)
		{
			if (GUI.GetNameOfFocusedControl() == "textfield01")
			{
				if (firstWord == firstWordStartString)
					firstWord = "";
			}
			else
			{
				if (firstWord == "")
					firstWord = firstWordStartString;
			}
			
			if (GUI.GetNameOfFocusedControl() == "textfield02")
			{
				if (secondWord == secondWordStartString)
					secondWord = "";
			}
			else
			{
				if (secondWord == "")
					secondWord = secondWordStartString;
			}
		}
		
		if(firstWord != firstWordStartString && secondWord != secondWordStartString && firstWord != "" && secondWord != "")
			if(GUI.Button(rectAdapt(930, 665, 340, 125), "Save words"))
				switchState("WordEntered");	
		
		if(wordsExist)
			if(GUI.Button(rectAdapt(10, 665, 340, 125), "Test\nYourself!"))
				switchState("CheckWords");
				
		if(GUI.Button(rectAdapt(1145, 10, 125, 125), "Quit"))
			switchState("Quit");
	}
	else if(state == "CheckWords")
	{
		if(GUI.Button(rectAdapt(10, 665, 340, 125), "Add new words\nto list!"))
			switchState("EnterWords");
			
		GUI.Box(rectAdapt(240, 170, 800, 150), firstTestWord);
		GUI.Box(rectAdapt(964, 505, 80, 80), flag02);
		
		GUI.SetNextControlName("textfield03");
		secondTestWord = GUI.TextField(rectAdapt(240, 350, 800, 150), secondTestWord, 40);
		
		if (UnityEngine.Event.current.type == EventType.Repaint)
		{
			if (GUI.GetNameOfFocusedControl() == "textfield03")
			{
				if (secondTestWord == translationStartString)
					secondTestWord = "";
			}
			else
			{
				if (secondTestWord == "")
					secondTestWord = translationStartString;
			}
		}
		
		if(secondTestWord != translationStartString)
			if(GUI.Button(rectAdapt(930, 665, 340, 125), "Check translation!"))
				checkWord();
		
		if(moreThanOneWordExist)
			if(GUI.Button(rectAdapt(10, 10, 125, 125), "Test\ndifferent\nword"))
				getWord();
			
		if(GUI.Button(rectAdapt(1145, 10, 125, 125), "Delete\nall\nwords"))
			switchState("DeleteWords");
	}
	else if(state == "Correct")
	{
		GUI.Box(rectAdapt(10, 300, 1260, 200), "Correct!\n\n" + currentTranslation + " means " + firstTestWord + "!");
		
		if(GUI.Button(rectAdapt(930, 665, 340, 125), "Another one!"))
			switchState("CheckWords");
		
		if(GUI.Button(rectAdapt(10, 665, 340, 125), "Add new words\nto list!"))
			switchState("EnterWords");
	}
	else if(state == "Incorrect")
	{
		GUI.Box(rectAdapt(10, 300, 1260, 200), "Incorrect\n\n" + firstTestWord + " is " + currentTranslation);
		
		if(GUI.Button(rectAdapt(930, 665, 340, 125), "Again!"))
			switchState("CheckWords");
		
		if(GUI.Button(rectAdapt(10, 665, 340, 125), "Add new words\nto list!"))
			switchState("EnterWords");
	}
	else if(state == "WordEntered")
	{
		GUI.Box(rectAdapt(10, 300, 1260, 200), "Words saved!\n\n" + firstWord + " - " + secondWord + "!");
		
		if(GUI.Button(rectAdapt(930, 665, 340, 125), "Add another one!"))
			switchState("EnterWords");
		
		if(wordsExist)
			if(GUI.Button(rectAdapt(10, 665, 340, 125), "Test\nYourself!"))
				switchState("CheckWords");
	}
	else if(state == "DeleteWords")
	{
		GUI.Box(rectAdapt(10, 300, 1260, 200), "This will delete all words you have entered.\n\nAre you sure?");
		
		if(GUI.Button(rectAdapt(930, 665, 340, 125), "Yes.\nDelete everything."))
		{
			deleteAllWords();
			switchState("EnterWords");
		};
		
		if(GUI.Button(rectAdapt(10, 665, 340, 125), "No.\nGo back."))
			switchState("CheckWords");
	}
	else if(state == "Intro")
	{
		GUI.Label(rectAdapt(10, 100, 1260, 300), "Vacabulario\nExplosivo!");
		GUI.Box(rectAdapt(10, 450, 1260, 100), "by Matthias Zarzecki");
		
		if(GUI.Button(rectAdapt(470, 665, 340, 125), "Let's go!"))
			switchState("EnterWords");
	}
	else if(state == "Quit")
	{
		GUI.Box(rectAdapt(10, 300, 1260, 200), "Are you sure you want to quit?");
		
		if(GUI.Button(rectAdapt(930, 665, 340, 125), "Yes.\nQuit."))
			quitApplication();
		
		if(GUI.Button(rectAdapt(10, 665, 340, 125), "No.\nI want to learn!"))
			switchState("EnterWords");
	}
}

private function getWord()
{
	var numberOfWords: int = PlayerPrefs.GetInt("ve_index");
	var newIndex: int = Random.Range(0, numberOfWords);
	
	var currentString = PlayerPrefs.GetString("ve_" + newIndex);
	
	var words: String[] = currentString.Split("|"[0]);
	
	firstTestWord = words[0];
	currentTranslation = words[1];
	
	secondTestWord = translationStartString;
	
	Debug.Log("Got string saved under index " + newIndex + ", string is " + currentString + ", new word is " + words[1]);
}

private function checkWord()
{
	if(currentTranslation == secondTestWord)
		switchState("Correct");
	else
		switchState("Incorrect");
}

private function saveString()
{
	var index: int = PlayerPrefs.GetInt("ve_index");

	var newName: String = "ve_" + index;
	var newString: String = firstWord + "|" + secondWord;
	
	PlayerPrefs.SetString(newName, newString);
	PlayerPrefs.SetInt("ve_index", index + 1);
	
	Debug.Log("Saved " + newString + " as " + newName + ", new index is " + (index + 1));
}

private function checkIfWordsExist()
{
	var index: int = PlayerPrefs.GetInt("ve_index");
	
	Debug.Log("There exist " + index + " words");

	if(index <= 0)
	{
		wordsExist = false;
		moreThanOneWordExist = false;
	}
	else if(index == 1)
	{
		wordsExist = true;
		moreThanOneWordExist = false;
	}
	else if(index > 1)
	{
		wordsExist = true;
		moreThanOneWordExist = true;
	}	
}

private function switchState(newState: String)
{
	if(newState == "EnterWords")
	{
		firstWord = firstWordStartString;
		secondWord = secondWordStartString;
		
		checkIfWordsExist();
	}
	else if(newState == "WordEntered")
	{
		saveString();
		checkIfWordsExist();
	}
	else if(newState == "CheckWords")
	{
		getWord();
	}
	else if(newState == "WordEntered")
	{
		saveString();
	}

	state = newState;
}

private function deleteAllWords()
{
	PlayerPrefs.SetInt("ve_index", 0);
	
	Debug.Log("Deleted all saved words");
}

private function quitApplication()
{
	Application.Quit();
}

private function adaptToScreen()
{
	if(!hasAdapted)
	{
		hasAdapted = true;
		
		GUI.skin.box.fontSize       = 42 * Screen.width / 1280.0;
		GUI.skin.label.fontSize     = 96 * Screen.width / 1280.0;
		GUI.skin.textField.fontSize = 36 * Screen.width / 1280.0;
		GUI.skin.button.fontSize    = 28 * Screen.width / 1280.0;
	}
}

private function rectAdapt(x:int, y:int, width:int, height:int): Rect
{
	return Rect( (x*Screen.width)/1280, (y*Screen.height)/800, (width*Screen.width)/1280, (height*Screen.height)/800 );
}