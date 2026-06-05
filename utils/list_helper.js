const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reduce = (suma, item) => suma + item.likes;

  return blogs.reduce(reduce, 0);
};

const favoriteBlog = (blogs) => {
  const favorite = (favorite, blog) => {
    console.log("favorite", favorite);
    console.log("blog", blog);
    console.log("============== \n");
    return blog.likes > favorite.likes ? blog : favorite;
  };

  return blogs.reduce(favorite);
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
