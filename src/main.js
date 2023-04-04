function openDrawer() {
    document.querySelector(".todoSider").style.left = "0px";
}

function closeDrawer() {
    document.querySelector(".todoSider").style.left = "-300px";
}

function upDrawer() {
    document.querySelector(".todoFooter").style.bottom = "0px";
}

function downDrawer() {
    document.querySelector(".todoFooter").style.bottom = "-300px";
}

function clickTask() {
    document.getElementsByClassName("introduction")[0].innerHTML = "<div class=\"iconfont icon-home-fill\"></div><span>任务</span>";
    render();
    closeDrawer();
}

function clickImportant() {
    document.getElementsByClassName("introduction")[0].innerHTML = "<div class=\"iconfont icon-shiwujiaoxing\"></div><span>重要</span>";
    render();
    closeDrawer();
}

function clickComplete() {
    document.getElementsByClassName("introduction")[0].innerHTML = "<div class=\"iconfont icon-zhengque\"></div><span>完成</span>";
    render();
    closeDrawer();
}

function markComplete() {
    downDrawer();
}

function markImportant() {
    downDrawer();
}

function deleteTask() {
    downDrawer();
}

function onComplete() {
    console.log(1);
}
function onImportant() {
    console.log(2);
}
let todoList = [];
let newItem1 = {
    title: "学习HTML",
    done: false,
    important: false
}
let newItem2 = {
    title: "学习CSS",
    done: false,
    important: true
}
// let newItem3 = {
//     title: "学习JS",
//     done: true,
//     important: true
// }
todoList.unshift(newItem1);
todoList.unshift(newItem2);
// todoList.unshift(newItem3);
let jsonString = JSON.stringify(todoList);
localStorage.setItem("todolist", jsonString)

const render = () => {
    let todos = document.getElementsByClassName("todoList");
    const todoListFromLocalStorage = localStorage.getItem("todolist")
    let todoListObject = JSON.parse(todoListFromLocalStorage)
    const currentPageName = document.getElementsByClassName("introduction")[0].innerText
    const filteredTodoList = todoListObject.filter(
        function (todoItem) {
            if (currentPageName === "任务") {
                return todoItem.done === false;
            } else if (currentPageName === "重要") {
                return todoItem.important === true && todoItem.done === false;
            } else {
                return todoItem.done === true;
            }
        }
    )
    let liContent = todos.innerHTML === undefined ? "" : todos.innerHTML;
    todos[0].innerHTML = "";
    if (filteredTodoList.length != 0) {
        document.getElementsByClassName("icon-empty")[0].style.display = "none";
        filteredTodoList.forEach((item) => {
            const wujiaoxing = item.important === false ? "kongwujiaoxing" : "shiwujiaoxing";
            const todoLi = `<li class="todo">
                                <div class="todoEnter" onclick="onComplete()"></div>
                                <span onclick="upDrawer()">${item.title}</span>
                                <div class="iconfont icon-${wujiaoxing}" onclick="onImportant()"> </div>
                            </li>
                            `
            liContent += todoLi;
            todos[0].innerHTML = liContent;
        })
    } else {
        document.getElementsByClassName("icon-empty")[0].style.display = "block";
    }
}
render()