const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/Todos", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  title: String,
  status: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Todolist", userSchema);

app.get("/todos", async (req, res) => {
  try {
    const todos = await User.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/todos/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Please enter a valid id" });
  }
  try {
    const result = await User.findOne({ _id: id });
    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching task" });
  }
});

app.post("/todos", async (req, res) => {
  const { title, status } = req.body;
  if (!title || !status) {
    return res.status(400).json({ msg: "Missing fields!" });
  }

  try {
    const newUser = new User({ title, status });
    await newUser.save();
    res.status(201).json({
      message: "Todo Added",
      title,
      status,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { title, status } = req.body;
  const id = req.params.id;
  if (!id) {
    res
      .sendStatus(400)
      .json({ message: "Task not found !! Please enter valid task" });
  }
  try {
    const result = await User.updateOne(
      { _id: id },
      { $set: { title: title, status: status } }
    );
    res.status(200).json({
      message: "Task Updated",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json({ errormessage: "Unable to Update Task " });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleteResult = await User.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
      res.status(404).json({ message: "Task not Found" });
    }
    res.status(200).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errormessage: "Error in deleting Task" });
  }
});

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
