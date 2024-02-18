const buttons = document.querySelectorAll('.inputBlock button');
const stopBtn = document.querySelector('form .startstopBtn')
const finishDiv = document.querySelector('.finished')
const form = document.querySelector('form')
const highscoreContainer = document.querySelector('.hs-container')

let solved = 0
let startTime

const solution = {
    de:{

        Reihe: ':-):-D:-O:-P;-)=):D=O=P@-@-#-#',
        Satz: 'Anna\'s neues E-Mail-Passwort lautet: Sicher!#_1234.',
        EMail: 'hans-gretel@waldweg.de',
        HTML: '<!DOCTYPE html>\n<html lang="de">\n<head>\n<title>Meine HTML-Seite</title>\n</head>\n<body>\n<h1>Willkommen auf meiner Webseite</h1>\n<p>Dies ist ein einfacher HTML-Absatz.</p>\n</body>\n</html>',
        LangerText: `"Prof. Elm fand um 22:03 Uhr eine Notiz: 'Geheimcode: [2*H2O + 3xNa] - @Elixier#1'. 'Rätselhaft', murmelte er und tippte eine E-Mail: 'Brauche Hilfe bei <Code> Lösung; Treffen um 9:00?'. Ein schnelles pling signalisierte die Zustimmung seiner Kollegin: 'Ja, schau in {Buch_S.47} > wichtige Hinweise.' Mit einem Lächeln und einem Klick auf die Schaltfläche Senden bereitete er sich auf die Entschlüsselung vor."`
    },
    en:{
        Reihe: ':-):-D:-O:-P;-)=):D=O=P@-@-#-#',
        Satz: `Anna's new E-Mail Password is: Secure!#_1234.`,
        EMail: 'hans-gretel@waldweg.de',
        HTML: '<!DOCTYPE html>\n<html lang="de">\n<head>\n<title>Meine HTML-Seite</title>\n</head>\n<body>\n<h1>Willkommen auf meiner Webseite</h1>\n<p>Dies ist ein einfacher HTML-Absatz.</p>\n</body>\n</html>',
        LangerText: `"Prof. Elm found a note at 22:03: 'Secret code: [2*H2O + 3xNa] - @Elixir#1'. 'Puzzling,' he muttered and typed an email: 'Need help with <code> solution; meeting at 9:00?'. A quick *ding* signaled his colleague's approval: 'Yes, check {Book_S.47} > important clues.' With a smile and a click on the Send button, he prepared to decode."`
    }
}

// Text zu Kopieren ohne Kommentierungszeichen
// "Prof. Elm fand um 22:03 Uhr eine Notiz: 'Geheimcode: [2*H2O + 3xNa] - @Elixier#1'. 'Rätselhaft', murmelte er und tippte eine E-Mail: 'Brauche Hilfe bei <Code> Lösung; Treffen um 9:00?'. Ein schnelles pling signalisierte die Zustimmung seiner Kollegin: 'Ja, schau in {Buch_S.47} > wichtige Hinweise.' Mit einem Lächeln und einem Klick auf die Schaltfläche Senden bereitete er sich auf die Entschlüsselung vor."


function submitForm(e){
    e.preventDefault()
}


function start(){
// Startet das erste Spiel, Intro ausgeblendet, Formular eingeblendet, der Timer gesetzt
    const divStart = document.querySelector('.start')
    const form = document.querySelector('form')
    divStart.classList.add("hide")
    form.classList.remove('hide')
    startTime = Date.now()
}


function stop(){
// Beendet Spiel, Timer gestoppt, Formular ausgeblendet, Zeit angezeigt
    const timeSpan = finishDiv.querySelector('.time')
    form.classList.add('hide')
    finishDiv.classList.remove('hide')
    stopTime=Math.trunc((Date.now()-startTime)/1000)
    timeSpan.textContent=`${stopTime} s` 
    let highH3 = finishDiv.querySelector('h3')
    if (compareHighscore(stopTime)){
       highH3.classList.remove('hide') 
    } else {
        highH3.classList.add('hide') 
    }
}

function startAgain(){
// Neues Spiel, Formular zurückgesetzt und eingeblendet, Timer erneut gestartet
    const textareas = document.querySelectorAll('textarea')
    const inputDivs = document.querySelectorAll('.inputBlock')

    textareas.forEach((area => {
        area.value=''
        area.disabled=false
    }))

    inputDivs.forEach(inputDiv => inputDiv.classList.remove('solved'))
    finishDiv.classList.add('hide')
    form.classList.remove('hide')
    startTime=Date.now()
    displayHighscore()
}

function checkText(e){
// Eingabe überprüfen, Formular deaktivieren bei Erfolg bzw. Fehler anzeigen 
    const input = e.target.closest('.inputBlock')
    const missingP = input.querySelector('.missing');
    const textArea = input.querySelector('textarea')
    // ermitteln der Document-Sprache zum verwenden des jeweiligen checks
    const lang = document.querySelector("html").attributes.lang.value
    const solutionText = solution[lang][e.target.id]
    
    if (textArea.value.trim() === solutionText){
        input.classList.add('solved')
        textArea.disabled=true
        missingP.textContent = '';
        missingP.classList.add('hide')
        solved++
    }else {
        let matchingText = '';
        // Ermittlung der Länge des kürzeren Strings, um die Iteration zu begrenzen
        const minLength = Math.min(textArea.value.length, solutionText.length);
        // Durchgehen beider Strings bis zum ersten nicht übereinstimmenden Zeichen
        for (let i = 0; i < minLength; i++) {
            if (textArea.value[i] === solutionText[i]) {
                matchingText += textArea.value[i];
            } else {
                break; // Beenden der Schleife beim ersten nicht übereinstimmenden Zeichen
            }
        }
        // Einfügen des übereinstimmenden Textes in .missing
        missingP.textContent = matchingText+" ";
        missingP.classList.remove('hide')
    }

    // Abschicken button einblenden wenn alle gelöst sind
    if (buttons.length===solved) {
        stopBtn.classList.remove('hide')
    }
}

// Highscore functions
function getHighscore(){
   return localStorage.getItem('highscore-tippen')
}

function setHighscore(newScore){
    localStorage.setItem('highscore-tippen', newScore)
}

function compareHighscore(newScore){
    let highscore = getHighscore()
    if (!highscore) {
        setHighscore(newScore)
        return true
    } else {
        if (highscore<newScore){
            return false
        } else {
            setHighscore(newScore)
            return true
        }
    }
}

function displayHighscore(){
    let highscore = getHighscore()
    if (highscore){
        highscoreContainer.classList.remove('hide')
        highscoreContainer.querySelector('#score').textContent=highscore
    }
}

// Beim Spielstart
displayHighscore()


for (let i=0; i<buttons.length; i++){
    buttons[i].addEventListener('click', (e) => checkText(e))
}



