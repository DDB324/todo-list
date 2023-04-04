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

let myInput = document.getElementsByClassName("myInput")[0];

// 监听输入框的按键事件
myInput.addEventListener("keyup", function (event) {
    let newTodoItem;
    // 判断是否按下 "Enter" 键（keyCode 为 13）
    if (event.keyCode === 13) {
        let todoContent = myInput.value;
        newTodoItem = {
            title: todoContent,
            done: false,
            important: false
        }
        let todoListArray = getLocalStorage();
        todoListArray.unshift(newTodoItem);
        setLocalStorage(todoListArray);
        myInput.value = "";
        render();
    }
});

const getLocalStorage = () => {
    let todoList = localStorage.getItem("todolist");
    let todoListArray = JSON.parse(todoList);
    return todoListArray === null ? [] : todoListArray
}

const setLocalStorage = (todoList) => {
    let todoListString = JSON.stringify(todoList);
    localStorage.setItem("todolist", todoListString)
}

const filterTodoListFromLocalStorage = () => {
    let todoListArray = getLocalStorage();
    const currentPageName = document.getElementsByClassName("introduction")[0].innerText;
    return todoListArray.filter(
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
}
const getCurrentPageTodosHtml = () => {
    return document.getElementsByClassName("todoList")[0].innerHTML;
}

const setCurrentPageTodosHtml = (html) => {
    document.getElementsByClassName("todoList")[0].innerHTML = html;
}

const removeCurrentPageTodos = () => {
    document.getElementsByClassName("todoList")[0].innerHTML = "";
}

const setEmptyIconDisappear = () => {
    document.getElementsByClassName("icon-empty")[0].style.display = "none";
}

const setEmptyIconAppear = () => {
    document.getElementsByClassName("icon-empty")[0].style.display = "block";
}

const render = () => {
    const filteredTodoListFromLocalStorage = filterTodoListFromLocalStorage();
    // let currentPageTodosHtml = getCurrentPageTodosHtml() === undefined ? "" : getCurrentPageTodosHtml();
    let currentPageTodosHtml = "";
    removeCurrentPageTodos();
    if (filteredTodoListFromLocalStorage.length != 0) {
        setEmptyIconDisappear();
        filteredTodoListFromLocalStorage.forEach((item) => {
            const wujiaoxing = item.important === false ? "kongwujiaoxing" : "shiwujiaoxing";
            const todoLi = `<li class="todo">
                                <div class="todoEnter" onclick="onComplete()"></div>
                                <span onclick="upDrawer()">${item.title}</span>
                                <div class="iconfont icon-${wujiaoxing}" onclick="onImportant()"> </div>
                            </li>
                            `
            currentPageTodosHtml += todoLi;
        })
        setCurrentPageTodosHtml(currentPageTodosHtml);
    } else {
        setEmptyIconAppear();
    }
}
render()