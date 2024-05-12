export const hierarachical = (categories) => {
  const rootCategories = categories.filter((cate) => cate.parentId === null);
  const resultsHierarachical = [];

  addListCategory(rootCategories, 0, resultsHierarachical);
  return resultsHierarachical;
};

function addListCategory(categories, level, resultsHierarachical) {
  categories.forEach((cate) => {
    const indentedName = `${"--".repeat(level)} ${cate.name}`;
    resultsHierarachical.push({ ...cate, name: indentedName });
    if (cate.children.length > 0) {
      addListCategory(cate.children, level + 1, resultsHierarachical);
    }
  });
}
