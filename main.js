(() => {
    const LOCAL_STORAGE_KEY = "lcw_favorites";
    const PRODUCT_STORAGE_KEY = "lcw_products";
    const API_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";

    let favorites = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    let products = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY));

    const init = async () => {
        addStyles();
        products = await fetchProducts();
        buildHTML(products);
        setEvents();
    };

    const fetchProducts = async () => {
        if (products) return products;
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Network error");
            products = await response.json();
            localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    };

    const buildHTML = (products) => {
        if (!products.length) return;

        const html = `
            <div class="custom-carousel">
                <h2>You Might Also Like</h2>
                <div class="carousel-wrapper">
                    <button class="carousel-button prev">&#10094;</button>
                    <div class="carousel-items">${products.map(product => `
                        <div class="carousel-item">
                            <div class="heart-container">
                                <span class="heart-icon ${favorites[product.id] ? 'favorited' : ''}" data-id="${product.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
                                    </svg>
                                </span>
                            </div>
                            <img src="${product.img}" alt="${product.name}" onclick="window.open('${product.url}', '_blank')" />
                            <p class="product-name">${product.name}</p>
                            <span class="product-price">${product.price.toFixed(2)} TL</span>
                        </div>
                    `).join('')}</div>
                    <button class="carousel-button next">&#10095;</button>
                </div>
            </div>`;

        document.querySelector(".product-detail").insertAdjacentHTML("afterend", html);
    };

    const addStyles = () => {
        const css = `
            .custom-carousel { text-align: left; margin-top: 20px; padding-left: 10px; }
            .carousel-wrapper { display: flex; align-items: center; position: relative; }
            .carousel-items { display: flex; overflow-x: auto; gap: 10px; padding: 10px; scroll-behavior: smooth; }
            .carousel-item { min-width: 250px; max-width: 300px; cursor: pointer; border: 1px solid #ccc; text-align: left; background: #fff; display: flex; flex-direction: column; position: relative; justify-content: space-between; }
            .carousel-item img { width: 100%; height: auto; border-radius: 5px; }
            .product-name { font-size: 14px; white-space: normal; overflow: hidden; text-overflow: ellipsis; word-wrap: break-word; margin-top: 5px; }
            .product-price { display: block; font-weight: bold; margin-top: 5px; color: rgb(25, 61, 176);}
            .heart-container { position: absolute; top: 5px; right: 5px; }
            .heart-icon { font-size: 20px; cursor: pointer; color: #d3d3d3; }
            .heart-icon.favorited { color: rgb(25, 61, 176); }
            .carousel-button { background: none; border: none; font-size: 24px; cursor: pointer; padding: 10px; }
    
            /* Responsive Styles */
            @media (max-width: 1024px) {
                .carousel-items { gap: 5px; }
                .carousel-item { min-width: 220px; max-width: 250px; }
                .product-name { font-size: 12px; }
                .product-price { font-size: 14px; }
                .heart-icon { font-size: 18px; }
            }
    
       
    
            @media (max-width: 480px) {
                .carousel-items { gap: 3px; padding: 5px; }
                .carousel-item { min-width: 150px; max-width: 180px; }
                .product-name { font-size: 11px; }
                .product-price { font-size: 12px; }
                .heart-container { top: 2px; right: 2px; }
                .heart-icon { font-size: 14px; }
            }
        `;
        document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
    };
    

    const setEvents = () => {
        document.querySelector(".prev").addEventListener("click", () => {
            document.querySelector(".carousel-items").scrollBy({ left: -250, behavior: "smooth" });
        });

        document.querySelector(".next").addEventListener("click", () => {
            document.querySelector(".carousel-items").scrollBy({ left: 250, behavior: "smooth" });
        });

        document.querySelectorAll(".heart-icon").forEach(icon => {
            icon.addEventListener("click", (event) => {
                event.stopPropagation();
                const id = event.currentTarget.dataset.id;
                favorites[id] = !favorites[id];
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
                event.currentTarget.classList.toggle("favorited", favorites[id]);
            });
        });
    };

    init();
})();