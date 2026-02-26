let cardsData = [];

fetch("bingo_cards.json")
  .then(r => r.json())
  .then(data => {
    cardsData = data;
    render();
  });

let selectedNumbers = [];
let cardCount = localStorage.getItem("cardCount") || 1;
let pickedCards = JSON.parse(localStorage.getItem("pickedCards")) || [];

const cardCountSelect = document.getElementById("cardCount");
const cardPickerInput = document.getElementById("cardPicker");

cardCountSelect.value = cardCount;
cardPickerInput.value = pickedCards.join(",");

cardCountSelect.onchange = e=>{
  cardCount = e.target.value;
  localStorage.setItem("cardCount", cardCount);
  render();
};

cardPickerInput.onchange = e=>{
  pickedCards = e.target.value.split(",").map(n=>parseInt(n.trim())).filter(n=>n>=1 && n<=150);
  localStorage.setItem("pickedCards", JSON.stringify(pickedCards));
  render();
};

function toggle(num){
  if(num === null) return;
  if(selectedNumbers.includes(num)){
    selectedNumbers = selectedNumbers.filter(n => n !== num);
  } else {
    selectedNumbers.push(num);
  }
  render();
}

function render(){
  const container = document.getElementById("cards");
  container.innerHTML = "";

  container.style.display = "grid";
  if(cardCount <= 2){
    container.style.gridTemplateColumns = `repeat(${cardCount}, 1fr)`;
  } else {
    container.style.gridTemplateColumns = "repeat(2, 1fr)";
  }

  let cardsToShow = [];

  if(pickedCards.length){
    cardsToShow = pickedCards.slice(0, cardCount).map(n => cardsData[n-1]);
  } else {
    cardsToShow = cardsData.slice(0, cardCount);
  }

  cardsToShow.forEach(cardObj=>{
    const card = cardObj.numbers.flat();
    const div = document.createElement("div");
    div.className="card";

    const grid = document.createElement("div");
    grid.className="grid";

    card.forEach((num,i)=>{
      const cell=document.createElement("div");
      cell.className="cell";

      if(i===12){
        cell.textContent="FREE";
        cell.classList.add("free");
      } else {
        cell.textContent=num;
      }

      if(selectedNumbers.includes(num)) cell.classList.add("selected");

      cell.onclick=()=>toggle(num);
      grid.appendChild(cell);
    });

    div.appendChild(grid);
    container.appendChild(div);
  });
}
