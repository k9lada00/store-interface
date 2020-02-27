# store-interface
Graded Exercise: Web Interfaces/Hybrid Application Development



All users both logged in and not logged in can search all products. Products can be searched all at once, or by category, location, and date. Individual products can be retrieved by their Product Id. 



GET /search

Compiles a list of all products and displays their id, title, and asking price along with a link to view all details of the product. 



GET /search/"Product Id"

Compiles all posted information about a specific product. It lists the Product's id, title, description, category, location, images, asking price, sate of posting, delivery type, the seller's name, and the seller's contact info.



GET /search/category

Headers(1): 
KEY: "Content-Type", VALUE: "application/json"

Body: 
"raw", "JSON"

{

	"category": "category name"
	
}

Compiles a list of all products in the chosen category. It lists the product's id, title, category, and asking price along with a link to view all details of the product. All other product's not listed in the chosen category will be listed as "null".



GET /search/location

Headers(1): 
KEY: "Content-Type", VALUE: "application/json"

Body: 
"raw", "JSON"

{

	"location": "country name"
	
}

Compiles a list of all products in the chosen country. It lists the product's id, title, country, and asking price along with a link to view all details of the product. All other product's not listed in the chosen country will be listed as "null".



GET /search/date

Headers(1): 
KEY: "Content-Type", VALUE: "application/json"

Body: 
"raw", "JSON"

{

	"dateOfPosting": "DD MON YYYY"
	
}

Compiles a list of all products in the chosen date of posting. It lists the product's id, title, date of posting, and asking price along with a link to view all details of the product. All other product's not listed in the chosen date of posting will be listed as "null". The date must be listed in the DAY-MONTH-YEAR format (the month must be in all CAPS, with its abbreviated name: JAN, FEB, MAR, etc.). For example: "20 FEB 2020".



POST /users/signup

Headers(1): 
KEY: "Content-Type", VALUE: "application/json"

Body: 
"raw", "JSON"

{

	"username": "user's username",
	
	"firstLastName": "user's first and last name",
	
	"dateOfBirth": "DD MON YYYY", 
	
	"userCC": "City, Country", 
	
	"userEmail": "user-email@email.fi", 
	
	"userPass": "user's password"
	
}

Registers a new user to the database. The user's information will be returned with the user Id. 



POST /users/login

Headers(1): 
KEY: "Content-Type", VALUE: "application/json"

Body: 
"raw", "JSON"

{

	"username": "user's username",
	
	"userPass": "user's password"
	
}

The user will recieve a token that will allow them to navigate the store interface for one hour before expiration.



PATCH /users/"User Id"

Headers(2): KEY: "Content-Type", VALUE: "application/json"



DELETE /users/"User Id"

Headers(2): 
KEY: "Content-Type", VALUE: "application/json" 
KEY: "Authorization", VALUE: "Bearer 'token'"

