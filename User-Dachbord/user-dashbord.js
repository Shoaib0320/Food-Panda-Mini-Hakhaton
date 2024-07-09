// user-dashbord.js

document.addEventListener('DOMContentLoaded', () => {
    const restaurantDropdown = document.getElementById('restaurantDropdown');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const categoryContainer = document.getElementById('categoryContainer');
    const itemsContainer = document.getElementById('itemsContainer');

    function populateDropdown(dropdown, options) {
        dropdown.innerHTML = '<option selected disabled>Select</option>';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            dropdown.appendChild(opt);
        });
    }

    function loadRestaurants() {
        const restaurants = JSON.parse(localStorage.getItem('restaurants')) || {};
        populateDropdown(restaurantDropdown, Object.keys(restaurants));
    }

    function loadCategories(restaurant) {
        const restaurants = JSON.parse(localStorage.getItem('restaurants')) || {};
        const categories = Object.keys(restaurants[restaurant] || {});
        populateDropdown(categoryDropdown, categories);
        categoryDropdown.disabled = categories.length === 0;
    }

    function createCard(item, index, category, restaurant) {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">ID: ${item.id}</h5>
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text"><small class="text-muted">Price: ${item.price}</small></p>
                   <a href="./item-details.html"><button class="btn btn-primary add-to-cart" data-index="${index}" data-category="${category}" data-restaurant="${restaurant}">Add to Cart</button></a>
                </div>
            </div>`;
        itemsContainer.querySelector('.row').appendChild(card);
    }

    function loadItems(restaurant, category) {
        const restaurants = JSON.parse(localStorage.getItem('restaurants')) || {};
        const items = restaurants[restaurant][category] || [];
        itemsContainer.innerHTML = '';

        // Create category heading
        const heading = document.createElement('h2');
        heading.textContent = category;
        categoryContainer.innerHTML = '';
        categoryContainer.appendChild(heading);

        const row = document.createElement('div');
        row.className = 'row';
        itemsContainer.appendChild(row);

        items.forEach((item, index) => createCard(item, index, category, restaurant));
    }

    restaurantDropdown.addEventListener('change', () => {
        const selectedRestaurant = restaurantDropdown.value;
        loadCategories(selectedRestaurant);
        itemsContainer.innerHTML = '';
        categoryContainer.innerHTML = '';
    });

    categoryDropdown.addEventListener('change', () => {
        const selectedRestaurant = restaurantDropdown.value;
        const selectedCategory = categoryDropdown.value;
        loadItems(selectedRestaurant, selectedCategory);
    });

    itemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const index = button.getAttribute('data-index');
            const category = button.getAttribute('data-category');
            const restaurant = button.getAttribute('data-restaurant');

            const restaurants = JSON.parse(localStorage.getItem('restaurants')) || {};
            const item = restaurants[restaurant][category][index];

            if (item) {
                const itemDetail = { index, category, restaurant };
                localStorage.setItem('itemDetail', JSON.stringify(itemDetail));
                window.location.href = 'itemdetails.html';
            }
        }
    });

    loadRestaurants();
});
