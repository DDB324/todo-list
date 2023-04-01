function openDrawer() {
    document.querySelector(".sider").style.left = "0px";
}

let todoList = [];
let newItem = {
    title: "学习HTML",
    done:false,
    important:false
}
todoList.push(newItem);
let jsonString = JSON.stringify(todoList);
localStorage.setItem("todolist", jsonString)