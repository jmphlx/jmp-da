/* eslint-disable import/prefer-default-export */
function getCenterOf(element) {
  const {
    x, y, width, height,
  } = element.getBoundingClientRect();

  return {
    x: Math.floor(x + window.scrollX + width / 2),
    y: Math.floor(y + window.scrollY + height / 2),
  };
}

export {
  getCenterOf,
};
