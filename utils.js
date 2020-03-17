import { hsluvToHex } from "hsluv";

export const pathCalc = ([mx, my, x, y]) => {
  const x1 = (mx + x) / 2;
  const y1 = Math.max(my, y) + 50;
  return `M ${mx} ${my} Q ${x1} ${y1} ${x} ${y}`;
};

export const rerenderPath = (svg, points) => {
  const path = svg.getElementsByClassName("wire-path")[0];
  path.setAttribute("d", pathCalc(points));
};

export const isSocket = (context, { pos }) => {
  const el = document.elementFromPoint(pos[0], pos[1]);
  return el && !!findUpTree(context.socketList, el);
};

export const findUpTree = (hitList, element) =>
  hitList.get(element) ||
  (element.parentElement ? findUpTree(hitList, element.parentElement) : null);

export const getColor = (() => {
  let hue = Math.floor(Math.random() * 360);
  return () => {
    hue += 30;
    hue = hue <= 360 ? hue : hue % 360;
    return hsluvToHex([hue, 80, 70]);
  };
})();

export const createPath = (el, points) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathCalc(points));
  path.setAttribute("class", "wire-path");
  path.setAttribute("stroke", getColor());
  svg.setAttribute("class", "wire");
  svg.appendChild(path);
  el.appendChild(svg);
  return svg;
};

export const logShit = (c, e) => console.log(c, e);

export const dragListener = area => () => cb => {
  const moveListener = ({ clientX, clientY }) => {
    cb({ type: "MOVE", pos: [clientX, clientY] });
  };
  area.addEventListener("pointermove", moveListener);
  return () => area.removeEventListener("pointermove", moveListener);
};
