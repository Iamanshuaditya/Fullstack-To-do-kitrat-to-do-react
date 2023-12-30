import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import BootstrapInput from "./BootstrapInput";
import Checkbox from "@mui/material/Checkbox";
import { MdDelete, MdEdit } from "react-icons/md";

const Input = React.memo(({ onSubmit }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [inputText, setInputText] = useState("");

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex justify-evenly mt-10 items-end mb-5">
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            label="Age"
            defaultValue=""
            className="h-[2.9em] ml-20 bg-[#CCCDDE]"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <MenuItem value="">
              <em>none</em>
            </MenuItem>
            <MenuItem value={"all"}>All</MenuItem>
            <MenuItem value={"completed"}>Completed</MenuItem>
            <MenuItem value={"incompleted"}>InCompleted</MenuItem>
          </Select>
          <Box noValidate>
            <FormControl variant="standard" className="w-full">
              <InputLabel shrink htmlFor="bootstrap-input"></InputLabel>
              <BootstrapInput
                placeholder="Enter Your Task"
                id="bootstrap-input"
                className="m-auto w-100"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </FormControl>
          </Box>

          <Button variant="contained" type="submit">
            Add Task
          </Button>
        </div>
      </form>
    </>
  );
});

Input.displayName = "Input";

Input.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default function App() {
  const inputRef = useRef(null);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [isEditing, setEditing] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const date = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const currentDate = `${date} / ${month} / ${year}`;

  const handleCheckboxChange = (event, taskId) => {
    setCheckedTasks((prevCheckedTasks) => ({
      ...prevCheckedTasks,
      [taskId]: event.target.checked,
    }));
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSumbit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
      console.log("Fetched tasks:", data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const handleEditClick = (taskId) => {
    setEditing(taskId);

    const editedTask = tasks.find((task) => task._id === taskId);

    setInputValue(editedTask.title);
    console.log("Editing task:", editedTask);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    console.log("Input value:", e.target.value);
  };

  const handleUpdateClick = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === isEditing ? { ...task, title: inputValue } : task
      )
    );

    setEditing(null);

    setInputValue("");
    console.log("Update: Clearing input value and editing state");
  };

  const handleInputBlur = () => {
    setInputValue("");
    setEditing(null);
  };

  const Todos = () => {
    return (
      <div className="pr-60 pl-60  ">
        {tasks.map((todo) => (
          <div
            className="p-4 bg-[#ECEDF6] rounded-xl w-[60rem] mb-3"
            key={todo._id}
          >
            <div className="h-18 w-[55rem] m-auto flex justify-between bg-white">
              <div className="flex">
                <Checkbox
                  inputProps={{ "aria-label": "controlled" }}
                  checked={checkedTasks[todo._id] || false}
                  onChange={(e) => handleCheckboxChange(e, todo._id)}
                />

                <div>
                  <p
                    className={`font-medium text-[#585858] ${
                      checkedTasks[todo._id] ? "line-through" : "normal"
                    }`}
                  >
                    {isEditing === todo._id ? (
                      <div>
                        <BootstrapInput
                          placeholder="Enter Your Task"
                          id="bootstrap-input"
                          className="m-auto w-100"
                          ref={inputRef}
                          value={inputValue}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                        />

                        <Button variant="contained" onClick={handleUpdateClick}>
                          Update ToDo
                        </Button>
                      </div>
                    ) : (
                      <span>{todo.title}</span>
                    )}
                  </p>

                  <p className="font-light text-[#585858] text-xs">
                    {todo.createdAt} , {currentDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center m-2">
                <MdDelete className="h-7 w-7 bg-[#EEEEEE] m-1 rounded-sm text-[#585858] p-1 cursor-pointer" />
                <MdEdit
                  className="h-7 w-7 bg-[#EEEEEE] m-1 rounded-sm text-[#585858] p-1 cursor-pointer"
                  onClick={() => handleEditClick(todo._id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <h1 className="text-[40px] font-bold text-[#646681]  text-center ">
        To Do list
      </h1>
      <Input onSubmit={handleSumbit} />
      <Todos />
    </>
  );
}
("");
