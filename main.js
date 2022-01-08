// enter in my graph

// check line by line 
// compare with dictionary list

// nicely display possible guesses

window.onload=function() {
  document.getElementById("entry_table").addEventListener("click",toggleColour)
}

colours = {
  white: "rgb(255, 255, 255)",
  yellow: "rgb(221, 188, 88)",
  green: "rgb(74, 178, 100)",
}

function toggleColour(clicked) {
  element = clicked.target
  if (element.nodeName != "TD") {
    return
  }

  bgColor = element.style.backgroundColor
  
  if (bgColor == "" || bgColor == colours.white) {
    element.style.backgroundColor = colours.yellow;
  } else if (bgColor == colours.yellow) {
    element.style.backgroundColor = colours.green;
  } else {
    element.style.backgroundColor = colours.white;
  }
  
}

function findLastLine() {
  var table = document.getElementById("entry_table")
  var rows = (table.children[0].children)

  var last_row = 0;
  for (var i=5; i >= 0; i--) {
    var row = rows[i];
    var cells = row.children;
    for (var j=0; j < 5; j++) {
      var cell = cells[j]
      last_row = j
      if (cell.style.backgroundColor != colours.green) {
        last_row = 0;
        break;
      }
    }
    if (last_row != 0) {
      return last_row
    }
  }
  return last_row
}

function guessWords() {
  var words = "words.txt";
  var reader = new FileReader();
  
  reader.readAsText(words);
  reader.onload = function() {
    console.log(reader.result);
  }
}

function findGuesses() {
  
  // create a regex/filter based final word
  // and missing letters
  // e.g w*nd* might guess windy

  var lastLine = findLastLine()

  var table = document.getElementById("entry_table")
  var rows = (table.children[0].children)
  guessWords(rows[lastLine-1])

}