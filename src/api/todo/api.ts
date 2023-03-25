import { Hono } from "hono";
import { Methods } from ".";

let todoList = [
  { id: "1", title: "Learning Hono", completed: false },
  { id: "2", title: "Watch the movie", completed: true },
  { id: "3", title: "Buy milk", completed: false },
];

const todo = new Hono();
todo.get("/", (c) => c.json(todoList));

todo.post("/", async (c) => {
  const param = await c.req.json<Methods["post"]["reqBody"]>();
  const newTodo = {
    id: String(todoList.length + 1),
    completed: false,
    title: param.title,
  };
  todoList = [...todoList, newTodo];

  return c.json(newTodo, 201);
});

todo.put("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === id);
  if (!todo) {
    return c.json({ message: "not found" }, 404);
  }
  const param = (await c.req.parseBody()) as Methods["put"]["reqBody"];
  todoList = todoList.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        ...param,
      };
    } else {
      return todo;
    }
  });
  return new Response(null, { status: 204 });
});

todo.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const todo = todoList.find((todo) => todo.id === id);
  if (!todo) {
    return c.json({ message: "not found" }, 404);
  }
  todoList = todoList.filter((todo) => todo.id !== id);

  return new Response(null, { status: 204 });
});

export { todo };
