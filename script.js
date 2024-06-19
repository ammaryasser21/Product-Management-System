// Get DOM elements
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let search = document.getElementById("search");
let pageNum = document.getElementById("pageNumber");
let prev = document.getElementsByClassName("prev");
let next = document.getElementsByClassName("next");

let titleError = document.getElementById("titleError");
let priceError = document.getElementById("priceError");
let countError = document.getElementById("countError");
let categoryError = document.getElementById("categoryError");

function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = `${result}`;
    total.style.backgroundColor = "#040";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "rgb(117, 30, 30)";
  }
}

// Add event listeners to input fields to call getTotal function on value change
price.addEventListener("input", getTotal);
taxes.addEventListener("input", getTotal);
ads.addEventListener("input", getTotal);
discount.addEventListener("input", getTotal);

// Initialize total
getTotal();

let dataPro;
if (localStorage.product != null) {
  dataPro = JSON.parse(localStorage.product);
} else {
  dataPro = [];
}

submit.onclick = function () {
  clearErrors();
  let isValid = validateInputs();

  if (isValid) {
    let newPro = {
      title: title.value,
      price: price.value,
      taxes: taxes.value ? taxes.value : 0,
      ads: ads.value ? ads.value : 0,
      discount: discount.value ? discount.value : 0,
      total: total.innerHTML,
      count: count.value,
      category: category.value,
    };

    if (newPro.count > 1) {
      for (let i = 0; i < newPro.count; i++) {
        dataPro.push(newPro);
      }
    } else {
      dataPro.push(newPro);
    }

    localStorage.setItem("product", JSON.stringify(dataPro));
    clearData();
    showData();
  }
};

function validateInputs() {
  let isValid = true;

  if (title.value.trim() === "") {
    title.classList.add("invalid");
    titleError.style.display = "block";
    titleError.textContent = "Title is required.";
    isValid = false;
  }
  if (price.value.trim() === "" || isNaN(price.value) || +price.value <= 0) {
    price.classList.add("invalid");
    priceError.style.display = "block";
    priceError.textContent = "Valid price is required.";
    isValid = false;
  }
  if (count.value.trim() === "" || isNaN(count.value) || +count.value <= 0) {
    count.classList.add("invalid");
    countError.style.display = "block";
    countError.textContent = "Valid count is required.";
    isValid = false;
  }
  if (category.value.trim() === "") {
    category.classList.add("invalid");
    categoryError.style.display = "block";
    categoryError.textContent = "Category is required.";
    isValid = false;
  }

  return isValid;
}

function clearErrors() {
  let inputs = [title, price, count, category];
  let errors = [titleError, priceError, countError, categoryError];

  inputs.forEach((input) => input.classList.remove("invalid"));
  errors.forEach((error) => (error.style.display = "none"));
}

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

let currentPage = 1;
const itemsPerPage = 10;

function showData() {
  let table = "";
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = dataPro.slice(startIndex, endIndex);
  for (let i = 0; i < paginatedData.length; i++) {
    table += `
      <tr>
        <td>${startIndex + i + 1}</td>
        <td>${paginatedData[i].title}</td>
        <td>${paginatedData[i].price}</td>
        <td>${paginatedData[i].taxes}</td>
        <td>${paginatedData[i].ads}</td>
        <td>${paginatedData[i].discount}</td>
        <td>${paginatedData[i].total}</td>
        <td>${paginatedData[i].category}</td>
        <td><button id="update" onclick="updateData(${
          startIndex + i
        })">Update</button></td>
        <td><button id="delete" onclick="deleteData(${
          startIndex + i
        })">Delete</button></td>
      </tr>
    `;
  }
  document.getElementById("tbody").innerHTML = table;
  document.getElementById("pageNumber").innerText = `${currentPage}`;

  let prev = document.getElementById("prev");
  let next = document.getElementById("next");

  if (currentPage == 1) {
    prev.style.display = "none";
  } else {
    prev.style.display = "block";
  }

  if (
    paginatedData.length < itemsPerPage ||
    currentPage * itemsPerPage >= dataPro.length
  ) {
    next.style.display = "none";
  } else {
    next.style.display = "block";
  }

  if (dataPro.length == 0) {
    document.getElementById("pageNumber").innerText = `No data found`;
    document.getElementById("pageNumber").classList.add("notFound");
  } else {
    document.getElementById("pageNumber").innerText = `${currentPage}`;
    document.getElementById("pageNumber").classList.remove("notFound");
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    showData();
  }
}

function nextPage() {
  if (currentPage * itemsPerPage < dataPro.length) {
    currentPage++;
    showData();
  }
}

showData();

function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.setItem("product", JSON.stringify(dataPro));
  showData();
}

function updateData(i) {
  submit.innerHTML = "Update";
  submit.classList.toggle("edit");
  clearErrors();
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  ads.value = dataPro[i].ads;
  discount.value = dataPro[i].discount;
  getTotal();
  count.value = dataPro[i].count;
  category.value = dataPro[i].category;

  submit.onclick = function () {
    let newPro = {
      title: title.value,
      price: price.value,
      taxes: taxes.value ? taxes.value : 0,
      ads: ads.value ? ads.value : 0,
      discount: discount.value ? discount.value : 0,
      total: total.innerHTML,
      count: count.value,
      category: category.value,
    };
    dataPro[i] = newPro;
    localStorage.setItem("product", JSON.stringify(dataPro));
    clearData();
    showData();
    submit.innerHTML = "create";
    submit.classList.toggle("edit");
    getTotal();

    submit.onclick = function () {
      clearErrors();
      let newPro = {
        title: title.value,
        price: price.value,
        taxes: taxes.value ? taxes.value : 0,
        ads: ads.value ? ads.value : 0,
        discount: discount.value ? discount.value : 0,
        total: total.innerHTML,
        count: count.value,
        category: category.value,
      };

      if (newPro.count > 1) {
        for (let i = 0; i < newPro.count; i++) {
          dataPro.push(newPro);
        }
      } else {
        dataPro.push(newPro);
      }

      localStorage.setItem("product", JSON.stringify(dataPro));
      clearData();
      showData();
    };
  };
}

search.addEventListener("input", function () {
  let searchValue = search.value.toLowerCase();
  let table = "";
  let filteredData = dataPro.filter(
    (item) =>
      item.title.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue)
  );
  currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  for (let i = 0; i < paginatedData.length; i++) {
    table += `
          <tr>
              <td>${startIndex + i + 1}</td>
              <td>${paginatedData[i].title}</td>
              <td>${paginatedData[i].price}</td>
              <td>${paginatedData[i].taxes}</td>
              <td>${paginatedData[i].ads}</td>
              <td>${paginatedData[i].discount}</td>
              <td>${paginatedData[i].total}</td>
              <td>${paginatedData[i].category}</td>
              <td><button id="update" onclick="updateData(${dataPro.indexOf(
                paginatedData[i]
              )})">Update</button></td>
              <td><button id="delete" onclick="deleteData(${dataPro.indexOf(
                paginatedData[i]
              )})">Delete</button></td>
          </tr>
      `;
  }
  if (filteredData.length == 0) {
    document.getElementById("pageNumber").innerText = `No data found`;
    document.getElementById("pageNumber").classList.add("notFound");
  } else {
    document.getElementById("pageNumber").innerText = `${currentPage}`;
    document.getElementById("pageNumber").classList.remove("notFound");
  }
  document.getElementById("tbody").innerHTML = table;

  let prev = document.getElementById("prev");
  let next = document.getElementById("next");

  if (currentPage === 1) {
    prev.style.display = "none";
  } else {
    prev.style.display = "block";
  }

  if (
    paginatedData.length < itemsPerPage ||
    currentPage * itemsPerPage >= filteredData.length
  ) {
    next.style.display = "none";
  } else {
    next.style.display = "block";
  }
});

title.addEventListener("input", () => validateTitle());
price.addEventListener("input", () => validatePrice());
count.addEventListener("input", () => validateCount());
category.addEventListener("input", () => validateCategory());

function validateTitle() {
  if (title.value.trim() === "") {
    title.classList.add("invalid");
    titleError.style.display = "block";
    titleError.textContent = "Title is required.";
  } else {
    title.classList.remove("invalid");
    titleError.style.display = "none";
  }
}

function validatePrice() {
  if (price.value.trim() === "" || isNaN(price.value) || +price.value <= 0) {
    price.classList.add("invalid");
    priceError.style.display = "block";
    priceError.textContent = "Valid price is required.";
  } else {
    price.classList.remove("invalid");
    priceError.style.display = "none";
  }
}

function validateCount() {
  if (count.value.trim() === "" || isNaN(count.value) || +count.value <= 0) {
    count.classList.add("invalid");
    countError.style.display = "block";
    countError.textContent = "Valid count is required.";
  } else {
    count.classList.remove("invalid");
    countError.style.display = "none";
  }
}

function validateCategory() {
  if (category.value.trim() === "") {
    category.classList.add("invalid");
    categoryError.style.display = "block";
    categoryError.textContent = "Category is required.";
  } else {
    category.classList.remove("invalid");
    categoryError.style.display = "none";
  }
}
