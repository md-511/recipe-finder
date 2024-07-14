const input_element = document.getElementById("search-box");
const btn_element = document.getElementById("search-btn");
const items_class = document.querySelector(".items");
const current_element = document.querySelector(".current");
const close_btn = document.getElementById("close-btn");
const quick_links = document.querySelectorAll(".nav-bar li");

const text_emojis = ["(⊙_⊙)？", "ㄟ( ▔, ▔ )ㄏ", "━┳━　━┳━", "＼（〇_ｏ）／", "(* ￣︿￣)"];

btn_element.addEventListener("click", async () => {
    let input = input_element.value.trim();
    if (input != "") {
        const data = await call_search_api(input);
        show_meals(data.meals);
    }
});

function show_meals(meals) {
    items_class.innerHTML = '';
    if (meals) {
        meals.forEach((meal) => {
            let name = String(meal.strMeal);
            if (name.length > 30) {
                name = name.substring(0, 30);
                name += "...";
            }
            const meal_card = document.createElement("div");
            meal_card.className = "item-content";
            meal_card.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                   <h3>${name}</h3>`;
            meal_card.dataset.id = meal.idMeal;
            meal_card.classList.add("items");
            items_class.appendChild(meal_card);
        });
        const meals_elements = document.getElementsByClassName("item-content");
        // console.log();
        for (let i = 0 ; i < meals_elements.length ; i++) {
            const ele = meals_elements[i];
            ele.addEventListener('click', async () => {
                const data = await get_details(ele.dataset.id);
                // console.log(data.meals);
                show_details(data.meals[0]);
            });
        }
    } else {
        let rnd_idx = Math.floor(Math.random() * text_emojis.length)  ;
        let text_emoji = text_emojis[rnd_idx];
        items_class.innerHTML = `<p>${text_emoji}  Try Something Else</p>`;
    }
}

async function call_search_api(name) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error Occured: ", error);
    }
}

// TODO: 

async function get_details(id) {
    try {
        // console.log(id);
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error Occured: ", error);
    }
}

function show_details(data) { 
    console.log(data);
    current_element.childNodes.forEach((node) => {
        let tag = String(node.tagName);
        if (tag.toLowerCase() != 'button') {
            current_element.removeChild(node);
        }
    });

    const content_div = document.createElement("div");
    content_div.className = "content-div";
    content_div.innerHTML = `<h2>${data.strMeal}</h2>
                             <img src="${data.strMealThumb}", alt="${data.strMeal}">
                             <h3>How to Cook</h3>
                             <p>${data.strInstructions}</p>
                             <a href="${data.strYoutube}" target="_blank">Video Tutorial</a>`;

    current_element.appendChild(content_div);
    current_element.style.display = "block";
}

close_btn.addEventListener("click", () => {
    current_element.style.display = "none";
})

window.addEventListener('load', async () => {
    try {
        // const m1 = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        // const m2 = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        // const m3 = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        // const m4 = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        // const m5 = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        // const m6 = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        // const jm1 = await m1.json();
        // const jm2 = await m2.json();
        // const jm3 = await m3.json();
        // const jm4 = await m4.json();
        // const jm5 = await m5.json();
        // const jm6 = await m6.json();
        // // console.log(jm1);
        // a.push(jm1.meals[0]);
        // a.push(jm2.meals[0]);
        // a.push(jm3.meals[0]);
        // a.push(jm4.meals[0]);
        // a.push(jm5.meals[0]);
        // a.push(jm6.meals[0]);

        const fetchPromises = [
            fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
            fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
            fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
            fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
            fetch("https://www.themealdb.com/api/json/v1/1/random.php"),
            fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        ];

        const responses = await Promise.all(fetchPromises);
        const jsonPromises = responses.map(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        });

        const mealsData = await Promise.all(jsonPromises);
        const meals = mealsData.map(data => data.meals[0]);

        show_meals(meals);

    } catch (error) {
        console.error("Error Occured: ", error);
    }
    // show_meals(a);
});

quick_links.forEach((link) => {
    link.addEventListener("click", async () => {
        if (link.textContent != "All Meals") {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${link.textContent}`);
                const data = await response.json();
                show_meals(data.meals);
            } catch (error) {
                console.error("Error Occured: ", error);
            }
        } else {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${link.textContent}`);
                const data = await response.json();
                show_meals(data.meals);
            } catch (error) {
                console.error("Error Occured: ", error);
            }
        }
    });
});
