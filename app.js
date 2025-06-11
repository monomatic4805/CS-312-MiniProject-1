const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let posts = [];

app.get('/', (req, res) => {
  const selectedCategory = req.query.category;
  let filteredPosts = posts;

  if (selectedCategory && selectedCategory !== '') {
    filteredPosts = posts.filter(post => post.category === selectedCategory);
  }

  res.render('index', { posts: filteredPosts });
});

app.post('/add', (req, res) => {
  const { author, title, content, category } = req.body;
  const newPost = {
    id: Date.now(),
    author,
    title,
    content,
    category,
    createdAt: new Date().toLocaleString()
  };
  posts.push(newPost);
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).send('Post not found');
  res.render('edit', { post });
});

app.post('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).send('Post not found');
  post.author = req.body.author;
  post.title = req.body.title;
  post.content = req.body.content;
  post.category = req.body.category;
  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
