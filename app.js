let cardsData = [];
let selectedNumbers = [];
let cardCount = parseInt(localStorage.getItem("cardCount")||"1");
let slotCards = Array(4).fill(null);

const cardCountSelect = document.getElementById("cardCount");
cardCountSelect.value = cardCount;

fetch("bingo_cards.json").then(r=>r.json()).then(data=>{
  cardsData = data;
  render();
});

cardCountSelect.onchange = e=>{
  cardCount = parseInt(e.target.value);
  localStorage.setItem("cardCount",cardCount);
  render();
};

function toggle(num){
  if(!num) return;
  if(selectedNumbers.includes(num)){
    selectedNumbers = selectedNumbers.filter(n=>n!==num);
  } else {
    selectedNumbers.push(num);
  }
  render();
}

function render(){
  const container = document.getElementById("cards");
  container.innerHTML="";
  container.style.display="grid";
  container.style.gridTemplateColumns = cardCount<=2?`repeat(${cardCount},1fr)`:"repeat(2,1fr)";

  for(let i=0;i<cardCount;i++){
    const slot=document.createElement("div");
    slot.className="cardSlot";

    const row=document.createElement("div");
    row.style.display="flex";
    row.style.gap="6px";

    const input=document.createElement("input");
    input.type="number";
    input.placeholder="Card #";

    const btn=document.createElement("button");
    btn.textContent="▶";
    btn.onclick=()=>{
      const n=parseInt(input.value);
      if(n>=1 && n<=cardsData.length){
        slotCards[i]=cardsData[n-1];
        render();
      }
    };

    row.appendChild(btn);
    row.appendChild(input);

    const grid=document.createElement("div");
    grid.className="grid";

    const card = slotCards[i]?.numbers?.flat() || Array(25).fill("");
    card.forEach((num,idx)=>{
      const cell=document.createElement("div");
      cell.className="cell";
      if(idx===12){ 
        cell.textContent="FREE"; 
        cell.classList.add("free"); 
      } else {
        cell.textContent=num||""; 
      }
      if(selectedNumbers.includes(num)) cell.classList.add("selected");
      cell.onclick=()=>toggle(num);
      grid.appendChild(cell);
    });

    slot.appendChild(row);
    slot.appendChild(grid);
    container.appendChild(slot);
  }
}
