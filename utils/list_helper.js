const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reduce = (suma, item) => suma + item.likes;

  return blogs.reduce(reduce, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
