import requests
from bs4 import BeautifulSoup
import json

# Headers to mimic a browser visit (to avoid being blocked)
HEADERS = {
"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
}

def scrape_amazon_products(search_query, max_results=10):
    """Scrapes Amazon for products based on a search query."""
    base_url = "https://www.amazon.in/s"
    params = {"k": search_query}
    response = requests.get(base_url, headers=HEADERS, params=params)
    response.raise_for_status()

    soup = BeautifulSoup(response.content,'html.parser')
    products = []

    i = 0
    names = soup.findAll(class_="a-size-base-plus a-color-base a-text-normal")
    prices = soup.findAll(class_="a-price-whole")
    print(names)
    for i in range(max_results):
        name = names[i]
        price = prices[i]
        if name and price:
            product = {
                "name": name.get_text(strip=True),
                "price": float(price.get_text(strip=True).replace(",", "")),
                "category": search_query,
                "sku": f"{search_query}-{i}"
            }
            products.append(product)
    return products

if __name__ == "__main__":
    product_data = []
    categories = ['Electronics','Clothing','Furniture','Toys']
    for category in categories:
        data = scrape_amazon_products(category)
        product_data.extend(data)
        
    
    # Save data as JSON
    with open("amazon_products.json", "w") as f:
        json.dump(product_data, f, indent=4)
    print(f"Saved {len(product_data)} products to amazon_products.json")
