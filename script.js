// Show landing page - launched upon the page loading
function showProjectMembers(){
    const landingPage = `<div class="top">
                        <h1>Project Members</h1>
                        <table>
                            <tr>
                                <td><img src="./images/elif.jpeg" class="profilepic"></td>
                                <td>
                                    <h4>Elif Candan</h4>
                                    <p>
                                        Section: 01
                                    </p>
                                    <p>
                                        ID: 22203884
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td><img src="./images/sara.jpeg" class="profilepic"></td>
                                <td>
                                    <h4>Sara Zebardast</h4>
                                    <p>
                                        Section: 01
                                    </p>
                                    <p>
                                        ID: 22101014
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td><img src="./images/alper.jpeg" class="profilepic"></td>
                                <td>
                                    <h4>Alper Dinler</h4>
                                    <p>
                                        Section: 01
                                    </p>
                                    <p>
                                        ID: 22202643
                                    </p>
                                </td>
                            </tr>
                        </table>
                     </div>`;
    $('#listSide').html(landingPage);
}

// creates popup when user clicks New List
function newListClick(){
    $('#projectName').val('');
    $('#popup').show();
}

// yeets the popup off when the user cancels
function popupCancelClick(){
    $('#popup').hide();
}

// removes project when user clicks the trash can 
function removeProject(e){
    let liElem = $(e.target).parents('li');
    window.allTasks.splice(liElem.index(), 1);
    liElem.remove();

    // Check if there are no more to-do lists
    if (window.allTasks.length === 0) {
        showProjectMembers();
    } else {
        // If there are remaining to-do lists, show the last active project
        projectClick();
    }
}

// creates the new to-do list when the user clicks create
function popupCreateClick(){
    $('#projectContainer').append(`
        <li>
            <div></div>
            <div><i class="fa-solid fa-bars"></i></div>
            <div onclick="projectClick(event)">` + $('#projectName').val() + `</div>
            <div onclick="removeProject(event)"><i class="fa-regular fa-trash-can"></i></div>
            <div style="visibility:hidden"></div>
        </li>
    `);
    window.allTasks.push([]);
    $('#popup').hide();
    projectClick();
}

// fills the task list every time something is added
function fillTaskList(){
    var activeProjectLi = $('#projectContainer li.active');
    var liIndex = activeProjectLi.index();
    var tasks = window.allTasks[liIndex];
    $('#taskListContainer').empty();
    for (var i=0;i<tasks.length;i++){
        if (tasks[i].checked)
            $('#taskListContainer').append(`<li style="text-decoration: line-through;"><input id="chk-` + i.toString() + `" type="checkbox" onclick="checkboxChange(event)" checked><label for="chk-` + i.toString() + `">` + tasks[i].name + `</label></li>`);
        else
            $('#taskListContainer').append(`<li><input id="chk-` + i.toString() + `" type="checkbox" onclick="checkboxChange(event)"><label for="chk-` + i.toString() + `">` + tasks[i].name + `</label></li>`);
    }
}

// detects if the checkbox state has changed for each list item
function checkboxChange(e){
    var sourceCheckbox = $(e.target);
    var activeProjectLi = $('#projectContainer li.active');
    var liIndex = activeProjectLi.index();
    var taskIndex = sourceCheckbox.parents('li').index();
    window.allTasks[liIndex][taskIndex].checked = sourceCheckbox.is(':checked');

    // Update the text-decoration based on the checkbox state
    var textDecoration = sourceCheckbox.is(':checked') ? 'line-through' : 'none';
    sourceCheckbox.parents('li').css('text-decoration', textDecoration);
        
    updateBadge();
}

// adds new task when the user clicks the plus next to the input field 
function addTaskClick(){
    var activeProjectLi = $('#projectContainer li.active');
    var liIndex = activeProjectLi.index();
    window.allTasks[liIndex].push({
        name : $('#txtTaskName').val(),
        checked : false
    });
    fillTaskList();
    updateBadge();

    var textField = document.getElementById('txtTaskName');
    textField.value = '';
}

// calls addTaskClick if enter is pressed
function txtTaskNameOnKeyPress(e){
    if (e.keyCode == 13) {
        addTaskClick();
     }    
}

// updates the unchecked task # next to the list name 
function updateBadge(){
    var activeProjectLi = $('#projectContainer li.active');
    var activeProjectIndex = activeProjectLi.index();
    var count = 0;
    for (var i=0; i < window.allTasks[activeProjectIndex].length;i++){
        if (!window.allTasks[activeProjectIndex][i].checked)
            count++;
    }
    var lastDiv = $('#projectContainer li:nth-child(' + (activeProjectIndex + 1).toString() + ') div:nth-child(5)');
    lastDiv.html(count.toString());
    if (count == 0)
        lastDiv.css('visibility','hidden');
    else
        lastDiv.css('visibility','visible');
}

// changes the screen to the clicked list, also changes to the new created list immediately after creation
function projectClick(e){
    var projectLi = null;
    if (e)
        projectLi = $(e.target).parents('li');
    else
        projectLi = $('#projectContainer li:last-child');
    
    $('#projectContainer li').removeClass('active');
    projectLi.addClass('active');    
    let content = `
        <div id="taskListRoot">
            <div id="taskListHeader">` + projectLi.find('div:nth-child(3)').html() + `
            </div>
            <div>
                <ul id="taskListContainer">
                </ul>
            </div>
            <div id="taskListFooter">
                <div>
                    <div onclick="addTaskClick()"><i class="fa-solid fa-plus"></i></div>
                    <div><input id="txtTaskName" type="text" placeholder="Add a Task" onkeypress="txtTaskNameOnKeyPress(event)"/></div>
                </div>
            </div>
        </div>
    `;
    $('#listSide').html(content);
    fillTaskList();
}

// load landing page 
$(document).ready(function(){
    window.allTasks = [];
    showProjectMembers();
})