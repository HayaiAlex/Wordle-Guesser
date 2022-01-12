// enter in my graph

// check line by line 
// compare with dictionary list

// nicely display possible guesses

window.onload=function() {
  document.getElementById("entry_table").addEventListener("click",setColour)
}

wordfiles = [
  "five_letter_list_google_10kfrequency_usa.txt",
  "five_letter_list_2.txt",
]


// colours = {
//   white: "rgb(255, 255, 255)",
//   yellow: "rgb(221, 188, 88)",
//   green: "rgb(74, 178, 100)",
// }

let newColour = "green";

function keyBoxClicked(colour) {

  colourBoxes = {
    whitebox: document.getElementById("whitebox"),
    yellowbox: document.getElementById("yellowbox"),
    greenbox: document.getElementById("greenbox"),
  }

  // reset box outlines
  for (let box in colourBoxes) {
    colourBoxes[box].setAttribute("data-selected","false");
  }

  // set coloured box outline
  colourBoxes[colour+"box"].setAttribute("data-selected","true");
  newColour = colour
}

function setColour(clicked) {
  element = clicked.target
  if (element.nodeName != "TD") {
    return
  }

  element.setAttribute("data-colour",newColour);
  
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
      if (cell.dataset.colour != "green") {
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

async function getWords(file) {
  // Thank you Jack <3
  
  let word_list_promise = fetch(file)
  .then(function (res) {
    return res.text();
  })
  .then(function (text) {
    let words = text.split("\n");
    // removes carriage returns
    let newList = [];
    for (let word of words) {
      newList.push(word.substring(0,5));
    }
    return newList;
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

async function guessWords(final_word,row,file) {
  let words = await getWords(file);

  // let template = [0,g,g,g,g]
  // given windy
  // .indy
  let patterns = [""];
  for (let i=0; i < row.children.length; i++) {
    let td = row.children[i];
    let bgColor = td.dataset.colour;
    
    let newPatterns = [];

    // if white box accept any letter
    if (bgColor == undefined || bgColor == "white") {
      for (let pattern of patterns) {
        newPatterns.push(pattern + ".");
      }

    // if green accept only the correct letter
    } else if (bgColor == "green") {
      for (let pattern of patterns) {
        newPatterns.push(pattern + final_word[i]);
      }

    // if yellow accept any letter from a different position
    } else if (bgColor == "yellow") {
      // go through every letter in the word it could possibly be
      let letterPosition = i;
      let currentletterPosition = 0;
      for (let letter of final_word) {
        // except itself which is in the incorrect position
        // and add it to all the patterns
        if (currentletterPosition != letterPosition) {

          // first add the letter to all current patterns
          // subsequent letters need to make a new pattern
          // rather than adding onto the same pattern and
          // creating a longer than 5 letter word.
          for (let pattern of patterns) {
            if (pattern.length == i) {
              newPatterns.push(pattern + letter);
            } else {
              // create a new pattern instead
              let newPattern = pattern.substring(0,i-1)
              newPattern = newPattern + letter;
              newPatterns.push(newPattern);
            }
          }
        }
        currentletterPosition++;
      }
    }
    patterns = newPatterns;
  }
  let results = [];

  for (let pattern of patterns) {
    
    for (let word of words) {
      if (word.search(pattern) >= 0) {
        if (word != final_word) {
          results.push(word);
        }
      }
    }
  }

  if (results.length == 0) {
    return guessWords(final_word,row,wordfiles[1])
  }
  
  return results;
}

function clearResults() {
  let results = document.getElementById("results");

  while (results.lastChild) {
    results.removeChild(results.lastChild);
  }
}

function displayResults(row,results) {

  let results_container = document.getElementById("results");

  let div = document.createElement("div");
  div.className = "guessContainer";
  results_container.appendChild(div);

  let header = document.createElement("h3");
  header.innerHTML = "Row "+String(row);
  div.appendChild(header);

  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  div.appendChild(table);
  table.appendChild(tbody);

  let entry_table = document.getElementById("entry_table");
  let rowtds = entry_table.children[0].children[row-1].cloneNode(true);
  tbody.appendChild(rowtds);

  let p = document.createElement("p");
  p.innerHTML = "You might have guessed with..."
  div.appendChild(p);

  let scrollbox = document.createElement("div")
  scrollbox.className = "scrollBox";
  div.appendChild(scrollbox);

  let ul = document.createElement("ul");
  scrollbox.appendChild(ul)

  for (let result of results) {
    let li = document.createElement("li");
    li.innerHTML = result;
    ul.appendChild(li);
  }
}

async function findGuesses() {
  
  // create a regex/filter based final word
  // and missing letters
  // e.g w*nd* might guess windy

  var lastLine = findLastLine()

  var table = document.getElementById("entry_table")
  var rows = (table.children[0].children)
  let word = document.getElementById("final_word").value.toLowerCase();

  clearResults()
  for (let rowNum=0; rowNum<lastLine; rowNum++) {
    
    // add a check for lastline == 0 (-1 is no row)
    let results = await guessWords(word,rows[rowNum],wordfiles[0]);
    // since rows start at 0, add 1 to rows

    displayResults(rowNum+1,results)

  }

}

function worldeEntryChanged() {
  // Two formats
  // 1. Entire message copied with Wordle header
  // 2. Just boxes copied
  // For both can get bottom 5 columns
  // and validate accpetable contents

  // Wordle 205 5/6

  // ⬜⬜⬜🟨⬜
  // ⬜⬜🟨⬜🟨
  // 🟨🟨⬜⬜⬜
  // 🟨🟩🟨⬜⬜
  // 🟩🟩🟩🟩🟩

  // ⬜⬜⬜🟨⬜
  // ⬜⬜🟨⬜🟨
  // 🟨🟨⬜⬜⬜
  // 🟨🟩🟨⬜⬜
  // 🟩🟩🟩🟩🟩

  let textarea = document.getElementById("wordle_format_input");
  let input = textarea.value;
  textarea.value = "";
  console.log(input);

  // remove new lines
  input = input.replace(/[\n\r]/g, '');
  // get wordle emojis
  input = input.match(/[⬜🟨🟩]+/g);
  // get string out from array
  input = input[0];

  var table = document.getElementById("entry_table")
  var rows = (table.children[0].children)
  let counter = 0;
  for (let square of input) {
    let td = rows[Math.floor(counter/5)].children[counter%5];
    if (square == "⬜") {
      td.dataset.colour = "white";
    } else if (square == "🟨") {
      td.dataset.colour = "yellow";
    } else if (square == "🟩") {
      td.dataset.colour = "green";
    }
    counter++;
  }

}