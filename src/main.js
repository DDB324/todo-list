const todoList = {
    //获取侧边栏的要点击的元素
    sideTask: document.querySelector(".side-task"),
    sideImportance: document.querySelector(".side-importance"),
    sideComplete: document.querySelector(".side-complete"),
    sideGengduo: document.querySelector(".side-gengduo"),

    //获取input输入框元素
    myInput: document.querySelector(".myInput"),
    //获取包裹input的整个元素
    todoInput: document.querySelector(".todoInput"),

    //获取当前页面上的整个todo元素
    currentPageTodos: document.querySelector(".todoList"),

    //获取主页面上三个横杠的元素
    headerGengduo: document.querySelector(".header-gengduo"),

    //获取底边栏要点击的元素
    footerComplete: document.querySelector(".footer-complete"),
    footerImportance: document.querySelector(".footer-importance"),
    footerDelete: document.querySelector(".footer-delete"),

    //获取一些会随着页面状态需要改变自己样式的元素
    sideStyle: document.querySelector(".todoSide").style,
    footerStyle: document.querySelector(".todoFooter").style,
    emptyIconStyle: document.querySelector(".icon-empty").style,

    //获取主页面上的标题（任务，重要，完成）
    mainIntroduction: document.querySelector(".introduction"),

    //储存一些数据
    sideNavigationMap: { task: "task", importance: "importance", complete: "complete" },
    localStorageKeyMap: { todolist: "todolist" },
    mainIntroductionMap: {
        task: "<div class=\"iconfont icon-home-fill\"></div><span>任务</span>",
        importance: "<div class=\"iconfont icon-shiwujiaoxing\"></div><span>重要</span>",
        complete: "<div class=\"iconfont icon-zhengque\"></div><span>完成</span>"
    },
    todoListArray: [],
    currentOnclickTodoItemTitle: undefined,

    //遮罩层
    mask: document.createElement('div'),

    //对页面进行初始化
    init: () => {
        todoList.render()
        todoList.bindSideEvents()
        todoList.bindMyInputEvent()
        todoList.bindTodoItem()
        todoList.bindFooterEvents()
    },


    //渲染todos
    render: () => {
        const currentPageName = todoList.getCurrentPageName();
        //获取页面标签（任务，重要，完成）对应的todo数据
        const filteredTodoList = todoList.filterTodoList(currentPageName);
        //清空页面上的todos
        todoList.removeCurrentPageTodos();
        if (filteredTodoList.length != 0) {
            todoList.setEmptyIconDisappear();
            const todosHtml = todoList.createTodosHtml(filteredTodoList);
            todoList.setCurrentPageTodos(todosHtml);
        } else {
            todoList.setEmptyIconAppear();
        }
    },

    //根据数据创建要展示的todoHTML
    createTodosHtml: (filteredTodoList) => {
        let currentPageTodosHtml = "";
        filteredTodoList.forEach((item) => {
            const wujiaoxing = item.important === false ? "kongwujiaoxing" : "shiwujiaoxing";
            let todoLi;
            if (item.done) {
                todoLi = `<li class="todo">
                <div class="iconfont icon-zhengque""></div>
                <span  style="text-decoration:line-through">${item.title}</span>
                <div class="iconfont icon-${wujiaoxing}"> </div>
            </li>
            `
            } else {
                todoLi = `<li class="todo">
                <div class="todoEnter" onclick="onComplete(event)"></div>
                <span onclick="onClickTodoItem(event)">${item.title}</span>
                <div class="iconfont icon-${wujiaoxing}" onclick="onImportanceOrNot(event)"> </div>
            </li>
            `
            }
            currentPageTodosHtml += todoLi;
        })
        return currentPageTodosHtml
    },

    //将创建的HTML放到页面对应的位置
    setCurrentPageTodos: (html) => {
        todoList.currentPageTodos.innerHTML = html;
    },

    //清除页面上的todos，放便下次重新render
    removeCurrentPageTodos: () => {
        todoList.currentPageTodos.innerHTML = "";
    },

    //根据当前页面的名字，筛选出要展示的todos
    filterTodoList: (currentPageName) => {
        todoList.getLocalStorage();
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

    //获取当前页面的名字
    getCurrentPageName: () => {
        return todoList.mainIntroduction.innerText;
    },

    // 获取or写入localStorage
    getLocalStorage: () => {
        let localStorageValueJson = localStorage.getItem('todolist');
        let localStorageArray = JSON.parse(localStorageValueJson);
        localStorageArray === null ? todoList.todoListArray = [] : todoList.todoListArray = localStorageArray;
    },
    setLocalStorage: () => {
        let localStorageValueJson = JSON.stringify(todoList.todoListArray);
        localStorage.setItem("todolist", localStorageValueJson)
    },

    //绑定侧边栏的点击事件
    bindSideEvents: () => {
        todoList.sideTask.onclick = () => {
            todoList.setMainIntroductionContent(todoList.sideNavigationMap.task)
            todoList.setInputAppear();
        }
        todoList.sideImportance.onclick = () => {
            todoList.setMainIntroductionContent(todoList.sideNavigationMap.importance)
            todoList.setInputAppear();
        }
        todoList.sideComplete.onclick = () => {
            todoList.setMainIntroductionContent(todoList.sideNavigationMap.complete)
            todoList.setInputDisappear();
        }
        todoList.sideGengduo.onclick = () => {
            todoList.closeDrawer()
        }
        todoList.headerGengduo.onclick = () => {
            document.querySelector(".todoSide").querySelectorAll("li").forEach((item) => {
                if (item.innerText === todoList.mainIntroduction.innerText && !item.className.includes("select")) {
                    item.classList.add("select");
                } else {
                    item.classList.remove("select")
                }
            })
            todoList.openDrawer()
        }
    },
    setMainIntroductionContent: (operation) => {
        todoList.mainIntroduction.innerHTML = todoList.mainIntroductionMap[operation];
        todoList.render();
        todoList.closeDrawer();
    },
    closeDrawer: () => {
        todoList.removeMask();
        todoList.sideStyle.left = "-300px";
    },
    openDrawer: () => {
        todoList.createMask();
        todoList.sideStyle.left = "0px";
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
                todoList.setLocalStorage();
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
    //绑定todoItem的事件
    bindTodoItem: () => {
        onComplete = (event) => {
            todoList.currentOnclickTodoItemTitle = event.target.parentNode.innerText;
            todoList.todoItemOperation("完成");
        }
        onImportanceOrNot = (event) => {
            todoList.currentOnclickTodoItemTitle = event.target.parentNode.innerText;
            if (event.target.className.includes("kongwujiaoxing")) {
                todoList.todoItemOperation("重要");
            } else {
                todoList.todoItemOperation("不重要");
            }
        }
        onClickTodoItem = (event) => {
            todoList.currentOnclickTodoItemTitle = event.target.innerText;
            todoList.upDrawer();
        }
    },
    upDrawer: () => {
        todoList.createMask();
        todoList.footerStyle.bottom = "0px";
    },
    //点击每个todo唤出的底边栏的操作
    bindFooterEvents: () => {
        todoList.footerComplete.onclick = () => {
            todoList.todoItemOperation("完成")
        }
        todoList.footerImportance.onclick = () => {
            todoList.todoItemOperation("重要")
        }
        todoList.footerDelete.onclick = () => {
            todoList.todoItemOperation("删除")
        }
    },
    todoItemOperation: (operation) => {
        todoList.getLocalStorage();
        const index = todoList.todoListArray.findIndex(todoItem => todoItem.title === todoList.currentOnclickTodoItemTitle)
        if (index != -1) {
            if (operation === "完成") {
                todoList.todoListArray[index].done = true;
            } else if (operation === "重要") {
                todoList.todoListArray[index].important = true;
            } else if (operation === "不重要") {
                todoList.todoListArray[index].important = false;
            } else {
                todoList.todoListArray.splice(index, 1);
            }
        }
        todoList.setLocalStorage();
        todoList.removeCurrentOnclickTodoItemTitle();
        todoList.render();
        todoList.downDrawer();
    },
    removeCurrentOnclickTodoItemTitle: () => {
        todoList.currentOnclickTodoItemTitle = "";
    },
    downDrawer: () => {
        todoList.removeMask();
        todoList.footerStyle.bottom = "-300px";
    },
    //当前页面是否展示empty图的操作
    setEmptyIconDisappear: () => {
        todoList.emptyIconStyle.display = "none";
    },
    setEmptyIconAppear: () => {
        todoList.emptyIconStyle.display = "block";
    },

    //当前页面是否展示input框
    setInputDisappear: () => {
        todoList.todoInput.style.display = "none";
    },
    setInputAppear: () => {
        todoList.todoInput.style.display = "flex";
    },
    //创建遮罩层
    createMask: () => {
        todoList.mask.className = 'mask';
        document.body.appendChild(todoList.mask);
        todoList.mask.onclick = (e) => {
            todoList.closeDrawer();
            todoList.downDrawer();
        }
    },
    removeMask: () => {
        if (document.querySelector(".mask")) document.body.removeChild(todoList.mask);
    }
}

todoList.init()