# store-interface
Graded Exercise: Web Interfaces/Hybrid Application Development



All users both logged in and not logged in can search all products. Products can be searched all at once, or by category, location, and date. Individual products can be retrieved by their Product Id. 



GET /search

Compiles a list of all products and displays their id, title, and asking price along with a link to view all details of the product. 



GET /search/"Product Id"

Compiles all posted information about a specific product. It lists the Product's id, title, description, category, location, images, asking price, sate of posting, delivery type, the seller's name, and the seller's contact info.



GET /search/category

Headers: KEY: "Content-Type", VALUE: "application/json"

Body: "raw", "JSON"

{
	"category": "category name"
}

Explanation 



GET /search/location

Explanation



GET /search/date

Explanation



POST /users

Explanation
