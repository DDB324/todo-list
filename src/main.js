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

function clickTaskPage() {
    document.getElementsByClassName("introduction")[0].innerHTML = "<div class=\"iconfont icon-home-fill\"></div><span>任务</span>";
    render();
    closeDrawer();
}

function clickImportantPage() {
    document.getElementsByClassName("introduction")[0].innerHTML = "<div class=\"iconfont icon-shiwujiaoxing\"></div><span>重要</span>";
    render();
    closeDrawer();
}

function clickCompletePage() {
    document.getElementsByClassName("introduction")[0].innerHTML = "<div class=\"iconfont icon-zhengque\"></div><span>完成</span>";
    render();
    closeDrawer();
}

function markComplete() {
    completeTodoItem();
    downDrawer();
}

function completeTodoItem() {
    let todoListArray = getLocalStorage();
    const index = todoListArray.findIndex(todoItem => todoItem.title === currentOnClickTodoItemTitle)
    if (index != -1) {
        todoListArray[index].done = true;
    }
    setLocalStorage(todoListArray);
    currentOnClickTodoItemTitle = "";
    render();
}

function importantTodoItem() {
    let todoListArray = getLocalStorage();
    const index = todoListArray.findIndex(todoItem => todoItem.title === currentOnClickTodoItemTitle)
    if (index != -1) {
        todoListArray[index].important = true;
    }
    setLocalStorage(todoListArray);
    currentOnClickTodoItemTitle = "";
    render();
}

function markImportant() {
    importantTodoItem()
    downDrawer();
}

function deleteTask() {
    downDrawer();
}

function onComplete(event) {
    currentOnClickTodoItemTitle = event.target.parentNode.innerText;
    completeTodoItem();
}

function onImportant(event) {
    currentOnClickTodoItemTitle = event.target.parentNode.innerText;
    importantTodoItem();
}

function onClickTodoItem(event) {
    currentOnClickTodoItemTitle = event.target.innerText;
    upDrawer();
}
let currentOnClickTodoItemTitle;
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
            let todoLi;
            if (item.done) {
                todoLi = `<li class="todo">
                <div class="iconfont icon-zhengque""></div>
                <span onclick="onClickTodoItem(event)" style="text-decoration:line-through">${item.title}</span>
                <div class="iconfont icon-${wujiaoxing}" onclick="onImportant(event)"> </div>
            </li>
            `
            } else {
                todoLi = `<li class="todo">
                <div class="todoEnter" onclick="onComplete(event)"></div>
                <span onclick="onClickTodoItem(event)">${item.title}</span>
                <div class="iconfont icon-${wujiaoxing}" onclick="onImportant(event)"> </div>
            </li>
            `
            }
            currentPageTodosHtml += todoLi;
        })
        setCurrentPageTodosHtml(currentPageTodosHtml);
    } else {
        setEmptyIconAppear();
    }
}
render()