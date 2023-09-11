const handleCategory = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/news/categories"
  );
  const data = await response.json();
  const tabContainer = document.getElementById("tab-container");

  let isslice = '';

  if (true) {
    isslice = data.data.news_category;
  }
  else {
    isslice = data.data.news_category.slice(0, 3);
  }

  isslice.forEach((category) => {
    const div = document.createElement("div");
    div.innerHTML = `
        
        <a onclick="handleLoadNews('${category.category_id}')" class="tab border-2 border-double border-sky-300 bg-slate-200 m-1 text-black">${category.category_name}</a>
        `;
    tabContainer.appendChild(div);
  });
};

const handleLoadNews = async (categoryId) => {
  console.log(categoryId);
  const response = await fetch(
    `https://openapi.programming-hero.com/api/news/category/${categoryId}`
  );
  const data = await response.json();

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  data.data?.forEach((news) => {
    console.log(news);
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="card  bg-base-100 shadow-xl mb-2">
        <figure>
          <img
          src=${news?.image_url}
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">
           ${news.title.slice(0, 40)}
            <div class="badge badge-info p-5">${news?.rating?.badge}</div>
          </h2>
          <p>
          ${news.details.slice(0, 60)}
          </p>
          <h3> Total views: ${news.total_view ? news.total_view : "no views"
      }</h3>
          <div class="card-footer flex justify-between mt-8">
            <div class="flex">
              <div>
                <div class="avatar online">
                  <div class="w-12 mr-3  rounded-full">
                    <img 
                      src=${news.author?.img}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h6>${news.author?.name ? news.author.name : "not found"}</h6>
                <small> ${news?.author?.published_date ? news.author.published_date : "not found"} </small>
              </div>
            </div>
            <div class="card-detailed-btn">
              <button onclick=handleModal('${news._id}')
                class="inline-block cursor-pointer rounded-md btn-info px-4 py-3 text-center text-sm font-semibold uppercase  transition duration-200 ease-in-out hover:bg-gray-900"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
        
        `;

    cardContainer.appendChild(div);
  });
};

const handleModal = async (newsID) => {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/news/${newsID}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data for newsID: ${newsID}`);
    }

    const data = await response.json();
    console.log(data);

    // Check if the data contains valid information
    if (data && data.data && data.data.length > 0) {
      const modalContainer = document.getElementById("modal-container");
      const uniqueModalID = `my_modal_${newsID}`; // Generate a unique modal ID

      // Check if the modal with the same ID already exists and remove it if necessary
      const existingModal = document.getElementById(uniqueModalID);
      if (existingModal) {
        existingModal.remove();
      }

      // Create a new modal with a unique ID
      const div = document.createElement("div");
      div.innerHTML = `
        <dialog id="${uniqueModalID}" class="modal">
          <form method="dialog" class="modal-box">
            <img
             src=${data.data[0]?.image_url}
             />
            <h3 class="font-bold text-lg">${data.data[0]?.title}</h3>
            <div class="modal-action">
              <button class="btn btn-info">Close</button>
            </div>
          </form>
        </dialog>
      `;

      modalContainer.appendChild(div);

      const modal = document.getElementById(uniqueModalID);
      modal.showModal();
    } else {
      console.error("Data is missing or invalid.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

handleCategory();
handleLoadNews("08");

