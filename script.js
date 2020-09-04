"use strict";

const rulesBtn = document.getElementById("rules-btn"),
  closeBtn = document.getElementById("close-btn"),
  rules = document.getElementById("rules");

// Rules and close event handler
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
