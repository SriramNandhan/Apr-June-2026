const board = document.getElementById("board");
const resetBtn = document.getElementById("reset-btn");
const message = document.getElementById("message");

const size = 10;
const mineCount = 10;

let grid = [];
let gameOver = false;

function createGrid() {
  grid = [];
  board.innerHTML = "";
  message.textContent = "";
  gameOver = false;

  for (let r = 0; r < size; r++) {
    let row = [];
    for (let c = 0; c < size; c++) {
      row.push({
        mine: false,
        revealed: false,
        neighborMines: 0,
        element: null,
        row: r,
        col: c
      });
    }
    grid.push(row);
  }
}

function placeMines() {
  let placed = 0;

  while (placed < mineCount) {
    let r = Math.floor(Math.random() * size);
    let c = Math.floor(Math.random() * size);

    if (!grid[r][c].mine) {
      grid[r][c].mine = true;
      placed++;
    }
  }
}

function countNeighbors() {
  const dirs = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].mine) continue;

      let count = 0;

      for (let [dr, dc] of dirs) {
        let nr = r + dr;
        let nc = c + dc;

        if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc].mine) {
          count++;
        }
      }

      grid[r][c].neighborMines = count;
    }
  }
}

function renderBoard() {
  board.innerHTML = "";

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];

      const div = document.createElement("div");
      div.classList.add("cell");

      div.addEventListener("click", () => revealCell(r, c));

      cell.element = div;
      board.appendChild(div);
    }
  }
}

function revealCell(r, c) {
  if (gameOver) return;

  const cell = grid[r][c];

  if (cell.revealed) return;

  cell.revealed = true;
  cell.element.classList.add("revealed");

  if (cell.mine) {
    cell.element.classList.add("mine");
    endGame(false);
    return;
  }

  if (cell.neighborMines > 0) {
    cell.element.textContent = cell.neighborMines;
  }

  checkWin();
}

function endGame(won) {
  gameOver = true;

  message.textContent = won ? "🎉 You Win!" : "💥 Game Over!";

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];

      if (cell.mine) {
        cell.element.classList.add("mine");
        cell.element.textContent = "💣";
      }
    }
  }
}

function checkWin() {
  let safe = 0;
  let revealed = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];
      if (!cell.mine) safe++;
      if (cell.revealed && !cell.mine) revealed++;
    }
  }

  if (safe === revealed) endGame(true);
}

function startGame() {
  createGrid();
  placeMines();
  countNeighbors();
  renderBoard();
}

resetBtn.addEventListener("click", startGame);

startGame();