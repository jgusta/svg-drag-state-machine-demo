import { interpret } from "xstate";
import { dragMachine as _dragMachine } from "./dragMachine";

const area = document.getElementById("area");
area.style.position = "relative";
const socketList = new Map();

for (const s of document.getElementsByClassName("socket")) {
  socketList.set(s, s);
}

let dragMachine = _dragMachine(area, socketList);

const dragService = interpret(dragMachine).start();

area.addEventListener("pointerdown", ({ clientX, clientY }) => {
  dragService.send({
    type: "POINTERDOWN",
    pos: [clientX, clientY]
  });
});
area.addEventListener("pointerleave", ({ clientX, clientY, target }) => {
  target === area &&
    dragService.send({
      type: "POINTERLEAVE",
      pos: [clientX, clientY]
    });
});
area.addEventListener("pointerup", ({ clientX, clientY }) => {
  dragService.send({
    type: "POINTERUP",
    pos: [clientX, clientY]
  });
});

window.dragMachine = dragMachine;
