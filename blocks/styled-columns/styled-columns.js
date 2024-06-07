export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`styled-columns-${cols.length}-cols`);

  if (block.children.length > 1) {
    for (let i = 0; i < cols.length; i += 1) {
      const color = cols[i].textContent.toLowerCase().replaceAll(/[\s_]+/g, '-');
      block.children[1].children[i].classList.add(color);
    }
    block.firstElementChild.remove();
  }
}
