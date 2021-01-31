## sql

### oprators and functions:
	|| => joining two string,
	CONCAT() => join two strings,
	LOWER() => lower case string,
	LENGTH() => number of charactor in string,
	UPPER() => upper case charactor in string,
	<> => are the values not equal?
	!= are the values not equal

### RENAME COLUMN

	ALTER TABLE tableName 
	RENAME COLUMN prevColumnName TO newColumnName;

### relationship:
	=> one-to-many relationship
	=> many-to-one relationship
	=> one-to-one relationship
	=> many-to-many relationship

### on delete option:
	on delete restrict -> throw an error
	on delete no action -> throw an error
	on delete cascade -> delete the photo too!
	on delete set NULL -> set the "user_id" of the photo to "NULL"
	on delete set default -> set the "user_id" of the photo to a default value, if one is provided

### commands:
	CREATE TABLE photos (
	id SERIAL PRIMARY KEY,
	url VARCHAR(200),
	user_id INTEGER REFERENCES users(id)
	);
	 
	INSERT INTO photos (url, user_id)
	VALUES
	('http:/one.jpg', 4),
	('http:/two.jpg', 1),
	('http:/25.jpg', 1),
	('http:/36.jpg', 1),
	('http:/754.jpg', 2),
	('http:/35.jpg', 3),
	('http:/256.jpg', 4);

### JOIN:
	by default: inner join
	join, left join, right join, full join
	example: 	
		select u.id as user_id, comments.id 
		from users as u
		join comments on comments.user_id = u.id;

### aggregates:

	count() -> returns the number of values in a group of values
	sum() -> finds the sum of a group of numbers
	avg() -> finds the average of a group of numbers 
	min()/max() -> min and max value in column
	example:
		select column1, max(column2) as column_name from table group by column1;

		to count all rows: select count(*) from table;
		note: group by is used with aggregations..

### grouping with join:
	select table1column , count(*)
	from table2
	join table1 on table1.id = table2.table1_id
	group by table1.table1column;

	example:
		select manufacturer, sum(price * units_sold) 
		from phones
		group by manufacturer
		having sum(price * units_sold) > 2000000;

### sorting:
	order by, limit, offset

### union:
	(query1) union (query2);
	similar keywords:
		union all -> join together the results of two queries
		intersect -> find the rows common in the results of two queries
		intersect all -> find the rows common in the results of two queries
		except -> find the rows that are present in first query but not second query. Remove duplicates
		except all -> find the rows that are present in first query but not second query.

### subquery:
	examples:

	- SELECT name, price
		FROM products
		WHERE price > ( 
		  SELECT max(price) FROM products WHERE department = 'Toys'
		);
	- select price , ( 
			select price FROM products WHERE id = 3  // query must be return single value
		 ) as id_price
		 FROM products 
		 WHERE price > 889;
	- SELECT max(p.avg_price) AS max_avarage_price
		FROM (
		SELECT avg(price) AS avg_price FROM phones group by manufacturer
	) AS p; // must be given alias otherwise error throws..
	select name , price
	from phones
	where price > (
	    select price as p from phones where name = 'S5620 Monte'
	);


	operator in where clause -> structure of data the subquery must return
	> 			-> single value
	< 			-> single value
	>= 			-> single value
	<= 			-> single value
	= 			-> single value 
	<> or != 	-> single value
	IN 			-> single column
	NOT IN 		-> single column
	> ALL 		-> single column
	< ALL 		-> single column
	>= ALL 		-> single column
	<= ALL 		-> single column
	= ALL 		-> single column
	<> ALL 		-> single column
	> SOME 		-> single column
	< SOME 		-> single column
	>= SOME 	-> single column
	<= SOME 	-> single column
	= SOME 		-> single column
	<> SOME 	-> single column

	example:
	- select name 
	from phones 
	where price > ALL (
	    select price from phones where manufacturer = 'Samsung'
	);

### correlated Subqueries:

	- SELECT name, price, department
	FROM products as p1
	WHERE p1.price = ( 
	  SELECT max(price) FROM products as p2 WHERE p2.department = p1.department
	);


	- SELECT name, ( 
	  SELECT COUNT(*) FROM orders as o WHERE o.product_id = p.id
	) FROM products as p;

### FROM LESS subqueries:

	- select (
		select max(price) from products // must return single value
	) / (
		select min(price) from products // must return single value
	);

	- select (
	    select max(price) from phones
	) as max_price, (
	    select min(price) from phones
	) as min_price, (
	    select avg(price) from phones
	) as avg_price;
					
### utility function or keywords:
	greatest()
		- select greatest(1,2,3,4,5);
		- select name, weight, greatest(30, 2 * weight) from products;
	least()
		- select least(1,2,3,45,5)
	CASE ,WHEN, THEN, ELSE, END
		SELECT name, price, 
		  CASE 
		    WHEN price > 600 THEN 'high'
		    WHEN price < 300 THEN 'medium'
		    ELSE 'cheap'
		  END
		FROM products;

