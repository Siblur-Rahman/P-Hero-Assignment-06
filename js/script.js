function convertToNumber(id){
    const string =document.getElementById(id).innerText;
    let number =parseInt(string);
    return number
}
function increment(id){
    let number = convertToNumber(id);
    number++
    return number
}
const toggleLoadingSpinner =(isLoading) =>{
    const loadingSpinner = document.getElementById('loading-spinner');
    if(isLoading){
        loadingSpinner.classList.remove('hidden')
    }else{
        loadingSpinner.classList.add('hidden')

    }
}
// append Post
function appendPost(post){
    // toggleLoadingSpinner(true)
    const postCard = document.createElement('div');
            postCard.innerHTML = `
            <div class="card w-full bg-slate-200 shadow-xl border-2 rounded-3xl mb-5 p-5">
                        <div class="flex mt-3 gap-4">
                            <div class = "relative">
                                <p class="${post.isActive? "bg-green-400":"bg-red-600"} border-6 w-3 h-3 rounded-full absolute right-0 top-[-4px]">.</p>
                                <img src="${post.image}" alt="" class="h-16 rounded-lg">
                            </div>
                            <div class ="w-5/6">
                                <div class="flex gap-5">
                                    <p><span class="">#${post.category}</span></p>
                                    <p><span class="">Author:${post.author.name}</span></p>
                                </div>
                                <p class="card-title mt-3">${post.title}</p>
                                <p class=" text-slate-500 mt-5">${post.description}</p>
                                        <!-- View comment box -->
                                <div class="flex justify-between">
                                    <div class="flex gap-4">
                                        <div class="flex items-center gap-2">
                                        <i class="fa-regular fa-message"></i>
                                        <p>${post.comment_count}</p>
                                        </div>
                                        <div class="flex items-center gap-2">
                                        <i class="fa-regular fa-eye"></i>
                                        <p>${post.view_count}</p>
                                        </div>
                                        <div class="flex items-center gap-2">
                                        <i class="fa-regular fa-clock"></i>
                                        <p>${post.posted_time}</p>
                                        </div>
                                    </div>

                                    <button class="bg-green-600 w-10 h-10 flex justify-center items-center rounded-full text-end" id="${post.id}"><i class="fa-regular fa-envelope-open text-white"></i></button>
                            </div><!--End View comment box -->
        </div>`;
        allPostCardContainer.appendChild(postCard);

        // stopSpinner
        setTimeout(stopSpinner, 2000)
        function stopSpinner(){
            toggleLoadingSpinner(false);
        }
}
// append latestPost Function
let publishDate;
let authorDesignation
const cardContainer = document.getElementById('card-container');
function appendLatestPost(latestPost){
    toggleLoadingSpinner(true);
    const newCard = document.createElement('div');
    newCard.innerHTML = `<div class="card w-full bg-base-100 shadow-xl border-2 rounded-3xl mb-5 h-[500px]">
        <figure class="">
        <div><img src="${latestPost.cover_image}" alt="" class="w-full rounded-lg"></div>
        </figure>
        <div class="mt-3"><i class="fa-regular fa-calendar"></i>
        <span>${publishDate}</span>
        </div>
    <div class="card-body">
        <div class="flex space-x-4 justify-start items-start">
        <div>
        <h2 class="card-title">${latestPost.title}</h2>
        <p class="text-sm">${latestPost.description}</p>
                <div class="flex mt-3 items-center gap-4">
                    <img src="${latestPost.profile_image}" alt="" class="h-12 rounded-full">
                    <div>
                        <p class="card-title">${latestPost.author.name}</p>
                        <p class=" text-slate-500">${authorDesignation}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
cardContainer.appendChild(newCard)
}

// appendChildAddToRead Function
const addToReadContainer = document.getElementById('add-to-read-container');
function appendChildAddToRead(post){
        // mark count Increment
        document.getElementById('mark-count').innerText = increment('mark-count');

            const addToReadDiv =document.createElement('div')
            addToReadDiv.innerHTML = 
            `<div class="flex justify-between bg-white p-4 rounded-xl mb-3 items-center">
            <div class="w-4/6">
            <p class="card-title mt-3">${post.title}</p>
            </div>
            <div class="w-2/6 text-end flex items-center gap-2">
            <i class="fa-regular fa-eye"></i>
            <p>${post.view_count}</p>
            </div>
          </div>
            `;
            addToReadContainer.appendChild(addToReadDiv)
}
const fetchDataByLatestPost = () =>{
    const url = `https://openapi.programming-hero.com/api/retro-forum/latest-posts`;
    fetch (url)
    .then((res) => res.json())
    .then((data) => {
        data.forEach((latestPost) => {
        authorDesignation = latestPost.author.designation;
        if( typeof(authorDesignation) == "undefined"){
            authorDesignation = "Unknown"
        }
        publishDate =latestPost.author.posted_date;
        if( typeof(publishDate) == "undefined"){
            publishDate = "No Publish Date"
        }

        /// calling append latestPost Function
        appendLatestPost(latestPost);
    })
})
};
fetchDataByLatestPost();

// All-Post Function
const allPostCardContainer = document.getElementById('all-post-card-container');
const fetchDataByAllPost = () =>{
    const allPostUrl = `https://openapi.programming-hero.com/api/retro-forum/posts`;
    fetch (allPostUrl)
    .then((res) => res.json())
    .then((allData) => {
        const allPosts = allData.posts;
        allPosts.forEach((post)=>{
            // Append Post Function
            appendPost(post);
        
        // calling appendChildAddToRead Function
        document.getElementById(`${post.id}`).addEventListener('click', function(){
            appendChildAddToRead(post);
        })
})
})
};

// calling AllPost Function
fetchDataByAllPost();

// Handle Search Button
const searchBtn = document.getElementById('search-btn');
const searchField = document.getElementById('search-field');
searchBtn.addEventListener('click', () =>{
    let searchValue = searchField.value;
        // calling fetchDataByCategory function
    allPostCardContainer.innerHTML ='';
    fetchDataByCategory(searchValue)
 
    setTimeout(stopSpinner, 2000)
    function stopSpinner(){
        toggleLoadingSpinner(false);
    }
})
 // fetchDataByCategory function
 const fetchDataByCategory = (category) =>{
    const allPostUrl = `https://openapi.programming-hero.com/api/retro-forum/posts?category=${category}`;
    fetch (allPostUrl)
    .then((res) => res.json())
    .then((allData) => {
        const allPosts = allData.posts;
        if(category.length ==0){
            toggleLoadingSpinner(false)
        }else{
            toggleLoadingSpinner(true)
        }
        allPosts.forEach((post)=>{
            // Append Post
            appendPost(post);

        
        // Add To Read Viv
        document.getElementById(`${post.id}`).addEventListener('click', function(){

        // calling appendChildAddToRead Function
            appendChildAddToRead(post);
        })
})
})
};