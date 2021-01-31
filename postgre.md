## validation
	numbers without decimal points:
		- smallint, integer, biginteger

	no, decimal point auto increment:
		- smallserial, serial, bigserial

	numbers with decimal points:
		- decimal, numeric, real, double precision, float

	point:
		point data type is for location. it stores x,y cordinates of the plain.

	BOOLEAN:
		- true, yes, on, 1, t, y
		- false, no, off, 0, f, n
		- NULL

	INTERVEL(duration of time):
		day -> day, D -> day, D M S -> day minute second

	examples:
		(10::INTEGER) -> integer type
		('10 nov 2001'::DATE) -> date type
		('10:23 PM'::TIME) -> time type


### CHECK
	A check can only work on the row we are adding/updating.
	syntax:
		create table tablename(
			column1 serial primary key,
			column2 integer CHECK (column2 > 0)
		);

### schema designer tools
	- dbdiagram.io
	- drawsql.app
	- sqldbm.com
	- quickdatabasediagrams.com
	- ondras.zarovi.cz/sql/demo

### design a like system
	
	use diffrent table for reaction and add id's of user and post and type of reaction this would be flexible and easy to maintain. relationship between post and the user.

### polymorphic Association Alternate implementation
	
	COALESCE(...args):
		it returns first non null value provided in it as arguments.

	example:
		ADD CHECK of (
			COALESCE((post_id)::BOOLEAN::INTEGER,0)
			+
			COALESCE((comment_id)::BOOLEAN::INTEGER,0)
		) = 1

### TAGS:
	user_id and photo_id can be used as columns to target tags.
	hashtags -> use different relation table to boost performance. 

### follower table
	CONDITION:
		CHECK(leader_id <> follower_id)
		UNIQUE (leader_id , follower_id)

### postgre internal commands
	-- to show directory in system where all postgre data stored
	SHOW data_directory;

	-- to get folder_name which is a oid for pg_database where database data stored for the database name (datname)
	SELECT oid,datname FROM pg_database;

	SELECT * FROM pg_class;

Heap or Heap file -> File that contains all the data (rows) of our table

Tuple or Item -> Individual row from the table

Block or Page -> The heap file is divided into many different 'blocks' or 'pages'. Each page/block stores some number of rows

### QUERY EXECUTION TIME

	EXPLAIN ANALYZE SELECT * 
	FROM users WHERE username = "something"

### INDEX
	index are good for searching it may boost performance but it has downside too. it can slows down insert/update/delete performance and it also takes extra space in harddrive. 

	B-tree -> general purpose index. 99% of the time you want this

	Hash -> Speeds up simple equality checks

	GiST -> Geometry, full-text search

	SP-GiST -> clustered data, such as dates - many rows might have the same year

	GIN -> For columns that contain arrays or JSON data 

	BRIN -> Specialized for really large datasets

	TO CHECK ALL CREATED INDEX IN DATABASE, run:

	SELECT relname, relkind 
	FROM pg_class 
	WHERE relkind = 'i';

### keywords
	for performance analyze..

	EXPLAIN -> build a query plan and display info about it
	EXPLAIN ANALYZE -> build a query plan, run it, and info about it

### WITH (CTE-> COMMON TABLE EXPRESSION)

	WITH tags AS (
		SELECT user_id , post_id, created_at FROM caption_tags
		UNION ALL
		SELECT user_id, post_id, created_at FROM photo_tags
	)

	SELECT username , tags.created_at
	FROM users 
	JOIN tags ON tags.user_id = users.id
	WHERE tags.created_at < '2010-01-07';


### WITH RECURSIVE (RECURSIVE CTE)
	union must be present in recursive CTE.
	
	WITH RECURSIVE tablename(...columns) AS (
		SELECT 5 AS val -- Intial, Non-recursive query
		UNION
		SELECT val - 1 FROM countdown WHERE val > 1 -- Recursive query 
	)

	SELECT * FROM tablename;

	example:
		WITH RECURSIVE suggestions(leader_id, follower_id, depth) AS (
			SELECT leader_id, follower_id, 1 AS depth
			FROM followers
			WHERE follower_id = 1000
			UNION
			SELECT followers.leader_id, followers.follower_id, depth + 1
			FROM followers
			JOIN suggestions ON suggestions.leader_id = followers.follower_id
			WHERE depth < 2
		)

		SELECT DISTINCT users.id, users.username
		FROM suggestions
		JOIN users ON users.id = suggestions.leader_id
		WHERE depth > 1 
		LIMIT 30;


### CREATE VIEW
	it creates fake table or merge table in database that can be used by other queries.

	CREATE VIEW tags AS (
		SELECT id, created_at, user_id, post_id, 'photo_tag' AS type FROM photo_tags 
		UNION ALL
		SELECT id, created_at, user_id, post_id, 'caption_tag' AS type FROM caption_tags
	);

	TO USE VIEW:

	SELECT * FROM tags;

	TO CHANGE VIEW:

	CREATE OR REPLACE VIEW tags AS (
		SELECT  created_at, user_id, post_id, 'photo_tag' AS type FROM photo_tags 
		UNION ALL
		SELECT  created_at, user_id, post_id, 'caption_tag' AS type FROM caption_tags
	);

	TO DELETE:

	DROP VIEW tags;

### SLOW QUERY
	mutiple join in single query:

	SELECT * FROM likes 
	LEFT JOIN posts ON posts.id = likes.post_id
	LEFT JOIN comments ON comments.id = likes.comment_id;

	=> date_trunc()
	SELECT date_trunc ('week', COALESCE(posts.created_at, comments.created_at)) AS week,
	COUNT(posts.id) AS num_posts,
	COUNT(comments.id) AS num_comments
	FROM likes
	LEFT JOIN posts ON posts.id = likes.post_id
	LEFT JOIN comments ON comments.id = likes.comment_id
	GROUP BY week
	ORDER BY week;

### METERIALIZED VIEW
	it run one time and save the result output in saparate so that we can use it again and again with executing the whole query.

	CREATE MATERIALIZED VIEW weekly_likes AS (
		SELECT date_trunc ('week', COALESCE(posts.created_at, comments.created_at)) AS week,
		COUNT(posts.id) AS num_posts,
		COUNT(comments.id) AS num_comments
		FROM likes
		LEFT JOIN posts ON posts.id = likes.post_id
		LEFT JOIN comments ON comments.id = likes.comment_id
		GROUP BY week
		ORDER BY week
	) WITH DATA;

	TO REFRESH METERIALIZED VIEW:

	REFRESH METERIALIZED VIEW weekly_likes;

### TRANSACTION 
	transction begin with the keyword BEGIN, it creates a diffrent workspace for the begin connection. and commit changes to main database only when COMMIT keyword executed, if before that any error occurs postgre will rollback or cleanup the begin transaction. otherwise ROLLBACK should be done manually.

	BEGIN;

	UPDATE accounts SET balance = 100;

	COMMIT;

	if error occurs:

	BEGIN;

	SELECT * FROM shkljahskl;

	ROLLBACK;


### MIGRATION 

	do not use schema migration and data migration together or same time.
	and also use transactions to migrate.

	if wanted to change x, y column to loc and copy data to it, steps to update table..

	first : add new nullable column to table with name loc.
	second : update api to put values in both x,y and loc column simentaneously.
	third : copy all x,y data to loc column.
	forth : update api to put values in only loc column. and make x,y nullable.
	fifth : drop the x,y column.
	
