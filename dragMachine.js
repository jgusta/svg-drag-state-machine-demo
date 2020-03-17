import { Machine, assign } from "xstate";
import { isSocket, createPath, dragListener } from "./utils";
import { rerenderPath, logShit } from "./utils";
export const dragMachine = (area, socketList) => {
  const div = document.createElement("div");
  div.style.position = "absolute";
  area.appendChild(div);
  const initialContext = {
    div,
    area,
    socketList,
    start: [0, 0],
    end: [0, 0],
    wire: null
  };

  return Machine(
    {
      id: "drag-machine",
      context: initialContext,
      initial: "idle",
      states: {
        idle: {
          on: {
            POINTERDOWN: {
              target: "drag",
              cond: isSocket,
              actions: ["setStart", "setEnd", "startPath"]
            }
          }
        },
        drag: {
          activities: ["beeping"],
          invoke: {
            src: dragListener(area)
          },
          on: {
            MOVE: { actions: ["setEnd", "updatePath"] },
            POINTERLEAVE: "dragCancel",
            POINTERUP: [
              { target: "connect", cond: isSocket },
              { target: "dragCancel" }
            ]
          }
        },
        dragCancel: {
          entry: "removeWire",
          on: { "": "idle" }
        },
        connect: {
          on: { "": "idle" }
        }
      }
    },
    { actions, activities }
  );
};

const actions = {
  startPath: assign({
    wire: ({ div, start, end }) => createPath(div, [...start, ...end])
  }),
  removeWire: assign({
    wire: ({ wire }) => {
      wire.parentNode.removeChild(wire);
      return {
        wire: null
      };
    }
  }),
  updatePath: ({ wire, start, end }) => rerenderPath(wire, [...start, ...end]),
  setStart: assign({
    start: (_, { pos }) => pos
  }),
  setEnd: assign({
    end: (_, { pos }) => pos
  }),
  logShit
};

const activities = {
  beeping: () => {
    // Start the beeping activity
    const interval = setInterval(() => {
      const indicator = document.getElementById("indicator");
      if (indicator.style.backgroundColor === "red") {
        indicator.style.backgroundColor = "blue";
      } else {
        indicator.style.backgroundColor = "red";
      }
    }, 100);

    // Return a function that stops the beeping activity
    return () => clearInterval(interval);
  }
};
