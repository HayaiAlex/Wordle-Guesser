// enter in my graph

// check line by line 
// compare with dictionary list

// nicely display possible guesses

window.onload=function() {
  document.getElementById("entry_table").addEventListener("click",setColour)
}

colours = {
  white: "rgb(255, 255, 255)",
  yellow: "rgb(221, 188, 88)",
  green: "rgb(74, 178, 100)",
}

let newColour = colours["green"];

function keyBoxClicked(colour) {
  console.log(colour);

  colourBoxes = {
    whitebox: document.getElementById("whitebox"),
    yellowbox: document.getElementById("yellowbox"),
    greenbox: document.getElementById("greenbox"),
  }

  // reset box outlines
  for (let box in colourBoxes) {
    colourBoxes[box].style.border = "1px solid black";
  }

  // set coloured box outline
  colourBoxes[colour+"box"].style.border = "2px solid green";
  newColour = colours[colour];
}

function setColour(clicked) {
  element = clicked.target
  if (element.nodeName != "TD") {
    return
  }

  element.style.backgroundColor = newColour;
  
}

function findLastLine() {
  var table = document.getElementById("entry_table")
  var rows = (table.children[0].children)

  var last_row = 0;
  for (var i=5; i >= 0; i--) {
    // console.log("checking row",i,rows[i]);
    var row = rows[i];
    var cells = row.children;
    for (var j=0; j < 5; j++) {
      // console.log("checking td",j,cells[j]);
      var cell = cells[j]
      last_row = i
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

async function getWords() {
  // Thank you Jack <3
  
  let word_list_promise = fetch("five_letter_list.txt")
  .then(function (res) {
    return res.text();
  })
  .then(function (text) {
    return text.split("\n");
  });
  let word_list = await word_list_promise;
  return word_list;
  /*
  .then(function (text) {
    // Text is a long string containing the entire file
    // You can split on the newline to load it into an array
    const words = text.split("\n");
    console.log(words);

    // Even better, you can load it into a Set
    const wordsSet = new Set(words);
    console.log(wordsSet);

    // This is O(n)
    console.log(words.includes("is"));

    // This is roughly O(1)
    console.log(wordsSet.has("is"));

    // Can use a list or a set. If you only need to check if
    // the word is in the set, then the set is the most efficient
    // data structure to use

    // To loop through the words
    for (let word of wordsSet) {
      console.log("FOR: ", word);
    }

    // Or
    wordsSet.forEach(function (word) {
      console.log("FOR each: ", word);
    });

    // And a quick note of anonymous functions.
    // You may have also seen this notation
    // wordsSet.forEach((word) => console.log("Arror: ", word));
  });
  */
}

async function guessWords(word,row) {
  let words = await getWords();

  // let template = [0,g,g,g,g]
  // given windy
  // .indy
  let pattern = "";
  for (let i=0; i < row.children.length; i++) {
    let td = row.children[i];
    let bgColor = td.style.backgroundColor;
    if (bgColor == "" || bgColor == colours.white) {
      pattern = pattern + ".";
    } else if (bgColor == colours.green) {
      pattern = pattern + word[i];
    } else {

    }
  }
  console.log(pattern);
  for (let word of words) {
    if (word.search(pattern) >= 0) {
      console.log(word);
    }
  }
  

}

function findGuesses() {
  
  // create a regex/filter based final word
  // and missing letters
  // e.g w*nd* might guess windy

  var lastLine = findLastLine()

  var table = document.getElementById("entry_table")
  var rows = (table.children[0].children)
  let word = document.getElementById("final_word").value;
  // add a check for lastline == 0 (-1 is no row)
  guessWords(word,rows[lastLine-1])

}