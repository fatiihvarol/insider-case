(function () {
    if (!document.querySelector(".product-detail")) return;

    const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
    const LOCAL_STORAGE_KEY = "lcw_favorites";
    const PRODUCT_STORAGE_KEY = "lcw_products";

    let favorites = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    let products = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY));

    async function fetchProducts() {
        if (products) return products;
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Network response was not ok");
            products = await response.json();
            localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    function createCarousel(products) {
        if (!products.length) return;

        const carouselContainer = document.createElement("div");
        carouselContainer.className = "custom-carousel";

        const title = document.createElement("h2");
        title.innerText = "You Might Also Like";
        carouselContainer.appendChild(title);

        const productList = document.createElement("div");
        productList.className = "carousel-items";

        products.forEach(product => {
            const item = document.createElement("div");
            item.className = "carousel-item";

            const img = document.createElement("img");
            img.src = product.img;
            img.alt = product.name;
            img.onclick = () => window.open(product.url, "_blank");

            const name = document.createElement("p");
            name.innerText = product.name;

            const price = document.createElement("span");
            price.innerText = `${product.price.toFixed(2)} TL`;

            const heart = document.createElement("span");
            heart.className = "heart-icon";
            heart.innerHTML = favorites[product.id] ? "&#x1F499;" : "&#x2661;";
            heart.onclick = (event) => {
                event.stopPropagation();
                favorites[product.id] = !favorites[product.id];
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
                heart.innerHTML = favorites[product.id] ? "&#x1F499;" : "&#x2661;";
            };

            item.appendChild(img);
            item.appendChild(name);
            item.appendChild(price);
            item.appendChild(heart);
            productList.appendChild(item);
        });

        carouselContainer.appendChild(productList);
        document.querySelector(".product-detail").after(carouselContainer);
    }

    function addStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
            .custom-carousel { text-align: center; margin-top: 20px; }
            .carousel-items { display: flex; overflow-x: auto; gap: 10px; padding: 10px; }
            .carousel-item { min-width: 150px; cursor: pointer; border: 1px solid #ccc; padding: 10px; text-align: center; }
            .carousel-item img { width: 100%; height: auto; border-radius: 5px; }
            .heart-icon { font-size: 20px; cursor: pointer; display: block; margin-top: 5px; }
        `;
        document.head.appendChild(style);
    }

    async function init() {
        addStyles();
        const products = await fetchProducts();
        createCarousel(products);
    }

    init();
})();