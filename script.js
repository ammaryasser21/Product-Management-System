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

let titleError = document.getElementById("titleError");
let priceError = document.getElementById("priceError");
let taxesError = document.getElementById("taxesError");
let adsError = document.getElementById("adsError");
let discountError = document.getElementById("discountError");
let countError = document.getElementById("countError");
let categoryError = document.getElementById("categoryError");

function getTotal() {
  if (price.value != '') {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = `${result}`;
    total.style.backgroundColor = "#040";
  } else {
    total.innerHTML = '';
    total.style.backgroundColor = "rgb(117, 30, 30)";
  }
}

// Add event listeners to input fields to call getTotal function on value change
price.addEventListener('input', getTotal);
taxes.addEventListener('input', getTotal);
ads.addEventListener('input', getTotal);
discount.addEventListener('input', getTotal);

// Initialize total
getTotal();

let dataPro;
if (localStorage.product != null) {
  dataPro = JSON.parse(localStorage.product);
} else {
  dataPro = [];
}

submit.onclick = function () {
  // Clear previous errors
  clearErrors();

  // Validate inputs
  let isValid = validateInputs();

  if (isValid) {
    let newPro = {
      title: title.value,
      price: price.value,
      taxes: taxes.value,
      ads: ads.value,
      discount: discount.value,
      total: total.innerHTML.split(' ')[1], // Extract the number part
      count: count.value,
      category: category.value
    };

    // Add multiple entries if count is greater than 1
    if (newPro.count > 1) {
      for (let i = 0; i < newPro.count; i++) {
        dataPro.push(newPro);
      }
    } else {
      dataPro.push(newPro);
    }

    localStorage.setItem('product', JSON.stringify(dataPro));
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
  if (taxes.value.trim() === "" || isNaN(taxes.value) || +taxes.value < 0) {
    taxes.classList.add("invalid");
    taxesError.style.display = "block";
    taxesError.textContent = "Valid taxes are required.";
    isValid = false;
  }
  if (ads.value.trim() === "" || isNaN(ads.value) || +ads.value < 0) {
    ads.classList.add("invalid");
    adsError.style.display = "block";
    adsError.textContent = "Valid ads are required.";
    isValid = false;
  }
  if (discount.value.trim() === "" || isNaN(discount.value) || +discount.value < 0) {
    discount.classList.add("invalid");
    discountError.style.display = "block";
    discountError.textContent = "Valid discount is required.";
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
  let inputs = [title, price, taxes, ads, discount, count, category];
  let errors = [titleError, priceError, taxesError, adsError, discountError, countError, categoryError];

  inputs.forEach(input => input.classList.remove("invalid"));
  errors.forEach(error => error.style.display = "none");
}

function clearData() {
  title.value = '';
  price.value = '';
  taxes.value = '';
  ads.value = '';
  discount.value = '';
  total.innerHTML = '0';
  count.value = '';
  category.value = '';
}

function showData() {
  let table = '';
  for (let i = 0; i < dataPro.length; i++) {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button id="update" onclick="updateData(${i})">Update</button></td>
        <td><button id="delete" onclick="deleteData(${i})">Delete</button></td>
      </tr>
    `;
  }
  document.getElementById('tbody').innerHTML = table;
}
showData();

function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.setItem('product', JSON.stringify(dataPro));
  showData();
}

function updateData(i) {
  clearErrors();
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  ads.value = dataPro[i].ads;
  discount.value = dataPro[i].discount;
  getTotal();
  count.value = dataPro[i].count;
  category.value = dataPro[i].category;

  // Update the submit button to save the updated product
  submit.onclick = function () {
    let newPro = {
      title: title.value,
      price: price.value,
      taxes: taxes.value,
      ads: ads.value,
      discount: discount.value,
      total: total.innerHTML.split(' ')[1],
      count: count.value,
      category: category.value
    };
    dataPro[i] = newPro;
    localStorage.setItem('product', JSON.stringify(dataPro));
    clearData();
    showData();

    // Restore the original submit function
    submit.onclick = function () {
      clearErrors();
      let newPro = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML.split(' ')[1],
        count: count.value,
        category: category.value
      };

      if (newPro.count > 1) {
        for (let i = 0; i < newPro.count; i++) {
          dataPro.push(newPro);
        }
      } else {
        dataPro.push(newPro);
      }

      localStorage.setItem('product', JSON.stringify(dataPro));
      clearData();
      showData();
    };
  };
}

// Real-time search functionality
search.addEventListener('input', function () {
  let searchValue = search.value.toLowerCase();
  let table = '';
  for (let i = 0; i < dataPro.length; i++) {
    if (dataPro[i].title.toLowerCase().includes(searchValue) || dataPro[i].category.toLowerCase().includes(searchValue)) {
      table += `
        <tr>
          <td>${i + 1}</td>
          <td>${dataPro[i].title}</td>
          <td>${dataPro[i].price}</td>
          <td>${dataPro[i].taxes}</td>
          <td>${dataPro[i].ads}</td>
          <td>${dataPro[i].discount}</td>
          <td>${dataPro[i].total}</td>
          <td>${dataPro[i].category}</td>
          <td><button id="update" onclick="updateData(${i})">Update</button></td>
          <td><button id="delete" onclick="deleteData(${i})">Delete</button></td>
        </tr>
      `;
    }
  }
  document.getElementById('tbody').innerHTML = table;
});


// Add real-time validation event listeners
title.addEventListener('input', () => validateTitle());
price.addEventListener('input', () => validatePrice());
taxes.addEventListener('input', () => validateTaxes());
ads.addEventListener('input', () => validateAds());
discount.addEventListener('input', () => validateDiscount());
count.addEventListener('input', () => validateCount());
category.addEventListener('input', () => validateCategory());

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

function validateTaxes() {
  if (taxes.value.trim() === "" || isNaN(taxes.value) || +taxes.value < 0) {
    taxes.classList.add("invalid");
    taxesError.style.display = "block";
    taxesError.textContent = "Valid taxes are required.";
  } else {
    taxes.classList.remove("invalid");
    taxesError.style.display = "none";
  }
}

function validateAds() {
  if (ads.value.trim() === "" || isNaN(ads.value) || +ads.value < 0) {
    ads.classList.add("invalid");
    adsError.style.display = "block";
    adsError.textContent = "Valid ads are required.";
  } else {
    ads.classList.remove("invalid");
    adsError.style.display = "none";
  }
}

function validateDiscount() {
  if (discount.value.trim() === "" || isNaN(discount.value) || +discount.value < 0) {
    discount.classList.add("invalid");
    discountError.style.display = "block";
    discountError.textContent = "Valid discount is required.";
  } else {
    discount.classList.remove("invalid");
    discountError.style.display = "none";
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