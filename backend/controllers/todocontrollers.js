import Todo from "../models/Todo.js";

// create
export const createTodo = async(req, res) => {
    try {
        const todo = await Todo.create({
            text: req.body.text,
        });

        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// get
export const getTodos = async(req, res) => {
    try {
        const todos = await Todo.find();

        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};


// update
export const updateTodo = async(req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id, { text: req.body.text }, { new: true }
        );

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

// delete
export const deleteTodo = async(req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);

        res.status(200).json({
            msg: "Todo deleted successfully!",
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
};
