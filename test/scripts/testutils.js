/* eslint-disable import/prefer-default-export */
function getCenterOf(element) {
  const {
    x, y, width, height,
  } = element.getBoundingClientRect();

  return {
    x: Math.floor(x + window.pageXOffset + width / 2),
    y: Math.floor(y + window.pageYOffset + height / 2),
  };
}

export {
  getCenterOf,
};
