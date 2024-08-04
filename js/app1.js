const cl = console.log;

const loader = document.getElementById("loader");
const postForm = document.getElementById("postform");
const titleCon = document.getElementById("title");
const contentCon = document.getElementById("content");
const userIdCon = document.getElementById("userId");
const cardCon = document.getElementById("cardCon");
const BASE_URL = "https://b14-post-default-rtdb.asia-southeast1.firebasedatabase.app/";

const POST_URL = `${BASE_URL}/posts.json`;//this url will be same for post and get
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
// const EDIT_URL =`${BASE_URL}/posts/:editId` >> here editId is params

const sweetAlert =(msg,icon)=>{
    sweetAlert.fire({
        title:msg,
        icon:icon,
        timer:2500
    })
}

const templating =(arr)=>{
    let res= ``;

    arr.forEach(ele=>{
        res+=`
          <div class="col-md-4" id="${ele.id}">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="m-0">${ele.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${ele.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-primary">Edit</button>
                        <button class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>
            </div>
        `
    })
    cardCon.innerHTML=res;
}

const makeApiCall = (methodName,apiUrl,msgBody=null)=>{
    if(msgBody){
        msgBody = JSON.stringify(msgBody);
    }
    return new Promise((resolve,reject)=>{
        loader.classList.remove('d-none');
        let xhr = new XMLHttpRequest();

        xhr.open(methodName,apiUrl);

        xhr.onload  =function(){
            if(xhr.status>=200 && xhr.status<300){
                let data = JSON.parse(xhr.response)
                resolve(data)
            }else{
                reject(`Something went wrong!!`)
            }
            loader.classList.add('d-none');
        }

        xhr.send(msgBody)
    })

}

makeApiCall("GET",POST_URL)
    .then(res=>{
       templating(res);
    })
    .catch(err=>{
        cl(err)
    })