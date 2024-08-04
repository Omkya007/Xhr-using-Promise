const cl = console.log;

const loader = document.getElementById("loader");
const postForm = document.getElementById("postform");
const titleCon = document.getElementById("title");
const contentCon = document.getElementById("content");
const userIdCon = document.getElementById("userId");
const cardCon = document.getElementById("cardCon");
const BASE_URL = "https://jsonplaceholder.typicode.com";

const POST_URL = `${BASE_URL}/posts`;//this url will be same for post and get
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
// const EDIT_URL =`${BASE_URL}/posts/:editId` >> here editId is params
const templating = (arr) => {
    let res = ``;

    arr.forEach(ele => {
        res += `
         <div class="col-md-4 mb-4">
                <div class="card  postCard h-100" id="${ele.id}">
                    <div class="card-header">
                        <h3 class="m-0">${ele.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${ele.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="onRemove(this)">Delete</button>
                    </div>
                </div>
            </div>
        `
    })
    cardCon.innerHTML = res;

}

//READ
const fetchPosts = () => {
    loader.classList.remove('d-none');
    //create xhr object
    let xhr = new XMLHttpRequest();
    //configuration
    xhr.open("GET", POST_URL);
    //after getting response
    xhr.onload = function () {
        cl(xhr.response)

        if (xhr.status >= 200 && xhr.status < 300) {
            //API call success
            let data = JSON.parse(xhr.response)
            templating(data);//templating
        }
        loader.classList.add('d-none');
    }
    //send data to DB
    xhr.send();
}
fetchPosts();

//Create

const onPost = (eve) => {
    eve.preventDefault();
    // create new object from from

    let newObj = {
        title: titleCon.value,
        body: contentCon.value.trim(),
        userId: userIdCon.value
    }
    cl(newObj);
    postForm.reset();
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open("POST", POST_URL)

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            cl(xhr.response)
            //id is obtained as response from backend
            newObj.id = JSON.parse(xhr.response).id;
            //create new div to create just single card
            let div = document.createElement('div');
            div.className = 'col-md-4 mb-3';
            div.innerHTML = `
            <div class="card  postCard h-100" id="${newObj.id}">
                    <div class="card-header">
                        <h3 class="m-0">${newObj.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${newObj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-primary" onclick="onEdit(this)">Edit</button>
                        <button class="btn btn-sm btn-danger"onclick="onRemove(this)">Delete</button>
                    </div>
                </div>
            `
            cardCon.prepend(div)

        }

        loader.classList.add('d-none');

    }
    //Data is send to backend
    xhr.send(JSON.stringify(newObj))

}

//Edit

const onEdit = (ele) => {
    let editId = ele.closest('.card').id
    localStorage.setItem("editId", editId); //editid is stored in local storage to get for update operation


    let EDIT_URL = `${BASE_URL}/posts/${editId}`
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            cl(xhr.response)

            let post = JSON.parse(xhr.response);
            titleCon.value = post.title,
                contentCon.value = post.body,  //the data is patched in form
                userIdCon.value = post.userId
            updateBtn.classList.remove('d-none');
            submitBtn.classList.add('d-none');

        }
        loader.classList.add('d-none');
    }

    xhr.send()

}

//update

const onUpdate = () => {
    //updated obj
    let updatedObj = {
        title: titleCon.value,
        body: contentCon.value.trim(),
        userId: userIdCon.value

    }
    //updated id
    let updatedId = localStorage.getItem('editId');
    //updated url
    let UPDATE_URL = `${BASE_URL}/posts/${updatedId}`
    //api call to set the updated obj on DB
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", UPDATE_URL)

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            cl(xhr.response)
            let card = [...document.getElementById(updatedId).children];
            card[0].innerHTML = ` <h3 class="m-0">${updatedObj.title}</h3>`; //data is updated in UI
            card[1].innerHTML = ` <p class="m-0">${updatedObj.body}</p>`;
            postForm.reset();
            updateBtn.classList.add('d-none');
            submitBtn.classList.remove('d-none');
        }
        loader.classList.add('d-none');
    }

    xhr.send(JSON.stringify(updatedObj))


}

//Delete

const onRemove = (ele) => {
    let removeId = ele.closest(`.card`).id;
    cl(removeId);

    let REMOVE_URL = `${BASE_URL}/posts/${removeId}`;
    //get confirmation from user
    loader.classList.add('d-none');

    let xhr  = new XMLHttpRequest();

    xhr.open("DELETE",REMOVE_URL);

    xhr.onload = function(){
        if(xhr.status>=200 && xhr.status<300){
            ele.closest('.col-md-4').remove()

        }
        loader.classList.add('d-none');

    }

    xhr.send()




}

updateBtn.addEventListener("click", onUpdate)
postForm.addEventListener("submit", onPost)



