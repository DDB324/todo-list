const todoList = {
    siderTask: document.querySelector(".siderTask"),
    siderImportance: document.querySelector(".siderImportance"),
    siderComplete: document.querySelector(".siderComplete"),
    myInput: document.querySelector(".myInput"),
    currentPageTodos: document.querySelector(".todoList"),
    siderGengduo: document.querySelector(".sider-gengduo"),
    headerGengduo: document.querySelector(".header-gengduo"),
    currentPageTodosHtml: "",
    siderStyle: document.querySelector(".todoSider").style,
    footerStyle: document.querySelector(".todoFooter").style,
    emptyIconStyle: document.querySelector(".icon-empty").style,
    siderNavgationMap: { task: "task", importance: "importance", complete: "complete" },
    mainIntroduction: document.querySelector(".introduction"),
    localStorageKeyMap: { todolist: "todolist" },
    mainIntroductionMap: {
        task: "<div class=\"iconfont icon-home-fill\"></div><span>任务</span>",
        importance: "<div class=\"iconfont icon-shiwujiaoxing\"></div><span>重要</span>",
        complete: "<div class=\"iconfont icon-zhengque\"></div><span>完成</span>"
    },
    todoListArray: [],
    currentOnClickTodoItemTitle: undefined,
    //对页面进行初始化
    init: () => {
        todoList.render()
        todoList.bindSiderEvents()
        todoList.bindMyInputEvent()
    },
    //渲染todos
    render: () => {
        const currentPageName = todoList.getCurrentPageName();
        //获取页面标签（任务，重要，完成）对应的todo数据
        const filteredTodoList = todoList.filterTodoList(currentPageName);
        //清空页面上的todos
        todoList.removeCurrentPageTodosHtml();
        if (filteredTodoList.length != 0) {
            todoList.setEmptyIconDisappear();
            todoList.createTodos(filteredTodoList);
            todoList.setCurrentPageTodosHtml(todoList.currentPageTodosHtml);
        } else {
            todoList.setEmptyIconAppear();
        }
    },
    createTodos: (filteredTodoList) => {
        filteredTodoList.forEach((item) => {
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
            todoList.currentPageTodosHtml += todoLi;
        })
    },
    setCurrentPageTodosHtml: (html) => {
        todoList.currentPageTodos.innerHTML = html;
    },
    removeCurrentPageTodosHtml: () => {
        todoList.currentPageTodosHtml = "";
    },
    filterTodoList: (currentPageName) => {
        todoList.getLocalStorage("todolist");
        return todoList.todoListArray.filter(
            (todoItem) => {
                if (currentPageName === "任务") {
                    return todoItem.done === false;
                } else if (currentPageName === "重要") {
                    return todoItem.important === true && todoItem.done === false;
                } else {
                    return todoItem.done === true;
                }
            }
        )
    },
    getCurrentPageName: () => {
        return todoList.mainIntroduction.innerText;
    },
    // 获取or写入localStorage
    getLocalStorage: (localStorageKey) => {
        let localStorageValueJson = localStorage.getItem(localStorageKey);
        let localStroageArray = JSON.parse(localStorageValueJson);
        localStroageArray === null ? todoList.todoListArray = [] : todoList.todoListArray = localStroageArray;
    },
    setLocalStorage: (localStorageValue) => {
        let localStorageValueJson = JSON.stringify(localStorageValue);
        localStorage.setItem("todolist", localStorageValueJson)
    },
    //点击页面上每个todo进行的操作
    onComplete: (event) => {
        todoList.currentOnClickTodoItemTitle = event.target.parentNode.innerText;
        completeTodoItem();
    },
    onImportance: (event) => {
        currentOnClickTodoItemTitle = event.target.parentNode.innerText;
        importantTodoItem();
    },
    onClickTodoItem: (event) => {
        currentOnClickTodoItemTitle = event.target.innerText;
        upDrawer();
    },
    //点击每个todo唤出的底边栏的操作
    footerMarkComplete: () => {
        //todo
    },
    footerMarkImportance: () => {
        todoList.importanceTodoItem()
        todoList.downDrawer();
    },
    footerMarkDelete: () => {
        //todo
    },
    deleteTodoItem: () => {
        //todo
        downDrawer();
    },
    completeTodoItem: () => {
        //todo
        getLocalStorage();
        const index = todoList.todoListArray.findIndex(todoItem => todoItem.title === currentOnClickTodoItemTitle)
        if (index != -1) {
            todoListArray[index].done = true;
        }
        setLocalStorage(todoListArray);
        currentOnClickTodoItemTitle = "";
        render();
    },
    importanceTodoItem: () => {
        //todo
        getLocalStorage();
        const index = todoListArray.findIndex(todoItem => todoItem.title === currentOnClickTodoItemTitle)
        if (index != -1) {
            todoListArray[index].important = true;
        }
        setLocalStorage(todoListArray);
        currentOnClickTodoItemTitle = "";
        render();
    },
    upDrawer: () => {
        todoList.footerStyle.bottom = "0px";
    },
    downDrawer: () => {
        todoList.footerStyle.bottom = "-300px";
    },

    //绑定侧边栏的点击事件
    bindSiderEvents: () => {
        todoList.siderTask.onclick = () => {
            todoList.setMainIntroductionContent(todoList.siderNavgationMap.task)
        }
        todoList.siderImportance.onclick = () => {
            todoList.setMainIntroductionContent(todoList.siderNavgationMap.importance)
        }
        todoList.siderComplete.onclick = () => {
            todoList.setMainIntroductionContent(todoList.siderNavgationMap.complete)
        }
        todoList.siderGengduo.onclick = () => {
            todoList.closeDrawer()
        }
        todoList.headerGengduo.onclick = () => {
            todoList.openDrawer()
        }
    },
    setMainIntroductionContent: (operation) => {
        todoList.mainIntroduction.innerHTML = todoList.mainIntroductionMap[operation];
        todoList.render();
        todoList.closeDrawer();
    },
    closeDrawer: () => {
        todoList.siderStyle.left = "-300px";
    },
    openDrawer: () => {
        todoList.siderStyle.left = "0px";
    },
    
    //绑定输入框的输入事件
    bindMyInputEvent: () => {
        todoList.myInput.addEventListener("keyup", (event) => {
            // 判断是否按下 "Enter" 键（keyCode 为 13）
            if (event.keyCode === 13) {
                const todoContent = todoList.myInput.value;
                const newTodoItem = todoList.createNewTodoItemData(todoContent)
                todoList.getLocalStorage();
                todoList.todoListArray.unshift(newTodoItem);
                todoList.setLocalStorage(todoList.todoListArray);
                todoList.removeMyInputValue();
                todoList.render();
            }
        });
    },
    createNewTodoItemData: (todoContent) => {
        return {
            title: todoContent,
            done: false,
            important: false
        }
    },
    removeMyInputValue: () => {
        todoList.myInput.value = "";
    },

    //当前页面是否展示empty图的操作
    setEmptyIconDisappear: () => {
        todoList.emptyIconStyle.display = "none";
    },
    setEmptyIconAppear: () => {
        todoList.emptyIconStyle.display = "block";
    },
}
todoList.init()